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
} from "@support/fixtures/Octokit";
import { actionsCore } from "@support/mocks/ActionsCore";
import { getLogger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";
import { uuid } from "@support/mocks/Uuid";

import * as Config from "@src/config/Config";
import { deployAndGetArtifact, runDeployAndGetArtifactAction } from "@src/Deploy";
import { Logger } from "@src/support/Logger.types";

const CONFIG = {
  timeoutJobCompleted: 500,
  timeoutArtifactAvailable: 500,
  repoName: "foo-repo-name-platform",
  repoRef: "foo-repo-ref",
  workflowId: "foo-workflow-id",
  githubOwner: "foo-github-owner",
  githubToken: "foo-github-token",
  environment: "foo-environment",
  requestInterval: 500,
};

describe("Deploy module", () => {
  const EXPECTED_ARTIFACT_JSON = { foo: "bar" };
  const STEP_UUID = "foo-step-uuid";
  let zipFile: ArrayBuffer, logger: Logger;

  beforeEach(async () => {
    const zip = new JSZip();
    zipFile = await zip
      .file("foo.json", JSON.stringify(EXPECTED_ARTIFACT_JSON))
      .generateAsync({ type: "arraybuffer" });

    logger = getLogger();

    // Successful case
    uuid.v4.mockReturnValue(STEP_UUID);
    octokit.request.mockImplementation((requestPath) => {
      switch (requestPath) {
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
  });

  describe("deployAndGetArtifact method", () => {
    describe("when it is success", () => {
      it("should return artifact content as stringified JSON", async () => {
        const artifactJson = await deployAndGetArtifact(CONFIG, logger);
        expect(JSON.parse(artifactJson)).toEqual(EXPECTED_ARTIFACT_JSON);
      });
    });

    describe("when it does not found a successful workflow job containing a step with the provided stepUUID", () => {
      beforeEach(() => {
        octokit.request.mockImplementation((requestPath) => {
          switch (requestPath) {
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
        await expect(() => deployAndGetArtifact(CONFIG, logger)).rejects.toThrow(
          "Timed out while waiting for target job to complete"
        );
      });

      it("should throw after time run out", async () => {
        const now = Date.now();

        await expect(() => deployAndGetArtifact(CONFIG, logger)).rejects.toThrow();
        const elapsed = Date.now() - now;
        expect(elapsed).toBeGreaterThanOrEqual(CONFIG.timeoutJobCompleted);
      });
    });

    describe("when sending params to Github API", () => {
      it("should send provided owner when dispatching workflow", async () => {
        await deployAndGetArtifact(CONFIG, logger);
        expect(octokit.request.mock.calls[0][0]).toEqual(DISPATCH_WORKFLOW_PATH);
        expect(octokit.request.mock.calls[0][1].owner).toEqual(CONFIG.githubOwner);
      });
    });
  });

  describe("runDeployAndGetArtifactAction method", () => {
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
        expect(octokit.request.mock.calls[0][0]).toEqual(DISPATCH_WORKFLOW_PATH);
        expect(octokit.request.mock.calls[0][1].owner).toEqual("Telefonica");
      });

      it('should send repoName from action input "project" adding "-platform" when dispatching workflow', async () => {
        const FOO_REPO_NAME = "foo-repo-name";
        actionsCore.getInput.mockImplementation((inputName) => {
          if (inputName === "project") return FOO_REPO_NAME;
        });
        await runDeployAndGetArtifactAction();
        expect(octokit.request.mock.calls[0][0]).toEqual(DISPATCH_WORKFLOW_PATH);
        expect(octokit.request.mock.calls[0][1].repo).toEqual(`${FOO_REPO_NAME}-platform`);
      });

      it('should add custom suffix from action input "repo-suffix" to repo name when dispatching workflow', async () => {
        const FOO_REPO_NAME = "foo-repo-name";
        actionsCore.getInput.mockImplementation((inputName) => {
          if (inputName === "project") return FOO_REPO_NAME;
          if (inputName === "repo-suffix") return "-custom-suffix";
        });
        await runDeployAndGetArtifactAction();
        expect(octokit.request.mock.calls[0][0]).toEqual(DISPATCH_WORKFLOW_PATH);
        expect(octokit.request.mock.calls[0][1].repo).toEqual(`${FOO_REPO_NAME}-custom-suffix`);
      });
    });

    describe("when it does not found a successful workflow job containing a step with the provided stepUUID", () => {
      beforeEach(() => {
        jest.mock("@src/config/Config");
        const getConfig = jest.spyOn(Config, "getConfig");
        getConfig.mockReturnValue(CONFIG);
        octokit.request.mockImplementation((requestPath) => {
          switch (requestPath) {
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
  });
});
