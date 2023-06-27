import { ContextInterface } from "../context";
import { RepositoryInterface } from "../repositories";

import { RepositorySecretConstructor, RepositorySecretInterface } from "./RepositorySecret.types";

/**
 * Create a new repository secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 * @param {RepositoryInterface} repository - The repository to create the secret in.
 * @returns {RepositorySecretInterface} A new repository secret.
 */
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

  /**
   * Create the secret.
   * @param {ContextInterface} context - The context of the current run.
   * @throws {Error} - If the secret could not be created.
   */
  async createSecret(context: ContextInterface): Promise<void> {
    await context.secretService.createRepositorySecret(context, this);
  }
};
