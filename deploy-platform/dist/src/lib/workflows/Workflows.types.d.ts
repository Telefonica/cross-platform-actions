import { GithubConstructorOptions, StepUUID, GetRunJobResponse, DownloadRunArtifactResponse, DispatchOptions } from "./Github.types";
export interface WorkflowsConstructorOptions extends GithubConstructorOptions {
    /** Time to wait before considering that job is not going to complete */
    timeoutJobCompleted: number;
    /** Time to wait before considering that retrieving job artifact failed */
    timeoutArtifactAvailable: number;
    /** Time to wait between requests to Github API */
    requestInterval: number;
}
/** Returns Workflows interface */
export interface WorkflowsConstructor {
    new (options: WorkflowsConstructorOptions): WorkflowsInterface;
}
export interface WaitForTargetJobOptions {
    stepUUID: StepUUID;
    /** Date to search workflows from */
    executedFrom: string;
}
/** Workflows interface */
export interface WorkflowsInterface {
    dispatch(options: DispatchOptions): Promise<void>;
    waitForTargetJobToComplete(options: WaitForTargetJobOptions): Promise<GetRunJobResponse>;
    waitForTargetJobToSuccess(options: WaitForTargetJobOptions): Promise<GetRunJobResponse>;
    downloadJobFirstArtifact(jobData: GetRunJobResponse): Promise<DownloadRunArtifactResponse>;
}
