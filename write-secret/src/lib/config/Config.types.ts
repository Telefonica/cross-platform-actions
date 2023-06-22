import { SyncInputs } from "../WriteSecret.types";

export type ConfigInputs = Pick<SyncInputs, "repositories">;

interface Repository {
  /** Repository owner */
  owner: string;
  /** Repository repo */
  repo: string;
}

export interface Config {
  /** Repositories */
  repositories: Repository[];
}
