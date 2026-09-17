# Types

The shared types `@k8ordo/ui` exports for typing component props.

```tsx
import type {
  Direction,
  DrawerSide,
  ModalSide,
  Option,
  Placement,
  Status,
} from '@k8ordo/ui';
```

## Status

```tsx
type Status = 'success' | 'info' | 'warning' | 'error';
```

Used for the status of `Alert`, `Toast`, and `AlertIcon`. `Badge` takes its own `tone`, which also allows `'neutral'`.

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

## ModalSide

```tsx
type ModalSide = 'center' | 'bottom' | 'left' | 'right';
```

Which viewport edge a Modal sticks to (the `side` prop). It is a different
idea from `Placement`, which is relative to an anchor, so the prop name differs
too.

## DrawerSide

```tsx
type DrawerSide = Extract<ModalSide, 'left' | 'right'>;
```

The subset of `ModalSide` a Drawer accepts: a drawer always slides in from an
edge, so `center` is excluded.

## Option

```tsx
type Option = Readonly<{ value: string; label: string }>;
```

Used for the choices in Radio, Select, Autocomplete, and similar components.
