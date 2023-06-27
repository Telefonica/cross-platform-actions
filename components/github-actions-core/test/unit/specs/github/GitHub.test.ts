/* eslint-disable @typescript-eslint/no-explicit-any */
import "@support/matchers/toHaveEncryptedValue";

/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { MockedOctokit, octokit } from "@support/mocks/OctokitCore";

import { ContextInterface } from "@src/context";
import { GitHub } from "@src/github";
import { EnvironmentSecretInterface, RepositorySecretInterface } from "@src/secrets";

describe("GitHub", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(GitHub).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange & Act
    const github = new GitHub("token");

    // Assert
    expect(github).toBeInstanceOf(GitHub);
    expect(MockedOctokit).toHaveBeenCalledWith({ auth: "token" });
  });

  describe("createRepositorySecret", () => {
    it("should create a repository secret", async () => {
      // Arrange
      await sodium.ready;
      const context: ContextInterface = {} as any;
      const secret: RepositorySecretInterface = {
        name: "secret",
        value: "value",
        repository: {
          owner: "owner",
          repo: "repo",
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({ data: {} });
      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getRepoPublicKey.mockResolvedValueOnce({ data: { key: publicKey } });
      octokit.rest.actions.createOrUpdateRepoSecret.mockResolvedValueOnce({});
      const github = new GitHub("token");

      // Act
      await github.createRepositorySecret(context, secret);

      // Assert
      expect(octokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
      });
      expect(octokit.rest.actions.getRepoPublicKey).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
      });
      expect(octokit.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        secret_name: "secret",
        encrypted_value: expect.toHaveEncryptedValue("value", keypair),
      });
    });

    it("should throw an error if the repository does not exist", async () => {
      // Arrange
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: RepositorySecretInterface = {
        name: "secret",
        value: "value",
        repository: {
          owner: "owner",
          repo: "repo",
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createRepositorySecret(context, secret)).rejects.toThrow();
    });

    it("should throw an error if the public key does not exist", async () => {
      // Arrange
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: RepositorySecretInterface = {
        name: "secret",
        value: "value",
        repository: {
          owner: "owner",
          repo: "repo",
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({ data: {} });
      octokit.rest.actions.getRepoPublicKey.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createRepositorySecret(context, secret)).rejects.toThrow();
    });

    it("should throw an error if the secret cannot be created", async () => {
      // Arrange
      await sodium.ready;
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: RepositorySecretInterface = {
        name: "secret",
        value: "value",
        repository: {
          owner: "owner",
          repo: "repo",
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({ data: {} });
      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getRepoPublicKey.mockResolvedValueOnce({ data: { key: publicKey } });
      octokit.rest.actions.createOrUpdateRepoSecret.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createRepositorySecret(context, secret)).rejects.toThrow();
    });
  });

  describe("createEnvironmentSecret", () => {
    it("should create an environment secret", async () => {
      // Arrange
      await sodium.ready;
      const context: ContextInterface = {} as any;
      const secret: EnvironmentSecretInterface = {
        name: "secret",
        value: "value",
        environment: {
          name: "env",
          repository: {
            owner: "owner",
            repo: "repo",
          },
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          id: 1,
        },
      });
      octokit.rest.repos.getEnvironment.mockResolvedValueOnce({ data: {} });
      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getEnvironmentPublicKey.mockResolvedValueOnce({
        data: { key_id: "test", key: publicKey },
      });
      octokit.rest.actions.createOrUpdateEnvironmentSecret.mockResolvedValueOnce({});
      const github = new GitHub("token");

      // Act
      await github.createEnvironmentSecret(context, secret);

      // Assert
      expect(octokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
      });
      expect(octokit.rest.repos.getEnvironment).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        environment_name: "env",
      });
      expect(octokit.rest.actions.getEnvironmentPublicKey).toHaveBeenCalledWith({
        repository_id: 1,
        environment_name: "env",
      });
      expect(octokit.rest.actions.createOrUpdateEnvironmentSecret).toHaveBeenCalledWith({
        key_id: "test",
        repository_id: 1,
        environment_name: "env",
        secret_name: "secret",
        encrypted_value: expect.toHaveEncryptedValue("value", keypair),
      });
    });

    it("should throw an error if the repository does not exist", async () => {
      // Arrange
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: EnvironmentSecretInterface = {
        name: "secret",
        value: "value",
        environment: {
          name: "env",
          repository: {
            owner: "owner",
            repo: "repo",
          },
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createEnvironmentSecret(context, secret)).rejects.toThrow();
    });

    it("should throw an error if the environment does not exist", async () => {
      // Arrange
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: EnvironmentSecretInterface = {
        name: "secret",
        value: "value",
        environment: {
          name: "env",
          repository: {
            owner: "owner",
            repo: "repo",
          },
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          id: 1,
        },
      });
      octokit.rest.repos.getEnvironment.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createEnvironmentSecret(context, secret)).rejects.toThrow();
    });

    it("should throw an error if the public key does not exist", async () => {
      // Arrange
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: EnvironmentSecretInterface = {
        name: "secret",
        value: "value",
        environment: {
          name: "env",
          repository: {
            owner: "owner",
            repo: "repo",
          },
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          id: 1,
        },
      });
      octokit.rest.repos.getEnvironment.mockResolvedValueOnce({ data: {} });
      octokit.rest.actions.getEnvironmentPublicKey.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(github.createEnvironmentSecret(context, secret)).rejects.toThrow();
    });

    it("should throw an error if the secret cannot be created", async () => {
      // Arrange
      await sodium.ready;
      const github = new GitHub("token");
      const context: ContextInterface = {} as any;
      const secret: EnvironmentSecretInterface = {
        name: "secret",
        value: "value",
        environment: {
          name: "env",
          repository: {
            owner: "owner",
            repo: "repo",
          },
        },
        createSecret: jest.fn(),
      };
      octokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          id: 1,
        },
      });
      octokit.rest.repos.getEnvironment.mockResolvedValueOnce({ data: {} });
      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
      octokit.rest.actions.getEnvironmentPublicKey.mockResolvedValueOnce({
        data: { key_id: "test", key: publicKey },
      });
      octokit.rest.actions.createOrUpdateEnvironmentSecret.mockRejectedValueOnce(
        new Error("test")
      );

      // Act & Assert
      await expect(github.createEnvironmentSecret(context, secret)).rejects.toThrow();
    });
  });
});
