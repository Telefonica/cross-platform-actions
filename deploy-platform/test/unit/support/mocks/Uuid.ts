jest.mock("uuid");

import * as uuidLibrary from "uuid";

export const uuid = {
  v4: jest.fn().mockReturnValue("foo-uuid"),
};

// @ts-ignore-next-line
jest.spyOn(uuidLibrary, "v4").mockImplementation(() => {
  return uuid.v4();
});
