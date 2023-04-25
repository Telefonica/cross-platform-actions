"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workflows = void 0;
const Github_1 = require("./Github");
const Workflows = class Workflows {
    _githubClient;
    _timeoutJobCompleted;
    _timeoutArtifactAvailable;
    _requestInterval;
    _logger;
    constructor({ token, owner, project, timeoutJobCompleted, timeoutArtifactAvailable, requestInterval, logger, }) {
        this._githubClient = new Github_1.Github({ token, owner, project, logger });
        this._timeoutArtifactAvailable = timeoutArtifactAvailable;
        this._timeoutJobCompleted = timeoutJobCompleted;
        this._requestInterval = requestInterval;
        this._logger = logger;
    }
    async dispatch(options) {
        await this._githubClient.dispatchWorkflow(options);
    }
    async _findJobInWorkflowRun(runId, stepUUID) {
        const stepName = `Set ID (${stepUUID})`;
        const workflowJobs = await this._githubClient.getRunJobs({ runId });
        const foundWorkflow = workflowJobs.data.jobs.find((job) => job.steps?.find((step) => step.name === stepName));
        return foundWorkflow;
    }
    async _findJobInCompletedWorkflowRuns(workflowRuns, stepUUID) {
        // TODO, check that the workflow is also successful?
        const completedRuns = workflowRuns.filter((run) => run.status === "completed");
        const runsJobsFound = await Promise.all(completedRuns.map((completedRun) => {
            return this._findJobInWorkflowRun(completedRun.id, stepUUID);
        }));
        return runsJobsFound.find((item) => !!item);
    }
    waitForTargetJobToComplete({ stepUUID, executedFrom, }) {
        return new Promise((resolve, reject) => {
            let checkTimeout;
            const rejectTimeout = setTimeout(() => {
                clearTimeout(checkTimeout);
                reject(new Error("Timed out while waiting for target job to complete"));
            }, this._timeoutJobCompleted);
            const requestWorkflows = () => {
                return this._githubClient.getRuns({
                    runDateFilter: executedFrom,
                });
            };
            const waitAndCheckWorkFlow = () => {
                checkTimeout = setTimeout(() => {
                    checkWorkflow();
                }, this._requestInterval);
            };
            const checkWorkflow = () => {
                requestWorkflows().then((response) => {
                    return this._findJobInCompletedWorkflowRuns(response.data.workflow_runs, stepUUID).then((jobData) => {
                        if (jobData) {
                            clearTimeout(rejectTimeout);
                            resolve(jobData);
                        }
                        else {
                            waitAndCheckWorkFlow();
                        }
                    });
                });
            };
            checkWorkflow();
        });
    }
    async waitForTargetJobToSuccess({ stepUUID, executedFrom, }) {
        const targetJob = await this.waitForTargetJobToComplete({
            stepUUID,
            executedFrom,
        });
        // Check if job has finished successfully
        (0, Github_1.throwIfJobFailed)(targetJob);
        return targetJob;
    }
    downloadJobFirstArtifact(jobData) {
        let checkTimeout;
        return new Promise((resolve, reject) => {
            const rejectTimeout = setTimeout(() => {
                clearTimeout(checkTimeout);
                reject(new Error("Timed out while trying to download artifact"));
            }, this._timeoutArtifactAvailable);
            const downloadArtifact = () => {
                return this._githubClient
                    .getRunArtifacts({
                    runId: jobData.run_id,
                })
                    .then((response) => {
                    const artifact = response.data.artifacts[0];
                    if (artifact) {
                        return this._githubClient.downloadRunArtifact({
                            artifactId: artifact.id,
                        });
                    }
                    return null;
                });
            };
            const waitAndDownloadArtifact = () => {
                checkTimeout = setTimeout(() => {
                    checkArtifact();
                }, this._requestInterval);
            };
            const checkArtifact = () => {
                downloadArtifact().then((response) => {
                    if (response) {
                        clearTimeout(rejectTimeout);
                        resolve(response);
                    }
                    else {
                        waitAndDownloadArtifact();
                    }
                });
            };
            checkArtifact();
        });
    }
};
exports.Workflows = Workflows;
