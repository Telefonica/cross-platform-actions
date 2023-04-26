import * as core from "@actions/core";

import type { Config } from "./Config.types";

const INPUT_VARS = {
  PROJECT: "project",
  TOKEN: "token",
  ENVIRONMENT: "environment",
  REPO_SUFFIX: "repo-suffix",
  WORKFLOW_ID: "workflow-id",
  REF: "ref",
};

export const OUTPUT_VARS = {
  MANIFEST: "manifest",
};

const DEFAULT_REPO_SUFFIX = "-platform";

export function getRepoName(repoBaseName: string, customRepoSuffix?: string): string {
  const suffix = customRepoSuffix !== undefined ? customRepoSuffix : DEFAULT_REPO_SUFFIX;
  return `${repoBaseName}${suffix}`;
}

export function getConfig(): Config {
  const repoName = getRepoName(
    core.getInput(INPUT_VARS.PROJECT, { required: true }),
    core.getInput(INPUT_VARS.REPO_SUFFIX)
  );
  const token = core.getInput(INPUT_VARS.TOKEN, { required: true });
  const environment = core.getInput(INPUT_VARS.ENVIRONMENT, { required: true });
  const workflowId = core.getInput(INPUT_VARS.WORKFLOW_ID) || "deploy.yml";
  const repoRef = core.getInput(INPUT_VARS.REF) || "main";

  return {
    timeoutJobCompleted: 600000,
    timeoutArtifactAvailable: 10000,
    repoName,
    repoRef,
    workflowId: workflowId,
    githubOwner: "Telefonica",
    githubToken: token,
    environment,
    requestInterval: 2000,
  };
}
