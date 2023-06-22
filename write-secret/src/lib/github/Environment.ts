import { Logger } from "../support/Logger.types";
import { PublicKeyInterface } from "../support/Support.types";

import {
  EnvironmentConstructor,
  EnvironmentConstructorOptions,
  EnvironmentInterface,
} from "./Environment.types";
import { OctokitInterface } from "./Octokit.types";
import { SecretInterface } from "./Secret.types";

export const Environment: EnvironmentConstructor = class environment
  implements EnvironmentInterface
{
  private _repositoryId: number;
  private _name: string;
  private _octokit: OctokitInterface;
  private _logger: Logger | undefined;

  constructor(repositoryId: number, name: string, options: EnvironmentConstructorOptions) {
    this._repositoryId = repositoryId;
    this._name = name;
    this._octokit = options.octokit;
    this._logger = options.logger;
  }

  public async addSecret(secret: SecretInterface): Promise<void> {
    this._logger?.info(`Adding secret ${secret.name} to environment ${this._name}`);
    try {
      const publicKey = await this._getPublicKey();
      const encryptedValue = await secret.encryptedValue(publicKey.key);
      this._logger?.debug(`Encrypted value: ${encryptedValue}`);
      const resp = await this._octokit.rest.actions.createOrUpdateEnvironmentSecret({
        key_id: publicKey.key_id,
        repository_id: this._repositoryId,
        environment_name: this._name,
        secret_name: secret.name,
        encrypted_value: encryptedValue,
      });
      this._logger?.debug(
        `[repo=${this._repositoryId}, env=${this._name}] Response from GitHub: ${JSON.stringify(
          resp
        )}`
      );
      this._logger?.info(`Secret ${secret.name} added to environment ${this._name}`);
    } catch (err) {
      this._logger?.error(
        `[repo=${this._repositoryId}, env=${this._name}] Error adding secret ${secret.name} to environment ${this._name}: ${err}`
      );
      throw new Error(`Error adding secret ${secret.name} to environment ${this._name}`, {
        cause: err,
      });
    }
  }

  private async _getPublicKey(): Promise<PublicKeyInterface> {
    this._logger?.debug(
      `[repo=${this._repositoryId}, env=${this._name}] Getting public key from environment ${this._name}`
    );

    try {
      const publicKey = await this._octokit.rest.actions.getEnvironmentPublicKey({
        repository_id: this._repositoryId,
        environment_name: this._name,
      });
      this._logger?.debug(
        `[repo=${this._repositoryId}, env=${this._name}, key=${publicKey.data.key_id}] Public key from environment retrieved ${publicKey.data.key}`
      );
      return publicKey.data;
    } catch (err) {
      this._logger?.error(
        `[repo=${this._repositoryId}, env=${this._name}] Error getting public key from environment ${this._name}: ${err}`
      );
      throw new Error(
        `Error getting public key from environment ${this._repositoryId} ${this._name}`,
        { cause: err }
      );
    }
  }
};
