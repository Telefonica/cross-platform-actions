export interface CreateSecretsInputs {
  secret: string;
  value: string;
  repositories: string[];
  environment?: string;
  token: string;
}

interface RepositorySecretOutput {
  secret: string;
  repository: string;
}

interface EnvironmentSecretOutput extends RepositorySecretOutput {
  environment: string;
}

export type CreateSecretsOutputs = RepositorySecretOutput[] | EnvironmentSecretOutput[];
