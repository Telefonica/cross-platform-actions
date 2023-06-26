import { EnvironmentInterface } from "@src/environments";
import { EnvironmentSecret } from "@src/secrets";

describe("EnvironmentSecret", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(EnvironmentSecret).toBeTruthy();
  });

  it("should be instantiable", () => {
    // Arrange
    const name = "name";
    const value = "value";
    const environment: EnvironmentInterface = {
      name: "name",
      repository: {
        owner: "owner",
        repo: "repo",
      },
    };

    // Act
    const secret = new EnvironmentSecret(name, value, environment);

    // Assert
    expect(secret).toBeInstanceOf(EnvironmentSecret);
    expect(secret.name).toBe(name);
    expect(secret.value).toBe(value);
    expect(secret.environment).toBe(environment);
  });

  describe("createSecret", () => {
    it("should call secretService.createEnvironmentSecret", async () => {
      // Arrange
      const name = "name";
      const value = "value";
      const environment: EnvironmentInterface = {
        name: "name",
        repository: {
          owner: "owner",
          repo: "repo",
        },
      };
      const secret = new EnvironmentSecret(name, value, environment);
      const context = {
        secretService: {
          createEnvironmentSecret: jest.fn(),
        },
      };

      // Act
      await secret.createSecret(context as any);

      // Assert
      expect(context.secretService.createEnvironmentSecret).toHaveBeenCalledWith(context, secret);
    });

    it("should throw error if secretService.createEnvironmentSecret throws error", async () => {
      // Arrange
      const name = "name";
      const value = "value";
      const environment: EnvironmentInterface = {
        name: "name",
        repository: {
          owner: "owner",
          repo: "repo",
        },
      };
      const secret = new EnvironmentSecret(name, value, environment);
      const context = {
        secretService: {
          createEnvironmentSecret: jest.fn().mockRejectedValue(new Error("error")),
        },
      };

      // Act & Assert
      await expect(secret.createSecret(context as any)).rejects.toThrow();
    });
  });
});
