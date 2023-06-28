/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { logger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

import { writeSecret } from "@src/lib/WriteSecret";

describe("writeSecret", () => {
  it("should be defined", () => {
    expect(writeSecret).toBeDefined();
  });

  describe("write repository secret", () => {
    it("should return a writeSecret manifest object", async () => {
      // Arrange
      await sodium.ready;
      const keyPair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getRepoPublicKey.mockResolvedValueOnce({
        data: {
          key_id: "key-id",
          key: publicKey,
        },
      });
      const inputs = {
        value: "secret-value",
        secret: "secret-name",
        repositories: ["repository-owner/repository-repo"],
        token: "token",
      };

      // Act
      const manifest = await writeSecret(inputs, logger);

      // Assert
      expect(manifest).toBe(
        JSON.stringify({
          github: {
            secrets: [
              {
                secret: "secret-name",
                repository: "repository-owner/repository-repo",
              },
            ],
          },
        })
      );
      expect(octokit.rest.actions.getRepoPublicKey).toHaveBeenCalledWith({
        owner: "repository-owner",
        repo: "repository-repo",
      });
      expect(octokit.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledWith({
        key_id: "key-id",
        owner: "repository-owner",
        repo: "repository-repo",
        secret_name: "secret-name",
        encrypted_value: expect.toHaveEncryptedValue("secret-value", keyPair),
      });
    });

    it("should throw an error if the repository fails adding secret", async () => {
      // Arrange
      octokit.rest.actions.getRepoPublicKey.mockRejectedValueOnce(new Error("error"));
      const inputs = {
        value: "secret-value",
        secret: "secret-name",
        repositories: ["repository-owner/repository-repo"],
        token: "token",
      };

      // Act & Assert
      await expect(writeSecret(inputs, logger)).rejects.toThrow();
    });
  });

  describe("write env secret", () => {
    it("should return a writeSecret manifest object", async () => {
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
      const inputs = {
        value: "secret-value",
        secret: "secret-name",
        repositories: ["repository-owner/repository-repo"],
        environment: "environment-name",
        token: "token",
      };

      // Act
      const manifest = await writeSecret(inputs, logger);

      // Assert
      expect(manifest).toBe(
        JSON.stringify({
          github: {
            secrets: [
              {
                secret: "secret-name",
                repository: "repository-owner/repository-repo",
                environment: "environment-name",
              },
            ],
          },
        })
      );
      expect(octokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "repository-owner",
        repo: "repository-repo",
      });
      expect(octokit.rest.repos.getEnvironment).toHaveBeenCalledWith({
        owner: "repository-owner",
        repo: "repository-repo",
        environment_name: "environment-name",
      });
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

    it("should throw an error if the repository fails adding secret", async () => {
      // Arrange
      octokit.rest.repos.getEnvironment.mockRejectedValueOnce(new Error("error"));
      const inputs = {
        value: "secret-value",
        secret: "secret-name",
        repositories: ["repository-owner/repository-repo"],
        environment: "environment-name",
        token: "token",
      };

      // Act & Assert
      await expect(writeSecret(inputs, logger)).rejects.toThrow();
    });
  });
});
