import { DeployInputs } from "../Deploy.types";
import type { Config } from "./Config.types";
export declare const TIMEOUT_VARS: {
    JOB_COMPLETED: number;
    ARTIFACT_AVAILABLE: number;
    REQUEST_INTERVAL: number;
};
export declare const DEFAULT_VARS: {
    GITHUB_OWNER: string;
    REPO_REF: string;
    WORKFLOW_ID_PREFIX: string;
    WORKFLOW_ID_EXTENSION: string;
    REPO_SUFFIX: string;
};
export declare const CONFIG_SECRETS: (keyof Config)[];
export declare function getRepoName(repoBaseName: string, customRepoName?: string): string;
export declare function getWorkflowId(environment: string): string;
export declare function getConfig(inputs: DeployInputs): Config;
