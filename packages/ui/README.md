# @k8ordo/ui

React components from [k8ordo](https://ordo.k8o.me) — semantic design
tokens, built-in wording that follows `@k8ordo/i18n` (Japanese and English included), and a catalog of these components
that lets an LLM compose on-brand UIs through any generative-UI format.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

- **Documentation**: https://ordo.k8o.me/ui
- **Storybook**: https://main--687a213c85e2e4589d8db1bb.chromatic.com

## Installation

```bash
npm install @k8ordo/ui
# or
pnpm add @k8ordo/ui
# or
yarn add @k8ordo/ui
```

## Peer Dependencies

Only React and `@k8ordo/i18n` are required:

```bash
npm install react react-dom @k8ordo/i18n
```

Everything else is an optional peer, needed only for the entry point that uses
it. Install one when you import the entry it belongs to.

<!-- peers -->

| Package            | Version | Required | Needed for                                        |
| ------------------ | ------- | -------- | ------------------------------------------------- |
| `react`            | ≥19.3.0 | yes      | the components and hooks                          |
| `react-dom`        | ≥19.3.0 | yes      | portals and `useFormStatus`                       |
| `@k8ordo/i18n`     | ^4.0.0  | yes      | the locale the components' own wording is read in |
| `typescript`       | ≥7.0.0  | optional | the shipped type declarations                     |
| `@types/react`     | ≥19.3.0 | optional | the shipped type declarations                     |
| `@types/react-dom` | ≥19.3.0 | optional | the shipped type declarations                     |
| `zod`              | ^4.6.6  | optional | generative-UI schemas                             |
| `streamdown`       | ≥2.5.0  | optional | `@k8ordo/ui/ai/response`                          |
| `shiki`            | ≥4.6.0  | optional | `@k8ordo/ui/code-block`                           |

<!-- /peers -->

The components need no CSS tooling of their own: they are written in CSS Modules
and ship compiled CSS, which each component imports. The package does not
depend on `tailwindcss`, not even for the optional `tailwind.css` entry, which
reads the Tailwind your project already has.

## Quick Start

1. Import the CSS and set up the provider.

Import `styles.css` once — the layer order, the design tokens, a reset, and the
page-wide defaults. Each component brings its own CSS through its JavaScript
import, so a page loads only the CSS of the components it uses. Every library
rule sits in a cascade layer (`components` for the components), so your own
(unlayered) CSS takes precedence, and the design tokens are available as CSS
custom properties (`var(--color-fg-mute)`, `calc(var(--spacing) * 6)`, …).

```css
@import '@k8ordo/ui/styles.css';
```

**Using Tailwind CSS 4?** Import the bridge after Tailwind, instead of
`styles.css`. It includes `styles.css`, and its theme makes the design tokens
usable as Tailwind classes (`bg-bg-base`, `text-md`, `p-6`, …) in your own
markup:

```css
@import 'tailwindcss';
@import '@k8ordo/ui/tailwind.css';
```

Note that `styles.css` applies a document-wide base: a reset with the same
rules as Tailwind's preflight, plus the library base layer (`b`/`strong` weight
and `i`/`em` style unset, `body` typography defaults). Adding it to an existing
app restyles more than the library components.

```tsx
// In your app entry point, when the app opens toasts with useToast
import { ToastProvider } from '@k8ordo/ui';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

2. Use components:

```tsx
import { Button } from '@k8ordo/ui';
import { Card } from '@k8ordo/ui';

function MyPage() {
  return (
    <Card>
      <Button color="primary" variant="solid" onClick={() => alert('Hello!')}>
        Click me
      </Button>
    </Card>
  );
}
```

## Internationalization (i18n)

The wording that components own internally — "close", "required", "loading", and so on — is read in [`@k8ordo/i18n`](https://ordo.k8o.me/i18n)'s current locale. There is no provider and nothing to pass:

- an application that defines its locale set with `defineLocales` gets the locale its messages render in;
- an application that defines none gets **English**, whatever its URL starts with.

`ja` and `en` ship with the library. Register any other locale, or replace a built-in one, next to where the set is defined:

```ts
import { en, registerMessages } from '@k8ordo/ui/i18n';

registerMessages('en', { ...en, close: 'Dismiss' });
```

Resolution order is **component prop > registered dictionary > built-in dictionary**. Components that expose a wording prop of their own — `Spinner`'s `label`, `Alert`'s `closeLabel`, `PasswordInput`'s `showLabel` / `hideLabel`, `Pagination`'s `prevLabel` / `nextLabel` — take it over the dictionary. `getMessages()` returns the wording in effect for elements you draw yourself; it is not a hook, so a Server Component calls it too. See [docs/references/components.md](docs/references/components.md) for the full key list.

## AI Agent Documentation

The design guide ships **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at it once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/ui` for UI. Before writing or changing UI, read
`node_modules/@k8ordo/ui/docs/GUIDE.md`, then follow only the
`docs/references/*.md` links it lists that the task actually needs.
Colors, spacing, radii and font weights go through the semantic tokens
(`var(--color-fg-mute)`, `calc(var(--spacing) * 6)`) — never raw values or
the palette (`--teal-500`).
Look up component props in `docs/references/components.md` instead of
recalling them; a component that is not listed there does not exist.
```

What each surface gives an agent:

| Surface                    | Where                                                    |
| -------------------------- | -------------------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/ui/docs/GUIDE.md`                  |
| Reference docs             | `node_modules/@k8ordo/ui/docs/references/*.md`           |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt           |
| Token spec (generated)     | https://ordo.k8o.me/design.md                            |
| MCP server (Storybook)     | https://main--687a213c85e2e4589d8db1bb.chromatic.com/mcp |

The MCP server exposes the published Storybook, so an agent can query real
stories and rendered props rather than relying on trained knowledge:

```json
{
  "mcpServers": {
    "k8ordo": {
      "type": "http",
      "url": "https://main--687a213c85e2e4589d8db1bb.chromatic.com/mcp"
    }
  }
}
```

## Component Categories

Every component, grouped by its folder in `src/components/`. Each links to its
entry in [docs/references/components.md](docs/references/components.md).

<!-- generated:component-categories -->

### Buttons

- [Button](docs/references/components.md#button)
- [CopyButton](docs/references/components.md#copybutton)
- [IconButton](docs/references/components.md#iconbutton)
- [Toolbar](docs/references/components.md#toolbar)

### Navigation

- [Anchor](docs/references/components.md#anchor)
- [Breadcrumb](docs/references/components.md#breadcrumb)
- [Pagination](docs/references/components.md#pagination)
- [SideNav](docs/references/components.md#sidenav)
- [Stepper](docs/references/components.md#stepper)
- [TableOfContents](docs/references/components.md#tableofcontents)
- [Tabs](docs/references/components.md#tabs)

### Forms

- [Autocomplete](docs/references/components.md#autocomplete)
- [Calendar](docs/references/components.md#calendar)
- [Checkbox](docs/references/components.md#checkbox)
- [CheckboxCard](docs/references/components.md#checkboxcard)
- [CheckboxGroup](docs/references/components.md#checkboxgroup)
- [ColorPicker](docs/references/components.md#colorpicker)
- [Combobox](docs/references/components.md#combobox)
- [DatePicker](docs/references/components.md#datepicker)
- [FileField](docs/references/components.md#filefield)
- [Form](docs/references/components.md#form)
- [FormControl](docs/references/components.md#formcontrol)
- [NumberField](docs/references/components.md#numberfield)
- [PasswordInput](docs/references/components.md#passwordinput)
- [Radio](docs/references/components.md#radio)
- [RadioCard](docs/references/components.md#radiocard)
- [RangeSlider](docs/references/components.md#rangeslider)
- [Select](docs/references/components.md#select)
- [Slider](docs/references/components.md#slider)
- [Switch](docs/references/components.md#switch)
- [Textarea](docs/references/components.md#textarea)
- [TextField](docs/references/components.md#textfield)

### Data display

- [Accordion](docs/references/components.md#accordion)
- [Avatar](docs/references/components.md#avatar)
- [Badge](docs/references/components.md#badge)
- [Card](docs/references/components.md#card)
- [Carousel](docs/references/components.md#carousel)
- [Code](docs/references/components.md#code)
- [CodeBlock](docs/references/components.md#codeblock)
- [DataTable](docs/references/components.md#datatable)
- [Heading](docs/references/components.md#heading)
- [Kbd](docs/references/components.md#kbd)
- [Prose](docs/references/components.md#prose)
- [Table](docs/references/components.md#table)
- [Tree](docs/references/components.md#tree)

### Feedback

- [Alert](docs/references/components.md#alert)
- [Callout](docs/references/components.md#callout)
- [EmptyState](docs/references/components.md#emptystate)
- [Progress](docs/references/components.md#progress)
- [Skeleton](docs/references/components.md#skeleton)
- [Spinner](docs/references/components.md#spinner)
- [ToastProvider](docs/references/components.md#toastprovider)

### Overlays

- [CommandPalette](docs/references/components.md#commandpalette)
- [ContextMenu](docs/references/components.md#contextmenu)
- [Dialog](docs/references/components.md#dialog)
- [Drawer](docs/references/components.md#drawer)
- [DropdownMenu](docs/references/components.md#dropdownmenu)
- [ListBox](docs/references/components.md#listbox)
- [Popover](docs/references/components.md#popover)
- [Tooltip](docs/references/components.md#tooltip)

### Layout

- [Grid](docs/references/components.md#grid)
- [ResizablePanels](docs/references/components.md#resizablepanels)
- [Separator](docs/references/components.md#separator)
- [Stack](docs/references/components.md#stack)

### Icons

- [Icons](docs/references/components.md#icons) — decorative icons from `@k8ordo/ui/icons` (`XIcon`, `ChevronIcon`, …)

<!-- /generated:component-categories -->

## Usage Examples

### Button

```tsx
import { Button } from '@k8ordo/ui';

// Primary action
<Button color="primary" variant="solid" size="md">
  Save
</Button>

// Secondary accent
<Button color="secondary" variant="solid">
  Preview
</Button>

// Secondary action
<Button color="base" variant="outline">
  Cancel
</Button>

// Text-only
<Button variant="skeleton">
  Learn more
</Button>
```

### Form with Validation

```tsx
import { FormControl } from '@k8ordo/ui';
import { TextField } from '@k8ordo/ui';
import { Button } from '@k8ordo/ui';

<form>
  <FormControl
    label="Email"
    required
    errorText={error}
    renderInput={(props) => (
      <TextField {...props} placeholder="Enter your email" />
    )}
  />
  <Button type="submit">Submit</Button>
</form>;
```

### Dialog

```tsx
import { Button, Dialog } from '@k8ordo/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to continue?</p>
        <Button onClick={() => setIsOpen(false)}>Confirm</Button>
      </Dialog>
    </>
  );
}
```

## Imports & Bundle Size

The core UI components ship from the root entry — there are no per-component subpaths; the icons live under `@k8ordo/ui/icons`, the AI chat components under `@k8ordo/ui/ai`, with `Response` under `@k8ordo/ui/ai/response`, and `CodeBlock` under `@k8ordo/ui/code-block` so the highlighter stays out of everything else. The package is tree-shakeable (`sideEffects` is limited to CSS), so bundlers drop everything you don't import — the CSS too, since each component imports its own stylesheet:

```tsx
// Named imports from the root entry — unused exports are tree-shaken away
import { Button, Card, Stack } from '@k8ordo/ui';
```

Optional features live behind dedicated subpath exports:

| Subpath                     | Contents                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `@k8ordo/ui`                | Core UI components, their types, and provider hooks                                               |
| `@k8ordo/ui/icons`          | Line icons, one module each, and `BaseIcon` for drawing your own                                  |
| `@k8ordo/ui/tokens`         | Design tokens as a DTCG resolver document                                                         |
| `@k8ordo/ui/props.json`     | Every component's props, and the components each wording key is drawn by, as JSON                 |
| `@k8ordo/ui/i18n`           | `ja` / `en`, `registerMessages`, `getMessages`, and the `Messages` type                           |
| `@k8ordo/ui/ai`             | AI chat components                                                                                |
| `@k8ordo/ui/ai/response`    | `Response` Markdown renderer (needs optional peer `streamdown`)                                   |
| `@k8ordo/ui/code-block`     | `CodeBlock`, highlighted on the server with shiki (Server Component; needs optional peer `shiki`) |
| `@k8ordo/ui/catalog`        | The generative-UI catalog: each component described for a model (server-safe)                     |
| `@k8ordo/ui/catalog/render` | How each catalog component is drawn (`'use client'`)                                              |
| `@k8ordo/ui/styles.css`     | Layer order, tokens, reset and base (required)                                                    |
| `@k8ordo/ui/tokens.css`     | The tokens and the `color-scheme` rules of `styles.css` alone, with no reset and no base          |
| `@k8ordo/ui/tailwind.css`   | Tailwind CSS 4 bridge, imported after Tailwind: `styles.css` and utilities for the tokens         |

## AI Chat Components

`@k8ordo/ui/ai` ships building blocks for chat UIs:

- **Conversation** (`Root` / `Messages` / `ScrollButton`) - Scroll container with stick-to-bottom behavior and a scroll-to-bottom button
- **Message** (`Root` / `Content` / `Actions` / `Action` / `Copy` / `Regenerate` / `Feedback`) - Chat bubble, styled by `from="user" | "assistant"`, with an optional `avatar`; `Actions` holds copy, regenerate, and good/bad feedback under the message
- **PromptInput** (`Root` / `Attachments` / `Attach` / `Textarea` / `Submit`) - Message input form with IME-aware Enter-to-send and a stop button while streaming; pass `accept` to take attachments from a file picker, drag and drop, or paste
- **Reasoning** - Collapsible display of the model's thinking text
- **Suggestion** (`List` / `Item`) - Suggested prompt chips
- **ToolInvocation** - Tool call display with input/output and `state` (`'input-streaming' | 'input-available' | 'approval-requested' | 'approval-responded' | 'output-available' | 'output-error' | 'output-denied'`); with `approval` and `onApprovalResponse` it asks the user to allow or deny the call and answers with the approval `id`
- **Attachment** (`List` / `Item`) - Files attached to a message: image thumbnails, or a name and media-type chip
- **Source** (`List` / `Item`) - The sources a response cites, as links (http(s) only) or document titles
- **Response** (from `@k8ordo/ui/ai/response`) - Streaming-safe Markdown renderer built on streamdown

`Response` needs an optional peer dependency:

```bash
pnpm add streamdown
```

Minimal chat UI:

```tsx
'use client';
import { Conversation, Message, PromptInput } from '@k8ordo/ui/ai';
import { useState } from 'react';

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);

  const send = (text: string) => {
    // Append the user message, then request the assistant reply
  };

  return (
    <div className="flex h-svh flex-col gap-3 p-4">
      <Conversation.Root>
        <Conversation.Messages>
          {messages.map((m) => (
            <Message.Root from={m.role} key={m.id}>
              <Message.Content>{m.text}</Message.Content>
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>
      <PromptInput.Root onSubmit={send}>
        <PromptInput.Textarea placeholder="Type a message…" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
```

To render assistant Markdown, wrap it in `Response` (children must be a string). It styles what streamdown renders itself, through the `data-streamdown` attribute on each element, so no Tailwind is involved; import `streamdown/styles.css` only if you turn on streamdown's `animated` option:

```tsx
import { Response } from '@k8ordo/ui/ai/response';

<Message.Content>
  <Response isStreaming>{markdownText}</Response>
</Message.Content>;
```

`Response` forwards the rest of streamdown's props (`translations`, `controls`, `linkSafety`, `plugins`, …); only `className`, `mode` and `portal` are owned by the library. Built-in labels come from the message dictionary, so they follow the app's language by default.

`linkSafety` defaults to **disabled** here, unlike streamdown. With it enabled, links render as `<button>` instead of `<a>`, which loses ⌘-click, middle-click, "copy link address", and the `link` role for assistive tech. Dangerous schemes such as `javascript:` are neutralized by rehype-harden regardless, so links stay safe with the default. Opt in when you want the confirmation dialog:

```tsx
<Response linkSafety={{ enabled: true }}>{markdownText}</Response>
```

The types (`ChatStatus`, `ToolState`, `ToolApproval`, `ToolApprovalResponse`) take the [AI SDK](https://ai-sdk.dev)'s own shapes, so the SDK's values pass to the components as they are — `onApprovalResponse={addToolApprovalResponse}` answers the SDK directly — and the package does not depend on the SDK. To turn a `UIMessage`'s parts into rows of components, copy `mapMessageParts` from [`examples/ui-integrations`](https://github.com/k35o/k8ordo/tree/main/examples/ui-integrations/src/ai-sdk) into your application.

## Generative UI

`@k8ordo/ui/catalog` describes these components for an LLM, for no generative-UI format in particular: what each one is, the props a model may write (zod schemas locked to the design tokens, so a generated UI stays on-brand), whether it holds children, and which prop holds a field's value. `@k8ordo/ui/catalog/render` draws each of them. Component-specific `renderItem` render props are bridged internally — the model only ever sees flat data (e.g. `href`).

The package ties itself to no format and depends on none. Connecting [json-render](https://json-render.dev), [OpenUI](https://www.openui.com), [A2UI](https://a2ui.org), or a format of your own is a small piece of glue that maps over the catalog: register each component, bind each field's value to the format's state, and draw through `renderers`. [`examples/ui-integrations`](https://github.com/k35o/k8ordo/tree/main/examples/ui-integrations) keeps working glue for A2UI 1.0, json-render, and OpenUI, run in a real browser on every change — copy the one you use into your application.

```bash
pnpm add zod
```

```ts
// Server-safe: build the format's system prompt from it
import { catalog, catalogPropIssues, catalogRules } from '@k8ordo/ui/catalog';

catalog.Button.description; // 'Action button. With href it renders as a link (<a>).'
catalog.TextField.value; // { prop: 'defaultValue', initial: (props) => … }
catalogPropIssues('Button', { label: 'OK', colour: 'primary' });
// ['Button: Unknown prop "colour". Allowed props: label, variant, …']
```

```tsx
// Client: draw what the format resolved
'use client';
import { renderers } from '@k8ordo/ui/catalog/render';

renderers.Button({ props: { label: 'Save' }, children: [] });
```

Components in the catalog:

- **Layout / containers**: `Stack`, `Grid`, `Card`, `Form`, `Carousel`
- **Buttons / nav**: `Button`, `IconButton`, `CopyButton`, `Toolbar`, `Anchor`, `Breadcrumb`, `Pagination`, `Stepper`, `SideNav`
- **Display**: `Badge`, `Heading`, `Avatar`, `Code`, `Kbd`, `EmptyState`, `Icon`, `ChevronIcon`, `StatusIcon`, `Alert`, `Callout`, `Spinner`, `Progress`, `Skeleton`, `Separator`, `Tabs`, `Accordion`, `Table`, `DataTable`, `Tree`
- **Overlays (self-contained widgets)**: `Modal`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `DropdownMenuItem`, `Toast`
- **Form**: `TextField`, `Textarea`, `PasswordInput`, `NumberField`, `Slider`, `RangeSlider`, `DateField`, `DatePicker`, `Calendar`, `ColorPicker`, `Combobox`, `Checkbox`, `Switch`, `Select`, `Radio`, `RadioCard`, `CheckboxCard`, `ListBox`, `CheckboxGroup`, `Autocomplete`, `FileField`, `FormControl`

The rest of the exports — `CommandPalette`, `ContextMenu`, `ResizablePanels`,
and the AI chat components among them — are left out on purpose;
[docs/references/generative-ui.md](docs/references/generative-ui.md#what-the-catalog-leaves-out)
says why.

Overlays are **self-contained widgets**: a `Modal`/`Dialog`/`Drawer`/`Popover` declares its own trigger button via `triggerLabel`, manages open/close internally, and renders the supplied children inside the surface. This lets a model generate UIs that include overlays without modelling imperative open/close state. `Tooltip`/`DropdownMenu`/`Toast` follow the same pattern (trigger + content); `Toast` opens its toast through your application's `ToastProvider`.

> **Notes**
>
> - Make sure `@k8ordo/ui/styles.css` (or `tailwind.css` in Tailwind CSS 4 projects) is loaded.
> - Draw the generated UI inside your application's `ToastProvider`. Outside one, a `Toast` fails with `useToast`'s own error.
> - `Tabs` panels are text content (`tabs: [{ label, content }]`); rich-component panels are a future enhancement.

## Accessibility

All components follow WCAG accessibility guidelines:

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Styling & Customization

Components are written in CSS Modules and placed in the `components` cascade
layer. Customize them through:

- CSS custom properties (semantic design tokens), overridden after `styles.css`
- `renderAnchor`, which hands a link component of your own the component's `className`
- Light / Dark mode via semantic color tokens (`light-dark()`, switched by the `dark` class)
- Tailwind utility classes on your own markup, through `tailwind.css`

## Development

For local development and contributing:

```bash
# Install dependencies
pnpm install

# Start Storybook for component development
pnpm storybook

# Run tests
pnpm test

# Build the library
pnpm build

# Type checking
pnpm typecheck

# Linting and formatting
pnpm check:write
```

## Browser Support

The browsers that ship what Baseline has newly available. The CSS is compiled
for them, and [docs/GUIDE.md](docs/GUIDE.md) lists the versions to give your
bundler as its CSS target.

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/k35o/k8ordo#readme) for contribution guidelines.
