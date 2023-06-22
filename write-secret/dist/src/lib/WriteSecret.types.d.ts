import { OctokitInterface } from "./github/Octokit.types";
import { Logger } from "./support/Logger.types";
export interface SyncInputs {
    /** Secret name */
    secret: string;
    /** Value */
    value: string;
    /** Repositories */
    repositories: string[];
    /** Environment */
    environment?: string;
    /** GitHub token */
    token: string;
}
export interface Context {
    /** Octokit */
    octokit: OctokitInterface;
    /** Logger */
    logger: Logger;
}
