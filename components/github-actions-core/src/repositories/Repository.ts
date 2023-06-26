import { RepositoryConstructor, RepositoryInterface } from "./Repository.types";

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
