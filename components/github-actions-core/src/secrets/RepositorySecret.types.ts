import { RepositoryInterface } from "../repositories";

import { SecretInterface } from "./Secret.types";

export interface RepositorySecretConstructor {
  /**
   * Creates a new instance of RepositorySecretInterface
   *
   * @param {string} name - The name of the secret.
   * @param {string} value - The value of the secret.
   * @param {RepositoryInterface} repository - The repository to create the secret in.
   * @returns {RepositorySecretInterface} A new instance of RepositorySecretInterface
   */
  new (name: string, value: string, repository: RepositoryInterface): RepositorySecretInterface;
}

/**
 * Represents a Repository secret
 * @interface
 * @augments SecretInterface
 */
export interface RepositorySecretInterface extends SecretInterface {
  /** Repository */
  readonly repository: RepositoryInterface;
}
