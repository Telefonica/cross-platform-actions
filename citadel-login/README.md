# Table of Contents
<!-- TOC -->

- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [Versions](#versions)
  - [Example](#example)
  - [Inputs](#inputs)
  - [Debug mode](#debug-mode)
- [Development](#development)
  - [Requirements](#requirements)
  - [Branching model](#branching-model)
  - [Release](#release)

<!-- /TOC -->

# Usage

Logins to Services managed by Citadel.

## Versions

To know more about how this action is versioned, read the monorepo [README](../README.md#versions).

## Example

Example of usage in a component repository:

```yaml
jobs:
  login:
    runs-on: ubuntu-latest
    steps:
      - name: Login to Registries
        uses: Telefonica/cross-platform-actions/citadel-login@{BRANCH_NAME|VERSION}
        with:
          citadel-registries: ${{ secrets.CITADEL_REGISTRIES }}
```

## Inputs

- `citadel-registries`: The registries credentials created in Citadel. It is a JSON object with the following shape:
```json
{
  "version": "1.0.0",
  "oci": {
    "dev": {
      "registry": "dev-registry.azurecr.io",
      "username": "my-username",
      "password": "my-password"
    },
    "pro": {
      "registry": "pro-registry.azurecr.io",
      "username": "my-username",
      "password": "my-password"
    }
  }
}
```

## Debug mode

To enable the debug mode add a repository variable named `ACTIONS_STEP_DEBUG` and set its value to `true`. Debug mode is more verbose and it shows the response of the requests done to the github API.

# Development

## Requirements

No dependencies. Coded as a composite action with inline JavaScript.

## Branching model

This repository uses the trunk-based development branching model. The `main` branch is the main branch (surprise! 😜), and it must be always deployable. All the changes are done in feature branches, and they are merged into `main` using pull requests.

> Note: Even when the main branch should be always deployable, before [declaring a formal release](#release) it may be necessary to perform some manual steps, like updating the changelog or the version number. So, it is recommended to use a release branch to prepare the release.

## Release

Read the monorepo [README](../README.md#release) to know how to release the monorepo, which automatically releases a new version of this action too.
