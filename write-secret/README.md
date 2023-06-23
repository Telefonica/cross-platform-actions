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

This action receives a secret name, secret value, a list of repositories and an optional environment, and updates the secret at repository or environment scope (if present environment input) with given value.

__So, you can use this action in a project's repository to update secrets in a list of repositories or environments.__

1. A project's workflow launches this write secret action.
2. This action updates a secret with given value at:
  * Each repository's environment named as given input, if environment input is present.
  * Otherwise, the secret is added to each repository.
3. The secret is available in the repositories or environments.
4. The action returns a manifest with the information of written secrets.

## Assumptions

- The repositories input is a new-line or space separated list of repositories.
  - The repositories must be in the format `owner/repository`.
- The environment input is the name of the environment to write the secret to in each of the repositories.
- :warning: Both repositories and environments (if environment input is present) **MUST** exist before this action is called. If not, the action will fail.
- :warning: The given token **MUST** has access to repositories, environments and secrets scopes. For more information, read the [GitHub documentation](https://docs.github.com/en/rest/reference/actions#secrets).
- The output manifest contains the GitHub Secret names for each repository, in the same order as the input repositories. It contains following schema:
  ```jsonc
  {
    "github": {
      "secrets": [
        {
          "repository": "<repository including owner>",
          "secret": "<secret name>",
          "environment": "<environment name>" // if present
        },
        // ...
      ]
    }
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
  - id: write-secret
    name: Write environment secret
    uses: Telefonica/cross-platform-actions/write-secret@{BRANCH_NAME|VERSION}
    with:
      secret: IDP_DEPLOY_MANIFEST
      value: ${{ steps.deploy-platform.outputs.manifest }}
      repositories: |
        Telefonica/repository-1
        Telefonica/repository-2
      environment: $ENVIRONMENT_NAME
      token: $TOKEN
```

## Inputs

- `secret` - Name of the GitHub Secret to sync the secret to.
- `value` - Value of the GitHub Secret to sync the secret to.
- `repositories` - New-line or space separated repositories.
- `environment` - (_Optional_) Environment name.
- `token` - GitHub token to get access to the GitHub API.

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
pnpm nx check:types
```

## Unit tests

Unit tests are written with [Jest](https://jestjs.io/). To run them, execute:

```sh
pnpm nx test
```

The coverage report will be generated in the `coverage` folder.

## Build

⚠️ __IMPORTANT__: For the moment, the project has to be built locally on every change, and the `dist` folder has to be committed to the repository. This is something that we will improve in the future. But, for now, there is a step in the test workflow that checks that the `dist` folder is up to date. So, remember to build the project before pushing your changes, otherwise the tests will fail.

To build the project and add the dist folder, execute:

```sh
pnpm nx build

# Remember to add the built files!!
git add dist
```

## Component tests

Component tests are executed in a real environment, using the GitHub Actions Runner. The action is executed in the workflow, and it creates a secret in this repository called `TEST_SECRET`. Then, the test checks that the secret has been created. In addition, the test checks that the action returns the expected manifest.

## Release

Read the monorepo [README](../README.md#release) to know how to release the monorepo, which automatically releases a new version of this action too.
