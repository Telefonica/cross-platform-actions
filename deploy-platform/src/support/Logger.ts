import * as core from "@actions/core";

export function getLogger() {
  return {
    info: core.info.bind(core),
    warning: core.warning.bind(core),
    error: core.error.bind(core),
    notice: core.notice.bind(core),
    debug: core.debug.bind(core),
  };
}
