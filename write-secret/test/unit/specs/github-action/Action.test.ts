import { actionsCore } from "@support/mocks/ActionsCore";
import "@support/mocks/Logger";
import "@support/mocks/Octokit";

import { runDeployAndGetArtifactAction } from "@src/github-action/Action";
import * as writeSecretLib from "@src/lib/WriteSecret";

describe("Action", () => {
  describe("runDeployAndGetArtifactAction", () => {
    let spyWriteSecret: jest.SpyInstance;

    beforeEach(() => {
      spyWriteSecret = jest.spyOn(writeSecretLib, "writeSecret");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should be defined", () => {
      expect(runDeployAndGetArtifactAction).toBeDefined();
    });

    it("should return a void promise", async () => {
      // Arrange
      const inputs: Record<string, string> = {
        secret: "test",
        value: "test",
        repositories: '["test/test"]',
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });
      const expectedInputs = {
        secret: "test",
        value: "test",
        repositories: ["test/test"],
        environment: "test",
        token: "test",
      };

      // Act
      const result = await runDeployAndGetArtifactAction();

      // Assert
      expect(result).toBeUndefined();
      expect(actionsCore.setOutput).toHaveBeenCalled();
      expect(spyWriteSecret).toHaveBeenCalledWith(expectedInputs, expect.anything());
    });

    it("should throw an error if the project input is not a valid JSON string", async () => {
      // Arrange
      const inputs: Record<string, string> = {
        secret: "test",
        value: "test",
        repositories: '["test/test"',
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act & Assert
      await expect(runDeployAndGetArtifactAction()).rejects.toThrow();
      expect(actionsCore.setFailed).toHaveBeenCalled();
    });

    it("should throw an error if sync fails", async () => {
      // Arrange
      const inputs: Record<string, string> = {
        secret: "test",
        value: "test",
        repositories: '[""]',
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });
      spyWriteSecret.mockRejectedValueOnce(new Error("test"));

      // Act & Assert
      await expect(runDeployAndGetArtifactAction()).rejects.toThrow();
      expect(actionsCore.setFailed).toHaveBeenCalled();
    });
  });
});
