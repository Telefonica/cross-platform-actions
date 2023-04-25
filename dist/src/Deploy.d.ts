import type { Config } from "./config/Config.types";
export declare function deployAndGetArtifact({ timeoutJobCompleted, timeoutArtifactAvailable, repoName, repoRef, workflowId, githubOwner, githubToken, environment, requestInterval, }: Config): Promise<string>;
export declare function runDeployAndGetArtifactAction(): Promise<void>;
