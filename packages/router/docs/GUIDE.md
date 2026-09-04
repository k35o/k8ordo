# @k8ordo/router

The URL's pathname axis, owned. One route table is the application's pathname
schema, and from it come the types, the matching, the links, and the
navigation — over the Navigation API and URLPattern.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks. Both the Navigation API and URLPattern reached Baseline in 2025–26;
this package treats them as simply present.

## What it does not own

Search params and history-entry state belong to `@k8ordo/state`. This package
has no `useSearchParams`, and it never hands out the raw search string: a
component that reads one field of the search should re-render when that field
changes and not otherwise, which is a job for keyed subscriptions, not for a
router. The division is the URL itself — pathname here, everything after it
there.

It also does not fetch. There is no loader, no route-level data API, and no
cache. Data belongs to the component that needs it — `use()` and `<Suspense>`
in a client app, the server in a framework one — and a router that owned
fetching would be a second, competing answer to a question React already
answers.

## The shape of it

```
routes.ts        defineRoutes({ … })      the pathname schema, one place
   ↓ mounted once
<Router routes>  match → stack → render   layouts wrap through <Outlet />
   ↑ never imported by pages
pages            href / navigateTo / useParams
                 take the pattern string; Register supplies the check
```

The table's value is held by `<Router>` and nothing else. Everything a page
needs — building a link, going somewhere, reading its own params — works from
the pattern **string**, so the module that imports the pages is never imported
back by them.

## The route table

```ts
// routes.ts
import { defineRoutes } from '@k8ordo/router';

import { DocsLayout } from './docs-layout';
import { Guide } from './guide';
import { Home } from './home';
import { NotFound } from './not-found';
import { ProductList } from './product-list';
import { ProductPage } from './product-page';

export const routes = defineRoutes({
  '/': Home,
  '/products': {
    children: {
      '/': ProductList,
      '/:id': ProductPage,
    },
  },
  '/(docs)': {
    layout: DocsLayout,
    children: { '/guide': Guide },
  },
  '/*': NotFound,
});
```

- A **leaf** is the component to render. A **branch** is `{ layout?, children }`,
  and a child key of `'/'` is the branch's own index page.
- **`/:name`** captures a segment, decoded. **`/*`** matches whatever nothing
  before it did.
- **`/(name)`** is a route group: it structures the table — its own layout, its
  own subtree — without contributing a URL segment. It exists because `'/'` can
  only appear once in an object, so two sections at the same depth could not
  otherwise have different layouts.
- **A trailing slash is the same pathname.** `/products/` matches `/products`.

### Order is the rule

Matching walks the table top to bottom and takes the first pattern that fits.
Precedence is what you wrote — there is no specificity ranking to reason
backwards from, which means a table can be read like the code it is.

```ts
defineRoutes({ '/:slug': Article, '/about': About }); // /about → Article
defineRoutes({ '/about': About, '/:slug': Article }); // /about → About
```

Put `/*` last, for the same reason.

### What fails at definition time

A table is checked when the module loads, not when someone first navigates:

| written                                                 | error                                      |
| ------------------------------------------------------- | ------------------------------------------ |
| the same full pattern twice, wherever the copies nest   | `route pattern "/x" is declared twice`     |
| a group with no children (it would redeclare the index) | `route group "/(oops)" must have children` |
| a key not starting with `/`                             | `route pattern "x" must start with "/"`    |
| a pattern URLPattern cannot parse                       | URLPattern's own `TypeError`               |

## Mounting it

```tsx
import { Outlet, Router } from '@k8ordo/router';

import { routes } from './routes';

export function App() {
  return <Router routes={routes} />;
}

// a layout renders what it wraps through Outlet
export const DocsLayout = () => (
  <section>
    <nav>…</nav>
    <Outlet />
  </section>
);
```

Every same-origin navigation the table claims is handled in the browser; the
rest is left alone, so a real document load — and a real 404 — stays the
server's answer. A pathname the table does not match renders nothing rather
than guessing.

A leaf can be `React.lazy(...)`, which the table stores as any other component;
put a `<Suspense>` in the layout above it so there is somewhere to fall back
to while the chunk arrives.

## Links and navigation

```tsx
import {
  href,
  navigateTo,
  useParams,
  usePathname,
  useRoute,
} from '@k8ordo/router';

<a href={href('/products/:id', { id })}>…</a>;
<a href={href('/products')}>…</a>; // no params, no second argument

navigateTo('/products/:id', { id }); // pushes: the back button undoes it
navigateTo('/products', { history: 'replace' });

const { id } = useParams('/products/:id');
const { pattern } = useRoute(); // untyped: the winning pattern and its params
const pathname = usePathname(); // where the browser is, table or no table
```

**There is no `<Link>`.** Under the Navigation API a plain `<a>` is already a
client navigation — the router intercepts the event the browser was going to
send anyway. A component wrapping it would add a second way to write the same
thing and nothing else. An active link is a comparison you write yourself —
`useRoute().pattern === '/products'` against the table, or
`usePathname() === href('/products')` against the URL — not a prop.

`usePathname` reads the platform rather than the table, which is why it is the
one that also works under the framework, where the browser holds no table at
all. It answers _where the URL is_; `useRoute` answers _which route won_, and
only something holding the table can say that. The search string is
deliberately not on offer here: a component re-rendering on every search change
would defeat `@k8ordo/state`'s keyed subscriptions, and the split at the `?` is
the boundary between the two packages.

`href` refuses a wildcard: `/*` is something to match, never something to link
to. Param values are URL-encoded on the way in and decoded on the way out.

`navigateTo` returns the platform's own `{ committed, finished }`, so it
composes with React 19's async transitions:

```tsx
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  await navigateTo('/products/:id', { id }).finished;
});
```

Its default is `push`, the opposite of `@k8ordo/state`'s `update()`, and for
the same reason: going to a page is what the back button should undo, while
refining what is on the page is not. **Changing pages goes through
`navigateTo`; changing state goes through `update`.**

## Checking patterns against the real table

Params are inferred from the pattern literal on their own, so a missing or
misspelled one fails to compile with no setup at all. To have the **pattern**
checked against the app's actual table as well, augment `Register` once:

```ts
// types/k8ordo-router.d.ts
import type { routes } from '../src/routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}
```

```ts
href('/products/:id', { id }); // ok
href('/prodcuts/:id', { id }); // ✗ not a pattern in the table
href('/products/:id'); // ✗ ":id" is missing
```

Without the augmentation the constraint is any `/`-prefixed string. Augment
only in an application — a library doing it would impose its table on every
consumer.

## Typed paths for @k8ordo/state

`RouteOf<typeof routes>` is the app's pathname space as a union, which is what
`@k8ordo/state`'s own `Register` wants:

```ts
declare module '@k8ordo/state' {
  interface Register {
    path: RouteOf<typeof routes>;
  }
}
```

With that, `listState.href('/products', { q })` is checked against the same
table this router matches against, and the two packages agree on what a path
is without either importing the other.

## What navigation guarantees

**`finished` means the page is on screen.** The intercept handler resolves in
an effect after React commits the new tree, so anything awaiting the platform's
promise — including `@k8ordo/state`'s `update().finished` — is awaiting the
render, not the URL write.

**A state change is not a page change.** When only the search or the entry
state moved, the pathname is unchanged: the route tree is left alone, nothing
remounts, and scroll and focus are not disturbed. This is why a search update
never scrolls the page back to the top.

**Route changes run in a transition.** The new tree is applied inside
`startTransition`, so React can keep the old page interactive while the new
one prepares.

**Superseded navigations abort.** A second navigation aborts the first through
the platform's own signal, which is handed to whatever is loading — a lazy
chunk, or a payload fetch under the framework.

## Testing

Nothing here is mocked, so a test needs a browser environment (this package's
own suite uses Vitest's Chromium browser mode). The one thing to know: a test
that navigates must intercept, or `navigation.navigate()` is a cross-document
load that takes the test runner with it.

```tsx
// a test that mounts <Router> is already intercepting; one that sets up a URL
// outside the table has to play the router itself
const interceptEverything = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};
```

`match` is a pure function and needs no browser: a table's shape, its params
and its precedence can all be asserted directly.

## Under the framework

`@k8ordo/static` and `@k8ordo/server` render pages on the server, so the
browser receives a tree rather than building one from a table — there is no
route table in the client bundle at all, and layouts nest through `children`
instead of `<Outlet />`. What stays is navigation: both build on
`useInterceptedNavigation`, the primitive `<Router>` itself uses.

```tsx
useInterceptedNavigation<Value>({
  claim: (url) => boolean, // synchronous: the only moment interception is possible
  load: (url, signal) => Value | Promise<Value>,
  apply: (value) => void, // called inside a transition
});
```

What carries across unchanged is everything that needs no table: `href`,
`navigateTo` and `usePathname`. What does not is `useRoute` and `useParams` —
both read the match from context, and under the framework there is no match in
the browser to read. A framework page receives its `params` as a prop from the
server instead, which is the only form Server Components can take them in.
