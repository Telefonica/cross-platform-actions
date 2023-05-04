import * as core from "@actions/core";

import { deployAndGetArtifact } from "../lib/Deploy";

import { getInputs } from "./Inputs";
import { getLogger } from "./Logger";

export async function runDeployAndGetArtifactAction(): Promise<void> {
  const logger = getLogger();
  try {
    const inputs = getInputs();
    const artifactJson = await deployAndGetArtifact(inputs, logger);
    core.setOutput("manifest", artifactJson);
  } catch (error) {
    core.setFailed((error as Error).message);
    throw error;
  }
}
