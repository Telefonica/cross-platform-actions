import { Octokit as BaseOctokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";

import { ContextInterface } from "../context";
import { EnvironmentSecretInterface, RepositorySecretInterface } from "../secrets";

import { GitHubConstructor, GitHubInterface } from "./GitHub.types";
import { GitHubSecret } from "./GitHubSecret";

const Octokit = BaseOctokit.plugin(restEndpointMethods);

export const GitHub: GitHubConstructor = class Github implements GitHubInterface {
  private _octokit: BaseOctokit & Api;

  constructor(token: string) {
    this._octokit = new Octokit({ auth: token });
  }

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
      owner,
      repo,
      secret_name: secret.name,
      encrypted_value: encryptedValue,
    });
  }

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
