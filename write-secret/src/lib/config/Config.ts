import { Config, ConfigInputs } from "./Config.types";

export function getConfig(inputs: ConfigInputs): Config {
  const config = {
    repositories: inputs.repositories.map((repository) => {
      const [owner, repo] = repository.split("/");
      return {
        owner,
        repo,
      };
    }),
  };

  return config;
}
