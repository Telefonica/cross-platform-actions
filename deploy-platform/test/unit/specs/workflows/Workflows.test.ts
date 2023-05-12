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
  GET_WORKFLOWS_PATH,
  getWorkflowsResponse,
} from "@support/fixtures/Octokit";
import { getLogger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

import { GetRunJobResponse, GetWorkflowsResponse } from "@src/lib/workflows/Github.types";
import {
  Workflows,
  findWorkflowWithPathEqualToLowercaseName,
  findWorkflowWithPathEqualsToLowercaseNameReplacingDashes,
  findWorkflowByName,
} from "@src/lib/workflows/Workflows";
import type { WorkflowsInterface } from "@src/lib/workflows/Workflows.types";

describe("Workflows module", () => {
  describe("Workflows class", () => {
    let workflows: WorkflowsInterface, logger: ReturnType<typeof getLogger>;
    const OWNER = "foo-owner";
    const PROJECT = "foo-project";
    const TOKEN = "foo-token";
    const TIMEOUT_JOB = 1000;
    const TIMEOUT_ARTIFACT = 500;
    const REQUEST_INTERVAL = 100;
    const STEP_UUID = "foo-step-uuid";
    const WORKFLOW_ID = 1234;

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

    describe("findWorkflowToDispatch method", () => {
      const workflowFileName = "foo-workflow-file-name";

      it("should return the id of the workflow to dispatch", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_WORKFLOWS_PATH) {
            return getWorkflowsResponse(workflowFileName);
          }
        });
        const result = await workflows.findWorkflowToDispatch(workflowFileName);

        expect(result).toEqual(WORKFLOW_ID);
      });
    });

    describe("when looking for a workflow which matches workflowFileName", () => {
      const workflowFileName = "foo-workflow-file-name";

      it("should find it when the name of the yaml is uppercase", async () => {
        const workflowsResponse = getWorkflowsResponse(
          workflowFileName.toUpperCase()
        ) as GetWorkflowsResponse;

        expect(
          findWorkflowWithPathEqualToLowercaseName(
            workflowsResponse.data.workflows,
            workflowFileName
          )?.id
        ).toEqual(WORKFLOW_ID);
      });

      it("should find it when the name of the yaml have '_' instead of '-'", async () => {
        const workflowsResponse = getWorkflowsResponse(
          workflowFileName.replaceAll("-", "_")
        ) as GetWorkflowsResponse;

        expect(
          findWorkflowWithPathEqualsToLowercaseNameReplacingDashes(
            workflowsResponse.data.workflows,
            workflowFileName
          )?.id
        ).toEqual(WORKFLOW_ID);
      });

      it("should find it when the workflowFileName is the name of the workflow instead", async () => {
        const workflowsResponse = getWorkflowsResponse() as GetWorkflowsResponse;

        expect(
          findWorkflowByName(workflowsResponse.data.workflows, "foo-workflow-name")?.id
        ).toEqual(WORKFLOW_ID);
      });

      describe("when the workflow is not found", () => {
        it("should throw an error", async () => {
          octokit.request.mockImplementation((requestPath) => {
            if (requestPath === GET_WORKFLOWS_PATH) {
              return getWorkflowsResponse();
            }
          });

          await expect(workflows.findWorkflowToDispatch(workflowFileName)).rejects.toThrow(
            `Workflow ${workflowFileName} not found`
          );
        });
      });
    });

    describe("dispatchWorkflow method", () => {
      it("should call to Github sdk to dispatch a workflow", async () => {
        const REF = "foo-ref";

        await workflows.dispatch({
          workflowId: WORKFLOW_ID,
          ref: REF,
          stepUUID: STEP_UUID,
        });

        expect(octokit.request).toHaveBeenCalledWith(DISPATCH_WORKFLOW_PATH, {
          owner: OWNER,
          repo: PROJECT,
          workflow_id: WORKFLOW_ID,
          ref: REF,
          inputs: {
            id: STEP_UUID,
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
          id: WORKFLOW_ID,
          steps: [
            {
              name: `${STEP_UUID}`,
            },
          ],
        });
      });

      it("should return the data of the target job even if the step name contains more than only the UUID", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUNS_PATH) {
            return getRunsResponse();
          } else if (requestPath === GET_RUN_JOBS_PATH) {
            return getRunJobsResponse(`Set ID: ${STEP_UUID} - foo`);
          }
        });

        const result = await workflows.waitForTargetJobToComplete({
          stepUUID: STEP_UUID,
          executedFrom: "foo-executed-from",
        });

        expect(result).toEqual({
          conclusion: "success",
          name: "foo-job-name",
          id: WORKFLOW_ID,
          steps: [
            {
              name: `Set ID: ${STEP_UUID} - foo`,
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
        ).rejects.toThrow("Timed out while waiting for target job to complete");
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
          id: WORKFLOW_ID,
          steps: [
            {
              name: `${STEP_UUID}`,
            },
          ],
        });
      });
    });

    describe("downloadJobFirstArtifact method", () => {
      const EXPECTED_ARTIFACT_JSON = { foo: "bar" };
      const zip = new JSZip();

      it("should return the first artifact uploaded for the target job", async () => {
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

        const result = await workflows.downloadJobFirstArtifact(
          getRunJobsResponse(STEP_UUID).data.jobs[0] as GetRunJobResponse
        );

        expect(result.data).toEqual(zipFile);
      });

      it("should throw when timeout is reached and no artifact was found", async () => {
        octokit.request.mockImplementation((requestPath) => {
          if (requestPath === GET_RUN_ARTIFACTS_PATH) {
            return getRunArtifactsResponse({ voidArtifact: true });
          }
        });

        await expect(() =>
          workflows.downloadJobFirstArtifact(
            getRunJobsResponse(STEP_UUID).data.jobs[0] as GetRunJobResponse
          )
        ).rejects.toThrow("Timed out while trying to download artifact");
      });

      describe("when there is more than one artifact", () => {
        const multipleArtifactsResponse = {
          data: {
            total_count: 2,
            artifacts: [
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          },
        };

        it("should return the first artifact uploaded for the target workflow", async () => {
          const zipFile = await zip
            .file("foo.json", JSON.stringify(EXPECTED_ARTIFACT_JSON))
            .generateAsync({ type: "arraybuffer" });
          octokit.request.mockImplementation((requestPath) => {
            if (requestPath === GET_RUN_ARTIFACTS_PATH) {
              return multipleArtifactsResponse;
            } else if (requestPath === DOWNLOAD_RUN_ARTIFACT_PATH) {
              return downloadRunArtifactResponse(zipFile);
            }
          });

          await workflows.downloadJobFirstArtifact(
            getRunJobsResponse(STEP_UUID).data.jobs[0] as GetRunJobResponse
          );

          expect(octokit.request.mock.calls[1][1].artifact_id).toEqual(1);
        });

        it("should log a warning message", async () => {
          const zipFile = await zip
            .file("foo.json", JSON.stringify(EXPECTED_ARTIFACT_JSON))
            .generateAsync({ type: "arraybuffer" });
          octokit.request.mockImplementation((requestPath) => {
            if (requestPath === GET_RUN_ARTIFACTS_PATH) {
              return multipleArtifactsResponse;
            } else if (requestPath === DOWNLOAD_RUN_ARTIFACT_PATH) {
              return downloadRunArtifactResponse(zipFile);
            }
          });

          await workflows.downloadJobFirstArtifact(
            getRunJobsResponse(STEP_UUID).data.jobs[0] as GetRunJobResponse
          );

          expect(logger.warning).toHaveBeenCalledWith(
            "Caution!, there are more than one artifact uploaded for this workflow, downloading the first one"
          );
        });
      });
    });
  });
});
