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
  return {
    project,
    token,
    environment,
    repoName,
    workflowId,
    ref,
    requestInterval: ensureNumericValue(requestInterval),
  };
}

function ensureNumericValue(value: string): number | undefined {
  if (!value) return undefined;
  const numericValue = parseInt(value);
  if (isNaN(numericValue)) {
    throw new Error("Input request-interval must be a number");
  }
  return numericValue;
}
