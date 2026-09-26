import {
  autoFixSpec,
  defineCatalog,
  isNonEmptySpec,
  validateSpec,
} from '@json-render/core';
import type { Spec, UIElement } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import type { z } from 'zod';

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
        'Layout container that places its children in a row or a column with even spacing. gap sets the space between children and padding (none to xl) the space inside; give a section padding when it needs room around its content.',
    },
    Grid: {
      props: s.gridProps,
      slots: ['default'],
      description:
        'Places its children in a grid. Set cols (1 to 6, auto-fill, or auto-fit) and gap; with auto-fill or auto-fit, minItemSize sets the smallest size of each cell.',
    },
    Button: {
      props: s.buttonProps,
      description: 'Action button. With href it renders as a link (<a>).',
    },
    Card: {
      props: s.cardProps,
      slots: ['default'],
      description:
        'Card that groups content (a container). size (sm/md/lg, default md) sets its inner padding, so a Stack inside it needs no padding of its own. interactive makes it scale up on hover.',
    },
    Badge: {
      props: s.badgeProps,
      description: 'Badge for a status or a label.',
    },
    Heading: { props: s.headingProps, description: 'Heading (h1 to h6).' },
    Alert: {
      props: s.alertProps,
      description:
        'Alert that reports a status. message is a string or an array of strings.',
    },
    Spinner: { props: s.spinnerProps, description: 'Loading spinner.' },
    Separator: { props: s.separatorProps, description: 'Divider line.' },
    TextField: {
      props: s.textFieldProps,
      description:
        'Single-line text input. defaultValue can be bound to state with $bindState.',
    },
    Checkbox: {
      props: s.checkboxProps,
      description:
        'Checkbox. defaultChecked can be bound to state with $bindState.',
    },
    Switch: {
      props: s.switchProps,
      description:
        'On/off switch. defaultChecked can be bound to state with $bindState.',
    },
    Select: {
      props: s.selectProps,
      description:
        'Dropdown select. defaultValue can be bound to state with $bindState.',
    },
    Tabs: {
      props: s.tabsProps,
      description: 'Tabs. Each tab has a label and text content.',
    },
    Accordion: {
      props: s.accordionProps,
      description:
        'Accordion of items that open and close. Each item has a title and text content.',
    },
    Breadcrumb: {
      props: s.breadcrumbProps,
      description: 'Breadcrumb trail.',
    },
    SideNav: {
      props: s.sideNavProps,
      description:
        'Side navigation: groups of links, each group under a small title. Mark the page being shown with current: true.',
    },
    Table: {
      props: s.tableProps,
      description:
        'Table with columns (the headers) and rows (the cell strings of each row).',
    },
    Anchor: { props: s.anchorProps, description: 'Text link.' },
    Avatar: {
      props: s.avatarProps,
      description: 'Avatar (an image or initials).',
    },
    Code: { props: s.codeProps, description: 'Inline code or value.' },
    Kbd: {
      props: s.kbdProps,
      description:
        'Keyboard shortcut. keys lists the keys pressed together, and each is drawn as its own key cap.',
    },
    EmptyState: {
      props: s.emptyStateProps,
      description:
        'Placeholder for a list, table, or search with nothing to show: a title, an optional description, and an optional icon.',
    },
    Carousel: {
      props: s.carouselProps,
      slots: ['default'],
      description:
        'Horizontally scrolling carousel with previous and next buttons. Each child is one slide. slideSize sets how much of the track one slide takes (full, lg, md for two, sm for three).',
    },
    Progress: {
      props: s.progressProps,
      description:
        'Progress bar. Leave value out when progress is unknown; it then shows an animated bar.',
    },
    Skeleton: {
      props: s.skeletonProps,
      description: 'Loading placeholder.',
    },
    Icon: { props: s.iconProps, description: 'Icon, chosen by name.' },
    ChevronIcon: {
      props: s.chevronIconProps,
      description: 'Arrow icon. direction sets which way it points.',
    },
    StatusIcon: {
      props: s.statusIconProps,
      description:
        'Icon for a status (success/info/warning/error). It is decorative; to show a message, use Alert.',
    },
    IconButton: {
      props: s.iconButtonProps,
      description:
        'Icon-only button (label is required and shown as its tooltip).',
    },
    CopyButton: {
      props: s.copyButtonProps,
      description:
        'Button that copies value to the clipboard and confirms it. With iconOnly, label becomes its tooltip.',
    },
    Textarea: {
      props: s.textareaProps,
      description:
        'Multi-line text input. defaultValue can be bound to state with $bindState.',
    },
    PasswordInput: {
      props: s.passwordInputProps,
      description:
        'Password input. defaultValue can be bound to state with $bindState.',
    },
    NumberField: {
      props: s.numberFieldProps,
      description:
        'Number input. defaultValue can be bound to state with $bindState.',
    },
    Slider: {
      props: s.sliderProps,
      description:
        'Slider. defaultValue can be bound to state with $bindState.',
    },
    RangeSlider: {
      props: s.rangeSliderProps,
      description:
        'Slider with two thumbs for picking a range. defaultValue ([lower, upper]) can be bound to state with $bindState.',
    },
    DateField: {
      props: s.dateFieldProps,
      description:
        'Date input with a visible label. Dates are YYYY-MM-DD strings. defaultValue can be bound to state with $bindState.',
    },
    DatePicker: {
      props: s.datePickerProps,
      description:
        'Date input with a visible label and a button that opens a calendar. Dates are YYYY-MM-DD strings. defaultValue can be bound to state with $bindState.',
    },
    Calendar: {
      props: s.calendarProps,
      description:
        'Month calendar shown inline for picking one day (YYYY-MM-DD). It submits nothing; in a form, use DatePicker. defaultValue can be bound to state with $bindState.',
    },
    Radio: {
      props: s.radioProps,
      description:
        'Radio buttons for a single choice. defaultValue can be bound to state with $bindState.',
    },
    RadioCard: {
      props: s.radioCardProps,
      description:
        'Single choice presented as cards. defaultValue can be bound to state with $bindState.',
    },
    CheckboxCard: {
      props: s.checkboxCardProps,
      description:
        'Multiple choice presented as cards. defaultValue can be bound to state with $bindState.',
    },
    Pagination: {
      props: s.paginationProps,
      description:
        'Pagination. defaultPage can be bound to state with $bindState.',
    },
    Form: {
      props: s.formProps,
      slots: ['default'],
      description: 'Wrapper for form elements (a vertical layout).',
    },
    Modal: {
      props: s.modalProps,
      slots: ['default'],
      description:
        'Modal dialog. A self-contained widget that opens from a button labeled triggerLabel.',
    },
    Dialog: {
      props: s.dialogProps,
      slots: ['default'],
      description:
        'Centered dialog that opens from a button labeled triggerLabel.',
    },
    Drawer: {
      props: s.drawerProps,
      slots: ['default'],
      description: 'Side drawer that opens from a button labeled triggerLabel.',
    },
    Popover: {
      props: s.popoverProps,
      slots: ['default'],
      description:
        'Popover that a button labeled triggerLabel opens and closes.',
    },
    Tooltip: {
      props: s.tooltipProps,
      description: 'Tooltip shown on hover or focus.',
    },
    DropdownMenu: {
      props: s.dropdownMenuProps,
      description: 'Dropdown menu.',
    },
    Toast: {
      props: s.toastProps,
      description:
        'Toast notification that a button labeled triggerLabel shows.',
    },
    ListBox: {
      props: s.listBoxProps,
      description: 'Single-choice list in a popup.',
    },
    CheckboxGroup: {
      props: s.checkboxGroupProps,
      description: 'Group of checkboxes.',
    },
    Combobox: {
      props: s.comboboxProps,
      description:
        'Text field with a visible label that filters a list of options as you type, for picking one. Prefer it to ListBox when there are many options. defaultValue can be bound to state with $bindState.',
    },
    Autocomplete: {
      props: s.autocompleteProps,
      description: 'Tag-style autocomplete for multiple choices.',
    },
    FileField: {
      props: s.fileFieldProps,
      description:
        'File picker field. With dropzone, files can also be dropped onto it.',
    },
    FormControl: {
      props: s.formControlProps,
      description:
        'Field with a label and help or error text (text/textarea/password).',
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
  'Every row in rows of a Table must have exactly as many cells as there are columns.',
  'An href must be an absolute URL starting with https:// or http://, or a path starting with /.',
  'The content of Tabs and Accordion must be plain text; components cannot be nested inside it.',
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
): readonly string[] | undefined => {
  // `instanceof z.ZodObject` で判定しない。スキーマはこのパッケージが解決した
  // zod で作られるが、比較するクラスも同じ import から来るとは限らず、
  // 利用者側で zod が 2 コピーになると instanceof が一律 false になって
  // 未知キー検出が無言で全停止する（この関数が防ぎたい失敗そのもの）。
  const shape: unknown = 'shape' in propsSchema ? propsSchema.shape : undefined;
  return typeof shape === 'object' && shape !== null
    ? Object.keys(shape)
    : undefined;
};

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
