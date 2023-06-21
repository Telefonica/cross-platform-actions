import { getLogger } from "@src/github-action/Logger";

describe("Logger", () => {
  describe("getLogger", () => {
    it("should be defined", () => {
      expect(getLogger).toBeDefined();
    });

    it("should return a logger object", () => {
      // Arrange & Act
      const logger = getLogger();

      // Assert
      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warning).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.notice).toBeDefined();
      expect(logger.debug).toBeDefined();
    });
  });
});
