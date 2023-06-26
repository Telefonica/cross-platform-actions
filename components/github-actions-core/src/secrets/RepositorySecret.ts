import { ContextInterface } from "../context";
import { RepositoryInterface } from "../repositories";

import { RepositorySecretConstructor, RepositorySecretInterface } from "./RepositorySecret.types";

export const RepositorySecret: RepositorySecretConstructor = class RepositorySecret
  implements RepositorySecretInterface
{
  private _name: string;
  private _value: string;
  private _repository: RepositoryInterface;

  constructor(name: string, value: string, repository: RepositoryInterface) {
    this._name = name;
    this._value = value;
    this._repository = repository;
  }

  public get name(): string {
    return this._name;
  }

  public get value(): string {
    return this._value;
  }

  public get repository(): RepositoryInterface {
    return this._repository;
  }

  async createSecret(context: ContextInterface): Promise<void> {
    await context.secretService.createRepositorySecret(context, this);
  }
};
