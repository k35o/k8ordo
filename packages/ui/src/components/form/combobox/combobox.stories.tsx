import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import type { Option } from '../../../types/variables';
import { Combobox } from './combobox';
import type { ComboboxSearch } from './combobox';

const PREFECTURES: readonly Option[] = [
  { value: 'hokkaido', label: '北海道' },
  { value: 'tokyo', label: '東京都' },
  { value: 'kanagawa', label: '神奈川県' },
  { value: 'aichi', label: '愛知県' },
  { value: 'kyoto', label: '京都府' },
  { value: 'osaka', label: '大阪府' },
  { value: 'fukuoka', label: '福岡県' },
];

const CITIES: readonly Option[] = [
  { value: 'sapporo', label: 'Sapporo' },
  { value: 'sendai', label: 'Sendai' },
  { value: 'saitama', label: 'Saitama' },
  { value: 'kawasaki', label: 'Kawasaki' },
  { value: 'kanazawa', label: 'Kanazawa' },
  { value: 'kagoshima', label: 'Kagoshima' },
];

const meta: Meta<typeof Combobox> = {
  title: 'components/form/combobox',
  component: Combobox,
  decorators: [
    (Story) => (
      <div className="w-80 p-6 block-96">
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-label': '都道府県',
    options: PREFECTURES,
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });
    await userEvent.type(input, '京');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    // 表示名の一部で絞り込む
    const options = canvas.getAllByRole('option');
    await expect(options.map((option) => option.textContent)).toStrictEqual([
      '東京都',
      '京都府',
    ]);

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      options[1]?.id,
    );
    await userEvent.keyboard('{Enter}');

    await expect(args.onChange).toHaveBeenCalledWith('kyoto');
    await expect(input).toHaveValue('京都府');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Keyboard: Story = {
  args: { defaultValue: 'aichi' },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });
    await expect(input).toHaveValue('愛知県');

    // 開くと、いま選んでいる候補から始まる
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('option', { name: '愛知県' }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: '愛知県' }).id,
    );

    // Escape は一覧を閉じ、もう一度押すと打ちかけの文字を戻す
    await userEvent.type(input, 'x');
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('愛知県x');
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('愛知県');

    // Alt+↓ は候補に入らずに開くだけ
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).not.toHaveAttribute('aria-activedescendant');
  },
};

// 日本語入力の変換を確定する Enter で、候補を選ばない
export const Composition: Story = {
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });
    await userEvent.type(input, '京');
    await userEvent.keyboard('{ArrowDown}');

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
        isComposing: true,
      }),
    );

    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
  },
};

// 打ちかけで離れたら選んだ候補の表示名に戻し、空にして離れたら選択を外す
export const Blur: Story = {
  args: { defaultValue: 'osaka', onChange: fn() },
  decorators: [
    (Story) => (
      <>
        <Story />
        <button type="button">次へ</button>
      </>
    ),
  ],
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });

    await userEvent.type(input, '福');
    await userEvent.tab();
    await expect(input).toHaveValue('大阪府');
    await expect(args.onChange).not.toHaveBeenCalled();

    await userEvent.clear(input);
    await userEvent.tab();
    await expect(input).toHaveValue('');
    await expect(args.onChange).toHaveBeenCalledWith('');
  },
};

export const Mouse: Story = {
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });
    await userEvent.click(canvas.getByRole('button', { name: '候補を開く' }));
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveFocus();

    await userEvent.click(canvas.getByRole('option', { name: '福岡県' }));

    await expect(args.onChange).toHaveBeenCalledWith('fukuoka');
    await expect(input).toHaveValue('福岡県');
    await expect(input).toHaveFocus();
  },
};

const searched: Array<{ query: string; signal: AbortSignal }> = [];

const searchCities: ComboboxSearch = async (query, { signal }) => {
  searched.push({ query, signal });
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  return CITIES.filter((city) =>
    city.label.toLowerCase().startsWith(query.toLowerCase()),
  );
};

export const AsyncSearch: Story = {
  args: {
    'aria-label': '都市',
    options: [],
    search: searchCities,
    onChange: fn(),
  },
  beforeEach: () => {
    searched.length = 0;
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都市' });
    await userEvent.type(input, 'ka');

    // 打ち直すたびに前の問い合わせを打ち切る
    await expect(searched.map((call) => call.query)).toStrictEqual(['k', 'ka']);
    await expect(searched[0]?.signal.aborted).toBe(true);
    await expect(searched[1]?.signal.aborted).toBe(false);

    await waitFor(async () => {
      await expect(
        canvas.getAllByRole('option').map((option) => option.textContent),
      ).toStrictEqual(['Kawasaki', 'Kanazawa', 'Kagoshima']);
    });
    await expect(canvas.getByRole('listbox')).not.toHaveAttribute('aria-busy');

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('kanazawa');
    // 次の検索で一覧から消えても、選んだ候補の表示名を見せ続ける
    await expect(input).toHaveValue('Kanazawa');
  },
};

export const SearchFailed: Story = {
  args: {
    'aria-label': '都市',
    options: [],
    search: () => Promise.reject(new Error('offline')),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox', { name: '都市' }), 'sa');

    await expect(await canvas.findByRole('status')).toHaveTextContent(
      '候補を読み込めませんでした',
    );
  },
};

const ControlledCombobox = () => {
  const [prefecture, setPrefecture] = useState('tokyo');
  return (
    <div className="flex flex-col gap-3">
      <Combobox
        aria-label="都道府県"
        onChange={setPrefecture}
        options={PREFECTURES}
        value={prefecture}
      />
      <p className="text-sm">選んだ値: {prefecture || '（なし）'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledCombobox />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都道府県' });
    await expect(input).toHaveValue('東京都');

    await userEvent.clear(input);
    await userEvent.type(input, '北');
    await userEvent.keyboard('{ArrowDown}{Enter}');

    await expect(canvas.getByText('選んだ値: hokkaido')).toBeInTheDocument();
    await expect(input).toHaveValue('北海道');
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'kyoto', disabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: '都道府県' }),
    ).toBeDisabled();
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: '都道府県' }),
    ).toHaveAttribute('aria-invalid', 'true');
  },
};
