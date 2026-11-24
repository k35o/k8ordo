import { readFile } from 'node:fs/promises';

import { expect, it } from 'vite-plus/test';

import { CSS_TARGET } from '../../css-target';

it("names, in the guide's CSS target samples, the browsers the styles are built for", async () => {
  const guide = await readFile(
    new URL('../../docs/GUIDE.md', import.meta.url),
    'utf8',
  );
  const named = [
    ...guide.matchAll(/\b(chrome|edge|firefox|safari)(?: >= |: )?(\d+)\b/gu),
  ].map(([, browser = '', major = '']) => `${browser}${major}`);

  expect(new Set(named)).toStrictEqual(new Set(CSS_TARGET));
});
