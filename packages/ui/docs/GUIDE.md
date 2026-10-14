# @k8ordo/ui Design Guide

How to build UI with the `@k8ordo/ui` design system.

## Setup

```bash
npm install @k8ordo/ui
```

```tsx
// 1. Load the stylesheet (once, at your entry point)
import '@k8ordo/ui/styles.css';

// 2. Wrap the app in the provider
import { UIProvider } from '@k8ordo/ui';

function App() {
  return (
    <UIProvider>
      <YourApp />
    </UIProvider>
  );
}

// 3. Use components
import { Button, Card } from '@k8ordo/ui';
```

### How the styles arrive

`@k8ordo/ui` is written in CSS Modules, and its styles come in two parts:

- **`styles.css`** — import it once. It declares the cascade layers, the design
  tokens (custom properties on `:root` and their modes), a reset (the same
  rules as Tailwind CSS 4's preflight), and the page-wide defaults.
- **Each component's own CSS** — imported by the component's JavaScript, so a
  page loads the CSS of the components it uses and nothing else. Any bundler
  that handles a CSS import from a package does this for you (Vite, Next.js,
  webpack, Rspack, …).

Every rule of the library sits in a cascade layer. `styles.css` declares the
order first:

```css
@layer properties, theme, base, components, utilities;
```

The reset and the defaults are in `base` and the components in `components`.
These are Tailwind CSS 4's layers in Tailwind's order, so in a Tailwind project
your utilities win over the components; without Tailwind, any CSS of yours that
is not in a layer wins, and so does a layer you declare after `components`. The
one rule that does not yield is the reset's
`[hidden] { display: none !important }`.

Components take no `className`. To change how one looks, change the tokens, or
render your own element through its `renderItem` / `renderAnchor`, which hands
you the component's `className` to keep or to add to.

### Tokens

The tokens are custom properties declared at `:root`, named by category:
`--color-*`, `--spacing` (and `--spacing-em`), `--radius-*`, `--shadow-*`,
`--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`,
`--letter-spacing-*`, `--z-index-*`, `--duration-*`, `--easing-*` and
`--breakpoint-*`. Read them in your own CSS (`color: var(--color-fg-mute)`,
`padding: calc(var(--spacing) * 6)`). The palette they are built from
(`--gray-500`, …) is not part of the API.

They are declared outside any layer, so to override one, declare it after
`styles.css` is loaded: between unlayered rules of equal specificity, source
order decides. `@k8ordo/ui/tokens` exports the same tokens as data, a DTCG
resolver document (Resolver Module 2025.10), with each mode (`.dark`,
`prefers-contrast: more`) as a modifier.

[better-css-modules](https://github.com/k35o/better-css-modules) holds CSS
Modules to these tokens: list `@k8ordo/ui/styles.css` in its `globalCss`, and
its `check` reports a raw value, a misspelt token, or a palette color in your
own modules.

### Tailwind CSS 4

In a Tailwind CSS 4 project, import `tailwind.css` instead of `styles.css`. It
brings in Tailwind and `styles.css`, and a theme whose utilities read the
tokens: `bg-bg-base` is `var(--color-bg-base)`, `text-md` is
`var(--font-size-md)` with its line height, `p-6` is `calc(var(--spacing) * 6)`.
One line is enough for your project's CSS:

```css
@import '@k8ordo/ui/tailwind.css';
```

It also defines the `dark:`, `light:` and `vertical:` variants and the
`grid-cols-auto-fill-*`, `writing-*` and `z-overlay` / `z-modal` / `z-toast`
utilities. The components do not need Tailwind; it is only for your own markup.

### Page-wide styles

Note that `styles.css` applies base styles document-wide. On top of the reset
(headings, lists, and margins), it unsets bold on `b` / `strong` and italics on
`i` / `em`, and sets `body` typography defaults (`font-size`,
`overflow-wrap: anywhere`, `scrollbar-gutter: stable`, …). Adding it to an
existing app restyles more than the library's own components. Wrap rendered
Markdown or MDX in `Prose` to get the typesetting of body text back inside it —
see [Typography](references/typography.md#long-form-text-prose).

### Dark mode

The tokens switch on a `dark` class: `:root` holds the light values and `.dark`
the dark ones, so everything under an element with the class is dark. The
library never adds the class itself. In a k8ordo application
`@k8ordo/color-scheme` does, resolving the visitor's choice and the system
preference into `dark` on `<html>` before the first paint; anything else that
toggles the class works the same.

The base layer sets the CSS `color-scheme` property to match — `light` on
`:root`, `dark` under `.dark` — so the browser's own rendering (scrollbars, form
controls, a `<dialog>`'s default colors) follows the tokens rather than the OS.
Your own CSS follows the same way when it reads the tokens. With
`tailwind.css`, the `dark:` variant applies under `.dark` and `light:`
everywhere else.

### Wording language (i18n)

The wording components own internally ("close", "required", "loading", …) is
read in `@k8ordo/i18n`'s current locale. There is no provider to configure and
nothing to pass: `@k8ordo/i18n` is a peer dependency, installed with this
package.

- **With a locale set.** Once the application defines its set with
  `defineLocales`, the components speak the locale its messages do — the one
  the URL names, or the set's default.
- **Without one.** An application that defines no set (a Next.js or plain
  Vite app that does not use `@k8ordo/i18n`) gets **English**, whatever its
  URL starts with — so the server's HTML and the browser agree.

```ts
// src/i18n.ts — a Japanese-only app defines a set of one
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
});
```

The module that defines the set has to be loaded in the browser too, not
only by the server render: where no set is defined the components speak
English, and would disagree with the HTML. In a k8ordo app a client component
that links (`bindParams`) or switches language already imports it; elsewhere,
import it from a client module the root renders.

`ja` and `en` ship with the library. Any other locale is registered next to
the set, and a regional tag without a dictionary of its own (`en-US`) reads
its language's (`en`); a locale nothing has text for throws, naming how to
register it:

```ts
import { en, ja, registerMessages } from '@k8ordo/ui/i18n';
import type { Messages } from '@k8ordo/ui/i18n';

const fr: Messages = { close: 'Fermer' /* …every key */ };
registerMessages('fr', fr);

// A registered dictionary wins over a built-in one
registerMessages('en', { ...en, close: 'Dismiss' });
```

Resolution order is **component prop > registered dictionary > built-in
dictionary**. For a component with a wording prop of its own, such as
`Spinner`'s `label`, that prop wins.

`getMessages()` from `@k8ordo/ui/i18n` returns the wording in effect for your
own elements (a `renderItem`, a component beside the library). It is not a
hook, so it works in a Server Component — which is also why `Spinner`,
`Breadcrumb`, `Code`, `Alert`, `Callout`, `Reasoning`, and `ToolInvocation`
are Server Components.

> [Full key list and details](references/components.md) (the "i18n (message dictionary)" section)

## Design direction

### Core concept

**"Soft where you touch, precise where you read."**
(触れるものは柔らかく、読むものは端正に)

- **Space and shape lead**: the character of this design comes from generous spacing and soft shapes, not from color
- **Vary by the element's role**: things you touch (forms, buttons) are soft; things that inform (Alert, Badge) are precise
- **Let the spacing speak**: do not pack things in; leave room
- **Quiet motion**: restrained animation, subtle feedback
- **Calm color**: an OKLCH-based palette kept low-key through semantic tokens

Do not give everything the same tone. Soften in proportion to the element's role.

| Element                             | Direction                                            |
| ----------------------------------- | ---------------------------------------------------- |
| Forms (TextField, Textarea, Button) | Soft (large radii, pill buttons, generous padding)   |
| Cards and containers                | Soft (`--radius-xl`–`--radius-2xl`, gentle shadow)   |
| Alert, Badge                        | Precise (clarity of information comes first)         |
| Tabs, Breadcrumb                    | Sharp (elements that express structure stay precise) |

### Tone

Soft spacing and quiet refinement. The appeal is in space and shape.

## Aesthetic guidelines

### Page structure

**DO:**

- Use `--color-bg-subtle` (a light grey) for the page background
- Float content on white cards
- Leave enough room between cards (6–10 steps of `--spacing`)

**DON'T:**

- Lay flat cards on a pure white background
- Put everything in a Card
- Nest cards (Card in Card)

### Typography

**DO:**

- Use the Japanese fonts (Noto Sans JP, M PLUS 2), which your app loads and sets — the library sets no font of its own, so text stays on the reset's system stack until your app sets one
- Keep to three weights: 400 (the inherited default), `--font-weight-medium`, `--font-weight-bold`
- Lean on `--font-weight-medium` being 450 — lighter than the usual 500 — for delicate emphasis

**DON'T:**

- Use Inter / Roboto / Open Sans
- Use four or more font sizes on one screen
- Apply gradients to text

> [Typography details](references/typography.md)

### Color

**DO:**

- Follow the 60-30-10 rule (60% neutral, 30% supporting, 10% accent)
- Use semantic color tokens (`--color-bg-subtle`, `--color-fg-mute`, …)
- Design dark mode as its own tone, not a derivative
- Keep color calm; let space and shape carry the design

**DON'T:**

- Use gradient backgrounds
- Use `--color-primary-bg` on hover — use `--color-bg-mute`
- Express state with opacity — use the dedicated token
- Spread vivid color over large areas
- Use raw palette colors (`--teal-500`) — use semantic tokens (`--color-primary-bg`)

> [Color details](references/color.md)

### Spacing

**DO:**

- Treat 6 steps of `--spacing` (`calc(var(--spacing) * 6)`) as the standard padding (inside forms and cards), 4 when compact and 8 when generous
- Express relatedness through the size of the gap (2 steps close, 4 standard, 8 between sections)
- Separate sections with Separator

**DON'T:**

- Put everything in a Card
- Nest cards (Card in Card)
- Use extremely tight spacing such as one step

> [Spacing details](references/spatial-design.md)

### Interaction

**DO:**

- Start from a color transition over `--duration-fast` with `--easing-out`
- Express focus with `box-shadow: var(--shadow-ring-info)` on `:focus-visible`
- Keep hover gentle with `--color-bg-mute`

**DON'T:**

- Use bounce or spring easing
- Animate for longer than 300ms
- Use a strong primary color on hover

> [Interaction details](references/interaction-design.md)

## Component usage principles

### Button

Styling is unified through `color` and `variant`. Pill-shaped (`--radius-full`).

```tsx
import { Button } from '@k8ordo/ui';

// Primary action
<Button color="primary" variant="solid">Save</Button>

// Secondary action
<Button color="base" variant="outline">Cancel</Button>

// Text only
<Button variant="skeleton">View details</Button>

// Render as a link (renderItem prop). The bag holds everything the <button>
// would have received, so drop the two <button>-only members and spread the
// rest: className, children, ref, onClick, aria-disabled, aria-busy, and any
// attribute passed to Button all ride along.
<Button
  color="base"
  renderItem={({ children, disabled: _disabled, type: _type, ...props }) => (
    <a href="/settings" {...props}>{children}</a>
  )}
>
  Settings
</Button>
```

### IconButton

Styling is controlled by `color` (not `variant`). `label` is required.

```tsx
import { IconButton } from '@k8ordo/ui';

<IconButton color="transparent" label="Copy"><CopyIcon /></IconButton>
<IconButton color="primary" label="Send"><SendIcon /></IconButton>

// Render as a link (renderItem prop). triggerProps holds the tooltip wiring
// and the merged ref; spread it alongside the rest.
<IconButton
  color="base"
  label="Home"
  renderItem={({ children, disabled: _disabled, triggerProps, type: _type, ...props }) => (
    <a href="/home" {...props} {...triggerProps}>
      {children}
    </a>
  )}
>
  <HomeIcon />
</IconButton>
```

### CopyButton

For copying text, reach for `CopyButton` rather than an `IconButton` and your own
clipboard code: it writes to the clipboard, shows a check, and announces the
result to screen readers.

```tsx
import { CopyButton } from '@k8ordo/ui';

<CopyButton value={code} label="Copy code" iconOnly size="sm" />
<CopyButton value={() => window.location.href} label="Copy link" />
```

### Card

Floating on a shadow is the default: a white card over a `--color-bg-subtle`
page. The card has no padding of its own.

```css
/* card.module.css */
.body {
  padding: calc(var(--spacing) * 6);
}
```

```tsx
import { Card } from '@k8ordo/ui';

// Static card (floated with a shadow)
<Card variant="shadow">
  <div className={styles.body}>Card content</div>
</Card>

// Clickable card (interactive scales it up on hover)
<Card variant="shadow" interactive>
  <div className={styles.body}>Content</div>
</Card>
```

### Forms

`FormControl` plus each form component's `renderInput` pattern.

```tsx
import {
  Button,
  FileField,
  FormControl,
  Select,
  TextField,
} from '@k8ordo/ui';

<FormControl label="Email" required renderInput={(props) => (
  <TextField {...props} placeholder="example@mail.com" />
)} />

<FormControl label="Category" renderInput={(props) => (
  <Select
    {...props}
    options={[{ value: '1', label: 'Option 1' }]}
    value={value}
    onChange={onChange}
  />
)} />

<FileField.Root accept="image/*" multiple>
  <FileField.Trigger
    renderItem={({ onClick, disabled }) => (
      <Button disabled={disabled} onClick={onClick}>Choose files</Button>
    )}
  />
  <FileField.ItemList />
</FileField.Root>
```

With `@k8ordo/form`, spread what `form.field(name).input` derives onto the
field after `FormControl`'s props — `type`, `required`, the length and range
bounds, and the echoed `defaultValue` all go in as they are, whichever field
renders them. Uncontrolled fields keep their value in the DOM, so the form's
reset, `isDirty`, and error clearing hear every change, including ones a
component makes in code. The pairing per component is in `@k8ordo/form`'s
guide (`node_modules/@k8ordo/form/docs/GUIDE.md`, "Working with @k8ordo/ui").

```tsx
const title = form.field('title');

<FormControl
  errorText={title.error}
  invalid={title.invalid}
  label="Title"
  required={title.required}
  renderInput={(props) => <TextField {...props} {...title.input} />}
/>;
```

## Anti-patterns: avoiding "AI slop"

Avoid the traits that make a UI recognizably AI-generated at a glance.

| Anti-pattern               | The @k8ordo/ui alternative                                |
| -------------------------- | --------------------------------------------------------- |
| Purple gradients           | Flat teal/cyan color                                      |
| Card in Card               | A Separator and spacing instead                           |
| Grey text on a grey ground | Hold contrast with `--color-fg-base` / `--color-fg-mute`  |
| Bounce / spring animation  | A color transition over `--duration-fast`, `--easing-out` |
| The Inter typeface         | Noto Sans JP / M PLUS 2                                   |
| Heavy glassmorphism        | A border plus a subtle background color                   |
| Cramming information in    | Sparse placement that lets the space breathe              |

### The AI slop test

> Show this UI to someone and tell them an AI made it. Would they believe it
> immediately? If yes, that is the problem.

## Implementation principles

- **Use the existing components**: look for a @k8ordo/ui component before building custom UI
- **Render from Server Components**: every component, compound ones included (`Dialog.Root`, `Tabs.Root`, …), can be placed in a Server Component; only the interactive parts are client modules
- **Keep placed state in `@k8ordo/state`**: state that lives in the URL, a history entry, localStorage, or memory is `defineLocalState` and friends, not a hook from this package
- **Browser-only rendering is React's**: a component that can only render in a browser calls `use(browser())` (`browser` from `react-dom`) under a `<Suspense>`; there is no `useClient` here and no "mounted" flag
- **Use semantic tokens**: tokens (`--color-primary-bg`), never raw color values or the palette (`--teal-500`)
- **Let space and shape carry it**: character comes from spacing and soft radii, not from vivid color
- **Do not forget dark mode**: semantic tokens handle it for you
- **High contrast is handled too**: the tokens follow `prefers-contrast: more` and the components stay legible under `forced-colors: active`; for your own UI, see [High contrast and forced colors](references/color.md#high-contrast-and-forced-colors)
- **Accessibility**: `aria-label`, keyboard navigation, and state that does not rely on color alone

## Testing

Run component tests in a real browser — Vitest browser mode or Playwright —
the way this library tests itself. Every interactive component is built
directly on APIs a browser has and jsdom does not: `ResizeObserver`,
`IntersectionObserver`, `matchMedia`, `HTMLDialogElement`'s `showModal` /
`close`, and the Popover API. None of them is called through a support check,
so under jsdom `Tooltip`, `IconButton` (unless `tooltipDisabled`), `Tabs`,
`Autocomplete`, `Combobox`, `Toolbar`, `ResizablePanels`, `InView`, `Resize`,
and `Conversation` throw as soon as they mount; `Modal`, `CommandPalette`,
`Drawer`, `Popover`, `DropdownMenu`, `ContextMenu`, `ListBox`, and `DatePicker`
throw the moment they open (a `DropdownMenu` holding a `SubMenu` already at
mount); and a `clearable` `FileField.ItemList` throws once it lists a file.

This is not a gap to be stubbed around. A synthetic DOM (jsdom, happy-dom) has
no layout engine, so even with stubs in place a passing assertion about focus,
placement, or visibility there means very little — the thing you wanted to
check is the thing it cannot model.

## Detailed reference

- Typography: [references/typography.md](references/typography.md)
- Color system: [references/color.md](references/color.md)
- Spacing and layout: [references/spatial-design.md](references/spatial-design.md)
- Interaction: [references/interaction-design.md](references/interaction-design.md)
- Component catalog: [references/components.md](references/components.md)
- Types: [references/types.md](references/types.md)
- AI chat (Conversation / Message / PromptInput, …): [references/ai-chat.md](references/ai-chat.md)
- Generative UI (having an LLM generate UI via json-render / OpenUI): [references/generative-ui.md](references/generative-ui.md)
