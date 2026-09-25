# Agent guide — packages/state

`@k8ordo/state` — declare state by where it lives. `definePageState` holds
the two faces of a history entry (typed URL search params + hidden entry
state) over the Navigation API; `defineLocalState` is localStorage,
`defineCookieState` a cookie the browser writes and the server reads,
`defineMemoryState` a typed shared box with no schema. One zod schema per
boundary place (url, entry, local, cookie) derives the server read
(`parseUrl`, `parseCookies`), canonical links (`href`/`search`), stale-data
salvage, and the client subscription (`useAppState`). The shared discipline
(React 19 / RSC assumed, Baseline newly available only, no polyfills) and how
a new package joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (codecs, node) + browser (hook + stores, chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **Definitions are pure; stores are browser-only.** A definition holds
  schemas (a memory definition: its initial values) and pure functions. The
  live store is created lazily by the first `useAppState`, in a registry keyed
  by `kind + string key` — that is what survives HMR and what
  `resetStateRegistry()` clears for tests. Nothing in the package touches
  `navigation`/`location`/`localStorage`/`document.cookie`/`cookieStore` at
  import time.
- **`update()` applies synchronously and writes in a microtask.** The echo is
  canonical — the merged state passes the schema inside `update()` with the
  same salvage an arrival gets, so no render ever shows a value the schema
  rejects. On page, local and cookie state, all `update()` calls made
  synchronously in one handler share one write and one `{committed, finished}`
  handle (an `await` between calls starts a new batch). A page batch that
  lands back where it started must not navigate or touch the entry; local and
  cookie have no such check and rewrite their row. Routing is by what
  changed, compared on live values: url+entry changes are one
  `navigation.navigate()` (atomic), entry-only changes are
  `updateCurrentEntry()` (no navigation, so `history: 'push'` has no effect),
  local is one `setItem`, cookie one `cookieStore.set()` whose promise settles
  the handle. Memory has neither schema nor write to batch: each call swaps
  the snapshot and returns its own handle, settled on the spot.
- **A pending batch survives concurrent events.** `sync`/`onStorage` overlay
  the unflushed patch on the fresh platform values, and `flush` rebuilds its
  target from live values + patch — never from the snapshot. Without both, a
  neighbouring store's synchronous `currententrychange` (from
  `updateCurrentEntry`) rolls the batch back and the write is silently lost;
  the "combo" browser test is the regression guard. Cookie writes are
  asynchronous, which adds two rules to the cookie store. Its writes run one
  at a time, each building its target from the cookie after the previous one
  landed — otherwise a second batch reads the cookie before the first
  batch's write is in it and overwrites that batch's fields with stale
  values. And it holds off re-reading while any of its writes is queued or in
  flight: a `change` arriving then shows a value older than the echo, and
  reading it would flash the echo back. The last write to settle re-reads (a
  refused one only if a change was skipped meanwhile, so a refusal otherwise
  keeps the echo, as local does).
- **Shared ground stays shared.** A page store rewrites only its own URL
  params and only its own namespace in the entry-state object — the rest of
  both travels untouched with every write it makes.
- **Change detection is per key and exact** (`store/core.ts`): notification
  filters on the definition's static key set (the schema's, or memory's
  initial values) with `sameValue` — `Object.is`, recursing structurally into
  arrays and plain objects (anything else — Date, Map, class instances —
  compares by reference); unchanged fields keep their object identity across
  snapshots.
- **Boundary data is input.** URL params, localStorage and cookie JSON, and
  restored entry state salvage field-by-field to their own defaults — never a
  throw, never a poisoned sibling. Memory has no schema because its values never cross a boundary.
- **A url value is canonicalized by the road it comes back on.** The url
  codec's `salvage` is `parse(new URLSearchParams(search(values)))`, not a
  parse of the typed values: a one-way spelling (`z.stringbool()`'s
  `string → boolean`) must never see its own output, or `update()` lands on
  the default. Two spellings the round trip cannot hold are refused when the
  codec is built — a url array whose default is not `[]` (absence and an
  empty list are the same URL) and any boolean that is not `z.stringbool()`
  (`"false"` is truthy to `z.coerce.boolean()`). A value with no URL spelling
  at all throws out of `update()` before the batch is touched, since a
  rejected handle is invisible to the fire-and-forget caller that is the
  normal case. Entry, local and cookie `salvage` hand the typed values
  straight to the schema — no structured clone, no JSON — so those schemas
  must accept their own output, and a local or cookie value JSON cannot hold
  (a Date) survives the echo and is lost on the next load.
- **A link carries Vite's base; a path does not.** `href(path)` takes a
  path in the route table's terms and puts `import.meta.env.BASE_URL` in
  front (`base.ts`, the router's `withBase` rule re-spelled, since the router
  is a type-only peer here). The type stays the path given, which is what
  typed-route checks read. Outside Vite `import.meta.env` is undefined
  despite its type, and nothing is added.
- **No history-API fallback.** Imperative url updates assume an intercepting
  router; links and GET forms are the path that works everywhere. Updates
  that change only entry, local, cookie or memory values never navigate, so
  they work under any router.
- **A cookie state is a preference, never a secret.** The browser writes it,
  so it cannot be `HttpOnly`; the server reads it as input through the
  schema. It is written `Path=/; SameSite=Lax; Max-Age=400 days` (the API adds
  `Secure`): `Lax` because the API's default `Strict` drops the cookie from
  the first request arriving from another site, which is exactly where the
  server render would otherwise show the defaults. Reads go through
  `document.cookie` — `useSyncExternalStore` needs a synchronous snapshot and
  `cookieStore.get()` is a promise; writes and cross-tab sync go through the
  Cookie Store API.

## Layout

```
src/
  schema/object.ts     StateSchema, absence rule, per-field salvage parse
  url/codec.ts         schema ⇄ URLSearchParams: parse + canonical search
  entry/codec.ts       StoredCodec: read typed stored values (entry, local, cookie)
  page-state.ts        definePageState(); slot disjointness; internals WeakMap
  base.ts              withBase: Vite's base in front of a link
  local-state.ts       defineLocalState()
  cookie-state.ts      defineCookieState(); cookie name, value encoding, parseCookies
  memory-state.ts      defineMemoryState() — no schema by design
  store/core.ts        snapshot core: key-diff notify, picks, update handles
  store/registry.ts    kind+key-keyed store registry + resetStateRegistry()
  store/page-store.ts  Navigation API wiring, batching, atomic two-face flush
  store/local-store.ts localStorage wiring, storage-event cross-tab sync
  store/cookie-store.ts Cookie Store API wiring, change-event sync, in-flight guard
  store/memory-store.ts
  use-app-state.ts     the client hook ('use client'); dispatch on def.kind
  register.ts          Register interface for typed-route path constraint;
                       AcceptedPath checks a path (routes → path → any)
```

## Where zod's public API runs out

Wrapper peeling (`default`, `optional`, `catch`, pipes) reads `_zod.def` to
decide whether a url field takes one param value or `getAll` — same coupling
and same justification as `@k8ordo/form`'s walk. Everything else goes through
the public core: `safeParse`, and `safeEncode` from `zod/v4/core` for a url
boolean, which is written in its schema's own spelling (a custom
`z.stringbool({ truthy: ['yes'] })` cannot read back `String(true)`). That is
why `zod` and `zod/mini` both work, and why `@k8ordo/form`'s checkbox for the
same field submits the same string.

## Conventions

- `type`, not `interface` — except `Register`, which must merge. It takes
  the router's own line, `{ routes: typeof routes }`, and checks each path
  `href` is handed through `NavigablePath` from `@k8ordo/router` — a
  type-only import, so the router is an optional peer that never loads at
  runtime. `href` infers the path from the argument and checks that, never
  a union of every path the table has. The older
  `{ path: P }` form stays accepted (other routers, and what the framework's
  generator emitted before `routes`); `routes` wins when both are present.
- **A local definition owns its storage key.** `storageKey` on the
  definition is the one place `k8ordo-state:<key>` is spelled — the store
  reads it from there — and `inlineRead()` renders the pre-hydration read as
  a self-contained expression so an app never hand-writes the key or the
  JSON envelope into an inline script. The schema cannot run there, which is
  why it returns the raw object or `null` and the GUIDE calls it untrusted.
  A cookie definition likewise owns `cookieName` (`k8ordo-state.<key>` — `.`,
  not `:`, because a cookie name is an HTTP token, and a key that would break
  the token is refused at define time) and `cookieValue()`, the
  percent-encoded JSON a server writes when it sets the same cookie.
- Duplicate definition keys within a kind are NOT detected at runtime: an
  HMR re-evaluation legitimately re-registers the same key, so a warning
  would cry wolf on every edit. The GUIDE tells users to treat keys as
  global names; revisit only with a schema-fingerprint comparison.
- Browser tests play the router themselves: a `navigate` listener that calls
  `event.intercept()`. Without it, `navigation.navigate()` in the test iframe
  would be a cross-document load and kill the runner.
- The `storage` event fires only in other tabs; tests simulate a foreign
  tab's write with `setItem` + a dispatched `StorageEvent`. The cookie
  `change` event fires in this tab too, so a test's own `cookieStore.set()`
  is the foreign write. Tests that need a write held in flight spy on
  `CookieStore.prototype.set`.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
