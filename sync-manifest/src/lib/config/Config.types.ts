import { SyncInputs } from "../Sync.types";

export type ConfigInputs = Pick<SyncInputs, "project">;

interface Repository {
  /** Repository name */
  name: string;
  /** Repository owner */
  owner: string;
}

export interface Config {
  /** Repositories */
  repositories: Repository[];
}
