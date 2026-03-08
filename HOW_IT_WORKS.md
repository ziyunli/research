# How This Simon-Style Async Research Repo Works

This repository now follows the same core pattern as Simon Willison's `research` repo.

## Core mechanism

1. Each research task gets its own top-level folder, for example `sqlite-query-plan-test/`.
2. The agent writes incremental work notes to `notes.md` in that folder.
3. The final report for that task lives in that folder's `README.md`.
4. A GitHub Action runs on pushes to `main` and executes `cog` over root `README.md`.
5. The cog block lists all top-level project folders and populates per-project summaries.
6. If a folder has no `_summary.md`, the workflow uses `llm` with GitHub Models to generate it.

## Files you should care about

- `AGENTS.md`: strict execution rules for the coding agent.
- `CLAUDE.md`: alias so Claude-style tooling picks up the same instructions.
- `.github/workflows/update-readme.yml`: automation that regenerates index and summaries.
- `requirements.txt`: dependencies needed by the workflow (`cogapp`, `llm`, `llm-github-models`).
- `README.md`: generated index + cog script that orchestrates summaries and per-report note insertion.

## Expected folder contents for each research project

- `notes.md`: chronological research log.
- `README.md`: final write-up.
- optional code/scripts used during investigation.
- optional binary artifacts under 2MB.
- optional patch/diff files against any external repo explored.

## Public and private repo variants

You can repeat the exact setup with a private repo:

```bash
gh repo create research-private --private --source=. --remote=origin --push
```

Or create a separate private mirror and keep the same workflow files.

## How tasks are initiated

This is the part most people misunderstand: this repo pattern does not require issue-triggered automation.

- Primary pattern: start work directly in Codex or Claude Code with a prompt, then have the agent open a PR or commit results.
- Optional pattern: create an issue first when you want extra planning context, tracking, or review discussion.

## Operating routine

1. Start with a clear research question (issue optional).
2. Prompt the async agent directly in Codex/Claude and ask it to create a new top-level folder for that investigation.
3. Require ongoing updates to `notes.md`.
4. Require a final `README.md` in that folder.
5. Merge to `main` and let the action refresh root `README.md` and summaries.
