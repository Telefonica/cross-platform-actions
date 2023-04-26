import * as core from "@actions/core";

import type { Config } from "./Config.types";

export const INPUT_VARS = {
  PROJECT: "project",
  TOKEN: "token",
  ENVIRONMENT: "environment",
};

export const TIMEOUT_VARS = {
  JOB_COMPLETED: 600000,
  ARTIFACT_AVAILABLE: 10000,
  REQUEST_INTERVAL: 2000,
};

export const OUTPUT_VARS = {
  MANIFEST: "manifest",
};

export const DEFAULT_VARS = {
  GITHUB_OWNER: "Telefonica",
  REPO_REF: "main",
  WORKFLOW_ID: "deploy.yml",
};

export function getRepoName(repoBaseName: string): string {
  return `${repoBaseName}-platform`;
}

export function getConfig(): Config {
  const repoName = getRepoName(core.getInput(INPUT_VARS.PROJECT, { required: true }));
  const token = core.getInput(INPUT_VARS.TOKEN, { required: true });
  const environment = core.getInput(INPUT_VARS.ENVIRONMENT, { required: true });

  return {
    timeoutJobCompleted: TIMEOUT_VARS.JOB_COMPLETED,
    timeoutArtifactAvailable: TIMEOUT_VARS.ARTIFACT_AVAILABLE,
    repoName,
    repoRef: DEFAULT_VARS.REPO_REF,
    workflowId: DEFAULT_VARS.WORKFLOW_ID,
    githubOwner: DEFAULT_VARS.GITHUB_OWNER,
    githubToken: token,
    environment,
    requestInterval: TIMEOUT_VARS.REQUEST_INTERVAL,
  };
}
