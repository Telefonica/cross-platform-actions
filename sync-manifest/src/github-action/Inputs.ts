import * as core from "@actions/core";
import { z } from "zod";

import { SyncInputs } from "../lib/Sync.types";

const projectSchema = z.object({
  project: z.string(),
  repositories: z.array(z.string()),
});

export function getInputs(): SyncInputs {
  const manifest = core.getInput("manifest", { required: true });
  const project = projectSchema.safeParse(core.getInput("project", { required: true }));
  if (!project.success) {
    throw new Error("Input project must be a valid JSON string", { cause: project.error });
  }
  const secret = core.getInput("secret", { required: true });
  const token = core.getInput("token", { required: true });
  return {
    manifest,
    project: project.data,
    secret,
    token,
  };
}
