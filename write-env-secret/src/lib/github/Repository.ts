import { Logger } from "../support/Logger.types";
import { PublicKeyInterface } from "../support/Support.types";

import { Environment } from "./Environment";
import { EnvironmentInterface } from "./Environment.types";
import { OctokitInterface } from "./Octokit.types";
import {
  RepositoryConstructor,
  RepositoryConstructorOptions,
  RepositoryInterface,
} from "./Repository.types";
import { SecretInterface } from "./Secret.types";

export const Repository: RepositoryConstructor = class repository implements RepositoryInterface {
  private _name: string;
  private _owner: string;
  private _octokit: OctokitInterface;
  private _logger: Logger | undefined;

  constructor(name: string, owner: string, options: RepositoryConstructorOptions) {
    this._name = name;
    this._owner = owner;
    this._octokit = options.octokit;
    this._logger = options?.logger;
  }

  public async getEnvironment(name: string): Promise<EnvironmentInterface> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._name}] Getting environment ${name} from repository`
    );
    try {
      const repositoryId = await this._getSelfId();
      await this._octokit.rest.repos.getEnvironment({
        owner: this._owner,
        repo: this._name,
        environment_name: name,
      });
      return new Environment(repositoryId, this._owner, {
        octokit: this._octokit,
        logger: this._logger,
      });
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._name}] Error getting environment ${name} from repository: ${err}`
      );
      throw new Error(
        `Error getting environment ${name} from repository from ${this._owner}/${this._name}`,
        { cause: err }
      );
    }
  }

  private async _getSelfId(): Promise<number> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._name}] Getting self id from repository ${this._name}`
    );
    try {
      const resp = await this._octokit.rest.repos.get({
        owner: this._owner,
        repo: this._name,
      });
      this._logger?.debug(
        `[repo=${this._owner}/${this._name}] Response from GitHub: ${JSON.stringify(resp)}`
      );
      return resp.data.id;
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._name}] Error getting self id from repository ${this._name}: ${err}`
      );
      throw new Error(`Error getting self id from repository ${this._name}`, { cause: err });
    }
  }

  public async addSecret(secret: SecretInterface): Promise<void> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._name}] Adding secret ${secret.name} to repository`
    );
    try {
      const publicKey = await this._getPublicKey();
      const encryptedValue = await secret.encryptedValue(publicKey.key);
      await this._octokit.rest.actions.createOrUpdateRepoSecret({
        key_id: publicKey.key_id,
        owner: this._owner,
        repo: this._name,
        secret_name: secret.name,
        encrypted_value: encryptedValue,
      });
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._name}] Error adding secret ${secret.name} to repository: ${err}`
      );
      throw new Error(
        `Error adding secret ${secret.name} to repository ${this._owner}/${this._name}`,
        { cause: err }
      );
    }
  }

  private async _getPublicKey(): Promise<PublicKeyInterface> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._name}] Getting public key from repository ${this._name}`
    );
    try {
      const publicKey = await this._octokit.rest.actions.getRepoPublicKey({
        owner: this._owner,
        repo: this._name,
      });
      return {
        key_id: publicKey.data.key_id,
        key: publicKey.data.key,
      };
    } catch (error) {
      this._logger?.error(
        `[repo=${this._owner}/${this._name}] Error getting public key from repository ${this._name}: ${error}`
      );
      throw new Error(`Error getting public key from repository ${this._owner}/${this._name}`, {
        cause: error,
      });
    }
  }
};
