import * as core from "@actions/core";
import { z } from "zod";

import { WriteSecretInputs } from "../lib/WriteSecret.types";

const environmentIdSchema = z
  .string()
  .nonempty()
  .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, "Input project must be in the format owner/repo");
const repositoriesSchema = z.array(environmentIdSchema);

export function getInputs(): WriteSecretInputs {
  const secret = core.getInput("secret", { required: true });
  const value = core.getInput("value", { required: true });
  const repositoriesString = core.getInput("repositories", { required: true });
  const repositoriesRaw = repositoriesString.split(/\s+/);
  const repositories = repositoriesSchema.safeParse(repositoriesRaw);
  if (!repositories.success) {
    throw new Error("Input repositories must be a valid space-separated list of repositories", {
      cause: repositories.error,
    });
  }
  const environment = core.getInput("environment") || undefined;
  const token = core.getInput("token", { required: true });
  return {
    secret,
    value,
    repositories: repositories.data,
    environment,
    token,
  };
}
