import { Logger } from "../support/Logger.types";

import { SecretInterface } from "./Secret.types";

/** Represents RepositoryConstructor extra options */
export interface RepositoryConstructorOptions {
  /** Logger */
  logger?: Logger;
}

export interface RepositoryConstructor {
  /**
   * Creates a new instance of RepositoryInterface
   * @param {string} name - Repository name
   * @param {string} owner - Repository owner
   * @param {string} token - GitHub token
   * @returns A new instance of RepositoryInterface
   */
  new (
    name: string,
    owner: string,
    token: string,
    options?: RepositoryConstructorOptions
  ): RepositoryInterface;
}

/**
 * Represents a GitHub repository
 * @interface
 */
export interface RepositoryInterface {
  /**
   * Add secret to repository
   *
   * @param {SecretInterface} secret - Secret to add
   * @returns {Promise<void>} Promise that resolves when the secret is added
   * @memberof RepositoryInterface
   * @instance
   * @method
   *
   * @throws {Error} If the token is invalid
   * @throws {Error} If the repository cannot be found
   * @throws {Error} If the secret cannot be added
   *
   * @example
   * const repository = new Repository("my-repository", "my-owner", "my-token");
   * const secret = new Secret("my-secret", "my-value");
   * await repository.addSecret(secret);
   */
  addSecret(secret: SecretInterface): Promise<void>;
}
