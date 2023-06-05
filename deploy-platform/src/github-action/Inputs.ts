import * as core from "@actions/core";

import { DeployInputs } from "../lib/Deploy.types";

export function getInputs(): DeployInputs {
  const project = core.getInput("project", { required: true });
  const token = core.getInput("token", { required: true });
  const environment = core.getInput("environment", { required: true });
  const repoName = core.getInput("repo-name");
  const workflowId = core.getInput("workflow-id");
  const ref = core.getInput("ref");
  const requestInterval = core.getInput("request-interval");
  return sanitizeInputs({
    project,
    token,
    environment,
    repoName,
    workflowId,
    ref,
    requestInterval,
  });
}

function sanitizeInputs(inputs: ActionInputs): DeployInputs {
  if (inputs.requestInterval) {
    const requestInterval = parseInt(inputs.requestInterval);
    if (isNaN(requestInterval)) {
      throw new Error("Input request-interval must be a number");
    } else {
      return { ...inputs, requestInterval };
    }
  } else {
    return { ...inputs, requestInterval: undefined };
  }
}

type ActionInputs = {
  project: string;
  token: string;
  environment: string;
  repoName?: string;
  workflowId?: string;
  ref?: string;
  requestInterval?: string;
};
