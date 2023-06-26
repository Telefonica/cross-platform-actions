import "@support/matchers/toHaveEncryptedValue";

import "@support/mocks/GithubActionsCore";
import { createSecrets } from "github-actions-core";

import { logger } from "@support/mocks/Logger";

import { writeSecret } from "@src/lib/WriteSecret";

describe("writeSecret", () => {
  it("should be defined", () => {
    expect(writeSecret).toBeDefined();
  });

  it("should return a writeSecret manifest object", async () => {
    // Arrange
    jest.mocked(createSecrets).mockResolvedValueOnce([
      {
        secret: "test",
        repository: "test/test",
      },
    ]);
    const inputs = {
      value: "test",
      secret: "test",
      repositories: ["test/test"],
      token: "test",
    };

    // Act
    const manifest = await writeSecret(inputs, logger);

    // Assert
    expect(manifest).toBe(
      JSON.stringify({
        github: {
          secrets: [
            {
              secret: "test",
              repository: "test/test",
            },
          ],
        },
      })
    );
    expect(createSecrets).toHaveBeenCalledWith(inputs, logger);
  });

  it("should throw an error if create secrets fails", async () => {
    // Arrange
    jest.mocked(createSecrets).mockRejectedValueOnce(new Error("test"));
    const inputs = {
      value: "test",
      secret: "test",
      repositories: ["test/test"],
      token: "test",
    };

    // Act & Assert
    await expect(writeSecret(inputs, logger)).rejects.toThrow("test");
  });
});
