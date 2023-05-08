import type { Config } from "../config/Config.types";
import type { DeployInputs } from "../Deploy.types";
export declare function hideObjectKeys<Type extends Config | DeployInputs>(object: Type, keysToHide: (keyof Type)[]): Record<keyof Type, string>;
export declare function logObject<Type extends Config | DeployInputs>(object: Type, keysToHide: (keyof Type)[]): string;
