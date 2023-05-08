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
    repoName: "foo-repo-name",
    workflowId: "foo-workflow-id",
    ref: "foo-ref",
  };
}
