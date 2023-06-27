"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
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
const Context = class Context {
    _secretService;
    _logger;
    constructor({ secretService, logger }) {
        this._secretService = secretService;
        this._logger = logger;
    }
    get secretService() {
        return this._secretService;
    }
    get logger() {
        return this._logger;
    }
};
exports.Context = Context;
