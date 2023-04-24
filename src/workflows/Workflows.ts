import type { Logger } from "../support/Logger.types";

import { Github, throwIfJobFailed } from "./Github";
import type {
  GithubInterface,
  DispatchOptions,
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
  }

  private async _findJobInWorkflowRun(
    runId: number,
    stepUUID: StepUUID
  ): Promise<GetRunJobResponse | undefined> {
    const stepName = `Set ID (${stepUUID})`;
    const workflowJobs = await this._githubClient.getRunJobs({ runId });
    const foundWorkflow = workflowJobs.data.jobs.find((job) =>
      job.steps?.find((step) => step.name === stepName)
    );
    return foundWorkflow;
  }

  private async _findJobInCompletedWorkflowRuns(
    workflowRuns: GetRunResponse["data"]["workflow_runs"],
    stepUUID: StepUUID
  ): Promise<GetRunJobResponse | undefined> {
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
          return this._findJobInCompletedWorkflowRuns(response.data.workflow_runs, stepUUID).then(
            (jobData) => {
              if (jobData) {
                clearTimeout(rejectTimeout);
                resolve(jobData);
              } else {
                waitAndCheckWorkFlow();
              }
            }
          );
        });
      };

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
            const artifact = response.data.artifacts[0];
            if (artifact) {
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
            clearTimeout(rejectTimeout);
            resolve(response);
          } else {
            waitAndDownloadArtifact();
          }
        });
      };

      checkArtifact();
    });
  }
};
