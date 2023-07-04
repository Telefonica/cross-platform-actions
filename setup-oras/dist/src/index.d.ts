/**
 * @returns {string} The executable extension based on platform.
 */
export declare function getExecutableExtension(): string;
/**
 * Download oras-cli from GitHub Releases.
 * @param version  The version to download.
 * @returns
 */
export declare function download(version: string): Promise<string>;
