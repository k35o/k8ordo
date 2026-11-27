'use client';

import type { ReactNode } from 'react';

import type {
  CatalogEventOf,
  CatalogName,
  CatalogProps,
  CatalogValueOf,
} from './index';
import * as ui from './renderers';

/**
 * What a format hands the renderer of the component `N`: the props the model
 * wrote, the children the format drew, for a field its value and the setter
 * the format's state is written through, and for a component with events the
 * handlers of the ones the model bound.
 */
export type RenderArgs<N extends CatalogName> = {
  /**
   * Values that fit the entry's `props` schema, with no `null`: a prop the
   * model left out is absent or `undefined`. The glue drops the `null` keys a
   * format wrote (OpenUI Lang writes an omitted value as `null`), nested ones
   * included, parses the rest with the schema, and passes what the parse
   * returns; it draws nothing for an element that fails.
   */
  props: CatalogProps<N>;
  /** One node per child, keyed (`Children.toArray` keys them). Empty for a component without children. */
  children: readonly ReactNode[];
} & ([CatalogValueOf<N>] extends [never]
  ? unknown
  : {
      value: CatalogValueOf<N>;
      setValue: (next: CatalogValueOf<N>) => void;
    }) &
  ([CatalogEventOf<N>] extends [never]
    ? unknown
    : {
        /**
         * The handler of each event the model bound, by name. An event left out
         * is unbound, and the component draws as if it had no such event: a
         * card is not pressable, a button presses to no effect.
         */
        on?: Partial<Record<CatalogEventOf<N>, () => void | Promise<void>>>;
      });

/** Draws the component `N` with `@k8ordo/ui`. */
export type Renderer<N extends CatalogName> = (
  args: RenderArgs<N>,
) => ReactNode;

/**
 * `@k8ordo/ui/catalog/render` ('use client')
 *
 * How each component of `@k8ordo/ui/catalog` is drawn, with the same names.
 * A format's renderer looks the component up here and calls it with the props
 * and children it resolved; a field also gets the value the format holds and
 * a setter for it, so the format decides where the value lives.
 *
 * @example
 * 'use client';
 * import { renderers } from '@k8ordo/ui/catalog/render';
 *
 * renderers.Button({ props: { label: 'OK' }, children: [] });
 */
export const renderers: { [N in CatalogName]: Renderer<N> } = {
  Stack: ({ props, children }) => ui.renderStack(props, children),
  Grid: ({ props, children }) => ui.renderGrid(props, children),
  Card: ({ props, children, on }) => ui.renderCard(props, children, on?.press),
  Form: ({ props, children }) => ui.renderForm(props, children),
  Carousel: ({ props, children }) => ui.renderCarousel(props, children),
  Button: ({ props, on }) => ui.renderButton(props, on?.press),
  IconButton: ({ props, on }) => ui.renderIconButton(props, on?.press),
  CopyButton: ({ props }) => ui.renderCopyButton(props),
  Toolbar: ({ props }) => ui.renderToolbar(props),
  Anchor: ({ props }) => ui.renderAnchor(props),
  Breadcrumb: ({ props }) => ui.renderBreadcrumb(props),
  Pagination: ({ props, value, setValue }) =>
    ui.renderPagination(props, value, setValue),
  Stepper: ({ props }) => ui.renderStepper(props),
  SideNav: ({ props }) => ui.renderSideNav(props),
  Badge: ({ props }) => ui.renderBadge(props),
  Heading: ({ props }) => ui.renderHeading(props),
  Avatar: ({ props }) => ui.renderAvatar(props),
  Code: ({ props }) => ui.renderCode(props),
  Kbd: ({ props }) => ui.renderKbd(props),
  EmptyState: ({ props }) => ui.renderEmptyState(props),
  Icon: ({ props }) => ui.renderIcon(props),
  Alert: ({ props }) => ui.renderAlert(props),
  Callout: ({ props }) => ui.renderCallout(props),
  Spinner: ({ props }) => ui.renderSpinner(props),
  Progress: ({ props }) => ui.renderProgress(props),
  Skeleton: ({ props }) => ui.renderSkeleton(props),
  Separator: ({ props }) => ui.renderSeparator(props),
  Tabs: ({ props }) => ui.renderTabs(props),
  Accordion: ({ props }) => ui.renderAccordion(props),
  Table: ({ props }) => ui.renderTable(props),
  DataTable: ({ props }) => <ui.DataTableWidget props={props} />,
  Tree: ({ props }) => ui.renderTree(props),
  Dialog: ({ props, children }) => (
    <ui.DialogWidget props={props}>{children}</ui.DialogWidget>
  ),
  Drawer: ({ props, children }) => (
    <ui.DrawerWidget props={props}>{children}</ui.DrawerWidget>
  ),
  Popover: ({ props, children }) => ui.renderPopover(props, children),
  Tooltip: ({ props }) => ui.renderTooltip(props),
  DropdownMenu: ({ props, children }) => ui.renderDropdownMenu(props, children),
  DropdownMenuItem: ({ props, on }) =>
    ui.renderDropdownMenuItem(props, on?.press),
  Toast: ({ props }) => <ui.ToastWidget props={props} />,
  TextField: ({ props, value, setValue }) =>
    ui.renderTextField(props, value, setValue),
  Textarea: ({ props, value, setValue }) =>
    ui.renderTextarea(props, value, setValue),
  PasswordInput: ({ props, value, setValue }) =>
    ui.renderPasswordInput(props, value, setValue),
  NumberField: ({ props, value, setValue }) =>
    ui.renderNumberField(props, value, setValue),
  Slider: ({ props, value, setValue }) =>
    ui.renderSlider(props, value, setValue),
  RangeSlider: ({ props, value, setValue }) =>
    ui.renderRangeSlider(props, value, setValue),
  DatePicker: ({ props, value, setValue }) =>
    ui.renderDatePicker(props, value, setValue),
  Calendar: ({ props, value, setValue }) =>
    ui.renderCalendar(props, value, setValue),
  ColorPicker: ({ props, value, setValue }) =>
    ui.renderColorPicker(props, value, setValue),
  Combobox: ({ props, value, setValue }) =>
    ui.renderCombobox(props, value, setValue),
  Checkbox: ({ props, value, setValue }) =>
    ui.renderCheckbox(props, value, setValue),
  Switch: ({ props, value, setValue }) =>
    ui.renderSwitch(props, value, setValue),
  Select: ({ props, value, setValue }) =>
    ui.renderSelect(props, value, setValue),
  Radio: ({ props, value, setValue }) => ui.renderRadio(props, value, setValue),
  RadioCard: ({ props, value, setValue }) =>
    ui.renderRadioCard(props, value, setValue),
  CheckboxCard: ({ props, value, setValue }) =>
    ui.renderCheckboxCard(props, value, setValue),
  ListBox: ({ props, value, setValue }) =>
    ui.renderListBox(props, value, setValue),
  CheckboxGroup: ({ props, value, setValue }) =>
    ui.renderCheckboxGroup(props, value, setValue),
  Autocomplete: ({ props, value, setValue }) =>
    ui.renderAutocomplete(props, value, setValue),
  FileField: ({ props }) => <ui.FileFieldWidget props={props} />,
};
