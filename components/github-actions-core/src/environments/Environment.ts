import { RepositoryInterface } from "../repositories";

import { EnvironmentConstructor, EnvironmentInterface } from "./Environment.types";

/**
 * Implementation of EnvironmentInterface.
 *
 * @param {string} name - environment name
 * @param {string} repository - repository
 * @returns {EnvironmentInterface} - environment
 * @example
 * import { Repository } from "github-actions-core";
 * import { Environment } from "github-actions-core";
 *
 * const repository = new Repository("owner/repo");
 * const environment = new Environment("production", repository);
 */
export const Environment: EnvironmentConstructor = class Environment
  implements EnvironmentInterface
{
  private _name: string;
  private _repository: RepositoryInterface;

  constructor(name: string, repository: RepositoryInterface) {
    this._name = name;
    this._repository = repository;
  }

  public get name(): string {
    return this._name;
  }

  public get repository(): RepositoryInterface {
    return this._repository;
  }
};
