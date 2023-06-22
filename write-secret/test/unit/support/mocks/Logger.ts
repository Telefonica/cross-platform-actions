jest.mock("@src/github-action/Logger");

import * as loggerLibrary from "@src/github-action/Logger";

export const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  notice: jest.fn(),
  debug: jest.fn(),
};

jest.spyOn(loggerLibrary, "getLogger").mockImplementation(() => {
  return logger;
});
