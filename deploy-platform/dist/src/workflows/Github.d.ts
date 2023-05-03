import type { GithubConstructor, GetRunJobResponse } from "./Github.types";
export declare function throwIfJobFailed(job: GetRunJobResponse): void | never;
export declare const Github: GithubConstructor;
