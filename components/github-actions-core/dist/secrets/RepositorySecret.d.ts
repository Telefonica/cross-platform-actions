import { RepositorySecretConstructor } from "./RepositorySecret.types";
/**
 * Create a new repository secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 * @param {RepositoryInterface} repository - The repository to create the secret in.
 * @returns {RepositorySecretInterface} A new repository secret.
 */
export declare const RepositorySecret: RepositorySecretConstructor;
