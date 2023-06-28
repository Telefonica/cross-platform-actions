import { buildGetInputs } from "@support/fixtures/Inputs";
import { actionsCore } from "@support/mocks/ActionsCore";
import "@support/mocks/Logger";
import "@support/mocks/Octokit";

import { runWriteSecretAndGetArtifactAction } from "@src/github-action/Action";
import * as writeSecretLib from "@src/lib/WriteSecret";

describe("Action", () => {
  describe("runWriteSecretAndGetArtifactAction", () => {
    let spyWriteSecret: jest.SpyInstance;
    let inputs: Record<string, string>;

    beforeEach(() => {
      spyWriteSecret = jest.spyOn(writeSecretLib, "writeSecret");
      inputs = {
        secret: "test",
        value: "test",
        repositories: "test/test",
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation(buildGetInputs(inputs));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should be defined", () => {
      expect(runWriteSecretAndGetArtifactAction).toBeDefined();
    });

    it("should return a void promise", async () => {
      // Arrange
      const expectedInputs = {
        secret: "test",
        value: "test",
        repositories: ["test/test"],
        environment: "test",
        token: "test",
      };

      // Act
      const result = await runWriteSecretAndGetArtifactAction();

      // Assert
      expect(result).toBeUndefined();
      expect(actionsCore.setOutput).toHaveBeenCalled();
      expect(spyWriteSecret).toHaveBeenCalledWith(expectedInputs, expect.anything());
    });

    it("should throw an error if sync fails", async () => {
      // Arrange
      spyWriteSecret.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(runWriteSecretAndGetArtifactAction()).rejects.toThrow();
      expect(actionsCore.setFailed).toHaveBeenCalled();
    });
  });
});
