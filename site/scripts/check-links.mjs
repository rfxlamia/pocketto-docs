#!/usr/bin/env node
/**
 * Internal-link checker for content and app source.
 * - Extracts internal hrefs and links from MDX/TSX content.
 * - Validates /docs and /case-studies links against the page trees on disk.
 * - Also checks that section meta.json page lists point at real files.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Each content collection on disk and the URL prefix it is served under.
const collections = [
  { dir: join(root, 'content', 'docs'), base: '/docs' },
  { dir: join(root, 'content', 'case-studies'), base: '/case-studies' },
];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function validUrls() {
  const urls = new Set();
  for (const { dir, base } of collections) {
    urls.add(base);
    for (const file of walk(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const withoutExt = file.slice(dir.length + 1).replace(/\.mdx$/, '');
      if (withoutExt === 'index') continue;
      const url = withoutExt.endsWith('/index')
        ? `${base}/${withoutExt.slice(0, -'/index'.length)}`
        : `${base}/${withoutExt}`;
      urls.add(url);
    }
  }
  return urls;
}

const isCollectionLink = (link) => collections.some(({ base }) => link === base || link.startsWith(`${base}/`));

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
  (f) => (f.endsWith('.mdx') && collections.some(({ dir }) => f.startsWith(dir))) || f.endsWith('.tsx'),
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
    if (isCollectionLink(link) && !valid.has(link)) {
      errors.push(`BROKEN ${link}  (in ${file.replace(root, '')})`);
    }
  }
}

// meta.json page lists
for (const file of collections.flatMap(({ dir }) => walk(dir)).filter((f) => f.endsWith('meta.json'))) {
  const meta = JSON.parse(readFileSync(file, 'utf8'));
  const dir = dirname(file);
  for (const page of meta.pages ?? []) {
    const asIndex = existsSync(join(dir, page, 'index.mdx'));
    const asFile = existsSync(join(dir, `${page}.mdx`));
    if (!asIndex && !asFile) errors.push(`META ${page} listed in ${file.replace(root, '')} but no file`);
  }
}

console.log(`checked ${checked} unique internal links against ${valid.size} pages`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('all internal links OK');
