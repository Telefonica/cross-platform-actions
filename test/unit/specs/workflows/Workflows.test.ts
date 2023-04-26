import JSZip from "jszip";
import {
  getRunsResponse,
  getRunJobsResponse,
  GET_RUNS_PATH,
  GET_RUN_JOBS_PATH,
  DISPATCH_WORKFLOW_PATH,
  DOWNLOAD_RUN_ARTIFACT_PATH,
  GET_RUN_ARTIFACTS_PATH,
  getRunArtifactsResponse,
  downloadRunArtifactResponse,
} from "@support/fixtures/Octokit";
import { getLogger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

import { Workflows } from "@src/workflows/Workflows";
import type { WorkflowsInterface } from "@src/workflows/Workflows.types";

describe("Workflows module", () => {
  describe("Workflows class", () => {
    let workflows: WorkflowsInterface, logger;
    const OWNER = "foo-owner";
    const PROJECT = "foo-project";
    const TOKEN = "foo-token";
    const TIMEOUT_JOB = 1000;
    const TIMEOUT_ARTIFACT = 500;
    const REQUEST_INTERVAL = 100;
    const STEP_UUID = "foo-step-uuid";

    beforeEach(() => {
      logger = getLogger();
      workflows = new Workflows({
        logger,
        owner: OWNER,
        project: PROJECT,
        token: TOKEN,
        timeoutJobCompleted: TIMEOUT_JOB,
        timeoutArtifactAvailable: TIMEOUT_ARTIFACT,
        requestInterval: REQUEST_INTERVAL,
      });
    });

    describe("dispatchWorkflow method", () => {
      it("should call to Github sdk to dispatch a workflow", async () => {
        const WORKFLOW_ID = "foo-workflow-id";
        const REF = "foo-ref";
        const ENVIRONMENT = "foo-environment";

        await workflows.dispatch({
          workflowId: WORKFLOW_ID,
          ref: REF,
          stepUUID: STEP_UUID,
          environment: ENVIRONMENT,
        });
        expect(octokit.request).toHaveBeenCalledWith(DISPATCH_WORKFLOW_PATH, {
          owner: OWNER,
          repo: PROJECT,
          workflow_id: WORKFLOW_ID,
          ref: REF,
          inputs: {
            id: STEP_UUID,
            environment: ENVIRONMENT,
          },
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
      });
    });

    describe("waitForTargetJobToComplete method", () => {
      it("should return the data of the target job", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUNS_PATH) {
            return getRunsResponse();
          } else if (requestPath === GET_RUN_JOBS_PATH) {
            return getRunJobsResponse(STEP_UUID);
          }
        });

        const result = await workflows.waitForTargetJobToComplete({
          stepUUID: STEP_UUID,
          executedFrom: "foo-executed-from",
        });

        expect(result).toEqual({
          conclusion: "success",
          name: "foo-job-name",
          id: "foo-job-id",
          steps: [
            {
              name: `Set ID (${STEP_UUID})`,
            },
          ],
        });
      });

      it("should retry when github does not return completed workflows", async () => {
        let retries = 0;
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUNS_PATH) {
            // 3 times returns in progress
            if (retries < 3) {
              retries++;
              return getRunsResponse("in_progress");
            }
            // 4th time returns completed
            return getRunsResponse();
          } else if (requestPath === GET_RUN_JOBS_PATH) {
            // 5th time returns run jobs
            return getRunJobsResponse(STEP_UUID);
          }
        });

        await workflows.waitForTargetJobToComplete({
          stepUUID: STEP_UUID,
          executedFrom: "foo-executed-from",
        });

        expect(octokit.request.mock.calls.length).toEqual(5);
      });

      it("should retry when it does not find a workflow containing a job with a step containing the specified UUID", async () => {
        let retries = 0;
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUNS_PATH) {
            return getRunsResponse();
          } else if (requestPath === GET_RUN_JOBS_PATH) {
            // 2 times returns another uuid (4 api calls in total, because it requests also the runs)
            if (retries < 2) {
              retries++;
              return getRunJobsResponse("wrong-uuid");
            }
            // 3rd time returns right uuid (6 api calls in total, because it requests also the runs)
            return getRunJobsResponse(STEP_UUID);
          }
        });

        await workflows.waitForTargetJobToComplete({
          stepUUID: STEP_UUID,
          executedFrom: "foo-executed-from",
        });

        expect(octokit.request.mock.calls.length).toEqual(6);
      });

      it("should throw when timeout is reached and no job was found", async () => {
        octokit.request.mockImplementation(() => {
          return getRunsResponse("in_progress");
        });
        await expect(() =>
          workflows.waitForTargetJobToComplete({
            stepUUID: STEP_UUID,
            executedFrom: "foo-executed-from",
          })
        ).rejects.toThrowError("Timed out while waiting for target job to complete");
      });
    });
    describe("waitForTargetJobToSuccess method", () => {
      it("should return the data of the target job", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUNS_PATH) {
            return getRunsResponse();
          } else if (requestPath === GET_RUN_JOBS_PATH) {
            return getRunJobsResponse(STEP_UUID);
          }
        });

        const result = await workflows.waitForTargetJobToSuccess({
          stepUUID: STEP_UUID,
          executedFrom: "foo-executed-from",
        });

        expect(result).toEqual({
          conclusion: "success",
          name: "foo-job-name",
          id: "foo-job-id",
          steps: [
            {
              name: `Set ID (${STEP_UUID})`,
            },
          ],
        });
      });
    });
    describe("downloadJobFirstArtifact method", () => {
      it("should return the artifact uploaded for the target job", async () => {
        const EXPECTED_ARTIFACT_JSON = { foo: "bar" };
        const zip = new JSZip();
        const zipFile = await zip
          .file("foo.json", JSON.stringify(EXPECTED_ARTIFACT_JSON))
          .generateAsync({ type: "arraybuffer" });

        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUN_ARTIFACTS_PATH) {
            return getRunArtifactsResponse();
          } else if (requestPath === DOWNLOAD_RUN_ARTIFACT_PATH) {
            return downloadRunArtifactResponse(zipFile);
          }
        });

        const result = await workflows.downloadJobFirstArtifact(getRunJobsResponse(STEP_UUID).data.jobs[0]);
        expect(result.data).toEqual(zipFile);
      });
      it("should throw when timeout is reached and no artifact was found", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUN_ARTIFACTS_PATH) {
            return getRunArtifactsResponse(true);
          } else if (requestPath === DOWNLOAD_RUN_ARTIFACT_PATH) {
            return downloadRunArtifactResponse(null);
          }
        });
        await expect(() =>
          workflows.downloadJobFirstArtifact(getRunJobsResponse(STEP_UUID).data.jobs[0])
        ).rejects.toThrowError("Timed out while trying to download artifact");
      });
    });
  });
});
