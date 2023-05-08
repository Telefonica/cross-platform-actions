import * as core from "@actions/core";

export function getInputs() {
  const project = core.getInput("project", { required: true });
  const token = core.getInput("token", { required: true });
  const environment = core.getInput("environment", { required: true });
  const repoSuffix = core.getInput("repo-suffix");
  const workflowId = core.getInput("workflow-id");
  const ref = core.getInput("ref");
  return {
    project,
    token,
    environment,
    repoSuffix,
    workflowId,
    ref,
    foo: core.getInput("foo"),
  };
}
