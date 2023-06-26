import type { LoggerInterface } from "github-actions-core";
import { createSecrets } from "github-actions-core";

import { WriteSecretInputs } from "./WriteSecret.types";

export async function writeSecret(
  inputs: WriteSecretInputs,
  logger: LoggerInterface
): Promise<string> {
  logger.info("Writing manifest...");
  const createdSecrets = await createSecrets(inputs, logger);
  return JSON.stringify({
    github: {
      secrets: createdSecrets,
    },
  });
}
