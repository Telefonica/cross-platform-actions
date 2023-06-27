import { EnvironmentConstructor } from "./Environment.types";
/**
 * Implementation of EnvironmentInterface.
 *
 * @param {string} name - environment name
 * @param {string} repository - repository
 * @returns {EnvironmentInterface} - environment
 * @example
 * import { Repository } from "github-actions-core";
 * import { Environment } from "github-actions-core";
 *
 * const repository = new Repository("owner/repo");
 * const environment = new Environment("production", repository);
 */
export declare const Environment: EnvironmentConstructor;
