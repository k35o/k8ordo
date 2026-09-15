# Agent guide — packages/color-scheme

`@k8ordo/color-scheme` — the colour-scheme axis, owned: what the visitor
asked for (`light`, `dark`, or nothing, which follows the system), where it
is kept (localStorage, through `@k8ordo/state`), what it resolves to, and
the one class `@k8ordo/ui` reads on `<html>`. One provider decides and
writes; a hook reads. The shared discipline (React 19 / RSC assumed,
Baseline newly available only, no polyfills) and how a new package joins
are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (resolve, the script; node) + browser (provider + hook, hydration, the script on a document; chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **One place decides and writes.** `ColorSchemeProvider` holds the store
  subscription and the system query, resolves the scheme, renders the
  inline script, and toggles the class from an effect. `useColorScheme` is
  `use(Context)` and nothing else — a consumer never touches the document.
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
- **The script is the provider's first child.** Rendered before the
  children, the parser runs it before it reaches what they render, which is
  why the provider goes inside `<body>` around everything and needs no
  separate placement in `<head>`. Hydration finds the node in place and does
  not run it again.
- **The server renders the default, and the hydration render writes
  nothing.** No storage and no system to ask on the server; the first render
  in the browser reads the server's guesses and must not put them on a
  document the script already put right, so the class effect waits for the
  render that reads the store. Do not add a cookie or a header to guess
  earlier.
- **The store is `@k8ordo/state`'s.** The key (`color-scheme`, so
  `k8ordo-state:color-scheme`) and `inlineRead()` are read from the
  definition; nothing here spells the key or the JSON envelope by hand.

## Layout

```
src/
  scheme.ts       colorSchemeState, resolve, scriptFor
  provider.tsx    ColorSchemeProvider + useColorScheme ('use client')
  index.ts
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Browser tests clear localStorage, the class, and the state registry
  between cases; the test browser prefers light, which is what "system"
  resolves to there. A client-only mount runs the rendered script too (a
  script element React creates executes), which is idempotent with the
  effect.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
