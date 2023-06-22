import { Repository } from "../support/Support.types";
import { SyncInputs } from "../WriteSecret.types";

export type ConfigInputs = Pick<SyncInputs, "repositories">;

export interface Config {
  /** Repositories */
  repositories: Repository[];
}
