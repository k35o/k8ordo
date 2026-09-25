import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const componentCategories: NavCategory[] = [
  {
    title: m.components.categoryButtons,
    items: [
      {
        name: 'Button',
        path: '/:locale/ui/components/button',
        description: m.components.button.description,
      },
      {
        name: 'IconButton',
        path: '/:locale/ui/components/icon-button',
        description: m.components.iconButton.description,
      },
    ],
  },
  {
    title: m.components.categoryNavigation,
    items: [
      {
        name: 'Anchor',
        path: '/:locale/ui/components/anchor',
        description: m.components.anchor.description,
      },
      {
        name: 'Tabs',
        path: '/:locale/ui/components/tabs',
        description: m.components.tabs.description,
      },
      {
        name: 'Breadcrumb',
        path: '/:locale/ui/components/breadcrumb',
        description: m.components.breadcrumb.description,
      },
      {
        name: 'Pagination',
        path: '/:locale/ui/components/pagination',
        description: m.components.pagination.description,
      },
    ],
  },
  {
    title: m.components.categoryForms,
    items: [
      {
        name: 'TextField',
        path: '/:locale/ui/components/text-field',
        description: m.components.textField.description,
      },
      {
        name: 'Textarea',
        path: '/:locale/ui/components/textarea',
        description: m.components.textarea.description,
      },
      {
        name: 'NumberField',
        path: '/:locale/ui/components/number-field',
        description: m.components.numberField.description,
      },
      {
        name: 'DateField',
        path: '/:locale/ui/components/date-field',
        description: m.components.dateField.description,
      },
      {
        name: 'DatePicker',
        path: '/:locale/ui/components/date-picker',
        description: m.components.datePicker.description,
      },
      {
        name: 'Calendar',
        path: '/:locale/ui/components/calendar',
        description: m.components.calendar.description,
      },
      {
        name: 'Select',
        path: '/:locale/ui/components/select',
        description: m.components.select.description,
      },
      {
        name: 'Checkbox',
        path: '/:locale/ui/components/checkbox',
        description: m.components.checkbox.description,
      },
      {
        name: 'CheckboxCard',
        path: '/:locale/ui/components/checkbox-card',
        description: m.components.checkboxCard.description,
      },
      {
        name: 'CheckboxGroup',
        path: '/:locale/ui/components/checkbox-group',
        description: m.components.checkboxGroup.description,
      },
      {
        name: 'Switch',
        path: '/:locale/ui/components/switch',
        description: m.components.switchInput.description,
      },
      {
        name: 'PasswordInput',
        path: '/:locale/ui/components/password-input',
        description: m.components.passwordInput.description,
      },
      {
        name: 'Radio',
        path: '/:locale/ui/components/radio',
        description: m.components.radio.description,
      },
      {
        name: 'RadioCard',
        path: '/:locale/ui/components/radio-card',
        description: m.components.radioCard.description,
      },
      {
        name: 'Autocomplete',
        path: '/:locale/ui/components/autocomplete',
        description: m.components.autocomplete.description,
      },
      {
        name: 'Slider',
        path: '/:locale/ui/components/slider',
        description: m.components.slider.description,
      },
      {
        name: 'FileField',
        path: '/:locale/ui/components/file-field',
        description: m.components.fileField.description,
      },
      {
        name: 'FormControl',
        path: '/:locale/ui/components/form-control',
        description: m.components.formControl.description,
      },
      {
        name: 'Form',
        path: '/:locale/ui/components/form',
        description: m.components.form.description,
      },
    ],
  },
  {
    title: m.components.categoryDataDisplay,
    items: [
      {
        name: 'Accordion',
        path: '/:locale/ui/components/accordion',
        description: m.components.accordion.description,
      },
      {
        name: 'Avatar',
        path: '/:locale/ui/components/avatar',
        description: m.components.avatar.description,
      },
      {
        name: 'Badge',
        path: '/:locale/ui/components/badge',
        description: m.components.badge.description,
      },
      {
        name: 'Card',
        path: '/:locale/ui/components/card',
        description: m.components.card.description,
      },
      {
        name: 'Carousel',
        path: '/:locale/ui/components/carousel',
        description: m.components.carousel.description,
      },
      {
        name: 'Code',
        path: '/:locale/ui/components/code',
        description: m.components.code.description,
      },
      {
        name: 'CodeBlock',
        path: '/:locale/ui/components/code-block',
        description: m.components.codeBlock.description,
      },
      {
        name: 'Prose',
        path: '/:locale/ui/components/prose',
        description: m.components.prose.description,
      },
      {
        name: 'Table',
        path: '/:locale/ui/components/table',
        description: m.components.table.description,
      },
      {
        name: 'Heading',
        path: '/:locale/ui/components/heading',
        description: m.components.heading.description,
      },
      {
        name: 'Kbd',
        path: '/:locale/ui/components/kbd',
        description: m.components.kbd.description,
      },
    ],
  },
  {
    title: m.components.categoryFeedback,
    items: [
      {
        name: 'Alert',
        path: '/:locale/ui/components/alert',
        description: m.components.alert.description,
      },
      {
        name: 'EmptyState',
        path: '/:locale/ui/components/empty-state',
        description: m.components.emptyState.description,
      },
      {
        name: 'Skeleton',
        path: '/:locale/ui/components/skeleton',
        description: m.components.skeleton.description,
      },
      {
        name: 'Spinner',
        path: '/:locale/ui/components/spinner',
        description: m.components.spinner.description,
      },
      {
        name: 'Toast',
        path: '/:locale/ui/components/toast',
        description: m.components.toast.description,
      },
      {
        name: 'Progress',
        path: '/:locale/ui/components/progress',
        description: m.components.progress.description,
      },
    ],
  },
  {
    title: m.components.categoryOverlays,
    items: [
      {
        name: 'Dialog',
        path: '/:locale/ui/components/dialog',
        description: m.components.dialog.description,
      },
      {
        name: 'Drawer',
        path: '/:locale/ui/components/drawer',
        description: m.components.drawer.description,
      },
      {
        name: 'Modal',
        path: '/:locale/ui/components/modal',
        description: m.components.modal.description,
      },
      {
        name: 'Popover',
        path: '/:locale/ui/components/popover',
        description: m.components.popover.description,
      },
      {
        name: 'DropdownMenu',
        path: '/:locale/ui/components/dropdown-menu',
        description: m.components.dropdownMenu.description,
      },
      {
        name: 'Tooltip',
        path: '/:locale/ui/components/tooltip',
        description: m.components.tooltip.description,
      },
      {
        name: 'ListBox',
        path: '/:locale/ui/components/list-box',
        description: m.components.listBox.description,
      },
    ],
  },
  {
    title: m.components.categoryLayout,
    items: [
      {
        name: 'Stack',
        path: '/:locale/ui/components/stack',
        description: m.components.stack.description,
      },
      {
        name: 'Grid',
        path: '/:locale/ui/components/grid',
        description: m.components.grid.description,
      },
      {
        name: 'Separator',
        path: '/:locale/ui/components/separator',
        description: m.components.separator.description,
      },
    ],
  },
  {
    title: m.components.categoryObservers,
    items: [
      {
        name: 'InView',
        path: '/:locale/ui/components/in-view',
        description: m.components.inView.description,
      },
      {
        name: 'Resize',
        path: '/:locale/ui/components/resize',
        description: m.components.resize.description,
      },
    ],
  },
  {
    title: m.components.categoryMedia,
    items: [
      {
        name: 'Icons',
        path: '/:locale/ui/components/icons',
        description: m.components.icons.description,
      },
    ],
  },
];
