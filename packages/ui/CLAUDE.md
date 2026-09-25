# Agent guide — packages/ui

`@k8ordo/ui` — the React component library in k8ordo. This file covers the
package itself. The shared discipline (React 19 / RSC assumed,
Baseline only, no polyfills) and how a new package joins are in the repository
root's [`CLAUDE.md`](../../CLAUDE.md).

## Package Commands

All commands run from this directory (`packages/ui`).

```bash
pnpm test                                    # Run all tests
pnpm test --project=helpers                  # Helper tests only (no browser)
pnpm test --project=hooks                    # Hook tests only (Playwright)
pnpm test --project=components               # Component tests only (Storybook + Playwright)
pnpm test --project=components-dark          # The same stories with the dark theme
pnpm test --project=components-forced-colors # Stories tagged forced-colors, under forced colors
pnpm test --project=components-contrast-more # Stories tagged contrast-more, under prefers-contrast: more
pnpm test --project=hooks src/internal/focus-trap.test.tsx # Single test file (needs its project)
pnpm build                                   # vp pack + CSS copy
pnpm typecheck                               # Type check (no emit)
pnpm check                                   # Oxlint/Oxfmt lint/format check
pnpm check:write                             # Oxlint/Oxfmt lint/format auto-fix
pnpm storybook                               # Storybook dev server (port 6006)
```

## Adding a New Component

1. Create directory `src/components/<category>/<name>/` (`buttons`, `form`, `overlays`, …) with 3 files:

```
src/components/<category>/<name>/
  <name>.tsx            # Implementation
  <name>.stories.tsx    # Storybook stories (also used as component tests)
  index.ts              # Re-export: export { ComponentName } from './<name>';
```

2. Add a re-export in `src/components/index.ts` if the component should be available from the root entry point (`src/index.ts` re-exports everything from there).

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
| `onAction`  | Activating an item or button (no event arg)   | `() => void` (`Button` / `IconButton` also accept a `Promise`)                           |

`type` is reserved for HTML attributes only (`button` / `submit`, input types).
Render props take a verb+noun form: `renderItem` / `renderAnchor` / `renderInput`.
In generative-UI schemas the trigger wording is `triggerLabel` and the body text
is `content` (`Toast` and `Alert` keep their component's `message`).

### Render props

Because every component omits `className` and `style`, a render prop is the only
escape hatch a caller has. There are two kinds, and they must not be blurred.

**Replacing the element** (`Button` / `IconButton` `renderItem`, `Anchor` /
`Breadcrumb.Link` `renderAnchor`). The bag is _everything the component would
have put on its own element_. For `Button` / `IconButton` that is the resolved
`className`, the composed `children` (icons and the pending spinner included),
`ref`, the click handler, the disabled and pending state, and the caller's
remaining attributes. The link components own less: `Anchor`'s bag is `href` /
`className` / `children` / `target` / `rel` and the caller's remaining
attributes, plus `kind` (`'internal' | 'external'`), which is not an attribute;
`Breadcrumb.Link` takes no extra attributes, so its bag is `href` / `className` /
`children`, and a `current` link renders a `<span>` without calling it. Build that
object once and hand the same one to both branches — the render prop and the
component's own element — so the two can never drift. A render prop that quietly
drops `onClick` or `disabled` hands the caller a dead, undisabled element with
no warning.

Two rules make such a bag usable on a tag other than the component's own:

- Type the handlers and the `ref` for `HTMLElement`, not for the concrete
  element. `ClipboardEventHandler<HTMLButtonElement>` will not go onto an `<a>`,
  and a `RefObject` is invariant — pass the ref through `mergeRefs` so it is a
  callback. Base the pass-through on `ButtonHTMLAttributes<HTMLElement>` rather
  than on `ComponentPropsWithRef<'button'>`.
- Ship `aria-disabled` next to `disabled`, and make the supplied click handler
  return early with `preventDefault()` while disabled. `disabled` does nothing
  on an `<a>`, so without both a "disabled" link still navigates.

**Filling a slot** (`FormControl` `renderInput`, `Popover.Trigger` /
`Tooltip.Trigger` / `FileField.Trigger` / `Alert` `action.renderItem`). The
component owns no element; the bag is wiring only — ids, ARIA relationships,
open/close handlers — and the prop is required rather than optional.

### Event handler value types

For form components, `onChange` takes **the element's meaningful value as its
first argument** — not the event object — except for the thin wrappers around a
native element (`TextField` / `Textarea` / `Select` / `PasswordInput`). Four
components also pass **the DOM event as a second argument**, so callers that
need it are not stuck:

- `Checkbox` / `Switch`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `Radio`: `(value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `FileField`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void` (no `event` when files are cleared programmatically)

The rest pass the value only, even when a real `<input>` is underneath:

- `Slider`: `(value: number) => void`
- `NumberField`: `(value: number | null) => void` (`null` is an empty field)
- `CheckboxGroup.Root` / `CheckboxCard` / `Autocomplete`: `(value: string[]) => void`
- `RadioCard` (notifies per group rather than per option input): `(value: string) => void`
- `ListBox`: `(value) => void`

The second argument can be added without breaking anyone — `(value) => void` is
assignable to `(value, event) => void` — and a caller that only needs the value
can keep taking one argument.

## Component Authoring Patterns

### Standard Component

```tsx
import type { FC, HTMLAttributes, Ref } from 'react';
import { cn } from '../../../helpers/cn';

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

The parts live in the `'use client'` module and are exported one by one; the
`X.Root` object is assembled in `index.ts`, which has no directive.

```tsx
// my-component.tsx
'use client';

export const Root: FC<PropsWithChildren> = ({ children }) => (
  <Context value={...}>{children}</Context>
);
export const Part: FC = () => { /* use(Context) */ };
```

```ts
// index.ts — no 'use client'
import { Part, Root } from './my-component';

export const MyComponent = { Root, Part } as const;
```

- Never build the object inside the client module. In the RSC server
  environment a client module's exports are reference proxies, so an object
  exported from there has no readable properties and `X.Root` is `undefined`
  in a Server Component. `src/components/compound-rsc.test.ts` fails on any
  `export const X = {` inside a `'use client'` file.
- Use `createContext` + `use()` (or `createSafeContext`) for sharing state between parts
- Use `useId()` for accessible `aria-labelledby`/`aria-describedby` connections
- `'use client'` directive at top when using hooks

### Content that gets replaced

A change that swaps what is on screen (`Tabs`) is applied inside
`startTransition`, and the swapped element is wrapped in
`<ViewTransition default="none" enter="auto" exit="auto">`: React animates
the swap with the platform's own cross-fade, and a panel that suspends keeps
the current one on screen until it is ready. `default="none"` is what keeps
an unrelated transition inside the panel — a `Button`'s action — from
animating it. `base.css` turns every view transition off under
`prefers-reduced-motion`, so a component never checks it itself.

## Design Token System

No raw color values — always use semantic tokens in Tailwind classes. The tokens are defined in `src/styles/tokens.css` (imported by `src/styles/index.css`) via CSS custom properties and mapped to Tailwind's `@theme inline`.

### Token Categories

| Category   | Tokens                                                                                     | Usage              |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------ |
| Foreground | `fg-base`, `fg-mute`, `fg-subtle`, `fg-inverse`                                            | Text colors        |
| Background | `bg-base`, `bg-raised`, `bg-surface`, `bg-subtle`, `bg-mute`, `bg-emphasize`, `bg-inverse` | Surfaces           |
| Border     | `border-base`, `border-subtle`, `border-mute`, `border-emphasize`, `border-inverse`        | Borders            |
| Status     | `{fg,bg,border}-{info,success,warning,error}`                                              | Semantic status    |
| Primary    | `primary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                                    | Teal accent        |
| Secondary  | `secondary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                                  | Cyan accent        |
| Group      | `group-{primary,secondary,tertiary,quaternary}`                                            | Data visualization |
| Other      | `back-drop` (`backdrop:bg-back-drop`), `transparent`                                       | Modal backdrop     |

### Dark Mode

Dark mode is class-based (`.dark` on `html`, put there by `@k8ordo/color-scheme`; the library never adds it). All semantic tokens automatically remap — no manual `dark:` prefixes needed for tokens. Custom variant defined via `@custom-variant dark (&:where(.dark, .dark *))`. `base.css` sets `color-scheme` to follow the same class (`light` on `:root`, `dark` on `.dark`), not `light dark`, since the tokens do not follow `prefers-color-scheme`.

### High Contrast and Forced Colors

The stylesheet follows `prefers-contrast: more` and `forced-colors: active`; `@k8ordo/color-scheme` is not involved, since the OS owns both settings.

- `tokens.css` redefines text and border tokens inside `@media (prefers-contrast: more)` on `:root:where(:not(.dark))` and `.dark`. `:where` keeps the specificity of `:root`, so a consumer's later `:root` override still wins.
- A surface outlined only by a shadow or a ground takes `HIGH_CONTRAST_EDGE` (`src/components/_internal/high-contrast.ts`): an inset `border-base` outline under either setting.
- Under forced colors only system colors survive and shadows are dropped. Paint selected state with `forced-colors:bg-[Highlight]` / `forced-colors:bg-[CanvasText]`, never rely on `box-shadow` for a boundary or focus, and hide with `invisible`, not `text-transparent` (a transparent color is repainted).

### Focus Style

Standard pattern: `focus-visible:border-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info`. The ring is a `box-shadow` and vanishes under forced colors; `outline-hidden` is what keeps focus visible there (Tailwind gives it a transparent outline, which forced colors paints). An item that shows focus with a ground instead (`DropdownMenu`, `ListBox`) keeps a transparent 2px outline and colors it under `contrast-more:`; `outline-hidden` would set `--tw-outline-style: none` and erase any outline added on top.

### Custom Utilities

- `grid-cols-auto-fill-*` / `grid-cols-auto-fit-*` — responsive grid columns
- `grid-rows-auto-fill-*` / `grid-rows-auto-fit-*` — responsive grid rows
- `writing-h` / `writing-v` / `writing-sideways-rl` — writing mode
- `z-overlay` / `z-modal` / `z-toast` — stacking order

Custom variants besides `dark:`: `light:` (anywhere not under `.dark`) and `vertical:` (under `.writing-v`, switched off again inside `.writing-h`).

## Testing

- **Component tests** rely on Storybook stories as test fixtures via `@storybook/addon-vitest`. Writing a story IS writing a test.
- **Hook tests** use `vitest-browser-react` for rendering hooks in a real browser.
- **Helper tests** are standard unit tests, no browser needed.
- **There is no jsdom project, and components are not written to survive one.** They call `ResizeObserver`, `matchMedia`, `dialog.showModal`, and the Popover API directly — no support checks, no null branches. Consumers are told to test in a real browser (`docs/GUIDE.md`); do not reintroduce a guard layer to make a synthetic DOM work.
- Storybook preview wraps all stories in `UIProvider` with light/dark theme toggle.
- Every story runs twice: `components` in light and `components-dark` in dark (`storybookTest({ initialGlobals: { theme: 'dark' } })`), because axe only checks the colors on screen. A story that pins `parameters.theme` stays in that theme in both.
- A form field in a story is given a name (`aria-label` in the meta `args`, and on any field a custom `render` draws), not a disabled `label` rule.
- `src/styles/contrast.stories.tsx` renders every pair in `docs/references/color.md`'s contrast table, AAA rows under `color-contrast-enhanced`; keep the two in step.
- The OS color settings cannot be switched per story, so they get projects of their own: `components-forced-colors` (Playwright `forcedColors: 'active'`) runs only stories tagged `forced-colors`, `components-contrast-more` (`contrast: 'more'`) only those tagged `contrast-more`, and `components` excludes both tags. Those stories live in `src/styles/high-contrast.stories.tsx`, hidden from the sidebar (`!dev`) and from Chromatic. Browser context options go in `playwright({ contextOptions })`; Vitest 5 ignores `instances[].context`.
- a11y addon fails a story on violations (`test: 'error'`), `color-contrast` included. Only overlay stories that axe misreads while they fade in turn `color-contrast` off for themselves: every `Modal` story, and one story each in `Dialog` and `Popover`.
- Mock date is set to `2023-01-02 12:34:56` in Storybook.

## Build Pipeline

1. `vp pack` — tsdown emits every `src/**/*.{ts,tsx}` except stories and tests file by file (`unbundle`) → ESM with `.d.mts` type declarations, keeping the directory layout under `dist/`; in-source tests are dropped by defining `import.meta.vitest` as `undefined`
2. `build:css` (`scripts/build-css.ts`) — copies `src/styles/*.css` → `dist/styles/` (`index.css` is renamed to `tailwind.css`), then compiles the `dist` entry with Tailwind to produce `dist/styles/index.css`, the prebuilt stylesheet

## Export Structure

The authoritative list is the `exports` map in `package.json`.

```
@k8ordo/ui                     core UI components and public types (AI chat is under /ai)
@k8ordo/ui/i18n                ja / en / dictionaries, useMessages, and the Messages type
@k8ordo/ui/ai                  AI chat components
@k8ordo/ui/ai/response         Response renderer only
@k8ordo/ui/ai-sdk              AI SDK adapter
@k8ordo/ui/code-block          CodeBlock (Server Component; shiki and server-only are dependencies)
@k8ordo/ui/json-render         json-render catalog
@k8ordo/ui/json-render/registry
@k8ordo/ui/openui              OpenUI component library
@k8ordo/ui/openui/prompt
@k8ordo/ui/tokens              design tokens as JS values
@k8ordo/ui/props.json          machine-readable component props (docs/props.generated.json)
@k8ordo/ui/styles.css          prebuilt CSS (no Tailwind needed — for CSS Modules and plain CSS)
@k8ordo/ui/tailwind.css        Tailwind source entry (for Tailwind 4 projects; exposes the @theme tokens)
```
