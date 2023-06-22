import { getConfig } from "./config/Config";
import { getOctokit } from "./github/Octokit";
import { Repository } from "./github/Repository";
import { Secret } from "./github/Secret";
import { SecretInterface } from "./github/Secret.types";
import { Logger } from "./support/Logger.types";
import type { Repository as RepositoryInfo } from "./support/Support.types";
import { Context, SyncInputs } from "./WriteSecret.types";

export async function writeSecret(inputs: SyncInputs, logger: Logger): Promise<string> {
  logger.info("Syncing manifest...");
  const config = getConfig(inputs);
  const octokit = getOctokit(inputs.token);
  const secret = new Secret(inputs.secret, inputs.value, { logger });
  const createdSecrets = await _createSecrets(config.repositories, inputs.environment, secret, {
    octokit,
    logger,
  });
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}

async function _createSecrets(
  repositories: RepositoryInfo[],
  environment: string | undefined,
  secret: SecretInterface,
  context: Context
) {
  if (typeof environment === "string")
    return _createEnvironmentSecrets(repositories, environment, secret, context);
  return _createRepoSecrets(repositories, secret, context);
}

async function _createEnvironmentSecrets(
  repositories: RepositoryInfo[],
  environmentName: string,
  secret: SecretInterface,
  context: Context
) {
  return Promise.all(
    repositories.map(async ({ owner, repo }) => {
      const repository = new Repository(owner, repo, context);
      const environment = await repository.getEnvironment(environmentName);
      await environment.addSecret(secret);
      return {
        secret: secret.name,
        repository: `${owner}/${repo}`,
        environment: environmentName,
      };
    })
  );
}

async function _createRepoSecrets(
  repositories: RepositoryInfo[],
  secret: SecretInterface,
  context: Context
) {
  return Promise.all(
    repositories.map(async ({ owner, repo }) => {
      const repository = new Repository(owner, repo, context);
      await repository.addSecret(secret);
      return {
        secret: secret.name,
        repository: `${owner}/${repo}`,
      };
    })
  );
}
