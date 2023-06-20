/* eslint-disable import/no-named-as-default-member */
import "@support/matchers/toHaveEncryptedValue";

// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

import { logger } from "@support/mocks/Logger";
import { octokit } from "@support/mocks/Octokit";

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
    octokit.rest.actions.getRepoPublicKey.mockResolvedValueOnce({
      data: {
        key: publicKey,
      },
    });
    const inputs = {
      manifest: "{}",
      project: {
        project: "test",
        repositories: ["test"],
      },
      secret: "test",
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
                name: "test",
                owner: "Telefonica",
              },
              secret: {
                name: "test",
              },
            },
          ],
        },
      })
    );
    expect(octokit.rest.actions.getRepoPublicKey).toHaveBeenCalledWith({
      owner: "Telefonica",
      repo: "test",
    });
    expect(octokit.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledWith({
      owner: "Telefonica",
      repo: "test",
      secret_name: "test",
      encrypted_value: expect.toHaveEncryptedValue("{}", keyPair),
    });
  });
});
