import { Octokit as BaseOctokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";

import { ContextInterface } from "../context";
import { EnvironmentSecretInterface, RepositorySecretInterface } from "../secrets";

import { GitHubConstructor, GitHubInterface } from "./GitHub.types";
import { GitHubSecret } from "./GitHubSecret";

const Octokit = BaseOctokit.plugin(restEndpointMethods);

/**
 * Create a new GitHub instance.
 *
 * @param token The GitHub token to use for authentication.
 */
export const GitHub: GitHubConstructor = class Github implements GitHubInterface {
  private _octokit: BaseOctokit & Api;

  constructor(token: string) {
    this._octokit = new Octokit({ auth: token });
  }

  /**
   * Create a new repository secret.
   * @param {ContextInterface} context - The context of the current run.
   * @param {RepositorySecretInterface} secret - The repository secret to create.
   *
   * @throws {Error} - If the repository does not exist.
   * @throws {Error} - If the repository's public key can not be obtain.
   * @throws {Error} - If the secret can not be created.
   */
  async createRepositorySecret(
    context: ContextInterface,
    secret: RepositorySecretInterface
  ): Promise<void> {
    const owner = secret.repository.owner;
    const repo = secret.repository.repo;
    await this._octokit.rest.repos.get({
      repo,
      owner,
    });
    const publicKey = await this._octokit.rest.actions.getRepoPublicKey({
      owner,
      repo,
    });
    const githubSecret = new GitHubSecret(secret.name, secret.value);
    const encryptedValue = await githubSecret.encryptedValue(context, publicKey.data.key);
    await this._octokit.rest.actions.createOrUpdateRepoSecret({
      key_id: publicKey.data.key_id,
      owner,
      repo,
      secret_name: secret.name,
      encrypted_value: encryptedValue,
    });
  }

  /**
   * Create a new environment secret.
   *
   * @param {ContextInterface} context - The context of the current run.
   * @param {EnvironmentSecretInterface} secret - The environment secret to create.
   * @throws {Error} - If the repository does not exist.
   * @throws {Error} - If the environment does not exist.
   * @throws {Error} - If the environment's public key can not be obtain.
   * @throws {Error} - If the secret can not be created.
   */
  async createEnvironmentSecret(
    context: ContextInterface,
    secret: EnvironmentSecretInterface
  ): Promise<void> {
    const owner = secret.environment.repository.owner;
    const repo = secret.environment.repository.repo;
    const repository = await this._octokit.rest.repos.get({
      owner,
      repo,
    });
    const environmentName = secret.environment.name;
    await this._octokit.rest.repos.getEnvironment({
      owner,
      repo,
      environment_name: environmentName,
    });
    const publicKey = await this._octokit.rest.actions.getEnvironmentPublicKey({
      repository_id: repository.data.id,
      environment_name: environmentName,
    });
    const githubSecret = new GitHubSecret(secret.name, secret.value);
    const encryptedValue = await githubSecret.encryptedValue(context, publicKey.data.key);
    await this._octokit.rest.actions.createOrUpdateEnvironmentSecret({
      key_id: publicKey.data.key_id,
      environment_name: environmentName,
      repository_id: repository.data.id,
      secret_name: secret.name,
      encrypted_value: encryptedValue,
    });
  }
};
