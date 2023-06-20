export interface SyncInputs {
    /** Manifest */
    manifest: string;
    /** Project */
    project: {
        /** Project name */
        project: string;
        /** Repositories */
        repositories: string[];
    };
    /** Secret name */
    secret: string;
    /** GitHub token */
    token: string;
}
