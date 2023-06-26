import { EnvironmentInterface } from "../environments";

import { SecretInterface } from "./Secret.types";

export interface EnvironmentSecretConstructor {
  new (name: string, value: string, environment: EnvironmentInterface): EnvironmentSecretInterface;
}

export interface EnvironmentSecretInterface extends SecretInterface {
  readonly environment: EnvironmentInterface;
}
