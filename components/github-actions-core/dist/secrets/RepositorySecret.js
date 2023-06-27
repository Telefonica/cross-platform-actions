"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorySecret = void 0;
/**
 * Create a new repository secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 * @param {RepositoryInterface} repository - The repository to create the secret in.
 * @returns {RepositorySecretInterface} A new repository secret.
 */
const RepositorySecret = class RepositorySecret {
    _name;
    _value;
    _repository;
    constructor(name, value, repository) {
        this._name = name;
        this._value = value;
        this._repository = repository;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    get repository() {
        return this._repository;
    }
    /**
     * Create the secret.
     * @param {ContextInterface} context - The context of the current run.
     * @throws {Error} - If the secret could not be created.
     */
    async createSecret(context) {
        await context.secretService.createRepositorySecret(context, this);
    }
};
exports.RepositorySecret = RepositorySecret;
