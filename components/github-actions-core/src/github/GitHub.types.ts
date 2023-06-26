import { SecretServiceInterface } from "../secrets";

export interface GitHubConstructor {
  new (token: string): GitHubInterface;
}

export type GitHubInterface = SecretServiceInterface;
