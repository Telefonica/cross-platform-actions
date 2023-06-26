export interface WriteSecretInputs {
    /** Secret name */
    secret: string;
    /** Value */
    value: string;
    /** Repositories */
    repositories: string[];
    /** Environment */
    environment?: string;
    /** GitHub token */
    token: string;
}
