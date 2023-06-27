import { LoggerInterface } from "../logger";
import { CreateSecretsInputs, CreateSecretsOutputs } from "./CreateSecrets.types";
/**
 * Create secrets in the given repositories or environments.
 *
 * If `environment` is provided, the secret will be created in the given environment in each repository.
 * Otherwise, the secret will be created in each repository.
 *
 * @param {CreateSecretsInputs} inputs
 * @param {LoggerInterface} logger
 * @returns {Promise<CreateSecretsOutputs>} created secrets
 *
 * @throws {Error} if any repository or environment does not exist
 */
export declare function createSecrets(inputs: CreateSecretsInputs, logger: LoggerInterface): Promise<CreateSecretsOutputs>;
