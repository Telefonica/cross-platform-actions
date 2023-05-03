import * as core from "@actions/core";
export declare function getLogger(): {
    info: typeof core.info;
    warning: typeof core.warning;
    error: typeof core.error;
    notice: typeof core.notice;
    debug: typeof core.debug;
};
