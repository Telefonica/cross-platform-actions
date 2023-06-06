export interface DeployInputs {
  /** Project name. The repo containing the workflow to dispatch will be calculated based on this */
  project: string;
  /** Github token allowing with permissions to trigger the deploy workflow */
  token: string;
  /** Environment to deploy. It determines the workflow to be launched in the platform repository */
  environment: string;
  /** Custom repository name. Defaults to "[project]-platform" */
  repoName?: string;
  /** Custom workflow id. Defaults to "deploy.yml" */
  workflowId?: string | number;
  /** Custom repository ref. Defaults to main */
  ref?: string;
  /** Interval between requests to check if the workflow has finished. Defaults to 10000 ms */
  requestInterval?: number;
}
