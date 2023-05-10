/** Configuration for the deploy action */
export interface Config {
    /** Milliseconds to wait before considering that a job is not going to complete */
    timeoutJobCompleted: number;
    /** Milliseconds to wait before considering that a job artifact can't be downloaded */
    timeoutArtifactAvailable: number;
    /** Prefix name of the repository in which to launch the deploy workflow. Repository will be `${prefix}-platform` */
    repoName: string;
    /** Name of the branch in which to launch the deploy workflow */
    repoRef: string;
    /** Deploy workflow id */
    workflowId: string | number;
    /** Github owner of the repository in which to launch the deploy workflow */
    githubOwner: string;
    /** Github token allowing to dispatch the deploy workflow */
    githubToken: string;
    /** Environment in which to perform the deploy */
    environment: string;
    /** Milliseconds to wait between requests to Github API while retrying to get jobs and artifacts information */
    requestInterval: number;
}
