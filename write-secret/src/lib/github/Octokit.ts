import { Octokit as BaseOctokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

import { OctokitInterface } from "./Octokit.types";

const Octokit = BaseOctokit.plugin(restEndpointMethods);

let octokit: OctokitInterface;

function getOrCreateOctokit(token: string): OctokitInterface {
  if (!octokit) {
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

export function getOctokit(token: string): OctokitInterface {
  return getOrCreateOctokit(token);
}
