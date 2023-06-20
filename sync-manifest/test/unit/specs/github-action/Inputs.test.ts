import { actionsCore } from "@support/mocks/ActionsCore";

import { getInputs } from "@src/github-action/Inputs";

describe("Input", () => {
  describe("getInputs", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should be defined", () => {
      expect(getInputs).toBeDefined();
    });

    it("should return an object with the expected properties", () => {
      // Arrange
      const inputs: Record<string, string> = {
        manifest: "{}",
        project: '{"project": "test", "repositories": ["test"]}',
        token: "test",
        secret: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act
      const result = getInputs();

      // Assert
      expect(result).toBeDefined();
      expect(result.manifest).toBe(inputs.manifest);
      expect(result.project).toEqual(JSON.parse(inputs.project));
      expect(result.token).toBe(inputs.token);
      expect(result.secret).toBe(inputs.secret);
    });

    it("should throw an error if the project input is not a valid JSON string", () => {
      // Arrange
      const inputs: Record<string, string> = {
        manifest: "{}",
        project: "",
        token: "test",
        secret: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act & Assert
      expect(() => getInputs()).toThrow();
    });

    it("should throw an error if the project input has not valid JSON schema", () => {
      // Arrange
      const inputs: Record<string, string> = {
        manifest: "{}",
        project: '{"project": "", "repositories": [""]}',
        token: "test",
        secret: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act & Assert
      expect(() => getInputs()).toThrow();
    });
  });
});
