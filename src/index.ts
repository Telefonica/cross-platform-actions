import * as core from "@actions/core";
import { v4 as uuidv4 } from "uuid";

import { getConfig, OUTPUT_VARS } from "./config/Config";
import { formattedNow } from "./support/Date";
import { getLogger } from "./support/Logger";
import { getJsonFromZip } from "./support/Zip";
import { Workflows } from "./workflows/Workflows";

async function run() {
  try {
    const {
      timeoutJobCompleted,
      timeoutArtifactAvailable,
      repoName,
      repoRef,
      workflowId,
      githubOwner,
      githubToken,
      environment,
      requestInterval,
    } = getConfig();
    const stepUUID = uuidv4();
    const executedFrom = formattedNow();
    const logger = getLogger();

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

    const artifact = await workflows.downloadJobFirstArtifact(targetJob);
    const artifactJson = await getJsonFromZip(artifact.data as ArrayBuffer);
    core.setOutput(OUTPUT_VARS.MANIFEST, artifactJson);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
