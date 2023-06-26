import { ContextInterface } from "../context";
import { EnvironmentInterface } from "../environments";

import { EnvironmentSecretConstructor } from "./EnvironmentSecret.types";
import { SecretInterface } from "./Secret.types";

export const EnvironmentSecret: EnvironmentSecretConstructor = class EnvironmentSecret
  implements SecretInterface
{
  private _name: string;
  private _value: string;
  private _environment: EnvironmentInterface;

  constructor(name: string, value: string, environment: EnvironmentInterface) {
    this._name = name;
    this._value = value;
    this._environment = environment;
  }

  public get name(): string {
    return this._name;
  }

  public get value(): string {
    return this._value;
  }

  public get environment(): EnvironmentInterface {
    return this._environment;
  }

  public async createSecret(context: ContextInterface): Promise<void> {
    await context.secretService.createEnvironmentSecret(context, this);
  }
};
