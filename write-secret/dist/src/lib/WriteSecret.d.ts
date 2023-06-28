import { Logger } from "./support/Logger.types";
import { WriteSecretInputs } from "./WriteSecret.types";
export declare function writeSecret(inputs: WriteSecretInputs, logger: Logger): Promise<string>;
