/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

/** @type {import("jest").Matcher<string>} */
export function toHaveEncryptedValue<R = unknown>(
  actual: R,
  value: string,
  keyPair: sodium.KeyPair
) {
  if (typeof actual !== "string") {
    throw new Error("Actual value must be a string");
  }
  const encryptedValue = sodium.from_base64(actual, sodium.base64_variants.ORIGINAL);
  const rawValue = sodium.crypto_box_seal_open(
    encryptedValue,
    keyPair.publicKey,
    keyPair.privateKey
  );
  const actualValue = sodium.to_string(rawValue);
  const pass = actualValue === value;
  if (pass) {
    return {
      message: () =>
        `expected ${value} not to be encrypted value of ${actual} [actual=${actualValue}]`,
      pass: true,
    };
  }
  return {
    message: () => `expected ${value} to be encrypted value of ${actual} [actual=${actualValue}]`,
    pass: false,
  };
}

expect.extend({ toHaveEncryptedValue });
