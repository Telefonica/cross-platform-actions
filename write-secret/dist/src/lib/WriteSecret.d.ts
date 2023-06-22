import { Logger } from "./support/Logger.types";
import { SyncInputs } from "./WriteSecret.types";
export declare function writeSecret(inputs: SyncInputs, logger: Logger): Promise<string>;
