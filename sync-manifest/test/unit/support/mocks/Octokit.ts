jest.mock("@src/lib/github/Octokit");

import { createOrUpdateRepoSecret, getRepoPublicKey } from "@support/fixtures/Octokit";

import * as octokitLibrary from "@src/lib/github/Octokit";

export const octokit = {
  rest: {
    actions: {
      getRepoPublicKey: jest.fn().mockImplementation(getRepoPublicKey),
      createOrUpdateRepoSecret: jest.fn().mockImplementation(createOrUpdateRepoSecret),
    },
  },
};

// @ts-ignore-next-line
jest.spyOn(octokitLibrary, "Octokit").mockImplementation(() => {
  return octokit;
});
