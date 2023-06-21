jest.mock("@src/lib/github/Octokit");

import {
  createOrUpdateEnvironmentSecret,
  getEnvironmentPublicKey,
  getEnvironment,
  getRepository,
} from "@support/fixtures/Octokit";

import * as octokitLibrary from "@src/lib/github/Octokit";

export const octokit = {
  rest: {
    repos: {
      get: jest.fn().mockImplementation(getRepository),
      getEnvironment: jest.fn().mockImplementation(getEnvironment),
    },
    actions: {
      getEnvironmentPublicKey: jest.fn().mockImplementation(getEnvironmentPublicKey),
      createOrUpdateEnvironmentSecret: jest
        .fn()
        .mockImplementation(createOrUpdateEnvironmentSecret),
    },
  },
};

// @ts-ignore-next-line
jest.spyOn(octokitLibrary, "getOctokit").mockImplementation(() => {
  return octokit;
});
