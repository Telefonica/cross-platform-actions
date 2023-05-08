export interface DeployInputs {
  /** Project name. The repo containing the workflow to dispatch will be calculated based on this */
  project: string;
  /** Github token allowing with permissions to trigger the deploy workflow */
  token: string;
  /** Execution platform environment to deploy */
  environment: string;
  /** Custom repository name. Defaults to "[project]-platform" */
  repoName?: string;
  /** Custom workflow id. Defaults to "deploy.yml" */
  workflowId?: string;
  /** Custom repository ref. Defaults to main */
  ref?: string;
}
