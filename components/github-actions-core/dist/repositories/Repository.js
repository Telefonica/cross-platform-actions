"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
/**
 * Create a new repository.
 *
 * @param {string} repository - The name of the repository (should have format "owner/repo").
 * @throws {Error} If the repository name is invalid.
 */
const Repository = class Repository {
    _owner;
    _repo;
    constructor(repository) {
        if (!/^[^/]+\/[^/]+$/.test(repository)) {
            throw new Error(`Invalid repository name: ${repository}`);
        }
        const [owner, repo] = repository.split("/");
        this._owner = owner;
        this._repo = repo;
    }
    get owner() {
        return this._owner;
    }
    get repo() {
        return this._repo;
    }
};
exports.Repository = Repository;
