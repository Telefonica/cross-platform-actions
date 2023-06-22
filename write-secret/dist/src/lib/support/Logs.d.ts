import type { Config } from "../config/Config.types";
import type { SyncInputs } from "../Sync.types";
export declare function hideObjectKeys<Type extends Config | SyncInputs>(object: Type, keysToHide: (keyof Type)[]): Record<keyof Type, string>;
export declare function logObject<Type extends Config | SyncInputs>(object: Type, keysToHide: (keyof Type)[]): string;
