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
      - name: Login to Citadel Platform
        uses: Telefonica/cross-platform-actions/citadel-login@{BRANCH_NAME|VERSION}
        with:
          citadel-registries: ${{ secrets.CITADEL_REGISTRIES }} # Optional
          citadel-environment: ${{ secrets.CITADEL_ENVIRONMENT }} # Optional
```

## Inputs

- `citadel-registries`: The registries credentials created in Citadel. It is a one-line JSON object with the following shape:
```json
{
  "version": "1",
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
- `citadel-environment`: The environment to login to created in Citadel. It is a one-line JSON object with the following shape:
```json
{
  "version": "1",
  "kubernetes":{
    "credentials": {
      "client_id": "0f24a860-37ab-4f90-9d32-baa6c48fa136",
      "client_secret": "my-password",
      "subscription_id": "8489660c-9w95-4a0b-a3b1-e2bf7e76612a",
      "tenant_id": "6b9baf40-22dc-42da-a328-99d79274c8c5"
    },
    "name": "c872fa7a6fbc",
    "resource_group": "1a90f401-f312-437b-ad30-aaf9bba9f0bd",
    "namespace": "scaffold-dev",
    "dns": "dev.scaffold.c872fa7a6fbc.d-consumer.com"
  },
  "dns": [
    "dev.scaffold.d-consumer.com",
    "dev.scaffold.com"
  ]
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
