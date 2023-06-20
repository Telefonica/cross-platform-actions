import { Octokit as BaseOctokit } from "@octokit/core";
export declare const Octokit: typeof BaseOctokit & import("@octokit/core/dist-types/types").Constructor<import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api>;
