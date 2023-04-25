import { Octokit } from "@octokit/core";

// import { getJsonFromZip } from "./index";

jest.mock("@octokit/core");

Octokit.prototype.request = jest.fn().mockImplementation(() => {
  return {
    data: {
      workflow_runs: [
        {
          id: 1,
          status: "completed",
        },
      ],
      jobs: [
        {
          id: 1,
          run_id: 1,
          conclusion: "success",
          steps: [
            {
              name: "test",
            },
          ],
        },
      ],
      artifacts: [
        {
          id: 1,
        },
      ],
    },
  };
});
describe("create octokit", () => {
  test("should create octokit", async () => {
    const octokit = new Octokit();
    expect(octokit).toBeDefined();
  });
});
describe("get artifact", () => {
  test("should return the artifact", async () => {
    const octokit = new Octokit();
    expect(octokit).toBeDefined();
    const artifact = await octokit.request("test", "test", "test", "test").data.artifacts[0];
    expect(artifact).toEqual({
      id: 1,
    });
  });
});

// describe("getJsonFromZip function", () => {
//   test("should return the JSON string from a zip file", async () => {
//     // Mock the zip file data
//     const zipFileData = new Uint8Array([
//       80, 75, 3, 4, 20, 0, 8, 8, 8, 0, 204, 233, 64, 9, 0, 0, 0, 9, 0, 0, 0, 8, 0, 0, 0, 0, 0,
//     ]);
//     // Call the function with the mock data
//     const json = await getJsonFromZip(zipFileData);
//     // Assert that the function returns the expected JSON string
//     expect(json).toBe('{"name": "John", "age": 30, "city": "New York"}');
//   });

//   test("should throw an error if an error occurs while loading the zip file", async () => {
//     // Mock the zip file data (in this case, an invalid zip file)
//     const zipFileData = new Uint8Array([80, 75, 1, 2, 3, 4, 5]);
//     // Call the function with the mock data and expect it to throw an error
//     await expect(getJsonFromZip(zipFileData)).rejects.toThrow();
//   });
// });
