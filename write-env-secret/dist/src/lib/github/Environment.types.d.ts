import { Logger } from "../support/Logger.types";
import { OctokitInterface } from "./Octokit.types";
import { SecretInterface } from "./Secret.types";
/** Represents environmentConstructor extra options */
export interface EnvironmentConstructorOptions {
    /** Octokit */
    octokit: OctokitInterface;
    /** Logger */
    logger?: Logger;
}
export interface EnvironmentConstructor {
    /**
     * Creates a new instance of environmentInterface
     * @param {number} repositoryId - repository id
     * @param {string} environmentName - environment name
     * @returns A new instance of environmentInterface
     */
    new (repositoryId: number, environmentName: string, options: EnvironmentConstructorOptions): EnvironmentInterface;
}
/**
 * Represents a GitHub environment
 * @interface
 */
export interface EnvironmentInterface {
    /**
     * Add secret to environment
     *
     * @param {SecretInterface} secret - Secret to add
     * @returns {Promise<void>} Promise that resolves when the secret is added
     * @memberof EnvironmentInterface
     * @instance
     * @method
     *
     * @throws {Error} If the token is invalid
     * @throws {Error} If the environment cannot be found
     * @throws {Error} If the secret cannot be added
     *
     * @example
     * const environment = new environment("my-environment", "my-owner", "my-token");
     * const secret = new Secret("my-secret", "my-value");
     * await environment.addSecret(secret);
     */
    addSecret(secret: SecretInterface): Promise<void>;
}
export interface PublicKeyInterface {
    /** Public key id */
    key_id: string;
    /** Public key Base64 value*/
    key: string;
}
