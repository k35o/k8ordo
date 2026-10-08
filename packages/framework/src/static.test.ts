import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { staticMode } from './static';

// プラグインのフックを Vite の代わりに呼ぶ。ビルドの全体は examples/static-basic
// の build.test.ts が見ていて、ここではそこから見えない呼ばれ方だけを扱う
type ResolveId = (
  this: { environment: { mode: 'build' | 'dev' } },
  source: string,
  importer: string | undefined,
) => null;
type BuildApp = (builder: { config: { plugins: [] } }) => Promise<void>;

let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'k8ordo-static-'));
  await mkdir(path.join(root, 'src', 'routes'), { recursive: true });
  await writeFile(
    path.join(root, 'src', 'routes', 'page.tsx'),
    'export default function Page() { return null; }\n',
  );
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

const hooks = () => {
  const plugin = staticMode({ mode: 'static' }).find(
    ({ name }) => name === 'k8ordo:static',
  );
  if (plugin === undefined) throw new Error('no k8ordo:static plugin');
  (
    plugin.configResolved as unknown as (config: {
      root: string;
      plugins: [];
    }) => void
  )({
    root,
    plugins: [],
  });
  const resolveId = (plugin.resolveId as unknown as { handler: ResolveId })
    .handler;
  const buildApp = (plugin.buildApp as unknown as { handler: BuildApp })
    .handler;
  return {
    resolveFrom: (importer: string) =>
      resolveId.call(
        { environment: { mode: 'build' } },
        '@k8ordo/framework/server',
        importer,
      ),
    finish: () => buildApp({ config: { plugins: [] } }),
  };
};

describe('the build’s refusal of the request API', () => {
  it('names the module that imports it, and not the index.html the RSC plugin resolves an installed package from again', async () => {
    const { resolveFrom, finish } = hooks();
    resolveFrom(path.join(root, 'src', 'routes', 'page.tsx'));
    // @vitejs/plugin-rsc は node_modules に解決した bare import を、
    // <root>/index.html からもう一度解決して同じパッケージかを確かめる
    resolveFrom(path.join(root, 'index.html'));

    await expect(finish()).rejects.toThrow(
      "static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:\n  src/routes/page.tsx\nthis application wants mode: 'server'",
    );
  });
});
