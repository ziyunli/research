# Obsidian Clipper Markdown Extraction Investigation

## What I investigated

I cloned `https://github.com/obsidianmd/obsidian-clipper` into `/tmp/obsidian-clipper` and traced how page content gets turned into Markdown.

## How Obsidian Clipper parses web pages into Markdown

The core pipeline is:

1. **Extract article-like HTML + metadata** with Defuddle:
   - In `src/content.ts`, on `getPageContent`, the extension runs:
     - `const defuddle = new Defuddle(document, { url: document.URL });`
     - `const defuddled = await defuddle.parseAsync();`
   - This yields cleaned main content (`defuddled.content`) and metadata (title, author, site, published, etc.).

2. **Convert extracted HTML to Markdown**:
   - The extension uses `createMarkdownContent(defuddled.content, document.URL)` from `defuddle/full`.
   - This is used in both copy-to-clipboard and variable initialization paths.

So the web-page-to-markdown behavior is largely delegated to the **Defuddle** package (readability-style extraction + markdown conversion).

---

## Extracted CLI prototype

I implemented a minimal CLI that reproduces the same approach:

- File: `clipper-md-cli.mjs`
- Dependencies: `defuddle@^0.12.0`, `jsdom@^24.1.3`

### CLI flow

1. Fetch page HTML from a URL.
2. Build a JSDOM document from HTML.
3. Run `new Defuddle(document, { url }).parseAsync()`.
4. Run `Defuddle.createMarkdownContent(defuddled.content, url)`.
5. Output markdown to stdout or file; optional JSON mode includes metadata.

### Usage

```bash
npm install
node ./clipper-md-cli.mjs <url>
node ./clipper-md-cli.mjs <url> --json
node ./clipper-md-cli.mjs <url> --output article.md
```

### Notes / limitations

- In this environment, external network fetches were unavailable for live URLs, so end-to-end validation used a `data:` URL fixture.
- `defuddle/full` is CommonJS; in ESM you should import the default export.
- Markdown conversion in Node needs a DOM-like global document/window context; the prototype temporarily binds JSDOM globals during conversion.

## Outcome

Yes—the Obsidian Clipper page-to-Markdown feature can be extracted into a CLI with relatively little code because the extension already relies on Defuddle for both extraction and markdown conversion.
