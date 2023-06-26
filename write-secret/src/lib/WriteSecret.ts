import type { LoggerInterface } from "github-actions-core";
import { createSecrets } from "github-actions-core";

import { SyncInputs } from "./WriteSecret.types";

export async function writeSecret(inputs: SyncInputs, logger: LoggerInterface): Promise<string> {
  logger.info("Syncing manifest...");
  const createdSecrets = await createSecrets(inputs, logger);
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}
