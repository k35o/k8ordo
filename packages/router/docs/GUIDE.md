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

## The route table

```ts
// routes.ts — imported by whatever mounts the router, and by nothing else
import { defineRoutes } from '@k8ordo/router';

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
- **`/:name`** captures a segment. **`/*`** matches whatever nothing before it
  did.
- **`/(name)`** is a route group: it structures the table — its own layout, its
  own subtree — without contributing a URL segment. It exists because `'/'` can
  only appear once in an object, so two sections at the same depth could not
  otherwise have different layouts.
- **Matching is in declaration order, first match wins.** Precedence is what you
  wrote, not a specificity ranking to reason backwards from. Put `/*` last.
- A pattern declared twice, a group with no children, or a pattern URLPattern
  cannot parse fails at module load, not at first navigation.

## Mounting it

```tsx
import { Outlet, Router } from '@k8ordo/router';

<Router routes={routes} />;

// a layout renders what it wraps through Outlet
const DocsLayout = () => (
  <section>
    <Outlet />
  </section>
);
```

Every same-origin navigation the table claims is handled in the browser; the
rest is left alone, so a real document load — and a real 404 — stays the
server's answer.

## Links and navigation

```tsx
import { href, navigateTo, useParams } from '@k8ordo/router';

<a href={href('/products/:id', { id })}>…</a>;

navigateTo('/products/:id', { id }); // pushes
navigateTo('/products', { history: 'replace' }); // replaces

const { id } = useParams('/products/:id');
```

**There is no `<Link>`.** Under the Navigation API a plain `<a>` is already a
client navigation — the router intercepts the event the browser was going to
send anyway. A component wrapping it would add a second way to write the same
thing and nothing else.

`href`, `navigateTo` and `useParams` take the pattern as a **string** and need
no route table, which is what keeps pages from importing the module that
imports them. Params are inferred from the pattern literal, so a missing or
misspelled one fails to compile. `navigateTo` returns the platform's own
`{ committed, finished }`.

To have the patterns checked against the app's actual table, augment `Register`
once:

```ts
declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}
```

Without it the constraint is any `/`-prefixed string; with it, a pattern the
table does not declare fails to compile everywhere. Augment only in an
application — a library doing it would impose its table on every consumer.

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

## What navigation guarantees

**`finished` means the page is on screen.** The intercept handler resolves in
an effect after React commits the new tree, so anything awaiting the platform's
promise — including `@k8ordo/state`'s `update().finished` — is awaiting the
render, not the URL write.

**A state change is not a page change.** When only the search or the entry
state moved, the pathname is unchanged: the route tree is left alone, nothing
remounts, and scroll and focus are not disturbed.

**Superseded navigations abort.** A second navigation aborts the first through
the platform's own signal, which is passed to whatever is loading.

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

`href`, `navigateTo` and `useParams` are the same in both worlds.
