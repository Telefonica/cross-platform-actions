"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Github = exports.throwIfJobFailed = void 0;
const octokit_1 = require("octokit");
const SUCCESSFUL_JOB_CONCLUSION = "success";
function jobIsSuccessful(job) {
    return job.conclusion === SUCCESSFUL_JOB_CONCLUSION;
}
function throwIfJobFailed(job) {
    if (!jobIsSuccessful(job)) {
        throw new Error(`Job ${job.name} failed`);
    }
}
exports.throwIfJobFailed = throwIfJobFailed;
const Github = class Github {
    _octokit;
    _owner;
    _project;
    _logger;
    constructor({ token, owner, project, logger }) {
        this._octokit = new octokit_1.Octokit({
            auth: token,
        });
        this._owner = owner;
        this._project = project;
        this._logger = logger;
    }
    async dispatchWorkflow({ workflowId, ref, stepUUID, environment }) {
        await this._octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
            owner: this._owner,
            repo: this._project,
            workflow_id: workflowId,
            ref: ref,
            inputs: {
                id: stepUUID,
                environment: environment,
            },
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
    }
    async getRuns({ runDateFilter }) {
        const response = (await this._octokit.request(`GET /repos/{owner}/{repo}/actions/runs?created>={run_date_filter}`, {
            owner: this._owner,
            repo: this._project,
            run_date_filter: runDateFilter,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }));
        return response;
    }
    async getRunJobs({ runId }) {
        return this._octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", {
            owner: this._owner,
            repo: this._project,
            run_id: runId,
        });
    }
    async getRunArtifacts({ runId, }) {
        return this._octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", {
            owner: this._owner,
            repo: this._project,
            run_id: runId,
        });
    }
    async downloadRunArtifact({ artifactId, }) {
        return this._octokit.request("GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}", {
            owner: this._owner,
            repo: this._project,
            artifact_id: artifactId,
            archive_format: "zip",
        });
    }
};
exports.Github = Github;
