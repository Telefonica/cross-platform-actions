# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Add a new entry on each version for each modified action.

Use next sections inside each different action entry to describe changes on each release:

#### Added
#### Changed
#### Fixed
#### Deprecated
#### Removed

## [Unreleased]

### deploy-platform

#### Fixed
* docs: Fix README.md usage example

## [1.0.0] - 2023-05-03

### deploy-platform

#### Added
* feat: Add logs (CROSS-499)
* feat: Add `repo-suffix`, `workflow-id` and `ref` inputs (CROSS-499)
* feat: Improve error handling (CROSS-499)
* feat: Support any step name that __includes__ the id parameter to identify the workflow
* docs: Improve documentation (CROSS-499)
* test: Add unit tests (CROSS-499)
* test: Add component tests (CROSS-499)
* chore: Add linting and spell checking (CROSS-499)
* chore: Add CI/CD workflow (CROSS-499)
* chore: Check that the dist folder has been updated in the CI/CD workflow (CROSS-499)

#### Changed
* refactor: Migrate to TypeScript. Change code structure to a modular approach (CROSS-499)
* feat(BREAKING): Migrate to deploy-platform folder

## [0.1.0-beta.1] - 2023-04-25

### deploy-platform

#### Added
* feat: First pre-release (CROSS-499)
