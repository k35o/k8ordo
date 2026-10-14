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
pnpm test --project=form                     # Fields with @k8ordo/form's derived attributes, and FormValue (Playwright)
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

5. Wording the component draws itself goes through the dictionary (see [Built-in wording](#built-in-wording)), and `src/integrations/coverage.test.ts` fails until the component is either in the generative-UI catalog or left out with a reason.

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
`Breadcrumb.Link` / `SideNav.Link` `renderAnchor`). The bag is _everything the component would
have put on its own element_. For `Button` / `IconButton` that is the resolved
`className`, the composed `children` (icons and the pending spinner included),
`ref`, the click handler, the disabled and pending state, and the caller's
remaining attributes. The link components own less: `Anchor`'s bag is `href` /
`className` / `children` / `target` / `rel` and the caller's remaining
attributes, plus `kind` (`'internal' | 'external'`), which is not an attribute;
`Breadcrumb.Link` takes no extra attributes, so its bag is `href` / `className` /
`children`, and a `current` link renders a `<span>` without calling it;
`SideNav.Link`'s bag is `href` / `className` / `children` / `aria-current` and
the caller's remaining anchor attributes. Build that
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
- `FileField`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void` (`files` is the whole list the field holds, not only the files just picked or dropped; no `event` when files are dropped or removed from the list)

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
  copies only `className` from a `renderItem` bag must get the whole look.
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
  component that sizes the icons inside it wins.
- **Hover** is `@media (hover: hover) { .x:hover { … } }`, as Tailwind wrote it.
- **Vertical writing**: prefer logical properties; where an element must
  change in vertical text, use `@container style(--writing: vertical) { … }`,
  which reads the parent's `--writing` (set by the `writing-v` / `writing-h`
  classes in `base.css`). An element that puts `writing-v` on itself takes a
  modifier class instead, since the query does not see its own class.
- Shared looks are shared modules in `src/components/_internal/`:
  `focus-ring.module.css` (`ring`, `ringNoBorder`, `ringWithin`),
  `high-contrast.module.css` (`edge`), `sr-only.module.css` (`srOnly`).

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

### Form fields

A field must work when `@k8ordo/form`'s `formFields` output is spread onto it
unchanged (`src/components/form/with-form.test.tsx` holds each component to
that). Four rules follow:

- **Accept the derived attribute types.** `input` carries `type` as a string,
  `min` / `max` as `number | string`, `step` as `number | 'any'`, and the
  echoed `defaultValue` as a string whatever the field is. Widen a prop to
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
(`Spinner`, `Breadcrumb`, `Code`, `Alert`, `Callout`, `Reasoning`, `ToolInvocation`) free
of `'use client'`. A new key goes into `messages.ts`, `ja.ts`, `en.ts`, and
`usage.ts` (the components that draw it); there is no provider and no context.
`pnpm generate:props` writes the key list in `docs/references/components.md`
from `usage.ts`, and the docs site's i18n page reads it through the exported
`messageUsage`.

### Pending state

`Button` / `IconButton` waiting on their own action — an `onAction` promise, or
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

A change that swaps what is on screen (`Tabs`) is applied inside
`startTransition`, and the swapped element is wrapped in
`<ViewTransition default="none" enter="auto" exit="auto">`: React animates
the swap with the platform's own cross-fade, and a panel that suspends keeps
the current one on screen until it is ready. `default="none"` is what keeps
an unrelated transition inside the panel — a `Button`'s action — from
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

| Category   | Tokens                                                                                                          | Usage              |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ------------------ |
| Foreground | `--color-fg-base`, `-mute`, `-subtle`, `-inverse`                                                               | Text colors        |
| Background | `--color-bg-base`, `-raised`, `-surface`, `-subtle`, `-mute`, `-emphasize`, `-inverse`                          | Surfaces           |
| Border     | `--color-border-base`, `-subtle`, `-mute`, `-emphasize`, `-inverse`                                             | Borders            |
| Status     | `--color-{fg,bg,border}-{info,success,warning,error}`                                                           | Semantic status    |
| Primary    | `--color-primary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                                                 | Teal accent        |
| Secondary  | `--color-secondary-{fg,bg,bg-subtle,bg-mute,bg-emphasize,border}`                                               | Cyan accent        |
| Group      | `--color-group-{primary,secondary,tertiary,quaternary}`                                                         | Data visualization |
| Other      | `--color-back-drop`, `--color-logo-{primary,secondary}`, `--color-system-*` (system colors under forced colors) |                    |

A token that reads another one (`--shadow-ring-info` reads
`--color-border-info`) is declared again under `.dark`, because a custom
property resolves where it is declared.

### Dark Mode

Dark mode is class-based (`.dark` on `html`, put there by `@k8ordo/color-scheme`; the library never adds it). All semantic tokens remap under `.dark`, so components never branch on it. `base.css` sets `color-scheme` to follow the same class (`light` on `:root`, `dark` on `.dark`), not `light dark`, since the tokens do not follow `prefers-color-scheme`; `light-dark()` therefore follows `.dark` too.

### High Contrast and Forced Colors

The stylesheet follows `prefers-contrast: more` and `forced-colors: active`; `@k8ordo/color-scheme` is not involved, since the OS owns both settings.

- `tokens.css` redefines text and border tokens inside `@media (prefers-contrast: more)` on `:root:where(:not(.dark))` and `.dark`. `:where` keeps the specificity of `:root`, so a consumer's later `:root` override still wins.
- A surface outlined only by a shadow or a ground takes `highContrast.edge` (`src/components/_internal/high-contrast.module.css`): an inset `--color-border-base` outline under either setting. Every part of it, color and offset included, sits behind those media queries and `:not(:focus-visible)`, so a surface that takes focus itself (`Modal`'s `<dialog>`) keeps the browser's own focus ring untouched.
- Under forced colors only system colors survive and shadows are dropped. Paint selected state with `var(--color-system-highlight)` / `var(--color-system-canvas-text)` inside `@media (forced-colors: active)`, never rely on `box-shadow` for a boundary or focus, and hide with `visibility: hidden`, not a transparent color (a transparent color is repainted).

### Focus Style

`focusRing.ring` (`src/components/_internal/focus-ring.module.css`): on `:focus-visible`, a transparent border, no outline, and `box-shadow: var(--shadow-ring-info)`; under forced colors a transparent 2px outline, which the browser paints, since the ring is a shadow. Where the component has a shadow of its own, write the focus rule locally with both, ring first (`var(--shadow-ring-info), var(--shadow-xs)`). An item that shows focus with a ground instead (`DropdownMenu`, `ListBox`) keeps a transparent 2px outline and colors it under `prefers-contrast: more`.

### The Tailwind bridge

`src/styles/tailwind.css` (published as `./tailwind.css`) is for consumers using Tailwind CSS 4: it imports `tailwindcss` and `index.css`, maps Tailwind's theme namespaces onto the tokens with `@theme inline reference` (so `bg-bg-base` reads `var(--color-bg-base)` and the theme declares no variables of its own), and keeps the `dark:` / `light:` / `vertical:` variants and the `grid-cols-auto-fill-*`, `writing-*`, `z-overlay|modal|toast` utilities. `src/styles/tailwind.test.ts` compiles it. Add a token to `tokens.css`, and a color token also needs its line in the bridge (the test fails until it has one).

## Testing

- **Component tests** rely on Storybook stories as test fixtures via `@storybook/addon-vitest`. Writing a story IS writing a test.
- **Hook tests** use `vitest-browser-react` for rendering hooks in a real browser.
- **Form tests** (`src/components/form/**/*.test.tsx`, `src/components/_internal/**/*.test.tsx`) render fields under `@k8ordo/form`'s `useForm` with an action that calls `parseForm`, in a real browser. Each field brings its own CSS module, but `styles.css` is not loaded, so the tokens are undefined: a visually hidden input (`srOnly`) cannot be clicked, so press its label, as a user does. `@k8ordo/form` is a devDependency and resolves from its `dist/`, so build it first on a fresh checkout.
- **Helper tests** are standard unit tests, no browser needed.
- **There is no jsdom project, and components are not written to survive one.** They call `ResizeObserver`, `matchMedia`, `dialog.showModal`, and the Popover API directly — no support checks, no null branches. Consumers are told to test in a real browser (`docs/GUIDE.md`); do not reintroduce a guard layer to make a synthetic DOM work.
- Storybook preview wraps all stories in `UIProvider` with light/dark theme toggle, and defines a `@k8ordo/i18n` locale set (`.storybook/locales.ts`, default `ja`) so the built-in wording is Japanese; a story renders in English with `beforeEach: inEnglish` from the same file.
- Every story runs twice: `components` in light and `components-dark` in dark (`storybookTest({ initialGlobals: { theme: 'dark' } })`), because axe only checks the colors on screen. A story that pins `parameters.theme` stays in that theme in both.
- A form field in a story is given a name (`aria-label` in the meta `args`, and on any field a custom `render` draws), not a disabled `label` rule.
- `src/styles/contrast.stories.tsx` renders every pair in `docs/references/color.md`'s contrast table, AAA rows under `color-contrast-enhanced`; keep the two in step.
- The OS color settings cannot be switched per story, so they get projects of their own: `components-forced-colors` (Playwright `forcedColors: 'active'`) runs only stories tagged `forced-colors`, `components-contrast-more` (`contrast: 'more'`) only those tagged `contrast-more`, and `components` excludes both tags. Those stories live in `src/styles/high-contrast.stories.tsx`, hidden from the sidebar (`!dev`) and from Chromatic. Browser context options go in `playwright({ contextOptions })`; Vitest 5 ignores `instances[].context`.
- a11y addon fails a story on violations (`test: 'error'`), `color-contrast` included. Only overlay stories that axe misreads while they fade in turn `color-contrast` off for themselves: every `Modal` story, and one story each in `Dialog` and `Popover`.
- Mock date is set to `2023-01-02 12:34:56` in Storybook.

## Build Pipeline

1. `vp pack` — tsdown emits every `src/**/*.{ts,tsx}` except stories and tests file by file (`unbundle`) → ESM with `.d.mts` type declarations, keeping the directory layout under `dist/`; in-source tests are dropped by defining `import.meta.vitest` as `undefined`. Each `*.module.css` becomes `*.module.mjs` plus a compiled `.css` it imports (`pack.css.inject`), wrapped in `@layer components` by the better-css-modules plugin; class names are hashed from the path under this directory (`css.lightningcss.projectRoot`). `src/styles/index.css` is an entry too and becomes `dist/styles/index.css` (`./styles.css`) with its `@import`s inlined; `src/styles/tailwind.css` is copied as is.
2. `node scripts/build-tokens.ts` — writes `dist/styles/tokens.mjs` / `.d.mts` (`./tokens`) from `exportTokens(await loadConfig())`.

`src/styles/dist.test.ts` holds the output to the contract: every component CSS file is in `@layer components` after the full layer statement, every `.module.mjs` imports its CSS, `styles.css` puts nothing but tokens outside a layer, and `tokens.mjs` is the DTCG document. It reads `dist/`, so build first.

The types of the CSS modules are written by `better-css-modules generate` into `__generated__/` (git-ignored; `rootDirs` in `tsconfig.json`). `typecheck` and `check` run it first; the Vite plugin writes them when Storybook, vitest or `vp pack` start.

## Export Structure

The authoritative list is the `exports` map in `package.json`.

```
@k8ordo/ui                     core UI components and public types (AI chat is under /ai)
@k8ordo/ui/i18n                ja / en, registerMessages, getMessages, messageUsage, and the Messages type
@k8ordo/ui/ai                  AI chat components
@k8ordo/ui/ai/response         Response renderer only
@k8ordo/ui/ai-sdk              AI SDK adapter
@k8ordo/ui/code-block          CodeBlock (Server Component; shiki and server-only are dependencies)
@k8ordo/ui/json-render         json-render catalog
@k8ordo/ui/json-render/registry
@k8ordo/ui/openui              OpenUI component library
@k8ordo/ui/openui/prompt
@k8ordo/ui/tokens              design tokens as a DTCG resolver document
@k8ordo/ui/props.json          machine-readable component props (docs/props.generated.json)
@k8ordo/ui/styles.css          layer order, tokens, reset and base (each component imports its own CSS)
@k8ordo/ui/tailwind.css        Tailwind CSS 4 bridge (tailwindcss + styles.css + utilities for the tokens)
```
