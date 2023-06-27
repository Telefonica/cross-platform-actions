import { EnvironmentInterface } from "../environments";
import { SecretInterface } from "./Secret.types";
export interface EnvironmentSecretConstructor {
    /**
     * Creates a new instance of EnvironmentSecretInterface
     *
     * @param {string} name - The name of the secret.
     * @param {string} value - The value of the secret.
     * @param {EnvironmentInterface} environment - The environment to create the secret in.
     * @returns {EnvironmentSecretInterface} A new instance of EnvironmentSecretInterface
     */
    new (name: string, value: string, environment: EnvironmentInterface): EnvironmentSecretInterface;
}
/**
 * Represents a Environment secret
 * @interface
 * @augments SecretInterface
 */
export interface EnvironmentSecretInterface extends SecretInterface {
    /** Environment */
    readonly environment: EnvironmentInterface;
}
