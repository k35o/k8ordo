import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// 複合コンポーネント（`X.Root` の形）を `'use client'` モジュールの中で
// オブジェクトとして組み立てて export すると、RSC の server 環境では
// export が参照プロキシになり `X.Root` が undefined になる。
// 合成は client でない index.ts 側で行い、パーツは個別に export する。
const CLIENT_DIRECTIVE = /^['"]use client['"];/u;
const COMPOUND_EXPORT = /^export const ([A-Z]\w*) = \{/gmu;

// v2 で全ての複合コンポーネントを index.ts 合成へ移した。空のまま保つ:
// ここに名前を足すのは server コンポーネントから使えない例外を認めることになる。
const PENDING_MIGRATION = new Set<string>();

const COMPONENTS_DIR = join(import.meta.dirname, '.');

// 組み込みの文言は getMessages() で読む。hook ではないので、文言を読むためだけに
// 'use client' を付ける理由は無い。Server Component から描ける部品をここに固定する。
const SERVER_COMPONENTS = [
  'ai/reasoning/reasoning.tsx',
  'ai/tool-invocation/tool-invocation.tsx',
  'data-display/code/code.tsx',
  'feedback/alert/alert.tsx',
  'feedback/spinner/spinner.tsx',
  'navigation/breadcrumb/breadcrumb.tsx',
];

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(path);
    }
    return entry.name.endsWith('.tsx') && !entry.name.includes('.stories.')
      ? [path]
      : [];
  });

const clientComposedCompounds = (): string[] => {
  const found: string[] = [];
  for (const path of walk(COMPONENTS_DIR)) {
    const source = readFileSync(path, 'utf8');
    if (!CLIENT_DIRECTIVE.test(source)) {
      continue;
    }
    for (const [, name] of source.matchAll(COMPOUND_EXPORT)) {
      if (name !== undefined) {
        found.push(name);
      }
    }
  }
  return found.toSorted();
};

describe('複合コンポーネントの合成位置', () => {
  describe('正常系', () => {
    it("'use client' モジュール内で合成された複合コンポーネントを増やさない", () => {
      expect(clientComposedCompounds()).toStrictEqual(
        [...PENDING_MIGRATION].toSorted(),
      );
    });
  });
});

describe('Server Component から描ける部品', () => {
  describe('正常系', () => {
    it("組み込みの文言を読むだけの部品を 'use client' にしない", () => {
      const clientModules = SERVER_COMPONENTS.filter((path) =>
        CLIENT_DIRECTIVE.test(readFileSync(join(COMPONENTS_DIR, path), 'utf8')),
      );
      expect(clientModules).toStrictEqual([]);
    });
  });
});
