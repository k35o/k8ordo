import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSync } from 'vite';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

/** Every package a built `.d.mts` reaches, through the chunks it imports. */
const packagesReachedBy = async (entry: string): Promise<readonly string[]> => {
  const packages = new Set<string>();
  const seen = new Set<string>();
  const visit = async (file: string): Promise<void> => {
    if (seen.has(file)) return;
    seen.add(file);
    const { errors, module } = parseSync(file, await readFile(file, 'utf8'), {
      sourceType: 'module',
    });
    expect(errors).toStrictEqual([]);
    const specifiers = [
      ...module.staticImports.map(({ moduleRequest }) => moduleRequest.value),
      ...module.staticExports.flatMap(({ entries }) =>
        entries.flatMap(({ moduleRequest }) =>
          moduleRequest === null ? [] : [moduleRequest.value],
        ),
      ),
    ];
    for (const specifier of specifiers) {
      if (specifier.startsWith('.')) {
        // チャンクは .mjs の名前で読まれ、型はその隣の .d.mts にある
        // oxlint-disable-next-line eslint/no-await-in-loop
        await visit(
          path.resolve(
            path.dirname(file),
            specifier.replace(/\.mjs$/u, '.d.mts'),
          ),
        );
      } else {
        packages.add(specifier);
      }
    }
  };
  await visit(path.join(dist, entry));
  return [...packages].toSorted();
};

describe('the types of the entries a route file reads', () => {
  // サーバーモードの .k8ordo/register.gen.ts は ./server を必ず import する。
  // そこから vite の型に届くと、@types/node の無いアプリが skipLibCheck: false
  // で型検査に落ちる
  it.each(['server.d.mts', 'index.d.mts', 'generated.d.mts'])(
    '%s reaches the router and nothing else',
    async (entry) => {
      expect(await packagesReachedBy(entry)).toStrictEqual(['@k8ordo/router']);
    },
  );
});
