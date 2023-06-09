import type { Config } from "./Config.types";
export declare const INPUT_VARS: {
    PROJECT: string;
    TOKEN: string;
    ENVIRONMENT: string;
    REPO_SUFFIX: string;
    WORKFLOW_ID: string;
    REF: string;
};
export declare const TIMEOUT_VARS: {
    JOB_COMPLETED: number;
    ARTIFACT_AVAILABLE: number;
    REQUEST_INTERVAL: number;
};
export declare const OUTPUT_VARS: {
    MANIFEST: string;
};
export declare const DEFAULT_VARS: {
    GITHUB_OWNER: string;
    REPO_REF: string;
    WORKFLOW_ID: string;
    REPO_SUFFIX: string;
};
export declare function getRepoName(repoBaseName: string, customRepoSuffix?: string): string;
export declare function getConfig(): Config;
