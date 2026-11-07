# Agent guide — packages/color-scheme

`@k8ordo/color-scheme` — the colour-scheme axis, owned: what the visitor
asked for (`light`, `dark`, or nothing, which follows the provider's
default — the system unless told otherwise), where it is kept
(localStorage, through `@k8ordo/state`), what it resolves to, and the one
class `@k8ordo/ui` reads on `<html>` — and, given the application's
colours, the theme-color `<meta>` the browser paints its own UI from. A
script in `<head>` writes both before the first paint, one provider decides
and writes them after; a hook reads. The shared discipline (React 19 / RSC
assumed, Baseline newly available only, no polyfills) and how a new package
joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

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
  systemDark)` is the rule, `pinnedScheme` its first half and
  `themeColorMedia` what the theme-color `<meta>` make of it; the provider
  reads them after hydration and `scriptFor({ defaultPreference,
  themeColor })` restates them in the inline script for the first paint.
  The script cannot run the schema, so it checks the value by hand and
  reads anything else as nothing chosen — keep the two in step.
- **The theme-color `<meta>` are the script's, and only their `media`
  moves.** React writes every `<meta>` it renders after the stylesheets,
  where the script — moved ahead of them — cannot reach, so the script
  creates one per scheme (marked `data-color-scheme`) instead of the page
  rendering them. Each sits under its own `prefers-color-scheme` while
  nothing is pinned, so the browser follows the system without us; once a
  scheme is pinned it is `all` and the other `not all`. The provider finds
  them by the mark and rewrites `media` alone, which is why it takes no
  colours: they are given once, to the script. No script, no `<meta>` —
  the provider never creates them.
- **The script goes in `<head>`, ahead of every stylesheet.** A script
  after a stylesheet waits for it to load, and the browser may paint in
  between — light, for a dark visitor (measured on k8o.me in Chromium: 12
  of 32 dark loads first painted light, mostly for one frame, while the
  script sat at the top of `<body>`). `ColorSchemeScript` is a component
  of its own, which the root layout renders in `<head>`; React still writes
  the stylesheets it hoists ahead of the head's own children, and
  `@k8ordo/framework` moves the head's inline scripts back in front of them
  (`packages/framework-engine`'s `head-scripts.ts`). It cannot read the
  provider, which sits in `<body>`, so both take `defaultPreference` and the
  application gives them the same value. Hydration finds the node in place
  and does not run it again.
- **The script's text is in the HTML, never in the payload.**
  `ColorSchemeScript` holds no state and is still `'use client'`: as a
  Server Component the `<script>` it rendered, text and all, went into the
  Flight payload — every page's `.rsc` and the copy inlined in its HTML —
  where a navigation never runs it (measured on k8o.me: +839 bytes on each
  of 306 payloads). As a client component the payload carries its props
  alone, and the server render and hydration each compute the same text
  with `scriptFor`, which is why `scriptFor` has to stay deterministic: a
  text that differs between the two is a hydration mismatch, and React
  replaces the node. `examples/static-basic`'s `build.test.ts` holds the
  payload to it.
- **The server renders the default, and the hydration render writes
  nothing.** No storage and no system to ask on the server, so a `'system'`
  default renders `light`; the first render in the browser reads the
  server's guesses and must not put them on a document the script already
  put right, so the effects wait for the render that reads the store.
  Do not add a cookie or a header to guess earlier.
- **The script is allowed by nonce or by hash, never by being special.**
  `nonce` goes on the script as given; `colorSchemeScriptHash` takes the
  script's props bar `nonce` and hashes `scriptFor` of them, which is
  exactly what React writes between the tags (the colours in a fixed order,
  so the order of `themeColor`'s keys never changes the hash) — the browser
  test renders `ColorSchemeScript` on the server into a document under a
  `<meta>` policy and checks the hash is what lets it run.
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
  scheme.ts       colorSchemeState, pinnedScheme, resolve, themeColorMedia,
                  scriptFor, colorSchemeScriptHash
  script.tsx      ColorSchemeScript ('use client': only its props reach the payload)
  provider.tsx    ColorSchemeProvider + useColorScheme ('use client')
  index.ts
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Browser tests clear localStorage, the class, the theme-color `<meta>`,
  and the state registry between cases; the test browser prefers light,
  which is what "system" resolves to there. A client-only mount
  (`renderHook`) renders no script — React does not execute an inline
  `<script>` it creates, and logs a development error saying so — so the
  class those tests see is the effect's; the script is tested on its own,
  appended to the document, and so are the theme-color `<meta>` a provider
  test needs.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
