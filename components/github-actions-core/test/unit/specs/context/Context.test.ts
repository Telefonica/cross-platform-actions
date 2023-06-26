import { logger } from "@support/fixtures/Logger";

import { Context } from "@src/context";
import { SecretServiceInterface } from "@src/secrets";

describe("Context", () => {
  it("should be tested", () => {
    expect(true).toBeTruthy();
  });

  it("should be defined", () => {
    expect(Context).toBeDefined();
  });

  it("should be instantiable", () => {
    // Arrange
    const secretService: SecretServiceInterface = {
      createEnvironmentSecret: jest.fn(),
      createRepositorySecret: jest.fn(),
    };

    // Act
    const context = new Context({ secretService, logger });

    // Assert
    expect(context).toBeInstanceOf(Context);
    expect(context.secretService).toBe(secretService);
    expect(context.logger).toBe(logger);
  });
});
