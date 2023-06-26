import { LoggerInterface } from "../logger";
import { SecretServiceInterface } from "../secrets";

import { ContextConstructor, ContextConstructorOptions, ContextInterface } from "./Context.types";

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
