import { Logger } from "../support/Logger.types";
import { EnvironmentInterface } from "./Environment.types";
import { OctokitInterface } from "./Octokit.types";
/** Represents repositoryConstructor extra options */
export interface RepositoryConstructorOptions {
    /** Octokit */
    octokit: OctokitInterface;
    /** Logger */
    logger?: Logger;
}
export interface RepositoryConstructor {
    /**
     * Creates a new instance of repositoryInterface
     * @param {string} name - repository name
     * @param {string} owner - repository owner
     * @param {RepositoryConstructorOptions} options - repositoryConstructor options
     * @returns A new instance of repositoryInterface
     */
    new (name: string, owner: string, options: RepositoryConstructorOptions): RepositoryInterface;
}
/**
 * Represents a GitHub repository
 * @interface
 */
export interface RepositoryInterface {
    /** Get environment */
    getEnvironment(name: string): Promise<EnvironmentInterface>;
}
