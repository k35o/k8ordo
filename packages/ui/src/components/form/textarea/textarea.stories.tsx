import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { z } from 'zod';

import { ActionForm, fill } from '../../../../.storybook/action-form';
import { Button } from '../../buttons/button';
import { Popover } from '../../overlays/popover';
import { FormControl } from '../form-control';
import { Textarea } from './textarea';

import styles from './textarea.stories.module.css';

const meta: Meta<typeof Textarea> = {
  title: 'components/form/textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  args: {
    id: 'textarea',
    'aria-label': '本文',
    'aria-describedby': 'textarea-feedback',
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

// キー入力を止めないので、Popover の中でも Escape で Popover が閉じる
export const EscapeInPopover: Story = {
  render: (args) => (
    <Popover.Root role="dialog">
      <Popover.Trigger
        renderItem={(props) => (
          <Button {...props} size="md" type="button">
            メモ
          </Button>
        )}
      />
      <Popover.Content
        renderItem={(props) => (
          <div aria-label="メモ" className={styles.panel} {...props}>
            <Textarea {...args} />
          </div>
        )}
      />
    </Popover.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'メモ' });
    await userEvent.click(trigger);
    const field = await canvas.findByRole('textbox', { name: '本文' });
    await waitFor(() => {
      expect(field).toHaveFocus();
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
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
    <div className={styles.column}>
      <Textarea
        aria-label="本文"
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

const introduction = z.object({
  bio: z
    .string()
    .min(1, '自己紹介を入力してください')
    .regex(/^[^<>]*$/u, '山括弧は使えません'),
});
const introductionFields = formFields(introduction);

const IntroductionForm = () => (
  <ActionForm
    fields={introductionFields}
    serve={(data) => parseForm(introduction, data)}
  >
    {(form) => {
      const bio = form.field('bio');
      return (
        <FormControl
          errorText={bio.error}
          invalid={bio.invalid}
          label="自己紹介"
          renderInput={(props) => <Textarea {...props} {...bio.input} />}
          required={bio.required}
        />
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <IntroductionForm />,
  play: async ({ canvas, userEvent }) => {
    const bio = () => canvas.getByLabelText('自己紹介', { exact: false });

    // <textarea> に無い type 属性を描かない
    await expect(bio()).not.toHaveAttribute('type');

    // 空のまま離れると zod の文言を出す
    await userEvent.click(bio());
    await userEvent.tab();
    await expect(
      await canvas.findByText('自己紹介を入力してください'),
    ).toBeVisible();

    // 正規表現はサーバーで検査され、失敗しても入力を描き直す
    await fill(userEvent, bio(), '<b>やあ</b>');
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(await canvas.findByText('山括弧は使えません')).toBeVisible();
    await expect(bio()).toHaveValue('<b>やあ</b>');
  },
};
