# Notes

- Started investigation: created feature branch and workspace folder.
- Cloned `obsidianmd/obsidian-clipper` into `/tmp/obsidian-clipper`.
- Located extraction pipeline in `src/content.ts` and `src/utils/content-extractor.ts`.
- Key finding: clipper uses `Defuddle(document, { url }).parseAsync()` to extract article HTML + metadata, then `createMarkdownContent(html, url)` from `defuddle/full` to convert HTML to Markdown.
- Next: build a minimal Node CLI that fetches a URL, builds a DOM, runs Defuddle, and outputs Markdown.
- Inspected `src/content.ts` in Obsidian Clipper and confirmed message `getPageContent` runs `new Defuddle(document, { url }).parseAsync()`.
- Confirmed markdown conversion uses `createMarkdownContent(defuddled.content, url)` (same package, `defuddle/full`).
- Built a standalone Node CLI (`clipper-md-cli.mjs`) that replicates this flow with `jsdom`:
  1) fetch URL HTML
  2) create JSDOM document
  3) run Defuddle parseAsync
  4) convert parsed article HTML to markdown
- Hit dependency mismatch (`defuddle@0.12.0` expects `jsdom@^24`) and pinned `jsdom` accordingly.
- Hit CJS/ESM interop issue with `defuddle/full`; fixed by importing default class and calling `Defuddle.createMarkdownContent(...)`.
- Hit `document is not defined` during markdown conversion in Node; fixed by temporarily binding `globalThis.document/window` to the JSDOM window while converting.
- Validation:
  - `npm run test:smoke` prints CLI help.
  - Used a `data:` URL to run an end-to-end extraction without external network access and got markdown output (`## Hello` + paragraph).
