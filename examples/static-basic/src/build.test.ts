import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const client = path.join(root, 'dist', 'client');

// 描画に失敗するページを持つ構成のビルド。止まることを主張するので、
// 先に走らせて stderr を取っておき、本物のビルドで dist を上書きする
let brokenBuildStderr = '';

// 主張の対象がビルド成果物そのものなので、テストがビルドを走らせる。
// 出力を読むだけにすると、何も書かなかったビルドと区別がつかない
beforeAll(() => {
  try {
    execFileSync(
      'pnpm',
      ['exec', 'vite', 'build', '--config', 'vite.broken.config.ts'],
      { cwd: root, stdio: 'pipe' },
    );
  } catch (error) {
    brokenBuildStderr = String((error as { stderr?: Buffer }).stderr ?? '');
  }
  execFileSync('pnpm', ['exec', 'vite', 'build'], { cwd: root, stdio: 'pipe' });
}, 360_000);

const read = (...parts: string[]): string =>
  readFileSync(path.join(client, ...parts), 'utf8');

describe('the static build', () => {
  it('writes a page as HTML the server rendered', () => {
    const html = read('index.html');
    expect(html).toContain('rendered on the server');
    expect(html).toContain('home');
  });

  it("leaves a browser-only component's fallback in the HTML without stopping", () => {
    // `use(browser())` はビルドの失敗ではない: fallback が書かれ、本体は
    // ブラウザが hydrate 後に描く
    const html = read('index.html');
    expect(html).toContain('time zone: not yet');
    expect(html).not.toContain('time zone: Asia');
  });

  it('writes the same page as a payload beside it', () => {
    expect(read('index.rsc')).toContain('rendered on the server');
  });

  it('writes a page per supplied pathname, with its data', () => {
    expect(read('products', '1', 'index.html')).toContain('first product');
    expect(read('products', '2', 'index.html')).toContain('second product');
    expect(read('products', '1', 'index.rsc')).toContain('first product');
    // [id] のスキーマが通した値で、page は number を受け取る
    expect(read('products', '1', 'index.html')).toContain('number:1');
  });

  it('gives a route group its layout without a URL segment', () => {
    const html = read('guide', 'index.html');
    expect(html).toContain('docs-shell');
    expect(html).toContain('guide');
  });

  it('writes not-found.tsx as the file a host serves for an unknown URL', () => {
    expect(read('404.html')).toContain('not found');
  });

  it('stops, naming the page, when a page throws while rendering', () => {
    // error.tsx はブラウザでの失敗のためのもので、ビルド時の失敗は失敗のまま
    expect(brokenBuildStderr).toContain('static build could not render /');
    expect(brokenBuildStderr).toContain('broken on purpose');
  });

  it('writes a redirect.ts as a page that sends the visitor on', () => {
    const html = read('old', 'index.html');
    expect(html).toContain('http-equiv="refresh"');
    expect(html).toContain('url=/products');
    expect(existsSync(path.join(client, 'old', 'index.rsc'))).toBe(false);
  });

  it('writes a sitemap of the pages it rendered, when told the origin', () => {
    const xml = read('sitemap.xml');
    expect(xml).toContain('<loc>https://example.test/</loc>');
    expect(xml).toContain('<loc>https://example.test/products/2</loc>');
    // リダイレクトと not-found はページではない
    expect(xml).not.toContain('/old');
    expect(xml).not.toContain('404');
  });

  it('ships the client entry, so the page hydrates', () => {
    expect(read('index.html')).toMatch(/<script[^>]+type="module"/u);
  });
});
