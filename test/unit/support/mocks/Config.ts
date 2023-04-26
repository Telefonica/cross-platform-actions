jest.mock("../../../../src/config/Config");

import * as Config from "../../../../src/config/Config";

export const getConfig = jest.fn().mockReturnValue({});

jest.spyOn(Config, "getConfig").mockImplementation(() => {
  return getConfig();
});
