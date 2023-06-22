import { Logger } from "../support/Logger.types";

import { EnvironmentInterface } from "./Environment.types";
import { OctokitInterface } from "./Octokit.types";
import { SecretInterface } from "./Secret.types";

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
   * @param {string} owner - repository owner
   * @param {string} repo - repository repo
   * @param {RepositoryConstructorOptions} options - repositoryConstructor options
   * @returns A new instance of repositoryInterface
   */
  new (owner: string, repo: string, options: RepositoryConstructorOptions): RepositoryInterface;
}

/**
 * Represents a GitHub repository
 * @interface
 */
export interface RepositoryInterface {
  /** Get environment */
  getEnvironment(name: string): Promise<EnvironmentInterface>;
  /** Add secret */
  addSecret(secret: SecretInterface): Promise<void>;
}
