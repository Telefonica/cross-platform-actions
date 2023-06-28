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
  private _owner: string;
  private _repo: string;
  private _octokit: OctokitInterface;
  private _logger: Logger | undefined;

  constructor(owner: string, repo: string, options: RepositoryConstructorOptions) {
    this._owner = owner;
    this._repo = repo;
    this._octokit = options.octokit;
    this._logger = options?.logger;
  }

  public async getEnvironment(name: string): Promise<EnvironmentInterface> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._repo}] Getting environment ${name} from repository`
    );
    try {
      const repositoryId = await this._getSelfId();
      await this._octokit.rest.repos.getEnvironment({
        owner: this._owner,
        repo: this._repo,
        environment_name: name,
      });
      return new Environment(repositoryId, name, {
        octokit: this._octokit,
        logger: this._logger,
      });
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._repo}] Error getting environment ${name} from repository: ${err}`
      );
      throw new Error(
        `Error getting environment ${name} from repository from ${this._owner}/${this._repo}`,
        { cause: err }
      );
    }
  }

  private async _getSelfId(): Promise<number> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._repo}] Getting self id from repository ${this._repo}`
    );
    try {
      const resp = await this._octokit.rest.repos.get({
        owner: this._owner,
        repo: this._repo,
      });
      this._logger?.debug(
        `[repo=${this._owner}/${this._repo}] Response from GitHub: ${JSON.stringify(resp)}`
      );
      return resp.data.id;
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._repo}] Error getting self id from repository ${this._repo}: ${err}`
      );
      throw new Error(`Error getting self id from repository ${this._repo}`, { cause: err });
    }
  }

  public async addSecret(secret: SecretInterface): Promise<void> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._repo}] Adding secret ${secret.name} to repository`
    );
    try {
      const publicKey = await this._getPublicKey();
      const encryptedValue = await secret.encryptedValue(publicKey.key);
      await this._octokit.rest.actions.createOrUpdateRepoSecret({
        key_id: publicKey.key_id,
        owner: this._owner,
        repo: this._repo,
        secret_name: secret.name,
        encrypted_value: encryptedValue,
      });
      this._logger?.info(`[repo=${this._owner}/${this._repo}] Secret ${secret.name} added`);
    } catch (err) {
      this._logger?.error(
        `[repo=${this._owner}/${this._repo}] Error adding secret ${secret.name} to repository: ${err}`
      );
      throw new Error(
        `Error adding secret ${secret.name} to repository ${this._owner}/${this._repo}`,
        { cause: err }
      );
    }
  }

  // TODO: Cache this method to avoid reaching rate limits <@ismtabo 2023-06-22>
  private async _getPublicKey(): Promise<PublicKeyInterface> {
    this._logger?.debug(
      `[repo=${this._owner}/${this._repo}] Getting public key from repository ${this._repo}`
    );
    try {
      const publicKey = await this._octokit.rest.actions.getRepoPublicKey({
        owner: this._owner,
        repo: this._repo,
      });
      this._logger?.debug(
        `[repo=${this._owner}/${this._repo}] Public key from repo retrieved ${publicKey.data.key}`
      );
      return {
        key_id: publicKey.data.key_id,
        key: publicKey.data.key,
      };
    } catch (error) {
      this._logger?.error(
        `[repo=${this._owner}/${this._repo}] Error getting public key from repository ${this._repo}: ${error}`
      );
      throw new Error(`Error getting public key from repository ${this._owner}/${this._repo}`, {
        cause: error,
      });
    }
  }
};
