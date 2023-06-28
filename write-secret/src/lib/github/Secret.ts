/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { Logger } from "../support/Logger.types";

import { SecretConstructor, SecretConstructorOptions, SecretInterface } from "./Secret.types";

export const Secret: SecretConstructor = class Secret implements SecretInterface {
  private _name: string;
  private _value: string;
  private _logger: Logger | undefined;

  constructor(name: string, value: string, options?: SecretConstructorOptions) {
    this._name = name;
    this._value = value;
    this._logger = options?.logger;
  }

  public get name(): string {
    return this._name;
  }

  public async encryptedValue(publicKey: string): Promise<string> {
    this._logger?.debug(`Encrypting secret ${this._name}`);
    await sodium.ready;
    const binKey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
    const binSec = sodium.from_string(this._value);
    const encBytes = sodium.crypto_box_seal(binSec, binKey);
    const encryptedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    this._logger?.debug(`Secret ${this._name} encrypted`);
    return encryptedValue;
  }
};
