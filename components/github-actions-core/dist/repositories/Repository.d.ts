import { RepositoryConstructor } from "./Repository.types";
/**
 * Create a new repository.
 *
 * @param {string} repository - The name of the repository (should have format "owner/repo").
 * @throws {Error} If the repository name is invalid.
 */
export declare const Repository: RepositoryConstructor;
