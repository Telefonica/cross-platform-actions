import { RepositoryInterface } from "../repositories";

export interface EnvironmentConstructor {
  /**
   * Creates a new instance of environmentInterface
   * @param {string} environment - environment name
   * @param {RepositoryInterface} repository - repository
   * @returns A new instance of environmentInterface
   */
  new (environment: string, repository: RepositoryInterface): EnvironmentInterface;
}

/**
 * Represents a GitHub environment
 * @interface
 */
export interface EnvironmentInterface {
  /** Environment name */
  readonly name: string;
  /** Repository */
  readonly repository: RepositoryInterface;
}
