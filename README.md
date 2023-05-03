# Cross-platform-actions monorepo

This repository contains the Github actions related to the execution platforms of the Cross-cutting-enablers IDP project.

## Actions

* __[deploy-platform](./deploy-platform/README.md)__ - This action receives a project name, launches a deploy platform workflow in the corresponding project's platform repository, then it waits for the deploy action to finish and expect it to have uploaded a deploy manifest. Once the deploy workflow has completed successfully, this action returns the deploy manifest as an output.
  * Technologies: [TypeScript](https://www.typescriptlang.org/).
