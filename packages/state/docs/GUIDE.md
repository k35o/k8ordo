# @k8ordo/state

Declare state by where it lives. One zod schema defines a page's URL search
params once, and from it the package derives the server-side read, canonical
link building, and a client subscription that rides the Navigation API.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks. The Navigation API reached Baseline in January 2026; this package
treats it as simply present.

## zod, or zod/mini

The parsing runs on zod's shared core, so a schema written with either entry
works. Unlike `@k8ordo/form` — where the schema stays on the server — the
client here parses and serializes with the schema itself, so the schema module
ships to the browser. Reach for `zod/mini` (10 kB gzipped vs 63 kB) unless the
app already pays for classic `zod` elsewhere.

## The shape of it

```
shared    definePageState('product-list', { url: schema })     one module, no 'use client'
            ↓ import                              ↓ import
server    listState.parseUrl(searchParams)     client    useAppState(listState, ['q', 'page'])
          listState.href('/products', {...})             → [state, update]
          RSC, Server Action                             over the Navigation API
```

The definition is pure data — schemas and pure functions. No store lives
inside it, so a Server Component imports it without creating server-side
mutable state. The live store exists only in the browser, created lazily by
the first `useAppState`, keyed by the definition's string key (which is what
lets state survive HMR re-evaluation of the definition module).

## Writing a page state

```ts
// state/product-list.ts — imported by server and client alike
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const listState = definePageState('product-list', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    tags: z._default(z.array(z.string()), []),
  }),
});
```

Every url field must tolerate absence — a URL param can always be missing —
so each field needs `.default()` (`z._default()` in mini) or `.optional()`.
`definePageState` throws at module load naming the fields that do not.

**Server** — read, and build links:

```tsx
export default async function Page({ searchParams }: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams);
  //    ^ { q: string; page: number; tags: string[] } — typed, defaults applied

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
path should stay in the caller's hands.

**Client** — subscribe and update:

```tsx
'use client';
import { useAppState } from '@k8ordo/state';
import { listState } from './state/product-list';

export function Filters({ initialUrl }: FiltersProps) {
  const [{ q, page }, update] = useAppState(listState, ['q', 'page'], {
    initialUrl,
  });

  return (
    <>
      <p>{q === '' ? 'all products' : `searching “${q}”`}</p>
      <button
        type="button"
        onClick={() => update({ page: page + 1 }, { history: 'push' })}
      >
        next page
      </button>
    </>
  );
}
```

## Updates

`update()` applies synchronously — the next render sees the new value — and
returns the Navigation API's own shape, an object holding two promises:

```ts
const { committed, finished } = update({ page: 2 });
// committed: the URL is in the history
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
`AbortError`; unawaited calls never surface it.

- **`replace` by default.** An update refines the current entry. Pass
  `{ history: 'push' }` only for updates the back button should undo.
- **One handler, one navigation.** Several `update()` calls in the same event
  handler collapse into a single `navigation.navigate()`; they share one
  handle. A batch that ends where it started does not navigate at all.
- **Functional form.** `update((current) => ({ page: current.page + 1 }))`
  reads the batched state, not the committed one.
- **The URL is shared ground.** Only the fields this definition declares are
  rewritten; params owned by other page states or by nobody survive updates.

## Subscription granularity

The schema fixes the key set, so change detection is exact, per key:

```tsx
useAppState(listState); // any declared field re-renders this
useAppState(listState, ['q']); // only q changes re-render this
useAppState(listState, []); // write-only: subscribe to nothing
```

A `page` change never re-renders a `['q']` subscriber. Inline key arrays are
normalized internally — no `useMemo` at the call site.

## Routers

Three of the four url operations work under any router, because they are pure
or go through plain platform navigation:

| operation                          | needs                                       |
| ---------------------------------- | ------------------------------------------- |
| `parseUrl` on the server           | nothing                                     |
| `href` / `search` links, GET forms | nothing — the router handles the click      |
| `update()` on the client           | a router that intercepts the Navigation API |

`update()` calls `navigation.navigate()`. On a router that intercepts the
`navigate` event (any Navigation-API router), that is a same-document update
flowing through the router's own pipeline — transitions, scroll handling and
all. On a router that does not (Next.js today), it is a full document load:
use links and GET forms for url changes there, which is this package's
preferred grain anyway. There is deliberately no history-API fallback.

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

**The URL is input, not trusted state.** A param a user edited into something
the schema rejects falls back to that field's own default; the other fields
keep their values. One broken param never takes the page down.

**Canonical URLs.** Serialization omits every field sitting at its default, so
the same state always produces the same, shortest URL — links, bookmarks and
caches agree.

**Back means back.** State lives on the history entry via the platform, not in
a parallel store, so back/forward restore it with no library bookkeeping.

**SSR sees real values when you hand them over.** Pass the RSC-parsed url as
`initialUrl` and the server render and hydration render show the actual URL
state; omit it and they show defaults until the live URL takes over after
hydration.

## GET forms with @k8ordo/form

A search or filter form is a GET form, and its constraints and its URL state
are the same schema:

```tsx
import { formFields } from '@k8ordo/form/server';

const filterFields = formFields(listState.url); // one schema, both jobs
```

The form submits as GET, the RSC reads it back with `parseUrl`, and the whole
loop works before JavaScript loads.

## Where this is going

`definePageState` is the first of the planned lifetimes. The same
declare-by-location model extends to a hidden `entry` slot on the history
entry (Navigation API state), `defineLocalState` (localStorage) and
`defineMemoryState` (a typed shared box) — designed, not yet shipped. The
`url` slot's API will not change shape when they land.

## Testing

`resetStateRegistry()` clears the provider-less store registry between tests.
Unmount components first; mounted hooks keep their store through closures.
