#!/usr/bin/env node

import { Defuddle } from 'defuddle/node';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const USAGE = `Usage: web-markdown [options] <url-or-file>

Convert a web page or local HTML file to clean Markdown.

Options:
  --html           Output cleaned HTML instead of Markdown
  --json           Output full JSON response (metadata + content)
  --selector <sel> CSS selector for main content element
  --no-images      Remove images from output
  --property <key> Extract a single property (title, author, description, etc.)
  --debug          Enable debug output
  -h, --help       Show this help message

Examples:
  web-markdown https://example.com/article
  web-markdown page.html
  web-markdown --json https://example.com/article
  web-markdown --property title https://example.com/article
  cat page.html | web-markdown -
`;

function parseArgs(argv) {
  const args = {
    input: null,
    html: false,
    json: false,
    selector: null,
    noImages: false,
    property: null,
    debug: false,
    help: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case '--html':
        args.html = true;
        break;
      case '--json':
        args.json = true;
        break;
      case '--selector':
        args.selector = argv[++i];
        break;
      case '--no-images':
        args.noImages = true;
        break;
      case '--property':
        args.property = argv[++i];
        break;
      case '--debug':
        args.debug = true;
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
      default:
        if (arg === '-' || !arg.startsWith('-')) {
          args.input = arg;
        }
        break;
    }
    i++;
  }

  return args;
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; web-markdown-cli/1.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.text();
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function getHtml(input) {
  if (input === '-') {
    return { html: await readStdin(), url: 'about:blank' };
  }

  if (/^https?:\/\//i.test(input)) {
    return { html: await fetchUrl(input), url: input };
  }

  // Treat as local file
  const filePath = resolve(input);
  const html = readFileSync(filePath, 'utf-8');
  return { html, url: `file://${filePath}` };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.input) {
    process.stdout.write(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  try {
    const { html, url } = await getHtml(args.input);

    const options = {
      markdown: !args.html,
      debug: args.debug,
      removeImages: args.noImages,
    };

    if (args.selector) {
      options.contentSelector = args.selector;
    }

    const result = await Defuddle(html, url, options);

    if (args.property) {
      const value = result[args.property];
      if (value === undefined) {
        console.error(`Unknown property: ${args.property}`);
        console.error(`Available: ${Object.keys(result).join(', ')}`);
        process.exit(1);
      }
      process.stdout.write(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
      process.stdout.write('\n');
    } else if (args.json) {
      process.stdout.write(JSON.stringify(result, null, 2));
      process.stdout.write('\n');
    } else {
      // Default: output content (markdown or html)
      process.stdout.write(result.content || '');
      process.stdout.write('\n');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (args.debug) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
