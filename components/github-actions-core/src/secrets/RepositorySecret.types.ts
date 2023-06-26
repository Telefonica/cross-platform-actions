import { RepositoryInterface } from "../repositories";

import { SecretInterface } from "./Secret.types";

export interface RepositorySecretConstructor {
  new (name: string, value: string, repository: RepositoryInterface): RepositorySecretInterface;
}

export interface RepositorySecretInterface extends SecretInterface {
  readonly repository: RepositoryInterface;
}
