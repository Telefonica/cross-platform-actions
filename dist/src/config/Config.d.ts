import type { Config } from "./Config.types";
export declare const INPUT_VARS: {
    PROJECT: string;
    TOKEN: string;
    ENVIRONMENT: string;
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
};
export declare function getRepoName(repoBaseName: string): string;
export declare function getConfig(): Config;
