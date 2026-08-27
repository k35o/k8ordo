import {
  autoFixSpec,
  defineCatalog,
  isNonEmptySpec,
  validateSpec,
} from '@json-render/core';
import type { Spec, UIElement } from '@json-render/core';
import { schema } from '@json-render/react/schema';
// 型ではなく値として使う（instanceof で ZodObject を判定するため）。
// 同じサブパスの _shared/schemas.ts が既に zod を実行時依存にしている
import { z } from 'zod';

import * as s from '../_shared/schemas';

/**
 * `@k8ordo/ui/json-render`（サーバー安全）
 *
 * LLM が生成してよい部品の契約（Zod スキーマのみ）。React に依存しないので
 * RSC のサーバーコンポーネントから import して `catalog.prompt()` で
 * システムプロンプトを生成できる。
 *
 * 実際の描画は `@k8ordo/ui/json-render/registry`（'use client'）。
 */
export const catalog = defineCatalog(schema, {
  components: {
    Stack: {
      props: s.stackProps,
      slots: ['default'],
      description:
        '子要素を縦/横に等間隔で並べるレイアウトコンテナ。gap で子要素間の間隔、padding（none〜xl）で内側の余白を付ける。セクションに余白が欲しいときは padding を指定する。',
    },
    Grid: {
      props: s.gridProps,
      slots: ['default'],
      description:
        '子要素をグリッド状に並べる。cols（1〜6 / auto-fill / auto-fit）と gap、auto-fill/fit 時は minItemSize で各セルの最小サイズを制御。',
    },
    Button: {
      props: s.buttonProps,
      description: 'アクションボタン。href を指定するとリンク（<a>）になる。',
    },
    Card: {
      props: s.cardProps,
      slots: ['default'],
      description:
        'コンテンツをまとめるカード（コンテナ）。内側 padding は size（sm/md/lg、デフォルト md）で決まる。中身を Stack で囲む場合に重ねて padding を指定する必要はない。interactive を付けるとホバー時にスケールする。',
    },
    Badge: { props: s.badgeProps, description: 'ステータスやラベルのバッジ。' },
    Heading: { props: s.headingProps, description: '見出し（h1〜h6）。' },
    Alert: {
      props: s.alertProps,
      description: '状態を伝えるアラート。message は文字列または文字列配列。',
    },
    Spinner: { props: s.spinnerProps, description: 'ローディングスピナー。' },
    Separator: { props: s.separatorProps, description: '区切り線。' },
    TextField: {
      props: s.textFieldProps,
      description:
        '1行テキスト入力。defaultValue を $bindState で状態に束縛できる。',
    },
    Checkbox: {
      props: s.checkboxProps,
      description:
        'チェックボックス。defaultChecked を $bindState で束縛できる。',
    },
    Switch: {
      props: s.switchProps,
      description:
        'オン/オフスイッチ。defaultChecked を $bindState で束縛できる。',
    },
    Select: {
      props: s.selectProps,
      description:
        'ドロップダウン選択。defaultValue を $bindState で状態に束縛できる。',
    },
    Tabs: {
      props: s.tabsProps,
      description: 'タブ。各タブは label とテキスト content を持つ。',
    },
    Accordion: {
      props: s.accordionProps,
      description:
        '開閉できるアコーディオン。各項目は title とテキスト content。',
    },
    Breadcrumb: {
      props: s.breadcrumbProps,
      description: 'パンくずリスト。',
    },
    Table: {
      props: s.tableProps,
      description: 'テーブル。columns（見出し）と rows（行ごとのセル文字列）。',
    },
    Anchor: { props: s.anchorProps, description: 'テキストリンク。' },
    Avatar: {
      props: s.avatarProps,
      description: 'アバター（画像 or イニシャル）。',
    },
    Code: { props: s.codeProps, description: 'インラインのコード/値表示。' },
    Progress: { props: s.progressProps, description: '進捗バー。' },
    Skeleton: {
      props: s.skeletonProps,
      description: 'ローディングのプレースホルダ。',
    },
    Icon: { props: s.iconProps, description: 'アイコン（name で指定）。' },
    ChevronIcon: {
      props: s.chevronIconProps,
      description: '矢印アイコン。direction で向きを指定。',
    },
    StatusIcon: {
      props: s.statusIconProps,
      description:
        'ステータスを表すアイコン（success/info/warning/error）。装飾用途で、メッセージ表示なら Alert を使う。',
    },
    IconButton: {
      props: s.iconButtonProps,
      description: 'アイコンのみのボタン（label は必須・ツールチップ）。',
    },
    Textarea: {
      props: s.textareaProps,
      description:
        '複数行テキスト入力。defaultValue を $bindState で束縛できる。',
    },
    PasswordInput: {
      props: s.passwordInputProps,
      description: 'パスワード入力。defaultValue を $bindState で束縛できる。',
    },
    NumberField: {
      props: s.numberFieldProps,
      description: '数値入力。defaultValue を $bindState で束縛できる。',
    },
    Slider: {
      props: s.sliderProps,
      description: 'スライダー。defaultValue を $bindState で束縛できる。',
    },
    Radio: {
      props: s.radioProps,
      description: '単一選択ラジオ。defaultValue を $bindState で束縛できる。',
    },
    RadioCard: {
      props: s.radioCardProps,
      description:
        'カード型の単一選択。defaultValue を $bindState で束縛できる。',
    },
    CheckboxCard: {
      props: s.checkboxCardProps,
      description:
        'カード型の複数選択。defaultValue を $bindState で束縛できる。',
    },
    Pagination: {
      props: s.paginationProps,
      description: 'ページネーション。defaultPage を $bindState で束縛できる。',
    },
    Form: {
      props: s.formProps,
      slots: ['default'],
      description: 'フォーム要素のラッパー（縦並びレイアウト）。',
    },
    Modal: {
      props: s.modalProps,
      slots: ['default'],
      description:
        'モーダルダイアログ。triggerLabel のボタンで開く自己完結ウィジェット。',
    },
    Dialog: {
      props: s.dialogProps,
      slots: ['default'],
      description: 'センターダイアログ。triggerLabel のボタンで開く。',
    },
    Drawer: {
      props: s.drawerProps,
      slots: ['default'],
      description: 'サイドドロワー。triggerLabel のボタンで開く。',
    },
    Popover: {
      props: s.popoverProps,
      slots: ['default'],
      description: 'ポップオーバー。triggerLabel のボタンで開閉。',
    },
    Tooltip: {
      props: s.tooltipProps,
      description: 'ツールチップ。ホバー/フォーカスで表示。',
    },
    DropdownMenu: {
      props: s.dropdownMenuProps,
      description: 'ドロップダウンメニュー。',
    },
    Toast: {
      props: s.toastProps,
      description: 'トースト通知。triggerLabel のボタンで発火。',
    },
    ScrollLinked: {
      props: s.scrollLinkedProps,
      description: 'ページスクロール進捗バー（fixed top）。',
    },
    ListBox: {
      props: s.listBoxProps,
      description: 'ポップアップ型の単一選択リスト。',
    },
    CheckboxGroup: {
      props: s.checkboxGroupProps,
      description: 'チェックボックスグループ。',
    },
    Autocomplete: {
      props: s.autocompleteProps,
      description: 'タグ風の複数選択オートコンプリート。',
    },
    FileField: {
      props: s.fileFieldProps,
      description: 'ファイル選択フィールド。',
    },
    FormControl: {
      props: s.formControlProps,
      description:
        'ラベル＋ヘルプ/エラー付きフィールド（text/textarea/password）。',
    },
  },
  actions: {},
});

/**
 * LLM が破りやすい制約を `catalog.prompt({ customRules })` に注入するための
 * 横断ルール集。json-render のシステムプロンプト本文に追記される。
 *
 * @example
 * const systemPrompt = catalog.prompt({ customRules: [...uiRules] });
 */
export const uiRules: readonly string[] = [
  'Table の rows は各行のセル数を columns の数と必ず一致させる。',
  'href は https:// もしくは http:// で始まる絶対 URL か、/ で始まるパスのみ。',
  'Tabs と Accordion の content はプレーンテキストのみ。コンポーネントは入れ子にできない。',
];

type ComponentSchemas = (typeof catalog)['data']['components'];

export type ComponentName = keyof ComponentSchemas;

export type ComponentProps<K extends ComponentName> = z.infer<
  ComponentSchemas[K]['props']
>;

/**
 * @k8ordo/ui のコンポーネントだけで構成された型付き spec の要素。
 * `type` と `props` がコンポーネントごとに検査される。
 */
export type UISpecElement = {
  [K in ComponentName]: Omit<UIElement, 'type' | 'props'> & {
    type: K;
    props: ComponentProps<K>;
  };
}[ComponentName];

/**
 * @k8ordo/ui のコンポーネントだけで構成された型付き spec。
 * `satisfies UISpec` で書くと component 名・props の typo がコンパイルエラーに
 * なり、エディタ補完も効く。上流の `Spec` へキャストなしで代入できる。
 *
 * @example
 * const spec = {
 *   root: 'root',
 *   elements: {
 *     root: { type: 'Stack', props: { direction: 'column' }, children: ['b'] },
 *     b: { type: 'Button', props: { label: 'OK' } },
 *   },
 * } satisfies UISpec;
 */
export type UISpec = {
  root: string;
  elements: Record<string, UISpecElement>;
  state?: Spec['state'];
};

export type GeneratedSpecIssue = {
  /** 問題のあった要素キー（spec 全体の問題なら未指定）。 */
  elementKey?: string;
  /** 人間（および LLM）向けの説明。 */
  message: string;
};

export type ValidateGeneratedSpecResult =
  | { ok: true; spec: UISpec; fixes: string[] }
  | { ok: false; issues: GeneratedSpecIssue[]; repairPrompt: string };

const buildRepairPrompt = (issues: GeneratedSpecIssue[]): string =>
  [
    'The generated UI spec is invalid. Fix the following issues and return the corrected spec:',
    ...issues.map((issue) =>
      issue.elementKey === undefined
        ? `- ${issue.message}`
        : `- [${issue.elementKey}] ${issue.message}`,
    ),
  ].join('\n');

/**
 * スキーマが受け付ける prop キーの集合。
 *
 * zod の `z.object` は未知のキーを **エラーにせず黙って落とす**。そのため
 * `safeParse` だけでは「旧 API のキーを渡した spec」が `ok: true` で通り、
 * 既定値のまま描画されて壊れたことにすら気づけない。キー集合を取り出して
 * 自前で照合する。
 */
const knownPropKeys = (
  propsSchema: z.ZodType,
): readonly string[] | undefined =>
  propsSchema instanceof z.ZodObject
    ? Object.keys(propsSchema.shape)
    : undefined;

/** spec 側は LLM 出力なので、型に反して props が欠けていることがある。 */
const givenPropKeys = (props: unknown): readonly string[] =>
  typeof props === 'object' && props !== null ? Object.keys(props) : [];

/**
 * LLM が生成した spec を検証し、描画可能なら型付き spec を、壊れていれば
 * そのまま LLM に投げ返せる修復プロンプトを返す。
 *
 * 内部では (1) 機械修正（`autoFixSpec`）→ (2) 構造検証（`validateSpec`）→
 * (3) 要素ごとに catalog の Zod スキーマで props 検証（未知キーの検出を含む）、
 * を行う。`catalog.validate()` は使わない（現行の上流バージョンでは正常な spec を
 * 誤って弾き、props 検証も実質無効になるため）。
 *
 * @example
 * const result = validateGeneratedSpec(JSON.parse(llmOutput));
 * if (result.ok) {
 *   return <JsonRenderUI spec={result.spec} />;
 * }
 * const retried = await llm(result.repairPrompt);
 */
export const validateGeneratedSpec = (
  input: unknown,
): ValidateGeneratedSpecResult => {
  if (!isNonEmptySpec(input)) {
    const issues: GeneratedSpecIssue[] = [
      {
        message:
          'The spec must be an object with a `root` key and an `elements` map.',
      },
    ];
    return { ok: false, issues, repairPrompt: buildRepairPrompt(issues) };
  }

  const { spec, fixes } = autoFixSpec(input);
  const issues: GeneratedSpecIssue[] = validateSpec(spec).issues.map(
    (issue) => ({ elementKey: issue.elementKey, message: issue.message }),
  );

  const components = catalog.data.components as Record<
    string,
    { props: z.ZodType }
  >;
  for (const [key, element] of Object.entries(spec.elements)) {
    const def = components[element.type];
    if (!def) {
      issues.push({
        elementKey: key,
        message: `Unknown component type "${element.type}". Use one of: ${catalog.componentNames.join(', ')}.`,
      });
      continue;
    }
    const parsed = def.props.safeParse(element.props);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        issues.push({
          elementKey: key,
          message: `${element.type}${path ? `.${path}` : ''}: ${issue.message}`,
        });
      }
    }

    const allowed = knownPropKeys(def.props);
    if (allowed === undefined) {
      continue;
    }
    for (const propKey of givenPropKeys(element.props)) {
      if (!allowed.includes(propKey)) {
        issues.push({
          elementKey: key,
          message: `${element.type}: Unknown prop "${propKey}". Allowed props: ${allowed.join(', ')}.`,
        });
      }
    }
  }

  if (issues.length === 0) {
    return { ok: true, spec: spec as UISpec, fixes };
  }
  return { ok: false, issues, repairPrompt: buildRepairPrompt(issues) };
};
