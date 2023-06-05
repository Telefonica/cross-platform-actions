import * as core from "@actions/core";

import { deployAndGetArtifact } from "../lib/Deploy";

import { getInputs } from "./Inputs";
import { getLogger } from "./Logger";

export async function runDeployAndGetArtifactAction(): Promise<void> {
  const logger = getLogger();
  try {
    const inputs = getInputs();
    if (inputs.requestInterval) {
      const requestInterval = parseInt(inputs.requestInterval);
      if (isNaN(requestInterval)) core.setFailed("request-interval must be a number");
      else {
        const artifactJson = await deployAndGetArtifact({ ...inputs, requestInterval }, logger);
        core.setOutput("manifest", artifactJson);
      }
    } else {
      const artifactJson = await deployAndGetArtifact(
        { ...inputs, requestInterval: undefined },
        logger
      );
      core.setOutput("manifest", artifactJson);
    }
  } catch (error) {
    core.setFailed((error as Error).message);
    throw error;
  }
}
