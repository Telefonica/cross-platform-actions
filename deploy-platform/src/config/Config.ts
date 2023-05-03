import * as core from "@actions/core";

import type { Config } from "./Config.types";

export const INPUT_VARS = {
  PROJECT: "project",
  TOKEN: "token",
  ENVIRONMENT: "environment",
  REPO_SUFFIX: "repo-suffix",
  WORKFLOW_ID: "workflow-id",
  REF: "ref",
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
  REPO_SUFFIX: "-platform",
};

export function getRepoName(repoBaseName: string, customRepoSuffix?: string): string {
  const suffix = customRepoSuffix !== undefined ? customRepoSuffix : DEFAULT_VARS.REPO_SUFFIX;
  return `${repoBaseName}${suffix}`;
}

export function getConfig(): Config {
  const repoName = getRepoName(
    core.getInput(INPUT_VARS.PROJECT, { required: true }),
    core.getInput(INPUT_VARS.REPO_SUFFIX)
  );
  const token = core.getInput(INPUT_VARS.TOKEN, { required: true });
  const environment = core.getInput(INPUT_VARS.ENVIRONMENT, { required: true });
  const workflowId = core.getInput(INPUT_VARS.WORKFLOW_ID) || DEFAULT_VARS.WORKFLOW_ID;
  const repoRef = core.getInput(INPUT_VARS.REF) || DEFAULT_VARS.REPO_REF;

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
  };
}
