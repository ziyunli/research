# Issue Kickoff Prompt

Use this prompt to start agent work tied to a GitHub issue.

```
Work on issue #<number>.

Context:
- Goal: <one sentence>
- Constraints: <perf, cost, timeline, stack>
- Non-goals: <what not to do>

Deliverables:
1. A findings markdown file in `research-notes/`.
2. A concise recommendation with trade-offs.
3. A commit containing all artifacts.
4. Optional follow-up issues if blockers are found.

Execution rules:
- Cite all key sources with links.
- Separate facts from inferences.
- Prefer small, verifiable experiments.
- Keep assumptions explicit.
```
