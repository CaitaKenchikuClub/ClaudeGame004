// GitHub Pages のサブパス配信（/<repo>/）や Capacitor で壊れないよう、
// HTML/CSS/JS 内のリソース参照がルート絶対パス（"/..."）になっていないことを確認する。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function listFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listFiles(p)));
    else if (/\.(html|css|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [join(root, 'index.html'), ...(await listFiles(join(root, 'src')))];

const patterns = [
  /\b(?:src|href)\s*=\s*["'](\/[^/"'][^"']*)["']/g,
  /url\(\s*["']?(\/[^/)"'][^)"']*)["']?\s*\)/g,
  /\bfrom\s+["'](\/[^"']*)["']/g,
  /\bimport\(\s*["'](\/[^"']*)["']\s*\)/g,
  /\bfetch\(\s*["'](\/[^/"'][^"']*)["']/g,
];

test('ルート絶対パスでのリソース参照がない', async () => {
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    for (const re of patterns) {
      for (const m of text.matchAll(re)) {
        assert.fail(`${f.slice(root.length + 1)}: 絶対パス参照 "${m[1]}" は相対パス（./）にしてください`);
      }
    }
  }
});

test('index.html から参照しているファイルが存在する', async () => {
  const html = await readFile(join(root, 'index.html'), 'utf8');
  for (const m of html.matchAll(/\b(?:src|href)\s*=\s*["'](\.\/[^"']+)["']/g)) {
    assert.ok(existsSync(join(root, m[1])), `存在しないファイル: ${m[1]}`);
  }
});
