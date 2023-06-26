import { ContextInterface } from "../context";

import { EnvironmentSecretInterface } from "./EnvironmentSecret.types";
import { RepositorySecretInterface } from "./RepositorySecret.types";

export interface SecretServiceInterface {
  createRepositorySecret(
    context: ContextInterface,
    secret: RepositorySecretInterface
  ): Promise<void>;
  createEnvironmentSecret(
    context: ContextInterface,
    secret: EnvironmentSecretInterface
  ): Promise<void>;
}
