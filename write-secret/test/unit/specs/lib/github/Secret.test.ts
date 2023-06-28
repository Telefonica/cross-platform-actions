/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";

// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { Secret } from "@src/lib/github/Secret";

describe("Secret", () => {
  it("should be defined", () => {
    expect(Secret).toBeDefined();
  });

  it("should return a secret object", async () => {
    // Arrange
    const value = "test";
    await sodium.ready;
    const keyPair = sodium.crypto_box_keypair();
    const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
    const secret = new Secret("test", value);

    // Act
    const encryptedValueBase64 = await secret.encryptedValue(publicKey);

    // Assert
    expect(encryptedValueBase64).toHaveEncryptedValue(value, keyPair);
  });
});
