import { SecretServiceInterface } from "../secrets";

export interface GitHubConstructor {
  /**
   * Create a new GitHub instance.
   *
   * @param token The GitHub token to use for authentication.
   * @returns A new GitHub instance.
   */
  new (token: string): GitHubInterface;
}

/**
 * Represents a GitHub instance.
 * @interface
 * @augments SecretServiceInterface
 * Currently this is just a SecretServiceInterface, but it could be expanded to include other GitHub-specific functionality.
 */
export type GitHubInterface = SecretServiceInterface;
