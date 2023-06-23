import { dedent } from "ts-dedent";

import { buildGetInputs } from "@support/fixtures/Inputs";
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
        repositories: "test/test",
        environment: "test",
        token: "test",
      };
      actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

      // Act
      const result = getInputs();

      // Assert
      expect(result).toBeDefined();
      expect(result.value).toBe("test");
      expect(result.secret).toBe("test");
      expect(result.repositories).toEqual(["test/test"]);
      expect(result.environment).toBe("test");
      expect(result.token).toBe("test");
    });

    describe("repositories", () => {
      it("should throw an error if the repositories input is empty", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: "",
          environment: "test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act & Assert
        expect(() => getInputs()).toThrow();
      });

      it("should throw an error if the repositories input contains repository without owner", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: "test",
          environment: "test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act & Assert
        expect(() => getInputs()).toThrow();
      });

      it("should accept repositories input as multiple space separated values", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: "test/test test2/test2  test3/test3",
          environment: "test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act
        const result = getInputs();

        // Assert
        expect(result.repositories).toEqual(["test/test", "test2/test2", "test3/test3"]);
      });

      it("should accept repositories input as tab separated values", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: "test/test  test2/test2",
          environment: "test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act
        const result = getInputs();

        // Assert
        expect(result.repositories).toEqual(["test/test", "test2/test2"]);
      });

      it("should accept repositories input as new-line separated values", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: dedent`
          test/test
          test2/test2
          `,
          environment: "test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act
        const result = getInputs();

        // Assert
        expect(result.repositories).toEqual(["test/test", "test2/test2"]);
      });
    });

    describe("environment", () => {
      it("should set environment as undefined if missing", () => {
        // Arrange
        const inputs: Record<string, string> = {
          secret: "test",
          value: "test",
          repositories: "test/test",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

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
          repositories: "test/test",
          environment: "",
          token: "test",
        };
        actionsCore.getInput.mockImplementation(buildGetInputs(inputs));

        // Act
        const result = getInputs();

        // Assert
        expect(result.environment).toBeUndefined();
      });
    });
  });
});
