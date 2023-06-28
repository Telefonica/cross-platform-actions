import { getConfig } from "@src/lib/config/Config";

describe("getConfig", () => {
  it("should be defined", () => {
    expect(getConfig).toBeDefined();
  });

  it("should return a config object", () => {
    // Arrange & Act
    const config = getConfig({
      repositories: ["owner/repo"],
    });

    // Assert
    expect(config).toBeDefined();
    expect(config.repositories).toEqual([
      {
        owner: "owner",
        repo: "repo",
      },
    ]);
  });
});
