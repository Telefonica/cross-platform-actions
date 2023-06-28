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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(Environment).toBeDefined();
  });

  it("should return a environment object", () => {
    // Arrange
    const name = "environment-name";
    const token = "token";

    // Act
    const environment = new Environment(1, name, { octokit: getOctokit(token) });

    // Assert
    expect(environment).toBeInstanceOf(Environment);
  });

  describe("addSecret", () => {
    let environment: EnvironmentInterface;

    beforeEach(async () => {
      environment = new Environment(1, "environment-name", { octokit: getOctokit("token") });
    });

    it("should add a secret to the environment", async () => {
      // Arrange
      await sodium.ready;
      const keyPair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getEnvironmentPublicKey.mockResolvedValueOnce({
        data: {
          key_id: "key-id",
          key: publicKey,
        },
      });
      const secret = new Secret("secret-name", "secret-value");

      // Act
      await environment.addSecret(secret);

      // Assert
      expect(octokit.rest.actions.getEnvironmentPublicKey).toHaveBeenCalledWith({
        repository_id: 1,
        environment_name: "environment-name",
      });
      expect(octokit.rest.actions.createOrUpdateEnvironmentSecret).toHaveBeenCalledWith({
        key_id: "key-id",
        repository_id: 1,
        environment_name: "environment-name",
        secret_name: "secret-name",
        encrypted_value: expect.toHaveEncryptedValue("secret-value", keyPair),
      });
    });

    it("should fail if the environment public key cannot be retrieved", async () => {
      // Arrange
      octokit.rest.actions.getEnvironmentPublicKey.mockRejectedValueOnce(new Error("error"));
      const secret = new Secret("secret-name", "secret-value");

      // Act & Assert
      await expect(environment.addSecret(secret)).rejects.toThrow();
    });

    it("should fail if cannot create or update secret", async () => {
      // Arrange
      octokit.rest.actions.createOrUpdateEnvironmentSecret.mockRejectedValueOnce(
        new Error("error")
      );
      const secret = new Secret("secret-name", "secret-value");

      // Act & Assert
      await expect(environment.addSecret(secret)).rejects.toThrow();
    });
  });
});
