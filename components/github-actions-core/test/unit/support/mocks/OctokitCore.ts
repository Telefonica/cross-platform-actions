jest.mock("@octokit/core");

import * as octokitModule from "@octokit/core";

export const octokit = {
  rest: {
    actions: {
      createOrUpdateEnvironmentSecret: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
      getEnvironmentPublicKey: jest.fn(),
      getRepoPublicKey: jest.fn(),
    },
    repos: {
      get: jest.fn(),
      getEnvironment: jest.fn(),
    },
  },
};

export const MockedOctokit = jest.fn().mockImplementation(() => {
  return octokit;
});

// @ts-ignore
jest.spyOn(octokitModule, "Octokit").mockImplementation(() => MockedOctokit());
octokitModule.Octokit.plugin = jest.fn().mockImplementation(() => MockedOctokit);
