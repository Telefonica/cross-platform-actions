import * as core from "@actions/core";

import { writeSecret } from "../lib/WriteSecret";

import { getInputs } from "./Inputs";
import { getLogger } from "./Logger";

export async function runWriteSecretAndGetArtifactAction(): Promise<void> {
  const logger = getLogger();
  try {
    const inputs = getInputs();
    const artifactJson = await writeSecret(inputs, logger);

    core.setOutput("manifest", artifactJson);
  } catch (error) {
    core.setFailed(error as Error);
    throw error;
  }
}
