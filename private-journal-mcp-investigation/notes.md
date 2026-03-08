# Notes

## Session log
- Created feature branch `feature/private-journal-mcp-investigation`.
- Created investigation folder `private-journal-mcp-investigation`.
- Cloned `https://github.com/obra/private-journal-mcp` into `/tmp/private-journal-mcp`.
- Ran `uvx showboat --help` and reviewed supported commands (init, note, exec, image, pop, verify, extract).
- Ran `uvx rodney --help` and reviewed browser automation commands and screenshot support.
- Initialized report document with `uvx showboat init private-journal-mcp-investigation/README.md "Private Journal MCP Feature Experiments"`.
- Built `/tmp/private-journal-mcp` with `npm install` and `npm run build` so the MCP server can be launched locally for repeatable tests.
- Built a tiny Python MCP stdio client (`mcp_feature_experiments.py`) to initialize the server and call all README-listed tools.
- Confirmed `process_thoughts` writes both project and user entries when both project and user section content is supplied.
- Observed `search_journal` fails in this environment with `fetch failed` (likely model download/runtime issue), so semantic/vector feature could not complete.
- Observed `list_recent_entries` returned no entries even after successful writes.
- Verified `read_journal_entry` works via direct path fallback from created markdown entry.
- Attempted `rodney` screenshot flow inside showboat; browser launch failed due missing system library `libatk-1.0.so.0`.
- Captured fallback screenshots with Playwright browser tool and embedded artifact links in report.
