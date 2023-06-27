"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecrets = void 0;
const context_1 = require("../context");
const environments_1 = require("../environments");
const github_1 = require("../github");
const repositories_1 = require("../repositories");
const secrets_1 = require("../secrets");
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
function createSecrets(inputs, logger) {
    const { repositories, environment, secret, value, token } = inputs;
    const github = new github_1.GitHub(token);
    const context = new context_1.Context({
        secretService: github,
        logger,
    });
    if (environment) {
        return _createEnvironmentsSecrets(context, repositories, environment, secret, value);
    }
    return _createRepositorySecrets(context, repositories, secret, value);
}
exports.createSecrets = createSecrets;
function _createEnvironmentsSecrets(context, repositories, environmentName, secretName, value) {
    return Promise.all(repositories.map((repositoryName) => _createEnvironmentSecret(context, repositoryName, environmentName, secretName, value)));
}
async function _createEnvironmentSecret(context, repositoryName, environmentName, secretName, value) {
    const repository = new repositories_1.Repository(repositoryName);
    const environment = new environments_1.Environment(environmentName, repository);
    const secret = new secrets_1.EnvironmentSecret(secretName, value, environment);
    await secret.createSecret(context);
    return {
        secret: secretName,
        repository: repositoryName,
        environment: environmentName,
    };
}
function _createRepositorySecrets(context, repositories, secretName, value) {
    return Promise.all(repositories.map((repository) => _createRepositorySecret(context, repository, secretName, value)));
}
async function _createRepositorySecret(context, repositoryName, secretName, value) {
    const repository = new repositories_1.Repository(repositoryName);
    const secret = new secrets_1.RepositorySecret(secretName, value, repository);
    await secret.createSecret(context);
    return {
        secret: secretName,
        repository: repositoryName,
    };
}
