import * as core from "@actions/core";

const INPUT_VARS = {
  PROJECT: "project",
  TOKEN: "token",
  ENVIRONMENT: "environment",
};

export const OUTPUT_VARS = {
  MANIFEST: "manifest",
}

export function getRepoName(repoBaseName: string) {
  return `${repoBaseName}-platform`;
}

export function getConfig() {
  const repoName = getRepoName(core.getInput(INPUT_VARS.PROJECT, { required: true }));
  const token = core.getInput(INPUT_VARS.TOKEN, { required: true });
  const environment = core.getInput(INPUT_VARS.ENVIRONMENT, { required: true });

  return {
    timeoutJobCompleted: 600000,
    timeoutArtifactAvailable: 10000,
    repoName,
    repoRef: "main",
    workflowId: "deploy.yml",
    githubOwner: "Telefonica",
    githubToken: token,
    environment,
    requestInterval: 2000,
  };
}
