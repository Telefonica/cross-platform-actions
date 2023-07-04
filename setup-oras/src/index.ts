import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

const TOOL_NAME = "oras";

async function run() {
  const version = core.getInput("version", { required: true });
  core.info(`Setup oras-cli (${TOOL_NAME}) ${version}`);

  let cachedToolPath = tc.find(TOOL_NAME, version);
  if (!cachedToolPath) {
    const downloadPath = await download(version);

    cachedToolPath = await tc.cacheDir(downloadPath, TOOL_NAME, version);
  }

  const executable = TOOL_NAME + getExecutableExtension();
  const orasPath = path.join(cachedToolPath, executable);

  fs.chmodSync(orasPath, "775");

  core.addPath(path.dirname(orasPath));

  await exec.exec(`${executable} version`);

  core.debug(`oras tool version: '${version}' has been cached at ${cachedToolPath}`);
  core.setOutput("oras-path", cachedToolPath);
}

/**
 * @returns {string} The executable extension based on platform.
 */
export function getExecutableExtension(): string {
  if (os.type().match(/^Win/)) {
    return ".exe";
  }
  return "";
}

/**
 * Download oras-cli from GitHub Releases.
 * @param version  The version to download.
 * @returns
 */
export async function download(version: string) {
  const type = os.type();
  if (type === "Windows_NT") {
    const orasPath = await tc.downloadTool(
      `https://github.com/oras-project/oras/releases/download/v1.0.0/oras_${version}_windows_amd64.zip`
    );
    const folder = await tc.extractZip(orasPath);
    return folder;
  } else if (type === "Darwin") {
    const arch = process.arch === "arm64" ? "arm64" : "amd64";

    const orasPath = await tc.downloadTool(
      `https://github.com/oras-project/oras/releases/download/v1.0.0/oras_${version}_darwin_${arch}.tar.gz`
    );
    const folder = await tc.extractTar(orasPath);
    return folder;
  } else if (type === "Linux") {
    const arch = process.arch === "arm64" ? "arm64" : "amd64";

    const orasPath = await tc.downloadTool(
      `https://github.com/oras-project/oras/releases/download/v1.0.0/oras_${version}_linux_${arch}.tar.gz`
    );
    const folder = await tc.extractTar(orasPath);
    return folder;
  } else {
    throw new Error(`Unsupported platform: ${type}`);
  }
}

process.on("unhandledRejection", (err) => core.setFailed(new Error("unhandledRejection: " + err)));
process.on("uncaughtException", (err) => core.setFailed(new Error("uncaughtException: " + err)));

run().catch((err) => core.setFailed(err));
