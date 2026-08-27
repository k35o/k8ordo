# Vite Example - k8ordo UI

This example demonstrates k8ordo UI's **generative UI adapters** in a Vite + React app: an LLM-style spec is rendered with k8ordo UI components via both [json-render](https://json-render.dev) and [OpenUI](https://www.openui.com).

## Overview

This example showcases:

- k8ordo UI setup in a Vite project (Vite+ / `vp` toolchain)
- **json-render**: a typed `ArteSpec` rendered with the pre-wired `<JsonRenderUI />`
- **OpenUI**: an OpenUI-Lang DSL string rendered with `library` + `Renderer`
- Tailwind CSS 4 integration and TypeScript

## Getting Started

### Prerequisites

- Node.js >=24.13.0
- pnpm 11.x (`pnpm@11.5.0`)

### Installation & Setup

From the root of the k8ordo UI monorepo:

```bash
# Install dependencies
pnpm install

# Navigate to this example
cd examples/vite

# Start development server (Vite+ / vp)
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
examples/vite/
├── src/
│   ├── app.tsx              # Hosts the json-render and OpenUI demos
│   ├── json-render/
│   │   └── demo.tsx         # Typed ArteSpec rendered with <JsonRenderUI />
│   ├── openui/
│   │   └── demo.tsx         # OpenUI-Lang DSL rendered with library + Renderer
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration (vite-plus)
```

## What's Included

### json-render demo (`src/json-render/demo.tsx`)

A hand-written UI tree is typed with `satisfies ArteSpec` (so a typo in a component
name or prop is a compile error) and rendered with the pre-wired client component:

```tsx
import type { ArteSpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

const spec = {/* ... */} satisfies ArteSpec;

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

### Dependencies

- `@k8ordo/ui` (workspace)
- `@json-render/core`, `@json-render/react` (json-render demo)
- `@openuidev/react-lang` (OpenUI demo)
- `zod` (shared by both adapters)

## Available Scripts

- `pnpm dev` - Start the development server (`vp dev`)
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
`examples/css-modules`.)

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
