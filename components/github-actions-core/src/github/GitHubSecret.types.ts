import { ContextInterface } from "../context";

export interface GitHubSecretConstructor {
  new (name: string, value: string): GitHubSecretInterface;
}

export interface GitHubSecretInterface {
  name: string;
  encryptedValue(context: ContextInterface, publicKey: string): Promise<string>;
}
