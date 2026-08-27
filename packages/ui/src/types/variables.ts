export type Status = 'success' | 'info' | 'warning' | 'error';

export type Direction = 'up' | 'down' | 'right' | 'left';

/**
 * アンカー要素を基準にしたオーバーレイ（Popover / Tooltip / DropdownMenu /
 * ListBox）の相対配置。物理方向と整列（alignment）の組み合わせ。
 * 旧 `@floating-ui/react` の `Placement` 互換のローカル定義。
 */
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * ビューポートのどこに貼り付くかで決まるオーバーレイ（Modal / Drawer）の配置。
 * アンカー要素からの相対配置である `Placement` とは別概念なので、prop 名も
 * `placement` ではなく `side` で分ける。
 */
export type ModalSide = 'center' | 'bottom' | 'left' | 'right';

/** Drawer は必ず縁から出るため、`center` を除いた `ModalSide` の部分集合。 */
export type DrawerSide = Extract<ModalSide, 'left' | 'right'>;

export type Option = Readonly<{
  value: string;
  label: string;
}>;
