import type { ReactNode } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import { TextField } from '../form/text-field';

import '../../styles/index.css';

// 輪のトークンを、getComputedStyle が返す形に解決する。値は書き写さない
const ringShadow = () => {
  const probe = document.createElement('div');
  probe.style.boxShadow = 'var(--shadow-ring-info)';
  document.body.append(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  if (boxShadow === 'none') {
    throw new Error('輪のトークンが読み込まれていない');
  }
  return boxShadow;
};

const FIELDS: Array<[name: string, render: () => ReactNode]> = [
  [
    'type="date" の TextField',
    () => <TextField aria-label="対象" type="date" />,
  ],
  [
    'type="time" の TextField',
    () => <TextField aria-label="対象" type="time" />,
  ],
  [
    'type="datetime-local" の TextField',
    () => <TextField aria-label="対象" type="datetime-local" />,
  ],
];

// 日付や時刻の欄では、フォーカスを持つのは欄の中のパーツ（年、月、日など）になる
describe('日付や時刻の欄のフォーカスの輪', () => {
  it.each(FIELDS)(
    '%s は、キーボードでフォーカスを移すと輪が出る',
    async (_name, renderField) => {
      await render(
        <>
          <TextField aria-label="手前の欄" />
          {renderField()}
        </>,
      );
      const field = page.getByLabelText('対象');

      await userEvent.click(page.getByLabelText('手前の欄'));
      await userEvent.tab();

      await expect.element(field).toHaveFocus();
      expect(getComputedStyle(field.element()).boxShadow).toBe(ringShadow());
    },
  );
});
