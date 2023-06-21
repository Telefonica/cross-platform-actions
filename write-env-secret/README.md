# Table of Contents

- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [Assumptions](#assumptions)
  - [Versions](#versions)
  - [Example](#example)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Debug mode](#debug-mode)
- [Development](#development)
  - [Requirements](#requirements)
  - [Branching model](#branching-model)
  - [Installation](#installation)
  - [Lint](#lint)
  - [Check spelling](#check-spelling)
  - [Check types](#check-types)
  - [Unit tests](#unit-tests)
  - [Build](#build)
  - [Component tests](#component-tests)
  - [Release](#release)

# Usage

This action receives a deploy manifest, IDP project information and target Github Secret name, and sync manifest content as a Github Secret for each of the repositories of given project information. Finally, it returns a manifest with the Github Secret names for each repository.

__So, you can use this action in the project's platform instances to update deploy manifest in project's repositories.__

1. TBD

## Assumptions

- The deploy manifest is a JSON string.
- The project information is a JSON string with following schema:
  - `project`: Project name.
  - `repositories`: Array of repository names.
- Target repositories are in the same organization as the project repository.
- The output manifest contains the Github Secret names for each repository, in the same order as the input repositories. It contains following schema
  ```jsonc
  {
    "secrets": [
      {
        "repository": "<repository name>",
        "secret": "<secret name>"
      },
      // ...
    ]
  }
  ```

## Versions

To know more about how this action is versioned, read the monorepo [README](../README.md#versions).

## Example

Example of usage in a component repository:

```yaml
steps:
  - id: deploy-platform
    name: Deploy execution platform
    uses: Telefonica/cross-platform-actions/deploy-platform@{BRANCH_NAME|VERSION}
    with:
      project: $PROJECT_NAME
      environment: $ENVIRONMENT_NAME
      token: $TOKEN
  - id: write-env-secret
    name: Write environment secret
    uses: Telefonica/cross-platform-actions/write-env-secret@{BRANCH_NAME|VERSION}
    with:
      secret: IDP_DEPLOY_MANIFEST
      value: ${{ steps.deploy-platform.outputs.manifest }}
      repositories: |
        [
          "Telefonica/repository-1",
          "Telefonica/repository-2"
        ]
      env: int
      token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

- `secret` - Name of the Github Secret to sync the secret to.
- `value` - Value of the Github Secret to sync the secret to.
- `repositories` - List of repositories as a JSON string.
- `token` - Github token to get access to the repository workflows
- `environment` - Environment name to be used in the deploy secret.

## Outputs

- `manifest` - Manifest with information of the updated secrets by repository, as a JSON string.

## Debug mode

To enable the debug mode add a repository variable named `ACTIONS_STEP_DEBUG` and set its value to `true`. Debug mode is more verbose and it shows the response of the requests done to the github API.

# Development

## Requirements

Read the monorepo [README](../README.md#requirements) to know the requirements of this project.

## Branching model

This repository uses the trunk-based development branching model. The `main` branch is the main branch (surprise! 😜), and it must be always deployable. All the changes are done in feature branches, and they are merged into `main` using pull requests.

> Note: Even when the main branch should be always deployable, before [declaring a formal release](#release) it may be necessary to perform some manual steps, like updating the changelog or the version number. So, it is recommended to use a release branch to prepare the release.

## Installation

Read the monorepo [README](../README.md#development) to know how to install the monorepo dependencies, which automatically installs the dependencies of this package too.

## Lint

Read the monorepo [README](../README.md#development) to know how to run the linter in the whole monorepo.

## Check spelling

Read the monorepo [README](../README.md#development) to know how to check spelling in the whole monorepo.

## Check types

This project uses [TypeScript](https://www.typescriptlang.org/). You can check types with:

```sh
pnpm run check:types
```

## Unit tests

Unit tests are written with [Jest](https://jestjs.io/). To run them, execute:

```sh
pnpm run test
```

The coverage report will be generated in the `coverage` folder.

## Build

⚠️ __IMPORTANT__: For the moment, the project has to be built locally on every change, and the `dist` folder has to be committed to the repository. This is something that we will improve in the future. But, for now, there is a step in the test workflow that checks that the `dist` folder is up to date. So, remember to build the project before pushing your changes, otherwise the tests will fail.

To build the project and add the dist folder, execute:

```sh
pnpm run build

# Remember to add the built files!!
git add dist
```

## Component tests

Component tests are executed in a real environment, using the GitHub Actions Runner. The action is executed in the workflow, and it dispatches the `deploy-test.yml` workflow in this same repository. The `deploy-test.yml` workflow is a simple workflow that just uploads a fake manifest. The component tests check that the manifest is correctly downloaded by the action and passed as an output.

## Release

Read the monorepo [README](../README.md#release) to know how to release the monorepo, which automatically releases a new version of this action too.
