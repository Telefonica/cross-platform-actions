export const GET_WORKFLOWS_PATH = "GET /repos/{owner}/{repo}/actions/workflows";
export const DISPATCH_WORKFLOW_PATH =
  "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches";
export const GET_RUNS_PATH = `GET /repos/{owner}/{repo}/actions/runs?created>={run_date_filter}`;
export const GET_RUN_JOBS_PATH = "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs";
export const GET_RUN_ARTIFACTS_PATH = "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts";
export const DOWNLOAD_RUN_ARTIFACT_PATH =
  "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}";

const WORKFLOW_RUN_RESPONSE = {
  status: "completed",
  id: "foo-run-id",
};

export function getWorkflowsResponse(workflowFileName?: string) {
  return {
    data: {
      workflows: [
        {
          id: 1234,
          path: `.github/workflows/${workflowFileName}`,
          name: "foo-workflow-name",
        },
      ],
    },
  };
}

export function getRunsResponse(status?: string) {
  return {
    data: {
      workflow_runs: [
        {
          ...WORKFLOW_RUN_RESPONSE,
          status: status || "completed",
        },
      ],
    },
  };
}

export function getRunJobsResponse(
  stepUUID: string,
  { isFailed = false }: { isFailed?: boolean } = {}
) {
  return {
    data: {
      jobs: [
        {
          id: 1234,
          name: "foo-job-name",
          steps: [
            {
              name: `${stepUUID}`,
            },
          ],
          conclusion: isFailed ? "failed" : "success",
        },
      ],
    },
  };
}

export function getRunArtifactsResponse(options: { voidArtifact?: boolean } = {}) {
  return options.voidArtifact
    ? { data: { artifacts: [] } }
    : {
        data: {
          artifacts: [
            {
              id: 1,
            },
          ],
        },
      };
}

export function downloadRunArtifactResponse(zipFile: ArrayBuffer) {
  return {
    data: zipFile,
  };
}
