import { ContextInterface } from "../context";
export interface GitHubSecretConstructor {
    /**
     * Create a new GitHub secret.
     *
     * @param {string} name - The name of the secret.
     * @param {string} value - The value of the secret.
     * @returns {GitHubSecretInterface} A new GitHub secret.
     */
    new (name: string, value: string): GitHubSecretInterface;
}
/**
 * Represents a GitHub secret.
 *
 * @see {@link https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository|Creating encrypted secrets for a repository}
 */
export interface GitHubSecretInterface {
    /**
     * The name of the secret.
     */
    name: string;
    /**
     * Get the encrypted value of the secret.
     */
    encryptedValue(context: ContextInterface, publicKey: string): Promise<string>;
}
