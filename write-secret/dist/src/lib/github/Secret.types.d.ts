import { Logger } from "../support/Logger.types";
/** Represents SecretConstructor extra options */
export interface SecretConstructorOptions {
    /** Logger instance */
    logger?: Logger;
}
export interface SecretConstructor {
    /**
     * Creates a new instance of SecretInterface
     *
     * @param name - Secret name
     * @param value - Secret value
     * @returns A new instance of SecretInterface
     */
    new (name: string, value: string, options?: SecretConstructorOptions): SecretInterface;
}
/**
 * Represents a secret
 * @interface
 */
export interface SecretInterface {
    /** Secret name */
    readonly name: string;
    /** Secret value */
    encryptedValue(publicKey: string): Promise<string>;
}
