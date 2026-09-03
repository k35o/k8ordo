import path from 'node:path';

import { safeJoin } from './static-file';

const ROOT = path.resolve('/srv/app/dist/client');

describe('safeJoin', () => {
  it('resolves a plain request under the build output', () => {
    expect(safeJoin(ROOT, '/assets/app.js')).toBe(
      path.join(ROOT, 'assets/app.js'),
    );
    expect(safeJoin(ROOT, '/')).toBe(ROOT);
  });

  it('never lands outside the build output, however it is spelled', () => {
    for (const pathname of [
      '/../secrets.env',
      '/assets/../../secrets.env',
      '/%2e%2e/secrets.env',
      '/..%2f..%2fsecrets.env',
      '/....//secrets.env',
    ]) {
      const resolved = safeJoin(ROOT, pathname);
      // `..` は root で打ち止めになるので、脱出ではなく root 内の
      // 存在しないパスに落ちる。求めているのは「外に出ない」こと。
      expect(resolved === null || resolved.startsWith(`${ROOT}/`)).toBe(true);
    }
  });

  it('refuses input it cannot read as a pathname', () => {
    expect(safeJoin(ROOT, '/%E0%A4%A')).toBeNull();
    expect(safeJoin(ROOT, '/a%00b')).toBeNull();
  });

  it('keeps a sibling-looking name inside the root', () => {
    expect(safeJoin(ROOT, '/../client-secrets')).toBe(
      path.join(ROOT, 'client-secrets'),
    );
  });
});
