# Agent guide — packages/ui

`@k8ordo/ui` — the React component library in k8ordo. This file covers the
package itself. The shared discipline (React 19 / RSC assumed,
Baseline only, no polyfills) and how a new package joins are in the repository
root's [`CLAUDE.md`](../../CLAUDE.md).

## Package Commands

All commands run from this directory (`packages/ui`).

```bash
pnpm test                                    # Run all tests
pnpm test -- --project=helpers               # Helper tests only (no browser)
pnpm test -- --project=hooks                 # Hook tests only (Playwright)
pnpm test -- --project=components            # Component tests only (Storybook + Playwright)
pnpm test -- src/helpers/cn.test.ts          # Single test file
pnpm build                                   # vp pack + CSS copy
pnpm typecheck                               # Type check (no emit)
pnpm check                                   # Oxlint/Oxfmt lint/format check
pnpm check:write                             # Oxlint/Oxfmt lint/format auto-fix
pnpm storybook                               # Storybook dev server (port 6006)
```

## Adding a New Component

1. Create directory `src/components/<name>/` with 3 files:

```
src/components/<name>/
  <name>.tsx            # Implementation
  <name>.stories.tsx    # Storybook stories (also used as component tests)
  index.ts              # Re-export: export { ComponentName } from './<name>';
```

2. Add re-export in `src/index.ts` if the component should be available from the root entry point.

## Props Naming Conventions

### Boolean Props

- **A boolean that describes state** → prefix with `is`: `isOpen`, `isActive`, `isStreaming`
- **A boolean that selects a mode or variant** → no prefix: `interactive`, `animate`, `current`, `fullWidth`, `multiple`
- **A boolean that maps 1:1 onto a native HTML attribute or ARIA state** → keep the native name: `disabled`, `checked`, `required`, `invalid` (it is forwarded straight to `aria-invalid`, so no `is` prefix)

### Controllable Props (open/closed, selection, and similar state)

A component that owns state such as open/closed or a selection supports both
controlled and uncontrolled use, and names those props the same way across the
library. Reuse `useControllableState`.

- **State (controlled)**: `isOpen` for open/closed; a meaningful name such as `selectedId` or `value` for a selection.
- **Initial value (uncontrolled)**: `defaultOpen` / `defaultValue` / `defaultSelectedId`.
- **Change notification**: `onChange?: (next) => void` (a close-only action is `onClose?`).

For example: `Modal` and `Drawer` take `isOpen?` + `defaultOpen?` + `onClose?`;
`Tabs.Root` takes `selectedId?` + `defaultSelectedId?` + `onChange?`;
`Accordion.Item` takes `isOpen?` + `defaultOpen?` + `onChange?`.

### Prop vocabulary

| prop        | Meaning                                       | Example values                                                                           |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `variant`   | Visual variant                                | `solid` / `outline` / `skeleton` / `shadow`                                              |
| `color`     | Which color-token family to use               | Accents: `primary` / `secondary` / `base`; monochrome weight: `base` / `mute` / `subtle` |
| `tone`      | Status semantics (this prop only)             | `neutral` / `info` / `success` / `warning` / `error`                                     |
| `size`      | Size                                          | `sm` / `md` / `lg`                                                                       |
| `label`     | Visible text or accessible name               | —                                                                                        |
| `role`      | Which ARIA role to use                        | `dialog` / `menu` / `listbox`                                                            |
| `side`      | Placement against a viewport edge             | `center` / `bottom` / `right` / `left`                                                   |
| `placement` | Placement relative to an anchor (`Placement`) | `bottom-start`, …                                                                        |
| `onAction`  | Activating an item or button (no event arg)   | `() => void` (`Button` also accepts a `Promise`)                                         |

`type` is reserved for HTML attributes only (`button` / `submit`, input types).
Render props take a verb+noun form: `renderItem` / `renderAnchor` / `renderInput`.
In generative-UI schemas the trigger wording is `triggerLabel` and the body text
is `content`.

### Event handler value types

For form components, `onChange` takes **the element's meaningful value as its
first argument** — not the event object — except for the thin wrappers around a
native element (`TextField` / `Textarea` / `Select` / `PasswordInput`). A
component backed by a real `<input>` also passes **the DOM event as a second
argument**, so callers that need it are not stuck:

- `Checkbox` / `Switch`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `Radio`: `(value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `FileField`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void` (no `event` when files are cleared programmatically)
- `RadioCard` (notifies per group rather than per option input) and `ListBox`: value only, both `(value) => void`

The second argument can be added without breaking anyone — `(value) => void` is
assignable to `(value, event) => void` — and a caller that only needs the value
can keep taking one argument.

## Component Authoring Patterns

### Standard Component

```tsx
import type { FC, HTMLAttributes, Ref } from 'react';
import { cn } from '../../helpers/cn';

export const MyComponent: FC<
  { customProp?: string; ref?: Ref<HTMLDivElement> } & Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style'
  >
> = ({ customProp, ...rest }) => {
  return <div className={cn('base-classes')} {...rest} />;
};
```

Base the props on the element-specific `*HTMLAttributes`. `HTMLProps` extends
`AllHTMLAttributes`, so it type-checks attributes the element does not even have,
such as `href` or `src` (`Button` and `IconButton` were moved for this reason).
`*HTMLAttributes` does not include `ref`, so add it explicitly when needed.

### Compound Component (Dialog, Tabs, FileField pattern)

```tsx
const Root: FC<PropsWithChildren> = ({ children }) => (
  <Context value={...}>{children}</Context>
);
const Part: FC = () => { /* use(Context) */ };

export const MyComponent = { Root, Part } as const;
```

- Use `createContext` + `use()` for sharing state between parts
- Use `useId()` for accessible `aria-labelledby`/`aria-describedby` connections
- `'use client'` directive at top when using hooks

## Design Token System

No raw color values — always use semantic tokens in Tailwind classes. The tokens are defined in `src/styles/index.css` via CSS custom properties and mapped to Tailwind's `@theme inline`.

### Token Categories

| Category   | Tokens                                                                       | Usage              |
| ---------- | ---------------------------------------------------------------------------- | ------------------ |
| Foreground | `fg-base`, `fg-mute`, `fg-subtle`, `fg-inverse`                              | Text colors        |
| Background | `bg-base`, `bg-raised`, `bg-subtle`, `bg-mute`, `bg-emphasize`, `bg-inverse` | Surfaces           |
| Border     | `border-base`, `border-subtle`, `border-mute`, `border-emphasize`            | Borders            |
| Status     | `{fg,bg,border}-{info,success,warning,error}`                                | Semantic status    |
| Primary    | `primary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                      | Teal accent        |
| Secondary  | `secondary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                    | Cyan accent        |
| Group      | `group-{primary,secondary,tertiary,quaternary}`                              | Data visualization |

### Dark Mode

Dark mode is class-based (`.dark` on `html`). All semantic tokens automatically remap — no manual `dark:` prefixes needed for tokens. Custom variant defined via `@custom-variant dark (&:where(.dark, .dark *))`.

### Focus Style

Standard pattern: `focus-visible:border-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info`

### Custom Utilities

- `grid-cols-auto-fill-*` / `grid-cols-auto-fit-*` — responsive grid columns
- `grid-rows-auto-fill-*` / `grid-rows-auto-fit-*` — responsive grid rows

## Testing

- **Component tests** rely on Storybook stories as test fixtures via `@storybook/addon-vitest`. Writing a story IS writing a test.
- **Hook tests** use `vitest-browser-react` for rendering hooks in a real browser.
- **Helper tests** are standard unit tests, no browser needed.
- Storybook preview wraps all stories in `UIProvider` with light/dark theme toggle.
- a11y addon is configured with `color-contrast` check disabled (trusts design token contrast).
- Mock date is set to `2023-01-02 12:34:56` in Storybook.

## Build Pipeline

1. `vp pack` — tsdown bundles `src/index.ts` → ESM with `.d.mts` type declarations
2. `build:css` (`scripts/build-css.ts`) — copies `src/styles/*.css` → `dist/styles/` (`index.css` is renamed to `tailwind.css`), then compiles the `dist` entry with Tailwind to produce `dist/styles/index.css`, the prebuilt stylesheet

## Export Structure

The authoritative list is the `exports` map in `package.json`.

```
@k8ordo/ui                     all components, hooks, helpers, public types
@k8ordo/ui/i18n                ja / en dictionaries and the Messages type
@k8ordo/ui/ai                  AI chat components
@k8ordo/ui/ai/response         Response renderer only
@k8ordo/ui/ai-sdk              AI SDK adapter
@k8ordo/ui/json-render         json-render catalog
@k8ordo/ui/json-render/registry
@k8ordo/ui/openui              OpenUI component library
@k8ordo/ui/openui/prompt
@k8ordo/ui/tokens              design tokens as JS values
@k8ordo/ui/styles.css          prebuilt CSS (no Tailwind needed — for CSS Modules and plain CSS)
@k8ordo/ui/tailwind.css        Tailwind source entry (for Tailwind 4 projects; exposes the @theme tokens)
```
