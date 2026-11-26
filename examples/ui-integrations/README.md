# @k8ordo/ui × json-render, OpenUI, and the AI SDK

This example belongs to `@k8ordo/ui` and keeps the **glue** between its catalog and the formats an application connects it to. `@k8ordo/ui` describes its components for a model (`@k8ordo/ui/catalog`) and draws them (`@k8ordo/ui/catalog/render`), and depends on no format; the glue for [json-render](https://json-render.dev), [OpenUI](https://www.openui.com), and the [AI SDK](https://ai-sdk.dev) lives here, under test, for an application to copy and own. Vite is just the host.

## Overview

This example showcases:

- k8ordo UI setup in a Vite project (Vite+ / `vp` toolchain)
- **json-render glue** (`src/json-render/`): the catalog, the registry, and `validateGeneratedSpec`, built by mapping over `@k8ordo/ui/catalog`; a typed `UISpec` rendered with `<JsonRenderUI />`
- **OpenUI glue** (`src/openui/`): the library and the React-free `prompt()`, built the same way; an OpenUI-Lang DSL string rendered with `library` + `Renderer`
- **AI SDK glue** (`src/ai-sdk/map-parts.ts`): `mapMessageParts`, which maps `useChat` messages onto the chat components — tool approval, attachments, sources, a `data-ui` part rendered as generative UI, and copy / regenerate / feedback — driven by a scripted transport, so no server or API key is needed
- Tailwind CSS 4 integration and TypeScript

No piece of glue names a component. A component added to `@k8ordo/ui`'s catalog reaches every format here with no change to this directory.

## Getting Started

### Prerequisites

- Node.js >=26.13.1
- pnpm 12.x (`pnpm@12.4.0`)

### Installation & Setup

From the root of the k8ordo UI monorepo:

```bash
# Install dependencies
pnpm install

# Build the library first (the example resolves @k8ordo/ui from its dist/)
pnpm --filter @k8ordo/ui build

# Navigate to this example
cd examples/ui-integrations

# Start development server (Vite+ / vp)
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
examples/ui-integrations/
├── src/
│   ├── app.tsx                    # Hosts the json-render, OpenUI, and AI SDK demos
│   ├── prompt-language.test.ts    # The prompts the glue builds are English and say how a field binds
│   ├── ai-sdk/
│   │   ├── map-parts.ts           # Glue: UIMessage.parts → parts for the chat components
│   │   ├── map-parts.test.ts      # Every part kind maps, in order
│   │   ├── demo.tsx               # useChat rendered with @k8ordo/ui/ai via mapMessageParts
│   │   ├── scripted-transport.ts  # A ChatTransport that streams fixed replies instead of a model
│   │   ├── demo.test.ts           # The SDK-assembled reply keeps its approval id; the data-ui spec validates
│   │   └── demo.browser.test.tsx  # Approve / deny, attach, regenerate, and feedback through the real useChat
│   ├── json-render/
│   │   ├── catalog.ts             # Glue: the json-render catalog, UISpec, validateGeneratedSpec (server-safe)
│   │   ├── catalog.test.ts        # What validateGeneratedSpec accepts and reports
│   │   ├── registry.tsx           # Glue: the registry and <JsonRenderUI /> ('use client')
│   │   ├── demo.tsx               # Typed UISpec rendered with <JsonRenderUI />
│   │   ├── demo.test.ts           # The spec passes validateGeneratedSpec with no fixes
│   │   └── demo.browser.test.tsx  # The spec renders and keeps form state in a real browser
│   ├── openui/
│   │   ├── defs.ts                # Glue: builds the OpenUI library from the catalog
│   │   ├── library.tsx            # Glue: the library with renderers ('use client')
│   │   ├── prompt.ts              # Glue: the system prompt, without React
│   │   ├── library.test.ts        # Every container takes every container as a child
│   │   ├── demo.tsx               # OpenUI-Lang DSL rendered with library + Renderer
│   │   ├── demo.test.ts           # The DSL parses and every statement reaches the tree
│   │   └── demo.browser.test.tsx  # The DSL renders and keeps form state in a real browser
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts              # Vite type declarations
├── index.html                     # HTML template
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # TypeScript configuration for src/
└── vite.config.ts                 # Vite configuration (vite-plus), with the spec / render test projects
```

## What's Included

### The shape of the glue

Each piece of glue maps over `catalog` from `@k8ordo/ui/catalog` and does three
things: it registers every component with the format, by name, with its
`description` and `props`; it binds each field's `value.prop` to the format's
state (json-render's `$bindState`, OpenUI's form state by `name`), starting from
`value.initial(props)`; and it draws every component through `renderers` from
`@k8ordo/ui/catalog/render`.

### json-render (`src/json-render/`)

A hand-written UI tree is typed with `satisfies UISpec` (so a typo in a component
name or prop is a compile error) and rendered with the glue's pre-wired client
component:

```tsx
import type { UISpec } from './catalog';
import { JsonRenderUI } from './registry';

const spec = {/* ... */} satisfies UISpec;

export function JsonRenderDemo() {
  return <JsonRenderUI spec={spec} />;
}
```

### OpenUI (`src/openui/`)

An OpenUI-Lang DSL string is rendered with the glue's `library`:

```tsx
import { Renderer } from '@openuidev/react-lang';

import { library } from './library';

export function OpenUiDemo() {
  return <Renderer library={library} response={openuiLangString} />;
}
```

### AI SDK (`src/ai-sdk/`)

`useChat` owns the conversation; `mapMessageParts` turns each `UIMessage` into
parts that map onto `Message`, `Reasoning`, `ToolInvocation`, `Attachment`,
and `Source`. The tool asks for approval, and the answer goes straight back to
the SDK:

```tsx
const chat = useChat({
  transport: scriptedTransport,
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});

<ToolInvocation
  approval={part.approval}
  name={part.name}
  onApprovalResponse={chat.addToolApprovalResponse}
  state={part.state}
/>;
```

Attachments come from `PromptInput` (`accept` turns them on) and go to
`sendMessage` as a `FileList`. The reply's `data-ui` part carries a json-render
spec, which is checked with `validateGeneratedSpec` before `<JsonRenderUI>`
draws it. `scriptedTransport` stands in for the model: it streams the same UI
message chunks a server would, so the demo runs without a backend.

### Dependencies

- `@k8ordo/ui` (workspace)
- `@json-render/core`, `@json-render/react` (json-render glue)
- `@openuidev/react-lang`, `@openuidev/lang-core` (OpenUI glue)
- `ai`, `@ai-sdk/react` (AI SDK glue)
- `zod` (the catalog's schemas)
- `tailwindcss`, `@tailwindcss/vite` (Tailwind CSS 4)

## Available Scripts

- `pnpm dev` - Start the development server (`vp dev`)
- `pnpm build` - Build for production (`vp build`)
- `pnpm test` - Run the tests (`vp test`): the `spec` project checks the glue, the demo spec and DSL, and the scripted replies against the AI SDK, and the `render` project mounts the demos in headless Chromium, Firefox, and WebKit
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run Oxlint/Oxfmt linting/formatting checks (`vp check`)
- `pnpm check:write` - Run `vp check --fix` to auto-fix issues

## Key Configuration

### Vite Configuration

The project uses the Vite+ (`vite-plus`) toolchain and `@vitejs/plugin-react`.

### Tailwind CSS

Tailwind CSS 4 is configured via the `@tailwindcss/vite` plugin.
`src/styles.css` imports Tailwind, then k8ordo UI's bridge
(`@k8ordo/ui/tailwind.css`), which maps the design tokens onto Tailwind's
theme so they stay usable in this app's own markup. The bridge does not import
Tailwind itself: `@k8ordo/ui` does not depend on `tailwindcss`, the app does.
`src/tailwind.test.ts` compiles that entry with Tailwind and checks that the
utilities read the tokens. (Projects without
Tailwind import the prebuilt `@k8ordo/ui/styles.css` instead — see
`examples/ui-css-modules`.)

### TypeScript

Full TypeScript support with strict configuration for type safety.

## Related Documentation

- [k8ordo UI Main Documentation](../../packages/ui/README.md)
- [Generative UI](../../packages/ui/README.md#generative-ui)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

This example is part of the k8ordo UI monorepo. See the [main README](../../README.md) for more information about the project.
