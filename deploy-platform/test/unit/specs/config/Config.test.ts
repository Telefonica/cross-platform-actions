import { getRequiredInputs, getAllInputs } from "@support/fixtures/Inputs";

import { getConfig, DEFAULT_VARS } from "@src/lib/config/Config";

describe("Config Module", () => {
  describe("getConfig method", () => {
    describe("when no inputs are provided for repoRef and githubOwner", () => {
      it("should return default values", () => {
        const inputs = getRequiredInputs();
        const config = getConfig(inputs);

        expect(config.repoRef).toEqual(DEFAULT_VARS.REPO_REF);
        expect(config.githubOwner).toEqual(DEFAULT_VARS.GITHUB_OWNER);
      });
    });

    describe("when no input is provided for workflowId", () => {
      it('should return a workflow id with the pattern "deploy-[input.environment].yml"', () => {
        const inputs = getRequiredInputs();
        const config = getConfig({ ...inputs, environment: "production" });

        expect(config.workflowId).toEqual("deploy-production.yml");

        const config2 = getConfig({ ...inputs, environment: "develop" });

        expect(config2.workflowId).toEqual("deploy-develop.yml");
      });
    });

    describe("when ref and workflow_Id are provided", () => {
      it("should return the values provided", () => {
        const inputs = getAllInputs();
        const config = getConfig(inputs);

        expect(config.repoRef).toEqual("foo-ref");
        expect(config.workflowId).toEqual("foo-workflow-id");
      });
    });

    describe("when only workflow_id is provided", () => {
      it("should return the value provided", () => {
        const config = getConfig({
          ...getRequiredInputs(),
          workflowId: "foo-workflow-id",
        });

        expect(config.workflowId).toEqual("foo-workflow-id");
      });

      it("should return the repo name adding the default suffix", () => {
        const config = getConfig({
          ...getRequiredInputs(),
          workflowId: "foo-workflow-id",
        });

        expect(config.repoName).toEqual("foo-project-platform");
      });
    });

    describe("when repoName is provided", () => {
      it("should return repoName adding concatenating the project and the repoName", () => {
        const inputs = getAllInputs();
        const config = getConfig({ ...inputs, repoName: "repo-name" });

        expect(config.repoName).toEqual("repo-name");
      });
    });
  });
});
