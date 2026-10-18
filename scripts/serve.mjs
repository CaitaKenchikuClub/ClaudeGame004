// 依存ライブラリなしのローカル確認用静的サーバー。
// 使い方: npm start            → http://localhost:8000/
//         PORT=3000 npm start
// BASE=/ClaudeGame004/ npm start とすると GitHub Pages のサブパス配信を再現できる。

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT) || 8000;
const base = (process.env.BASE || '/').replace(/\/?$/, '/');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) {
    res.writeHead(404).end('Not Found');
    return;
  }
  let rel = decodeURIComponent(url.pathname.slice(base.length));
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const file = normalize(join(root, rel));
  if (!file.startsWith(root) || rel.split('/').some((p) => p.startsWith('.'))) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not Found');
  }
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}${base}`);
});
