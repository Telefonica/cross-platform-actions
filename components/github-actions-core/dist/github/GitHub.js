"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHub = void 0;
const core_1 = require("@octokit/core");
const plugin_rest_endpoint_methods_1 = require("@octokit/plugin-rest-endpoint-methods");
const GitHubSecret_1 = require("./GitHubSecret");
const Octokit = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods);
/**
 * Create a new GitHub instance.
 *
 * @param token The GitHub token to use for authentication.
 */
const GitHub = class Github {
    _octokit;
    constructor(token) {
        this._octokit = new Octokit({ auth: token });
    }
    /**
     * Create a new repository secret.
     * @param {ContextInterface} context - The context of the current run.
     * @param {RepositorySecretInterface} secret - The repository secret to create.
     *
     * @throws {Error} - If the repository does not exist.
     * @throws {Error} - If the repository's public key can not be obtain.
     * @throws {Error} - If the secret can not be created.
     */
    async createRepositorySecret(context, secret) {
        const owner = secret.repository.owner;
        const repo = secret.repository.repo;
        await this._octokit.rest.repos.get({
            repo,
            owner,
        });
        const publicKey = await this._octokit.rest.actions.getRepoPublicKey({
            owner,
            repo,
        });
        const githubSecret = new GitHubSecret_1.GitHubSecret(secret.name, secret.value);
        const encryptedValue = await githubSecret.encryptedValue(context, publicKey.data.key);
        await this._octokit.rest.actions.createOrUpdateRepoSecret({
            key_id: publicKey.data.key_id,
            owner,
            repo,
            secret_name: secret.name,
            encrypted_value: encryptedValue,
        });
    }
    /**
     * Create a new environment secret.
     *
     * @param {ContextInterface} context - The context of the current run.
     * @param {EnvironmentSecretInterface} secret - The environment secret to create.
     * @throws {Error} - If the repository does not exist.
     * @throws {Error} - If the environment does not exist.
     * @throws {Error} - If the environment's public key can not be obtain.
     * @throws {Error} - If the secret can not be created.
     */
    async createEnvironmentSecret(context, secret) {
        const owner = secret.environment.repository.owner;
        const repo = secret.environment.repository.repo;
        const repository = await this._octokit.rest.repos.get({
            owner,
            repo,
        });
        const environmentName = secret.environment.name;
        await this._octokit.rest.repos.getEnvironment({
            owner,
            repo,
            environment_name: environmentName,
        });
        const publicKey = await this._octokit.rest.actions.getEnvironmentPublicKey({
            repository_id: repository.data.id,
            environment_name: environmentName,
        });
        const githubSecret = new GitHubSecret_1.GitHubSecret(secret.name, secret.value);
        const encryptedValue = await githubSecret.encryptedValue(context, publicKey.data.key);
        await this._octokit.rest.actions.createOrUpdateEnvironmentSecret({
            key_id: publicKey.data.key_id,
            environment_name: environmentName,
            repository_id: repository.data.id,
            secret_name: secret.name,
            encrypted_value: encryptedValue,
        });
    }
};
exports.GitHub = GitHub;
