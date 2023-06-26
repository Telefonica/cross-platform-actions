/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { ContextInterface } from "../context";

import { GitHubSecretConstructor, GitHubSecretInterface } from "./GitHubSecret.types";

export const GitHubSecret: GitHubSecretConstructor = class GitHubSecret
  implements GitHubSecretInterface
{
  private _name: string;
  private _value: string;

  constructor(name: string, value: string) {
    this._name = name;
    this._value = value;
  }

  public get name(): string {
    return this._name;
  }

  async encryptedValue(context: ContextInterface, publicKey: string): Promise<string> {
    context.logger?.debug(`Encrypting secret ${this._name}`);
    await sodium.ready;
    const binKey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
    const binSec = sodium.from_string(this._value);
    const encBytes = sodium.crypto_box_seal(binSec, binKey);
    const encryptedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    context.logger?.debug(`Secret ${this._name} encrypted`);
    return encryptedValue;
  }
};
