'use client';

import type { Spec } from '@json-render/core';
import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useBoundProp,
} from '@json-render/react';
import type { FC } from 'react';
import { useState } from 'react';

import * as ui from '../_shared/renderers';
import { catalog } from './catalog';

/**
 * `@k8ordo/ui/json-render/registry`（'use client'）
 *
 * `<Renderer registry={registry} spec={...} />` に渡す実装対応表。
 * フックを使うためクライアント専用。プロンプト生成だけ行いたい場合は
 * サーバー安全な `@k8ordo/ui/json-render`（catalog）を使う。
 */

// defaultValue（または defaultChecked / defaultPage）に $bindState の束縛が
// あれば json-render の状態に、無ければローカル state に接続する共通フック。
const useBoundOrLocal = <T,>(
  sourceValue: T | undefined,
  path: string | undefined,
  fallback: T,
  initial: T = sourceValue ?? fallback,
): readonly [T, (next: T) => void] => {
  const hasBinding = path !== undefined && path !== '';
  const [bound, setBound] = useBoundProp<T>(sourceValue, path);
  const [local, setLocal] = useState(initial);
  const value = hasBinding ? (bound ?? fallback) : local;
  return [value, hasBinding ? setBound : setLocal] as const;
};

export const { registry } = defineRegistry(catalog, {
  components: {
    Stack: ({ props, children }) => ui.renderStack(props, children),
    Grid: ({ props, children }) => ui.renderGrid(props, children),
    Card: ({ props, children }) => ui.renderCard(props, children),
    Button: ({ props }) => ui.renderButton(props),
    Badge: ({ props }) => ui.renderBadge(props),
    Heading: ({ props }) => ui.renderHeading(props),
    Alert: ({ props }) => ui.renderAlert(props),
    Spinner: ({ props }) => ui.renderSpinner(props),
    Separator: ({ props }) => ui.renderSeparator(props),
    Tabs: ({ props }) => ui.renderTabs(props),

    // フォームは json-render の状態機構に接続。
    // spec が `defaultValue: { $bindState: "..." }` を使うと双方向束縛になり、
    // 束縛が無い場合はローカル state でインタラクティブに動く。
    TextField: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
      );
      return ui.renderTextField(props, value, setValue);
    },
    Checkbox: ({ props, bindings }) => {
      const [checked, setChecked] = useBoundOrLocal<boolean>(
        props.defaultChecked,
        bindings?.defaultChecked,
        false,
      );
      return ui.renderCheckbox(props, checked, setChecked);
    },
    Switch: ({ props, bindings }) => {
      const [checked, setChecked] = useBoundOrLocal<boolean>(
        props.defaultChecked,
        bindings?.defaultChecked,
        false,
      );
      return ui.renderSwitch(props, checked, setChecked);
    },
    Select: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
        props.defaultValue ?? props.options[0]?.value ?? '',
      );
      return ui.renderSelect(props, value, setValue);
    },

    Anchor: ({ props }) => ui.renderAnchor(props),
    Avatar: ({ props }) => ui.renderAvatar(props),
    Code: ({ props }) => ui.renderCode(props),
    Progress: ({ props }) => ui.renderProgress(props),
    Skeleton: ({ props }) => ui.renderSkeleton(props),
    Icon: ({ props }) => ui.renderIcon(props),
    ChevronIcon: ({ props }) => ui.renderChevronIcon(props),
    StatusIcon: ({ props }) => ui.renderStatusIcon(props),
    IconButton: ({ props }) => ui.renderIconButton(props),
    Accordion: ({ props }) => ui.renderAccordion(props),
    Breadcrumb: ({ props }) => ui.renderBreadcrumb(props),
    Table: ({ props }) => ui.renderTable(props),

    Textarea: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
      );
      return ui.renderTextarea(props, value, setValue);
    },
    PasswordInput: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
      );
      return ui.renderPasswordInput(props, value, setValue);
    },
    Radio: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
        props.defaultValue ?? props.options[0]?.value ?? '',
      );
      return ui.renderRadio(props, value, setValue);
    },
    RadioCard: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string>(
        props.defaultValue,
        bindings?.defaultValue,
        '',
        props.defaultValue ?? props.options[0]?.value ?? '',
      );
      return ui.renderRadioCard(props, value, setValue);
    },

    NumberField: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<number>(
        props.defaultValue,
        bindings?.defaultValue,
        0,
      );
      return ui.renderNumberField(props, value, setValue);
    },
    Slider: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<number>(
        props.defaultValue,
        bindings?.defaultValue,
        0,
        props.defaultValue ?? props.min ?? 0,
      );
      return ui.renderSlider(props, value, setValue);
    },

    CheckboxCard: ({ props, bindings }) => {
      const [value, setValue] = useBoundOrLocal<string[]>(
        props.defaultValue,
        bindings?.defaultValue,
        [],
      );
      return ui.renderCheckboxCard(props, value, setValue);
    },

    Pagination: ({ props, bindings }) => {
      const [page, setPage] = useBoundOrLocal<number>(
        props.defaultPage,
        bindings?.defaultPage,
        1,
      );
      return ui.renderPagination(props, page, setPage);
    },

    Form: ({ props, children }) => ui.renderForm(props, children),

    Modal: ({ props, children }) => (
      <ui.ModalWidget props={props}>{children}</ui.ModalWidget>
    ),
    Dialog: ({ props, children }) => (
      <ui.DialogWidget props={props}>{children}</ui.DialogWidget>
    ),
    Drawer: ({ props, children }) => (
      <ui.DrawerWidget props={props}>{children}</ui.DrawerWidget>
    ),
    Popover: ({ props, children }) => ui.renderPopover(props, children),
    Tooltip: ({ props }) => ui.renderTooltip(props),
    DropdownMenu: ({ props }) => ui.renderDropdownMenu(props),
    Toast: ({ props }) => <ui.ToastWidget props={props} />,

    ScrollLinked: ({ props }) => ui.renderScrollLinked(props),

    ListBox: ({ props, bindings }) => {
      const path = bindings?.defaultValue;
      const hasBinding = path !== undefined && path !== '';
      const [bound, setBound] = useBoundProp<string>(props.defaultValue, path);
      const [local, setLocal] = useState(
        props.defaultValue ?? props.options[0]?.value ?? '',
      );
      const value = hasBinding ? (bound ?? '') : local;
      const setValue = hasBinding ? setBound : setLocal;
      return ui.renderListBox(props, value, setValue);
    },
    CheckboxGroup: ({ props, bindings }) => {
      const path = bindings?.defaultValue;
      const hasBinding = path !== undefined && path !== '';
      const [bound, setBound] = useBoundProp<string[]>(
        props.defaultValue,
        path,
      );
      const [local, setLocal] = useState(props.defaultValue ?? []);
      const value = hasBinding ? (bound ?? []) : local;
      const setValue = hasBinding ? setBound : setLocal;
      return ui.renderCheckboxGroup(props, value, setValue);
    },
    Autocomplete: ({ props, bindings }) => {
      const path = bindings?.defaultValue;
      const hasBinding = path !== undefined && path !== '';
      const [bound, setBound] = useBoundProp<string[]>(
        props.defaultValue,
        path,
      );
      const [local, setLocal] = useState(props.defaultValue ?? []);
      const value = hasBinding ? (bound ?? []) : local;
      const setValue = hasBinding ? setBound : setLocal;
      return ui.renderAutocomplete(props, value, setValue);
    },
    FileField: ({ props }) => <ui.FileFieldWidget props={props} />,
    FormControl: ({ props }) => <ui.FormControlWidget props={props} />,
  },
});

/**
 * spec を @k8ordo/ui の部品で描画する、事前結線済みコンポーネント。
 *
 * `JSONUIProvider` と `Renderer` を内部で結線し registry も渡し済みなので、
 * 利用者は spec を渡すだけでよい（上流の生 import や 'use client' 境界ファイルの
 * 自作が不要）。フォーム値を回収したいときは `onStateChange` を渡す。
 * 高度な構成（navigate / handlers / validationFunctions など）が必要なら、
 * 引き続き `registry` を `JSONUIProvider` に直接渡す。
 *
 * @example
 * 'use client';
 * import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';
 *
 * <JsonRenderUI spec={spec} />
 */
export const JsonRenderUI: FC<{
  spec: Spec | null;
  loading?: boolean;
  onStateChange?: (changes: Array<{ path: string; value: unknown }>) => void;
}> = ({ spec, loading, onStateChange }) => (
  <JSONUIProvider registry={registry} onStateChange={onStateChange}>
    <Renderer registry={registry} spec={spec} loading={loading} />
  </JSONUIProvider>
);
