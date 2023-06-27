import { ContextInterface } from "../context";

import { EnvironmentSecretInterface } from "./EnvironmentSecret.types";
import { RepositorySecretInterface } from "./RepositorySecret.types";

/**
 * Secret service interface
 * @interface
 */
export interface SecretServiceInterface {
  /**
   * Creates a repository secret
   * @param {ContextInterface} context - the context of the current run
   * @param {RepositorySecretInterface} secret - the repository secret to create
   * @throws {Error} - if the secret could not be created
   */
  createRepositorySecret(
    context: ContextInterface,
    secret: RepositorySecretInterface
  ): Promise<void>;

  /**
   * Creates a environment secret
   * @param {ContextInterface} context - the context of the current run
   * @param {EnvironmentSecretInterface} secret - the environment secret to create
   * @throws {Error} - if the secret could not be created
   */
  createEnvironmentSecret(
    context: ContextInterface,
    secret: EnvironmentSecretInterface
  ): Promise<void>;
}
