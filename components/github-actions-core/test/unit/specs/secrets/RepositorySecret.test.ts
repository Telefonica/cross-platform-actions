import { RepositoryInterface } from "@src/repositories";
import { RepositorySecret } from "@src/secrets";

describe("RepositorySecret", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(RepositorySecret).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange
    const name = "name";
    const value = "value";
    const repository: RepositoryInterface = {
      owner: "owner",
      repo: "repo",
    };

    // Act
    const secret = new RepositorySecret(name, value, repository);

    // Assert
    expect(secret).toBeInstanceOf(RepositorySecret);
    expect(secret.name).toBe(name);
    expect(secret.value).toBe(value);
    expect(secret.repository).toBe(repository);
  });

  describe("createSecret", () => {
    it("should call secretService.createRepositorySecret", async () => {
      // Arrange
      const name = "name";
      const value = "value";
      const repository: RepositoryInterface = {
        owner: "owner",
        repo: "repo",
      };
      const secret = new RepositorySecret(name, value, repository);
      const context = {
        secretService: {
          createRepositorySecret: jest.fn(),
        },
      };

      // Act
      await secret.createSecret(context as any);

      // Assert
      expect(context.secretService.createRepositorySecret).toHaveBeenCalledWith(context, secret);
    });

    it("should throw error if secretService.createRepositorySecret throws error", async () => {
      // Arrange
      const name = "name";
      const value = "value";
      const repository: RepositoryInterface = {
        owner: "owner",
        repo: "repo",
      };
      const secret = new RepositorySecret(name, value, repository);
      const context = {
        secretService: {
          createRepositorySecret: jest.fn().mockRejectedValue(new Error("error")),
        },
      };

      // Act & Assert
      await expect(secret.createSecret(context as any)).rejects.toThrow();
    });
  });
});
