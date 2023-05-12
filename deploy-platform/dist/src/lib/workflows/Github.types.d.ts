import type { Endpoints } from "@octokit/types";
import type { Logger } from "../support/Logger.types";
/** Options for creating a Github interface */
export interface GithubConstructorOptions {
    /** Github token */
    token: string;
    /** Github repo owner */
    owner: string;
    /** Github repo name */
    project: string;
    /** Logger */
    logger: Logger;
}
/** Returns Github interface */
export interface GithubConstructor {
    new (options: GithubConstructorOptions): GithubInterface;
}
export type StepUUID = string;
/** Options for the dispatch method */
export interface DispatchOptions {
    /** Workflow id */
    workflowId: number;
    /** Github branch */
    ref: string;
    /** Id */
    stepUUID: StepUUID;
}
/** Options for the dispatch method */
export interface GetRunsOptions {
    /** Date to get runs from */
    runDateFilter: string;
}
/** Options for the get run jobs method */
export interface GetRunJobsOptions {
    /** Run Id to get jobs from */
    runId: number;
}
/** Options for the get run artifacts method */
export interface GetRunArtifactsOptions {
    /** Run Id to get artifacts from */
    runId: number;
}
export interface DownloadRunArtifactOptions {
    /** Artifact id to download */
    artifactId: number;
}
export type GetWorkflowsResponse = Endpoints["GET /repos/{owner}/{repo}/actions/workflows"]["response"];
export type GetRunResponse = Endpoints["GET /repos/{owner}/{repo}/actions/runs"]["response"];
export type GetRunJobsResponse = Endpoints["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"]["response"];
export type GetRunJobResponse = GetRunJobsResponse["data"]["jobs"][0];
export type GetRunArtifactsResponse = Endpoints["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"]["response"];
export type DownloadRunArtifactResponse = Endpoints["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"]["response"];
export interface GithubInterface {
    /** Gets workflows */
    getWorkflows: () => Promise<GetWorkflowsResponse>;
    /** Dispatches a workflow */
    dispatchWorkflow: (options: DispatchOptions) => Promise<void>;
    /** Gets workflow runs */
    getRuns: (options: GetRunsOptions) => Promise<GetRunResponse>;
    /** Gets workflow run jobs */
    getRunJobs: (options: GetRunJobsOptions) => Promise<GetRunJobsResponse>;
    /** Gets workflow run job artifacts */
    getRunArtifacts: (options: GetRunArtifactsOptions) => Promise<GetRunArtifactsResponse>;
    /** Download run artifacts */
    downloadRunArtifact: (options: DownloadRunArtifactOptions) => Promise<DownloadRunArtifactResponse>;
}
