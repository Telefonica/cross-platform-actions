jest.mock("@src/lib/github/Octokit");

import {
  createOrUpdateEnvironmentSecret,
  getEnvironmentPublicKey,
  getEnvironment,
  getRepository,
  getRepoPublicKey,
  createOrUpdateRepoSecret,
} from "@support/fixtures/Octokit";

import * as octokitLibrary from "@src/lib/github/Octokit";

export const octokit = {
  rest: {
    repos: {
      get: jest.fn().mockImplementation(getRepository),
      getEnvironment: jest.fn().mockImplementation(getEnvironment),
    },
    actions: {
      getRepoPublicKey: jest.fn().mockImplementation(getRepoPublicKey),
      createOrUpdateRepoSecret: jest.fn().mockImplementation(createOrUpdateRepoSecret),
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
