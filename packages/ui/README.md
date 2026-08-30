# @k8ordo/ui

React components from [k8ordo](https://ordo.k8o.me) — semantic design
tokens, built-in Japanese/English wording, and adapters that let an LLM generate
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

Only React is required:

```bash
npm install react react-dom
```

| Package     | Version |
| ----------- | ------- |
| `react`     | ≥19.2.6 |
| `react-dom` | ≥19.2.6 |

Everything else is an optional peer, needed only for the entry point that uses
it. Install one when you import the entry it belongs to.

| Package                                   | Version  | Needed for                                                                    |
| ----------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `typescript`                              | ≥7.0.2   | the shipped type declarations                                                 |
| `@types/react`                            | ≥19.2.18 | the shipped type declarations                                                 |
| `@types/react-dom`                        | ≥19.2.4  | the shipped type declarations                                                 |
| `tailwindcss`                             | ≥4.3.3   | the `tailwind.css` entry (see [Imports & Bundle Size](#imports--bundle-size)) |
| `zod`                                     | ≥4.4.3   | generative-UI schemas                                                         |
| `@json-render/core`, `@json-render/react` | ≥0.19.0  | `@k8ordo/ui/json-render`                                                      |
| `@openuidev/lang-core`                    | ≥0.2.10  | `@k8ordo/ui/openui`                                                           |
| `@openuidev/react-lang`                   | ≥0.2.9   | `@k8ordo/ui/openui`                                                           |
| `ai`                                      | ≥7.0.51  | `@k8ordo/ui/ai-sdk`                                                           |
| `streamdown`                              | ≥2.5.0   | `@k8ordo/ui/ai/response`                                                      |

The `styles.css` entry needs no peer at all — it is prebuilt CSS, so CSS Modules
and plain-CSS projects can use the components without Tailwind.

## Quick Start

1. Import the CSS and set up the provider.

**No Tailwind in your project?** Import the prebuilt stylesheet — this single
line is all you need. It works with CSS Modules or plain CSS: every library
rule sits in `@layer`, so your own (unlayered) CSS takes precedence, and the
design tokens are available as CSS custom properties (`var(--fg-mute)`, …).

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

The wording that components own internally — "close", "required", "loading", and so on — comes from a message dictionary. **It defaults to Japanese**, and that default applies even without a provider, so a Japanese app needs no setup at all.

To switch to English, pass the `en` dictionary from `@k8ordo/ui/i18n`:

```tsx
import { UIProvider } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';

function App() {
  return (
    <UIProvider messages={en}>
      <YourApp />
    </UIProvider>
  );
}
```

`messages` takes a `Partial<Messages>`, so you can spread a dictionary and override only the keys you care about:

```tsx
<UIProvider messages={{ ...en, close: 'Dismiss' }}>
  <YourApp />
</UIProvider>
```

Resolution order is **component prop > provider dictionary > built-in default (Japanese)**. Components that expose a wording prop of their own — `Spinner`'s `label`, `Alert`'s `closeLabel`, `PasswordInput`'s `showLabel` / `hideLabel`, `Pagination`'s `prevLabel` / `nextLabel` — take that prop over the dictionary.

The subpath exports both dictionaries and the type:

```tsx
import { en, ja, type Messages } from '@k8ordo/ui/i18n';
```

`ja` / `en` live behind `@k8ordo/ui/i18n` rather than the root entry so the dictionaries stay out of the main bundle. See [docs/references/components.md](docs/references/components.md) for the full key list.

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

### Buttons

- **Button** - Primary action button (use `renderItem` to render as a link)
- **IconButton** - Button with icon only (use `renderItem` to render as a link)

### Navigation

- **Anchor** - Text link with external-link awareness
- **Breadcrumb** - Navigation path indicator
- **Pagination** - Page navigation controls
- **Tabs** - Tab-based content organization

### Form Controls

- **Autocomplete** - Search with suggestions
- **Checkbox** / **CheckboxCard** / **CheckboxGroup** - Multi-selection inputs
- **FileField** - File upload with composite pattern
- **Form** / **FormControl** - Form wrapper and field with label/validation
- **NumberField** - Numeric input with controls
- **PasswordInput** - Password input with show/hide toggle
- **Radio** / **RadioCard** - Single-selection inputs
- **Select** - Dropdown selection
- **Slider** - Slider input control
- **Switch** - Toggle switch
- **TextField** - Single-line text input
- **Textarea** - Multi-line text input

### Data Display

- **Accordion** - Collapsible content panels
- **Avatar** - User/entity avatar
- **Badge** - Status/label indicator
- **Card** - Flexible content container (hover interaction via `interactive`)
- **Code** - Formatted code display
- **Heading** - Typography heading component
- **Table** - Tabular data display

### Feedback

- **Alert** - Important messages and notifications
- **Progress** - Progress indication
- **Skeleton** - Content loading placeholder
- **Spinner** - Loading indicator
- **ToastProvider** / **useToast** - Temporary notification messages

### Overlays

- **Dialog** - Modal dialog boxes
- **Drawer** - Slide-out panel
- **DropdownMenu** - Action menu component
- **ListBox** - Selectable list component
- **Modal** - Overlay modal component
- **Popover** - Floating content container
- **Tooltip** - Contextual help text

### Layout

- **ScrollLinked** - Scroll progress indicator
- **Separator** - Visual content divider

### Utilities

- **UIProvider** - Root provider for the library
- **PortalRootProvider** / **usePortalRoot** - Customize the portal mount root
- **Icons** - Icon component collection

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

All components and hooks ship from a single ESM entry point — there are no per-component subpaths. The package is tree-shakeable (`sideEffects` is limited to CSS), so bundlers drop everything you don't import:

```tsx
// Named imports from the root entry — unused exports are tree-shaken away
import { Button, Card, useClickAway, useLocalStorage } from '@k8ordo/ui';
```

Optional features live behind dedicated subpath exports:

| Subpath                           | Contents                                                        |
| --------------------------------- | --------------------------------------------------------------- |
| `@k8ordo/ui`                      | All components and hooks                                        |
| `@k8ordo/ui/tokens`               | Design token definitions                                        |
| `@k8ordo/ui/i18n`                 | Message dictionaries (`ja` / `en`) and the `Messages` type      |
| `@k8ordo/ui/ai`                   | AI chat components                                              |
| `@k8ordo/ui/ai/response`          | `Response` Markdown renderer (needs optional peer `streamdown`) |
| `@k8ordo/ui/ai-sdk`               | AI SDK adapter (needs optional peer `ai`)                       |
| `@k8ordo/ui/json-render`          | json-render catalog (server-safe)                               |
| `@k8ordo/ui/json-render/registry` | json-render registry (`'use client'`)                           |
| `@k8ordo/ui/openui`               | OpenUI library (`'use client'`)                                 |
| `@k8ordo/ui/openui/prompt`        | OpenUI prompt generation (server-safe)                          |
| `@k8ordo/ui/styles.css`           | Prebuilt stylesheet (no Tailwind required)                      |
| `@k8ordo/ui/tailwind.css`         | Tailwind source entry (requires Tailwind CSS 4)                 |

## AI Chat Components

`@k8ordo/ui/ai` ships building blocks for chat UIs:

- **Conversation** (`Root` / `Messages` / `ScrollButton`) - Scroll container with stick-to-bottom behavior and a scroll-to-bottom button
- **Message** (`Root` / `Content`) - Chat bubble, styled by `from="user" | "assistant"`
- **PromptInput** (`Root` / `Textarea` / `Submit`) - Message input form with IME-aware Enter-to-send and a stop button while streaming
- **Reasoning** - Collapsible display of the model's thinking text
- **Suggestion** (`List` / `Item`) - Suggested prompt chips
- **ToolInvocation** - Tool call display with input/output and `state` (`'input-streaming' | 'input-available' | 'output-available' | 'output-error'`)
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

With the [AI SDK](https://ai-sdk.dev), `mapMessageParts` from `@k8ordo/ui/ai-sdk` converts a `UIMessage` into a flat array of `{ kind: 'text' | 'reasoning' | 'tool', ... }` parts that map 1:1 onto `Response`, `Reasoning`, and `ToolInvocation`.

## Generative UI integrations

k8ordo UI ships official adapters so an LLM can generate UIs using these components, via either [json-render](https://json-render.dev) or [OpenUI](https://www.openui.com). Each adapter constrains the model to k8ordo UI components with prop schemas locked to the design tokens, so generated UIs stay on-brand. Component-specific `renderItem` render props are bridged internally — the model only ever sees flat data (e.g. `href`).

These integrations are exposed as optional subpath exports. Install the framework you use (they are optional peer dependencies):

```bash
# json-render
pnpm add @json-render/core @json-render/react zod
# OpenUI
pnpm add @openuidev/react-lang zod
# OpenUI server-safe prompt entry (@k8ordo/ui/openui/prompt) additionally needs:
pnpm add @openuidev/lang-core
```

Supported components (**all 49**, both frameworks):

- **Layout / containers**: `Stack`, `Grid`, `Card`, `Form`
- **Buttons / nav**: `Button`, `IconButton`, `Anchor`, `Breadcrumb`, `Pagination`
- **Display**: `Badge`, `Heading`, `Avatar`, `Code`, `Icon`, `ChevronIcon`, `StatusIcon`, `Alert`, `Spinner`, `Progress`, `Skeleton`, `Separator`, `Tabs`, `Accordion`, `Table`, `ScrollLinked`
- **Overlays (self-contained widgets)**: `Modal`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `Toast`
- **Form**: `TextField`, `Textarea`, `PasswordInput`, `NumberField`, `Slider`, `Checkbox`, `Switch`, `Select`, `Radio`, `RadioCard`, `CheckboxCard`, `ListBox`, `CheckboxGroup`, `Autocomplete`, `FileField`, `FormControl`

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
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: unknown }) {
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
> - `@k8ordo/ui/openui/prompt` needs the optional peer `@openuidev/lang-core` (React-free).
> - `Tabs` panels are text content (`tabs: [{ label, content }]`); rich-component panels are a future enhancement.
> - In OpenUI, `Card` can contain a `Stack` or `Grid`, but `Stack`/`Grid` cannot directly nest a `Stack`/`Grid`/`Card` (no self-referential schemas) — put nested layout inside a `Card`. json-render nests freely (slots-based).

## Custom Hooks

The library includes several useful hooks:

- **useBreakpoint** - Tailwind breakpoint matcher
- **useClickAway** - Detect clicks outside an element
- **useClient** - Client-side rendering detection
- **useClipboard** - Clipboard operations
- **useControllableState** - Controlled/uncontrolled state pattern
- **useDebouncedTransition** - Rate-limited transition with `AbortSignal`
- **useDeferredDebounce** - `useDeferredValue` with pending flag
- **useDisclosure** - Open/close/toggle disclosure state
- **useHash** - URL hash management
- **useHover** - Element hover detection
- **useIntersectionObserver** / **useInView** - Element visibility
- **useInterval** - Interval timer management
- **useLocalStorage** / **useSessionStorage** - Web Storage with React state
- **useResize** - Element resize detection (ResizeObserver)
- **useScrollDirection** - Scroll direction detection
- **useScrollLock** - Body/element scroll lock
- **useStep** - Step-based state management
- **useTimeout** - Timeout management
- **useWindowResize** - Window resize events
- **useWindowSize** - Window size tracking
- **useWritingMode** - Detect horizontal/vertical `writing-mode`

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
