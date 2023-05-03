import type { Config } from "./config/Config.types";
import { Logger } from "./support/Logger.types";
export declare function deployAndGetArtifact({ timeoutJobCompleted, timeoutArtifactAvailable, repoName, repoRef, workflowId, githubOwner, githubToken, environment, requestInterval, }: Config, logger: Logger): Promise<string>;
export declare function runDeployAndGetArtifactAction(): Promise<void>;
