/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { octokit } from "@support/mocks/Octokit";

import { Environment } from "@src/lib/github/Environment";
import { EnvironmentInterface } from "@src/lib/github/Environment.types";
import { getOctokit } from "@src/lib/github/Octokit";
import { Secret } from "@src/lib/github/Secret";

describe("Environment", () => {
  it("should be defined", () => {
    expect(Environment).toBeDefined();
  });

  it("should return a environment object", () => {
    // Arrange
    const name = "test";
    const token = "test";

    // Act
    const environment = new Environment(NaN, name, { octokit: getOctokit(token) });

    // Assert
    expect(environment).toBeInstanceOf(Environment);
  });

  describe("addSecret", () => {
    let environment: EnvironmentInterface;

    beforeEach(async () => {
      environment = new Environment(NaN, "test", { octokit: getOctokit("test") });
    });

    it("should add a secret to the environment", async () => {
      // Arrange
      await sodium.ready;
      const keyPair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getEnvironmentPublicKey.mockResolvedValueOnce({
        data: {
          key_id: "test",
          key: publicKey,
        },
      });
      const secret = new Secret("test", "test");

      // Act
      await environment.addSecret(secret);

      // Assert
      expect(octokit.rest.actions.getEnvironmentPublicKey).toHaveBeenCalledWith({
        repository_id: NaN,
        environment_name: "test",
      });
      expect(octokit.rest.actions.createOrUpdateEnvironmentSecret).toHaveBeenCalledWith({
        key_id: "test",
        repository_id: NaN,
        environment_name: "test",
        secret_name: "test",
        encrypted_value: expect.toHaveEncryptedValue("test", keyPair),
      });
    });

    it("should fail if the environment public key cannot be retrieved", async () => {
      // Arrange
      octokit.rest.actions.getEnvironmentPublicKey.mockRejectedValueOnce(new Error("test"));
      const secret = new Secret("test", "test");

      // Act & Assert
      await expect(environment.addSecret(secret)).rejects.toThrow();
    });

    it("should fail if cannot create or update secret", async () => {
      // Arrange
      octokit.rest.actions.createOrUpdateEnvironmentSecret.mockRejectedValueOnce(
        new Error("test")
      );
      const secret = new Secret("test", "test");

      // Act & Assert
      await expect(environment.addSecret(secret)).rejects.toThrow();
    });
  });
});
