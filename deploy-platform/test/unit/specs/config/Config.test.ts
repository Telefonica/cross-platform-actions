import { getRequiredInputs, getAllInputs } from "@support/fixtures/Inputs";

import { getConfig, DEFAULT_VARS } from "@src/lib/config/Config";

describe("Config Module", () => {
  it("should return default values when no inputs are provided for repoRef, workflowId and githubOwner", () => {
    const inputs = getRequiredInputs();
    const config = getConfig(inputs);

    expect(config.repoRef).toEqual(DEFAULT_VARS.REPO_REF);
    expect(config.workflowId).toEqual(DEFAULT_VARS.WORKFLOW_ID);
    expect(config.githubOwner).toEqual(DEFAULT_VARS.GITHUB_OWNER);
  });

  it("should return the values recover from input of ref, workflow_Id in config", () => {
    const inputs = getAllInputs();
    const config = getConfig(inputs);

    expect(config.repoRef).toEqual("foo-ref");
    expect(config.workflowId).toEqual("foo-workflow-id");
  });

  it("should return the values concat from input of project and repoSuffix in config", () => {
    const inputs = getAllInputs();
    const config = getConfig(inputs);

    expect(config.repoName).toEqual("foo-project".concat("foo-repo-suffix"));
  });
});
