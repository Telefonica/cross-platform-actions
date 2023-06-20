import { Logger } from "../support/Logger.types";

import { Octokit } from "./Octokit";
import { OctokitInterface } from "./Octokit.types";
import {
  RepositoryConstructor,
  RepositoryConstructorOptions,
  RepositoryInterface,
} from "./Repository.types";
import { SecretInterface } from "./Secret.types";

export const Repository: RepositoryConstructor = class Repository implements RepositoryInterface {
  private _name: string;
  private _owner: string;
  private _logger: Logger | undefined;
  private _octokit: OctokitInterface;

  constructor(name: string, owner: string, token: string, options?: RepositoryConstructorOptions) {
    this._name = name;
    this._owner = owner;
    this._logger = options?.logger;
    this._octokit = new Octokit({
      auth: token,
    });
  }

  public async addSecret(secret: SecretInterface): Promise<void> {
    this._logger?.info(`Adding secret ${secret.name} to repository ${this._name}`);
    const publicKey = await this._publicKey();
    const encryptedValue = await secret.encryptedValue(publicKey);
    this._logger?.debug(`Encrypted value: ${encryptedValue}`);
    const resp = await this._octokit.rest.actions.createOrUpdateRepoSecret({
      owner: this._owner,
      repo: this._name,
      secret_name: secret.name,
      encrypted_value: encryptedValue,
    });
    this._logger?.debug(`Response from GitHub: ${JSON.stringify(resp)}`);
    this._logger?.info(`Secret ${secret.name} added to repository ${this._name}`);
  }

  private async _publicKey(): Promise<string> {
    this._logger?.debug(`Getting public key from repository ${this._name}`);
    const publicKey = await this._octokit.rest.actions.getRepoPublicKey({
      owner: this._owner,
      repo: this._name,
    });
    this._logger?.debug(
      `Public key from repository ${this._name} retrieved: ${publicKey.data.key}`
    );
    return publicKey.data.key;
  }
};
