import {
  GET_RUNS_PATH,
  GET_RUN_JOBS_PATH,
  DISPATCH_WORKFLOW_PATH,
  GET_RUN_ARTIFACTS_PATH,
  DOWNLOAD_RUN_ARTIFACT_PATH,
} from "@support/fixtures/Octokit";
import { getLogger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

import { Github, throwIfJobFailed } from "@src/lib/workflows/Github";
import { GithubInterface, GetRunJobResponse } from "@src/lib/workflows/Github.types";

describe("Github module", () => {
  describe("Github class", () => {
    let github: GithubInterface, logger;
    const OWNER = "foo-owner";
    const PROJECT = "foo-project";
    const TOKEN = "foo-token";

    beforeEach(() => {
      logger = getLogger();
      github = new Github({
        logger,
        owner: OWNER,
        project: PROJECT,
        token: TOKEN,
      });
    });

    describe("dispatchWorkflow method", () => {
      const WORKFLOW_ID = "foo-workflow-id";
      const REF = "foo-ref";
      const STEP_UUID = "foo-step-uuid";

      it("should call to Github sdk to dispatch a workflow", async () => {
        await github.dispatchWorkflow({
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

      it("should throw an error if workflow dispatch fails", async () => {
        octokit.request.mockImplementation((inputValue) => {
          if (inputValue === DISPATCH_WORKFLOW_PATH) {
            throw new Error("foo-error");
          }
        });

        await expect(() =>
          github.dispatchWorkflow({
            workflowId: WORKFLOW_ID,
            ref: REF,
            stepUUID: STEP_UUID,
          })
        ).rejects.toThrow(`Error dispatching Github workflow: foo-error`);
      });
    });

    describe("getRuns method", () => {
      const RUN_DATE_FILTER = "foo-run-date-filter";
      const WORKFLOW_RUNS = { data: "foo-data" };

      it("should call to Github sdk to get workflow runs", async () => {
        await github.getRuns({ runDateFilter: RUN_DATE_FILTER });

        expect(octokit.request).toHaveBeenCalledWith(GET_RUNS_PATH, {
          owner: OWNER,
          repo: PROJECT,
          run_date_filter: RUN_DATE_FILTER,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
      });

      it("should return data returned by Github sdk", async () => {
        octokit.request.mockResolvedValue(WORKFLOW_RUNS);

        const result = await github.getRuns({ runDateFilter: RUN_DATE_FILTER });

        expect(result).toEqual(WORKFLOW_RUNS);
      });
    });

    describe("getRunJobs method", () => {
      const RUN_ID = 1234;
      const WORKFLOW_RUN_JOBS = { data: "foo-data" };

      it("should call to Github sdk to get workflow run jobs", async () => {
        await github.getRunJobs({ runId: RUN_ID });

        expect(octokit.request).toHaveBeenCalledWith(GET_RUN_JOBS_PATH, {
          owner: OWNER,
          repo: PROJECT,
          run_id: RUN_ID,
        });
      });

      it("should return data returned by Github sdk", async () => {
        octokit.request.mockResolvedValue(WORKFLOW_RUN_JOBS);
        const result = await github.getRunJobs({ runId: RUN_ID });

        expect(result).toEqual(WORKFLOW_RUN_JOBS);
      });
    });

    describe("getRunArtifacts method", () => {
      const RUN_ID = 1234;
      const WORKFLOW_RUN_ARTIFACTS = [{ data: "foo-data" }];

      it("should call to Github sdk to get workflow run artifacts", async () => {
        await github.getRunArtifacts({ runId: RUN_ID });

        expect(octokit.request).toHaveBeenCalledWith(GET_RUN_ARTIFACTS_PATH, {
          owner: OWNER,
          repo: PROJECT,
          run_id: RUN_ID,
        });
      });

      it("should return data returned by Github sdk", async () => {
        octokit.request.mockResolvedValue(WORKFLOW_RUN_ARTIFACTS);
        const result = await github.getRunArtifacts({ runId: RUN_ID });

        expect(result).toEqual(WORKFLOW_RUN_ARTIFACTS);
      });
    });

    describe("downloadRunArtifact method", () => {
      const ARTIFACT_ID = 54321;
      const DOWNLOADED_ARTIFACTS = [
        {
          data: "foo-data",
        },
      ];

      it("should call to Github sdk to download run artifacts", async () => {
        await github.downloadRunArtifact({ artifactId: ARTIFACT_ID });

        expect(octokit.request).toHaveBeenCalledWith(DOWNLOAD_RUN_ARTIFACT_PATH, {
          owner: OWNER,
          repo: PROJECT,
          artifact_id: ARTIFACT_ID,
          archive_format: "zip",
        });
      });

      it("should return data returned by Github sdk", async () => {
        octokit.request.mockResolvedValue(DOWNLOADED_ARTIFACTS);
        const result = await github.downloadRunArtifact({ artifactId: ARTIFACT_ID });

        expect(result).toEqual(DOWNLOADED_ARTIFACTS);
      });
    });
  });

  describe("throwIfJobFailed method", () => {
    it("should throw an error if job conclusion is not success", () => {
      expect(() =>
        throwIfJobFailed({ conclusion: "failure", name: "foo-name" } as GetRunJobResponse)
      ).toThrowError("Job foo-name failed");
    });

    it("should not throw if job conclusion is success", () => {
      expect(() =>
        throwIfJobFailed({ conclusion: "success", name: "foo-name" } as GetRunJobResponse)
      ).not.toThrow();
    });
  });
});
