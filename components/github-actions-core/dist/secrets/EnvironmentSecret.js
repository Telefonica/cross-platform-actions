"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentSecret = void 0;
/**
 * Create a new environment secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 * @param {EnvironmentInterface} environment - The environment to create the secret in.
 */
const EnvironmentSecret = class EnvironmentSecret {
    _name;
    _value;
    _environment;
    constructor(name, value, environment) {
        this._name = name;
        this._value = value;
        this._environment = environment;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    get environment() {
        return this._environment;
    }
    /**
     * Create the secret.
     *
     * @param {ContextInterface} context - The context of the current run.
     * @throws {Error} - If the secret could not be created.
     */
    async createSecret(context) {
        await context.secretService.createEnvironmentSecret(context, this);
    }
};
exports.EnvironmentSecret = EnvironmentSecret;
