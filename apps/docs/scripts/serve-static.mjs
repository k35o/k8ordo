// ビルド出力(dist/client)を、静的ホストと同じ規則で配信する検証用サーバ。
// 未知の URL は 404.html を 404 で返す —— SPA フォールバックではない。
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(import.meta.dirname, '..', 'dist', 'client');
const port = Number(process.env.PORT ?? 4173);

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript'],
  ['.mjs', 'text/javascript'],
  ['.css', 'text/css'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.json', 'application/json'],
  ['.woff2', 'font/woff2'],
  ['.png', 'image/png'],
  ['.rsc', 'text/x-component; charset=utf-8'],
]);

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let file = normalize(join(root, decodeURIComponent(url.pathname)));
  let status = 200;
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const indexInDir = join(file, 'index.html');
    if (existsSync(indexInDir)) {
      file = indexInDir;
    } else {
      file = join(root, '404.html');
      status = 404;
    }
  }
  res.writeHead(status, {
    'content-type': MIME.get(extname(file)) ?? 'application/octet-stream',
    // 検証用サーバなので鮮度を最優先する
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.warn(`serving ${root} on http://localhost:${String(port)}`);
});
