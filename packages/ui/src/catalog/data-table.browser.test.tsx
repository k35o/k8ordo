import { defineLocales } from '@k8ordo/i18n';
import { expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';

import { registerMessages } from '../i18n/current';
import { en } from '../i18n/en';
import { renderers } from './render';

defineLocales({ sv: { timeZone: 'Europe/Stockholm', dir: 'ltr' } });
registerMessages('sv', en);

it('DataTable は、閲覧者の言語（en-US なら ä は a の隣）ではなく、アプリの言語（sv なら ä は z の後）で並べ替える', async () => {
  await render(
    renderers.DataTable({
      props: {
        label: '名前の一覧',
        columns: [{ label: '名前', sortable: true }],
        rows: [['z'], ['ä'], ['a']],
      },
      children: [],
    }),
  );

  await page.getByRole('button', { name: '名前' }).click();

  await expect
    .poll(() =>
      page
        .getByRole('rowheader')
        .elements()
        .map((cell) => cell.textContent),
    )
    .toStrictEqual(['a', 'z', 'ä']);
});
