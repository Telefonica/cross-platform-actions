export interface RepositoryConstructor {
  /**
   * Creates a new instance of repositoryInterface
   * @param {string} repository - repository
   * @param {RepositoryConstructorOptions} options - repositoryConstructor options
   * @returns A new instance of repositoryInterface
   * @throws {Error} If the repository name is invalid.
   */
  new (repository: string): RepositoryInterface;
}

/**
 * Represents a GitHub repository
 * @interface
 */
export interface RepositoryInterface {
  /** Owner */
  readonly owner: string;
  /** Repo */
  readonly repo: string;
}
