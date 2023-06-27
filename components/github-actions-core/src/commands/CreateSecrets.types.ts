/**
 * @file Type definitions for the CreateSecrets command.
 */

/**
 * Inputs for the CreateSecrets command.
 */
export interface CreateSecretsInputs {
  /**
   * The name of the secret.
   */
  secret: string;
  /**
   * The value of the secret.
   */
  value: string;
  /**
   * The repositories to create the secret in.
   *
   * The repositories must be in the format `owner/repository`.
   */
  repositories: string[];
  /**
   * The environment to create the secret in.
   */
  environment?: string;
  /**
   * The GitHub token to use to create the secret.
   */
  token: string;
}

interface RepositorySecretOutput {
  secret: string;
  repository: string;
}

interface EnvironmentSecretOutput extends RepositorySecretOutput {
  environment: string;
}

/**
 * Outputs for the CreateSecrets command.
 *
 * The outputs are an array of objects with the following properties:
 *  - `secret`: The name of the secret.
 *  - `repository`: The name of the repository.
 *  - `environment`: The name of the environment, if present in the inputs.
 */
export type CreateSecretsOutputs = RepositorySecretOutput[] | EnvironmentSecretOutput[];
