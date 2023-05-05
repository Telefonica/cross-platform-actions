import JSZip from "jszip";

import { getRequiredInputs } from "@support/fixtures/Inputs";
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
import { getLogger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";
import { uuid } from "@support/mocks/Uuid";

import * as Config from "@src/lib/config/Config";
import { deployAndGetArtifact } from "@src/lib/Deploy";
import { Logger } from "@src/lib/support/Logger.types";

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
const inputs = getRequiredInputs();

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
        const artifactJson = await deployAndGetArtifact(inputs, logger);

        expect(JSON.parse(artifactJson)).toEqual(EXPECTED_ARTIFACT_JSON);
      });
    });

    describe("when it does not found a successful workflow job containing a step with the provided stepUUID", () => {
      beforeEach(() => {
        jest.mock("@src/lib/config/Config");

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
        await expect(() => deployAndGetArtifact(inputs, logger)).rejects.toThrow(
          "Timed out while waiting for target job to complete"
        );
      });

      it("should throw after time run out", async () => {
        const now = Date.now();

        await expect(() => deployAndGetArtifact(inputs, logger)).rejects.toThrow();

        const elapsed = Date.now() - now;

        expect(elapsed).toBeGreaterThanOrEqual(CONFIG.timeoutJobCompleted);
      });
    });

    describe("when sending params to Github API", () => {
      it("should send provided owner when dispatching workflow", async () => {
        await deployAndGetArtifact(inputs, logger);

        expect(octokit.request.mock.calls[0][0]).toEqual(DISPATCH_WORKFLOW_PATH);
        expect(octokit.request.mock.calls[0][1].owner).toEqual(CONFIG.githubOwner);
      });
    });
  });
});
