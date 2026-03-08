# Async Code Research Guide

This guide shows how to run this repository as an async research loop.

## 1. One-time setup

### Prerequisites

- `git`
- `gh` (GitHub CLI)
- authenticated `gh` session (`gh auth status` should succeed)

If auth is broken:

```bash
gh auth login -h github.com
```

## 2. Create a repo with `gh` (replicable process)

From a local project folder:

```bash
git init
git branch -M main
git add README.md
git commit -m "Initial commit"
gh repo create <name> --public --source=. --remote=origin --push
```

For a private version later, use the same flow with `--private`:

```bash
gh repo create <name-private> --private --source=. --remote=origin --push
```

If you want both public and private variants from the same baseline, create the public repo first, then clone it and create a private sibling repo from the clone.

## 3. Daily async workflow

1. Create a GitHub issue per research question.
2. Ask the agent to work issue-by-issue.
3. Require markdown artifacts in `research-notes/`.
4. Review commit diff and sources.
5. Merge or request follow-up research.

## 4. Prompting pattern that works

Use `prompts/issue-kickoff.md` as a base. Always specify:

- exact question
- constraints (time, budget, stack)
- output format
- evidence requirements

## 5. Quality checklist

Before accepting research:

- Are claims linked to primary sources?
- Are recommendations explicit with trade-offs?
- Are unknowns called out clearly?
- Is there a concrete next action?

## 6. Suggested branching model

- `main`: reviewed research artifacts
- `wip/<topic>`: active research work

## 7. Optional automation

You can add lightweight automation later:

- CI to validate markdown links
- Issue templates for research requests
- PR template enforcing the quality checklist
