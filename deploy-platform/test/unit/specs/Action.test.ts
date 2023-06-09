import JSZip from "jszip";

import {
  getRunsResponse,
  getRunJobsResponse,
  getRunArtifactsResponse,
  GET_RUNS_PATH,
  GET_RUN_JOBS_PATH,
  GET_RUN_ARTIFACTS_PATH,
  DOWNLOAD_RUN_ARTIFACT_PATH,
  downloadRunArtifactResponse,
  DISPATCH_WORKFLOW_PATH,
  GET_WORKFLOWS_PATH,
  getWorkflowsResponse,
} from "@support/fixtures/Octokit";
import { actionsCore } from "@support/mocks/ActionsCore";
import { octokit } from "@support/mocks/Octokit";
import { uuid } from "@support/mocks/Uuid";

import { runDeployAndGetArtifactAction } from "@src/github-action/Action";
import * as ConfigLib from "@src/lib/config/Config";
import { DeployInputs } from "@src/lib/Deploy.types";

const CONFIG = {
  timeoutJobCompleted: 500,
  timeoutArtifactAvailable: 500,
  repoName: "foo-repo-name-platform",
  repoRef: "foo-repo-ref",
  workflowFileName: "foo-workflow-name",
  workflowId: undefined,
  githubOwner: "foo-github-owner",
  githubToken: "foo-github-token",
  environment: "foo-environment",
  requestInterval: 500,
};

describe("runDeployAndGetArtifactAction method", () => {
  const EXPECTED_ARTIFACT_JSON = { foo: "bar" };
  const STEP_UUID = "foo-step-uuid";
  const FOO_REPO_NAME = "foo-repo-name";
  let zipFile: ArrayBuffer;

  beforeEach(async () => {
    const zip = new JSZip();
    zipFile = await zip
      .file("foo.json", JSON.stringify(EXPECTED_ARTIFACT_JSON))
      .generateAsync({ type: "arraybuffer" });

    // Successful case
    uuid.v4.mockReturnValue(STEP_UUID);
    octokit.request.mockImplementation((requestPath) => {
      switch (requestPath) {
        case GET_WORKFLOWS_PATH:
          return getWorkflowsResponse(`deploy-${CONFIG.environment}.yml`);
        case GET_RUNS_PATH:
          return getRunsResponse();
        case GET_RUN_JOBS_PATH:
          return getRunJobsResponse(STEP_UUID);
        case GET_RUN_ARTIFACTS_PATH:
          return getRunArtifactsResponse();
        case DOWNLOAD_RUN_ARTIFACT_PATH:
          return downloadRunArtifactResponse(zipFile);
      }
    });

    actionsCore.getInput.mockImplementation((inputName) => {
      if (inputName === "project") return FOO_REPO_NAME;
      if (inputName === "environment") return CONFIG.environment;
      if (inputName === "token") return CONFIG.githubToken;
    });
  });

  describe("when it is success", () => {
    it('should set "manifest" action output with artifact content as stringified JSON', async () => {
      await runDeployAndGetArtifactAction();

      expect(actionsCore.setOutput).toHaveBeenCalledWith(
        "manifest",
        JSON.stringify(EXPECTED_ARTIFACT_JSON)
      );
    });
  });

  describe("when sending params to Github API", () => {
    it("should send provided owner when dispatching workflow", async () => {
      await runDeployAndGetArtifactAction();

      expect(octokit.request.mock.calls[1][0]).toEqual(DISPATCH_WORKFLOW_PATH);
      expect(octokit.request.mock.calls[1][1].owner).toEqual("Telefonica");
    });

    it('should send repoName from action input "project" adding "-platform" when dispatching workflow', async () => {
      await runDeployAndGetArtifactAction();

      expect(octokit.request.mock.calls[1][0]).toEqual(DISPATCH_WORKFLOW_PATH);
      expect(octokit.request.mock.calls[1][1].repo).toEqual(`${FOO_REPO_NAME}-platform`);
    });

    it('should use custom repo name from action input "repo-name" when dispatching workflow', async () => {
      actionsCore.getInput.mockImplementation((inputName) => {
        if (inputName === "environment") return CONFIG.environment;
        if (inputName === "project") return FOO_REPO_NAME;
        if (inputName === "repo-name") return "foo-repo-name";
      });
      await runDeployAndGetArtifactAction();

      expect(octokit.request.mock.calls[1][0]).toEqual(DISPATCH_WORKFLOW_PATH);
      expect(octokit.request.mock.calls[1][1].repo).toEqual(`foo-repo-name`);
    });
  });

  describe("when it does not found a successful workflow job containing a step with the provided stepUUID", () => {
    beforeEach(() => {
      jest.mock("@src/lib/config/Config");
      const getConfig = jest.spyOn(ConfigLib, "getConfig");
      getConfig.mockReturnValue(CONFIG);
      octokit.request.mockImplementation((requestPath) => {
        switch (requestPath) {
          case GET_WORKFLOWS_PATH:
            return getWorkflowsResponse(CONFIG.workflowFileName);
          case GET_RUNS_PATH:
            return getRunsResponse();
          case GET_RUN_JOBS_PATH:
            return getRunJobsResponse("foo-wrong-step-uuid");
          case GET_RUN_ARTIFACTS_PATH:
            return getRunArtifactsResponse();
          case DOWNLOAD_RUN_ARTIFACT_PATH:
            return downloadRunArtifactResponse(zipFile);
        }
      });
    });

    it("should throw with timeout message", async () => {
      await expect(() => runDeployAndGetArtifactAction()).rejects.toThrow(
        "Timed out while waiting for target job to complete"
      );
    });
  });

  describe("when request interval is provided", () => {
    let defaultConfig: DeployInputs;

    beforeEach(() => {
      actionsCore.getInput.mockImplementation((inputName) => {
        if (inputName === "project") return FOO_REPO_NAME;
        if (inputName === "environment") return CONFIG.environment;
        if (inputName === "token") return CONFIG.githubToken;
        if (inputName === "request-interval") return "100";
      });

      defaultConfig = {
        environment: CONFIG.environment,
        project: FOO_REPO_NAME,
        token: CONFIG.githubToken,
        requestInterval: 100,
      };
    });

    jest.mock("@src/lib/config/Config");
    const getConfig = jest.spyOn(ConfigLib, "getConfig");

    it("should use provided request interval", async () => {
      await runDeployAndGetArtifactAction();

      expect(getConfig).toHaveBeenCalledWith(defaultConfig);
    });

    it("should set action to error when request interval is not a number", async () => {
      actionsCore.getInput.mockImplementation((inputName) => {
        if (inputName === "project") return FOO_REPO_NAME;
        if (inputName === "environment") return CONFIG.environment;
        if (inputName === "token") return CONFIG.githubToken;
        if (inputName === "request-interval") return "foo";
      });

      await expect(() => runDeployAndGetArtifactAction()).rejects.toThrow(
        "Input request-interval must be a number"
      );
      expect(actionsCore.setFailed).toHaveBeenCalledWith(
        "Input request-interval must be a number"
      );
    });
  });
});
