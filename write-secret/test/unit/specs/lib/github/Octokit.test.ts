import { MockOctokit } from "@support/mocks/OctokitCore";

import { getOctokit } from "@src/lib/github/Octokit";

describe("Octokit", () => {
  describe("getOctokit", () => {
    it("should be defined", () => {
      expect(getOctokit).toBeDefined();
    });

    it("should return an Octokit instance", () => {
      const octokit = getOctokit("token");

      expect(octokit).toBeDefined();
      expect(octokit).toBeInstanceOf(MockOctokit);
    });

    it("should return always same instance", () => {
      const octokit = getOctokit("token");
      const octokit1 = getOctokit("token");

      expect(octokit1).toBe(octokit);
    });
  });
});
