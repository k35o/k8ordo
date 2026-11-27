import { z } from 'zod';

import * as s from './schemas';

/**
 * A field's value as a generative-UI format holds it: which prop carries the
 * value the field starts from, and what it starts from when nothing is bound.
 */
export type CatalogValue<P, V> = {
  /** The prop a format binds to its state (`defaultValue`, `defaultChecked`, `defaultPage`). */
  prop: keyof P & string;
  /** The value the field starts from when the format binds nothing to `prop`. */
  initial: (props: P) => V;
};

/** One component of the catalog, described without any generative-UI format. */
export type CatalogEntry<P extends z.ZodObject = z.ZodObject, V = never> = {
  /** What the component is, for the model. English, whatever the app's locale. */
  description: string;
  /**
   * The props a model may write. The key order is part of the contract (see `schemas.ts`).
   *
   * Some entries also check props against each other (a `Table` row against
   * its columns, a date `TextField`'s `defaultValue` against its `type`). zod keeps such a check only on this schema, and JSON Schema
   * leaves it out: derive a schema from it with `.safeExtend()` (`.omit()`,
   * `.pick()`, and `.partial()` throw), and apply the checks with a zod parse
   * or `catalogPropIssues`.
   */
  props: P;
  /** Present when the component lays out children of its own (Stack, Card, Dialog…). */
  children?: true;
  /** Present when the component is a field whose value a format can bind to its state. */
  value?: CatalogValue<z.infer<P>, V>;
  /**
   * What the user can do to the component that the application hears about,
   * by name, each described for the model. A format binds an event to its own
   * action (A2UI's `action`, json-render's `on`, an OpenUI action), and the
   * renderer receives the bound ones as `on`.
   */
  events?: Readonly<Record<string, string>>;
};

const entry = <
  P extends z.ZodObject,
  V = never,
  const E extends Readonly<Record<string, string>> = never,
>(
  definition: CatalogEntry<P, V> & { events?: E },
): CatalogEntry<P, V> & { events?: E } => definition;

const press = (description: string) => ({ press: description }) as const;

const firstOption = (props: {
  defaultValue?: string | undefined;
  options: ReadonlyArray<{ value: string }>;
}): string => props.defaultValue ?? props.options[0]?.value ?? '';

/**
 * `@k8ordo/ui/catalog` (server-safe)
 *
 * Every component a model may place, described for no format in particular:
 * what it is, the props it takes, whether it holds children, and which prop
 * is its value. A json-render catalog, an OpenUI library, or an A2UI catalog
 * is built from this by mapping over the entries; the drawing side is
 * `@k8ordo/ui/catalog/render`.
 *
 * @example
 * import { catalog } from '@k8ordo/ui/catalog';
 *
 * for (const [name, { description, props }] of Object.entries(catalog)) {
 *   // register `name` with the format you use
 * }
 */
export const catalog = {
  Stack: entry({
    description:
      'Layout container that places its children in a row or a column with even spacing. gap sets the space between children and padding (none to xl) the space inside; give a section padding when it needs room around its content.',
    props: s.stackProps,
    children: true,
  }),
  Grid: entry({
    description:
      'Places its children in a grid. Set cols (1 to 6, auto-fill, or auto-fit) and gap; with auto-fill or auto-fit, minItemSize sets the smallest size of each cell.',
    props: s.gridProps,
    children: true,
  }),
  Card: entry({
    description:
      'Card that groups content (a container). size (sm/md/lg, default md) sets its inner padding, so a Stack inside it needs no padding of its own. With href the whole card is a link; binding press makes the whole card a button instead. Links and buttons inside it stay pressable on their own.',
    props: s.cardProps,
    children: true,
    events: press('The user pressed the card.'),
  }),
  Form: entry({
    description:
      'Wrapper for form elements (a vertical layout). It submits nothing by itself, Enter included: report a submission with the press of a Button inside it.',
    props: s.formProps,
    children: true,
  }),
  Carousel: entry({
    description:
      'Horizontally scrolling carousel with previous and next buttons. Each child is one slide. slideSize sets how much of the track one slide takes (full, lg, md for two, sm for three).',
    props: s.carouselProps,
    children: true,
  }),
  Button: entry({
    description:
      'Action button. With href it renders as a link (<a>) and reports no press.',
    props: s.buttonProps,
    events: press('The user pressed the button.'),
  }),
  IconButton: entry({
    description:
      'Icon-only button (label is required and shown as its tooltip).',
    props: s.iconButtonProps,
    events: press('The user pressed the button.'),
  }),
  CopyButton: entry({
    description:
      'Button that copies value to the clipboard and confirms it. With iconOnly, label becomes its tooltip.',
    props: s.copyButtonProps,
  }),
  Toolbar: entry({
    description:
      'Row (or column) of buttons that arrow keys move between, e.g. formatting actions. Give each item an icon to show only the icon.',
    props: s.toolbarProps,
  }),
  Anchor: entry({ description: 'Text link.', props: s.anchorProps }),
  Breadcrumb: entry({
    description: 'Breadcrumb trail.',
    props: s.breadcrumbProps,
  }),
  Pagination: entry({
    description: 'Pagination.',
    props: s.paginationProps,
    value: { prop: 'defaultPage', initial: (props) => props.defaultPage ?? 1 },
  }),
  Stepper: entry({
    description:
      'Steps of a process in order, marking the ones done and the current one (display only).',
    props: s.stepperProps,
  }),
  SideNav: entry({
    description:
      'Side navigation: groups of links, each group under a small title. Mark the page being shown with current: true.',
    props: s.sideNavProps,
  }),
  Badge: entry({
    description: 'Badge for a status or a label.',
    props: s.badgeProps,
  }),
  Heading: entry({ description: 'Heading (h1 to h6).', props: s.headingProps }),
  Avatar: entry({
    description: 'Avatar (an image or initials).',
    props: s.avatarProps,
  }),
  Code: entry({ description: 'Inline code or value.', props: s.codeProps }),
  Kbd: entry({
    description:
      'Keyboard shortcut. keys lists the keys pressed together, and each is drawn as its own key cap.',
    props: s.kbdProps,
  }),
  EmptyState: entry({
    description:
      'Placeholder for a list, table, or search with nothing to show: a title, an optional description, and an optional icon.',
    props: s.emptyStateProps,
  }),
  Icon: entry({ description: 'Icon, chosen by name.', props: s.iconProps }),
  Alert: entry({
    description:
      'Alert that reports a status. message is a string or an array of strings.',
    props: s.alertProps,
  }),
  Callout: entry({
    description:
      'Note inside the content (a tip, a caveat). Unlike Alert, it is not announced as a status. content is plain text; label is an optional bold line above it.',
    props: s.calloutProps,
  }),
  Spinner: entry({ description: 'Loading spinner.', props: s.spinnerProps }),
  Progress: entry({
    description:
      'Progress bar. Leave value out when progress is unknown; it then shows an animated bar.',
    props: s.progressProps,
  }),
  Skeleton: entry({
    description: 'Loading placeholder.',
    props: s.skeletonProps,
  }),
  Separator: entry({ description: 'Divider line.', props: s.separatorProps }),
  Tabs: entry({
    description:
      'Tabs. Each tab has a label and text content; content must be a plain string.',
    props: s.tabsProps,
  }),
  Accordion: entry({
    description:
      'Accordion of items that open and close. Each item has a title and text content; content must be a plain string.',
    props: s.accordionProps,
  }),
  Table: entry({
    description:
      'Table with columns (the headers) and rows (the cell strings of each row). Every row must have exactly as many cells as there are columns.',
    props: s.tableProps,
  }),
  DataTable: entry({
    description:
      'Table the reader can sort (by the columns marked sortable) and, with selectable, pick rows from. Use it for records someone works through; use Table for data only read. Every row must have exactly as many cells as there are columns.',
    props: s.dataTableProps,
  }),
  Tree: entry({
    description:
      'Tree of nodes that open and close, such as files and folders, navigable with the arrow keys. List every node flat; a child names its parent by parentId.',
    props: s.treeProps,
  }),
  Dialog: entry({
    description:
      'Dialog over the page that a button labeled triggerLabel opens, headed by title with a close button. side puts it in the center (the default) or along the bottom edge.',
    props: s.dialogProps,
    children: true,
  }),
  Drawer: entry({
    description:
      'Panel along the left or right edge of the page (side, right by default) that a button labeled triggerLabel opens, headed by title with a close button.',
    props: s.drawerProps,
    children: true,
  }),
  Popover: entry({
    description: 'Popover that a button labeled triggerLabel opens and closes.',
    props: s.popoverProps,
    children: true,
  }),
  Tooltip: entry({
    description: 'Tooltip shown on hover or focus.',
    props: s.tooltipProps,
  }),
  DropdownMenu: entry({
    description:
      'Dropdown menu that a button labeled triggerLabel opens. Its children are its items, each a DropdownMenuItem.',
    props: s.dropdownMenuProps,
    children: true,
  }),
  DropdownMenuItem: entry({
    description:
      'One item of a DropdownMenu; place it only as a child of a DropdownMenu.',
    props: s.dropdownMenuItemProps,
    events: press('The user chose the item.'),
  }),
  Toast: entry({
    description: 'Toast notification that a button labeled triggerLabel shows.',
    props: s.toastProps,
  }),
  TextField: entry({
    description:
      'Single-line text input. type picks the kind of value: an email address, a URL, a date, a time, and so on. A password is a PasswordInput, and a number a NumberField.',
    props: s.textFieldProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  Textarea: entry({
    description: 'Multi-line text input.',
    props: s.textareaProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  PasswordInput: entry({
    description: 'Password input.',
    props: s.passwordInputProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  NumberField: entry({
    description: 'Number input.',
    props: s.numberFieldProps,
    value: {
      prop: 'defaultValue',
      initial: (props): number | null => props.defaultValue ?? null,
    },
  }),
  Slider: entry({
    description: 'Slider.',
    props: s.sliderProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? props.min ?? 0,
    },
  }),
  RangeSlider: entry({
    description:
      'Slider with two thumbs for picking a range. Its value is [lower, upper].',
    props: s.rangeSliderProps,
    value: {
      prop: 'defaultValue',
      initial: (props): readonly [number, number] =>
        props.defaultValue ?? [props.min ?? 0, props.max ?? 100],
    },
  }),
  DatePicker: entry({
    description:
      'Date input with a visible label and a button that opens a calendar. Dates are YYYY-MM-DD strings.',
    props: s.datePickerProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  Calendar: entry({
    description:
      'Month calendar shown inline for picking one day (YYYY-MM-DD). It submits nothing; in a form, use DatePicker.',
    props: s.calendarProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  ColorPicker: entry({
    description:
      'Color input with a visible label: a #rrggbb text field, hue / saturation / lightness sliders, and optional preset swatches.',
    props: s.colorPickerProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  Combobox: entry({
    description:
      'Text field with a visible label that filters a list of options as you type, for picking one. Prefer it to ListBox when there are many options.',
    props: s.comboboxProps,
    value: {
      prop: 'defaultValue',
      initial: (props) => props.defaultValue ?? '',
    },
  }),
  Checkbox: entry({
    description: 'Checkbox.',
    props: s.checkboxProps,
    value: {
      prop: 'defaultChecked',
      initial: (props) => props.defaultChecked ?? false,
    },
  }),
  Switch: entry({
    description: 'On/off switch.',
    props: s.switchProps,
    value: {
      prop: 'defaultChecked',
      initial: (props) => props.defaultChecked ?? false,
    },
  }),
  Select: entry({
    description: 'Dropdown select.',
    props: s.selectProps,
    value: { prop: 'defaultValue', initial: firstOption },
  }),
  Radio: entry({
    description: 'Radio buttons for a single choice.',
    props: s.radioProps,
    value: { prop: 'defaultValue', initial: firstOption },
  }),
  RadioCard: entry({
    description: 'Single choice presented as cards.',
    props: s.radioCardProps,
    value: { prop: 'defaultValue', initial: firstOption },
  }),
  CheckboxCard: entry({
    description: 'Multiple choice presented as cards.',
    props: s.checkboxCardProps,
    value: {
      prop: 'defaultValue',
      initial: (props): string[] => props.defaultValue ?? [],
    },
  }),
  ListBox: entry({
    description:
      'Button showing the chosen option that opens a list in a popup for picking one; label names the button.',
    props: s.listBoxProps,
    value: { prop: 'defaultValue', initial: firstOption },
  }),
  CheckboxGroup: entry({
    description: 'Group of checkboxes.',
    props: s.checkboxGroupProps,
    value: {
      prop: 'defaultValue',
      initial: (props): string[] => props.defaultValue ?? [],
    },
  }),
  Autocomplete: entry({
    description: 'Tag-style autocomplete for multiple choices.',
    props: s.autocompleteProps,
    value: {
      prop: 'defaultValue',
      initial: (props): string[] => props.defaultValue ?? [],
    },
  }),
  FileField: entry({
    description:
      'File picker field. With dropzone, files can also be dropped onto it.',
    props: s.fileFieldProps,
  }),
};

/** The name of a component in the catalog. */
export type CatalogName = keyof typeof catalog;

/** The props a model writes for the component `N`. */
export type CatalogProps<N extends CatalogName> = z.infer<
  (typeof catalog)[N]['props']
>;

/** The events the component `N` reports (`never` for a component with none). */
export type CatalogEventOf<N extends CatalogName> =
  (typeof catalog)[N] extends { events?: infer E }
    ? [E] extends [undefined]
      ? never
      : keyof NonNullable<E> & string
    : never;

/** The value of the field `N` (`never` for a component that is not a field). */
export type CatalogValueOf<N extends CatalogName> =
  (typeof catalog)[N] extends {
    value?: { initial: (props: never) => infer V };
  }
    ? V
    : never;

/**
 * Cross-cutting constraints a model most often breaks, for the format's
 * system prompt (json-render's `customRules`, OpenUI's `additionalRules`).
 */
export const catalogRules: readonly string[] = [
  'Every row in rows of a Table or DataTable must have exactly as many cells as there are columns.',
  'An href must be an absolute URL starting with https:// or http://, or a path starting with a single /.',
  'The content of Tabs and Accordion must be plain text; components cannot be nested inside it.',
];

const isCatalogName = (type: string): type is CatalogName =>
  Object.hasOwn(catalog, type);

/** Options of `catalogPropIssues`. */
export type CatalogPropIssuesOptions = {
  /**
   * Props whose value the format resolves later, such as one a json-render
   * spec binds with `{ "$bindState": "/form/name" }`. Their names are still
   * checked; their values are not, and a required one may be among them. A
   * check across props that needs one of them, such as a `Table` row against
   * the columns, is not made.
   */
  unresolved?: readonly string[];
};

/**
 * Checks what a model wrote for one component and returns what is wrong with
 * it, in English, ready to send back to the model. An empty array means the
 * component exists and its props are valid.
 *
 * Unknown props are reported as well: zod drops a key the schema does not
 * know instead of failing, so a prop the model invented would otherwise pass
 * and render as if it were not there.
 *
 * Props are also checked against each other, each issue under the path it is
 * at and along with the other issues, once the props a check reads are valid:
 * every row of a `Table` or `DataTable` against the columns
 * (`Table.rows.2: …`), the `defaultValue` of a `TextField` with a date or
 * time `type` against that kind's input format (`TextField.defaultValue: …`),
 * and the `defaultValue` of `Select`, `Radio`, `RadioCard`, `ListBox`,
 * `CheckboxGroup`, and `CheckboxCard` against the values of the options
 * (`CheckboxGroup.defaultValue.1: …`).
 *
 * @example
 * catalogPropIssues('Button', { label: 'OK', colour: 'primary' });
 * // ['Button: Unknown prop "colour". Allowed props: label, variant, …']
 */
export const catalogPropIssues = (
  type: string,
  props: unknown,
  options: CatalogPropIssuesOptions = {},
): string[] => {
  if (!isCatalogName(type)) {
    return [
      `Unknown component type "${type}". Use one of: ${Object.keys(catalog).join(', ')}.`,
    ];
  }
  const full: z.ZodObject = catalog[type].props;
  const unresolved = (options.unresolved ?? []).filter((key) =>
    Object.hasOwn(full.shape, key),
  );
  // z.object で組み直すと、prop をまたぐ検査（Table の行と列など）まで落ちる
  const schema = full.safeExtend(
    Object.fromEntries(unresolved.map((key) => [key, z.unknown().optional()])),
  );
  const values =
    typeof props === 'object' && props !== null
      ? Object.fromEntries(
          Object.entries(props).filter(([key]) => !unresolved.includes(key)),
        )
      : props;
  const parsed = schema.safeParse(values);
  const issues = parsed.success
    ? []
    : parsed.error.issues.map((issue) => {
        const path = issue.path.join('.');
        return `${type}${path === '' ? '' : `.${path}`}: ${issue.message}`;
      });

  const allowed = Object.keys(full.shape);
  const given =
    typeof props === 'object' && props !== null ? Object.keys(props) : [];
  for (const key of given) {
    if (!allowed.includes(key)) {
      issues.push(
        `${type}: Unknown prop "${key}". Allowed props: ${allowed.join(', ')}.`,
      );
    }
  }
  return issues;
};
