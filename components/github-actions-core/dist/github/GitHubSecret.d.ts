import { GitHubSecretConstructor } from "./GitHubSecret.types";
/**
 * Create a new GitHub secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 *
 * @see {@link https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository|Creating encrypted secrets for a repository}
 */
export declare const GitHubSecret: GitHubSecretConstructor;
