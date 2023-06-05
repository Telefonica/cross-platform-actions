import * as core from "@actions/core";

export function getInputs() {
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
    requestInterval,
  };
}
