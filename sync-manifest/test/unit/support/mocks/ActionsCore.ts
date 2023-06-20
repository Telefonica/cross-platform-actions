jest.mock("@actions/core");

import * as actionsCoreLibrary from "@actions/core";

export const actionsCore = {
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  getInput: jest.fn(),
};

jest.spyOn(actionsCoreLibrary, "setOutput").mockImplementation(actionsCore.setOutput);
jest.spyOn(actionsCoreLibrary, "setFailed").mockImplementation(actionsCore.setFailed);
jest.spyOn(actionsCoreLibrary, "getInput").mockImplementation(actionsCore.getInput);
