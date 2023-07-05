# Table of Contents
<!-- TOC -->

- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [Versions](#versions)
  - [Example](#example)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Debug mode](#debug-mode)
- [Development](#development)
  - [Requirements](#requirements)
  - [Branching model](#branching-model)
  - [Component tests](#component-tests)
  - [Release](#release)

<!-- /TOC -->

# Usage

GitHub actions have an issue about [referencing all outputs of a matrix](https://github.com/orgs/community/discussions/17245). If there is a job that runs multiple times with `strategy.matrix` only the latest iteration's output available for reference in other jobs.

To save outputs of all iterations we need to write them to an GitHub Artifact and read them in another job.
It also allows us to save manifests from unrelated jobs when [reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

We implement a workaround with two GitHub Actions:

- [manifest-write](../): This action writes the manifest file to the repository.
- [manifest-read](./): This action reads the manifest file from the repository.

Each time the `manifest-write` action is executed, it will save the provided manifest in GitHub Artifacts with an specific name. The `manifest-read` action will read that GitHub Artifact and unroll all the manifest it contains.

## Versions

To know more about how this action is versioned, read the monorepo [README](../README.md#versions).

## Example

Example of usage in a component repository:

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        component: ["frontend", "backend"]
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # Do some work with the matrix.component, like publish to a docker registry

      # Write for matrix outputs
      - name: Save publish manifest
        uses: Telefonica/cross-platform-actions/manifest-write@{BRANCH_NAME|VERSION}
        with:
          # Identify the matrix step
          id: ${{ matrix.module }}
          # Group the manifest for later retrieval. Optional, default is 'manifests'
          group: publish-manifests
          json: |
            {
              "name": "${{ matrix.component }}",
              "repository": "docker.io/my-org/${{ matrix.component }}",
              "version": 1.0.0",
              "type": "docker"
            }

  # Read all manifests
  manifest:
    runs-on: ubuntu-latest
    needs: [publish]
    steps:
      # Read all manifests previously saved
      - name: Read published manifest
        id: manifest
        uses: Telefonica/cross-platform-actions/manifest-read@{BRANCH_NAME|VERSION}
        with:
          group: publish-manifests

      - name: Print manifest
        run: |
          echo "${{ steps.manifest.outputs.manifests }}"

```

## Inputs

- `id`: The manifest identifier. It is used to identify the manifest in the group. It is recommended to use the matrix variable that identifies the step.
- `group`: The group where the manifest will be saved. Optional, defaults to `manifests`.
- `json`: The manifest in JSON format serialized as a string. It must be a valid JSON.

## Outputs

- `manifests` - Manifests indexed by id. It is a JSON object where the key is the id and the value is the provided JSON manifest. It is useful to read all the manifests in a job. For example:
```json
{
  "id1": { "name": "my-manifest-1" },
  "id2": { "name": "my-manifest-2" }
}
```

- `matrix`: manifests ready to be used in a matrix as an input.
```json
{
  "include" : [
    { "name": "my-manifest-1" },
    { "name": "my-manifest-2" },
  ]
}
```
```yml
strategy:
  matrix: ${{ steps.manifest.outputs.matrix }}
```

## Debug mode

To enable the debug mode add a repository variable named `ACTIONS_STEP_DEBUG` and set its value to `true`. Debug mode is more verbose and it shows the response of the requests done to the github API.

# Development

## Requirements

No dependencies. Coded as a composite action with inline JavaScript.

## Branching model

This repository uses the trunk-based development branching model. The `main` branch is the main branch (surprise! 😜), and it must be always deployable. All the changes are done in feature branches, and they are merged into `main` using pull requests.

> Note: Even when the main branch should be always deployable, before [declaring a formal release](#release) it may be necessary to perform some manual steps, like updating the changelog or the version number. So, it is recommended to use a release branch to prepare the release.

## Component tests

Component tests are executed in a real environment, using the GitHub Actions Runner.

## Release

Read the monorepo [README](../README.md#release) to know how to release the monorepo, which automatically releases a new version of this action too.
