import { octokit } from "@support/mocks/Octokit";

import { getOctokit } from "@src/lib/github/Octokit";
import { Repository } from "@src/lib/github/Repository";
import { RepositoryInterface } from "@src/lib/github/Repository.types";

describe("Repository", () => {
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
});
