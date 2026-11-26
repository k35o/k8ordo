'use client';

import type { ReactNode } from 'react';

import type { CatalogName, CatalogProps, CatalogValueOf } from './index';
import * as ui from './renderers';

/**
 * What a format hands the renderer of the component `N`: the props the model
 * wrote, the children the format drew, and — for a field — its value and the
 * setter the format's state is written through.
 */
export type RenderArgs<N extends CatalogName> = {
  props: CatalogProps<N>;
  /** One node per child, keyed (`Children.toArray` keys them). Empty for a component without children. */
  children: readonly ReactNode[];
} & ([CatalogValueOf<N>] extends [never]
  ? unknown
  : {
      value: CatalogValueOf<N>;
      setValue: (next: CatalogValueOf<N>) => void;
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
  Card: ({ props, children }) => ui.renderCard(props, children),
  Form: ({ props, children }) => ui.renderForm(props, children),
  Carousel: ({ props, children }) => ui.renderCarousel(props, children),
  Button: ({ props }) => ui.renderButton(props),
  IconButton: ({ props }) => ui.renderIconButton(props),
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
  ChevronIcon: ({ props }) => ui.renderChevronIcon(props),
  StatusIcon: ({ props }) => ui.renderStatusIcon(props),
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
  DateField: ({ props, value, setValue }) =>
    ui.renderDateField(props, value, setValue),
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
  FormControl: ({ props }) => <ui.FormControlWidget props={props} />,
};
