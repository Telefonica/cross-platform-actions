jest.mock("octokit");

import * as octokitLibrary from "octokit";

export const octokit = {
  request: jest.fn().mockResolvedValue({}),
};

// @ts-ignore-next-line
jest.spyOn(octokitLibrary, "Octokit").mockImplementation(() => {
  return octokit;
});
