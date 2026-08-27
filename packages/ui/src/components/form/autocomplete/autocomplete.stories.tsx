import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, waitFor } from 'storybook/test';

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
      'autocomplete-filter_option_16',
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
      'autocomplete-active_option_2',
    );

    await userEvent.keyboard('{ArrowDown}');

    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      'autocomplete-active_option_8',
    );
    await expect(canvas.getByRole('option', { name: '8進数' })).toHaveAttribute(
      'id',
      'autocomplete-active_option_8',
    );
  },
};
