import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const componentCategories: NavCategory[] = [
  {
    title: m.components.categoryButtons,
    items: [
      {
        name: 'Button',
        path: '/ui/components/button',
        description: m.components.button.description,
      },
      {
        name: 'IconButton',
        path: '/ui/components/icon-button',
        description: m.components.iconButton.description,
      },
    ],
  },
  {
    title: m.components.categoryNavigation,
    items: [
      {
        name: 'Anchor',
        path: '/ui/components/anchor',
        description: m.components.anchor.description,
      },
      {
        name: 'Tabs',
        path: '/ui/components/tabs',
        description: m.components.tabs.description,
      },
      {
        name: 'Breadcrumb',
        path: '/ui/components/breadcrumb',
        description: m.components.breadcrumb.description,
      },
      {
        name: 'Pagination',
        path: '/ui/components/pagination',
        description: m.components.pagination.description,
      },
    ],
  },
  {
    title: m.components.categoryForms,
    items: [
      {
        name: 'TextField',
        path: '/ui/components/text-field',
        description: m.components.textField.description,
      },
      {
        name: 'Textarea',
        path: '/ui/components/textarea',
        description: m.components.textarea.description,
      },
      {
        name: 'NumberField',
        path: '/ui/components/number-field',
        description: m.components.numberField.description,
      },
      {
        name: 'Select',
        path: '/ui/components/select',
        description: m.components.select.description,
      },
      {
        name: 'Checkbox',
        path: '/ui/components/checkbox',
        description: m.components.checkbox.description,
      },
      {
        name: 'CheckboxCard',
        path: '/ui/components/checkbox-card',
        description: m.components.checkboxCard.description,
      },
      {
        name: 'CheckboxGroup',
        path: '/ui/components/checkbox-group',
        description: m.components.checkboxGroup.description,
      },
      {
        name: 'Switch',
        path: '/ui/components/switch',
        description: m.components.switchInput.description,
      },
      {
        name: 'PasswordInput',
        path: '/ui/components/password-input',
        description: m.components.passwordInput.description,
      },
      {
        name: 'Radio',
        path: '/ui/components/radio',
        description: m.components.radio.description,
      },
      {
        name: 'RadioCard',
        path: '/ui/components/radio-card',
        description: m.components.radioCard.description,
      },
      {
        name: 'Autocomplete',
        path: '/ui/components/autocomplete',
        description: m.components.autocomplete.description,
      },
      {
        name: 'Slider',
        path: '/ui/components/slider',
        description: m.components.slider.description,
      },
      {
        name: 'FileField',
        path: '/ui/components/file-field',
        description: m.components.fileField.description,
      },
      {
        name: 'FormControl',
        path: '/ui/components/form-control',
        description: m.components.formControl.description,
      },
      {
        name: 'Form',
        path: '/ui/components/form',
        description: m.components.form.description,
      },
    ],
  },
  {
    title: m.components.categoryDataDisplay,
    items: [
      {
        name: 'Accordion',
        path: '/ui/components/accordion',
        description: m.components.accordion.description,
      },
      {
        name: 'Avatar',
        path: '/ui/components/avatar',
        description: m.components.avatar.description,
      },
      {
        name: 'Badge',
        path: '/ui/components/badge',
        description: m.components.badge.description,
      },
      {
        name: 'Card',
        path: '/ui/components/card',
        description: m.components.card.description,
      },
      {
        name: 'Code',
        path: '/ui/components/code',
        description: m.components.code.description,
      },
      {
        name: 'Table',
        path: '/ui/components/table',
        description: m.components.table.description,
      },
      {
        name: 'Heading',
        path: '/ui/components/heading',
        description: m.components.heading.description,
      },
    ],
  },
  {
    title: m.components.categoryFeedback,
    items: [
      {
        name: 'Alert',
        path: '/ui/components/alert',
        description: m.components.alert.description,
      },
      {
        name: 'Skeleton',
        path: '/ui/components/skeleton',
        description: m.components.skeleton.description,
      },
      {
        name: 'Spinner',
        path: '/ui/components/spinner',
        description: m.components.spinner.description,
      },
      {
        name: 'Toast',
        path: '/ui/components/toast',
        description: m.components.toast.description,
      },
      {
        name: 'Progress',
        path: '/ui/components/progress',
        description: m.components.progress.description,
      },
    ],
  },
  {
    title: m.components.categoryOverlays,
    items: [
      {
        name: 'Dialog',
        path: '/ui/components/dialog',
        description: m.components.dialog.description,
      },
      {
        name: 'Drawer',
        path: '/ui/components/drawer',
        description: m.components.drawer.description,
      },
      {
        name: 'Modal',
        path: '/ui/components/modal',
        description: m.components.modal.description,
      },
      {
        name: 'Popover',
        path: '/ui/components/popover',
        description: m.components.popover.description,
      },
      {
        name: 'DropdownMenu',
        path: '/ui/components/dropdown-menu',
        description: m.components.dropdownMenu.description,
      },
      {
        name: 'Tooltip',
        path: '/ui/components/tooltip',
        description: m.components.tooltip.description,
      },
      {
        name: 'ListBox',
        path: '/ui/components/list-box',
        description: m.components.listBox.description,
      },
    ],
  },
  {
    title: m.components.categoryLayout,
    items: [
      {
        name: 'Stack',
        path: '/ui/components/stack',
        description: m.components.stack.description,
      },
      {
        name: 'Grid',
        path: '/ui/components/grid',
        description: m.components.grid.description,
      },
      {
        name: 'Separator',
        path: '/ui/components/separator',
        description: m.components.separator.description,
      },
      {
        name: 'ScrollLinked',
        path: '/ui/components/scroll-linked',
        description: m.components.scrollLinked.description,
      },
    ],
  },
  {
    title: m.components.categoryMedia,
    items: [
      {
        name: 'Icons',
        path: '/ui/components/icons',
        description: m.components.icons.description,
      },
    ],
  },
];
