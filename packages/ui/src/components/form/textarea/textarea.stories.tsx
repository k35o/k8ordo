import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';

import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'components/form/textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    id: 'textarea',
    'aria-describedby': 'textarea-feedback',
  },
  parameters: {
    a11y: {
      options: {
        rules: {
          // TextArea単体ではラベルを付随しない
          label: { enabled: false },
          'label-title-only': { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
};

export const FullHeight: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    fullHeight: true,
  },
};

export const AutoResize: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    autoResize: true,
  },
};

export const Rows: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    rows: 10,
  },
};

export const Placeholder = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
    placeholder: '10進数',
  },
};

export const Invalid: Story = {
  args: {
    disabled: false,
    invalid: true,
    required: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    invalid: false,
    required: false,
  },
};

const AutoResizeWithRefRender = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('1行だけ');

  return (
    <div className="flex flex-col items-start gap-2">
      <Textarea
        autoResize
        id="textarea-ref"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        ref={ref}
        value={value}
      />
      <button
        onClick={() => {
          setValue('1\n2\n3\n4\n5\n6\n7\n8');
        }}
        type="button"
      >
        expand
      </button>
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

// 利用者の ref が内部 ref を上書きすると value 変更時の自動リサイズが死ぬ
export const AutoResizeWithRef: Story = {
  render: () => <AutoResizeWithRefRender />,
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox');
    const initialHeight = textarea.clientHeight;

    await userEvent.click(canvas.getByRole('button', { name: 'expand' }));

    await waitFor(async () => {
      await expect(textarea.clientHeight).toBeGreaterThan(initialHeight);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'focus' }));

    await expect(textarea).toHaveFocus();
  },
};
