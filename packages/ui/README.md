# @k8ordo/ui

React components from [k8ordo](https://ordo.k8o.me) — semantic design
tokens, built-in wording that follows `@k8ordo/i18n` (Japanese and English included), and adapters that let an LLM generate
on-brand UIs.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline, and ships no polyfills or legacy fallbacks.

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

| Package                 | Version         | Required | Needed for                                                                    |
| ----------------------- | --------------- | -------- | ----------------------------------------------------------------------------- |
| `react`                 | ≥19.3.0         | yes      | the components and hooks                                                      |
| `react-dom`             | ≥19.3.0         | yes      | portals and `useFormStatus`                                                   |
| `@k8ordo/i18n`          | ^1.0.0          | yes      | the locale the components' own wording is read in                             |
| `typescript`            | ≥7.0.0          | optional | the shipped type declarations                                                 |
| `@types/react`          | ≥19.3.0         | optional | the shipped type declarations                                                 |
| `@types/react-dom`      | ≥19.3.0         | optional | the shipped type declarations                                                 |
| `tailwindcss`           | ≥4.3.3          | optional | the `tailwind.css` entry (see [Imports & Bundle Size](#imports--bundle-size)) |
| `zod`                   | ^4.4.3          | optional | generative-UI schemas                                                         |
| `@json-render/core`     | ≥0.21.0 <0.22.0 | optional | `@k8ordo/ui/json-render`                                                      |
| `@json-render/react`    | ≥0.21.0 <0.22.0 | optional | `@k8ordo/ui/json-render`                                                      |
| `@openuidev/lang-core`  | ≥0.3.0 <0.4.0   | optional | `@k8ordo/ui/openui`, `@k8ordo/ui/openui/prompt`                               |
| `@openuidev/react-lang` | ≥0.3.0 <0.4.0   | optional | `@k8ordo/ui/openui`                                                           |
| `ai`                    | ≥7.0.51         | optional | `@k8ordo/ui/ai-sdk`                                                           |
| `streamdown`            | ≥2.5.0          | optional | `@k8ordo/ui/ai/response`                                                      |

<!-- /peers -->

The generative-UI peers are 0.x, where a minor bump is a breaking release, so
the declared range stops at the next minor: `@k8ordo/ui` only claims the line it
is tested against. Resolve exactly **one copy** of each — the adapters read the
framework's own React context, so two copies let every schema check and the
build pass while the form views throw at render time.

The `styles.css` entry needs no peer at all — it is prebuilt CSS, so CSS Modules
and plain-CSS projects can use the components without Tailwind.

## Quick Start

1. Import the CSS and set up the provider.

**No Tailwind in your project?** Import the prebuilt stylesheet — this single
line is all you need. It works with CSS Modules or plain CSS: every library
rule except the token declarations on `:root` / `.dark` sits in `@layer`, so
your own (unlayered) CSS takes precedence, and the design tokens are available
as CSS custom properties (`var(--fg-mute)`, …).

```css
@import '@k8ordo/ui/styles.css';
```

**Using Tailwind CSS 4?** Import the source entry instead. It includes
`@import 'tailwindcss'`, and it keeps the design tokens usable as Tailwind
classes (`bg-bg-base`, …) in your own markup. Append your sources after the
import to add your own utility classes:

```css
@import '@k8ordo/ui/tailwind.css';
@source './src';
```

Note that either entry applies a document-wide base: Tailwind preflight plus
the library base layer (margins/list styles/heading sizes reset, `b`/`strong`
weight and `i`/`em` style unset, `body` typography defaults). Adding it to an
existing app restyles more than the library components.

```tsx
// In your app entry point
import { UIProvider } from '@k8ordo/ui';

function App() {
  return (
    <UIProvider>
      <YourApp />
    </UIProvider>
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
Colors, spacing, radii and font weights go through semantic tokens —
never raw values such as `bg-teal-500` or `font-semibold`.
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
- [DateField](docs/references/components.md#datefield)
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
- [Modal](docs/references/components.md#modal)
- [Popover](docs/references/components.md#popover)
- [Tooltip](docs/references/components.md#tooltip)

### Layout

- [Grid](docs/references/components.md#grid)
- [ResizablePanels](docs/references/components.md#resizablepanels)
- [Separator](docs/references/components.md#separator)
- [Stack](docs/references/components.md#stack)

### Observers

- [InView](docs/references/components.md#inview)
- [Resize](docs/references/components.md#resize)

### Icons

- [Icons](docs/references/components.md#icons) — decorative icon components (`CloseIcon`, `ChevronIcon`, …)

### Providers

- [PortalRootProvider](docs/references/components.md#portalrootprovider)
- [UIProvider](docs/references/components.md#uiprovider)

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
import { Dialog } from '@k8ordo/ui';
import { Button } from '@k8ordo/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      {isOpen && (
        <Dialog.Root>
          <Dialog.Header
            title="Confirm Action"
            onClose={() => setIsOpen(false)}
          />
          <Dialog.Content>
            <p>Are you sure you want to continue?</p>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}
```

## Imports & Bundle Size

The core UI components ship from the root entry — there are no per-component subpaths; the AI chat components live under `@k8ordo/ui/ai`, with `Response` under `@k8ordo/ui/ai/response`, and `CodeBlock` under `@k8ordo/ui/code-block` so the highlighter stays out of everything else. The package is tree-shakeable (`sideEffects` is limited to CSS), so bundlers drop everything you don't import:

```tsx
// Named imports from the root entry — unused exports are tree-shaken away
import { Button, Card, Stack } from '@k8ordo/ui';
```

Optional features live behind dedicated subpath exports:

| Subpath                           | Contents                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `@k8ordo/ui`                      | Core UI components, their types, and provider hooks                                     |
| `@k8ordo/ui/tokens`               | Design token definitions                                                                |
| `@k8ordo/ui/props.json`           | Every component's props as JSON, generated from the types                               |
| `@k8ordo/ui/i18n`                 | `ja` / `en`, `registerMessages`, `getMessages`, `messageUsage`, and the `Messages` type |
| `@k8ordo/ui/ai`                   | AI chat components                                                                      |
| `@k8ordo/ui/ai/response`          | `Response` Markdown renderer (needs optional peer `streamdown`)                         |
| `@k8ordo/ui/ai-sdk`               | AI SDK adapter (needs optional peer `ai`)                                               |
| `@k8ordo/ui/code-block`           | `CodeBlock`, highlighted on the server with shiki (Server Component)                    |
| `@k8ordo/ui/json-render`          | json-render catalog (server-safe)                                                       |
| `@k8ordo/ui/json-render/registry` | json-render registry (`'use client'`)                                                   |
| `@k8ordo/ui/openui`               | OpenUI library (`'use client'`)                                                         |
| `@k8ordo/ui/openui/prompt`        | OpenUI prompt generation (server-safe)                                                  |
| `@k8ordo/ui/styles.css`           | Prebuilt stylesheet (no Tailwind required)                                              |
| `@k8ordo/ui/tailwind.css`         | Tailwind source entry (requires Tailwind CSS 4)                                         |

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

Two of these need optional peer dependencies:

```bash
# Response (@k8ordo/ui/ai/response)
pnpm add streamdown
# AI SDK adapter (@k8ordo/ui/ai-sdk)
pnpm add ai
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

To render assistant Markdown, wrap it in `Response` (children must be a string). Besides installing `streamdown`, import its stylesheet once and register its classes with Tailwind. Note that `Response` is the one component that requires a Tailwind CSS 4 build (the `tailwind.css` entry plus the `@source` line below) — streamdown's styling lives in its own class names, which the prebuilt `styles.css` does not include:

```tsx
import { Response } from '@k8ordo/ui/ai/response';
import 'streamdown/styles.css';

<Message.Content>
  <Response isStreaming>{markdownText}</Response>
</Message.Content>;
```

`Response` forwards the rest of streamdown's props (`translations`, `controls`, `linkSafety`, `plugins`, …); only `className` and `mode` are owned by the library. Built-in labels come from the message dictionary, so they follow the app's language by default.

`linkSafety` defaults to **disabled** here, unlike streamdown. With it enabled, links render as `<button>` instead of `<a>`, which loses ⌘-click, middle-click, "copy link address", and the `link` role for assistive tech. Dangerous schemes such as `javascript:` are neutralized by rehype-harden regardless, so links stay safe with the default. Opt in when you want the confirmation dialog:

```tsx
<Response linkSafety={{ enabled: true }}>{markdownText}</Response>
```

```css
/* In your CSS entry (path is relative to the CSS file) */
@source '../node_modules/streamdown/dist/*.js';
```

With the [AI SDK](https://ai-sdk.dev), `mapMessageParts` from `@k8ordo/ui/ai-sdk` converts a `UIMessage` into a flat array of `{ kind: 'text' | 'reasoning' | 'tool' | 'file' | 'source' | 'data', ... }` parts that map onto `Response`, `Reasoning`, `ToolInvocation`, `Attachment`, and `Source`; `data` parts are yours to render. A tool part keeps its `approval`, so `onApprovalResponse={addToolApprovalResponse}` answers the SDK directly.

## Generative UI integrations

k8ordo UI ships official adapters so an LLM can generate UIs using these components, via either [json-render](https://json-render.dev) or [OpenUI](https://www.openui.com). Each adapter constrains the model to k8ordo UI components with prop schemas locked to the design tokens, so generated UIs stay on-brand. Component-specific `renderItem` render props are bridged internally — the model only ever sees flat data (e.g. `href`).

These integrations are exposed as optional subpath exports. Install the framework you use (they are optional peer dependencies):

```bash
# json-render
pnpm add @json-render/core @json-render/react zod
# OpenUI (both entries import lang-core directly, so install both packages)
pnpm add @openuidev/react-lang @openuidev/lang-core zod
```

Supported components (both frameworks):

- **Layout / containers**: `Stack`, `Grid`, `Card`, `Form`, `Carousel`
- **Buttons / nav**: `Button`, `IconButton`, `CopyButton`, `Toolbar`, `Anchor`, `Breadcrumb`, `Pagination`, `Stepper`, `SideNav`
- **Display**: `Badge`, `Heading`, `Avatar`, `Code`, `Kbd`, `EmptyState`, `Icon`, `ChevronIcon`, `StatusIcon`, `Alert`, `Callout`, `Spinner`, `Progress`, `Skeleton`, `Separator`, `Tabs`, `Accordion`, `Table`, `DataTable`, `Tree`
- **Overlays (self-contained widgets)**: `Modal`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `Toast`
- **Form**: `TextField`, `Textarea`, `PasswordInput`, `NumberField`, `Slider`, `RangeSlider`, `DateField`, `DatePicker`, `Calendar`, `ColorPicker`, `Combobox`, `Checkbox`, `Switch`, `Select`, `Radio`, `RadioCard`, `CheckboxCard`, `ListBox`, `CheckboxGroup`, `Autocomplete`, `FileField`, `FormControl`

The rest of the exports — `CommandPalette`, `ContextMenu`, `ResizablePanels`, the
observers, the providers, and the AI chat components — are left out on purpose;
[docs/references/generative-ui.md](docs/references/generative-ui.md#what-the-catalog-leaves-out)
says why.

Overlays are exposed as **self-contained widgets**: a `Modal`/`Dialog`/`Drawer`/`Popover` declares its own trigger button via `triggerLabel`, manages open/close internally, and renders the supplied children inside the surface. This lets a model generate UIs that include overlays without modelling imperative open/close state. `Tooltip`/`DropdownMenu`/`Toast` follow the same self-contained pattern (trigger + content).

### json-render (RSC-ready)

The catalog (schemas / prompt) and the registry (rendering) are split so the catalog is **server-safe** — generate the system prompt in a React Server Component, and render on the client.

```tsx
// Server Component: prompt generation
import { catalog, uiRules } from '@k8ordo/ui/json-render';

// `customRules` injects cross-cutting constraints the model tends to break
// (Table cell counts match columns, href format, text-only Tabs/Accordion content).
const systemPrompt = catalog.prompt({ customRules: [...uiRules] });
```

```tsx
// Client Component: rendering.
// `JsonRenderUI` wires JSONUIProvider + Renderer and the registry for you —
// just pass a spec. Pass `onStateChange` to collect form values.
'use client';
import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: UISpec }) {
  return <JsonRenderUI spec={spec} />;
}
```

Validate (and repair) LLM output before rendering. `validateGeneratedSpec` runs auto-fixes, structural checks, and per-component prop validation, returning a ready-to-resend repair prompt on failure:

```tsx
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

const result = validateGeneratedSpec(JSON.parse(llmOutput));
if (result.ok) {
  return <JsonRenderUI spec={result.spec} />; // result.fixes lists auto-applied fixes
}
const retried = await llm(result.repairPrompt); // ask the model to fix, then retry
```

Hand-written or LLM specs can be typed with `satisfies UISpec` so component names and props are checked at compile time (no `as unknown as Spec`):

```tsx
import type { UISpec } from '@k8ordo/ui/json-render';

const spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { direction: 'column' }, children: ['ok'] },
    ok: { type: 'Button', props: { label: 'OK' } }, // typo in `type`/props → compile error
  },
} satisfies UISpec;
```

For advanced setups (custom `navigate` / `handlers` / `validationFunctions`), pass the lower-level `registry` to `JSONUIProvider` and `Renderer` from `@json-render/react` directly.

| Export                            | Side           | Contents                                                                                                                  |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `@k8ordo/ui/json-render`          | server-safe    | `catalog` (schemas + `prompt()`), `validateGeneratedSpec`, `uiRules`, types (`UISpec`, `ComponentName`, `ComponentProps`) |
| `@k8ordo/ui/json-render/registry` | `'use client'` | `JsonRenderUI` (pre-wired), `registry` (low-level)                                                                        |

### OpenUI

```tsx
'use client';
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function GenUi({ response }: { response: string }) {
  return <Renderer library={library} response={response} />;
}
```

Generate the system prompt on the **server** with the dedicated server-safe entry (symmetric with json-render's `catalog.prompt()`):

```tsx
import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt(); // server-safe, no React — call it from an RSC or API route
```

To generate the prompt inside the client bundle instead, `library.prompt()` still works.

| Export                     | Side           | Contents                              |
| -------------------------- | -------------- | ------------------------------------- |
| `@k8ordo/ui/openui`        | `'use client'` | `library` (rendering)                 |
| `@k8ordo/ui/openui/prompt` | server-safe    | `prompt()` (system prompt generation) |

> **Notes**
>
> - Make sure `@k8ordo/ui/styles.css` (or `tailwind.css` in Tailwind CSS 4 projects) is loaded and the app is wrapped in `UIProvider`.
> - Both OpenUI entries need `@openuidev/lang-core` — `openui/prompt` is the React-free one, and `openui` builds its component library with it. Install it alongside `@openuidev/react-lang`: pnpm will not resolve it for you just because `react-lang` depends on it.
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

Components are built with Tailwind CSS and support customization through:

- CSS custom properties (semantic design tokens)
- Tailwind utility classes
- Light / Dark mode via semantic color tokens

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

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/k35o/k8ordo#readme) for contribution guidelines.
