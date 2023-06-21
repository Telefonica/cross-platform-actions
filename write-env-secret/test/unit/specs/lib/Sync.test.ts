/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { logger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

import * as repository from "@src/lib/github/Repository";
import { sync } from "@src/lib/Sync";

describe("sync", () => {
  it("should be defined", () => {
    expect(sync).toBeDefined();
  });

  it("should return a sync manifest object", async () => {
    // Arrange
    await sodium.ready;
    const keyPair = sodium.crypto_box_keypair();
    const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
    octokit.rest.actions.getEnvironmentPublicKey.mockResolvedValueOnce({
      data: {
        key_id: "test",
        key: publicKey,
      },
    });
    const inputs = {
      value: "test",
      secret: "test",
      repositories: ["test/test"],
      environment: "test",
      token: "test",
    };

    // Act
    const manifest = await sync(inputs, logger);

    // Assert
    expect(manifest).toBe(
      JSON.stringify({
        github: {
          secrets: [
            {
              repository: {
                owner: "test",
                name: "test",
              },
              environment: "test",
              secret: "test",
            },
          ],
        },
      })
    );
    expect(octokit.rest.actions.getEnvironmentPublicKey).toHaveBeenCalledWith({
      repository_id: 1,
      environment_name: "test",
    });
    expect(octokit.rest.actions.createOrUpdateEnvironmentSecret).toHaveBeenCalledWith({
      key_id: "test",
      repository_id: 1,
      environment_name: "test",
      secret_name: "test",
      encrypted_value: expect.toHaveEncryptedValue("test", keyPair),
    });
  });

  it("should throw an error if the repository fails adding secret", async () => {
    // Arrange
    jest.spyOn(repository, "Repository").mockImplementationOnce(() => {
      return {
        getEnvironment() {
          throw new Error("test");
        },
      } as any;
    });
    octokit.rest.actions.createOrUpdateEnvironmentSecret.mockRejectedValueOnce(new Error("test"));
    const inputs = {
      value: "test",
      secret: "test",
      repositories: ["test/test"],
      environment: "test",
      token: "test",
    };

    // Act & Assert
    await expect(sync(inputs, logger)).rejects.toThrow("test");
  });
});
