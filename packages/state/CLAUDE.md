# Agent guide — packages/state

`@k8ordo/state` — declare state by where it lives. One zod schema defines a
page's URL search params; the package derives the server read (`parseUrl`),
canonical links (`href`/`search`), and the client subscription
(`useAppState`) over the Navigation API. The shared discipline (React 19 /
RSC assumed, Baseline newly available only, no polyfills) and how a new
package joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (codec, node) + browser (hook, chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **The definition is pure; the store is browser-only.** `definePageState`
  returns schemas and pure functions. The live store is created lazily by the
  first `useAppState`, in a registry keyed by the definition's _string key_ —
  that is what survives HMR and what `resetStateRegistry()` clears for tests.
  Nothing in the package touches `navigation`/`location` at import time.
- **`update()` applies synchronously and navigates in a microtask.** The echo
  makes the next render see the new value; all `update()` calls in one
  handler share one `navigation.navigate()` and one `{committed, finished}`
  handle. A batch that lands back where it started must not navigate.
- **The URL is shared ground.** Flush rewrites only the keys this definition
  declares; foreign params (other page states, tracking) survive untouched.
- **Change detection is per key and exact.** Notification filters on the
  schema's static key set with `Object.is` (element-wise for arrays);
  unchanged fields keep their object identity across snapshots.
- **The URL is input.** A param that fails the schema falls back to that
  field's default (per-field salvage), never throws, never poisons siblings.
- **No history-API fallback.** Imperative updates assume an intercepting
  router; links and GET forms are the path that works everywhere.

## Layout

```
src/
  url/codec.ts        schema ⇄ URLSearchParams: parse+salvage, canonical search
  page-state.ts       definePageState(); codec reachable via WeakMap, not API
  store/registry.ts   string-keyed store registry + resetStateRegistry()
  store/page-store.ts snapshots, key-diff notify, batching, update handles
  use-app-state.ts    the client hook ('use client'); overloads for keys
  register.ts         Register interface for typed-route path constraint
```

## Where zod's public API runs out

Wrapper peeling (`default`, `optional`, `catch`, pipes) reads `_zod.def` to
decide whether a field takes one param value or `getAll` — same coupling and
same justification as `@k8ordo/form`'s walk. Everything else goes through
`safeParse` from `zod/v4/core`, which is why `zod` and `zod/mini` both work.

## Conventions

- `type`, not `interface` — except `Register`, which must merge.
- Browser tests play the router themselves: a `navigate` listener that calls
  `event.intercept()`. Without it, `navigation.navigate()` in the test iframe
  would be a cross-document load and kill the runner.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
