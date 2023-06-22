/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";

// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { octokit } from "@support/mocks/Octokit";

import { getOctokit } from "@src/lib/github/Octokit";
import { Repository } from "@src/lib/github/Repository";
import { RepositoryInterface } from "@src/lib/github/Repository.types";
import { Secret } from "@src/lib/github/Secret";

describe("Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(Repository).toBeDefined();
  });

  it("should return a repository object", () => {
    // Arrange
    const name = "test";
    const owner = "test";

    // Act
    const repository = new Repository(name, owner, { octokit: getOctokit("test") });

    // Assert
    expect(repository).toBeInstanceOf(Repository);
  });

  describe("getEnvironment", () => {
    let repository: RepositoryInterface;

    beforeEach(() => {
      repository = new Repository("test", "test", { octokit: getOctokit("test") });
    });

    it("should return an environment", () => {
      // Arrange
      const name = "test";

      // Act
      const environment = repository.getEnvironment(name);

      // Assert
      expect(environment).toBeDefined();
    });

    it("should throw if fail retrieving self repository", async () => {
      // Arrange
      const name = "test";
      octokit.rest.repos.get.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(repository.getEnvironment(name)).rejects.toThrow();
    });

    it("should throw error if fail retrieving environment", async () => {
      // Arrange
      const name = "test";
      octokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          owner: {
            login: "test",
          },
          name: "test",
        },
      });
      octokit.rest.repos.getEnvironment.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(repository.getEnvironment(name)).rejects.toThrow();
    });
  });

  describe("addSecret", () => {
    let repository: RepositoryInterface;

    beforeEach(() => {
      repository = new Repository("test", "test", { octokit: getOctokit("test") });
    });

    it("should add a secret", async () => {
      // Arrange
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
      const secret = new Secret("test", "test");

      // Act
      await repository.addSecret(secret);

      // Assert
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

    it("should fail if the repository public key cannot be retrieved", async () => {
      // Arrange
      octokit.rest.actions.getRepoPublicKey.mockRejectedValueOnce(new Error("test"));
      const secret = new Secret("test", "test");

      // Act & Assert
      await expect(repository.addSecret(secret)).rejects.toThrow();
    });

    it("should fail if cannot create or update secret", async () => {
      // Arrange
      octokit.rest.actions.createOrUpdateRepoSecret.mockRejectedValueOnce(new Error("test"));
      const secret = new Secret("test", "test");

      // Act & Assert
      await expect(repository.addSecret(secret)).rejects.toThrow();
    });
  });
});
