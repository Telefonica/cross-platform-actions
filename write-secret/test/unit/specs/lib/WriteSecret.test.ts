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
          key_id: "test",
          key: publicKey,
        },
      });
      const inputs = {
        value: "test",
        secret: "test",
        repositories: ["test/test"],
        token: "test",
      };

      // Act
      const manifest = await writeSecret(inputs, logger);

      // Assert
      expect(manifest).toBe(
        JSON.stringify({
          github: {
            secrets: [
              {
                secret: "test",
                repository: "test/test",
              },
            ],
          },
        })
      );
      expect(octokit.rest.actions.getRepoPublicKey).toHaveBeenCalledWith({
        owner: "test",
        repo: "test",
      });
      expect(octokit.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledWith({
        key_id: "test",
        owner: "test",
        repo: "test",
        secret_name: "test",
        encrypted_value: expect.toHaveEncryptedValue("test", keyPair),
      });
    });

    it("should throw an error if the repository fails adding secret", async () => {
      // Arrange
      octokit.rest.actions.getRepoPublicKey.mockRejectedValueOnce(new Error("test"));
      const inputs = {
        value: "test",
        secret: "test",
        repositories: ["test/test"],
        token: "test",
      };

      // Act & Assert
      await expect(writeSecret(inputs, logger)).rejects.toThrow("test");
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
          key_id: "test",
          key: publicKey,
        },
      });
      const inputs = {
        value: "test",
        secret: "test",
        repositories: ["test/test"],
        environment: "test",
        token: "test",
      };

      // Act
      const manifest = await writeSecret(inputs, logger);

      // Assert
      expect(manifest).toBe(
        JSON.stringify({
          github: {
            secrets: [
              {
                secret: "test",
                repository: "test/test",
                environment: "test",
              },
            ],
          },
        })
      );
      expect(octokit.rest.actions.getEnvironmentPublicKey).toHaveBeenCalledWith({
        repository_id: 1,
        environment_name: "test",
      });
      expect(octokit.rest.actions.createOrUpdateEnvironmentSecret).toHaveBeenCalledWith({
        key_id: "test",
        repository_id: 1,
        environment_name: "test",
        secret_name: "test",
        encrypted_value: expect.toHaveEncryptedValue("test", keyPair),
      });
    });

    it("should throw an error if the repository fails adding secret", async () => {
      // Arrange
      octokit.rest.repos.getEnvironment.mockRejectedValueOnce(new Error("test"));
      const inputs = {
        value: "test",
        secret: "test",
        repositories: ["test/test"],
        environment: "test",
        token: "test",
      };

      // Act & Assert
      await expect(writeSecret(inputs, logger)).rejects.toThrow("test");
    });
  });
});
