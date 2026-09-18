# @k8ordo/color-scheme

The colour-scheme axis of an application, owned.

A visitor's colour scheme is three things that have to agree: what they
asked for, what the system says, and what is on screen. This package keeps
the first in localStorage (through `@k8ordo/state`), reads the second from
`prefers-color-scheme`, and resolves both into the third — the `dark` class
on `<html>`, which `@k8ordo/ui`'s tokens read, and Tailwind's `dark:` too
once the stylesheet declares `@custom-variant dark (&:where(.dark, .dark *));`
(`@k8ordo/ui/tailwind.css` already does). One provider does all of it: it
renders the inline script that puts the class there before the first paint,
keeps it right after hydration, and hands a hook what it reads.

Like every k8ordo package it assumes React 19 and Server Components, uses
only what has reached Baseline newly available, and ships no polyfills or
legacy fallbacks.

## What it does not own

- **The colours.** Which colour `dark` means is the stylesheet's business —
  `@k8ordo/ui`'s tokens, or any other that reads the class. So is the CSS
  `color-scheme` property (form controls, scrollbars): neither this package
  nor `@k8ordo/ui` sets it.
- **Where the preference lives.** That is `@k8ordo/state`'s
  `defineLocalState`; this package declares one and reads and writes
  through it, so the localStorage key and the row's JSON are never spelled
  here.
- **A guess on the server.** No cookie, no header: a server render shows
  the provider's default (`light`, when that default is `'system'`), and the
  inline script is what makes the first paint right.

## The shape of it

```
routes/layout.tsx   <body><ColorSchemeProvider>{children}</ColorSchemeProvider></body>
                        │ renders <script> first → class on <html> before the first paint
                        │ reads the store + the system → keeps the class in step
components          useColorScheme() → { scheme, preference, setPreference }
```

## Setup

The provider goes in the root layout — a Server Component — inside `<body>`
and around everything, so the script it renders comes before anything the
page paints:

```tsx
// routes/layout.tsx
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>`, because the script adds a class the
server did not render — that difference is the point, not a mistake.

Nothing else is required: the first paint is right, and a visitor who
never chooses follows the system, in either direction, for as long as the
page is open. To start every visitor somewhere other than the system, say
so once: `<ColorSchemeProvider defaultPreference="dark">`.

## Reading and changing it

```tsx
'use client';

import { useColorScheme } from '@k8ordo/color-scheme';

export function SchemeSwitcher() {
  const { scheme, preference, setPreference } = useColorScheme();
  return (
    <select
      onChange={(event) =>
        setPreference(event.currentTarget.value as typeof preference)
      }
      value={preference}
    >
      <option value="system">system ({scheme})</option>
      <option value="light">light</option>
      <option value="dark">dark</option>
    </select>
  );
}
```

| Member          | What it is                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| `scheme`        | `'light' \| 'dark'` — what is on screen.                                   |
| `preference`    | `'light' \| 'dark' \| 'system'` — what the visitor asked for.              |
| `setPreference` | Stores a preference; `'system'` stores none, so the default applies again. |

A toggle is `setPreference(scheme === 'dark' ? 'light' : 'dark')`. The hook
reads the provider and touches nothing else, so a switcher and a preview
agree because there is one provider deciding.

`colorSchemeState` is the `defineLocalState` definition itself, exported for
anything that wants the row without the hook — `useAppState(colorSchemeState)`,
or `colorSchemeState.storageKey` in a test.

## What it guarantees

- **No flash.** The script runs before the first paint and reads the same
  row the provider writes; a dark page loads dark. It is an inline script
  with no `nonce`, so a Content Security Policy has to let it run.
- **Nothing chosen follows the default, and a `'system'` default follows
  the system.** A visitor who never chose is never pinned to what the
  system said on their first visit, and a row that is not a JSON object, or
  whose `preference` is not `'light'` or `'dark'`, reads as nothing chosen;
  no other field in the row is read.
- **The server renders the default** (`light` when that default is
  `'system'`: a server has no system to ask), and the provider corrects
  itself on hydration without touching the document: the render that
  hydrates reads the server's guesses and writes nothing, and the render
  that follows reads the store and writes what the script already put
  there. Until then the HTML shows the default — a switcher's icon, say —
  which is the one thing no server can know; a component that must not
  show it even for a moment says so with React's `use(browser())` under a
  `<Suspense>`.
- **Tabs agree.** The preference propagates across tabs through the
  `storage` event, as any `@k8ordo/state` local state does. That event
  never reaches the tab that wrote, so a `localStorage.setItem` on the row
  in the same tab goes unnoticed until a reload: change it through
  `setPreference`.

## Testing

Under a browser, `localStorage.clear()`, remove the class from
`document.documentElement`, and `resetStateRegistry()` from `@k8ordo/state`
between tests; render the hook under `<ColorSchemeProvider>` (a `wrapper`).
A client-only mount does not run the script the provider renders: React
never executes an inline `<script>` it creates in the browser (in
development it logs an error saying so), so the class a test sees is the
one the provider's effect wrote.
