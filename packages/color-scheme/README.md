# @k8ordo/color-scheme

The colour-scheme axis of an application, owned. The visitor's preference —
light, dark, or nothing, which follows the default (the system unless told
otherwise) — lives in localStorage through `@k8ordo/state`; one rule resolves
it against `prefers-color-scheme`; the result is the `dark` class on `<html>`,
put there by an inline script before the first paint and kept there after
hydration. One provider does all of that; a hook reads it. `@k8ordo/ui`'s
tokens read the class; Tailwind's `dark:` does too once the stylesheet declares
`@custom-variant dark (&:where(.dark, .dark *));` — `@k8ordo/ui/tailwind.css`
already does.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/color-scheme
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install @k8ordo/color-scheme @k8ordo/state zod
# or
pnpm add @k8ordo/color-scheme @k8ordo/state zod
```

## Peer Dependencies

| Package         | Version | Needed for                                 |
| --------------- | ------- | ------------------------------------------ |
| `@k8ordo/state` | ^0.2.0  | where the preference lives (localStorage)  |
| `react`         | ≥19.3.0 | the provider and the hook                  |
| `zod`           | ^4.4.3  | the one-field schema `@k8ordo/state` reads |
| `typescript`    | ≥7.0.2  | the shipped type declarations (optional)   |
| `@types/react`  | ≥19.3.0 | the shipped type declarations (optional)   |

## Quick Start

The provider goes in the root layout, inside `<body>`, around everything. It
renders the inline script itself, so nothing goes in `<head>`:

```tsx
// routes/layout.tsx — a Server Component
import { ColorSchemeProvider } from '@k8ordo/color-scheme';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}
```

A switcher reads and writes the preference:

```tsx
'use client';

import { useColorScheme } from '@k8ordo/color-scheme';

export function SchemeSwitcher() {
  const { scheme, setPreference } = useColorScheme();
  return (
    <button
      onClick={() => setPreference(scheme === 'dark' ? 'light' : 'dark')}
      type="button"
    >
      {scheme === 'dark' ? 'light mode' : 'dark mode'}
    </button>
  );
}
```

`scheme` is what is on screen; `preference` is what the visitor asked for
(`'system'` when nothing is stored); `setPreference('system')` stores none, so
the provider's default applies again. That default is the system unless told
otherwise: `<ColorSchemeProvider defaultPreference="dark">` starts every
visitor dark until they choose.

## AI Agent Documentation

This package ships its documentation so an AI coding assistant reads the exact
installed version:

- `node_modules/@k8ordo/color-scheme/docs/GUIDE.md` — the design guide
- `node_modules/@k8ordo/color-scheme/docs/llms.txt` — the index

## License

MIT
