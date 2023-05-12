import type { Logger } from "../support/Logger.types";

import { Github, throwIfJobFailed } from "./Github";
import type {
  GithubInterface,
  DispatchOptions,
  GetWorkflowsResponse,
  GetRunJobResponse,
  GetRunResponse,
  StepUUID,
  DownloadRunArtifactResponse,
} from "./Github.types";
import type {
  WorkflowsConstructor,
  WorkflowsConstructorOptions,
  WorkflowsInterface,
  WaitForTargetJobOptions,
} from "./Workflows.types";

export function findWorkflowWithPathEqualToLowercaseName(
  workflows: GetWorkflowsResponse["data"]["workflows"],
  workflowFileName: string
) {
  return workflows.find((workflow) =>
    workflow.path.toLowerCase().endsWith(workflowFileName.toLowerCase())
  );
}

export function findWorkflowWithPathEqualsToLowercaseNameReplacingDashes(
  workflows: GetWorkflowsResponse["data"]["workflows"],
  workflowFileName: string
) {
  return workflows.find((workflow) =>
    workflow.path.toLowerCase().endsWith(workflowFileName.toLowerCase().replaceAll("-", "_"))
  );
}

export function findWorkflowByName(
  workflows: GetWorkflowsResponse["data"]["workflows"],
  workflowFileName: string
) {
  return workflows.find(
    (workflow) => workflow.name.toLowerCase() === workflowFileName.toLowerCase()
  );
}

export const Workflows: WorkflowsConstructor = class Workflows implements WorkflowsInterface {
  private _githubClient: GithubInterface;
  private _timeoutJobCompleted: number;
  private _timeoutArtifactAvailable: number;
  private _requestInterval: number;
  private _logger: Logger;

  constructor({
    token,
    owner,
    project,
    timeoutJobCompleted,
    timeoutArtifactAvailable,
    requestInterval,
    logger,
  }: WorkflowsConstructorOptions) {
    this._githubClient = new Github({ token, owner, project, logger });
    this._timeoutArtifactAvailable = timeoutArtifactAvailable;
    this._timeoutJobCompleted = timeoutJobCompleted;
    this._requestInterval = requestInterval;
    this._logger = logger;
  }

  public async dispatch(options: DispatchOptions): Promise<void> {
    await this._githubClient.dispatchWorkflow(options);
    this._logger.info(`Workflow ${options.workflowId} dispatched`);
  }

  public async findWorkflowToDispatch(workflowFileName: string): Promise<number> {
    this._logger.info(
      `Searching workflow ${workflowFileName} in repository workflows list to dispatch`
    );
    const workflows = await this._githubClient.getWorkflows();
    this._logger.debug(`Workflows found: ${JSON.stringify(workflows.data.workflows)}`);
    const foundWorkflowId = this._findWorkflowIdInWorkflowsResponse(
      workflows.data.workflows,
      workflowFileName
    );
    return foundWorkflowId;
  }

  private _findWorkflowIdInWorkflowsResponse(
    workflows: GetWorkflowsResponse["data"]["workflows"],
    workflowFileName: string
  ): number {
    const foundWorkflow =
      findWorkflowWithPathEqualToLowercaseName(workflows, workflowFileName) ||
      findWorkflowWithPathEqualsToLowercaseNameReplacingDashes(workflows, workflowFileName) ||
      findWorkflowByName(workflows, workflowFileName);
    if (!foundWorkflow) {
      throw new Error(`Workflow ${workflowFileName} not found`);
    }
    this._logger.info(`Found workflow ${foundWorkflow.name} matching with ${workflowFileName}`);
    this._logger.debug(`Workflow ${workflowFileName} found. Id: ${foundWorkflow.id}`);
    return foundWorkflow.id;
  }

  private async _findJobInWorkflowRun(
    runId: number,
    stepUUID: StepUUID
  ): Promise<GetRunJobResponse | undefined> {
    const workflowJobs = await this._githubClient.getRunJobs({ runId });
    const foundWorkflow = workflowJobs.data.jobs.find((job) =>
      job.steps?.find((step) => step.name.includes(stepUUID))
    );
    return foundWorkflow;
  }

  private async _findJobInCompletedWorkflowRuns(
    workflowRuns: GetRunResponse["data"]["workflow_runs"],
    stepUUID: StepUUID
  ): Promise<GetRunJobResponse | undefined> {
    // TODO, check that the workflow is also successful?
    const completedRuns = workflowRuns.filter((run) => run.status === "completed");

    const runsJobsFound = await Promise.all(
      completedRuns.map((completedRun) => {
        return this._findJobInWorkflowRun(completedRun.id, stepUUID);
      })
    );

    return runsJobsFound.find((item) => !!item);
  }

  public waitForTargetJobToComplete({
    stepUUID,
    executedFrom,
  }: WaitForTargetJobOptions): Promise<GetRunJobResponse> | never {
    return new Promise((resolve, reject) => {
      let checkTimeout: NodeJS.Timeout;

      const rejectTimeout = setTimeout(() => {
        clearTimeout(checkTimeout);
        reject(new Error("Timed out while waiting for target job to complete"));
      }, this._timeoutJobCompleted);

      const requestWorkflows = () => {
        return this._githubClient.getRuns({
          runDateFilter: executedFrom,
        });
      };

      const waitAndCheckWorkFlow = () => {
        checkTimeout = setTimeout(() => {
          checkWorkflow();
        }, this._requestInterval);
      };

      const checkWorkflow = () => {
        requestWorkflows().then((response) => {
          this._logger.debug(`Workflow runs: ${JSON.stringify(response.data.workflow_runs)}`);
          return this._findJobInCompletedWorkflowRuns(response.data.workflow_runs, stepUUID).then(
            (jobData) => {
              if (jobData) {
                this._logger.info(`Target job with ID ${jobData.id} found`);
                this._logger.debug(`Target job data: ${JSON.stringify(jobData)}`);
                clearTimeout(rejectTimeout);
                resolve(jobData);
              } else {
                this._logger.debug("Target job not found yet, retrying...");
                waitAndCheckWorkFlow();
              }
            }
          );
        });
      };
      this._logger.info(`Checking workflows runs executed after ${executedFrom}`);
      checkWorkflow();
    });
  }

  public async waitForTargetJobToSuccess({
    stepUUID,
    executedFrom,
  }: WaitForTargetJobOptions): Promise<GetRunJobResponse> | never {
    const targetJob = await this.waitForTargetJobToComplete({
      stepUUID,
      executedFrom,
    });
    // Check if job has finished successfully
    throwIfJobFailed(targetJob);
    return targetJob;
  }

  public downloadJobFirstArtifact(
    jobData: GetRunJobResponse
  ): Promise<DownloadRunArtifactResponse> {
    let checkTimeout: NodeJS.Timeout;
    return new Promise((resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        clearTimeout(checkTimeout);
        reject(new Error("Timed out while trying to download artifact"));
      }, this._timeoutArtifactAvailable);

      const downloadArtifact = () => {
        return this._githubClient
          .getRunArtifacts({
            runId: jobData.run_id,
          })
          .then((response) => {
            if (response.data.total_count > 1)
              this._logger.warning(
                "Caution!, there are more than one artifact uploaded for this workflow, downloading the first one"
              );
            const artifact = response.data.artifacts[0];
            if (artifact) {
              this._logger.info(`Artifact ${artifact.id} found, downloading...`);
              this._logger.debug(`Artifact ${JSON.stringify(artifact)}`);
              return this._githubClient.downloadRunArtifact({
                artifactId: artifact.id,
              });
            }
            return null;
          });
      };

      const waitAndDownloadArtifact = () => {
        checkTimeout = setTimeout(() => {
          checkArtifact();
        }, this._requestInterval);
      };

      const checkArtifact = () => {
        downloadArtifact().then((response) => {
          if (response) {
            this._logger.info(`Artifact downloaded`);
            this._logger.debug(`Download artifact response: ${JSON.stringify(response)}`);
            clearTimeout(rejectTimeout);
            resolve(response);
          } else {
            this._logger.debug("Artifact not found yet, retrying...");
            waitAndDownloadArtifact();
          }
        });
      };

      this._logger.info(`Checking artifacts for job ${jobData.id}`);
      checkArtifact();
    });
  }
};
