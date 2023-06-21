import { getConfig } from "./config/Config";
import { Repository } from "./github/Repository";
import { Secret } from "./github/Secret";
import { Logger } from "./support/Logger.types";
import { SyncInputs } from "./Sync.types";

export async function sync(inputs: SyncInputs, logger: Logger): Promise<string> {
  logger.info("Syncing manifest...");
  const config = getConfig(inputs);
  const secret = new Secret(inputs.secret, inputs.manifest, { logger });
  const createdSecrets = [];
  for (const { name, owner } of config.repositories) {
    logger.info(`Syncing ${name}...`);
    const repository = new Repository(name, owner, inputs.token, { logger });
    try {
      await repository.addSecret(secret);
    } catch (err) {
      logger.error(`Error syncing ${name}`);
      throw new Error(`Error syncing ${name}`, { cause: err });
    }
    createdSecrets.push({ repository: { name, owner }, secret: { name: secret.name } });
  }
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}
