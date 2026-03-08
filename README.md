# Research

A repository for async code research with coding agents.

This setup is optimized for long-running, parallelized research tasks where the agent explores codebases, documentation, and implementation options, then records results as auditable artifacts.

## Why this repo exists

Based on Simon Willison's async code research pattern:

- give the agent a dedicated repository
- let it execute broad research tasks with explicit output expectations
- require committed artifacts so progress is reviewable
- iterate asynchronously through issues/PRs

Reference:

- https://github.com/simonw/research
- https://simonwillison.net/2025/Nov/6/async-code-research/

## Quick start

1. Clone this repo.
2. Read `GUIDE.md`.
3. Pick a research question and open an issue.
4. Ask the agent to work on the issue and commit results.

## Repo layout

- `AGENTS.md`: operational rules for the agent
- `GUIDE.md`: practical workflow guide
- `research-notes/`: generated findings and write-ups
- `prompts/`: reusable prompts for recurring tasks
