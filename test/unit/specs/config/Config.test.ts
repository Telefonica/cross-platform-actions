import { actionsCore } from "../../support/mocks/ActionsCore";
import { getConfig, INPUT_VARS, TIMEOUT_VARS, DEFAULT_VARS } from "../../../../src/config/Config";

describe("Config Module", () => {
    it("should return the expected config", () => {
        const expectedConfig = {
            timeoutJobCompleted: TIMEOUT_VARS.JOB_COMPLETED,
            timeoutArtifactAvailable: TIMEOUT_VARS.ARTIFACT_AVAILABLE,
            repoName: "foo-repo-name-platform",
            repoRef: DEFAULT_VARS.REPO_REF,
            workflowId: DEFAULT_VARS.WORKFLOW_ID,
            githubOwner: DEFAULT_VARS.GITHUB_OWNER,
            githubToken: "foo-github-token",
            environment: "foo-environment",
            requestInterval: TIMEOUT_VARS.REQUEST_INTERVAL,
        };
        actionsCore.getInput.mockImplementation((inputVar) => {
            switch (inputVar) {
                case INPUT_VARS.PROJECT:
                    return "foo-repo-name";
                case INPUT_VARS.TOKEN:
                    return "foo-github-token";
                case INPUT_VARS.ENVIRONMENT:
                    return "foo-environment";
            }
        });
        const config = getConfig();
        expect(config).toEqual(expectedConfig);
    });
});
