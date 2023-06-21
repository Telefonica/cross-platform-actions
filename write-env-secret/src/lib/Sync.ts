import { getConfig } from "./config/Config";
import { getOctokit } from "./github/Octokit";
import { Repository } from "./github/Repository";
import { Secret } from "./github/Secret";
import { Logger } from "./support/Logger.types";
import { SyncInputs } from "./Sync.types";

export async function sync(inputs: SyncInputs, logger: Logger): Promise<string> {
  logger.info("Syncing manifest...");
  const config = getConfig(inputs);
  const octokit = getOctokit(inputs.token);
  const secret = new Secret(inputs.secret, inputs.value, { logger });
  const createdSecrets = [];
  for (const { name, owner } of config.repositories) {
    logger.info(`Syncing ${name}...`);
    try {
      const repository = new Repository(name, owner, { octokit, logger });
      if (inputs.environment) {
        const environment = await repository.getEnvironment(inputs.environment);
        await environment.addSecret(secret);
      } else {
        await repository.addSecret(secret);
      }
      createdSecrets.push({
        secret: secret.name,
        repository: `${owner}/${name}`,
        environment: inputs.environment,
      });
    } catch (err) {
      logger.error(`Error syncing ${name}: ${err}`);
      throw new Error(`Error syncing ${name}`, { cause: err });
    }
  }
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}
