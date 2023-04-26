import type { Config } from "./Config.types";
export declare const OUTPUT_VARS: {
    MANIFEST: string;
};
export declare function getRepoName(repoBaseName: string, customRepoSuffix?: string): string;
export declare function getConfig(): Config;
