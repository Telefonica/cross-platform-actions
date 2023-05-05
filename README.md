# Cross-platform-actions monorepo

This repository contains the Github actions related to the execution platforms of the Cross-cutting-enablers IDP project.

# Table of contents

* [Actions](#actions)
* [Versions](#versions)
* [Development](#development)
  * [Common requirements](#common-requirements)
  * [Installation](#installation)
  * [Lint](#lint)
  * [Check spelling](#check-spelling)
* [Release](#release)
  * [Versioning](#versioning)
  * [Release process](#release-process)

# Actions

* __[deploy-platform](./deploy-platform/README.md)__ - This action receives a project name, launches a deploy platform workflow in the corresponding project's platform repository, then it waits for the deploy action to finish and expect it to have uploaded a deploy manifest. Once the deploy workflow has completed successfully, this action returns the deploy manifest as an output.
  * Technologies: [TypeScript](https://www.typescriptlang.org/).

# Versions

This repository adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). During the release process, tags for the whole version, plus latest, major and minor versions are created, so, you can use next syntax to define the version to use. For example:

* `Telefonica/cross-platform-actions/deploy-platform@v1` - You will use the version `v1.x.x`, keeping up to date with minor and patch releases automatically (recommended).
* `Telefonica/cross-platform-actions/deploy-platform@v1.1` - You will use the version `v1.1.x`, keeping up to date with just patch releases automatically.
* `Telefonica/cross-platform-actions/deploy-platform@v1.1.2` - You will use the version `v1.1.2`, and you will not receive updates automatically.
* `Telefonica/cross-platform-actions/deploy-platform@latest` - You will use the latest version, and you will always receive updates automatically, even if they are major releases containing possible breaking changes (not recommended).

# Development

## Common requirements

* [Node.js 18.x](https://nodejs.org/en/download/)
* [Pnpm 8.x](https://pnpm.io/installation)

### Installation

#### __TypeScript actions__

Github actions implemented with TypeScript use Pnpm as dependencies manager. So, to start working on them, you have to install the dependencies by running `pnpm install` in the root folder. This will install the dependencies of all TypeScript actions in the workspace:

```sh
pnpm i
```

Once the installation is completed, you should move to each action's folder and refer to its own documentation to start working on it.

## Lint

This repository uses [ESLint](https://eslint.org/) to lint the code. To run it, execute:

```sh
pnpm run lint
```

It is recommended to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

Eslint errors can be automatically fixed with `pnpm run lint:fix`.

## Check spelling

This project uses [cspell](https://github.com/streetsidesoftware/cspell) to check spelling in the code and documentation. To run it, execute:

```sh
pnpm run check:spelling
```

You can install the [CSpell extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) for Visual Studio Code to get spell checking in your editor.

# Release

## Versioning

First of all, note that __all actions in this repository are versioned together.__

All changes in any action in the monorepo must be documented in the [CHANGELOG](./CHANGELOG.md) file. The versioning of the project follows the [Semantic Versioning](https://semver.org/) specification. Here are some basic rules to follow when working on feature branches:

* The `package.json` files do not contain a version number. The version number is only defined during the release process.
* Add changes to the `Unreleased` section of the changelog, under a subsection with the modified action.
* Use `BREAKING` in the modifications entries to indicate that the change is a breaking change. For example: `* feat(BREAKING): Migrate to deploy-platform folder`. This allows to determine the new version to be set when declaring a new release.

When declaring a new release, follow the next rules to decide the new version number:

* Any __BREAKING__ change in any action requires a new major version.
* Any minor change in any action requires a new minor version.
* Obviously, any fix in any action requires a new patch version.

## Release process

To declare a new release, follow these steps:

* Create a release branch from `main` named `release/vX.Y.Z`, where `X.Y.Z` is the version number of the release.
* Update the changelog:
  * Move all the changes from the `Unreleased` section to a new section with the version number and the current date.
  * Add a new `Unreleased` section at the top of the file.
* Commit the changes and push them to the repository.
* Merge the release branch into `main`.
* __Create a Github release from the main branch__. The release title must be the version number preceded by the `v` letter (`vX.Y.Z`).
  * The __release description__ must be the corresponding entry in the `CHANGELOG.md file`. It must clearly identify the changes in each different action.
* Move the major version tag to the new commit. For example, if the new version is `1.2.3`, move the `v1` tag to the new commit.
* Move the minor version tag to the new commit. For example, if the new version is `1.2.3`, move the `v1.2` tag to the new commit.
* Move the `latest` tag to the new commit.
