jest.mock("@src/github");

import { logger } from "@support/fixtures/Logger";

import { createSecrets } from "@src/commands/CreateSecrets";
import { CreateSecretsInputs } from "@src/commands/CreateSecrets.types";
import * as githubModule from "@src/github";

describe("CreateSecrets", () => {
  let mockedCreateRepositorySecret: jest.MockedFn<
    githubModule.GitHubInterface["createRepositorySecret"]
  >;
  let mockedCreateEnvironmentSecret: jest.MockedFn<
    githubModule.GitHubInterface["createEnvironmentSecret"]
  >;

  beforeAll(() => {
    mockedCreateRepositorySecret = jest.fn().mockImplementation(() => Promise.resolve());
    mockedCreateEnvironmentSecret = jest.fn().mockImplementation(() => Promise.resolve());

    jest.spyOn(githubModule, "GitHub").mockImplementation(() => {
      return {
        createRepositorySecret: mockedCreateRepositorySecret,
        createEnvironmentSecret: mockedCreateEnvironmentSecret,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(createSecrets).toBeDefined();
  });

  describe("without environment input", () => {
    it("should create secrets and return manifest", () => {
      // Arrange
      const inputs: CreateSecretsInputs = {
        repositories: ["owner/repo1", "owner/repo2"],
        secret: "secret",
        value: "value",
        token: "token",
      };

      // Act
      const result = createSecrets(inputs, logger);

      // Assert
      return expect(result).resolves.toEqual([
        {
          secret: "secret",
          repository: "owner/repo1",
        },
        {
          secret: "secret",
          repository: "owner/repo2",
        },
      ]);
    });

    it("should throw error if secret creation fails", async () => {
      // Arrange
      const inputs: CreateSecretsInputs = {
        repositories: ["owner/repo1", "owner/repo2"],
        secret: "secret",
        value: "value",
        token: "token",
      };
      mockedCreateRepositorySecret.mockRejectedValueOnce(new Error("error"));

      // Act & Assert
      await expect(createSecrets(inputs, logger)).rejects.toThrow();
    });
  });

  describe("with environment input", () => {
    it("should create secrets and return manifest", () => {
      // Arrange
      const inputs: CreateSecretsInputs = {
        repositories: ["owner/repo1", "owner/repo2"],
        secret: "secret",
        value: "value",
        token: "token",
        environment: "environment",
      };

      // Act
      const result = createSecrets(inputs, logger);

      // Assert
      return expect(result).resolves.toEqual([
        {
          secret: "secret",
          repository: "owner/repo1",
          environment: "environment",
        },
        {
          secret: "secret",
          repository: "owner/repo2",
          environment: "environment",
        },
      ]);
    });

    it("should throw error if secret creation fails", async () => {
      // Arrange
      const inputs: CreateSecretsInputs = {
        repositories: ["owner/repo1", "owner/repo2"],
        secret: "secret",
        value: "value",
        token: "token",
      };
      mockedCreateRepositorySecret.mockRejectedValueOnce(new Error("error"));

      // Act & Assert
      await expect(createSecrets(inputs, logger)).rejects.toThrow();
    });
  });
});
