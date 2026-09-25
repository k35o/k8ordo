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

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/color-scheme` for light and dark mode. Before touching the
colour scheme, read `node_modules/@k8ordo/color-scheme/docs/GUIDE.md`. One
`<ColorSchemeProvider>` wraps everything inside the root layout's `<body>`,
with `suppressHydrationWarning` on `<html>`; components read and change the
scheme through `useColorScheme()`. Never toggle the `dark` class, query
`prefers-color-scheme` for the scheme, or write the stored preference
yourself — the provider owns all three, and `setPreference` is the one way in.
```

What each surface gives an agent:

| Surface                    | Where                                             |
| -------------------------- | ------------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/color-scheme/docs/GUIDE.md` |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt    |
| Markdown twin on the web   | https://ordo.k8o.me/color-scheme/docs/GUIDE.md    |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
