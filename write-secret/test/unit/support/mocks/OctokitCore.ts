jest.mock("@octokit/core");

export class MockOctokit {
  static plugin() {
    return MockOctokit;
  }
}

jest.mock("@octokit/core", () => {
  return {
    __esModule: true,
    Octokit: MockOctokit,
  };
});
