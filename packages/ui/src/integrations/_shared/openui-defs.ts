import { createLibrary, defineComponent } from '@openuidev/lang-core';
import type { Library, SubComponentOf } from '@openuidev/lang-core';
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
    'Action button. With href it renders as a link (<a>).',
    s.buttonProps,
  );
  const IconButton = def(
    'IconButton',
    'Icon-only button (label is required).',
    s.iconButtonProps,
  );
  const CopyButton = def(
    'CopyButton',
    'Button that copies value to the clipboard and confirms it.',
    s.copyButtonProps,
  );
  const Badge = def('Badge', 'Badge for a status or a label.', s.badgeProps);
  const Heading = def('Heading', 'Heading (h1 to h6).', s.headingProps);
  const Anchor = def('Anchor', 'Text link.', s.anchorProps);
  const Avatar = def('Avatar', 'Avatar (an image or initials).', s.avatarProps);
  const Code = def('Code', 'Inline code or value.', s.codeProps);
  const Kbd = def(
    'Kbd',
    'Keyboard shortcut. keys lists the keys pressed together, and each is drawn as its own key cap.',
    s.kbdProps,
  );
  const EmptyState = def(
    'EmptyState',
    'Placeholder for a list, table, or search with nothing to show: a title, an optional description, and an optional icon.',
    s.emptyStateProps,
  );
  const Icon = def('Icon', 'Icon, chosen by name.', s.iconProps);
  const ChevronIcon = def(
    'ChevronIcon',
    'Arrow icon. direction sets which way it points.',
    s.chevronIconProps,
  );
  const StatusIcon = def(
    'StatusIcon',
    'Icon for a status (success/info/warning/error). It is decorative; to show a message, use Alert.',
    s.statusIconProps,
  );
  const Alert = def(
    'Alert',
    'Alert that reports a status. message is a string or an array of strings.',
    s.alertProps,
  );
  const Spinner = def('Spinner', 'Loading spinner.', s.spinnerProps);
  const Progress = def(
    'Progress',
    'Progress bar. Leave value out when progress is unknown; it then shows an animated bar.',
    s.progressProps,
  );
  const Skeleton = def('Skeleton', 'Loading placeholder.', s.skeletonProps);
  const Separator = def('Separator', 'Divider line.', s.separatorProps);
  const Tabs = def(
    'Tabs',
    'Tabs. Each tab has a label and text content; content must be a plain string.',
    s.tabsProps,
  );
  const Accordion = def(
    'Accordion',
    'Accordion of items that open and close. Each item has a title and text content; content must be a plain string.',
    s.accordionProps,
  );
  const Breadcrumb = def('Breadcrumb', 'Breadcrumb trail.', s.breadcrumbProps);
  const SideNav = def(
    'SideNav',
    'Side navigation: groups of links, each group under a small title. Mark the page being shown with current: true.',
    s.sideNavProps,
  );
  const Table = def(
    'Table',
    'Table with columns and rows (the cell strings of each row). Every row must have exactly as many cells as there are columns.',
    s.tableProps,
  );
  const DataTable = def(
    'DataTable',
    'Table the reader can sort (by the columns marked sortable) and, with selectable, pick rows from. Every row must have exactly as many cells as there are columns.',
    s.dataTableProps,
  );
  const TextField = def(
    'TextField',
    'Single-line text input, bound to form state by name.',
    s.textFieldProps,
  );
  const Textarea = def(
    'Textarea',
    'Multi-line text input, bound to form state by name.',
    s.textareaProps,
  );
  const PasswordInput = def(
    'PasswordInput',
    'Password input, bound to form state by name.',
    s.passwordInputProps,
  );
  const NumberField = def(
    'NumberField',
    'Number input, bound to form state by name.',
    s.numberFieldProps,
  );
  const Slider = def(
    'Slider',
    'Slider, bound to form state by name.',
    s.sliderProps,
  );
  const RangeSlider = def(
    'RangeSlider',
    'Slider with two thumbs for picking a range, bound to form state by name as [lower, upper].',
    s.rangeSliderProps,
  );
  const DateField = def(
    'DateField',
    'Date input with a visible label (YYYY-MM-DD), bound to form state by name.',
    s.dateFieldProps,
  );
  const DatePicker = def(
    'DatePicker',
    'Date input with a visible label and a calendar popover (YYYY-MM-DD), bound to form state by name.',
    s.datePickerProps,
  );
  const Calendar = def(
    'Calendar',
    'Month calendar shown inline for picking one day (YYYY-MM-DD), bound to state by name. It submits nothing; in a form, use DatePicker.',
    s.calendarProps,
  );
  const Checkbox = def(
    'Checkbox',
    'Checkbox, bound to form state by name.',
    s.checkboxProps,
  );
  const Switch = def(
    'Switch',
    'On/off switch, bound to form state by name.',
    s.switchProps,
  );
  const Select = def(
    'Select',
    'Dropdown select, bound to form state by name.',
    s.selectProps,
  );
  const Radio = def(
    'Radio',
    'Radio buttons for a single choice, bound to form state by name.',
    s.radioProps,
  );
  const RadioCard = def(
    'RadioCard',
    'Single choice presented as cards, bound to form state by name.',
    s.radioCardProps,
  );
  const CheckboxCard = def(
    'CheckboxCard',
    'Multiple choice presented as cards, bound to form state by name.',
    s.checkboxCardProps,
  );
  const Pagination = def(
    'Pagination',
    'Pagination, bound to form state by name.',
    s.paginationProps,
  );
  const Tooltip = def(
    'Tooltip',
    'Tooltip shown on hover or focus.',
    s.tooltipProps,
  );
  const DropdownMenu = def(
    'DropdownMenu',
    'Dropdown menu.',
    s.dropdownMenuProps,
  );
  const Toast = def(
    'Toast',
    'Toast notification that a button labeled triggerLabel shows.',
    s.toastProps,
  );
  const ListBox = def(
    'ListBox',
    'Single-choice list in a popup.',
    s.listBoxProps,
  );
  const CheckboxGroup = def(
    'CheckboxGroup',
    'Group of checkboxes, bound to form state by name.',
    s.checkboxGroupProps,
  );
  const Combobox = def(
    'Combobox',
    'Text field with a visible label that filters options as you type, for picking one, bound to form state by name. Prefer it to ListBox when there are many options.',
    s.comboboxProps,
  );
  const Autocomplete = def(
    'Autocomplete',
    'Tag-style autocomplete for multiple choices.',
    s.autocompleteProps,
  );
  const FileField = def(
    'FileField',
    'File picker field (a self-contained widget). With dropzone, files can also be dropped onto it.',
    s.fileFieldProps,
  );
  const FormControl = def(
    'FormControl',
    'Field with a label and help or error text (text/textarea/password).',
    s.formControlProps,
  );

  const childRefs = [
    Button.ref,
    IconButton.ref,
    CopyButton.ref,
    Badge.ref,
    Heading.ref,
    Anchor.ref,
    Avatar.ref,
    Code.ref,
    Kbd.ref,
    EmptyState.ref,
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
    SideNav.ref,
    Table.ref,
    DataTable.ref,
    TextField.ref,
    Textarea.ref,
    PasswordInput.ref,
    NumberField.ref,
    Slider.ref,
    RangeSlider.ref,
    DateField.ref,
    DatePicker.ref,
    Calendar.ref,
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
    ListBox.ref,
    CheckboxGroup.ref,
    Combobox.ref,
    Autocomplete.ref,
    FileField.ref,
    FormControl.ref,
  ] as const;

  // コンテナは互いを子に持つので、後で定義するコンテナも参照できるよう children を
  // getter で遅延させる。戻り値の型を書かないと、推論がコンテナ自身の型に循環する
  const containerChildren = (
    description: string,
  ): z.ZodArray<z.ZodType<SubComponentOf<unknown>>> =>
    z
      .array(
        z.union([
          ...childRefs,
          Stack.ref,
          Grid.ref,
          Card.ref,
          Form.ref,
          Modal.ref,
          Dialog.ref,
          Drawer.ref,
          Popover.ref,
          Carousel.ref,
        ]),
      )
      .describe(description);

  const Stack = def(
    'Stack',
    'Layout container that places its children in a row or a column with even spacing.',
    s.stackProps.extend({
      get children() {
        return containerChildren('Children to lay out');
      },
    }),
  );
  const Grid = def(
    'Grid',
    'Places its children in a grid. Set cols (1 to 6, auto-fill, or auto-fit) and gap; with auto-fill or auto-fit, minItemSize sets the smallest size of each cell.',
    s.gridProps.extend({
      get children() {
        return containerChildren('Children of the grid');
      },
    }),
  );
  const Card = def(
    'Card',
    'Card that groups content (a container). interactive makes it scale up on hover.',
    s.cardProps.extend({
      get children() {
        return containerChildren('Children of the card');
      },
    }),
  );
  const Form = def(
    'Form',
    'Wrapper for form elements (a vertical layout).',
    s.formProps.extend({
      get children() {
        return containerChildren('Elements in the form');
      },
    }),
  );
  const Modal = def(
    'Modal',
    'Modal dialog that opens from a button labeled triggerLabel.',
    s.modalProps.extend({
      get children() {
        return containerChildren('Elements in the modal');
      },
    }),
  );
  const Dialog = def(
    'Dialog',
    'Centered dialog that opens from a button labeled triggerLabel.',
    s.dialogProps.extend({
      get children() {
        return containerChildren('Elements in the dialog');
      },
    }),
  );
  const Drawer = def(
    'Drawer',
    'Side drawer that opens from a button labeled triggerLabel.',
    s.drawerProps.extend({
      get children() {
        return containerChildren('Elements in the drawer');
      },
    }),
  );
  const Popover = def(
    'Popover',
    'Popover that a button labeled triggerLabel opens and closes.',
    s.popoverProps.extend({
      get children() {
        return containerChildren('Elements in the popover');
      },
    }),
  );

  const Carousel = def(
    'Carousel',
    'Horizontally scrolling carousel with previous and next buttons. Each child is one slide. slideSize sets how much of the track one slide takes (full, lg, md for two, sm for three).',
    s.carouselProps.extend({
      get children() {
        return containerChildren('Slides, one child per slide');
      },
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
      Carousel,
      Tooltip,
      DropdownMenu,
      Toast,
      Button,
      IconButton,
      CopyButton,
      Badge,
      Heading,
      Anchor,
      Avatar,
      Code,
      Kbd,
      EmptyState,
      Icon,
      ChevronIcon,
      StatusIcon,
      Alert,
      Spinner,
      Progress,
      Skeleton,
      Separator,
      Tabs,
      Accordion,
      Breadcrumb,
      SideNav,
      Table,
      DataTable,
      TextField,
      Textarea,
      PasswordInput,
      NumberField,
      Slider,
      RangeSlider,
      DateField,
      DatePicker,
      Calendar,
      Checkbox,
      Switch,
      Select,
      Radio,
      RadioCard,
      CheckboxCard,
      Pagination,
      ListBox,
      CheckboxGroup,
      Combobox,
      Autocomplete,
      FileField,
      FormControl,
    ],
    root: 'Stack',
  });
};
