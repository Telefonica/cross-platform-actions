import { RepositoryInterface } from "../repositories";

import { EnvironmentConstructor, EnvironmentInterface } from "./Environment.types";

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
