import { describe, expect, it } from 'vite-plus/test';

import {
  CLIENT_DEPS_HEADER,
  clientDepsHeader,
  readClientDeps,
} from './payload';

// 2 つのページの client コンポーネントが共に import するモジュールは、その名前の
// 共有チャンクになる
const SHARED = [
  {
    id: 'ad45eb3277a6',
    name: 'Button',
    js: ['/assets/共有-cLEA3hoH.js'],
    css: [],
  },
  {
    id: '0d6b5e3f9c21',
    name: 'Card',
    js: ['/assets/共有-cLEA3hoH.js', '/assets/card-D7A9USJg.js'],
    css: ['/assets/card-C2TfACgz.css'],
  },
];

describe('what the HTML of a file says of its client components', () => {
  it('reads back what was said, a file whose name is not ASCII included', () => {
    expect(readClientDeps(clientDepsHeader(SHARED))).toStrictEqual(SHARED);
  });

  it('is a value a response can carry as a header', () => {
    const response = new Response(null, {
      headers: { [CLIENT_DEPS_HEADER]: clientDepsHeader(SHARED) },
    });

    expect(
      readClientDeps(String(response.headers.get(CLIENT_DEPS_HEADER))),
    ).toStrictEqual(SHARED);
  });

  it('says none for a payload that names none', () => {
    expect(readClientDeps(clientDepsHeader([]))).toStrictEqual([]);
  });
});
