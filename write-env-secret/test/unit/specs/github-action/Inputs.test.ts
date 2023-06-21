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
        secret: "test",
        value: "test",
        repositories: '["test/test"]',
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act
      const result = getInputs();

      // Assert
      expect(result).toBeDefined();
      expect(result.value).toBe(inputs.value);
      expect(result.secret).toBe(inputs.secret);
      expect(result.repositories).toEqual(JSON.parse(inputs.repositories));
      expect(result.environment).toBe(inputs.environment);
      expect(result.token).toBe(inputs.token);
    });

    it("should set environment as undefined if missing", () => {
      // Arrange
      const inputs: Record<string, string> = {
        secret: "test",
        value: "test",
        repositories: '["test/test"]',
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act
      const result = getInputs();

      // Assert
      expect(result.environment).toBeUndefined();
    });

    it("should set environment as undefined if empty", () => {
      // Arrange
      const inputs: Record<string, string> = {
        secret: "test",
        value: "test",
        repositories: '["test/test"]',
        environment: "",
        token: "test",
      };
      actionsCore.getInput.mockImplementation((name: string) => {
        return inputs[name] as string;
      });

      // Act
      const result = getInputs();

      // Assert
      expect(result.environment).toBeUndefined();
    });

    it("should throw an error if the project input is not a valid JSON string", () => {
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
      expect(() => getInputs()).toThrow();
    });

    it("should throw an error if the project input has not valid JSON schema", () => {
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

      // Act & Assert
      expect(() => getInputs()).toThrow();
    });
  });
});
