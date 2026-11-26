# Types

The shared types `@k8ordo/ui` exports for typing component props.

```tsx
import type {
  DialogSide,
  Direction,
  DrawerSide,
  Option,
  Placement,
  Status,
} from '@k8ordo/ui';
```

## Status

```tsx
type Status = 'success' | 'info' | 'warning' | 'error';
```

Used for the status of `Alert`, `Callout`, `Toast`, and `AlertIcon`. `Badge` takes its own `tone`, which also allows `'neutral'`.

## Direction

```tsx
type Direction = 'up' | 'down' | 'right' | 'left';
```

Used to point ChevronIcon and similar icons.

## Placement

```tsx
type Placement =
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
```

Placement relative to an anchor element, for Popover, Tooltip, DropdownMenu,
and ListBox (the `placement` prop), and for IconButton's tooltip
(`tooltipPlacement`).

## DialogSide

```tsx
type DialogSide = 'center' | 'bottom';
```

Where a Dialog opens (the `side` prop): in the center, or as a sheet from the
bottom edge. It is a different idea from `Placement`, which is relative to an
anchor, so the prop name differs too.

## DrawerSide

```tsx
type DrawerSide = 'left' | 'right';
```

The edge a Drawer slides in from (the `side` prop).

## Option

```tsx
type Option = Readonly<{ value: string; label: string }>;
```

Used for the choices in Radio, Select, Autocomplete, and similar components.

## Component prop types

The root also exports types that belong to one component, for typing your own
code around it:

| Type                                           | What it types                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `StackProps` / `GridProps`                     | Every prop of `Stack` / `Grid`, for a component that wraps one                                          |
| `GapSize` / `PaddingSize`                      | The `none`–`xl` scale of `gap` (Stack, Grid) and `padding` (Stack)                                      |
| `PopoverTriggerProps` / `TooltipTriggerProps`  | What `renderItem` receives on `Popover.Trigger` / `Tooltip.Trigger`                                     |
| `ToolbarItemProps`                             | What `renderItem` receives on `Toolbar.Item`: `ref`, `tabIndex`, `onFocus`                              |
| `CommandPaletteItem`                           | A command in `CommandPalette`: `id`, `label`, `onSelect`, plus `group`, `keywords`, `shortcut`          |
| `AlertAction` / `ToastAction` / `ToastOptions` | `Alert`'s `action`, and the `action` and `duration` a toast takes                                       |
| `ColorPickerSwatch`                            | A preset in `ColorPicker`'s `swatches`: `value` (`#rrggbb`) and `label`, the color's name               |
| `ComboboxSearch`                               | `Combobox`'s `search`: `(query, { signal }) => Promise<readonly Option[]>`                              |
| `CheckboxCardOption` / `RadioCardOption`       | A choice in `CheckboxCard` / `RadioCard`: `value` and `label`, plus `description`, `visual`, `disabled` |
| `StepperStep`                                  | A step in `Stepper`: `label`, plus `description`                                                        |
| `CellAlign`                                    | A table cell's `align`: `'left'`, `'center'`, or `'right'`                                              |
| `BaseIconProps` / `IconRenderProps`            | An icon's `size`, and the props an icon puts on its `<svg>`                                             |
