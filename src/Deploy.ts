import * as core from "@actions/core";
import { v4 as uuidv4 } from "uuid";

import { OUTPUT_VARS, getConfig } from "./config/Config";
import type { Config } from "./config/Config.types";
import { formattedNow } from "./support/Date";
import { getLogger } from "./support/Logger";
import { Logger } from "./support/Logger.types";
import { getJsonFromZip } from "./support/Zip";
import { Workflows } from "./workflows/Workflows";

export async function deployAndGetArtifact(
  {
    timeoutJobCompleted,
    timeoutArtifactAvailable,
    repoName,
    repoRef,
    workflowId,
    githubOwner,
    githubToken,
    environment,
    requestInterval,
  }: Config,
  logger: Logger
): Promise<string> {
  const stepUUID = uuidv4();
  const executedFrom = formattedNow();

  const workflows = new Workflows({
    token: githubToken,
    owner: githubOwner,
    project: repoName,
    timeoutJobCompleted,
    timeoutArtifactAvailable,
    requestInterval,
    logger,
  });

  // Dispatch workflow that will create a job with the unique step UUID
  await workflows.dispatch({ workflowId, ref: repoRef, stepUUID, environment });

  // Find recently dispatched job when it has finished
  const targetJob = await workflows.waitForTargetJobToSuccess({
    stepUUID,
    executedFrom,
  });

  // Download artifact from the job
  const artifact = await workflows.downloadJobFirstArtifact(targetJob);

  // Return artifact content as stringified JSON
  return getJsonFromZip(artifact.data as ArrayBuffer);
}

export async function runDeployAndGetArtifactAction(): Promise<void> {
  const logger = getLogger();
  try {
    const config = getConfig();
    const artifactJson = await deployAndGetArtifact(config, logger);
    core.setOutput(OUTPUT_VARS.MANIFEST, artifactJson);
  } catch (error) {
    logger.debug(`Action failed with error: ${(error as Error).message}`);
    core.setFailed((error as Error).message);
    throw error;
  }
}
