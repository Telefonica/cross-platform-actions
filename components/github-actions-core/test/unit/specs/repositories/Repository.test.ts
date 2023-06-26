import { Repository } from "@src/repositories";

describe("Repository", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(Repository).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange
    const repository = "owner/repo";

    // Act
    const repo = new Repository(repository);

    // Assert
    expect(repo).toBeInstanceOf(Repository);
    expect(repo.owner).toBe("owner");
    expect(repo.repo).toBe("repo");
  });

  it("should throw error if repository name is invalid", () => {
    // Arrange
    const repository = "invalid";

    // Act & Assert
    expect(() => new Repository(repository)).toThrow();
  });
});
