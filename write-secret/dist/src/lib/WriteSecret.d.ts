import type { LoggerInterface } from "github-actions-core";
import { SyncInputs } from "./WriteSecret.types";
export declare function writeSecret(inputs: SyncInputs, logger: LoggerInterface): Promise<string>;
