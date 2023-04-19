import * as core from "@actions/core";
import { Octokit } from "octokit";
import { v4 as uuidv4 } from "uuid";

function sleep(time) {
  return new Promise((r) => setTimeout(r, time));
}

try {
  const SLEEP_DELAY = 3000;
  const workflow_id = "deploy.yml";
  const owner = "Telefonica";
  const ref = "main";
  let targetJob = null;
  const id = uuidv4();
  const idName = `Set ID (${id})`;

  // `project` input defined in action metadata file
  const project = `${core.getInput("project", { required: true })}-platform`;

  const token = core.getInput("token", { required: true });

  const environment = core.getInput("environment", { required: true });

  // Format YYYY-MM-DDTHH:MM
  const run_date_filter = new Date().toJSON().slice(0, 16);

  const octokit = new Octokit({
    auth: token,
  });

  await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
    owner: owner,
    repo: project,
    workflow_id: workflow_id,
    ref: ref,
    inputs: {
      id: id,
      environment: environment,
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  while (targetJob === undefined || targetJob === null) {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/actions/runs?created={run_date_filter}",
      {
        owner: owner,
        repo: project,
        run_date_filter: run_date_filter,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const runs = response.data.workflow_runs.filter((run) => run.status === "completed");
    if (runs.length > 0) {
      for (const run of runs) {
        const jobs = await octokit.request("GET /repos/{owner}/{repo}/actions/runs/{id}/jobs", {
          owner: owner,
          repo: project,
          id: run["id"],
        });
        targetJob = jobs.data.jobs.find((job) => job.steps.find((step) => step.name === idName));
        // If the target job is found go outside the loop
        if (targetJob !== undefined) break;
      }
    }
    if (targetJob === undefined || targetJob === null) {
      await sleep(SLEEP_DELAY);
    }
  }

  // In case the target job has more than 1 artifact, we will have to filter by name. From now on, we will assume that there is only one artifact.
  const artifact = await octokit
    .request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", {
      owner: owner,
      repo: project,
      run_id: targetJob["run_id"],
    })
    .then((response) => response.data.artifacts[0]);

  core.setOutput("deploy-artifact", artifact["archive_download_url"]);
} catch (error) {
  core.setFailed(error.message);
}
