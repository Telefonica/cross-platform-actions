# Table of Contents

* [Usage](#usage)
  * [Assumptions](#assumptions)
  * [Inputs](#inputs)
  * [Outputs](#outputs)
  * [Example](#example)
* [Development](#development)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Lint](#lint)
  * [Check types](#check-types)
  * [Unit tests](#unit-tests)
  * [Build](#build)
  * [Component tests](#component-tests)


# Usage

This action receives a project name, launches a deploy workflow in the corresponding platform repository, then it waits for the result, and returns the deploy artifact generated by the workflow.

## Assumptions

- The target project has a repository named `${project}-platform`, with a deploy workflow named `deploy.yml`. The deploy workflow must have two inputs: `environment` and `id`.
- The deploy workflow creates a job with a step named `Set ID (${{github.event.inputs.id}})`. This step will be used to verify that the workflow is the one that was launched by this action. The `id` input is a random uuid generated by this action on each execution.
- The deploy workflow generates an artifact containing the manifest as a JSON string.

## Inputs

- `project` - Project name. This action will launch the deploy workflow in a repository with the name `${project}-platform`.
- `environment` - Environment where to deploy. It will be passed as an input to the deploy workflow.
- `token` - Github token to get access to the repository workflows
- `ref` - _Optional_. Branch or tag in which to run the deploy workflow. If not specified, the `main` branch will be used.
- `repo-suffix` - _Optional_. Suffix to append to the project name to get the platform repository name. If not specified, `-platform` will be used.
- `workflow-id` - _Optional_. ID of the workflow to launch. If not specified, the first workflow with the name `deploy.yml` will be used.

## Outputs

- `manifest` - Manifest generated by the deploy workflow, as a JSON string.

## Example

Example of use:

```yaml
steps:
  - id: deploy
    uses: Telefonica/cross-platform-action@{BRANCH_NAME|VERSION}
    with:
      project: $PROJECT_NAME
      environment: $ENVIRONMENT_NAME
      token: $TOKEN
  - name: Get manifest
    run: echo ${{ steps.deploy.outputs.manifest }}
```

# Development

## Requirements

* [Node.js](https://nodejs.org/en/) >= 18.x
* [NPM](https://www.npmjs.com/) >= 8.x

## Installation

Use NPM to install the dependencies:

```bash
npm i
```

## Lint

This project uses [ESLint](https://eslint.org/) to lint the code. To run it, execute:

```sh
npm run lint
```

It is recommended to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

Eslint errors can be automatically fixed with `npm run lint:fix`.

## Check types

This project uses [TypeScript](https://www.typescriptlang.org/). You can check types with:

```sh
npm run check:types
```

## Unit tests

Unit tests are written with [Jest](https://jestjs.io/). To run them, execute:

```sh
npm run test
```

The coverage report will be generated in the `coverage` folder.

## Build

To build the project, execute:

```sh
npm run build
```

⚠️ __IMPORTANT__: For the moment, the project has to be built locally on every change, and the `dist` folder has to be committed to the repository. This is something that we will improve in the future. But, for now, there is a step in the test workflow that checks that the `dist` folder is up to date. So, remember to build the project before pushing your changes, otherwise the tests will fail.

## Component tests

Component tests are executed in a real environment, using the GitHub Actions Runner. The action is executed in the workflow, and it dispatches the `deploy-test.yml` workflow in this same repository. The `deploy-test.yml` workflow is a simple workflow that just uploads a fake manifest. The component tests check that the manifest is correctly downloaded by the action and passed as an output.
