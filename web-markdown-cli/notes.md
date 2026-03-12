# Investigation Notes: Extracting Web-to-Markdown from Obsidian Clipper

## Goal
Clone obsidian-clipper, understand how it converts web pages to Markdown, and extract this into a standalone CLI tool.

## Findings

### Repository Structure
- Obsidian Clipper is a browser extension (Chrome/Firefox/Safari)
- Source lives in `src/` with key files: `content.ts`, `background.ts`, `src/utils/content-extractor.ts`
- Uses webpack for building, vitest for testing

### How It Converts Web Pages to Markdown

The core conversion is done by **defuddle** (v0.12.0), an external library by the same author (kepano).

**Pipeline:**
1. **DOM Flattening**: `flattenShadowDom()` prepares the page DOM (handles shadow DOM elements)
2. **Content Extraction**: `Defuddle` parses the document — similar to Mozilla's Readability.js. It:
   - Identifies the main content area
   - Removes noise (headers, footers, nav, ads, sidebars)
   - Extracts metadata (title, author, published date, description, favicon, image, word count)
   - Standardizes HTML (normalizes headings, code blocks, footnotes, math elements)
3. **Markdown Conversion**: `createMarkdownContent(html, url)` from `defuddle/full` converts the cleaned HTML to Markdown
4. **Template System**: Obsidian Clipper wraps the result in user-configurable templates with 60+ filters

**Key code paths:**
- Quick copy flow: `content.ts` lines 213-237 — directly calls Defuddle + createMarkdownContent
- Full clip flow: `content.ts` → `content-extractor.ts:initializePageContent()` — same core conversion, plus template variables
- Markdown filter: `src/utils/filters/markdown.ts` — wraps `createMarkdownContent`

### Defuddle Library
- Has a `defuddle/node` export that accepts HTML strings (uses JSDOM internally)
- API: `Defuddle(htmlOrDom, url?, options?)` returns a Promise with content + metadata
- Key option: `markdown: true` makes `content` field return Markdown instead of HTML
- Other options: `contentSelector`, `removeImages`, `debug`, etc.

### What I Built
- A CLI tool (`cli.mjs`) that wraps defuddle/node
- Supports: URL fetching, local HTML files, stdin piping
- Output modes: Markdown (default), HTML (`--html`), JSON (`--json`), single property (`--property`)
- Additional options: `--selector` for CSS content selector, `--no-images`, `--debug`

### What's NOT Included from Obsidian Clipper
- The template system (complex, Obsidian-specific)
- Highlight/annotation features (browser-only)
- Schema.org data extraction (available via `--json` output)
- Browser extension infrastructure
