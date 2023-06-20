import type { Octokit as BaseOctokit } from "@octokit/core";
import type { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
export type OctokitInterface = BaseOctokit & Api;
