import "@support/matchers/toHaveEncryptedValue";

/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { GitHubSecret } from "@src/github";

describe("GitHubSecret", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(GitHubSecret).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange
    const name = "name";
    const value = "value";

    // Act
    const secret = new GitHubSecret(name, value);

    // Assert
    expect(secret).toBeInstanceOf(GitHubSecret);
    expect(secret.name).toBe(name);
  });

  describe("encryptedValue", () => {
    it("should return encrypted value", async () => {
      // Arrange
      await sodium.ready;
      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
      const name = "name";
      const value = "value";
      const secret = new GitHubSecret(name, value);

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const encryptedValue = await secret.encryptedValue({} as any, publicKey);

      // Assert
      expect(encryptedValue).toHaveEncryptedValue("value", keypair);
    });
  });
});
