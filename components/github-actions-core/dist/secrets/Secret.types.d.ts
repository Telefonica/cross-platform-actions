import { ContextInterface } from "../context";
export interface SecretConstructor {
    /**
     * Creates a new instance of SecretInterface
     *
     * @param name - Secret name
     * @param value - Secret value
     * @returns A new instance of SecretInterface
     */
    new (name: string, value: string): SecretInterface;
}
/**
 * Represents a secret
 * @interface
 */
export interface SecretInterface {
    /** Secret name */
    readonly name: string;
    /** Secret value */
    readonly value: string;
    /** Create secret */
    createSecret(context: ContextInterface): Promise<void>;
}
