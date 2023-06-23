import { Repository } from "../support/Support.types";
import { WriteSecretInputs } from "../WriteSecret.types";
export type ConfigInputs = Pick<WriteSecretInputs, "repositories">;
export interface Config {
    /** Repositories */
    repositories: Repository[];
}
