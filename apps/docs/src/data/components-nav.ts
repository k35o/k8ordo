import type { Message } from '@k8ordo/i18n';

import * as m from '../messages';
import type { NavCategory, NavItem } from './nav-types';

type Page = Omit<NavItem, 'name'> & {
  /** The export the page documents, when it is not named after one. */
  component?: string;
};

export const pages = {
  Accordion: {
    path: '/:locale/ui/components/accordion',
    description: m.components.accordion.description,
  },
  Alert: {
    path: '/:locale/ui/components/alert',
    description: m.components.alert.description,
  },
  Anchor: {
    path: '/:locale/ui/components/anchor',
    description: m.components.anchor.description,
  },
  Autocomplete: {
    path: '/:locale/ui/components/autocomplete',
    description: m.components.autocomplete.description,
  },
  Avatar: {
    path: '/:locale/ui/components/avatar',
    description: m.components.avatar.description,
  },
  Badge: {
    path: '/:locale/ui/components/badge',
    description: m.components.badge.description,
  },
  Breadcrumb: {
    path: '/:locale/ui/components/breadcrumb',
    description: m.components.breadcrumb.description,
  },
  Button: {
    path: '/:locale/ui/components/button',
    description: m.components.button.description,
  },
  Calendar: {
    path: '/:locale/ui/components/calendar',
    description: m.components.calendar.description,
  },
  Callout: {
    path: '/:locale/ui/components/callout',
    description: m.components.callout.description,
  },
  Card: {
    path: '/:locale/ui/components/card',
    description: m.components.card.description,
  },
  Carousel: {
    path: '/:locale/ui/components/carousel',
    description: m.components.carousel.description,
  },
  Checkbox: {
    path: '/:locale/ui/components/checkbox',
    description: m.components.checkbox.description,
  },
  CheckboxCard: {
    path: '/:locale/ui/components/checkbox-card',
    description: m.components.checkboxCard.description,
  },
  CheckboxGroup: {
    path: '/:locale/ui/components/checkbox-group',
    description: m.components.checkboxGroup.description,
  },
  Code: {
    path: '/:locale/ui/components/code',
    description: m.components.code.description,
  },
  CodeBlock: {
    path: '/:locale/ui/components/code-block',
    description: m.components.codeBlock.description,
  },
  ColorPicker: {
    path: '/:locale/ui/components/color-picker',
    description: m.components.colorPicker.description,
  },
  Combobox: {
    path: '/:locale/ui/components/combobox',
    description: m.components.combobox.description,
  },
  CommandPalette: {
    path: '/:locale/ui/components/command-palette',
    description: m.components.commandPalette.description,
  },
  ContextMenu: {
    path: '/:locale/ui/components/context-menu',
    description: m.components.contextMenu.description,
  },
  CopyButton: {
    path: '/:locale/ui/components/copy-button',
    description: m.components.copyButton.description,
  },
  DataTable: {
    path: '/:locale/ui/components/data-table',
    description: m.components.dataTable.description,
  },
  DateField: {
    path: '/:locale/ui/components/date-field',
    description: m.components.dateField.description,
  },
  DatePicker: {
    path: '/:locale/ui/components/date-picker',
    description: m.components.datePicker.description,
  },
  Dialog: {
    path: '/:locale/ui/components/dialog',
    description: m.components.dialog.description,
  },
  Drawer: {
    path: '/:locale/ui/components/drawer',
    description: m.components.drawer.description,
  },
  DropdownMenu: {
    path: '/:locale/ui/components/dropdown-menu',
    description: m.components.dropdownMenu.description,
  },
  EmptyState: {
    path: '/:locale/ui/components/empty-state',
    description: m.components.emptyState.description,
  },
  FileField: {
    path: '/:locale/ui/components/file-field',
    description: m.components.fileField.description,
  },
  Form: {
    path: '/:locale/ui/components/form',
    description: m.components.form.description,
  },
  FormControl: {
    path: '/:locale/ui/components/form-control',
    description: m.components.formControl.description,
  },
  Grid: {
    path: '/:locale/ui/components/grid',
    description: m.components.grid.description,
  },
  Heading: {
    path: '/:locale/ui/components/heading',
    description: m.components.heading.description,
  },
  IconButton: {
    path: '/:locale/ui/components/icon-button',
    description: m.components.iconButton.description,
  },
  Icons: {
    path: '/:locale/ui/components/icons',
    description: m.components.icons.description,
    component: 'CheckIcon',
  },
  InView: {
    path: '/:locale/ui/components/in-view',
    description: m.components.inView.description,
  },
  Kbd: {
    path: '/:locale/ui/components/kbd',
    description: m.components.kbd.description,
  },
  ListBox: {
    path: '/:locale/ui/components/list-box',
    description: m.components.listBox.description,
  },
  Modal: {
    path: '/:locale/ui/components/modal',
    description: m.components.modal.description,
  },
  NumberField: {
    path: '/:locale/ui/components/number-field',
    description: m.components.numberField.description,
  },
  Pagination: {
    path: '/:locale/ui/components/pagination',
    description: m.components.pagination.description,
  },
  PasswordInput: {
    path: '/:locale/ui/components/password-input',
    description: m.components.passwordInput.description,
  },
  Popover: {
    path: '/:locale/ui/components/popover',
    description: m.components.popover.description,
  },
  Progress: {
    path: '/:locale/ui/components/progress',
    description: m.components.progress.description,
  },
  Prose: {
    path: '/:locale/ui/components/prose',
    description: m.components.prose.description,
  },
  Radio: {
    path: '/:locale/ui/components/radio',
    description: m.components.radio.description,
  },
  RadioCard: {
    path: '/:locale/ui/components/radio-card',
    description: m.components.radioCard.description,
  },
  RangeSlider: {
    path: '/:locale/ui/components/range-slider',
    description: m.components.rangeSlider.description,
  },
  ResizablePanels: {
    path: '/:locale/ui/components/resizable-panels',
    description: m.components.resizablePanels.description,
  },
  Resize: {
    path: '/:locale/ui/components/resize',
    description: m.components.resize.description,
  },
  Select: {
    path: '/:locale/ui/components/select',
    description: m.components.select.description,
  },
  Separator: {
    path: '/:locale/ui/components/separator',
    description: m.components.separator.description,
  },
  SideNav: {
    path: '/:locale/ui/components/side-nav',
    description: m.components.sideNav.description,
  },
  Skeleton: {
    path: '/:locale/ui/components/skeleton',
    description: m.components.skeleton.description,
  },
  Slider: {
    path: '/:locale/ui/components/slider',
    description: m.components.slider.description,
  },
  Spinner: {
    path: '/:locale/ui/components/spinner',
    description: m.components.spinner.description,
  },
  Stack: {
    path: '/:locale/ui/components/stack',
    description: m.components.stack.description,
  },
  Stepper: {
    path: '/:locale/ui/components/stepper',
    description: m.components.stepper.description,
  },
  Switch: {
    path: '/:locale/ui/components/switch',
    description: m.components.switchInput.description,
  },
  Table: {
    path: '/:locale/ui/components/table',
    description: m.components.table.description,
  },
  TableOfContents: {
    path: '/:locale/ui/components/table-of-contents',
    description: m.components.tableOfContents.description,
  },
  Tabs: {
    path: '/:locale/ui/components/tabs',
    description: m.components.tabs.description,
  },
  Textarea: {
    path: '/:locale/ui/components/textarea',
    description: m.components.textarea.description,
  },
  TextField: {
    path: '/:locale/ui/components/text-field',
    description: m.components.textField.description,
  },
  Toast: {
    path: '/:locale/ui/components/toast',
    description: m.components.toast.description,
    component: 'ToastProvider',
  },
  Toolbar: {
    path: '/:locale/ui/components/toolbar',
    description: m.components.toolbar.description,
  },
  Tooltip: {
    path: '/:locale/ui/components/tooltip',
    description: m.components.tooltip.description,
  },
  Tree: {
    path: '/:locale/ui/components/tree',
    description: m.components.tree.description,
  },
} as const satisfies Record<string, Page>;

export type ComponentNavName = keyof typeof pages;

// Keyed by the folder under `@k8ordo/ui`'s `src/components/`, in sidebar order.
export const categoryTitles = {
  buttons: m.components.categoryButtons,
  navigation: m.components.categoryNavigation,
  form: m.components.categoryForms,
  'data-display': m.components.categoryDataDisplay,
  feedback: m.components.categoryFeedback,
  overlays: m.components.categoryOverlays,
  layout: m.components.categoryLayout,
  observers: m.components.categoryObservers,
  icons: m.components.categoryIcons,
} as const satisfies Record<string, Message>;

export type ComponentCategory = keyof typeof categoryTitles;

/**
 * The pages grouped by category. Plain strings, so a Server Component can
 * work them out from the generated props and hand them to the client.
 */
export type ComponentGroups = ReadonlyArray<{
  category: ComponentCategory;
  names: readonly ComponentNavName[];
}>;

export const componentCategoriesOf = (
  groups: ComponentGroups,
): readonly NavCategory[] =>
  groups.map(({ category, names }) => ({
    title: categoryTitles[category],
    items: names.map((name) => ({
      name,
      path: pages[name].path,
      description: pages[name].description,
    })),
  }));
