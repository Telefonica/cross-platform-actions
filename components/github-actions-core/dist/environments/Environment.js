"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
/**
 * Implementation of EnvironmentInterface.
 *
 * @param {string} name - environment name
 * @param {string} repository - repository
 * @returns {EnvironmentInterface} - environment
 * @example
 * import { Repository } from "github-actions-core";
 * import { Environment } from "github-actions-core";
 *
 * const repository = new Repository("owner/repo");
 * const environment = new Environment("production", repository);
 */
const Environment = class Environment {
    _name;
    _repository;
    constructor(name, repository) {
        this._name = name;
        this._repository = repository;
    }
    get name() {
        return this._name;
    }
    get repository() {
        return this._repository;
    }
};
exports.Environment = Environment;
