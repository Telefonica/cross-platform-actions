import { Context, ContextInterface } from "../context";
import { Environment } from "../environments";
import { GitHub } from "../github";
import { LoggerInterface } from "../logger";
import { Repository } from "../repositories";
import { EnvironmentSecret, RepositorySecret } from "../secrets";

import { CreateSecretsInputs, CreateSecretsOutputs } from "./CreateSecrets.types";

export function createSecrets(
  inputs: CreateSecretsInputs,
  logger: LoggerInterface
): Promise<CreateSecretsOutputs> {
  const { repositories, environment, secret, value, token } = inputs;
  const github = new GitHub(token);
  const context = new Context({
    secretService: github,
    logger,
  });
  if (environment) {
    return _createEnvironmentsSecrets(context, repositories, environment, secret, value);
  }
  return _createRepositorySecrets(context, repositories, secret, value);
}

function _createEnvironmentsSecrets(
  context: ContextInterface,
  repositories: string[],
  environmentName: string,
  secretName: string,
  value: string
) {
  return Promise.all(
    repositories.map((repositoryName) =>
      _createEnvironmentSecret(context, repositoryName, environmentName, secretName, value)
    )
  );
}

async function _createEnvironmentSecret(
  context: ContextInterface,
  repositoryName: string,
  environmentName: string,
  secretName: string,
  value: string
) {
  const repository = new Repository(repositoryName);
  const environment = new Environment(environmentName, repository);
  const secret = new EnvironmentSecret(secretName, value, environment);
  await secret.createSecret(context);
  return {
    secret: secretName,
    repository: repositoryName,
    environment: environmentName,
  };
}

function _createRepositorySecrets(
  context: ContextInterface,
  repositories: string[],
  secretName: string,
  value: string
) {
  return Promise.all(
    repositories.map((repository) =>
      _createRepositorySecret(context, repository, secretName, value)
    )
  );
}

async function _createRepositorySecret(
  context: ContextInterface,
  repositoryName: string,
  secretName: string,
  value: string
) {
  const repository = new Repository(repositoryName);
  const secret = new RepositorySecret(secretName, value, repository);
  await secret.createSecret(context);
  return {
    secret: secretName,
    repository: repositoryName,
  };
}
