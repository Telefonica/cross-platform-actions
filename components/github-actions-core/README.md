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

This package contains shared domain commands to used in actions.

__So, you can use this library to move shared features between actions.__

<!-- 
## Assumptions

- TBD 
-->

## Versions

To know more about how this action is versioned, read the monorepo [README](../README.md#versions).

<!-- 
## Example

Example of usage in a action:
-->


### Create Secrets command


```typescript
import { createSecrets } from 'github-actions-core';

const repoSecrets = await createSecrets({
  secret: 'secret-name',
  value: 'some-secret-value',
  repositories: ['owner/repo'],
  token: '<github-token>',
});

// repoSecrets
// [
//   {
//     secret: 'secret-name',
//     repository: 'owner/repo',
//   }
// ]

const envSecrets = await createSecrets({
  secret: 'secret-name',
  value: 'some-secret-value',
  repositories: ['owner/repo'],
  environment: 'production',
  token: '<github-token>',
})

// envSecrets
// [
//   {
//     secret: 'secret-name',
//     repository: 'owner/repo',
//     environment: 'production',
//   }
// ]
```

## Inputs

- `secret` - Name of the GitHub Secret to sync the secret to.
- `value` - Value of the GitHub Secret to sync the secret to.
- `repositories` - List of repositories.
- `environment` - (_Optional_) Environment name.
- `token` - GitHub token to get access to the GitHub API.

## Outputs

- List of created secrets with repository (and environment) information.

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

## Release

Read the monorepo [README](../README.md#release) to know how to release the monorepo, which automatically releases a new version of this action too.
