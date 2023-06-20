import { Config, ConfigInputs } from "./Config.types";

export const DEFAULT_VARS = {
  GITHUB_OWNER: "Telefonica",
};

export function getConfig(inputs: ConfigInputs): Config {
  const config = {
    repositories: inputs.project.repositories.map((repository) => {
      return {
        name: repository,
        owner: DEFAULT_VARS.GITHUB_OWNER,
      };
    }),
  };

  return config;
}
