# Agent guide — packages/color-scheme

`@k8ordo/color-scheme` — the colour-scheme axis, owned: what the visitor
asked for (`light`, `dark`, or nothing, which follows the provider's
default — the system unless told otherwise), where it is kept
(localStorage, through `@k8ordo/state`), what it resolves to, and the one
class `@k8ordo/ui` reads on `<html>`. A script in `<head>` writes the class
before the first paint, one provider decides and writes it after; a hook
reads. The shared discipline (React 19 / RSC assumed, Baseline newly
available only, no polyfills) and how a new package joins are in the
repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (resolve, the script; node) + browser (provider + hook, hydration, ColorSchemeScript, the script on a document; chromium, firefox, webkit)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **One place decides and writes after hydration.** `ColorSchemeProvider`
  holds the store subscription and the system query, resolves the scheme,
  and toggles the class from an effect; it renders nothing but its
  children. `useColorScheme` is `use(Context)` and nothing else — a
  consumer never touches the document.
- **Absent means "nothing chosen".** The stored row has a `preference` only
  while the visitor chose one; `'system'` is spelled by removing it. What
  applies then is the provider's `defaultPreference` — `'system'` unless
  told otherwise — so a visitor who never chose is never pinned to what the
  system said on their first visit.
- **One rule, two readers.** `resolve(preference, defaultPreference,
  systemDark)` is the rule; the provider reads it after hydration and
  `scriptFor(defaultPreference)` restates it in the inline script for the
  first paint. The script cannot run the schema, so it checks the value by
  hand and reads anything else as nothing chosen — keep the two in step.
- **The script goes in `<head>`, ahead of every stylesheet.** A script
  after a stylesheet waits for it to load, and the browser may paint in
  between — light, for a dark visitor (measured on k8o.me in Chromium: 12
  of 32 dark loads first painted light, mostly for one frame, while the
  script sat at the top of `<body>`). `ColorSchemeScript` is a component
  of its own, with no directive, so the root layout renders it in `<head>`
  as a Server Component; React still writes the stylesheets it hoists
  ahead of the head's own children, and `@k8ordo/framework` moves the
  head's inline scripts back in front of them (`packages/framework-engine`'s
  `head-scripts.ts`). It cannot read the provider, which sits in `<body>`,
  so both take `defaultPreference` and the application gives them the same
  value. Hydration finds the node in place and does not run it again.
- **The server renders the default, and the hydration render writes
  nothing.** No storage and no system to ask on the server, so a `'system'`
  default renders `light`; the first render in the browser reads the
  server's guesses and must not put them on a document the script already
  put right, so the class effect waits for the render that reads the store.
  Do not add a cookie or a header to guess earlier.
- **The script is allowed by nonce or by hash, never by being special.**
  `nonce` goes on the script as given; `colorSchemeScriptHash` hashes
  `scriptFor(defaultPreference)`, which is exactly what React writes between
  the tags — the browser test renders `ColorSchemeScript` on the server into
  a document under a `<meta>` policy and checks the hash is what lets it
  run.
  Anything that changes the script's text changes its hash, which is why the
  hash is computed, never written down.
- **The store is `@k8ordo/state`'s.** The definition names the state key
  (`color-scheme`); the localStorage key it derives
  (`k8ordo-state:color-scheme`, `storageKey`) and `inlineRead()` are read
  from it, so nothing here spells the localStorage key or the row's JSON by
  hand.

## Layout

```
src/
  scheme.ts       colorSchemeState, resolve, scriptFor, colorSchemeScriptHash
  script.tsx      ColorSchemeScript (no directive: rendered by the root layout)
  provider.tsx    ColorSchemeProvider + useColorScheme ('use client')
  index.ts
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Browser tests clear localStorage, the class, and the state registry
  between cases; the test browser prefers light, which is what "system"
  resolves to there. A client-only mount (`renderHook`) renders no script —
  React does not execute an inline `<script>` it creates, and logs a
  development error saying so — so the class those tests see is the
  effect's; the script is tested on its own, appended to the document.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
