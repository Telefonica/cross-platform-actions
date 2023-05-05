import { DeployInputs } from "./Deploy.types";
import { Logger } from "./support/Logger.types";
export declare function deployAndGetArtifact(inputs: DeployInputs, logger: Logger): Promise<string>;
