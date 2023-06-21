import { SyncInputs } from "../Sync.types";
export type ConfigInputs = Pick<SyncInputs, "repositories">;
interface environment {
    /** environment name */
    name: string;
    /** environment owner */
    owner: string;
}
export interface Config {
    /** Repositories */
    repositories: environment[];
}
export {};
