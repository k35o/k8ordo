import { describe, expect, it } from 'vite-plus/test';

import {
  CLIENT_DEPS_HEADER,
  clientDepsHeader,
  readClientDeps,
  readServerStylesheets,
  SERVER_STYLESHEETS_HEADER,
  serverStylesheetsHeader,
} from './payload';

// 2 つのページの client コンポーネントが共に import するモジュールは、その名前の
// 共有チャンクになる
const SHARED = [
  {
    js: ['/assets/共有-cLEA3hoH.js'],
    css: [],
  },
  {
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

describe('what the HTML of a file says of its Server Components’ stylesheets', () => {
  it('reads back what was said, through a header, a file whose name is not ASCII included', () => {
    const linked = ['/assets/共有-B1x2Yz9a.css', '/assets/page-C3d4Ef5g.css'];
    const response = new Response(null, {
      headers: { [SERVER_STYLESHEETS_HEADER]: serverStylesheetsHeader(linked) },
    });

    expect(
      readServerStylesheets(
        String(response.headers.get(SERVER_STYLESHEETS_HEADER)),
      ),
    ).toStrictEqual(linked);
  });
});
