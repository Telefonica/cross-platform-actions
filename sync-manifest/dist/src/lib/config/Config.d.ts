import { Config, ConfigInputs } from "./Config.types";
export declare const DEFAULT_VARS: {
    GITHUB_OWNER: string;
};
export declare function getConfig(inputs: ConfigInputs): Config;
