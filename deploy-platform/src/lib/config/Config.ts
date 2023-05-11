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
  WORKFLOW_FILE_NAME_PREFIX: "deploy",
  WORKFLOW_FILE_NAME_EXTENSION: "yml",
  REPO_SUFFIX: "-platform",
};

export const CONFIG_SECRETS = ["githubToken"] as (keyof Config)[];

export function getRepoName(repoBaseName: string, customRepoName?: string): string {
  if (customRepoName) {
    return customRepoName;
  }
  return `${repoBaseName}${DEFAULT_VARS.REPO_SUFFIX}`;
}

export function getWorkflowFileName(environment: string): string {
  return `${DEFAULT_VARS.WORKFLOW_FILE_NAME_PREFIX}-${environment}.${DEFAULT_VARS.WORKFLOW_FILE_NAME_EXTENSION}`;
}

export function getConfig(inputs: DeployInputs): Config {
  const repoName = getRepoName(inputs.project, inputs.repoName);
  const token = inputs.token;
  const environment = inputs.environment;
  let workflowId, workflowFileName;
  if (inputs.workflowId) {
    if (isNaN(inputs.workflowId as number)) {
      workflowFileName = inputs.workflowId as string;
    } else {
      workflowId = inputs.workflowId as number;
    }
  } else {
    workflowFileName = getWorkflowFileName(environment);
  }
  const repoRef = inputs.ref || DEFAULT_VARS.REPO_REF;

  return {
    timeoutJobCompleted: TIMEOUT_VARS.JOB_COMPLETED,
    timeoutArtifactAvailable: TIMEOUT_VARS.ARTIFACT_AVAILABLE,
    repoName,
    repoRef,
    workflowFileName,
    workflowId,
    githubOwner: DEFAULT_VARS.GITHUB_OWNER,
    githubToken: token,
    environment,
    requestInterval: TIMEOUT_VARS.REQUEST_INTERVAL,
  };
}
