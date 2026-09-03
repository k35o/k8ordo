# Agent guide — packages/state

`@k8ordo/state` — declare state by where it lives. `definePageState` holds
the two faces of a history entry (typed URL search params + hidden entry
state) over the Navigation API; `defineLocalState` is localStorage,
`defineMemoryState` a typed shared box. One zod schema per place derives the
server read (`parseUrl`), canonical links (`href`/`search`), stale-data
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
  schemas and pure functions. The live store is created lazily by the first
  `useAppState`, in a registry keyed by `kind + string key` — that is what
  survives HMR and what `resetStateRegistry()` clears for tests. Nothing in
  the package touches `navigation`/`location`/`localStorage` at import time.
- **`update()` applies synchronously and writes in a microtask.** The echo
  makes the next render see the new value; all `update()` calls in one
  handler share one write and one `{committed, finished}` handle. A batch
  that lands back where it started must not write. Routing is by field:
  url+entry changes are one `navigation.navigate()` (atomic), entry-only
  changes are `updateCurrentEntry()` (no navigation), local is one
  `setItem`, memory settles on the spot.
- **Shared ground stays shared.** A page store rewrites only its own URL
  params and only its own namespace in the entry-state object — the rest of
  both travels untouched with every write it makes.
- **Change detection is per key and exact** (`store/core.ts`): notification
  filters on the schema's static key set with `Object.is` (element-wise for
  arrays); unchanged fields keep their object identity across snapshots.
- **Boundary data is input.** URL params, localStorage JSON, and restored
  entry state salvage field-by-field to their own defaults — never a throw,
  never a poisoned sibling. Memory has no schema because its values never
  cross a boundary.
- **No history-API fallback.** Imperative url updates assume an intercepting
  router; links and GET forms are the path that works everywhere. Entry,
  local and memory updates never navigate, so they work under any router.

## Layout

```
src/
  schema/object.ts     StateSchema, absence rule, per-field salvage parse
  url/codec.ts         schema ⇄ URLSearchParams: parse + canonical search
  entry/codec.ts       StoredCodec: read typed stored values (entry, local)
  page-state.ts        definePageState(); slot disjointness; internals WeakMap
  local-state.ts       defineLocalState()
  memory-state.ts      defineMemoryState() — no schema by design
  store/core.ts        snapshot core: key-diff notify, picks, update handles
  store/registry.ts    kind+key-keyed store registry + resetStateRegistry()
  store/page-store.ts  Navigation API wiring, batching, atomic two-face flush
  store/local-store.ts localStorage wiring, storage-event cross-tab sync
  store/memory-store.ts
  use-app-state.ts     the client hook ('use client'); dispatch on def.kind
  register.ts          Register interface for typed-route path constraint
```

## Where zod's public API runs out

Wrapper peeling (`default`, `optional`, `catch`, pipes) reads `_zod.def` to
decide whether a url field takes one param value or `getAll` — same coupling
and same justification as `@k8ordo/form`'s walk. Everything else goes through
`safeParse` from `zod/v4/core`, which is why `zod` and `zod/mini` both work.

## Conventions

- `type`, not `interface` — except `Register`, which must merge.
- Browser tests play the router themselves: a `navigate` listener that calls
  `event.intercept()`. Without it, `navigation.navigate()` in the test iframe
  would be a cross-document load and kill the runner.
- The `storage` event fires only in other tabs; tests simulate a foreign
  tab's write with `setItem` + a dispatched `StorageEvent`.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
