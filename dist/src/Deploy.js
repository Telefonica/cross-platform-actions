"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDeployAndGetArtifactAction = exports.deployAndGetArtifact = void 0;
const core = __importStar(require("@actions/core"));
const uuid_1 = require("uuid");
const Config_1 = require("./config/Config");
const Date_1 = require("./support/Date");
const Logger_1 = require("./support/Logger");
const Zip_1 = require("./support/Zip");
const Workflows_1 = require("./workflows/Workflows");
async function deployAndGetArtifact({ timeoutJobCompleted, timeoutArtifactAvailable, repoName, repoRef, workflowId, githubOwner, githubToken, environment, requestInterval, }) {
    const stepUUID = (0, uuid_1.v4)();
    const executedFrom = (0, Date_1.formattedNow)();
    const logger = (0, Logger_1.getLogger)();
    const workflows = new Workflows_1.Workflows({
        token: githubToken,
        owner: githubOwner,
        project: repoName,
        timeoutJobCompleted,
        timeoutArtifactAvailable,
        requestInterval,
        logger,
    });
    // Dispatch workflow that will create a job with the unique step UUID
    await workflows.dispatch({ workflowId, ref: repoRef, stepUUID, environment });
    // Find recently dispatched job when it has finished
    const targetJob = await workflows.waitForTargetJobToSuccess({
        stepUUID,
        executedFrom,
    });
    // Download artifact from the job
    const artifact = await workflows.downloadJobFirstArtifact(targetJob);
    // Return artifact content as stringified JSON
    return (0, Zip_1.getJsonFromZip)(artifact.data);
}
exports.deployAndGetArtifact = deployAndGetArtifact;
async function runDeployAndGetArtifactAction() {
    try {
        // customStepUUID is used for testing purpose
        const config = (0, Config_1.getConfig)();
        const artifactJson = await deployAndGetArtifact(config);
        core.setOutput(Config_1.OUTPUT_VARS.MANIFEST, artifactJson);
    }
    catch (error) {
        core.setFailed(error.message);
        throw error;
    }
}
exports.runDeployAndGetArtifactAction = runDeployAndGetArtifactAction;
