import type { ComponentProps } from 'react';
import { z } from 'zod';

import type { Button } from '../../components/buttons/button';
import type { IconButton } from '../../components/buttons/icon-button';
import type { Avatar } from '../../components/data-display/avatar';
import type { Badge } from '../../components/data-display/badge';
import type { Card } from '../../components/data-display/card';
import type { Heading } from '../../components/data-display/heading';
import type { Alert } from '../../components/feedback/alert';
import type { Skeleton } from '../../components/feedback/skeleton';
import type { Spinner } from '../../components/feedback/spinner';
import type { FormControl } from '../../components/form/form-control';
import type { Textarea } from '../../components/form/textarea';
import type { AlertIcon, ChevronIcon } from '../../components/icons';
import type { Grid } from '../../components/layout/grid';
import type { Separator } from '../../components/layout/separator';
import type { Stack } from '../../components/layout/stack';
import type { Breadcrumb } from '../../components/navigation/breadcrumb';
import type { Drawer } from '../../components/overlays/drawer';
import type { ListBox } from '../../components/overlays/list-box';
import type { Modal } from '../../components/overlays/modal';

/**
 * Generative UI 統合の props スキーマ（純データ）。
 *
 * React に一切依存しない（`import type` のみ）ため **サーバー安全**。RSC の
 * サーバーコンポーネントから import して `catalog.prompt()` のプロンプト生成に
 * 使える。描画ロジックは ./renderers（'use client'）に分離している。
 *
 * ## 二重メンテ防止
 *
 * 各 schema には対応する `{Component}IntegrationProps` 型を定義し、
 * `satisfies z.ZodType<...>` で **本体コンポーネント Props と Zod の型を
 * コンパイル時に一致検査**する。本体側で prop を縮めたりリネームすると
 * ここで型エラーになり、CI がブロックする仕組み。
 *
 * - LLM 向けに独自抽象を入れている prop（`label`, `text`, `href`, `tabs`,
 *   `items` 等）は中間型に手書きする。
 * - 本体に存在する prop は `ComponentProps<typeof X>['key']` で参照することで、
 *   本体の enum を縮めたときに自動追従する。enum を「広げた」ときの追従漏れは
 *   satisfies では検知できないため、末尾の CoversComponent 型で別途検査する。
 *
 * enum 値はトークン由来の固定値に制約することで、生成 UI が崩れないように
 * している。
 *
 * ## キーの並び順は公開 ABI
 *
 * OpenUI Lang は完全な位置引数（`Button("ヘルプ", "outline", "base", ...)`）で、
 * @openuidev/lang-core が `Object.keys(properties)` の順に params を作る。
 * そのため **各 schema のキーの並び順がそのまま公開 ABI** になる。
 *
 * - 既存キーのリネーム: 位置が変わらないので安全。
 * - 既存キーの削除・並べ替え: 保存済みの OpenUI 文字列の引数が全部ずれる。
 * - 新しいキーの追加: **必ず末尾に足す**。途中に挿入すると以降の位置が 1 つずつ
 *   ずれ、既存の文字列が無言で誤描画される（型エラーにもならない）。
 *
 * ## スキーマの実体が同一性
 *
 * @openuidev/lang-core の `createLibrary` は `reg.add(comp.props, { id: name })`
 * と **zod インスタンスそのもの**をキーに登録する。そのため 2 つのコンポーネントに
 * 同じインスタンスを渡すと後勝ちで上書きされ、先に登録した方が JSON Schema の
 * `$defs` から丸ごと消える（型エラーにもならない）。キーが同じ schema を作る
 * ときは、プレーンな shape オブジェクトを spread して **別インスタンス**にする。
 */

/**
 * LLM 生成の `href` は `<a href>` に直接渡るため、`javascript:` や `data:` の
 * スキームが通ると XSS になる。`http(s)://` 始まり、または `/` から始まる
 * 相対パスのみを許可する。`z.url()` は `javascript:` を拒否しないため正規表現で
 * 明示的にブロックしている。
 */
const safeUrl = z
  .string()
  .regex(/^(https?:\/\/|\/)/u, '外部 URL（http/https）または相対 URL のみ許可');

type ButtonIntegrationProps = {
  label: string;
  variant?: ComponentProps<typeof Button>['variant'];
  color?: ComponentProps<typeof Button>['color'];
  size?: ComponentProps<typeof Button>['size'];
  fullWidth?: ComponentProps<typeof Button>['fullWidth'];
  href?: string;
};
export const buttonProps = z.object({
  label: z.string(),
  variant: z.enum(['solid', 'outline', 'skeleton']).optional(),
  color: z.enum(['primary', 'secondary', 'base']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  fullWidth: z.boolean().optional(),
  href: safeUrl.optional(),
}) satisfies z.ZodType<ButtonIntegrationProps>;

// 生成 UI で使えるアイコン名（サイズのみで描画できる安全な集合）。
export const iconName = z.enum([
  'plus',
  'minus',
  'check',
  'close',
  'copy',
  'send',
  'mail',
  'subscribe',
  'rss',
  'history',
  'update-date',
  'publish-date',
  'link',
  'external-link',
  'location',
  'navigation-menu',
  'list',
  'table',
  'form',
  'view',
  'view-off',
  'light-mode',
  'dark-mode',
  'palette',
  'color-contrast',
  'color-info',
  'mixed-color',
  'horizontal-writing',
  'vertical-writing',
  'tag',
  'blog',
  'news',
  'slide',
  'sparkles',
  'ai',
  'atom',
  'accessibility',
  'shield-check',
  'prepare',
  'informative',
  'good',
  'bad',
  'easy',
  'difficult',
  'interesting',
  'boring',
  'shallow',
  'logo',
  'github',
  'twitter',
  'qiita',
]);

type IconIntegrationProps = {
  name: z.infer<typeof iconName>;
  size?: ComponentProps<typeof Spinner>['size'];
};
export const iconProps = z.object({
  name: iconName,
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<IconIntegrationProps>;

type IconButtonIntegrationProps = {
  icon: z.infer<typeof iconName>;
  label: ComponentProps<typeof IconButton>['label'];
  size?: ComponentProps<typeof IconButton>['size'];
  color?: ComponentProps<typeof IconButton>['color'];
};
export const iconButtonProps = z.object({
  icon: iconName,
  label: z.string(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  color: z.enum(['transparent', 'base', 'primary', 'secondary']).optional(),
}) satisfies z.ZodType<IconButtonIntegrationProps>;

type ChevronIconIntegrationProps = {
  direction: ComponentProps<typeof ChevronIcon>['direction'];
  size?: ComponentProps<typeof ChevronIcon>['size'];
};
export const chevronIconProps = z.object({
  direction: z.enum(['up', 'down', 'left', 'right']),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<ChevronIconIntegrationProps>;

type StatusIconIntegrationProps = {
  status: ComponentProps<typeof AlertIcon>['status'];
  size?: ComponentProps<typeof AlertIcon>['size'];
};
export const statusIconProps = z.object({
  status: z.enum(['success', 'info', 'warning', 'error']),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<StatusIconIntegrationProps>;

type BadgeIntegrationProps = {
  label: string;
  tone?: ComponentProps<typeof Badge>['tone'];
  variant?: ComponentProps<typeof Badge>['variant'];
  size?: ComponentProps<typeof Badge>['size'];
};
export const badgeProps = z.object({
  label: z.string(),
  tone: z.enum(['neutral', 'info', 'success', 'warning', 'error']).optional(),
  variant: z.enum(['solid', 'outline']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<BadgeIntegrationProps>;

type HeadingIntegrationProps = {
  label: string;
  level?: ComponentProps<typeof Heading>['level'];
  lineClamp?: ComponentProps<typeof Heading>['lineClamp'];
};
export const headingProps = z.object({
  label: z.string(),
  level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional(),
  lineClamp: z
    .union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ])
    .optional(),
}) satisfies z.ZodType<HeadingIntegrationProps>;

type AvatarIntegrationProps = {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: ComponentProps<typeof Avatar>['size'];
};
export const avatarProps = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  name: z.string().optional(),
  fallback: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<AvatarIntegrationProps>;

type CodeIntegrationProps = { code: string };
export const codeProps = z.object({
  code: z.string(),
}) satisfies z.ZodType<CodeIntegrationProps>;

type AccordionIntegrationProps = {
  items: ReadonlyArray<{
    title: string;
    content: string;
    defaultOpen?: boolean;
  }>;
};
export const accordionProps = z.object({
  items: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        defaultOpen: z.boolean().optional(),
      }),
    )
    .min(1)
    .describe('各アコーディオン項目（タイトルとテキスト本文）'),
}) satisfies z.ZodType<AccordionIntegrationProps>;

type TableIntegrationProps = {
  caption?: string;
  columns: ReadonlyArray<{
    label: string;
    align?: 'left' | 'center' | 'right';
  }>;
  rows: readonly string[][];
};
export const tableProps = z.object({
  caption: z.string().optional(),
  columns: z
    .array(
      z.object({
        label: z.string(),
        align: z.enum(['left', 'center', 'right']).optional(),
      }),
    )
    .min(1),
  rows: z
    .array(z.array(z.string()))
    .describe('各行のセル文字列（columns と同じ順序・個数）'),
}) satisfies z.ZodType<TableIntegrationProps>;

type CardIntegrationProps = {
  width?: ComponentProps<typeof Card>['width'];
  variant?: ComponentProps<typeof Card>['variant'];
  interactive?: ComponentProps<typeof Card>['interactive'];
  // Integration-only: the bare Card has no padding, so `size` drives the
  // generated card's inner padding (sm/md/lg).
  size?: 'sm' | 'md' | 'lg';
};
export const cardProps = z.object({
  width: z.enum(['full', 'fit']).optional(),
  variant: z.enum(['shadow', 'outline']).optional(),
  interactive: z.boolean().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<CardIntegrationProps>;

type AlertIntegrationProps = {
  tone: ComponentProps<typeof Alert>['tone'];
  message: ComponentProps<typeof Alert>['message'];
};
export const alertProps = z.object({
  tone: z.enum(['success', 'info', 'warning', 'error']),
  message: z.union([z.string(), z.array(z.string())]),
}) satisfies z.ZodType<AlertIntegrationProps>;

type SpinnerIntegrationProps = {
  label?: ComponentProps<typeof Spinner>['label'];
  size?: ComponentProps<typeof Spinner>['size'];
};
export const spinnerProps = z.object({
  label: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
}) satisfies z.ZodType<SpinnerIntegrationProps>;

type ProgressIntegrationProps = {
  value: number;
  max: number;
  min?: number;
  label?: string;
};
export const progressProps = z.object({
  value: z.number(),
  max: z.number(),
  min: z.number().optional(),
  label: z.string().optional(),
}) satisfies z.ZodType<ProgressIntegrationProps>;

type SkeletonIntegrationProps = {
  shape?: ComponentProps<typeof Skeleton>['shape'];
  size?: ComponentProps<typeof Skeleton>['size'];
  animate?: ComponentProps<typeof Skeleton>['animate'];
};
export const skeletonProps = z.object({
  shape: z.enum(['rect', 'circle']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  animate: z.boolean().optional(),
}) satisfies z.ZodType<SkeletonIntegrationProps>;

type ToastIntegrationProps = {
  triggerLabel: string;
  tone: 'success' | 'info' | 'warning' | 'error';
  message: string;
};
export const toastProps = z.object({
  triggerLabel: z.string().describe('トーストを表示するボタンの文言'),
  tone: z.enum(['success', 'info', 'warning', 'error']),
  message: z.string(),
}) satisfies z.ZodType<ToastIntegrationProps>;

type SeparatorIntegrationProps = {
  orientation?: ComponentProps<typeof Separator>['orientation'];
  color?: ComponentProps<typeof Separator>['color'];
};
export const separatorProps = z.object({
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  color: z.enum(['base', 'mute', 'subtle']).optional(),
}) satisfies z.ZodType<SeparatorIntegrationProps>;

type StackIntegrationProps = {
  direction?: ComponentProps<typeof Stack>['direction'];
  gap?: ComponentProps<typeof Stack>['gap'];
  padding?: ComponentProps<typeof Stack>['padding'];
  align?: ComponentProps<typeof Stack>['align'];
  justify?: ComponentProps<typeof Stack>['justify'];
};
export const stackProps = z.object({
  direction: z.enum(['row', 'column']).optional(),
  gap: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
  justify: z.enum(['start', 'center', 'end', 'between']).optional(),
}) satisfies z.ZodType<StackIntegrationProps>;

type GridIntegrationProps = {
  cols?: ComponentProps<typeof Grid>['cols'];
  minItemSize?: ComponentProps<typeof Grid>['minItemSize'];
  gap?: ComponentProps<typeof Grid>['gap'];
};
export const gridProps = z.object({
  cols: z
    .union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
      z.literal('auto-fill'),
      z.literal('auto-fit'),
    ])
    .optional(),
  minItemSize: z
    .union([
      z.literal(24),
      z.literal(32),
      z.literal(40),
      z.literal(48),
      z.literal(64),
      z.literal(80),
    ])
    .optional(),
  gap: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
}) satisfies z.ZodType<GridIntegrationProps>;

type ScrollLinkedIntegrationProps = Record<string, never>;
export const scrollLinkedProps = z.object(
  {},
) satisfies z.ZodType<ScrollLinkedIntegrationProps>;

type AnchorIntegrationProps = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};
export const anchorProps = z.object({
  label: z.string(),
  href: safeUrl,
  openInNewTab: z.boolean().optional(),
}) satisfies z.ZodType<AnchorIntegrationProps>;

type BreadcrumbIntegrationProps = {
  size?: ComponentProps<typeof Breadcrumb.List>['size'];
  items: ReadonlyArray<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
};
export const breadcrumbProps = z.object({
  size: z.enum(['sm', 'md', 'lg']).optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        href: safeUrl.optional(),
        current: z.boolean().optional(),
      }),
    )
    .min(1)
    .describe('パンくず項目（href 無し、または current=true で現在地）'),
}) satisfies z.ZodType<BreadcrumbIntegrationProps>;

type PaginationIntegrationProps = {
  name: string;
  totalPages: number;
  defaultPage?: number;
  prevLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
};
export const paginationProps = z.object({
  name: z.string(),
  totalPages: z.number(),
  defaultPage: z.number().optional(),
  prevLabel: z.string().optional(),
  nextLabel: z.string().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<PaginationIntegrationProps>;

type TabsIntegrationProps = {
  label?: string;
  tabs: ReadonlyArray<{ label: string; content: string }>;
};
export const tabsProps = z.object({
  label: z.string().optional().describe('タブリストのアクセシブル名'),
  tabs: z
    .array(z.object({ label: z.string(), content: z.string() }))
    .min(1)
    .describe('各タブのラベルとテキストパネル'),
}) satisfies z.ZodType<TabsIntegrationProps>;

// TextField と Textarea はキーが揃っているが、`textareaProps = textFieldProps`
// のようにインスタンスを共有してはいけない（冒頭「スキーマの実体が同一性」参照）。
// 形だけを spread して別インスタンスにする。
const textInputShape = {
  name: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
};

type TextFieldIntegrationProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};
export const textFieldProps = z.object({
  ...textInputShape,
}) satisfies z.ZodType<TextFieldIntegrationProps>;

type TextareaIntegrationProps = TextFieldIntegrationProps & {
  rows?: ComponentProps<typeof Textarea>['rows'];
  autoResize?: ComponentProps<typeof Textarea>['autoResize'];
};
export const textareaProps = z.object({
  ...textInputShape,
  rows: z.int().min(1).max(40).optional().describe('初期表示の行数'),
  autoResize: z
    .boolean()
    .optional()
    .describe('入力量に合わせて高さを自動で伸ばす'),
}) satisfies z.ZodType<TextareaIntegrationProps>;

type PasswordInputIntegrationProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
};
export const passwordInputProps = z.object({
  name: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<PasswordInputIntegrationProps>;

// NumberField と Slider も同様に、インスタンスではなく形だけを共有する。
const numericInputShape = {
  name: z.string(),
  defaultValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
};

type NumberFieldIntegrationProps = {
  name: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  invalid?: boolean;
  disabled?: boolean;
};
export const numberFieldProps = z.object({
  ...numericInputShape,
}) satisfies z.ZodType<NumberFieldIntegrationProps>;

type SliderIntegrationProps = NumberFieldIntegrationProps;
export const sliderProps = z.object({
  ...numericInputShape,
  min: z.number().optional().describe('下限（未指定なら 0）'),
  max: z.number().optional().describe('上限（未指定なら 100）'),
}) satisfies z.ZodType<SliderIntegrationProps>;

type CheckboxIntegrationProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
};
export const checkboxProps = z.object({
  name: z.string(),
  label: z.string(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<CheckboxIntegrationProps>;

type SwitchIntegrationProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
};
export const switchProps = z.object({
  name: z.string(),
  label: z.string(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  invalid: z.boolean().optional(),
  required: z.boolean().optional(),
}) satisfies z.ZodType<SwitchIntegrationProps>;

type SelectOption = { value: string; label: string };
type SelectIntegrationProps = {
  name: string;
  options: readonly SelectOption[];
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
};
const selectOption = z.object({ value: z.string(), label: z.string() });
const radioCardOption = selectOption.extend({
  description: z.string().optional(),
  disabled: z.boolean().optional(),
});
export const selectProps = z.object({
  name: z.string(),
  options: z.array(selectOption).min(1).describe('選択肢（value / label）'),
  defaultValue: z.string().optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<SelectIntegrationProps>;

type RadioIntegrationProps = {
  name: string;
  label: string;
  options: readonly SelectOption[];
  defaultValue?: string;
  disabled?: boolean;
};
export const radioProps = z.object({
  name: z.string(),
  label: z.string(),
  options: z.array(selectOption).min(1),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<RadioIntegrationProps>;

type RadioCardOption = SelectOption & {
  description?: string;
  disabled?: boolean;
};
type RadioCardIntegrationProps = {
  name: string;
  label: string;
  options: readonly RadioCardOption[];
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
};
export const radioCardProps = z.object({
  name: z.string(),
  label: z.string(),
  options: z.array(radioCardOption).min(1),
  defaultValue: z.string().optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<RadioCardIntegrationProps>;

type CheckboxCardIntegrationProps = {
  name: string;
  options: readonly RadioCardOption[];
  defaultValue?: readonly string[];
  invalid?: boolean;
  disabled?: boolean;
  label: string;
};
export const checkboxCardProps = z.object({
  name: z.string(),
  options: z.array(radioCardOption).min(1),
  defaultValue: z.array(z.string()).optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
  // RadioCard は label を 2 番目に持つが、こちらは後から足したので末尾に置く
  // （冒頭「キーの並び順が公開 ABI」参照）
  label: z.string(),
}) satisfies z.ZodType<CheckboxCardIntegrationProps>;

type ListBoxIntegrationProps = {
  name: string;
  options: readonly SelectOption[];
  defaultValue?: string;
  label?: ComponentProps<typeof ListBox.Trigger>['label'];
};
export const listBoxProps = z.object({
  name: z.string(),
  options: z.array(selectOption).min(1),
  defaultValue: z.string().optional(),
  label: z.string().optional().describe('トリガーのアクセシブル名'),
}) satisfies z.ZodType<ListBoxIntegrationProps>;

type CheckboxGroupIntegrationProps = {
  name: string;
  options: readonly SelectOption[];
  defaultValue?: readonly string[];
  label: string;
};
export const checkboxGroupProps = z.object({
  name: z.string(),
  options: z.array(selectOption).min(1),
  defaultValue: z.array(z.string()).optional(),
  // グループのアクセシブル名。後から足したので末尾に置く
  // （冒頭「キーの並び順が公開 ABI」参照）
  label: z.string(),
}) satisfies z.ZodType<CheckboxGroupIntegrationProps>;

type AutocompleteIntegrationProps = {
  name: string;
  options: readonly SelectOption[];
  defaultValue?: readonly string[];
  invalid?: boolean;
  disabled?: boolean;
};
export const autocompleteProps = z.object({
  name: z.string(),
  options: z.array(selectOption).min(1),
  defaultValue: z.array(z.string()).optional(),
  invalid: z.boolean().optional(),
  disabled: z.boolean().optional(),
}) satisfies z.ZodType<AutocompleteIntegrationProps>;

type FileFieldIntegrationProps = {
  triggerLabel?: string;
  multiple?: boolean;
  maxFiles?: number;
  clearable?: boolean;
};
export const fileFieldProps = z.object({
  triggerLabel: z
    .string()
    .optional()
    .describe('ファイル選択ボタンの文言（未指定なら辞書の既定文言）'),
  multiple: z.boolean().optional(),
  maxFiles: z.number().optional(),
  clearable: z.boolean().optional(),
}) satisfies z.ZodType<FileFieldIntegrationProps>;

type FormControlIntegrationProps = {
  label: ComponentProps<typeof FormControl>['label'];
  fieldType?: 'text' | 'textarea' | 'password';
  name: string;
  placeholder?: string;
  defaultValue?: string;
  helpText?: string;
  errorText?: string;
  required?: boolean;
  invalid?: boolean;
};
export const formControlProps = z.object({
  label: z.string(),
  fieldType: z.enum(['text', 'textarea', 'password']).optional(),
  name: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  helpText: z.string().optional(),
  errorText: z.string().optional(),
  required: z.boolean().optional(),
  invalid: z.boolean().optional(),
}) satisfies z.ZodType<FormControlIntegrationProps>;

type FormIntegrationProps = { action?: string };
export const formProps = z.object({
  // href と同じく `javascript:` 等を弾く必要がある
  // （`<form action="javascript:...">` も submit 時にスクリプトを実行する）。
  action: safeUrl.optional().describe('送信先 URL（任意）'),
}) satisfies z.ZodType<FormIntegrationProps>;

// 本体側は isOpen/onClose の命令的 API なので、ここでは triggerLabel +
// children のみを zod に乗せる。
type ModalIntegrationProps = {
  triggerLabel: string;
  title: string;
  side?: ComponentProps<typeof Modal>['side'];
};
export const modalProps = z.object({
  triggerLabel: z.string().describe('モーダルを開くボタンの文言'),
  title: z.string(),
  side: z.enum(['center', 'bottom', 'right', 'left']).optional(),
}) satisfies z.ZodType<ModalIntegrationProps>;

type DialogIntegrationProps = { triggerLabel: string; title: string };
export const dialogProps = z.object({
  triggerLabel: z.string().describe('ダイアログを開くボタンの文言'),
  title: z.string(),
}) satisfies z.ZodType<DialogIntegrationProps>;

type DrawerIntegrationProps = {
  triggerLabel: string;
  title: string;
  side?: ComponentProps<typeof Drawer>['side'];
};
export const drawerProps = z.object({
  triggerLabel: z.string().describe('ドロワーを開くボタンの文言'),
  title: z.string(),
  side: z.enum(['left', 'right']).optional(),
}) satisfies z.ZodType<DrawerIntegrationProps>;

type PopoverIntegrationProps = { triggerLabel: string };
export const popoverProps = z.object({
  triggerLabel: z.string().describe('ポップオーバーを開くボタンの文言'),
}) satisfies z.ZodType<PopoverIntegrationProps>;

type TooltipIntegrationProps = { triggerLabel: string; content: string };
export const tooltipProps = z.object({
  triggerLabel: z.string().describe('ツールチップを表示するトリガーの文言'),
  content: z.string().describe('ツールチップの内容'),
}) satisfies z.ZodType<TooltipIntegrationProps>;

type DropdownMenuIntegrationProps = {
  triggerLabel: string;
  items: ReadonlyArray<{ label: string }>;
};
export const dropdownMenuProps = z.object({
  triggerLabel: z.string(),
  items: z
    .array(z.object({ label: z.string() }))
    .min(1)
    .describe('メニュー項目'),
}) satisfies z.ZodType<DropdownMenuIntegrationProps>;

export type ButtonProps = z.infer<typeof buttonProps>;
export type BadgeProps = z.infer<typeof badgeProps>;
export type HeadingProps = z.infer<typeof headingProps>;
export type AlertProps = z.infer<typeof alertProps>;
export type SpinnerProps = z.infer<typeof spinnerProps>;
export type SeparatorProps = z.infer<typeof separatorProps>;
export type StackProps = z.infer<typeof stackProps>;
export type TextFieldProps = z.infer<typeof textFieldProps>;
export type CheckboxProps = z.infer<typeof checkboxProps>;
export type SwitchProps = z.infer<typeof switchProps>;
export type CardProps = z.infer<typeof cardProps>;
export type SelectProps = z.infer<typeof selectProps>;
export type TabsProps = z.infer<typeof tabsProps>;
export type IconName = z.infer<typeof iconName>;
export type IconProps = z.infer<typeof iconProps>;
export type IconButtonProps = z.infer<typeof iconButtonProps>;
export type AnchorProps = z.infer<typeof anchorProps>;
export type AvatarProps = z.infer<typeof avatarProps>;
export type CodeProps = z.infer<typeof codeProps>;
export type ProgressProps = z.infer<typeof progressProps>;
export type SkeletonProps = z.infer<typeof skeletonProps>;
export type AccordionProps = z.infer<typeof accordionProps>;
export type BreadcrumbProps = z.infer<typeof breadcrumbProps>;
export type TableProps = z.infer<typeof tableProps>;
export type TextareaProps = z.infer<typeof textareaProps>;
export type PasswordInputProps = z.infer<typeof passwordInputProps>;
export type NumberFieldProps = z.infer<typeof numberFieldProps>;
export type SliderProps = z.infer<typeof sliderProps>;
export type RadioProps = z.infer<typeof radioProps>;
export type RadioCardProps = z.infer<typeof radioCardProps>;
export type CheckboxCardProps = z.infer<typeof checkboxCardProps>;
export type PaginationProps = z.infer<typeof paginationProps>;
export type GridProps = z.infer<typeof gridProps>;
export type ChevronIconProps = z.infer<typeof chevronIconProps>;
export type StatusIconProps = z.infer<typeof statusIconProps>;
export type FormProps = z.infer<typeof formProps>;
export type ModalProps = z.infer<typeof modalProps>;
export type DialogProps = z.infer<typeof dialogProps>;
export type DrawerProps = z.infer<typeof drawerProps>;
export type PopoverProps = z.infer<typeof popoverProps>;
export type ScrollLinkedProps = z.infer<typeof scrollLinkedProps>;
export type TooltipProps = z.infer<typeof tooltipProps>;
export type DropdownMenuProps = z.infer<typeof dropdownMenuProps>;
export type ToastProps = z.infer<typeof toastProps>;
export type ListBoxProps = z.infer<typeof listBoxProps>;
export type CheckboxGroupProps = z.infer<typeof checkboxGroupProps>;
export type AutocompleteProps = z.infer<typeof autocompleteProps>;
export type FileFieldProps = z.infer<typeof fileFieldProps>;
export type FormControlProps = z.infer<typeof formControlProps>;

// satisfies は enum の narrowing しか検知しない。本体が値を追加したときの
// 追従漏れを塞ぐため、本体ユニオンが schema の enum に被覆されているかを型で
// 検査する。本体に値が増えると AssertCovered の制約違反でコンパイルが止まる。
type CoversComponent<Component, Zod> = [
  Exclude<NonNullable<Component>, Zod>,
] extends [never]
  ? true
  : { readonly __missingFromZodEnum: Exclude<NonNullable<Component>, Zod> };
type AssertCovered<T extends true> = T;

export type _EnumCoverage = [
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Button>['variant'],
      ButtonProps['variant']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Button>['color'],
      ButtonProps['color']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Button>['size'], ButtonProps['size']>
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Badge>['tone'], BadgeProps['tone']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Badge>['variant'],
      BadgeProps['variant']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Badge>['size'], BadgeProps['size']>
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Card>['width'], CardProps['width']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Card>['variant'],
      CardProps['variant']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Alert>['tone'], AlertProps['tone']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Separator>['orientation'],
      SeparatorProps['orientation']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Separator>['color'],
      SeparatorProps['color']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Modal>['side'], ModalProps['side']>
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Drawer>['side'], DrawerProps['side']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Heading>['level'],
      HeadingProps['level']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Avatar>['size'], AvatarProps['size']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Spinner>['size'],
      SpinnerProps['size']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Skeleton>['shape'],
      SkeletonProps['shape']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Skeleton>['size'],
      SkeletonProps['size']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof IconButton>['size'],
      IconButtonProps['size']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof IconButton>['color'],
      IconButtonProps['color']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof ChevronIcon>['direction'],
      ChevronIconProps['direction']
    >
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof AlertIcon>['status'],
      StatusIconProps['status']
    >
  >,
  // ChevronIcon / AlertIcon の size は本体が xs〜3xl まで持つが、生成 UI では
  // iconName と同様 sm/md/lg の安全な部分集合に意図的に絞るため被覆検査しない。
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Stack>['direction'],
      StackProps['direction']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Stack>['gap'], StackProps['gap']>
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Stack>['align'], StackProps['align']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Stack>['justify'],
      StackProps['justify']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Grid>['cols'], GridProps['cols']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Grid>['minItemSize'],
      GridProps['minItemSize']
    >
  >,
  AssertCovered<
    CoversComponent<ComponentProps<typeof Grid>['gap'], GridProps['gap']>
  >,
  AssertCovered<
    CoversComponent<
      ComponentProps<typeof Breadcrumb.List>['size'],
      BreadcrumbProps['size']
    >
  >,
];
