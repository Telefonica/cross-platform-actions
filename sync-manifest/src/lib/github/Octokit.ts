import { Octokit as BaseOctokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

export const Octokit = BaseOctokit.plugin(restEndpointMethods);
