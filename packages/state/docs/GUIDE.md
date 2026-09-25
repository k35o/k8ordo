# @k8ordo/state

Declare state by where it lives. A definition names a place — the URL, the
history entry, localStorage, memory — and one zod schema per boundary place
(URL, entry, localStorage) derives everything else: the server-side read,
canonical link building, salvage of stale data, and a client subscription
with exact per-key change detection. Memory never crosses a boundary, so it
is a typed box with no schema.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks. The Navigation API reached Baseline in January 2026; this package
treats it as simply present.

## The four places

| definition                  | lives in            | survives              | shared with           | server                                    |
| --------------------------- | ------------------- | --------------------- | --------------------- | ----------------------------------------- |
| `definePageState` — `url`   | searchParams        | back/forward, sharing | anyone given the URL  | reads, where the router passes the search |
| `definePageState` — `entry` | history entry state | back/forward, reload  | that tab's entry      | —                                         |
| `defineLocalState`          | localStorage        | until deleted         | every tab, one device | —                                         |
| `defineMemoryState`         | the JS runtime      | until reload          | that tab              | —                                         |

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
    inStock: z._default(z.stringbool(), false),
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
identity: the localStorage key (`k8ordo-state:<key>`, exposed as the
definition's `storageKey`), the entry-state namespace, and the store-registry
slot. Renaming it renames the data — and
the key must be app-unique per kind: two definitions of the same kind sharing
a key silently share one store (and, for local, one storage row). The module
system cannot enforce this, so treat the key like a global name.

**A boundary schema must read back what it writes.** `update()` runs the
merged values through the schema before anything is written, and a field that
fails there lands on its default instead of the value you wrote. A url value
is written into a query string and read again — the road a visitor's URL
takes — so a url field must read back its own query-string spelling. A boolean
is written in its schema's own spelling — `"true"`, or the first of a
`z.stringbool()`'s `truthy` — which is what lets `z.stringbool()` turn it back
into `true`. Two spellings that cannot are refused at module load rather than
at the first click:

| written                                                              | use instead      |
| -------------------------------------------------------------------- | ---------------- |
| `z.boolean()` / `z.coerce.boolean()` in `url`                        | `z.stringbool()` |
| a `url` array that is `.optional()` or defaults to anything but `[]` | `.default([])`   |

A URL carries strings, and `"false"` is not `false` to a boolean schema; an
absent param and an empty list are the same URL, so an array whose default is
not `[]` — non-empty, or `undefined` from `.optional()` — could never write
`[]`. The same rule holds for values a URL cannot spell at all: a `z.date()`
url field is refused the moment something writes one, naming the field.

Entry and local values are handed back to the schema as the typed values they
are, so there the schema must accept its own output: a `z.stringbool()` or a
type-changing transform never survives a write — use `z.boolean()` and plain
types. `update()` does not round-trip
localStorage's JSON, so keep local fields to what JSON represents: a
`z.date()` shows its `Date` after the write and falls back to its default on
the next load.

## zod, or zod/mini

Parsing runs on zod's shared core, so a schema written with either entry
works. Unlike `@k8ordo/form` — where the schema stays on the server — the
client here parses and serializes with the schema itself, so the schema module
ships to the browser. Reach for `zod/mini` (a typical definition module
bundles to about a third of classic `zod`'s gzipped size) unless the app
already pays for classic `zod` elsewhere.

## The shape of it

```
shared    definePageState / defineLocalState / defineMemoryState     no 'use client'
            ↓ import                              ↓ import
server    listState.parseUrl(searchParams)     client    useAppState(def, ['q', 'page'])
          listState.href('/products', {...})             → [state, update]
          RSC, Server Action
```

A definition is pure data — schemas (or a memory state's initial values) and
pure functions. No store lives inside it, so a Server Component imports it
without creating server-side mutable state. The live store exists only in
the browser, created lazily by the first `useAppState`, keyed by the
definition's string key (which is what lets state survive HMR re-evaluation
of the definition module). There is no Provider: the stores mirror
browser-wide singletons — the URL, the history entry, localStorage — so there
is nothing to scope.

## Server — read, and build links

`parseUrl` reads the url slot wherever a router hands a page its search — for
example Next.js:

```tsx
export default async function Page({ searchParams }: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams);
  //    ^ { q: string; page: number; inStock: boolean } — typed, defaults applied

  const products = await fetchProducts(url);
  return (
    <>
      <Filters initialUrl={url} />
      <ProductList products={products} />
      <a href={listState.href('/products', { ...url, page: url.page + 1 })}>
        next
      </a>
    </>
  );
}
```

**Under `@k8ordo/static` and `@k8ordo/server` a page never sees the search.**
Those pages receive `params` and `pathname` (and, under `@k8ordo/server`, a
`request` of headers and cookies) — never the search: the pathname axis is the
router's, and the search is read in the browser by `useAppState`. The server
render therefore shows the url slot's defaults and the live URL takes over one
render after hydration. That is not a gap to route around: the router
intercepts a same-pathname navigation without loading anything, so a server
render keyed on the search would be right on the first load and stale after
the first `update()`. Building links is unaffected — `href` and `search` are
pure and run anywhere, including in a Server Component.

`href` and `search` are pure: unspecified fields mean their default, and
default values are omitted from the query, so every link is canonical and as
short as it can be. `search` returns the query string alone (no `?`) when the
path should stay in the caller's hands.

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
definition's two slots — moving a field between `url` and `entry` changes the
definition and nothing at the call sites. The field's spelling follows its
slot, though: `z.stringbool()` in `url` is `z.boolean()` in `entry`.

## Updates

`update()` applies synchronously — the next render sees the new value — and
returns the Navigation API's own shape, an object holding two promises:

```ts
const { committed, finished } = update({ page: 2 });
// committed: the write is in its home
// finished:  whatever the router did after the write is done
```

Ignoring the handle is the normal case and trips no floating-promise lint.
Code that has to wait for the write awaits `finished`:

```tsx
const onNext = async () => {
  await update({ page: 2 }).finished;
  heading.current?.focus();
};
```

An async action — `startTransition(async …)`, `useTransition`'s included, or
`@k8ordo/ui`'s `Button` `onAction` — can await it the same way. Under
`@k8ordo/router` a url update issued while another page is still loading is a
page change, and a page change never joins the action, so `finished` settles
once that page is on screen rather than waiting for the action to end.

A navigation overtaken by a later one — another page state's write from the
same handler, say — rejects the handle with an `AbortError`; unawaited calls
never surface it. Updates with no navigation behind them return the same
shape: entry-only, local and no-change page handles settle once the batch is
flushed, memory handles on the spot. A local write the storage refuses —
quota, say — rejects the handle with that error while the rendered value
stays.

- **Patches are validated on the spot.** The merged state goes through the
  schema inside `update()` itself, url fields by the road a URL arrival
  takes: `update({ page: 0 })` on a `min(1)` field lands on the default
  exactly as `?page=0` would, and the echo never shows a value the schema
  rejects. A value the URL cannot carry is refused there and then, before
  anything is written — the call throws rather than rejecting a handle nobody
  awaits.
- **Routing is by what changed.** One patch may span both faces of a page
  state: a batch that changes a url field travels, with any entry changes, in
  a single `navigation.navigate()`, atomically. A batch that changes entry
  values but no url value uses `updateCurrentEntry()` — no navigation, works
  under any router — even when the patch names url fields.
- **`replace` by default.** An update refines the current entry. Pass
  `{ history: 'push' }` only for updates the back button should undo — the
  option exists only on page state, the one kind with a navigation behind it,
  and takes effect only when a url value changes: an entry-only write
  rewrites the current entry in place.
- **One handler, one write.** Several `update()` calls on a page or local
  state made synchronously in one event handler collapse into a single write
  — one navigation, entry update or storage write — and share one handle; an
  `await` between two calls starts a new batch with its own write and handle.
  For page state, a batch that ends where it started neither navigates nor
  touches the entry; local state still writes its row (creating one if none
  was stored). Memory has nothing to batch: each call applies on the spot and
  returns its own settled handle.
- **Functional form.** `update((current) => ({ page: current.page + 1 }))`
  reads the batched state, not the committed one.
- **Shared ground stays shared.** A page state rewrites only its own params
  in the URL and only its own namespace in the entry state; params and state
  owned by other definitions — or by nobody — survive every write.

## Subscription granularity

The definition fixes the key set — its schemas' keys, or a memory state's
initial values — so change detection is exact, per key:

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

Two operations depend on the router; everything else works under any router:

| operation                                              | needs                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `href` / `search` links, GET forms                     | nothing — the router or the browser handles the click or the submission |
| updates that change only entry, local or memory values | nothing — no navigation is involved                                     |
| url `update()` on the client                           | a router that intercepts the Navigation API                             |
| `parseUrl` on the server                               | a router that hands the page its search                                 |

A url `update()` calls `navigation.navigate()`. Under `@k8ordo/router` —
including a page rendered by `@k8ordo/static` or `@k8ordo/server` — a
navigation that keeps the pathname is a state change and not a page change:
the router intercepts it without a load, nothing remounts, and scroll and
focus stay where they are. `finished` therefore resolves once that navigation
settles, with no fetch or render behind it, since `update()` already rendered
the new values. On a router that does not intercept the Navigation API
(Next.js today), the same call is a full document load: use links and GET
forms for url changes there, which is this package's preferred grain anyway.
There is deliberately no history-API fallback.

Keystrokes do not belong in the URL. Let the DOM or local React state hold
the draft and call `update()` at commit points — submit, blur, pagination —
the same division `@k8ordo/form` draws.

## Typed routes

`href` keeps the path literal alive in the type
(``'/products' | `/products?${string}` ``), which is what typed-route checks
strip a query from and verify. To constrain paths app-wide, augment `Register`
once, with the same line the `@k8ordo/router` augmentation takes:

```ts
// e.g. types/k8ordo.d.ts
import type { routes } from '../routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}

declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}
```

`href` then accepts exactly the table's linkable paths — a `:param` becomes
`${string}`, a `*` wildcard is matched but never linked — derived through
`RouteOf` from `@k8ordo/router` as a type only, so the router stays an
optional peer and never loads at runtime. Under `@k8ordo/static` or
`@k8ordo/server` this is generated for you into `.k8ordo/register.gen.ts` from
`routes/` when the application's own `package.json` lists `@k8ordo/state` in
`dependencies` or `devDependencies` — a transitive dependency does not count.
Do not hand-write it in such an application: it would duplicate the generated
declaration.

A router that is not `@k8ordo/router` has no table to hand over; register its
path union directly under `path` — `Route` from `next`, for instance:

```ts
// e.g. types/k8ordo-state.d.ts
import type { Route } from 'next';

declare module '@k8ordo/state' {
  interface Register {
    path: Route;
  }
}
```

When both are present, `routes` wins. Every `href` in the app now rejects a
path its router does not know. Without the augmentation the constraint is any
`/`-prefixed string. Augment only in an application — a shared library
augmenting `Register` leaks the constraint to every consumer.

## Reading before hydration

Some state has to be applied before the first paint: a theme class on
`<html>`, say, or a colour scheme the browser must not flash the default of.
`useAppState` runs after hydration, which is too late for that, and the
alternative — an inline script with the storage key and the JSON envelope
hard-coded in a string — drifts the moment either changes.

A local definition carries both halves: `storageKey` is the key the store
writes under, and `inlineRead()` returns a JavaScript _expression_ for an
inline `<script>` that evaluates, in the browser, to the stored object — or
`null` when nothing is stored, the JSON is corrupt, the value is not an object,
or storage cannot be read. The key is escaped for a script context, so any
key is safe to emit.

```tsx
<script>{`const s = ${themeState.inlineRead()}; if (s && s.mode === 'dark') document.documentElement.classList.add('dark');`}</script>
```

The schema does not run there — no module has loaded yet — so what comes back
is the raw row, not the salvaged state `useAppState` will show. Treat it as
untrusted: read only the fields you need, each with its own fallback, and let
the hydrated store be the source of truth from then on. The script changes
`<html>` before React hydrates it, so render that element with
`suppressHydrationWarning`.

## What it guarantees

**Boundary data is input, not trusted state.** A URL param a user edited, a
localStorage row an older schema wrote, a restored entry state — anything the
schema rejects falls back to that field's own default, field by field, and a
combination an object-level `refine` forbids falls back to the defaults as a
whole. One broken value does not take the rest down, and nothing throws at
read time. An array field collects repeated params and is salvaged as one
field: one rejected element resets the whole array to `[]`. A repeated param
on a scalar field takes the first value.

**Canonical URLs.** Serialization omits every field sitting at its default, so
the same state always produces the same, shortest URL — links, bookmarks and
caches agree.

**Back means back.** Both faces of a page state live on the history entry via
the platform, not in a parallel store, so back/forward restore them together
with no library bookkeeping.

**Tabs agree.** localStorage state propagates across tabs through the
`storage` event; the same keyed subscription granularity applies.

**SSR sees real url values when your router hands you the search.** Pass the
RSC-parsed url as `initialUrl` and the server render and the hydration render
show the actual URL state. Where a page receives no search — `@k8ordo/static`
and `@k8ordo/server` — the url slot renders its defaults and the live URL
takes over on hydration. Everything else — entry, local, memory — renders its
defaults on the server by construction: those places do not exist there.

## GET forms with @k8ordo/form

A search or filter form is a GET form, and its constraints and its URL state
are the same schema:

```tsx
import { formFields } from '@k8ordo/form/server';

const filterFields = formFields(listState.url); // one schema, both jobs
```

A `z.stringbool()` field derives a checkbox whose `value` is the same spelling
of `true` that `update()` writes, so a checked box submits `inStock=true` —
the URL state itself would write. The form submits as GET, which writes the
URL with or without JavaScript.
Where the router hands the page its search, the RSC reads it back with
`parseUrl` and the whole loop works before JavaScript loads; under
`@k8ordo/static` and `@k8ordo/server` the server render shows the defaults,
and the submitted values appear once the page hydrates.

## Testing

`resetStateRegistry()` clears the provider-less store registry between tests.
Unmount components first — mounted hooks keep their store through closures.
When testing url updates, intercept the `navigate` event in the test itself
(as a router would); an unintercepted `navigation.navigate()` is a
cross-document load.
