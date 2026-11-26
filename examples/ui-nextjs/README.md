# @k8ordo/ui × Next.js

This example belongs to `@k8ordo/ui` and shows it dropped into a Next.js App Router application: the components render straight from a Server Component, and the design tokens reach the app's own Tailwind markup through the bridge.

## Overview

This example showcases:

- k8ordo UI setup in a Next.js project (App Router)
- Components rendered from a **Server Component** (`src/app/page.tsx`), with no `'use client'` boundary file of its own
- Tailwind CSS 4 with PostCSS, TypeScript, and Turbopack

## Getting Started

### Prerequisites

- Node.js >=26.13.1
- pnpm 12.x (`pnpm@12.4.0`)

### Installation & Setup

From the root of the k8ordo UI monorepo:

```bash
# Install dependencies
pnpm install

# Build the library first (the workspace resolves @k8ordo/ui from its dist/)
pnpm --filter @k8ordo/ui build

# Navigate to this example
cd examples/ui-nextjs

# Start development server (Turbopack)
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
examples/ui-nextjs/
├── src/
│   └── app/
│       ├── globals.css        # Imports Tailwind, then @k8ordo/ui/tailwind.css
│       ├── layout.tsx         # Root layout component
│       └── page.tsx           # Server Component: renders the components directly
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration for Tailwind
├── tsconfig.json              # TypeScript configuration
└── next-env.d.ts              # Next.js type declarations
```

## What's Included

### Server Component (`src/app/page.tsx`)

The page is a Server Component. Components that need the browser carry their
own `'use client'`, so the page imports them from `@k8ordo/ui` like any other
component:

```tsx
import { Alert, Button, Heading, Stack, Switch, TextField } from '@k8ordo/ui';

export default function Home() {
  return (
    <Stack direction="column" gap="lg">
      <Heading level="h1">k8ordo UI × Next.js</Heading>
      <Alert message="…" tone="success" />
      {/* a form of TextField, Switch, and Button */}
    </Stack>
  );
}
```

### Dependencies

- `@k8ordo/ui` (workspace)

## Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start the production server
- `pnpm typecheck` - Run Next.js typegen + TypeScript type checking
- `pnpm check` - Run Oxlint/Oxfmt linting/formatting checks (`vp check`)
- `pnpm check:write` - Run `vp check --fix` to auto-fix issues

## Key Configuration

### Next.js Configuration

The project uses Next.js 16.3.3 with Turbopack, the App Router, and Next.js typegen.

### Tailwind CSS

Tailwind CSS 4 is configured with PostCSS. `src/app/globals.css` imports
Tailwind, then k8ordo UI's bridge:

```css
@import 'tailwindcss';
@import '@k8ordo/ui/tailwind.css';
```

The bridge maps the design tokens onto Tailwind's theme, so they stay usable
in this app's own markup (`bg-bg-base`, `text-fg-mute`). It does not import
Tailwind itself: `@k8ordo/ui` does not depend on `tailwindcss`, the app does. Projects without Tailwind import the prebuilt
`@k8ordo/ui/styles.css` instead — see `examples/ui-css-modules`.

## Related Documentation

- [k8ordo UI Main Documentation](../../packages/ui/README.md)
- [Generative UI](../../packages/ui/README.md#generative-ui) — the glue to a format lives in [`examples/ui-integrations`](../ui-integrations)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

This example is part of the k8ordo UI monorepo. See the [main README](../../README.md) for more information about the project.
