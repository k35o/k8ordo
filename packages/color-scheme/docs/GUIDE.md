# @k8ordo/color-scheme

The colour-scheme axis of an application, owned.

A visitor's colour scheme is three things that have to agree: what they
asked for, what the system says, and what is on screen. This package keeps
the first in localStorage (through `@k8ordo/state`), reads the second from
`prefers-color-scheme`, and resolves both into the third — the `dark` class
on `<html>`, which `@k8ordo/ui`'s tokens read, and Tailwind's `dark:` too
once the stylesheet declares `@custom-variant dark (&:where(.dark, .dark *));`
(`@k8ordo/ui/tailwind.css` already does). Two pieces do it:
`<ColorSchemeScript>`, an inline script in `<head>`, puts the class there
before the first paint, and `<ColorSchemeProvider>` keeps it right after
hydration and hands a hook what it reads. Given the application's colours,
the two keep the browser's own UI — `<meta name="theme-color">` — on the
same scheme.

Like every k8ordo package it assumes React 19 and Server Components, uses
only what has reached Baseline newly available, and ships no polyfills or
legacy fallbacks.

## What it does not own

- **The colours.** Which colour `dark` means is the stylesheet's business —
  `@k8ordo/ui`'s tokens, or any other that reads the class — and the
  browser's own UI is painted in colours the application gives (see "The
  browser's own UI"). The CSS `color-scheme` property (form controls,
  scrollbars) is the stylesheet's too: this package never
  sets it; `@k8ordo/ui`'s stylesheet does, next to its tokens (`light`, and
  `dark` under `.dark`), and a stylesheet of your own declares it beside its
  colours. Declare it by the class, not as `light dark`: that lets the
  browser pick by `prefers-color-scheme`, and the scrollbars would disagree
  with what the visitor chose.
- **Contrast.** `prefers-contrast: more` and `forced-colors: active` are
  settings the visitor makes in the OS, not something an application stores
  or toggles, so neither is a preference here. `@k8ordo/ui`'s stylesheet
  follows both on its own, in either scheme — its high-contrast values are
  declared for `:root` and for `.dark` — so a visitor who chose dark and asks
  the OS for more contrast gets the dark high-contrast values.
- **Where the preference lives.** That is `@k8ordo/state`'s
  `defineLocalState`; this package declares one and reads and writes
  through it, so the localStorage key and the row's JSON are never spelled
  here.
- **A guess on the server.** No cookie, no header: a server render shows
  the provider's default (`light`, when that default is `'system'`), and the
  inline script is what makes the first paint right.

## The shape of it

```
routes/layout.tsx   <head><ColorSchemeScript /></head>
                        │ runs before the stylesheets → class on <html> (+ theme-color <meta>) before the first paint
                    <body><ColorSchemeProvider>{children}</ColorSchemeProvider></body>
                        │ reads the store + the system → keeps the class (+ the <meta>) in step
components          useColorScheme() → { scheme, preference, setPreference }
```

## Setup

Both go in the root layout — a Server Component: the script in `<head>`,
and the provider inside `<body>`, around everything:

```tsx
// src/routes/layout.tsx
import { ColorSchemeProvider, ColorSchemeScript } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>`, because the script adds a class the
server did not render — that difference is the point, not a mistake.

The script has to come before every stylesheet in the HTML as sent. A
script after a stylesheet waits for it to load, and the browser may paint
the page in the meantime — light, for a visitor who gets dark. React writes
the stylesheets it hoists into `<head>` ahead of what the layout put there,
and `@k8ordo/framework` moves the inline scripts of the `<head>` back in
front of them, so under the framework the layout above is all it takes.
Without the framework, check the HTML your server sends: the script has to
come before the first `<link rel="stylesheet">` and `<style>`.

Nothing else is required: the first paint is right, and a visitor who
never chooses follows the system, in either direction, for as long as the
page is open. To start every visitor somewhere other than the system, give
both the same default: `<ColorSchemeScript defaultPreference="dark" />` and
`<ColorSchemeProvider defaultPreference="dark">`. The script applies it
before the first paint and the provider after hydration; told different
defaults, a visitor who never chose sees the scheme change as the page
hydrates.

### The browser's own UI

The address bar and the status bar are painted in the colour of
`<meta name="theme-color">`. A pair of them under
`media="(prefers-color-scheme: …)"` follows the system, not the visitor:
with the system on light and dark chosen, the browser's UI stays light
around a dark page. Give `ColorSchemeScript` the colours instead — the
page's background in each scheme, usually — and write no theme-color
`<meta>` of your own:

```tsx
<ColorSchemeScript themeColor={{ light: '#ffffff', dark: '#18181b' }} />
```

The script writes one `<meta name="theme-color">` for each scheme, at the
same moment it puts the class on. While the scheme is the system's — the
visitor chose nothing and the default is `'system'` — each sits under its
own `prefers-color-scheme`, so the browser follows the system by itself, as
it changes. Once something pins the scheme — a choice, or a default of
`'light'` or `'dark'` — that scheme's colour applies whatever the system
says. The provider keeps the two in step after hydration
(`setPreference('system')` hands them back to the system) and takes no
colours of its own: it changes their `media`, never their `content`.

The script writes them, rather than the page, because React writes every
`<meta>` it renders after the stylesheets, where the script, which runs
ahead of them, cannot reach. A theme-color `<meta>` of the page's own comes
after the script's and never applies, so leave it out. Without the script —
blocked by a policy, or never rendered — there is no theme colour at all.

### Under a Content-Security-Policy

`ColorSchemeScript` is an inline script, so a policy that restricts scripts
has to allow it, by nonce or by hash. Blocked, it costs the first paint and
the theme colour: the provider's effect still writes the class after
hydration, but until then `<html>` has no `dark` class and the page is
painted light, so a visitor who gets dark — by choice or by a `'dark'`
default — sees the flash the script exists to prevent; and the theme-color
`<meta>` are never written. Do not reach for `'unsafe-inline'`,
which allows every inline script that reaches the page; name this one.

`nonce` puts the answer's nonce on it — in `@k8ordo/framework`'s server
mode, `nonce()` from `@k8ordo/framework/server`, which the render may read
(signing a script is not writing the response):

```tsx
<ColorSchemeScript nonce={nonce()} />
```

`colorSchemeScriptHash(options?)` resolves to its hash as a CSP source,
`'sha256-…'`, for a policy that allows it by what it is — the `csp` option
of its static mode, whose files cannot carry a nonce, or a header that names
none. Pass it what the script is given, its nonce aside —
`{ defaultPreference, themeColor }`: the script carries both, so the hash
depends on them. Keep them in one module the layout and the config both
import, and the two cannot drift apart:

```ts
// vite.config.ts
import { themeColor } from './src/lib/theme-color';

framework({
  mode: 'static',
  csp: {
    'script-src': ["'self'", await colorSchemeScriptHash({ themeColor })],
  },
});
```

Compute the hash where the policy is written, every time, rather than
copying its value: the script's text is the installed version's, and an
update may change it.

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

## Where it is stored

`colorSchemeState` is the `defineLocalState` definition itself — key
`color-scheme`, so the localStorage key is `k8ordo-state:color-scheme`
(`colorSchemeState.storageKey`) — with one optional field:

```ts
defineLocalState(
  'color-scheme',
  z.object({ preference: z.optional(z.enum(['light', 'dark'])) }),
);
```

| When                      | The stored row                    |
| ------------------------- | --------------------------------- |
| Never chose               | no row (`getItem` returns `null`) |
| `setPreference('dark')`   | `{"preference":"dark"}`           |
| `setPreference('light')`  | `{"preference":"light"}`          |
| `setPreference('system')` | `{}`                              |

The default is never stored, so changing `defaultPreference` later moves
every visitor who never chose.

- **Reading it without the hook.** `useAppState(colorSchemeState)` from any
  client component reads the same store the provider does (`@k8ordo/state`
  keeps one per key). It returns the stored `preference`
  (`'light' | 'dark' | undefined`), not the resolved `scheme` — for what is
  on screen, use `useColorScheme()`.
- **Before the first paint, in a script of your own.**
  `colorSchemeState.inlineRead()` is a JavaScript expression that evaluates
  to the stored object, or `null`. No schema runs there, so check each field.
- **Other preferences beside it.** A display preference of the
  application's own is a `defineLocalState` under another key, in a module
  without `'use client'`. Never define another `'color-scheme'`: stores are
  shared by key, and the two definitions would fight over one row.

## What it guarantees

- **No flash.** The script runs before the first paint and reads the same
  row the provider writes; a dark page loads dark. That holds while the
  script comes before every stylesheet in the HTML as sent, which
  `@k8ordo/framework` ensures for a script in the root layout's `<head>`
  (see "Setup"). It is an inline script, so a Content-Security-Policy that
  restricts scripts has to allow it (see "Under a Content-Security-Policy").
- **The browser's UI agrees.** Given `themeColor`, the theme-color
  `<meta>` are written with the class and show the scheme on screen: the
  pinned scheme's colour once a choice or a default pins it, the system's
  while nothing does. The hydration render leaves them as the script wrote
  them, as it does the class.
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
- **Blocked storage still renders.** A browser that blocks site data cannot
  store a choice. The script and the provider both apply
  `defaultPreference`, and a scheme set with `setPreference` stays in memory
  until the next load.

## Testing

Under a browser, `localStorage.clear()`, remove the class from
`document.documentElement`, and `resetStateRegistry()` from `@k8ordo/state`
between tests; render the hook under `<ColorSchemeProvider>` (a `wrapper`),
and leave `ColorSchemeScript` out: React never executes an inline
`<script>` it creates in the browser (in development it logs an error
saying so), so the class a test sees is the one the provider's effect
wrote. Without the script there is no theme-color `<meta>` either, and the
provider writes none.
