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
exports.getConfig = exports.getRepoName = exports.OUTPUT_VARS = void 0;
const core = __importStar(require("@actions/core"));
const INPUT_VARS = {
    PROJECT: "project",
    TOKEN: "token",
    ENVIRONMENT: "environment",
};
exports.OUTPUT_VARS = {
    MANIFEST: "manifest",
};
function getRepoName(repoBaseName) {
    return `${repoBaseName}-platform`;
}
exports.getRepoName = getRepoName;
function getConfig() {
    const repoName = getRepoName(core.getInput(INPUT_VARS.PROJECT, { required: true }));
    const token = core.getInput(INPUT_VARS.TOKEN, { required: true });
    const environment = core.getInput(INPUT_VARS.ENVIRONMENT, { required: true });
    return {
        timeoutJobCompleted: 600000,
        timeoutArtifactAvailable: 10000,
        repoName,
        repoRef: "main",
        workflowId: "deploy.yml",
        githubOwner: "Telefonica",
        githubToken: token,
        environment,
        requestInterval: 2000,
    };
}
exports.getConfig = getConfig;
