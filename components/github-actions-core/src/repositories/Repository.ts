import { RepositoryConstructor, RepositoryInterface } from "./Repository.types";

/**
 * Create a new repository.
 *
 * @param {string} repository - The name of the repository (should have format "owner/repo").
 * @throws {Error} If the repository name is invalid.
 */
export const Repository: RepositoryConstructor = class Repository implements RepositoryInterface {
  private _owner: string;
  private _repo: string;

  constructor(repository: string) {
    if (!/^[^/]+\/[^/]+$/.test(repository)) {
      throw new Error(`Invalid repository name: ${repository}`);
    }
    const [owner, repo] = repository.split("/");
    this._owner = owner;
    this._repo = repo;
  }

  public get owner(): string {
    return this._owner;
  }

  public get repo(): string {
    return this._repo;
  }
};
