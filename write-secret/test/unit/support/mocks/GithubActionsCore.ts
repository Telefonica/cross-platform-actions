jest.mock("github-actions-core");

import * as githubActionsCore from "github-actions-core";

jest.spyOn(githubActionsCore, "createSecrets");
