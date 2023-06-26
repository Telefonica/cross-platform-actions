jest.mock("@actions/core");

import * as actionsCoreLibrary from "@actions/core";

export const actionsCore = {
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
};

jest.spyOn(actionsCoreLibrary, "getInput").mockImplementation(actionsCore.getInput);
jest.spyOn(actionsCoreLibrary, "setOutput").mockImplementation(actionsCore.setOutput);
jest.spyOn(actionsCoreLibrary, "setFailed").mockImplementation(actionsCore.setFailed);
