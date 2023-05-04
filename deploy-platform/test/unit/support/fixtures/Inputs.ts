export function getRequiredInputs() {
  return {
    project: "foo-project",
    token: "foo-token",
    environment: "foo-environment",
  };
}

export function getAllInputs() {
  return {
    project: "foo-project",
    token: "foo-token",
    environment: "foo-environment",
    repoSuffix: "foo-repo-suffix",
    workflowId: "foo-workflow-id",
    ref: "foo-ref",
  };
}
