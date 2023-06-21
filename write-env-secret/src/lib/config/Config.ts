import { Config, ConfigInputs } from "./Config.types";

export function getConfig(inputs: ConfigInputs): Config {
  const config = {
    repositories: inputs.repositories.map((environment) => {
      const [owner, name] = environment.split("/");
      return {
        owner,
        name,
      };
    }),
  };

  return config;
}
