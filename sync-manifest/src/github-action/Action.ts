import * as core from "@actions/core";

import { sync } from "../lib/Sync";

import { getInputs } from "./Inputs";
import { getLogger } from "./Logger";

export async function runDeployAndGetArtifactAction(): Promise<void> {
  const logger = getLogger();
  try {
    const inputs = getInputs();
    const artifactJson = await sync(inputs, logger);

    core.setOutput("manifest", artifactJson);
  } catch (error) {
    core.setFailed(error as Error);
    throw error;
  }
}
