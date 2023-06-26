import { Environment } from "@src/environments";
import { RepositoryInterface } from "@src/repositories";

describe("Environment", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(Environment).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange
    const name = "name";
    const repository: RepositoryInterface = {
      owner: "owner",
      repo: "repo",
    };

    // Act
    const environment = new Environment(name, repository);

    // Assert
    expect(environment).toBeInstanceOf(Environment);
    expect(environment.name).toBe(name);
    expect(environment.repository).toBe(repository);
  });
});
