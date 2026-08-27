import { createLibrary, defineComponent } from '@openuidev/lang-core';
import type { Library } from '@openuidev/lang-core';
import { z } from 'zod';

import * as s from './schemas';

/**
 * OpenUI ライブラリの「定義部分」（スキーマ・説明文・子要素の構成）を
 * React 非依存で組み立てる共有ファクトリ。
 *
 * 描画関数（`component`）だけを外から差し込むことで、
 * - クライアント（`openui/library.tsx`・'use client'）= 実 React 描画関数を渡す
 * - サーバー安全（`openui/prompt.ts`）= 何も渡さず `prompt()` だけ使う
 * の 2 つを **スキーマを二重管理せずに** 生成できる。
 *
 * OpenUI は schema と描画関数を `defineComponent` で同居させる設計なので、
 * このファクトリ自体は描画関数を opaque な `C` として受け取り中身を見ない。
 */
export type ComponentRenderers<C> = Partial<Record<string, C>>;

export const buildComponentLibrary = <C>(
  render: ComponentRenderers<C>,
): Library<C> => {
  const def = <T extends z.ZodObject>(
    name: string,
    description: string,
    props: T,
  ) =>
    defineComponent({ name, description, props, component: render[name] as C });

  const Button = def(
    'Button',
    'アクションボタン。href を指定するとリンク（<a>）になる。',
    s.buttonProps,
  );
  const IconButton = def(
    'IconButton',
    'アイコンのみのボタン（label は必須）。',
    s.iconButtonProps,
  );
  const Badge = def('Badge', 'ステータスやラベルのバッジ。', s.badgeProps);
  const Heading = def('Heading', '見出し（h1〜h6）。', s.headingProps);
  const Anchor = def('Anchor', 'テキストリンク。', s.anchorProps);
  const Avatar = def(
    'Avatar',
    'アバター（画像 or イニシャル）。',
    s.avatarProps,
  );
  const Code = def('Code', 'インラインのコード/値表示。', s.codeProps);
  const Icon = def('Icon', 'アイコン（name で指定）。', s.iconProps);
  const ChevronIcon = def(
    'ChevronIcon',
    '矢印アイコン。direction で向きを指定。',
    s.chevronIconProps,
  );
  const StatusIcon = def(
    'StatusIcon',
    'ステータスを表すアイコン（success/info/warning/error）。装飾用途で、メッセージ表示なら Alert を使う。',
    s.statusIconProps,
  );
  const Alert = def(
    'Alert',
    '状態を伝えるアラート。message は文字列または文字列配列。',
    s.alertProps,
  );
  const Spinner = def('Spinner', 'ローディングスピナー。', s.spinnerProps);
  const Progress = def('Progress', '進捗バー。', s.progressProps);
  const Skeleton = def(
    'Skeleton',
    'ローディングのプレースホルダ。',
    s.skeletonProps,
  );
  const Separator = def('Separator', '区切り線。', s.separatorProps);
  const Tabs = def(
    'Tabs',
    'タブ。各タブは label とテキスト content を持つ。content は文字列のみ。',
    s.tabsProps,
  );
  const Accordion = def(
    'Accordion',
    '開閉できるアコーディオン。各項目は title とテキスト content。content は文字列のみ。',
    s.accordionProps,
  );
  const Breadcrumb = def('Breadcrumb', 'パンくずリスト。', s.breadcrumbProps);
  const Table = def(
    'Table',
    'テーブル。columns と rows（行ごとのセル文字列）。各行のセル数は columns の数と一致させる。',
    s.tableProps,
  );
  const TextField = def(
    'TextField',
    '1行テキスト入力。name でフォーム状態に束縛される。',
    s.textFieldProps,
  );
  const Textarea = def(
    'Textarea',
    '複数行テキスト入力。name でフォーム状態に束縛される。',
    s.textareaProps,
  );
  const PasswordInput = def(
    'PasswordInput',
    'パスワード入力。name でフォーム状態に束縛される。',
    s.passwordInputProps,
  );
  const NumberField = def(
    'NumberField',
    '数値入力。name でフォーム状態に束縛される。',
    s.numberFieldProps,
  );
  const Slider = def(
    'Slider',
    'スライダー。name でフォーム状態に束縛される。',
    s.sliderProps,
  );
  const Checkbox = def(
    'Checkbox',
    'チェックボックス。name でフォーム状態に束縛される。',
    s.checkboxProps,
  );
  const Switch = def(
    'Switch',
    'オン/オフスイッチ。name でフォーム状態に束縛される。',
    s.switchProps,
  );
  const Select = def(
    'Select',
    'ドロップダウン選択。name でフォーム状態に束縛される。',
    s.selectProps,
  );
  const Radio = def(
    'Radio',
    '単一選択ラジオ。name でフォーム状態に束縛される。',
    s.radioProps,
  );
  const RadioCard = def(
    'RadioCard',
    'カード型の単一選択。name でフォーム状態に束縛される。',
    s.radioCardProps,
  );
  const CheckboxCard = def(
    'CheckboxCard',
    'カード型の複数選択。name でフォーム状態に束縛される。',
    s.checkboxCardProps,
  );
  const Pagination = def(
    'Pagination',
    'ページネーション。name でフォーム状態に束縛される。',
    s.paginationProps,
  );
  const Tooltip = def(
    'Tooltip',
    'ツールチップ。ホバー/フォーカスで表示。',
    s.tooltipProps,
  );
  const DropdownMenu = def(
    'DropdownMenu',
    'ドロップダウンメニュー。',
    s.dropdownMenuProps,
  );
  const Toast = def(
    'Toast',
    'トースト通知。triggerLabel のボタンで発火。',
    s.toastProps,
  );
  const ScrollLinked = def(
    'ScrollLinked',
    'ページスクロール進捗バー（fixed top）。',
    s.scrollLinkedProps,
  );
  const ListBox = def(
    'ListBox',
    'ポップアップ型の単一選択リスト。',
    s.listBoxProps,
  );
  const CheckboxGroup = def(
    'CheckboxGroup',
    'チェックボックスグループ。name でフォーム状態に束縛。',
    s.checkboxGroupProps,
  );
  const Autocomplete = def(
    'Autocomplete',
    'タグ風の複数選択オートコンプリート。',
    s.autocompleteProps,
  );
  const FileField = def(
    'FileField',
    'ファイル選択フィールド（自己完結ウィジェット）。',
    s.fileFieldProps,
  );
  const FormControl = def(
    'FormControl',
    'ラベル＋ヘルプ/エラー付きフィールド（text/textarea/password）。',
    s.formControlProps,
  );

  const childRefs = [
    Button.ref,
    IconButton.ref,
    Badge.ref,
    Heading.ref,
    Anchor.ref,
    Avatar.ref,
    Code.ref,
    Icon.ref,
    ChevronIcon.ref,
    StatusIcon.ref,
    Alert.ref,
    Spinner.ref,
    Progress.ref,
    Skeleton.ref,
    Separator.ref,
    Tabs.ref,
    Accordion.ref,
    Breadcrumb.ref,
    Table.ref,
    TextField.ref,
    Textarea.ref,
    PasswordInput.ref,
    NumberField.ref,
    Slider.ref,
    Checkbox.ref,
    Switch.ref,
    Select.ref,
    Radio.ref,
    RadioCard.ref,
    CheckboxCard.ref,
    Pagination.ref,
    Tooltip.ref,
    DropdownMenu.ref,
    Toast.ref,
    ScrollLinked.ref,
    ListBox.ref,
    CheckboxGroup.ref,
    Autocomplete.ref,
    FileField.ref,
    FormControl.ref,
  ] as const;

  const Stack = def(
    'Stack',
    '子要素を縦/横に等間隔で並べるレイアウトコンテナ。Stack の直下に Stack/Grid/Card は置けない。入れ子レイアウトが必要なら Card の中に Stack や Grid を入れる。',
    s.stackProps.extend({
      children: z.array(z.union(childRefs)).describe('並べる子要素'),
    }),
  );
  const Grid = def(
    'Grid',
    '子要素をグリッド状に並べる。cols（1〜6 / auto-fill / auto-fit）と gap、auto-fill/fit 時は minItemSize で各セルの最小サイズを制御。Grid の直下に Stack/Grid/Card は置けない。',
    s.gridProps.extend({
      children: z.array(z.union(childRefs)).describe('グリッド内の子要素'),
    }),
  );

  const containerChildRefs = [...childRefs, Stack.ref, Grid.ref] as const;

  const Card = def(
    'Card',
    'コンテンツをまとめるカード（コンテナ）。Stack や Grid も入れられる。interactive を付けるとホバー時にスケールする。',
    s.cardProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('カード内の子要素'),
    }),
  );
  const Form = def(
    'Form',
    'フォーム要素のラッパー（縦並びレイアウト）。',
    s.formProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('フォーム内の要素'),
    }),
  );
  const Modal = def(
    'Modal',
    'モーダルダイアログ。triggerLabel のボタンで開く。',
    s.modalProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('モーダル内の要素'),
    }),
  );
  const Dialog = def(
    'Dialog',
    'センターダイアログ。triggerLabel のボタンで開く。',
    s.dialogProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('ダイアログ内の要素'),
    }),
  );
  const Drawer = def(
    'Drawer',
    'サイドドロワー。triggerLabel のボタンで開く。',
    s.drawerProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('ドロワー内の要素'),
    }),
  );
  const Popover = def(
    'Popover',
    'ポップオーバー。triggerLabel のボタンで開閉。',
    s.popoverProps.extend({
      children: z
        .array(z.union(containerChildRefs))
        .describe('ポップオーバー内の要素'),
    }),
  );

  return createLibrary({
    components: [
      Stack,
      Grid,
      Card,
      Form,
      Modal,
      Dialog,
      Drawer,
      Popover,
      Tooltip,
      DropdownMenu,
      Toast,
      Button,
      IconButton,
      Badge,
      Heading,
      Anchor,
      Avatar,
      Code,
      Icon,
      ChevronIcon,
      StatusIcon,
      Alert,
      Spinner,
      Progress,
      Skeleton,
      Separator,
      ScrollLinked,
      Tabs,
      Accordion,
      Breadcrumb,
      Table,
      TextField,
      Textarea,
      PasswordInput,
      NumberField,
      Slider,
      Checkbox,
      Switch,
      Select,
      Radio,
      RadioCard,
      CheckboxCard,
      Pagination,
      ListBox,
      CheckboxGroup,
      Autocomplete,
      FileField,
      FormControl,
    ],
    root: 'Stack',
  });
};
