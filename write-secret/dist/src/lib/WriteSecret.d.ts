import type { LoggerInterface } from "github-actions-core";
import { WriteSecretInputs } from "./WriteSecret.types";
export declare function writeSecret(inputs: WriteSecretInputs, logger: LoggerInterface): Promise<string>;
