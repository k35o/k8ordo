'use client';

import type { ComponentRenderProps } from '@openuidev/react-lang';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

import { buildComponentLibrary } from '../_shared/openui-defs';
import * as ui from '../_shared/renderers';
import type * as sc from '../_shared/schemas';
import {
  AutocompleteView,
  CheckboxCardView,
  CheckboxGroupView,
  CheckboxView,
  ListBoxView,
  NumberFieldView,
  PaginationView,
  PasswordInputView,
  RadioCardView,
  RadioView,
  SelectView,
  SliderView,
  SwitchView,
  TextareaView,
  TextFieldView,
} from './form-views';

/**
 * `@k8ordo/ui/openui`（'use client'）
 *
 * `<Renderer library={library} response={openuiLang} />` に渡すライブラリ。
 * スキーマ・説明・子要素の構成は React 非依存の共有ファクトリ
 * （`../_shared/openui-defs`）が持ち、ここでは描画関数だけを差し込む。
 *
 * サーバーでシステムプロンプトだけ生成したい場合は、
 * サーバー安全な `@k8ordo/ui/openui/prompt` を使う。
 *
 * 合成モデルの違い: 子要素は json-render の slots ではなく、
 * `z.array(Child.ref)` という型付きサブコンポーネントの prop で表す。
 * NOTE: OpenUI は自己参照スキーマを安定して扱えないため、Stack/Grid 自身の
 * 入れ子は非対応（Card には Stack/Grid を入れられる）。
 */

type ContainerRenderProps<P> = ComponentRenderProps<
  P & { children: ReadonlyArray<{ typeName: string }> }
>;

// コンテナの子要素描画（Stack / Card など共通）。位置で固定なので index キーで問題ない。
const renderChildren = (
  children: ReadonlyArray<{ typeName: string }>,
  renderNode: (value: unknown) => ReactNode,
): ReactNode =>
  children.map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key -- 静的な位置リスト
    <Fragment key={`${child.typeName}-${index}`}>{renderNode(child)}</Fragment>
  ));

const renderers = {
  Stack: ({ props, renderNode }: ContainerRenderProps<sc.StackProps>) =>
    ui.renderStack(props, renderChildren(props.children, renderNode)),
  Grid: ({ props, renderNode }: ContainerRenderProps<sc.GridProps>) =>
    ui.renderGrid(props, renderChildren(props.children, renderNode)),
  Card: ({ props, renderNode }: ContainerRenderProps<sc.CardProps>) =>
    ui.renderCard(props, renderChildren(props.children, renderNode)),
  Form: ({ props, renderNode }: ContainerRenderProps<sc.FormProps>) =>
    ui.renderForm(props, renderChildren(props.children, renderNode)),

  Modal: ({ props, renderNode }: ContainerRenderProps<sc.ModalProps>) => (
    <ui.ModalWidget props={props}>
      {renderChildren(props.children, renderNode)}
    </ui.ModalWidget>
  ),
  Dialog: ({ props, renderNode }: ContainerRenderProps<sc.DialogProps>) => (
    <ui.DialogWidget props={props}>
      {renderChildren(props.children, renderNode)}
    </ui.DialogWidget>
  ),
  Drawer: ({ props, renderNode }: ContainerRenderProps<sc.DrawerProps>) => (
    <ui.DrawerWidget props={props}>
      {renderChildren(props.children, renderNode)}
    </ui.DrawerWidget>
  ),
  Popover: ({ props, renderNode }: ContainerRenderProps<sc.PopoverProps>) =>
    ui.renderPopover(props, renderChildren(props.children, renderNode)),
  Tooltip: ({ props }: ComponentRenderProps<sc.TooltipProps>) =>
    ui.renderTooltip(props),
  DropdownMenu: ({ props }: ComponentRenderProps<sc.DropdownMenuProps>) =>
    ui.renderDropdownMenu(props),
  Toast: ({ props }: ComponentRenderProps<sc.ToastProps>) => (
    <ui.ToastWidget props={props} />
  ),

  Button: ({ props }: ComponentRenderProps<sc.ButtonProps>) =>
    ui.renderButton(props),
  IconButton: ({ props }: ComponentRenderProps<sc.IconButtonProps>) =>
    ui.renderIconButton(props),
  Badge: ({ props }: ComponentRenderProps<sc.BadgeProps>) =>
    ui.renderBadge(props),
  Heading: ({ props }: ComponentRenderProps<sc.HeadingProps>) =>
    ui.renderHeading(props),
  Anchor: ({ props }: ComponentRenderProps<sc.AnchorProps>) =>
    ui.renderAnchor(props),
  Avatar: ({ props }: ComponentRenderProps<sc.AvatarProps>) =>
    ui.renderAvatar(props),
  Code: ({ props }: ComponentRenderProps<sc.CodeProps>) => ui.renderCode(props),
  Icon: ({ props }: ComponentRenderProps<sc.IconProps>) => ui.renderIcon(props),
  ChevronIcon: ({ props }: ComponentRenderProps<sc.ChevronIconProps>) =>
    ui.renderChevronIcon(props),
  StatusIcon: ({ props }: ComponentRenderProps<sc.StatusIconProps>) =>
    ui.renderStatusIcon(props),
  Alert: ({ props }: ComponentRenderProps<sc.AlertProps>) =>
    ui.renderAlert(props),
  Spinner: ({ props }: ComponentRenderProps<sc.SpinnerProps>) =>
    ui.renderSpinner(props),
  Progress: ({ props }: ComponentRenderProps<sc.ProgressProps>) =>
    ui.renderProgress(props),
  Skeleton: ({ props }: ComponentRenderProps<sc.SkeletonProps>) =>
    ui.renderSkeleton(props),
  Separator: ({ props }: ComponentRenderProps<sc.SeparatorProps>) =>
    ui.renderSeparator(props),
  ScrollLinked: ({ props }: ComponentRenderProps<sc.ScrollLinkedProps>) =>
    ui.renderScrollLinked(props),
  Tabs: ({ props }: ComponentRenderProps<sc.TabsProps>) => ui.renderTabs(props),
  Accordion: ({ props }: ComponentRenderProps<sc.AccordionProps>) =>
    ui.renderAccordion(props),
  Breadcrumb: ({ props }: ComponentRenderProps<sc.BreadcrumbProps>) =>
    ui.renderBreadcrumb(props),
  Table: ({ props }: ComponentRenderProps<sc.TableProps>) =>
    ui.renderTable(props),

  TextField: TextFieldView,
  Textarea: TextareaView,
  PasswordInput: PasswordInputView,
  NumberField: NumberFieldView,
  Slider: SliderView,
  Checkbox: CheckboxView,
  Switch: SwitchView,
  Select: SelectView,
  Radio: RadioView,
  RadioCard: RadioCardView,
  CheckboxCard: CheckboxCardView,
  Pagination: PaginationView,
  ListBox: ListBoxView,
  CheckboxGroup: CheckboxGroupView,
  Autocomplete: AutocompleteView,
  FileField: ({ props }: ComponentRenderProps<sc.FileFieldProps>) => (
    <ui.FileFieldWidget props={props} />
  ),
  FormControl: ({ props }: ComponentRenderProps<sc.FormControlProps>) => (
    <ui.FormControlWidget props={props} />
  ),
};

export const library = buildComponentLibrary(renderers);
