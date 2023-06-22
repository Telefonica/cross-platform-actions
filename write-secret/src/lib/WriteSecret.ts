import { getConfig } from "./config/Config";
import { getOctokit } from "./github/Octokit";
import { Repository } from "./github/Repository";
import { Secret } from "./github/Secret";
import { Logger } from "./support/Logger.types";
import { SyncInputs } from "./WriteSecret.types";

export async function writeSecret(inputs: SyncInputs, logger: Logger): Promise<string> {
  logger.info("Syncing manifest...");
  const config = getConfig(inputs);
  const octokit = getOctokit(inputs.token);
  const secret = new Secret(inputs.secret, inputs.value, { logger });
  const createdSecrets = [];
  for (const { owner, repo } of config.repositories) {
    logger.info(`Syncing ${owner}/${repo}...`);
    try {
      const repository = new Repository(owner, repo, { octokit, logger });
      if (inputs.environment) {
        const environment = await repository.getEnvironment(inputs.environment);
        await environment.addSecret(secret);
      } else {
        await repository.addSecret(secret);
      }
      createdSecrets.push({
        secret: secret.name,
        repository: `${owner}/${repo}`,
        environment: inputs.environment,
      });
    } catch (err) {
      logger.error(`Error syncing ${owner}/${repo}: ${err}`);
      throw new Error(`Error syncing ${owner}/${repo}`, { cause: err });
    }
  }
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}
