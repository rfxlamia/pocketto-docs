#!/usr/bin/env node
/**
 * Internal-link checker for content and app source.
 * - Extracts /docs/... hrefs and links from MDX/TSX content.
 * - Validates them against the page tree derived from content/docs on disk.
 * - Also checks that section meta.json page lists point at real files.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content', 'docs');

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function validUrls() {
  const urls = new Set(['/docs']);
  const files = walk(contentDir);
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    const rel = file.slice(contentDir.length + 1);
    const withoutExt = rel.replace(/\.mdx$/, '');
    const url = withoutExt.endsWith('/index')
      ? `/docs/${withoutExt.slice(0, -'/index'.length)}`
      : `/docs/${withoutExt}`;
    urls.add(url.replace(/\/$/, '') || '/docs');
  }
  return urls;
}

const mdxLinkRe = /\[(?:[^\]]*)\]\((\/[^)\s]*)\)/g;
const hrefRe = /href="(\/[^"#]*)/g;
const urlRe = /https?:\/\/pocketto\.rfxlamia\.xyz(\/[^"'\s)\]]*)/g;

function extractLinks(text, set) {
  for (const m of text.matchAll(mdxLinkRe)) set.add(m[1]);
  for (const m of text.matchAll(hrefRe)) set.add(m[1]);
  for (const m of text.matchAll(urlRe)) {
    if (m[1] && m[1] !== '/') set.add(m[1]);
  }
}

const valid = validUrls();
const errors = [];
let checked = 0;

const sources = walk(root).filter(
  (f) => (f.endsWith('.mdx') && f.includes(`${join('content', 'docs')}`)) || f.endsWith('.tsx'),
);
const seen = new Set();
for (const file of sources) {
  const text = readFileSync(file, 'utf8');
  const links = new Set();
  extractLinks(text, links);
  for (const link of links) {
    if (seen.has(link)) continue;
    seen.add(link);
    checked++;
    if (link.startsWith('/docs') && !valid.has(link)) {
      errors.push(`BROKEN ${link}  (in ${file.replace(root, '')})`);
    }
  }
}

// meta.json page lists
for (const file of walk(contentDir).filter((f) => f.endsWith('meta.json'))) {
  const meta = JSON.parse(readFileSync(file, 'utf8'));
  const dir = dirname(file);
  for (const page of meta.pages ?? []) {
    const asIndex = existsSync(join(dir, page, 'index.mdx'));
    const asFile = existsSync(join(dir, `${page}.mdx`));
    if (!asIndex && !asFile) errors.push(`META ${page} listed in ${file.replace(root, '')} but no file`);
  }
}

console.log(`checked ${checked} unique internal links against ${valid.size} docs pages`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('all internal links OK');
