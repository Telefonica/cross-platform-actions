import { LoggerInterface } from "../logger";
import { SecretServiceInterface } from "../secrets";

import { ContextConstructor, ContextConstructorOptions, ContextInterface } from "./Context.types";

/**
 * A Context is a collection of services that can be used by entities.
 *
 * @param {ContextConstructorOptions} options - Options to construct a Context
 * @param {SecretServiceInterface} options.secretService - The SecretService to use
 * @param {LoggerInterface} [options.logger] - The Logger to use
 * @returns {ContextInterface} A Context
 * @example
 * import { Context } from "github-actions-core";
 *
 * const context = new Context({
 *  secretService: new SecretService(),
 *  logger: new Logger(),
 * });
 */
export const Context: ContextConstructor = class Context implements ContextInterface {
  private _secretService: SecretServiceInterface;
  private _logger?: LoggerInterface;

  constructor({ secretService, logger }: ContextConstructorOptions) {
    this._secretService = secretService;
    this._logger = logger;
  }

  public get secretService(): SecretServiceInterface {
    return this._secretService;
  }

  public get logger(): LoggerInterface | undefined {
    return this._logger;
  }
};
