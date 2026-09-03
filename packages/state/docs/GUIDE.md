# @k8ordo/state

Declare state by where it lives. A definition names a place — the URL, the
history entry, localStorage, memory — and one zod schema per place derives
everything else: the server-side read, canonical link building, salvage of
stale data, and a client subscription with exact per-key change detection.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks. The Navigation API reached Baseline in January 2026; this package
treats it as simply present.

## The four places

| definition                  | lives in            | survives              | shared with           | server |
| --------------------------- | ------------------- | --------------------- | --------------------- | ------ |
| `definePageState` — `url`   | searchParams        | back/forward, sharing | anyone given the URL  | reads  |
| `definePageState` — `entry` | history entry state | back/forward, reload  | that tab's entry      | —      |
| `defineLocalState`          | localStorage        | until deleted         | every tab, one device | —      |
| `defineMemoryState`         | the JS runtime      | until reload          | that tab              | —      |

`url` and `entry` are the two faces of one history entry — one visible and
shareable, one hidden — which is why they share a definition and update
atomically. localStorage and memory are app-scope, not page-scope, which is
why they are their own kinds: the grouping difference is real, so the API
makes it visible.

```ts
import {
  defineLocalState,
  defineMemoryState,
  definePageState,
} from '@k8ordo/state';
import * as z from 'zod/mini';

// Page state: colocate with the feature that owns it.
export const listState = definePageState('product-list', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
  }),
});

// App state: lives in a shared module.
export const prefs = defineLocalState(
  'prefs',
  z.object({ view: z._default(z.enum(['grid', 'table']), 'grid') }),
);

// A typed shared box. No schema: these values never cross a boundary,
// so there is nothing to re-validate — the typed update is the only writer.
// Treat the values as immutable: replace fields through update(); a nested
// reference mutated in place bypasses change detection.
export const debugPanel = defineMemoryState('debug-panel', { open: false });
```

Schemas appear exactly where data comes back across a boundary — URL strings
a user can edit, localStorage JSON an older schema wrote, entry state a
session restore revived — and every such field must tolerate absence:
`.default()` (`z._default()` in mini) or `.optional()`. Definitions throw at
module load naming the fields that do not. The first argument is the state's
identity: the localStorage key (`k8ordo-state:<key>`), the entry-state
namespace, and the store-registry slot. Renaming it renames the data — and
the key must be app-unique per kind: two definitions of the same kind sharing
a key silently share one store (and, for local, one storage row). The module
system cannot enforce this, so treat the key like a global name.

## zod, or zod/mini

Parsing runs on zod's shared core, so a schema written with either entry
works. Unlike `@k8ordo/form` — where the schema stays on the server — the
client here parses and serializes with the schema itself, so the schema module
ships to the browser. Reach for `zod/mini` (10 kB gzipped vs 63 kB) unless the
app already pays for classic `zod` elsewhere.

## The shape of it

```
shared    definePageState / defineLocalState / defineMemoryState     no 'use client'
            ↓ import                              ↓ import
server    listState.parseUrl(searchParams)     client    useAppState(def, ['q', 'page'])
          listState.href('/products', {...})             → [state, update]
          RSC, Server Action
```

A definition is pure data — schemas and pure functions. No store lives inside
it, so a Server Component imports it without creating server-side mutable
state. The live store exists only in the browser, created lazily by the first
`useAppState`, keyed by the definition's string key (which is what lets state
survive HMR re-evaluation of the definition module). There is no Provider:
the stores mirror browser-wide singletons — the URL, the history entry,
localStorage — so there is nothing to scope.

## Server — read, and build links

```tsx
export default async function Page({ searchParams }: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams);
  //    ^ { q: string; page: number } — typed, defaults applied

  const products = await fetchProducts(url);
  return (
    <>
      <Filters initialUrl={url} />
      <ProductList products={products} />
      <Link href={listState.href('/products', { ...url, page: url.page + 1 })}>
        next
      </Link>
    </>
  );
}
```

`href` and `search` are pure: unspecified fields mean their default, and
default values are omitted from the query, so every link is canonical and as
short as it can be. `search` returns the query string alone (no `?`) when the
path should stay in the caller's hands. Only the url slot exists on the
server; entry, local and memory state render as their defaults there.

## Client — subscribe and update

```tsx
'use client';
import { useAppState } from '@k8ordo/state';
import { listState, prefs } from './state';

export function Filters({ initialUrl }: FiltersProps) {
  const [{ q, page, expanded }, update] = useAppState(listState, {
    initialUrl,
  });
  const [{ view }, updatePrefs] = useAppState(prefs, ['view']);

  return (
    <>
      <p>{q === '' ? 'all products' : `searching “${q}”`}</p>
      <button
        type="button"
        onClick={() => update({ page: page + 1 }, { history: 'push' })}
      >
        next page
      </button>
      <button type="button" onClick={() => updatePrefs({ view: 'table' })}>
        table view
      </button>
    </>
  );
}
```

The hook is the same for every kind. State is the flat merge of a page
definition's two slots — moving a field between `url` and `entry` is a
one-line change in the definition and no change at the call sites.

## Updates

`update()` applies synchronously — the next render sees the new value — and
returns the Navigation API's own shape, an object holding two promises:

```ts
const { committed, finished } = update({ page: 2 });
// committed: the write is in its home
// finished:  the router's intercept work (fetch, render) is done
```

Ignoring the handle is the normal case and trips no floating-promise lint.
Awaiting `finished` composes with React 19 async transitions:

```tsx
const [isPending, startTransition] = useTransition();
startTransition(async () => {
  await update({ page: 2 }).finished;
});
```

A superseded navigation (the user clicked again) rejects the handle with an
`AbortError`; unawaited calls never surface it. Updates with no navigation
behind them — entry-only, local, memory — return the same shape, settled.

- **Patches are validated on the spot.** The merged state passes the schema
  inside `update()` itself, with the same salvage as a URL arrival:
  `update({ page: 0 })` on a `min(1)` field lands on the default exactly as
  `?page=0` would, and the echo never shows a value the schema rejects.
- **Routing is by field.** One patch may span both faces of a page state:
  url + entry changes travel in a single `navigation.navigate()`, atomically.
  A patch touching only entry fields uses `updateCurrentEntry()` — no
  navigation, works under any router.
- **`replace` by default.** An update refines the current entry. Pass
  `{ history: 'push' }` only for updates the back button should undo — the
  option exists only on page state, the one kind with a navigation behind it.
- **One handler, one write.** Several `update()` calls in the same event
  handler collapse into a single navigation (or storage write); they share
  one handle. A batch that ends where it started does not write at all.
- **Functional form.** `update((current) => ({ page: current.page + 1 }))`
  reads the batched state, not the committed one.
- **Shared ground stays shared.** A page state rewrites only its own params
  in the URL and only its own namespace in the entry state; params and state
  owned by other definitions — or by nobody — survive every write.

## Subscription granularity

The schema fixes the key set, so change detection is exact, per key:

```tsx
useAppState(listState); // any declared field re-renders this
useAppState(listState, ['q']); // only q changes re-render this
useAppState(listState, []); // write-only: subscribe to nothing
```

A `page` change never re-renders a `['q']` subscriber. Inline key arrays are
normalized internally — no `useMemo` at the call site. When two pieces of
state update at very different rates, give them separate definitions; the
definition is the subscription boundary.

## Routers

Everything except one operation works under any router:

| operation                          | needs                                       |
| ---------------------------------- | ------------------------------------------- |
| `parseUrl` on the server           | nothing                                     |
| `href` / `search` links, GET forms | nothing — the router handles the click      |
| entry / local / memory updates     | nothing — no navigation is involved         |
| url `update()` on the client       | a router that intercepts the Navigation API |

A url `update()` calls `navigation.navigate()`. On a router that intercepts
the `navigate` event, that is a same-document update flowing through the
router's own pipeline — transitions, scroll handling and all. On a router
that does not (Next.js today), it is a full document load: use links and GET
forms for url changes there, which is this package's preferred grain anyway.
There is deliberately no history-API fallback.

Keystrokes do not belong in the URL. Let the DOM or local React state hold
the draft and call `update()` at commit points — submit, blur, pagination —
the same division `@k8ordo/form` draws.

## Typed routes

`href` keeps the path literal alive in the type
(`'/products' | `/products?${string}``), which is what typed-route checks
strip a query from and verify. To constrain paths app-wide, augment `Register`
once:

```ts
// e.g. types/k8ordo-state.d.ts
import type { Route } from 'next';

declare module '@k8ordo/state' {
  interface Register {
    path: Route;
  }
}
```

Every `href` in the app now rejects a path its router does not know. Without
the augmentation the constraint is any `/`-prefixed string. Augment only in an
application — a shared library augmenting `Register` leaks the constraint to
every consumer.

## What it guarantees

**Boundary data is input, not trusted state.** A URL param a user edited, a
localStorage row an older schema wrote, a restored entry state — anything the
schema rejects falls back to that field's own default, field by field, and a
combination an object-level `refine` forbids falls back to the defaults as a
whole. One broken value never takes the rest down, and nothing throws at read
time. An array field collects repeated params; a repeated param on a scalar
field takes the first value.

**Canonical URLs.** Serialization omits every field sitting at its default, so
the same state always produces the same, shortest URL — links, bookmarks and
caches agree.

**Back means back.** Both faces of a page state live on the history entry via
the platform, not in a parallel store, so back/forward restore them together
with no library bookkeeping.

**Tabs agree.** localStorage state propagates across tabs through the
`storage` event; the same keyed subscription granularity applies.

**SSR sees real url values when you hand them over.** Pass the RSC-parsed url
as `initialUrl` and the server render and hydration render show the actual
URL state. Everything else — entry, local, memory — renders its defaults on
the server by construction: those places do not exist there.

## GET forms with @k8ordo/form

A search or filter form is a GET form, and its constraints and its URL state
are the same schema:

```tsx
import { formFields } from '@k8ordo/form/server';

const filterFields = formFields(listState.url); // one schema, both jobs
```

The form submits as GET, the RSC reads it back with `parseUrl`, and the whole
loop works before JavaScript loads.

## Testing

`resetStateRegistry()` clears the provider-less store registry between tests.
Unmount components first — mounted hooks keep their store through closures.
When testing url updates, intercept the `navigate` event in the test itself
(as a router would); an unintercepted `navigation.navigate()` is a
cross-document load.
