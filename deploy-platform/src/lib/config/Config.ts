import { DeployInputs } from "../Deploy.types";

import type { Config } from "./Config.types";

export const TIMEOUT_VARS = {
  JOB_COMPLETED: 600000,
  ARTIFACT_AVAILABLE: 10000,
  REQUEST_INTERVAL: 2000,
};

export const DEFAULT_VARS = {
  GITHUB_OWNER: "Telefonica",
  REPO_REF: "main",
  WORKFLOW_ID: "deploy.yml",
  REPO_SUFFIX: "-platform",
};

export const CONFIG_SECRETS = ["githubToken"];

export function getRepoName(repoBaseName: string, customRepoSuffix?: string): string {
  const suffix = customRepoSuffix !== undefined ? customRepoSuffix : DEFAULT_VARS.REPO_SUFFIX;
  return `${repoBaseName}${suffix}`;
}

export function getConfig(inputs: DeployInputs): Config {
  const repoName = getRepoName(inputs.project, inputs.repoSuffix);
  const token = inputs.token;
  const environment = inputs.environment;
  const workflowId = inputs.workflowId || DEFAULT_VARS.WORKFLOW_ID;
  const repoRef = inputs.ref || DEFAULT_VARS.REPO_REF;

  return {
    timeoutJobCompleted: TIMEOUT_VARS.JOB_COMPLETED,
    timeoutArtifactAvailable: TIMEOUT_VARS.ARTIFACT_AVAILABLE,
    repoName,
    repoRef,
    workflowId,
    githubOwner: DEFAULT_VARS.GITHUB_OWNER,
    githubToken: token,
    environment,
    requestInterval: TIMEOUT_VARS.REQUEST_INTERVAL,
    foo: `Foo: ${inputs.foo}`,
  };
}
