# web-markdown-cli

A CLI tool to convert web pages and HTML files to clean Markdown, extracted from [Obsidian Clipper](https://github.com/obsidianmd/obsidian-clipper).

## How It Works

Obsidian Clipper uses [defuddle](https://github.com/kepano/defuddle) as its core engine for web-to-Markdown conversion. Defuddle is a content extraction library (similar to Mozilla's Readability) that:

1. **Extracts main content** — removes navigation, headers, footers, sidebars, and ads
2. **Standardizes HTML** — normalizes headings, code blocks, footnotes, and math elements
3. **Converts to Markdown** — produces clean Markdown with proper formatting for links, images, tables, code blocks, and more
4. **Extracts metadata** — title, author, published date, description, word count, language

This CLI wraps defuddle's Node.js API (`defuddle/node`) to provide a simple command-line interface.

## Installation

```bash
npm install
```

## Usage

```bash
# Convert a local HTML file to Markdown
node cli.mjs page.html

# Pipe HTML from stdin
curl -sL https://example.com | node cli.mjs -

# Output cleaned HTML instead of Markdown
node cli.mjs --html page.html

# Output full JSON with metadata
node cli.mjs --json page.html

# Extract a single property
node cli.mjs --property title page.html
node cli.mjs --property author page.html

# Use a CSS selector to target specific content
node cli.mjs --selector "article.post" page.html

# Remove images from output
node cli.mjs --no-images page.html
```

## Options

| Flag | Description |
|------|-------------|
| `--html` | Output cleaned HTML instead of Markdown |
| `--json` | Output full JSON response (metadata + content) |
| `--selector <sel>` | CSS selector for main content element |
| `--no-images` | Remove images from output |
| `--property <key>` | Extract a single property (title, author, etc.) |
| `--debug` | Enable debug output |
| `-h, --help` | Show help message |

## Architecture

The Obsidian Clipper conversion pipeline works as follows:

```
Web Page DOM
    ↓
flattenShadowDom()      ← Browser-specific (not needed for CLI)
    ↓
Defuddle.parse()         ← Content extraction + cleaning
    ↓
createMarkdownContent()  ← HTML → Markdown conversion
    ↓
Template System          ← Obsidian-specific (not included)
```

This CLI captures the core of the pipeline (steps 2-3) using defuddle's Node.js API, which handles both content extraction and Markdown conversion in a single call.

## Relationship to Obsidian Clipper

This tool extracts the core web-to-Markdown conversion from Obsidian Clipper. Features **not** included:

- Obsidian template system (60+ filters, custom note templates)
- Browser highlight/annotation features
- Obsidian vault integration
- Browser extension UI

What **is** included:
- Content extraction (main article detection, noise removal)
- HTML-to-Markdown conversion (tables, code blocks, links, images, lists)
- Metadata extraction (title, author, date, description, word count)
