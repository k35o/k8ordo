import { defineLocales } from '@k8ordo/i18n';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { definitions, inEnglish } from '../../../../.storybook/locales';
import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'components/form/calendar',
  component: Calendar,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  // 月名・曜日名は組み込みの文言と同じロケールで書く。テストの文言を固定するため英語で描く
  beforeEach: inEnglish,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Storybook は現在時刻を 2023-01-02 に固定している
export const Default: Story = {
  args: {
    defaultValue: '2023-01-15',
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('grid', { name: 'January 2023' }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('gridcell', { selected: true }),
    ).toHaveTextContent('15');
    await expect(
      canvas.getByRole('button', { name: 'Monday, January 2, 2023' }),
    ).toHaveAttribute('aria-current', 'date');
    await expect(
      canvas.getAllByRole('columnheader').map((cell) => cell.textContent),
    ).toStrictEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  },
};

export const SelectsTheClickedDay: Story = {
  args: {
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Friday, January 20, 2023' }),
    );

    await expect(args.onChange).toHaveBeenCalledWith('2023-01-20');
    await expect(
      canvas.getByRole('gridcell', { selected: true }),
    ).toHaveTextContent('20');
  },
};

export const MovesByKeyboard: Story = {
  args: {
    defaultValue: '2023-01-31',
  },
  play: async ({ canvas, userEvent }) => {
    const start = await canvas.findByRole('button', {
      name: 'Tuesday, January 31, 2023',
    });
    start.focus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(
      canvas.getByRole('grid', { name: 'February 2023' }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Wednesday, February 1, 2023' }),
    ).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('button', { name: 'Wednesday, February 8, 2023' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(
      canvas.getByRole('button', { name: 'Sunday, February 5, 2023' }),
    ).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(
      canvas.getByRole('button', { name: 'Saturday, February 11, 2023' }),
    ).toHaveFocus();

    // 月を送っても日は繰り越さない（2 月 11 日 → 3 月 11 日）
    await userEvent.keyboard('{PageDown}');
    await expect(
      canvas.getByRole('button', { name: 'Saturday, March 11, 2023' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    await expect(
      canvas.getByRole('button', { name: 'Friday, March 11, 2022' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('gridcell', { selected: true }),
    ).toHaveTextContent('11');
  },
};

export const MonthButtonsKeepFocus: Story = {
  args: {
    defaultValue: '2023-01-15',
  },
  play: async ({ canvas, userEvent }) => {
    const next = await canvas.findByRole('button', { name: 'Next month' });
    await userEvent.click(next);

    await expect(
      canvas.getByRole('grid', { name: 'February 2023' }),
    ).toBeInTheDocument();
    await expect(next).toHaveFocus();
    // 別の月にいても、Tab で戻れるのは 1 日だけ（15 日のまま）
    await expect(
      canvas.getByRole('button', { name: 'Wednesday, February 15, 2023' }),
    ).toHaveAttribute('tabindex', '0');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Previous month' }),
    );
    await expect(
      canvas.getByRole('grid', { name: 'January 2023' }),
    ).toBeInTheDocument();
  },
};

// 月によって週の数（4〜6 行）が違っても、高さは変えない。ポップオーバーの
// 下の縁が月送りのたびに跳ねないようにするため
export const KeepsItsHeightAcrossMonths: Story = {
  args: {
    // 2023 年 1 月は 5 週、2023 年 4 月は 6 週にまたがる
    defaultValue: '2023-01-15',
  },
  play: async ({ canvas, userEvent }) => {
    const grid = await canvas.findByRole('grid', { name: 'January 2023' });
    const heightOf = () => grid.getBoundingClientRect().height;
    const january = heightOf();

    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await expect(
      canvas.getByRole('grid', { name: 'April 2023' }),
    ).toBeInTheDocument();
    await expect(heightOf()).toBe(january);
  },
};

export const WithMinAndMax: Story = {
  args: {
    defaultValue: '2023-01-10',
    min: '2023-01-05',
    max: '2023-01-20',
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const before = await canvas.findByRole('button', {
      name: 'Wednesday, January 4, 2023',
    });
    await expect(before).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(before);
    await expect(args.onChange).not.toHaveBeenCalled();

    // 範囲の外の月へは送れない
    await expect(
      canvas.getByRole('button', { name: 'Previous month' }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Next month' }),
    ).toBeDisabled();

    // キーボードで範囲の外へ出ようとしても端で止まる
    canvas.getByRole('button', { name: 'Tuesday, January 10, 2023' }).focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(
      canvas.getByRole('button', { name: 'Friday, January 20, 2023' }),
    ).toHaveFocus();
  },
};

export const WeekStartFollowsTheLocale: Story = {
  beforeEach: () => {
    defineLocales({ 'en-GB': { timeZone: 'Europe/London', dir: 'ltr' } });
    return () => {
      defineLocales(definitions);
    };
  },
  play: async ({ canvas }) => {
    const grid = await canvas.findByRole('grid');

    await expect(
      within(grid)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toStrictEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  },
};

const ControlledRender = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <Calendar onChange={setValue} value={value} />
      <p data-testid="value">{value ?? '未選択'}</p>
      <button
        onClick={() => {
          setValue('2023-06-10');
        }}
        type="button"
      >
        6 月 10 日にする
      </button>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas, userEvent }) => {
    await expect(
      await canvas.findByRole('grid', { name: 'January 2023' }),
    ).toBeInTheDocument();
    await expect(
      canvas.queryByRole('gridcell', { selected: true }),
    ).not.toBeInTheDocument();

    // 外から選択を変えると、その日のある月を開く
    await userEvent.click(
      canvas.getByRole('button', { name: '6 月 10 日にする' }),
    );
    await waitFor(async () => {
      await expect(
        canvas.getByRole('grid', { name: 'June 2023' }),
      ).toBeInTheDocument();
    });
    await expect(
      canvas.getByRole('gridcell', { selected: true }),
    ).toHaveTextContent('10');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Thursday, June 1, 2023' }),
    );
    await expect(canvas.getByTestId('value')).toHaveTextContent('2023-06-01');
  },
};
