export interface DeployInputs {
  project: string;
  token: string;
  environment: string;
  repoSuffix?: string;
  workflowId?: string;
  ref?: string;
}
