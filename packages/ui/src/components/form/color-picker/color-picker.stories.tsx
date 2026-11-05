import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { ActionForm, fill } from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';
import { ColorPicker } from './color-picker';

import styles from './color-picker.stories.module.css';

const SWATCHES = [
  { value: '#0d9488', label: 'ティール' },
  { value: '#2563eb', label: '青' },
  { value: '#f97316', label: 'オレンジ' },
  { value: '#e11d48', label: 'ローズ' },
  { value: '#171717', label: '黒' },
];

const meta: Meta<typeof ColorPicker> = {
  title: 'components/form/color-picker',
  component: ColorPicker,
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-label': 'テーマの色',
    defaultValue: '#0d9488',
    swatches: SWATCHES,
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

// range の矢印キーは testing-library の userEvent が扱わないので、値を置いて
// input を出す（ブラウザがつまみを動かしたときと同じ道）
const slide = (input: HTMLElement, value: number) => {
  fireEvent.input(input, { target: { value: String(value) } });
};

export const Default: Story = {
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    await expect(input).toHaveValue('#0d9488');
    await expect(canvas.getByRole('slider', { name: '色相' })).toHaveValue(
      '175',
    );
    await expect(canvas.getByRole('slider', { name: '彩度' })).toHaveValue(
      '84',
    );
    await expect(canvas.getByRole('slider', { name: '明度' })).toHaveValue(
      '32',
    );
    await expect(
      canvas.getByRole('button', { name: 'ティール' }),
    ).toHaveAttribute('aria-pressed', 'true');

    const orange = canvas.getByRole('button', { name: 'オレンジ' });
    await userEvent.click(orange);

    await expect(input).toHaveValue('#f97316');
    await expect(orange).toHaveAttribute('aria-pressed', 'true');
    await expect(
      canvas.getByRole('button', { name: 'ティール' }),
    ).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onChange).toHaveBeenCalledWith('#f97316');
  },
};

export const Sliders: Story = {
  args: { onChange: fn(), swatches: [] },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    const hue = canvas.getByRole('slider', { name: '色相' });
    const saturation = canvas.getByRole('slider', { name: '彩度' });

    slide(hue, 0);
    await expect(input).toHaveValue('#960d0d');
    await expect(hue).toHaveAttribute('aria-valuetext', '0°');
    await expect(args.onChange).toHaveBeenLastCalledWith('#960d0d');

    // 灰色まで下げても色相は残り、彩度を戻すと元の色相に戻る
    slide(saturation, 0);
    await expect(input).toHaveValue('#525252');
    await expect(hue).toHaveValue('0');
    slide(hue, 240);
    await expect(input).toHaveValue('#525252');
    slide(saturation, 84);
    await expect(input).toHaveValue('#0d0d96');
  },
};

// ブラウザの色選びは開いたまま動かせないので、選んだときと同じく値を置いて
// input を出す（ドラッグのあいだも input が続けて飛ぶ）
const pick = (input: HTMLElement, value: string) => {
  fireEvent.input(input, { target: { value } });
};

// 欄の横の色を押すとブラウザの色選びが開き、選んだ色はつまみと同じ道で欄に入る
export const NativePicker: Story = {
  args: { onChange: fn(), swatches: [] },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    const native = canvas.getByLabelText('パレットから選ぶ');
    await expect(native).toHaveAccessibleName('パレットから選ぶ');
    await expect(native).toHaveAttribute('type', 'color');
    await expect(native).toHaveValue('#0d9488');
    // 欄の値だけが送られる
    await expect(native).not.toHaveAttribute('name');

    pick(native, '#2563eb');
    await expect(input).toHaveValue('#2563eb');
    await expect(args.onChange).toHaveBeenLastCalledWith('#2563eb');
    await expect(canvas.getByRole('slider', { name: '色相' })).toHaveValue(
      '221',
    );

    // つまみで動かした色も、次に開いたときの色になる
    slide(canvas.getByRole('slider', { name: '色相' }), 0);
    await expect(input).toHaveValue('#eb2424');
    await expect(native).toHaveValue('#eb2424');
  },
};

export const Typing: Story = {
  args: { onChange: fn(), swatches: [] },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    const hue = canvas.getByRole('slider', { name: '色相' });

    await userEvent.clear(input);
    // 空にしたことは知らせる
    await expect(args.onChange).toHaveBeenLastCalledWith('');

    // 打ちかけのあいだは知らせず、つまみも動かない。途中の 3 桁（`256`）も色と取らない
    await userEvent.type(input, '2563');
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(hue).toHaveValue('175');
    await userEvent.type(input, 'EB');
    await expect(args.onChange).toHaveBeenLastCalledWith('#2563eb');
    await expect(hue).toHaveValue('221');

    // 離れると #rrggbb にそろえる
    await userEvent.tab();
    await expect(input).toHaveValue('#2563eb');

    // 3 桁の省略形は離れるときに広げる
    await userEvent.clear(input);
    await userEvent.type(input, 'f80');
    await userEvent.tab();
    await expect(input).toHaveValue('#ff8800');
    await expect(args.onChange).toHaveBeenLastCalledWith('#ff8800');
  },
};

const ControlledPicker = () => {
  const [color, setColor] = useState('#e11d48');
  return (
    <div className={styles.column}>
      <ColorPicker
        aria-label="テーマの色"
        onChange={setColor}
        swatches={SWATCHES}
        value={color}
      />
      <p className={styles.selection}>選んだ色: {color || '（なし）'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPicker />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    await userEvent.click(canvas.getByRole('button', { name: '青' }));
    await expect(canvas.getByText('選んだ色: #2563eb')).toBeInTheDocument();
    await expect(input).toHaveValue('#2563eb');

    await userEvent.clear(input);
    await expect(canvas.getByText('選んだ色: （なし）')).toBeInTheDocument();
    await userEvent.type(input, 'F97316');
    await expect(canvas.getByText('選んだ色: #f97316')).toBeInTheDocument();
    // 打った文字は離れるまでそのまま
    await expect(input).toHaveValue('F97316');
    await userEvent.tab();
    await expect(input).toHaveValue('#f97316');
  },
};

export const Empty: Story = {
  args: { defaultValue: undefined },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toHaveValue('');
    await expect(
      canvas
        .getAllByRole('button')
        .filter((swatch) => swatch.getAttribute('aria-pressed') !== 'false'),
    ).toHaveLength(0);
    // 色が無いあいだは、つまみの位置（灰色）からブラウザの色選びを開く
    await expect(canvas.getByLabelText('パレットから選ぶ')).toHaveValue(
      '#808080',
    );
  },
};

// 欄の横の色も含め、色を変える操作はどれも押せない。無効な color の input は
// ブラウザの色選びを開かない
const changers = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLInputElement | HTMLButtonElement>(
    'input[type="range"], input[type="color"], button',
  ),
];

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toBeDisabled();
    const controls = changers(canvasElement);
    // 3 本のつまみ・欄の横の色・5 つの見本
    await expect(controls).toHaveLength(9);
    await expect(controls.filter((control) => !control.disabled)).toHaveLength(
      0,
    );
  },
};

// 読み取り専用でも欄は読めてフォーカスも受けるが、色を変える操作は押せない
export const ReadOnly: Story = {
  args: { readOnly: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toHaveAttribute('readonly');
    await expect(
      changers(canvasElement).filter((control) => !control.disabled),
    ).toHaveLength(0);
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toHaveAttribute('aria-invalid', 'true');
  },
};

const theme = z.object({
  accent: z
    .string()
    .regex(/^#[0-9a-f]{6}$/u, '色を #rrggbb で入力してください'),
});
const themeFields = formFields(theme);
const received = fn();

const ThemeForm = () => (
  <ActionForm
    fields={themeFields}
    onReceive={received}
    serve={(data) => parseForm(theme, data)}
  >
    {(form) => {
      const accent = form.field('accent');
      return (
        <FormControl
          errorText={accent.error}
          invalid={accent.invalid}
          label="テーマの色"
          renderInput={(props) => (
            <ColorPicker
              {...props}
              {...accent.input}
              defaultValue={accent.input.defaultValue ?? '#0d9488'}
              swatches={SWATCHES}
            />
          )}
          required={accent.required}
        />
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <ThemeForm />,
  play: async ({ canvas, userEvent }) => {
    const field = () =>
      canvas.getByLabelText<HTMLInputElement>('テーマの色', { exact: false });
    const reset = () =>
      userEvent.click(canvas.getByRole('button', { name: 'リセット' }));

    // 導かれた属性を、type を抜かずにそのまま受ける
    await expect(field()).toHaveAttribute('name', 'accent');
    await expect(field()).toHaveAttribute('type', 'text');
    await expect(field()).toHaveAttribute('pattern');
    await expect(field()).toBeRequired();

    // 見本を押すと値が欄に入り、フォームは変更として受け取る
    await userEvent.click(canvas.getByRole('button', { name: 'オレンジ' }));
    await expect(field()).toHaveValue('#f97316');
    await expect(await canvas.findByText('変更あり')).toBeVisible();

    // reset で描画時の色に戻り、つまみと見本も追いつく
    await reset();
    await waitFor(() => expect(field()).toHaveValue('#0d9488'));
    await expect(await canvas.findByText('変更なし')).toBeVisible();
    await waitFor(() =>
      expect(canvas.getByRole('slider', { name: '色相' })).toHaveValue('175'),
    );
    await expect(
      canvas.getByRole('button', { name: 'ティール' }),
    ).toHaveAttribute('aria-pressed', 'true');

    // つまみを動かしてもフォームに届く
    slide(canvas.getByRole('slider', { name: '色相' }), 0);
    await expect(field()).toHaveValue('#960d0d');
    await expect(await canvas.findByText('変更あり')).toBeVisible();

    // ブラウザの色選びで選んだ色はフォームに届き、送られるのは欄の値だけ
    await reset();
    await expect(await canvas.findByText('変更なし')).toBeVisible();
    pick(canvas.getByLabelText('パレットから選ぶ'), '#2563eb');
    await expect(field()).toHaveValue('#2563eb');
    await expect(await canvas.findByText('変更あり')).toBeVisible();
    await expect([...new FormData(field().form ?? undefined)]).toStrictEqual([
      ['accent', '#2563eb'],
    ]);

    // 色でないまま離れると zod の文言を出す
    await fill(userEvent, field(), '#12');
    await userEvent.tab();
    await expect(
      await canvas.findByText('色を #rrggbb で入力してください'),
    ).toBeVisible();

    // 大文字や # なしで打っても、Enter で送る前に #rrggbb にそろえて届く
    await fill(userEvent, field(), 'F97316{Enter}');
    await waitFor(() =>
      expect(received).toHaveBeenLastCalledWith({ accent: '#f97316' }),
    );
  },
};
