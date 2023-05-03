import * as core from "@actions/core";

export interface Logger {
  info: typeof core.info;
  warning: typeof core.warning;
  error: typeof core.error;
  notice: typeof core.notice;
  debug: typeof core.debug;
}
