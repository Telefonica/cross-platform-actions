# Changelog
<!--

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

__Add a new subsection on each version for each modified action.__

### [action-name]

Use next sections inside each different action entry to describe changes on each release:

#### Added
#### Changed
#### Fixed
#### Deprecated
#### Removed
-->
## [Unreleased]

## [2.3.0] - 2023-07-07

### setup-oras (new)

#### Added
- feat(CROSS-1665): setup-oras action (#65)

### citadel-login (new)

#### Added
- feat(CROSS-1668): citadel-login action (#67)

### manifest-read (new)

#### Added
- feat(CROSS-1666): read-manifest and write-manifest actions (#66)

### manifest-write (new)

#### Added
- feat(CROSS-1666): read-manifest and write-manifest actions (#66)

### write-secret (new)

#### Added

- feat(CROSS-1455): add write secret action (#60)

### monorepo

#### Added

- feat: add NX tool to manage monorepo

## [2.2.1] - 2023-06-07

### deploy-platform

#### Fixed

- fix: Increase ARTIFACT_AVAILABLE timeout to 60 seconds in order to make it compatible with the current request interval default value (CROSS-1093)

#### Changed

- chore: Update devDependencies

## [2.2.0] - 2023-06-06

### monorepo

#### Changed

- chore: Update dependencies

### deploy-platform

#### Added

- feat: Add `request-interval` input. This input allows to set the interval between requests to the Github API when waiting for the workflow to finish. (CROSS-1093)

## [2.1.0] - 2023-05-12

### deploy-platform

#### Added

- feat: Add logic to make environment and workflowId inputs case insensitive (CROSS-875)
- feat: Admit a number as workflowId input (CROSS-875)

## [2.0.0] - 2023-05-08

### deploy-platform

#### Added

- feat: Log inputs and configuration in debug mode, hiding secrets (CROSS-852)
- feat: Add `repo-name` input. When defined, this will be the repository in which the deploy workflow will be launched (CROSS-852)

#### Changed

- feat(BREAKING): Use the `environment` input to determine the workflow to be executed. For example, if the environment is `dev`, the workflow `deploy-dev.yml` will be launched. (CROSS-848)

#### Removed

- feat(BREAKING): Remove `repo-suffix` input (CROSS-852).
- feat(BREAKING): Do not pass `environment` input when dispatching workflow (CROSS-848).

## [1.0.1] - 2023-05-05

### deploy-platform

#### Fixed
- docs: Fix README.md usage example

#### Changed
- chore: Use PNPM as mono-repo NodeJS dependencies manager. (CROSS-773)
- chore: Migrate linter and spell checker to the root package.json. This way, they -ill be executed for all actions in the mono-repo. (CROSS-773)
- chore: Add eslint rules forcing camelCase and formatting Jest tests. (CROSS-793)
- refactor: Decouple library core from Github Actions interfaces. (CROSS-727)

## [1.0.0] - 2023-05-03

### deploy-platform

#### Added
- feat: Add logs (CROSS-499)
- feat: Add `repo-suffix`, `workflow-id` and `ref` inputs (CROSS-499)
- feat: Improve error handling (CROSS-499)
- feat: Support any step name that __includes__ the id parameter to identify the workflow
- docs: Improve documentation (CROSS-499)
- test: Add unit tests (CROSS-499)
- test: Add component tests (CROSS-499)
- chore: Add linting and spell checking (CROSS-499)
- chore: Add CI/CD workflow (CROSS-499)
- chore: Check that the dist folder has been updated in the CI/CD workflow (CROSS-499)

#### Changed
- refactor: Migrate to TypeScript. Change code structure to a modular approach (CROSS-499)
- feat(BREAKING): Migrate to deploy-platform folder

## [0.1.0-beta.1] - 2023-04-25

### deploy-platform

#### Added
- feat: First pre-release (CROSS-499)
