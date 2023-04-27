import { actionsCore } from "@support/mocks/ActionsCore";

import { getConfig, INPUT_VARS, DEFAULT_VARS } from "@src/config/Config";

describe("Config Module", () => {
  it("should return the default value of ref and workflow_Id; and the values recover from input of repoName, token and environment in config", () => {
    const config = getConfig();
    expect(config.repoRef).toEqual(DEFAULT_VARS.REPO_REF);
    expect(config.workflowId).toEqual(DEFAULT_VARS.WORKFLOW_ID);
    expect(config.githubOwner).toEqual(DEFAULT_VARS.GITHUB_OWNER);
  });

  it("should return the values recover from input of ref, workflow_Id in config", () => {
    actionsCore.getInput.mockImplementation((inputVar) => {
      switch (inputVar) {
        case INPUT_VARS.REF:
          return "foo-ref";
        case INPUT_VARS.WORKFLOW_ID:
          return "foo-workflow-id";
      }
    });
    const config = getConfig();
    expect(config.repoRef).toEqual("foo-ref");
    expect(config.workflowId).toEqual("foo-workflow-id");
  });
});
