import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vite-plus/test';

const SERVER_SAFE = ['index.ts', 'schemas.ts', 'icon-names.ts'];
const ALLOWED = new Set(['zod', './schemas', './icon-names']);

const sourceOf = (file: string): string =>
  readFileSync(join(import.meta.dirname, file), 'utf8');

const runtimeImports = (file: string): string[] =>
  [
    ...sourceOf(file).matchAll(
      /^import (?!type )[^;]*? from '(?<source>[^']+)';$/gmu,
    ),
  ].map((match) => match.groups?.source ?? '');

describe('@k8ordo/ui/catalog はサーバーで読める', () => {
  it.each(SERVER_SAFE)(
    '%s が実行時に読むのは zod と React を読まない catalog のモジュールだけ',
    (file) => {
      expect(
        runtimeImports(file).filter((source) => !ALLOWED.has(source)),
      ).toStrictEqual([]);
    },
  );

  it.each(SERVER_SAFE)("%s は 'use client' を持たない", (file) => {
    expect(sourceOf(file).startsWith("'use client'")).toBe(false);
  });
});
