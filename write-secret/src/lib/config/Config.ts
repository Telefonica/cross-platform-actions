import { Config, ConfigInputs } from "./Config.types";

export function getConfig(inputs: ConfigInputs): Config {
  const config = {
    repositories: inputs.repositories.map((environment) => {
      const [owner, repo] = environment.split("/");
      return {
        owner,
        repo,
      };
    }),
  };

  return config;
}
