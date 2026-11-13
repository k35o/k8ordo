import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Plugin } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

// @mdx-js/rollup の代わり。MDX のコンパイラは、本文を MDXContent という名前の関数の
// default export にし、MDX に書かれた import をそのまま残す。CSS の包みが見るのは
// その 2 つだけなので、同じ形の JS を返す
const mdxStandIn: Plugin = {
  name: 'mdx-stand-in',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.mdx')) return null;
    const name = path.basename(id, '.mdx');
    const imports = code
      .split('\n')
      .filter((line) => line.startsWith('import '))
      .join('\n');
    return {
      code: `import { jsx } from 'react/jsx-runtime';
${imports}
function _createMdxContent() {
  return jsx('p', { 'data-${name}': '', children: 'from ${name}.mdx' });
}
export default function MDXContent(props = {}) {
  return jsx(_createMdxContent, props);
}
`,
      map: null,
    };
  },
};

let built: BuiltFixture | undefined;

beforeAll(async () => {
  built = await buildFixture('mdx-css', { plugins: [mdxStandIn] });
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

const stylesOf = async (pathname: string): Promise<string> => {
  const answer = await (built as BuiltFixture).handler(
    new Request(`https://k8ordo.test${pathname}`),
  );
  const html = await answer.text();
  expect(html).toContain(`from ${pathname === '/' ? 'note' : 'aside'}.mdx`);
  const hrefs = [...html.matchAll(/<link\b[^>]*>/gu)]
    .map(([link]) => link)
    .filter((link) => link.includes('rel="stylesheet"'))
    .map((link) => /\bhref="([^"]+)"/u.exec(link)?.[1] ?? '');
  const files = await Promise.all(
    hrefs.map((href) =>
      readFile(path.join(built?.out ?? '', 'client', href), 'utf8'),
    ),
  );
  return files.join('\n');
};

describe('the HTML of a page rendering an .mdx module that imports CSS', () => {
  it('links the stylesheet of one the page imports', async () => {
    expect(await stylesOf('/')).toContain('[data-note]');
  });

  it('links the stylesheet of one read late, through a glob, with no query on it', async () => {
    expect(await stylesOf('/lazy')).toContain('[data-aside]');
  });

  it('keeps a page to the stylesheets of the .mdx it renders', async () => {
    expect(await stylesOf('/')).not.toContain('[data-aside]');
  });
});
