/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";

// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { octokit } from "@support/mocks/Octokit";

import { Environment } from "@src/lib/github/Environment";
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
    const owner = "repository-owner";
    const name = "repository-name";

    // Act
    const repository = new Repository(owner, name, { octokit: getOctokit("token") });

    // Assert
    expect(repository).toBeInstanceOf(Repository);
  });

  describe("getEnvironment", () => {
    let repository: RepositoryInterface;

    beforeEach(() => {
      repository = new Repository("repository-owner", "repository-name", {
        octokit: getOctokit("token"),
      });
    });

    it("should return an environment", async () => {
      // Arrange
      const name = "environment-name";

      // Act
      const environment = await repository.getEnvironment(name);

      // Assert
      expect(environment).toBeDefined();
      expect(environment).toBeInstanceOf(Environment);
    });

    it("should throw if fail retrieving self repository", async () => {
      // Arrange
      const name = "environment-name";
      octokit.rest.repos.get.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(repository.getEnvironment(name)).rejects.toThrow();
    });

    it("should throw error if fail retrieving environment", async () => {
      // Arrange
      const name = "environment-name";
      octokit.rest.repos.get.mockResolvedValueOnce({ data: { id: 1 } });
      octokit.rest.repos.getEnvironment.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(repository.getEnvironment(name)).rejects.toThrow();
    });
  });

  describe("addSecret", () => {
    let repository: RepositoryInterface;

    beforeEach(() => {
      repository = new Repository("repository-owner", "repository-repo", {
        octokit: getOctokit("token"),
      });
    });

    it("should add a secret", async () => {
      // Arrange
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
      const secret = new Secret("secret-name", "secret-value");

      // Act
      await repository.addSecret(secret);

      // Assert
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

    it("should fail if the repository public key cannot be retrieved", async () => {
      // Arrange
      octokit.rest.actions.getRepoPublicKey.mockRejectedValueOnce(new Error("error"));
      const secret = new Secret("secret-name", "secret-value");

      // Act & Assert
      await expect(repository.addSecret(secret)).rejects.toThrow();
    });

    it("should fail if cannot create or update secret", async () => {
      // Arrange
      octokit.rest.actions.createOrUpdateRepoSecret.mockRejectedValueOnce(new Error("error"));
      const secret = new Secret("secret-name", "secret-value");

      // Act & Assert
      await expect(repository.addSecret(secret)).rejects.toThrow();
    });
  });
});
