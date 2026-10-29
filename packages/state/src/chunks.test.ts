import { fileURLToPath } from 'node:url';

import { build } from 'vite';
import type { Rolldown } from 'vite';
import { beforeAll, expect, it } from 'vite-plus/test';

const root = fileURLToPath(new URL('../fixtures/chunks/', import.meta.url));

// definePageState、ページの store、Cookie の store だけが持つ文字
const PAGE_DEFINITION = 'declares neither url nor entry';
const PAGE_STORE = 'currententrychange';
const COOKIE_STORE = 'cookieStore';

let chunks: readonly Rolldown.OutputChunk[] = [];

beforeAll(async () => {
  const output = (await build({
    root,
    configFile: false,
    logLevel: 'silent',
    resolve: {
      alias: {
        '@k8ordo/state': fileURLToPath(new URL('index.ts', import.meta.url)),
      },
    },
    build: {
      write: false,
      minify: false,
      rolldownOptions: { input: `${root}main.ts` },
    },
  })) as Rolldown.RolldownOutput;
  chunks = output.output.filter(
    (item): item is Rolldown.OutputChunk => item.type === 'chunk',
  );
}, 60_000);

/** The code a chunk runs: its own and every chunk it imports statically. */
const codeLoadedBy = (facade: string): string => {
  const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const start = chunks.find((chunk) => chunk.facadeModuleId?.endsWith(facade));
  const seen = new Set<string>();
  const stack = start === undefined ? [] : [start.fileName];
  let code = '';
  while (stack.length > 0) {
    const name = stack.pop() as string;
    const chunk = byName.get(name);
    if (!seen.has(name) && chunk !== undefined) {
      seen.add(name);
      code += chunk.code;
      stack.push(...chunk.imports);
    }
  }
  return code;
};

const holds = (code: string): Record<string, boolean> => ({
  definePageState: code.includes(PAGE_DEFINITION),
  pageStore: code.includes(PAGE_STORE),
  cookieStore: code.includes(COOKIE_STORE),
});

it('leaves the page state and the cookie store out of what a module defining only a local state loads', () => {
  expect(holds(codeLoadedBy('/local.ts'))).toStrictEqual({
    definePageState: false,
    pageStore: false,
    cookieStore: false,
  });
});

it('loads with a module defining a page state its definition and its store, and no cookie store', () => {
  expect(holds(codeLoadedBy('/page.ts'))).toStrictEqual({
    definePageState: true,
    pageStore: true,
    cookieStore: false,
  });
});
