import { LoggerInterface } from "../logger";
import { SecretServiceInterface } from "../secrets";
/**
 * A Context is a collection of services that can be used by entities.
 */
export interface ContextConstructorOptions {
    secretService: SecretServiceInterface;
    logger?: LoggerInterface;
}
export interface ContextConstructor {
    /**
     * Creates a Context.
     *
     * @param {ContextConstructorOptions} options - Options to construct a Context
     * @param {SecretServiceInterface} options.secretService - The SecretService to use
     * @param {LoggerInterface} options.logger - The Logger to use
     * @returns {ContextInterface} A Context
     */
    new (options: ContextConstructorOptions): ContextInterface;
}
/**
 * Represents a Context.
 * @interface
 */
export interface ContextInterface {
    /**
     * The SecretService to be used in Secrets domain.
     */
    readonly secretService: SecretServiceInterface;
    /**
     * Optional Logger to be used in the Context.
     */
    readonly logger?: LoggerInterface;
}
