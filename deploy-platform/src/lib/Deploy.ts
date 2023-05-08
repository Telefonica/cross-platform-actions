import { v4 as uuidV4 } from "uuid";

import { getConfig, CONFIG_SECRETS } from "./config/Config";
import { DeployInputs } from "./Deploy.types";
import { formattedNow } from "./support/Date";
import { Logger } from "./support/Logger.types";
import { logObject } from "./support/Logs";
import { getJsonFromZip } from "./support/Zip";
import { Workflows } from "./workflows/Workflows";

const INPUT_SECRETS = ["token"] as (keyof DeployInputs)[];

export async function deployAndGetArtifact(inputs: DeployInputs, logger: Logger): Promise<string> {
  const stepUUID = uuidV4();
  const executedFrom = formattedNow();
  const config = getConfig(inputs);

  logger.debug(`Inputs: ${logObject(inputs, INPUT_SECRETS)}`);
  logger.debug(`Configuration: ${logObject(config, CONFIG_SECRETS)}`);

  const workflows = new Workflows({
    token: config.githubToken,
    owner: config.githubOwner,
    project: config.repoName,
    timeoutJobCompleted: config.timeoutJobCompleted,
    timeoutArtifactAvailable: config.timeoutArtifactAvailable,
    requestInterval: config.requestInterval,
    logger,
  });

  // Dispatch workflow that will create a job with the unique step UUID
  await workflows.dispatch({
    workflowId: config.workflowId,
    ref: config.repoRef,
    stepUUID,
    environment: config.environment,
  });

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
