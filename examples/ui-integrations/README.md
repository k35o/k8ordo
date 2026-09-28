# @k8ordo/ui × Generative UI adapters

This example belongs to `@k8ordo/ui` and exists to exercise its **generative UI adapters**. Vite is just the host. In a Vite + React app: an LLM-style spec is rendered with k8ordo UI components via both [json-render](https://json-render.dev) and [OpenUI](https://www.openui.com), and an [AI SDK](https://ai-sdk.dev) chat is rendered with `@k8ordo/ui/ai` through `@k8ordo/ui/ai-sdk`.

## Overview

This example showcases:

- k8ordo UI setup in a Vite project (Vite+ / `vp` toolchain)
- **json-render**: a typed `UISpec` rendered with the pre-wired `<JsonRenderUI />`
- **OpenUI**: an OpenUI-Lang DSL string rendered with `library` + `Renderer`
- **AI SDK**: `useChat` messages mapped onto the chat components with `mapMessageParts` — tool approval, attachments, sources, a `data-ui` part rendered as generative UI, and copy / regenerate / feedback — driven by a scripted transport, so no server or API key is needed
- Tailwind CSS 4 integration and TypeScript

## Getting Started

### Prerequisites

- Node.js >=24.13.0
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
│   ├── ai-sdk/
│   │   ├── demo.tsx               # useChat rendered with @k8ordo/ui/ai via mapMessageParts
│   │   ├── scripted-transport.ts  # A ChatTransport that streams fixed replies instead of a model
│   │   ├── demo.test.ts           # The SDK-assembled reply keeps its approval id; the data-ui spec validates
│   │   └── demo.browser.test.tsx  # Approve / deny, attach, regenerate, and feedback through the real useChat
│   ├── json-render/
│   │   ├── demo.tsx               # Typed UISpec rendered with <JsonRenderUI />
│   │   ├── demo.test.ts           # The spec passes validateGeneratedSpec with no fixes
│   │   └── demo.browser.test.tsx  # The spec renders and keeps form state in Chromium
│   ├── openui/
│   │   ├── demo.tsx               # OpenUI-Lang DSL rendered with library + Renderer
│   │   ├── demo.test.ts           # The DSL parses and every statement reaches the tree
│   │   └── demo.browser.test.tsx  # The DSL renders and keeps form state in Chromium
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts              # Vite type declarations
├── index.html                     # HTML template
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # TypeScript configuration for src/
└── vite.config.ts                 # Vite configuration (vite-plus), with the spec / render test projects
```

## What's Included

### json-render demo (`src/json-render/demo.tsx`)

A hand-written UI tree is typed with `satisfies UISpec` (so a typo in a component
name or prop is a compile error) and rendered with the pre-wired client component:

```tsx
import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

const spec = {/* ... */} satisfies UISpec;

export function JsonRenderDemo() {
  return <JsonRenderUI spec={spec} />;
}
```

### OpenUI demo (`src/openui/demo.tsx`)

An OpenUI-Lang DSL string is rendered with the k8ordo UI `library`:

```tsx
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function OpenUiDemo() {
  return <Renderer library={library} response={openuiLangString} />;
}
```

### AI SDK demo (`src/ai-sdk/demo.tsx`)

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
- `@json-render/core`, `@json-render/react` (json-render demo)
- `@openuidev/react-lang`, `@openuidev/lang-core` (OpenUI demo)
- `ai`, `@ai-sdk/react` (AI SDK demo)
- `zod` (shared by both adapters)
- `tailwindcss`, `@tailwindcss/vite` (Tailwind CSS 4)

## Available Scripts

- `pnpm dev` - Start the development server (`vp dev`)
- `pnpm build` - Build for production (`vp build`)
- `pnpm test` - Run the tests (`vp test`): the `spec` project checks the demo spec and DSL against the adapters and the scripted replies against the AI SDK, and the `render` project mounts the demos in headless Chromium
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run Oxlint/Oxfmt linting/formatting checks (`vp check`)
- `pnpm check:write` - Run `vp check --fix` to auto-fix issues

## Key Configuration

### Vite Configuration

The project uses the Vite+ (`vite-plus`) toolchain and `@vitejs/plugin-react`.

### Tailwind CSS

Tailwind CSS 4 is configured via the `@tailwindcss/vite` plugin. k8ordo UI's tokens
are loaded by importing `@k8ordo/ui/tailwind.css` — the Tailwind source entry,
so the design tokens stay usable in this app's own markup. (Projects without
Tailwind import the prebuilt `@k8ordo/ui/styles.css` instead — see
`examples/ui-css-modules`.)

### TypeScript

Full TypeScript support with strict configuration for type safety.

## Related Documentation

- [k8ordo UI Main Documentation](../../packages/ui/README.md)
- [Generative UI integrations](../../packages/ui/README.md#generative-ui-integrations)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

This example is part of the k8ordo UI monorepo. See the [main README](../../README.md) for more information about the project.
