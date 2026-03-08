# Private Journal MCP Feature Experiments

*2026-03-08T08:33:02Z by Showboat 0.6.1*
<!-- showboat-id: a020c60e-3af3-4df3-b138-726bdcf01bec -->

This report exercises the features documented in the private-journal-mcp README. I used showboat for executable documentation and rodney for browser screenshots.

```bash
test -d /tmp/private-journal-mcp && cd /tmp/private-journal-mcp && npm install --silent && npm run build --silent && echo 'repo-ready'
```

```output
repo-ready
```

```bash
python3 private-journal-mcp-investigation/mcp_feature_experiments.py
```

```output
initialize: {
  "protocolVersion": "2024-11-05",
  "capabilities": {
    "tools": {}
  },
  "serverInfo": {
    "name": "private-journal-mcp",
    "version": "1.0.0"
  }
}
tools: list_recent_entries, process_thoughts, read_journal_entry, search_journal
process_thoughts OK:
Thoughts recorded successfully.

project_tree:
  /tmp/pjmcp-exp/project-journal/2026-03-08
  /tmp/pjmcp-exp/project-journal/2026-03-08/08-38-48-758811.md
  /tmp/pjmcp-exp/project-journal/2026-03-08/08-38-57-150060.md
  /tmp/pjmcp-exp/project-journal/2026-03-08/08-39-25-534110.md
  /tmp/pjmcp-exp/project-journal/2026-03-08/08-39-42-736846.md
  /tmp/pjmcp-exp/project-journal/2026-03-08/08-39-58-927023.md
user_tree:
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08/08-38-48-758920.md
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08/08-38-57-150314.md
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08/08-39-25-534384.md
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08/08-39-42-736700.md
  /tmp/pjmcp-exp/user-home/.private-journal/2026-03-08/08-39-58-927501.md
list_recent_entries OK:
No entries found in the last 7 days.

search_journal ERROR: Failed to search journal: fetch failed

search_journal ERROR: Failed to search journal: fetch failed

read_journal_entry fallback path: /tmp/pjmcp-exp/project-journal/2026-03-08/08-38-48-758811.md
read_journal_entry OK:
---
title: "8:38:48 AM - March 8, 2026"
date: 2026-03-08T08:38:48.758Z
timestamp: 1772959128758
---

## Project Notes

Project note: The server stores project entries in the custom --journal-path location.


```

```bash
curl -L --silent https://raw.githubusercontent.com/obra/private-journal-mcp/main/README.md | sed -n '/## Features/,/## Installation/p'
```

```output
## Features

### Journaling
- **Multi-section journaling**: Separate categories for feelings, project notes, user context, technical insights, and world knowledge
- **Dual storage**: Project notes stay with projects, personal thoughts in user home directory
- **Timestamped entries**: Each entry automatically dated with microsecond precision
- **YAML frontmatter**: Structured metadata for each entry

### Search & Discovery
- **Semantic search**: Natural language queries using local AI embeddings
- **Vector similarity**: Find conceptually related entries, not just keyword matches
- **Local AI processing**: Uses @xenova/transformers - no external API calls required
- **Automatic indexing**: Embeddings generated for all entries on startup and ongoing

### Privacy & Performance
- **Completely private**: All processing happens locally, no data leaves your machine
- **Fast operation**: Optimized file structure and in-memory similarity calculations
- **Robust fallbacks**: Intelligent path resolution across platforms

## Installation
```

```bash
latest=/tmp/pjmcp-exp/project-journal/2026-03-08/08-39-58-927023.md; echo "entry="; curl --silent file:// | sed -n '1,22p'
```

```output
entry=
```

```bash
latest=$(find /tmp/pjmcp-exp/project-journal -name "*.md" | sort | tail -n 1); echo "entry=$latest"; curl --silent "file://$latest" | sed -n "1,22p"
```

```output
entry=/tmp/pjmcp-exp/project-journal/2026-03-08/08-39-58-927023.md
---
title: "8:39:58 AM - March 8, 2026"
date: 2026-03-08T08:39:58.927Z
timestamp: 1772959198927
---

## Project Notes

Project note: entries should appear under custom --journal-path.
```

```bash
uvx rodney start && uvx rodney open https://github.com/obra/private-journal-mcp && uvx rodney waitidle && uvx rodney screenshot private-journal-mcp-investigation/private-journal-mcp-github.png && uvx rodney title
```

```output
[launcher.Browser]2026/03/08 08:40:30 Download: https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1321438/chrome-linux.zip
[launcher.Browser]2026/03/08 08:40:30 Progress: 00%
[launcher.Browser]2026/03/08 08:40:31 Progress: 08%
[launcher.Browser]2026/03/08 08:40:32 Progress: 17%
[launcher.Browser]2026/03/08 08:40:33 Progress: 34%
[launcher.Browser]2026/03/08 08:40:35 Progress: 35%
[launcher.Browser]2026/03/08 08:40:36 Progress: 52%
[launcher.Browser]2026/03/08 08:40:37 Progress: 64%
[launcher.Browser]2026/03/08 08:40:39 Progress: 70%
[launcher.Browser]2026/03/08 08:40:40 Progress: 88%
[launcher.Browser]2026/03/08 08:40:41 Progress: 99%
[launcher.Browser]2026/03/08 08:40:41 Unzip: /root/.cache/rod/browser/chromium-1321438
[launcher.Browser]2026/03/08 08:40:41 Progress: 00%
[launcher.Browser]2026/03/08 08:40:42 Progress: 17%
[launcher.Browser]2026/03/08 08:40:43 Progress: 30%
[launcher.Browser]2026/03/08 08:40:44 Progress: 42%
[launcher.Browser]2026/03/08 08:40:45 Progress: 66%
[launcher.Browser]2026/03/08 08:40:46 Progress: 86%
[launcher.Browser]2026/03/08 08:40:47 Downloaded: /root/.cache/rod/browser/chromium-1321438
panic: [launcher] Failed to launch the browser, the doc might help https://go-rod.github.io/#/compatibility?id=os: /root/.cache/rod/browser/chromium-1321438/chrome: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory
	

goroutine 1 [running]:
github.com/go-rod/rod/lib/utils.init.func2({0x832320?, 0xc000038180?})
	/home/runner/go/pkg/mod/github.com/go-rod/rod@v0.116.2/lib/utils/utils.go:68 +0x1d
github.com/go-rod/rod/lib/utils.E(...)
	/home/runner/go/pkg/mod/github.com/go-rod/rod@v0.116.2/lib/utils/utils.go:74
github.com/go-rod/rod/lib/launcher.(*Launcher).MustLaunch(0x901825?)
	/home/runner/go/pkg/mod/github.com/go-rod/rod@v0.116.2/lib/launcher/launcher.go:401 +0x6f
main.cmdStart({0xc0000384e0, 0x0, 0x7fbac00f69a8?})
	/home/runner/work/rodney/rodney/main.go:408 +0x826
main.main()
	/home/runner/work/rodney/rodney/main.go:193 +0x610
```

MCP tool exercise summary: process_thoughts wrote all five sections; project and user journals were both created, proving dual storage and timestamped file naming. read_journal_entry worked when given a concrete path. In this environment, search_journal consistently failed with "fetch failed" (likely during model fetch), and list_recent_entries returned empty even after writes.

Rodney web UI attempt: I tried to launch Chrome and capture the GitHub UI from inside showboat, but rodney failed in this container because shared library  is missing.

I captured fallback web UI screenshots with Playwright browser tooling instead: one of the GitHub repository page and one of the related blog post. See image links below.

![GitHub UI screenshot](browser:/tmp/codex_browser_invocations/75432fecf14d9a3d/artifacts/private-journal-mcp-investigation/github-repo-ui.png)

```bash
uvx showboat --help | sed -n '1,28p'; echo '---'; uvx rodney --help | sed -n '1,24p'
```

```output
showboat - Create executable demo documents that show and prove an agent's work.

Showboat helps agents build markdown documents that mix commentary, executable
code blocks, and captured output. These documents serve as both readable
documentation and reproducible proof of work. A verifier can re-execute all
code blocks and confirm the outputs still match.

Usage:
  showboat init <file> <title>             Create a new demo document
  showboat note <file> [text]              Append commentary (text or stdin)
  showboat exec <file> <lang> [code]       Run code and capture output
  showboat image <file> <path>             Copy image into document
  showboat image <file> '![alt](path)'   Copy image with alt text
  showboat pop <file>                      Remove the most recent entry
  showboat verify <file> [--output <new>]  Re-run and diff all code blocks
  showboat extract <file> [--filename <name>]  Emit commands to recreate file

Global Options:
  --workdir <dir>   Set working directory for code execution (default: current)
  --version         Print version and exit
  --help, -h        Show this help message

Exec output:
  The "exec" command prints the captured shell output to stdout and exits with
  the same exit code as the executed command. This lets agents see what happened
  and react to errors. The output is still appended to the document regardless
  of exit code. Use "pop" to remove a failed entry.

---
rodney - Chrome automation from the command line

Browser lifecycle:
  rodney start [--show] [--insecure | -k]  Launch Chrome (headless by default, --show for visible)
  rodney connect <host:port>      Connect to existing Chrome on remote debug port
  rodney stop                     Shut down Chrome
  rodney status                   Show browser status

Navigation:
  rodney open <url>               Navigate to URL
  rodney back                     Go back in history
  rodney forward                  Go forward in history
  rodney reload [--hard]          Reload page (--hard bypasses cache)
  rodney clear-cache              Clear the browser cache

Page info:
  rodney url                      Print current URL
  rodney title                    Print page title
  rodney html [selector]          Print HTML (page or element)
  rodney text <selector>          Print text content of element
  rodney attr <selector> <name>   Print attribute value
  rodney pdf [file]               Save page as PDF

Interaction:
```
