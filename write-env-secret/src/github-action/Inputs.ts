import * as core from "@actions/core";
import { z } from "zod";

import { SyncInputs } from "../lib/Sync.types";

const environmentIdSchema = z
  .string()
  .nonempty()
  .regex(/^([^/]*)\/(.*)$/, "Input project must be in the format owner/repo");
const repositoriesSchema = z.array(environmentIdSchema);

export function getInputs(): SyncInputs {
  const value = core.getInput("value", { required: true });
  const secret = core.getInput("secret", { required: true });
  const repositoriesString = core.getInput("repositories", { required: true });
  const repositoriesRaw = JSON.parse(repositoriesString);
  const repositories = repositoriesSchema.safeParse(repositoriesRaw);
  if (!repositories.success) {
    throw new Error("Input repositories must be a valid JSON string", {
      cause: repositories.error,
    });
  }
  const environment = core.getInput("environment", { required: true });
  const token = core.getInput("token", { required: true });
  return {
    value,
    repositories: repositories.data,
    secret,
    token,
    environment,
  };
}
