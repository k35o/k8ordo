import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { en } from './en';

// components.md の「Every key in the `Messages` type」の節は手で書く表で、部品が
// 文言を足しても生成器は書き換えない。書き忘れはこのテストでしか気づけない。
const section = (): string => {
  const doc = readFileSync(
    join(import.meta.dirname, '../../docs/references/components.md'),
    'utf8',
  );
  const start = doc.indexOf('Every key in the `Messages` type');
  const end = doc.indexOf('\n#', start);
  return doc.slice(start, end === -1 ? undefined : end);
};

describe('components.md の Messages のキーの一覧', () => {
  it('Messages のキーをすべて挙げる', () => {
    const listed = new Set(
      [...section().matchAll(/`([A-Za-z]+)`/g)].map(([, key]) => key),
    );
    const missing = Object.keys(en).filter((key) => !listed.has(key));

    expect(missing).toEqual([]);
  });
});
