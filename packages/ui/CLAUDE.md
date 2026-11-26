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
pnpm test --project=components-forced-colors-contrast-more # The same under forced colors and prefers-contrast: more together
pnpm test --project=components-contrast-more # Stories tagged contrast-more, under prefers-contrast: more
pnpm test --project=forced-colors            # Screenshot comparisons under forced colors (src/styles/forced-colors.test.tsx)
pnpm test --project=print                    # Tokens and color-scheme under print media (src/styles/print.test.tsx)
pnpm test --project=print-contrast-more      # The same under prefers-contrast: more
pnpm test --project=tokens-css               # The built tokens.css alone on a page, with the OS set to dark (src/styles/tokens-css.test.tsx)
pnpm test --project=form                     # Checks a story's play cannot make (real input, real :hover), FormValue included (Playwright)
pnpm test --project=hooks src/internal/focus-trap.test.tsx # Single test file (needs its project)
TEST_BROWSER=webkit pnpm test --project=hooks # One engine only (chromium / firefox / webkit)
pnpm build                                   # vp pack + the DTCG tokens
pnpm typecheck                               # Type check (no emit)
pnpm check                                   # Oxlint/Oxfmt lint/format check + better-css-modules check
pnpm check:write                             # Oxlint/Oxfmt lint/format auto-fix
pnpm storybook                               # Storybook dev server (port 6006)
```

## Adding a New Component

1. Create directory `src/components/<category>/<name>/` (`buttons`, `form`, `overlays`, …) with 4 files:

```
src/components/<category>/<name>/
  <name>.tsx            # Implementation
  <name>.module.css     # Its styles (see Styling)
  <name>.stories.tsx    # Storybook stories (also used as component tests)
  index.ts              # Re-export: export { ComponentName } from './<name>';
```

A story that needs layout of its own puts it in `<name>.stories.module.css`.

2. Add a re-export in `src/components/index.ts` if the component should be available from the root entry point (`src/index.ts` re-exports everything from there).

3. Write its `### <Name>` section in `docs/references/components.md` — prose, an example, and a bare `Props:` line — under any of the category headings, then run `pnpm generate:props`. It records the props and the category (the `<category>` folder) in `docs/props.generated.json`, moves the section under its category's heading, fills the `Props:` block, and lists the component in the README. `check:props` fails in CI while any of that is stale. A new `<category>` folder also needs a title in `CATEGORIES` (`scripts/generate-component-docs.ts`) and in `categoryTitles` (`apps/docs/src/data/components-nav.ts`).

4. On the docs site: a page under `apps/docs/src/routes/[locale]/ui/components/<name>/`, its entry in `pages` (`src/data/components-nav.ts`; `src/data/component-groups.ts` groups it by the generated category on the server), its `description` in `src/messages/components.ts`, and a preview in `src/components/component-previews.tsx`, which fails to type-check until there is one.

5. Wording the component draws itself goes through the dictionary (see [Built-in wording](#built-in-wording)), and `src/catalog/coverage.test.ts` fails until the component is either in the generative-UI catalog or left out with a reason. A catalog entry is one item in `catalog` (`src/catalog/index.ts`: description, props schema, `children`, `value`) and one in `renderers` (`src/catalog/render.tsx`); a format's glue in `examples/ui-integrations` picks it up with no change of its own.

## Props Naming Conventions

### Boolean Props

- **A boolean that describes state** → prefix with `is`: `isOpen`, `isStreaming`
- **A boolean that selects a mode or variant** → no prefix: `interactive`, `animate`, `current`, `fullWidth`, `multiple`
- **A boolean that maps 1:1 onto a native HTML attribute or ARIA state** → keep the native name: `disabled`, `checked`, `required`, `invalid` (it is forwarded straight to `aria-invalid`, so no `is` prefix)

### Controllable Props (open/closed, selection, and similar state)

A component that owns state such as open/closed or a selection supports both
controlled and uncontrolled use, and names those props the same way across the
library. Reuse `useControllableState`.

- **State (controlled)**: `isOpen` for open/closed; a meaningful name such as `selectedId` or `value` for a selection.
- **Initial value (uncontrolled)**: `defaultOpen` / `defaultValue` / `defaultSelectedId`.
- **Change notification**: the component's main state notifies through `onChange?: (next) => void` (a close-only action is `onClose?`); any other state notifies through `on<Prop>Change`, named after its prop (`expandedIds` → `onExpandedIdsChange`, `selectedIds` → `onSelectedIdsChange`).
- **Arrays**: a prop that takes an array takes it `readonly` (`readonly string[]`), and a notification hands over a new `string[]`, so a `useState<string[]>` setter can be passed as it is.

For example: `Dialog` and `Drawer` take `isOpen?` + `defaultOpen?` + `onClose?`;
`Tabs.Root` takes `selectedId` + `onChange?`, or `defaultSelectedId` when uncontrolled;
`Accordion.Item` takes `isOpen?` + `defaultOpen?` + `onChange?`.

### Prop vocabulary

| prop        | Meaning                                             | Example values                                                                           |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `variant`   | Visual variant                                      | `solid` / `outline` / `skeleton` / `shadow`                                              |
| `color`     | Which color-token family to use                     | Accents: `primary` / `secondary` / `base`; monochrome weight: `base` / `mute` / `subtle` |
| `tone`      | Status semantics (this prop only)                   | `neutral` / `info` / `success` / `warning` / `error`                                     |
| `size`      | Size                                                | `sm` / `md` / `lg`                                                                       |
| `label`     | Visible text or accessible name                     | —                                                                                        |
| `role`      | Which ARIA role to use                              | `dialog` / `alertdialog`                                                                 |
| `side`      | Placement against a viewport edge                   | `center` / `bottom` / `right` / `left`                                                   |
| `placement` | Placement relative to an anchor (`Placement`)       | `bottom-start`, …                                                                        |
| `action`    | Work a press runs in a transition, shown as pending | `() => void \| Promise<void>` (`Button` / `IconButton` / `Card` / `Message.Action`)      |
| `onAction`  | Activating an item (no event arg), called as is     | `() => void` (`DropdownMenu.Item` / `ContextMenu.Item` / `CommandPaletteItem`)           |

`type` is reserved for HTML attributes only (`button` / `submit` / `reset`, input types).
Render props take a verb+noun form: `renderItem` / `renderAnchor` / `renderInput`.
In generative-UI schemas the trigger wording is `triggerLabel` and the body text
is `content` (`Toast` and `Alert` keep their component's `message`).

### Render props

Every component omits `className` and `style`, and a render prop is not a way
around that: it exists to hand an element to someone else's component (a
framework's `<Link>`) or to fill a slot. There are two kinds, and they must not
be blurred.

**Replacing the element** (`renderAnchor` on `Button` / `IconButton` with
`href`, `Anchor`, `Breadcrumb.Link`, `SideNav.Link`, `DropdownMenu.Item` /
`ContextMenu.Item` with `href`, `Card` with `href`). The bag is _everything the
component would have put on its own `<a>`_. For `Button` / `IconButton` that is
`href`, the resolved `className`, the composed `children` (icons included),
`ref`, the click handler, `aria-disabled`, and the caller's remaining anchor
attributes (`IconButton` adds `aria-label` and the tooltip's handlers, chained
with the caller's). A button is never replaced: `type`, `action` and the
pending state belong to the `<button>` side, and `href` switches to the `<a>`
side. The link components own less: `Anchor`'s bag is `href` /
`className` / `children` / `target` / `rel` and the caller's remaining
attributes, plus `kind` (`'internal' | 'external'`), which is not an attribute;
`Breadcrumb.Link`'s bag is `href` / `className` / `children` and the caller's
remaining anchor attributes, and a `current` link renders a `<span>` without
calling it;
`SideNav.Link`'s bag is `href` / `className` / `children` / `aria-current` and
the caller's remaining anchor attributes; `DropdownMenu.Item` /
`ContextMenu.Item`'s bag is `href` / `className` / `children` / `role` and the
keyboard wiring (`id` / `ref` / `tabIndex` / `onFocus` / `onClick` /
`onKeyDown`), all of which must be spread; `Card`'s bag is `href` /
`className` / `aria-labelledby` and, with `openInNewTab`, `target` / `rel`,
with no `children`, since the link takes its name from the content and the
hidden new-tab wording through `aria-labelledby`. Build that
object once and hand the same one to both branches — the render prop and the
component's own element — so the two can never drift. A render prop that quietly
drops `onClick` or `aria-disabled` hands the caller a dead, undisabled element with
no warning.

A component that renders either a `<button>` or an `<a>` takes the two shapes
as overloads, the link one generic in its `href` (`<T extends string>`, handed
back as `NoInfer<T>` so a typed route stays typed), the button one last: a
single generic union leaves a handler's argument untyped, and `ComponentProps`
reads the last signature. A disabled link ships `aria-disabled` and a click
handler that calls `preventDefault()`, since `disabled` does nothing on an
`<a>`.

**Filling a slot** (`FormControl` `renderInput`, `Popover.Trigger` /
`Tooltip.Trigger` / `FileField.Trigger`). The
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
- `FileField`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void` (`files` is the whole list the field holds, not only the files just picked or dropped; no `event` when files are dropped or removed from the list)

The rest pass the value only, even when a real `<input>` is underneath:

- `Slider`: `(value: number) => void`
- `NumberField`: `(value: number | null) => void` (`null` is an empty field)
- `CheckboxGroup.Root` / `CheckboxCard` / `Autocomplete`: `(value: string[]) => void`
- `Tree`'s `onExpandedIdsChange`: `(ids: string[]) => void`
- `RadioCard` (notifies per group rather than per option input): `(value: string) => void`
- `ListBox`: `(value) => void`

The second argument can be added without breaking anyone — `(value) => void` is
assignable to `(value, event) => void` — and a caller that only needs the value
can keep taking one argument.

## Component Authoring Patterns

### Standard Component

```tsx
// my-component.tsx
import { clsx } from 'clsx';
import type { FC, HTMLAttributes, Ref } from 'react';

import styles from './my-component.module.css';

const SIZE = { sm: styles.sm, md: styles.md } as const;

export const MyComponent: FC<
  { size?: 'sm' | 'md'; ref?: Ref<HTMLDivElement> } & Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style'
  >
> = ({ size = 'md', ...rest }) => (
  <div className={clsx(styles.root, SIZE[size])} {...rest} />
);
```

```css
/* my-component.module.css */
.root {
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-base);
}

.sm {
  padding: calc(var(--spacing) * 2);
}

.md {
  padding: calc(var(--spacing) * 4);
}
```

Base the props on the element-specific `*HTMLAttributes`. `HTMLProps` extends
`AllHTMLAttributes`, so it type-checks attributes the element does not even have,
such as `href` or `src` (`Button` and `IconButton` were moved for this reason).
`*HTMLAttributes` does not include `ref`, so add it explicitly when needed.

### Styling

Each component has a CSS module next to it (`foo.tsx` + `foo.module.css`),
checked by `better-css-modules check` (`better-css-modules.config.ts`) and
wrapped into `@layer components` by its plugin, in Vite and in `vp pack` alike.

- **Join classes with `clsx`.** There is no `cn` and no tailwind-merge: two
  classes never fight over a property, because the module decides the order.
  Where a state must cancel a variant (a disabled solid `Button` does not darken
  on hover), say so in the selector (`.solidPrimary:not(.disabled):hover`) or
  with a compound class. `button.module.css` is the worked example.
- **Variants are modifier classes** on the element itself
  (`styles.solidPrimary`, `styles.sm`), never data attributes: a caller who
  copies only `className` from a `renderAnchor` bag must get the whole look.
  States the component already exposes as ARIA or native attributes are styled
  from those (`&[aria-pressed='true']`, `&:disabled`, `&:checked`).
- **Map a prop to a class with an object** (`const SIZE = { … } as const`).
  `styles[prop]` hides which classes are used, and `check` reports it
  (`usage/unanalyzable`).
- **Every value is a token.** `check` reports raw colors, lengths, font
  values, durations and easings, the palette (`--gray-500`), and misspelt
  tokens. A disable comment needs a reason
  (`/* better-css-modules-disable-next-line tokens/spacing -- … */`) and is for
  values that are not a step of any scale.
- **Selectors style the component's own classes.** Markup the component does
  not write (Markdown, shiki, streamdown) is styled inside
  `.root { @scope (&) { … } }`, where its own class names are `:global(...)`.
  Write `& >`, never `:scope >`, and no `composes` (it does not work in a
  layer; join classes in JS). `&` gives a rule inside `@scope` no
  specificity, so `svg` there is (0,0,1) and loses to any class on the
  element: the icons' size classes are `:where()` for that reason, so a
  component that sizes the icons inside it wins. When a scoped rule must tie
  with a class on the element it styles (`Toolbar`'s pressed ground over a
  solid `Button`'s `:hover` and `:active` grounds), write `&:scope >`:
  `:scope` adds one class of specificity, and on a tie the scoped rule wins
  by proximity. A bare `:scope >` gets an `&` prepended by Lightning CSS and
  matches nothing.
- **Hover** is `@media (hover: hover) { .x:hover { … } }`, as Tailwind wrote it.
- **Vertical writing**: prefer logical properties; where an element must
  change in vertical text, use `@container style(--writing: vertical) { … }`,
  which reads the parent's `--writing` (set by the `writing-v` / `writing-h`
  classes in `base.css`). An element that puts `writing-v` on itself takes a
  modifier class instead, since the query does not see its own class.
- Shared looks are shared modules in `src/components/_internal/`:
  `focus-ring.module.css` (`ring`, `ringNoBorder`, `ringWithin`),
  `high-contrast.module.css` (`edge`), `sr-only.module.css` (`srOnly`).

### Icons

One file is one icon. `src/components/icons/eye-closed.tsx` exports
`EyeClosedIcon`, drawn inside `LineIcon` (`line-icon.tsx`), which holds the
grammar every icon shares: a 16×16 grid, `stroke-width` 1.25, round caps and
joins, no fill, `currentColor`. Keep 2px of padding, round corners by 1.25–2.75,
and fill a shape only where a line would not read (a dot, a half).

- **Name the shape, not a use**: `BookmarkIcon`, not `SubscribeIcon`. Only
  `AlertIcon` (`status`) and `ChevronIcon` (`direction`) pick a shape from a
  meaning. No logos: a brand mark belongs to the application.
- **Each icon declares `size = 'md'` itself** and passes it to `LineIcon`.
  `scripts/extract-props.ts` reads a default only from the component's own
  parameter.
- **A component imports the icon's module** (`'../../icons/check'`), never the
  `icons` index, so its output depends only on the icons it draws.
- **Run `pnpm generate:props` after adding a file.** `scripts/generate-icons.ts`
  writes the `@k8ordo/ui/icons` entry (`icons/index.ts`) and the generative-UI
  catalog's icon list (`catalog/icon-names.ts`, `icon-map.ts`)
  from the files; `check:props` fails in CI while any of them is stale. The
  catalog must not import a component, so its names live in a module of their
  own.

### Compound Component (Tabs, Accordion, FileField pattern)

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

### Form fields

A field must work when `@k8ordo/form`'s `formFields` output is spread onto it
unchanged (each field's `WithForm` story holds it to that). Four rules follow:

- **Accept the derived attribute types.** `input` carries `type` as a string
  (none on a plain text field), `min` / `max` as numbers, `step` as
  `number | 'any'`, and the echoed `defaultValue` as a string — an array of the
  checked options on a checkbox group, and none on a file field. Widen a prop to
  take them, or take one and drop it (`Textarea`'s `type`); never make the
  caller destructure it away.
- **Keep an uncontrolled value in the DOM.** Pass `defaultValue` /
  `defaultChecked` to the element, not a `value` / `checked` mirrored from
  state: a form reset — React's after every action included — restores the
  DOM without a change event, and the form reads dirtiness from the
  element's own default. Draw the look from `:checked` rather than from state.
  Where state is unavoidable (a filled track, a file list), listen for the
  form's `reset` and put it back.
- **Announce a value written in code.** Set the DOM value first, then dispatch
  one `new Event('input', { bubbles: true })` when it actually changed, and
  never during a reset. React's value tracker remembers the assignment, so the
  element's own `onChange` does not fire twice.
- **Submit a composite through `FormValue`** (`src/components/_internal/form-value.tsx`)
  when the visible part is not the element that submits (`Autocomplete`).
  Not `type="hidden"`: it is barred from constraint validation, cannot take
  focus, and with nothing selected no element carries the name at all.

### Built-in wording

A component reads its own wording with `getMessages()` (`src/i18n/current.ts`),
which looks the dictionary up in `@k8ordo/i18n`'s `currentLocale()` — English
when the application has defined no locale set. It is a plain function, not a
hook, so wording never makes a component a client module:
`src/components/compound-rsc.test.ts` keeps the ones that only read wording
(`Spinner`, `Anchor`, `Card`, `Breadcrumb`, `Code`, `Alert`, `Callout`, `Reasoning`, `ToolInvocation`) free
of `'use client'`. A new key goes into `messages.ts`, `ja.ts`, `en.ts`, and
`usage.ts` (the components that draw it); there is no provider and no context.
`pnpm generate:props` writes the key list in `docs/references/components.md`
from `usage.ts`, and the same mapping into `docs/props.generated.json`
(`messages`), which the docs site's i18n page reads.

### Pending state

`Button` / `IconButton` waiting on their own action — an `action` promise, or
the form's action for a submit button — take `aria-busy` and `aria-disabled` and
ignore presses in the click handler, but never native `disabled`. Chromium
moves focus to `body` once the focused element is disabled, so a keyboard user
who pressed the button would lose their place. Native `disabled` is kept for a
`disabled` the caller passed. The click handler covers implicit submission too:
Enter in a field fires a click at the default button, and `preventDefault()`
there cancels the submission. `PendingKeepsFocus` in `button.stories.tsx` shows
how to test it — keyboard focus, a promise the play function resolves, and two
animation frames before `toHaveFocus()`.

### Content that gets replaced

An element that gets swapped (`Tabs`' panels) is drawn from a deferred copy
of the selection (`useDeferredValue`), while the selection's own marks — the
selected tab, its indicator — follow the value at once. The swapped element
is wrapped in `<ViewTransition default="none" enter="auto" exit="auto">`:
React animates the deferred swap with the platform's own cross-fade, and a
panel that suspends keeps the current one on screen until it is ready. Both
hold when the controlled value arrives in a synchronous update (a store read
through `useSyncExternalStore`, `@k8ordo/state` included), which a setter
wrapped in `startTransition` could not promise. `default="none"` is what
keeps an unrelated transition inside the panel — a `Button`'s action — from
animating it. `base.css` turns every view transition off under
`prefers-reduced-motion`, so a component never checks it itself.

## Design Token System

No raw values — always the semantic tokens. They are custom properties declared
at `:root` in `src/styles/tokens.css`, named by the category better-css-modules
checks: `--color-*`, `--spacing` / `--spacing-em`, `--radius-*`, `--shadow-*`
(including the focus rings `--shadow-ring-*`), `--font-family-*`,
`--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`,
`--z-index-*`, `--duration-*`, `--easing-*`, `--breakpoint-*`. A name without a
category (`--teal-500`) is the palette, internal to `tokens.css`.

### Token Categories (color)

| Category   | Tokens                                                                                 | Usage              |
| ---------- | -------------------------------------------------------------------------------------- | ------------------ |
| Foreground | `--color-fg-base`, `-mute`, `-subtle`, `-inverse`                                      | Text colors        |
| Background | `--color-bg-base`, `-raised`, `-surface`, `-subtle`, `-mute`, `-emphasize`, `-inverse` | Surfaces           |
| Border     | `--color-border-base`, `-subtle`, `-mute`, `-emphasize`, `-inverse`                    | Borders            |
| Status     | `--color-{fg,bg,border}-{info,success,warning,error}`                                  | Semantic status    |
| Primary    | `--color-primary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                        | Teal accent        |
| Secondary  | `--color-secondary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                      | Cyan accent        |
| Group      | `--color-group-{primary,secondary,tertiary,quaternary}`                                | Data visualization |
| Other      | `--color-back-drop`, `--color-system-*` (system colors under forced colors)            |                    |

A color token with a dark value is `light-dark(<light>, <dark>)` at `:root`. A
custom property passes `light-dark()` on unresolved, and the element that uses
the value picks the color by its own `color-scheme`, so a token that reads
another one (`--shadow-ring-info` reads `--color-border-info`) is declared once,
at `:root`, and is dark under a nested `.dark` too.

### Dark Mode

Dark mode is class-based (`.dark` on `html`, put there by `@k8ordo/color-scheme`; the library never adds it). `tokens.css` sets `color-scheme` from the class (`light` on `:root`, `dark` on `.dark`), not `light dark`, so the OS setting alone changes nothing. The color tokens' `light-dark()` follows `color-scheme`, so it follows `.dark`, and components never branch on it. A page that should follow the OS setting instead sets `color-scheme: light dark` on `:root` in its own CSS.

Under `@media print` a `.dark` that contains no `.print-as-shown` goes back to light: `tokens.css` sets `color-scheme: light` on it, so every `light-dark()` gives its light value (the light `prefers-contrast: more` values included), and the bridge's `dark:` / `light:` variants split on the same condition.

### High Contrast and Forced Colors

The stylesheet follows `prefers-contrast: more` and `forced-colors: active`; `@k8ordo/color-scheme` is not involved, since the OS owns both settings.

- `tokens.css` redefines text and border tokens (and the dark `bg-emphasize`) inside `@media (prefers-contrast: more)` on `:root`, each as a `light-dark()` pair, so a consumer's later `:root` override still wins. A name only one side changes keeps the other side's usual value.
- A surface outlined only by a shadow or a ground takes `highContrast.edge` (`src/components/_internal/high-contrast.module.css`): an inset outline under either setting, `--color-border-base` under `prefers-contrast: more` and `CanvasText` under forced colors. Every part of it, color and offset included, sits behind those media queries and `:not(:focus-visible)`, so a surface that takes focus itself (the `<dialog>` of `Dialog` and `Drawer`) keeps the browser's own focus ring untouched.
- Under forced colors only system colors survive and shadows are dropped. Paint selected state with `var(--color-system-highlight)` / `var(--color-system-canvas-text)` inside `@media (forced-colors: active)`, never rely on `box-shadow` for a boundary or focus, and hide with `visibility: hidden`, not a transparent color (a transparent color is repainted).
- A part that keeps its own colors with `forced-color-adjust: none` (`Code`'s color swatch, `ColorPicker`'s preview and tracks) is not repainted at all: its border, outline and focus ring keep whatever color the cascade gives them, a transparent one included, and its `box-shadow` stays. Give each of them a `--color-system-*` color inside `@media (forced-colors: active)` (`CanvasText`, the color the browser paints the others), and drop the shadow there. `ForcedColorsOwnColors` in `src/styles/high-contrast.stories.tsx` checks the three.

### Focus Style

`focusRing.ring` (`src/components/_internal/focus-ring.module.css`): on `:focus-visible`, a transparent border, no outline, and `box-shadow: var(--shadow-ring-info)`. A date or time `<input>` takes it on `:focus` as well: the focus sits on the field's inner parts (year, month, day), and WebKit then matches `:focus` on the input but never `:focus-visible`, while Chromium and Firefox match `:focus-visible` on such a field whenever it has focus. The border stays when the element is `[aria-invalid='true']` (for `ringWithin`, when anything inside it is), so a field's error border shows while it has focus: style the error border on the field and do not copy the ring into its module. Under forced colors a transparent 2px outline, which the browser paints, since the ring is a shadow. Where the component has a shadow of its own, write the focus rule locally with both, ring first (`var(--shadow-ring-info), var(--shadow-xs)`). An item that shows focus with a ground instead (`DropdownMenu`, `ListBox`) keeps a transparent 2px outline and colors it under `prefers-contrast: more`. The range thumb (`src/components/form/slider/range-input-class.module.css`, shared by `Slider`, `RangeSlider`, and `ColorPicker`) draws both the ring and its forced-colors outline on `::-webkit-slider-thumb` / `::-moz-range-thumb`, not on the input.

### The Tailwind bridge

`src/styles/tailwind.css` (published as `./tailwind.css`) is for consumers using Tailwind CSS 4, who import it after their own `@import 'tailwindcss'`: it imports `index.css`, maps Tailwind's theme namespaces onto the tokens with `@theme inline reference` (so `bg-bg-base` reads `var(--color-bg-base)` and the theme declares no variables of its own), and keeps the `dark:` / `light:` / `vertical:` variants and the `grid-cols-auto-fill-*`, `writing-*`, `z-overlay|modal|toast` utilities. It never imports `tailwindcss`, and the package does not depend on it, not even as a dev dependency: the bridge is compiled and checked where Tailwind is, by `examples/ui-integrations/src/tailwind.test.ts`, against the built `dist/` and the DTCG `./tokens`. Add a token to `tokens.css`, and a color token also needs its line in the bridge (that test fails until it has one).

## Testing

- **Component tests** rely on Storybook stories as test fixtures via `@storybook/addon-vitest`. Writing a story IS writing a test.
- **Hook tests** use `vitest-browser-react` for rendering hooks in a real browser.
- **Form wiring** is a story too: every form field has a `WithForm` story that spreads `@k8ordo/form`'s `formFields` output onto it inside `ActionForm` (`.storybook/action-form.tsx`), whose action calls `parseForm` the way a Server Action would. Its play submits, fails on the server (`MemoField` refuses `却下`), resets, and reads `isDirty` from the `変更あり` / `変更なし` line. `parseForm` echoes the submitted values on success as well, so after any submission they are the fields' defaults and a reset goes back to them. `storybook/test`'s `userEvent` remembers what it typed and a form reset restores only the DOM, so type into a field with `fill` from the same file, which clears it first. `@k8ordo/form` is a devDependency and resolves from its `dist/`, so build it first on a fresh checkout.
- A play's typing is a script's assignment, not a user edit, and the browser flags `tooShort` / `tooLong` only for a user edit; a play's pointer is synthetic, so it never puts an element under `:hover`. Those checks — the length flags, and a pressed `Toolbar` item keeping its ground under a real `:hover` — live with `FormValue`'s own tests in the `form` project (`src/components/form/**/*.test.tsx`, `src/components/_internal/**/*.test.tsx`, `src/components/buttons/**/*.test.tsx`): plain Vitest browser tests with Playwright's real input and pointer, one file at a time (`fileParallelism: false`), since Firefox hands focus between pages that run side by side. `styles.css` is not loaded there, so a visually hidden input (`srOnly`) cannot be clicked: press its label, as a user does; a test that reads the look imports `src/styles/index.css` itself.
- **Helper tests** are standard unit tests, no browser needed.
- **There is no jsdom project, and components are not written to survive one.** They call `ResizeObserver`, `matchMedia`, `dialog.showModal`, and the Popover API directly — no support checks, no null branches. Consumers are told to test in a real browser (`docs/GUIDE.md`); do not reintroduce a guard layer to make a synthetic DOM work.
- Storybook preview wraps all stories in `ToastProvider` with light/dark theme toggle, and defines a `@k8ordo/i18n` locale set (`.storybook/locales.ts`, default `ja`) so the built-in wording is Japanese; a story renders in English with `beforeEach: inEnglish` from the same file.
- Every story runs twice: `components` in light and `components-dark` in dark (`storybookTest({ initialGlobals: { theme: 'dark' } })`), because axe only checks the colors on screen. A story that pins `parameters.theme` stays in that theme in both.
- A form field in a story is given a name (`aria-label` in the meta `args`, and on any field a custom `render` draws), not a disabled `label` rule.
- `src/styles/contrast.stories.tsx` renders every pair in `docs/references/color.md`'s contrast table, AAA rows under `color-contrast-enhanced`; keep the two in step.
- The OS color settings cannot be switched per story, so they get projects of their own: `components-forced-colors` (Playwright `forcedColors: 'active'`) runs only stories tagged `forced-colors`, `components-contrast-more` (`contrast: 'more'`) only those tagged `contrast-more`, and `components` excludes both tags. `components-forced-colors-contrast-more` runs the `forced-colors` stories again with both settings, as a Windows contrast theme sets them: a `prefers-contrast: more` rule can then win over a `forced-colors: active` one. Those stories live in `src/styles/high-contrast.stories.tsx`, hidden from the sidebar (`!dev`) and from Chromatic. Browser context options go in `playwright({ contextOptions })`; Vitest 5 ignores `instances[].context`.
- A focus mark a play function cannot read (a range thumb is a pseudo-element; WebKit emulates forced colors as the media query alone, so a transparent outline still reads as transparent) is compared as screenshots, with and without focus, in `src/styles/forced-colors.test.tsx`, run by the `forced-colors` project (plain Vitest browser tests under `forcedColors: 'active'`). WebKit keeps the `box-shadow` ring, so those tests catch a regression only in Chromium and Firefox.
- Print media has no Playwright context option either, so `src/styles/print.test.tsx` runs in a `print` project of its own and switches the page with the `emulateMedia` command defined there (`page.emulateMedia` on the Playwright side). It reads the names of the `light-dark()` tokens from the loaded stylesheet and compares the colors they give in print with the ones measured on screen, so it never copies a token value. `prefers-contrast: more` is not switched by that command: `print-contrast-more` runs the same file with `contrast: 'more'` as a context option, because Firefox's emulation never restyles the page when only the contrast changes (`matchMedia` flips, computed styles do not).
- `./tokens.css` is checked on a page that loads nothing else: `src/styles/tokens-css.test.tsx` puts the built `dist/styles/tokens.css` into an iframe and compares the colors the tokens give there with the ones an element gets under its own `color-scheme`. Its `tokens-css` project sets the OS to dark as a context option (`colorScheme: 'dark'`): only then does a page without `.dark` staying light, or a page that overrides `color-scheme` turning dark, show anything. It reads `dist/`, so build first.
- a11y addon fails a story on violations (`test: 'error'`), `color-contrast` included. Only overlay stories that axe misreads while they fade in turn `color-contrast` off for themselves: every `Dialog` and `CommandPalette` story, and one story in `Popover`.
- Mock date is set to `2023-01-02 12:34:56` in Storybook.

## Build Pipeline

1. `vp pack` — tsdown emits every `src/**/*.{ts,tsx}` except stories and tests file by file (`unbundle`) → ESM with `.d.mts` type declarations, keeping the directory layout under `dist/`; in-source tests are dropped by defining `import.meta.vitest` as `undefined`. Each `*.module.css` becomes `*.module.mjs` plus a compiled `.css` it imports (`pack.css.inject`), wrapped in `@layer components` by the better-css-modules plugin; class names are hashed from the path under this directory (`css.lightningcss.projectRoot`). `src/styles/index.css` is an entry too and becomes `dist/styles/index.css` (`./styles.css`) with its `@import`s inlined, and so is `src/styles/tokens.css`, one of those imports, which becomes `dist/styles/tokens.css` (`./tokens.css`); `src/styles/tailwind.css` is copied as is.
2. `node scripts/build-tokens.ts` — writes `dist/styles/tokens.mjs` / `.d.mts` (`./tokens`) from `exportTokens(await loadConfig())`.

`./tokens.css` is for a page that reads the variables and nothing else: the tokens outside any layer, and the three `color-scheme` rules. Those rules live in `tokens.css` rather than in `base.css` for its sake — the colors are `light-dark()`, so without them such a page would not turn dark under `.dark` — and they stay in `@layer base`, so a page that should follow the OS overrides them with an unlayered `:root { color-scheme: light dark; }`. `--writing` is not a token and stays in `base.css`. `dist.test.ts` holds the file to the tokens `styles.css` declares outside a layer (all but `--writing`), those three rules and nothing else, with every `light-dark()` left as written.

`src/styles/dist.test.ts` holds the output to the contract: every component CSS file is in `@layer components` after the full layer statement, every `.module.mjs` imports its CSS, `styles.css` puts nothing but tokens outside a layer, and `tokens.mjs` is the DTCG document. It reads `dist/`, so build first.

The CSS is compiled for the browsers in `css-target.ts` — by `vp pack`, and by Vite under Storybook and the tests, through both `build.cssTarget` and `css.lightningcss.targets` — so Lightning CSS rewrites none of `light-dark()`, `:dir()` and nesting. `docs/GUIDE.md` asks a consumer's bundler for the same browsers, and `src/styles/css-target.test.ts` fails when the versions it names drift from `CSS_TARGET`.

The types of the CSS modules are written by `better-css-modules generate` into `__generated__/` (git-ignored; `rootDirs` in `tsconfig.json`). `typecheck` and `check` run it first; the Vite plugin writes them when Storybook, vitest or `vp pack` start.

## Export Structure

The authoritative list is the `exports` map in `package.json`.

```
@k8ordo/ui                     core UI components and public types (AI chat is under /ai, icons under /icons)
@k8ordo/ui/icons               line icons (one module each) and BaseIcon
@k8ordo/ui/i18n                ja / en, registerMessages, getMessages, and the Messages type
@k8ordo/ui/ai                  AI chat components
@k8ordo/ui/ai/response         Response renderer only
@k8ordo/ui/code-block          CodeBlock (Server Component; shiki and server-only are dependencies)
@k8ordo/ui/catalog             the generative-UI catalog, for no format in particular (server-safe)
@k8ordo/ui/catalog/render      how each catalog component is drawn ('use client')
@k8ordo/ui/tokens              design tokens as a DTCG resolver document
@k8ordo/ui/props.json          machine-readable component props and wording keys (docs/props.generated.json)
@k8ordo/ui/styles.css          layer order, tokens, reset and base (each component imports its own CSS)
@k8ordo/ui/tokens.css          the tokens and the color-scheme rules of styles.css alone (no reset, no base)
@k8ordo/ui/tailwind.css        Tailwind CSS 4 bridge, imported after tailwindcss (styles.css + utilities for the tokens)
```
