import { ContextConstructor } from "./Context.types";
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
export declare const Context: ContextConstructor;
