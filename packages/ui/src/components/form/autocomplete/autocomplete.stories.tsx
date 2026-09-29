import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps, FC } from 'react';
import { useFormStatus } from 'react-dom';
import { expect, fireEvent, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/focus';
import { Autocomplete } from './autocomplete';

const AutocompleteRender = ({
  id,
  'aria-describedby': describedBy,
  invalid,
  disabled,
  required,
}: ComponentProps<typeof Autocomplete>) => {
  const options = [
    { value: '2', label: '2進数' },
    { value: '8', label: '8進数' },
    { value: '10', label: '10進数' },
    { value: '16', label: '16進数' },
  ];
  const [value, setValue] = useState<string[]>([]);

  return (
    <Autocomplete
      aria-describedby={describedBy}
      id={id}
      disabled={disabled}
      invalid={invalid}
      required={required}
      onChange={setValue}
      options={options}
      value={value}
    />
  );
};

const meta: Meta<typeof Autocomplete> = {
  title: 'components/form/autocomplete',
  component: Autocomplete,
  render: (props) => <AutocompleteRender {...props} />,
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {
  args: {
    id: 'autocomplete',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
};

export const Invalid: Story = {
  args: {
    id: 'autocomplete',
    'aria-describedby': undefined,
    invalid: true,
    disabled: false,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'autocomplete',
    'aria-describedby': undefined,
    invalid: false,
    disabled: true,
    required: true,
  },
};

// 回帰: チップ行が min-w-0 で縮まないと「すべて削除」が枠外へ押し出される
export const NarrowContainer: Story = {
  render: () => (
    <Autocomplete
      defaultValue={['chrome']}
      id="autocomplete-narrow"
      options={[
        { value: 'chrome', label: 'Chrome for Developers' },
        { value: 'web-dev', label: 'web.dev' },
        { value: 'mdn', label: 'MDN Web Docs' },
      ]}
    />
  ),
  decorators: [
    (Story) => (
      <div className="w-56" data-testid="narrow-container">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector(
      '[data-testid="narrow-container"]',
    );
    // decorator の唯一の子が Autocomplete のルート（枠）
    const box = container?.firstElementChild;
    const clearAll = canvasElement.querySelector('[aria-label="すべて削除"]');
    if (!(box instanceof HTMLElement) || !(clearAll instanceof HTMLElement)) {
      throw new Error('要素が見つかりません');
    }
    await expect(clearAll.getBoundingClientRect().right).toBeLessThanOrEqual(
      box.getBoundingClientRect().right + 1,
    );
  },
};

// 回帰: 矢印キーの clamp が全 options 基準だと、絞り込みで候補が減ったとき
// selectIndex が実在しない行を指して Enter が無反応になる
export const FilteredKeyboardSelection: Story = {
  args: {
    id: 'autocomplete-filter',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, '1');
    await canvas.findByRole('listbox');
    await waitFor(async () => {
      await expect(canvas.getAllByRole('option')).toHaveLength(2);
    });

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: '16進数' }).id,
    );

    await userEvent.keyboard('{Enter}');

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(input).toHaveValue('');
    await expect(canvas.getByText('16進数')).toBeInTheDocument();
  },
};

export const EscapeCloses: Story = {
  args: {
    id: 'autocomplete-escape',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await canvas.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(input).not.toHaveAttribute('aria-activedescendant');
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <Autocomplete
        id="autocomplete-ref"
        options={[
          { value: '2', label: '2進数' },
          { value: '10', label: '10進数' },
        ]}
        ref={ref}
      />
      <p data-testid="outside">枠外</p>
      <button
        onClick={() => {
          ref.current?.focus();
        }}
        type="button"
      >
        focus
      </button>
    </div>
  );
};

// ref は combobox の input に届く。外枠は内部 ref のまま（clickaway が生きている）
export const ForwardsRef: Story = {
  render: () => <RefRender />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    await canvas.findByRole('listbox');

    await userEvent.click(canvas.getByTestId('outside'));

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    // 外枠は内部 ref のまま anchor-name を受け取る
    await expect(
      canvasElement.querySelector('[style*="anchor-name"]'),
    ).not.toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'focus' }));

    await expect(canvas.getByRole('combobox')).toHaveFocus();
  },
};

export const ActiveDescendant: Story = {
  args: {
    id: 'autocomplete-active',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');

    await expect(input).not.toHaveAttribute('aria-activedescendant');

    await userEvent.click(input);
    await canvas.findByRole('listbox');

    await expect(input).not.toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: '2進数' }).id,
    );

    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: '8進数' }).id,
    );
  },
};

// 日本語を変換しているあいだの矢印キーと Enter は IME のもの。一覧の中を
// 動かさず、ポインタを載せた候補も選ばない
export const Composition: Story = {
  args: {
    id: 'autocomplete-composition',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, '1');
    await waitFor(async () => {
      await expect(canvas.getAllByRole('option')).toHaveLength(2);
    });
    const hovered = canvas.getByRole('option', { name: '10進数' });
    await userEvent.hover(hovered);
    await waitFor(async () => {
      await expect(input).toHaveAttribute('aria-activedescendant', hovered.id);
    });

    await fireEvent.keyDown(input, { key: 'ArrowDown', isComposing: true });
    await fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    await expect(input).toHaveAttribute('aria-activedescendant', hovered.id);
    await expect(canvas.getByRole('listbox')).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'すべて削除' }),
    ).not.toBeInTheDocument();
  },
};

// 矢印キーは一覧の中を動かすもので、打った文字の中のキャレットは動かさない。
// キャレットを行頭・行末へ送るのはキーの既定の動作なので、それを止めているかを見る
export const ArrowKeysKeepTheCaret: Story = {
  args: {
    id: 'autocomplete-caret',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, '進数');
    const prevented: boolean[] = [];
    const record = (event: KeyboardEvent) => {
      prevented.push(event.defaultPrevented);
    };

    window.addEventListener('keydown', record);
    try {
      await userEvent.keyboard('{ArrowDown}{ArrowUp}');
    } finally {
      window.removeEventListener('keydown', record);
    }

    await expect(prevented).toStrictEqual([true, true]);
  },
};

// 候補の id は値から作らない。id は空白を含められず、空白で区切って読む
// 支援技術には、aria-activedescendant の指す候補が見つからない
export const ValuesWithSpaces: Story = {
  render: () => (
    <Autocomplete
      aria-label="都市"
      id="autocomplete-spaces"
      options={[
        { value: 'new york', label: 'New York' },
        { value: 'los angeles', label: 'Los Angeles' },
      ]}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '都市' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    const option = canvas.getByRole('option', { name: 'New York' });
    await expect(option.id).not.toMatch(/\s/u);
    await expect(input).toHaveAttribute('aria-activedescendant', option.id);

    // 候補を押すと、欄を離れた扱いで一覧が閉じる前に選べる
    await userEvent.click(canvas.getByRole('option', { name: 'Los Angeles' }));

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(canvas.getByText('Los Angeles')).toBeInTheDocument();
  },
};

// 返した Promise は play が finishPending を呼ぶまで解決しない。終わらない
// action のままにすると、React が後から始まる action を同じ送信中として束ね、
// 以降のストーリーの action も完了しなくなるので、見終わったら終わらせる
let finishPending = (): void => {};

const PendingNote: FC = () => {
  const { pending } = useFormStatus();
  return pending ? <p>送信中</p> : null;
};

const PendingRender: FC = () => (
  <form
    action={async () => {
      await new Promise<void>((resolve) => {
        finishPending = resolve;
      });
    }}
  >
    <Autocomplete
      aria-label="基数"
      defaultValue={['2']}
      id="autocomplete-pending"
      name="radix"
      options={[
        { value: '2', label: '2進数' },
        { value: '8', label: '8進数' },
      ]}
    />
    <PendingNote />
  </form>
);

// 送信中も欄はフォーカスを持ち続け、値は変えさせない。Enter で送ると
// 欄にフォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  render: () => <PendingRender />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('combobox', {
      name: '基数',
    });

    try {
      input.focus();
      input.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(input).toHaveFocus();
      await expect(input).toHaveAttribute('readonly');

      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await userEvent.keyboard('{Backspace}');
      await expect(canvas.getByText('2進数')).toBeInTheDocument();
      await expect(
        canvas.getByRole('button', { name: 'タグを削除' }),
      ).toBeDisabled();
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(input).not.toHaveAttribute('readonly');
    });
  },
};

// 縦書きの中で開くと、候補リストの幅を trigger の高さに合わせる。
export const VerticalWritingMode: Story = {
  args: {
    id: 'autocomplete',
    'aria-describedby': undefined,
    invalid: false,
    disabled: false,
    required: false,
  },
  parameters: { vrt: { skip: true } },
  decorators: [
    (Story) => (
      <div className="writing-v h-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), '1');
    const listbox = await canvas.findByRole('listbox');
    await waitFor(() => {
      expect(listbox.parentElement?.style.inlineSize).toBe(
        'anchor-size(height)',
      );
    });
  },
};
