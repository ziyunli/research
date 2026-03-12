#!/usr/bin/env node
import Defuddle from 'defuddle/full';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';

function usage() {
  console.log(`clipper-md - extract article content and markdown using Obsidian Clipper's Defuddle pipeline

Usage:
  clipper-md <url> [--output <file>] [--json]

Options:
  --output, -o   Write markdown output to a file instead of stdout
  --json         Print metadata as JSON (markdown goes in \"markdown\")
  --help, -h     Show this help
`);
}

function parseArgs(argv) {
  const args = { url: '', output: '', json: false, help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      args.help = true;
    } else if (token === '--json') {
      args.json = true;
    } else if (token === '--output' || token === '-o') {
      args.output = argv[i + 1] || '';
      i += 1;
    } else if (!args.url) {
      args.url = token;
    }
  }

  return args;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'clipper-md-cli/0.1 (+https://github.com/obsidianmd/obsidian-clipper)'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }

  return response.text();
}

function convertHtmlToMarkdown(html, url, domWindow) {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  globalThis.document = domWindow.document;
  globalThis.window = domWindow;

  try {
    return Defuddle.createMarkdownContent(html, url);
  } finally {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  }
}

async function extract(url) {
  const html = await fetchHtml(url);
  const dom = new JSDOM(html, { url });
  const defuddle = new Defuddle(dom.window.document, { url });
  const defuddled = await defuddle.parseAsync();
  const markdown = convertHtmlToMarkdown(defuddled.content, url, dom.window);

  return {
    url,
    title: defuddled.title,
    author: defuddled.author,
    site: defuddled.site,
    published: defuddled.published,
    wordCount: defuddled.wordCount,
    parseTime: defuddled.parseTime,
    markdown
  };
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.url) {
  usage();
  process.exit(args.help ? 0 : 1);
}

const result = await extract(args.url);

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

if (args.output) {
  await fs.writeFile(args.output, result.markdown, 'utf8');
  console.error(`Wrote markdown to ${args.output}`);
} else {
  process.stdout.write(result.markdown);
}
