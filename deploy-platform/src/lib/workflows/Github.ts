import { Octokit } from "octokit";

import type { Logger } from "../support/Logger.types";

import type {
  GithubConstructor,
  GithubConstructorOptions,
  GithubInterface,
  DispatchOptions,
  GetRunsOptions,
  GetRunJobsOptions,
  GetRunArtifactsOptions,
  DownloadRunArtifactOptions,
  GetRunResponse,
  GetRunJobResponse,
  GetRunJobsResponse,
  GetRunArtifactsResponse,
  DownloadRunArtifactResponse,
} from "./Github.types";

const SUCCESSFUL_JOB_CONCLUSION = "success";

function jobIsSuccessful(job: GetRunJobResponse): boolean {
  return job.conclusion === SUCCESSFUL_JOB_CONCLUSION;
}

export function throwIfJobFailed(job: GetRunJobResponse): void | never {
  if (!jobIsSuccessful(job)) {
    throw new Error(`Job ${job.name} failed`);
  }
}

export const Github: GithubConstructor = class Github implements GithubInterface {
  private _octokit: Octokit;
  private _owner: string;
  private _project: string;
  private _logger: Logger;

  constructor({ token, owner, project, logger }: GithubConstructorOptions) {
    this._octokit = new Octokit({
      auth: token,
    });
    this._owner = owner;
    this._project = project;
    this._logger = logger;
  }

  public async dispatchWorkflow({ workflowId, ref, stepUUID }: DispatchOptions) {
    try {
      const dataToSend = {
        owner: this._owner,
        repo: this._project,
        workflow_id: workflowId,
        ref: ref,
        inputs: {
          id: stepUUID,
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      };
      this._logger.debug(`Dispatching Github workflow: ${JSON.stringify({ dataToSend })}`);
      await this._octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        dataToSend
      );
    } catch (error) {
      throw new Error(`Error dispatching Github workflow: ${(error as Error).message}`);
    }
  }

  public async getRuns({ runDateFilter }: GetRunsOptions): Promise<GetRunResponse> {
    const response = (await this._octokit.request(
      `GET /repos/{owner}/{repo}/actions/runs?created>={run_date_filter}`,
      {
        owner: this._owner,
        repo: this._project,
        run_date_filter: runDateFilter,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    )) as GetRunResponse;
    return response;
  }

  public async getRunJobs({ runId }: GetRunJobsOptions): Promise<GetRunJobsResponse> {
    return this._octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", {
      owner: this._owner,
      repo: this._project,
      run_id: runId,
    });
  }

  public async getRunArtifacts({
    runId,
  }: GetRunArtifactsOptions): Promise<GetRunArtifactsResponse> {
    return this._octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", {
      owner: this._owner,
      repo: this._project,
      run_id: runId,
    });
  }

  public async downloadRunArtifact({
    artifactId,
  }: DownloadRunArtifactOptions): Promise<DownloadRunArtifactResponse> {
    return this._octokit.request(
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
      {
        owner: this._owner,
        repo: this._project,
        artifact_id: artifactId,
        archive_format: "zip",
      }
    );
  }
};
