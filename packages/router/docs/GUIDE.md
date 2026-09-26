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
- A branch may name a **`loading`** component — no props — to show while
  what is below it suspends: `{ layout, loading, children }` puts a
  `<Suspense>` there, inside the branch's `error` boundary.
- A branch may name an **`error`** component beside its layout:
  `{ layout, error, children }`. When anything below throws, it renders in
  the layout's hole instead — with `{ error, reset }` as props (`ErrorProps`;
  the component's type is `ErrorComponent`) — and the frame around it
  survives. Leaving the page that failed clears the failure.

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

| written                                                   | error                                                                                                             |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| the same full pattern twice, wherever the copies nest     | `route pattern "/x" is declared twice`                                                                            |
| a group with no children (it would redeclare the index)   | `route group "/(oops)" must have children`                                                                        |
| a key not starting with `/`                               | `route pattern "x" must start with "/"`                                                                           |
| parentheses that are not exactly a group (`/(admin)/new`) | `route group "/(admin)/new" must be "/(name)" and nothing else — a regular expression is not part of the grammar` |
| a pattern URLPattern cannot parse                         | URLPattern's own `TypeError`                                                                                      |

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

Every same-origin link or programmatic navigation the table claims is handled
in the browser; the rest is left alone, so a real document load — and a real
404 — stays the server's answer. A pathname the table does not match renders
nothing rather than guessing.

Four kinds of navigation are never the application's, whatever the table says:
a reload, a form submitted with a body (POST), a download, and a fragment-only
change — nor is any navigation the platform does not let a page intercept,
such as one to another origin. Intercepting any of the four would silently do
nothing where the platform would have done the obvious thing — a POST body
only the server can act on, an `F5` that stops reloading. A GET form carries
no body, so the search-shaped submissions `@k8ordo/state` builds still come
through.

A `/*` at the end of the table answers every pathname, so it claims a link to
a file the host serves as well: `/report.pdf` renders the `/*` component
instead of the file. Mark such a link with `download` — the browser then
reports a download at the click, and the router leaves it alone. (Under the
framework the runtime claims every same-origin URL too, finds out from the
answer, and reloads into the file; `download` saves that round trip.)

A leaf can be `React.lazy(...)`, which the table stores as any other component;
put a `<Suspense>` in a layout above it so there is somewhere to fall back to
while the chunk arrives. The fallback shows on the first render and on a
navigation that mounts that `<Suspense>` anew. A page change under a
`<Suspense>` already on screen renders in the background, so the previous page
stays until the chunk is in. A branch that names an `error` wraps what is
below in a `<Suspense fallback={null}>` of its own, so a lazy page under that
branch shows nothing there instead of reaching a layout's fallback above it:
give such a page its `<Suspense>` below the boundary — in a nested branch's
layout, or around the lazy component itself.

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
thing and nothing else. An active link is a question you ask, not a prop:

```tsx
import { matchPath, useMatch } from '@k8ordo/router';

useMatch('/products/:id'); // { id } when that page is showing, else null
useMatch('/products/*'); // {} anywhere under /products, else null
matchPath('/products/:id', pathname); // the same, pure, for a pathname in hand
```

`useMatch` takes a pattern from the table, or a table pattern followed by
`/*` to mean "everything below it" — what a sidebar asks when it wants to
know which section of the site is open. The pattern's own page is not below
it: `/products/*` matches `/products/42` and not `/products`, which is
`useMatch('/products')`. A section link that wants to be marked on the index
as much as below it asks `useMatch('/products/*', { inclusive: true })`;
`matchPath` takes the same options as its third argument. `useMatch` is
built on `usePathname`, so it re-renders on the pathname and never on the
search, and it needs no table in the browser — which is what makes it the one
of these that also works under the framework, where `useRoute` has no match
to read.

`usePathname` answers in the table's terms: a `base` the application is
served under is taken off (see _Served under a base_).

**`usePathname` changes when the URL changes, not when the new page appears.**
Interception commits the URL first and the tree arrives when it has loaded, so
on a slow navigation a link marks itself active while the previous page is
still on screen — the same order the browser's own address bar follows. If the
wait needs showing, `usePendingPathname()` is where a page change in progress
is going — `null` when none is — set as the navigation starts and cleared once
the new page is on screen or the navigation is given up; a state change sets
nothing. The caller that started it can instead await `navigateTo`'s
`finished` — it resolves when the tree is on screen (below).

`usePathname` reads the platform rather than the table, which is why it is the
one that also works under the framework, where the browser holds no table at
all. It answers _where the URL is_; `useRoute` answers _which route won_, and
only something holding the table can say that. The search string is
deliberately not on offer here: a component re-rendering on every search change
would defeat `@k8ordo/state`'s keyed subscriptions, and the split at the `?` is
the boundary between the two packages.

`href` refuses a wildcard: `/*` is something to match, never something to link
to. Param values are URL-encoded on the way in and decoded on the way out.
What `href` returns is the URL a link points at — Vite's `base` in front of it
(below) — so it is typed `string`, not as a path in the table.

**A segment the whole application shares is bound once.** A locale, a tenant —
a param every link would otherwise have to repeat — is supplied by a function
instead, through `bindParams`:

```ts
// links.ts
import { bindParams } from '@k8ordo/router';

import { locales } from './i18n';

export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));
```

```tsx
href('/:locale/products/:id', { id }); // locale from the source, id as before
navigateTo('/:locale', { locale: 'en' }, { history: 'replace' }); // or overridden
navigateTo('/:locale', undefined, { history: 'replace' }); // options stay third
```

Patterns keep their full spelling, so the table's types apply unchanged; the
source is read at each call, so a value that differs per request or per URL
is read where it is current. Options still come after the params whenever
the pattern names one, even when the source supplies them all — params and
options are both plain objects, and the pattern alone decides which is which —
so the params slot is passed as `undefined`, as in the last line above. Which
package supplies the value is the application's business — the router knows a
param name, nothing more.
`normalizePathname` is the router's own reading of a pathname — a trailing
slash dropped, root excepted — for code that compares pathnames the way the
table does.

`navigateTo` returns the platform's own `{ committed, finished }`. `finished`
resolves once the new page is on screen, so an async action can await it and
let `isPending` cover the wait:

```tsx
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  try {
    await navigateTo('/products/:id', { id }).finished;
  } catch (error) {
    // overtaken by another navigation
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      throw error;
    }
  }
});
```

The page change does not join the action, so awaiting `finished` inside one —
`useTransition`'s, `@k8ordo/ui`'s `Button` `onAction`, a `<form action>` —
settles as soon as the page is on screen, and `isPending` covers exactly that
wait. An event handler can await it the same way. A page change started while
some unrelated action is still pending reaches the screen without waiting for
that action either.

Its default is `push`, the opposite of `@k8ordo/state`'s `update()`, and for
the same reason: going to a page is what the back button should undo, while
refining what is on the page is not. **Changing pages goes through
`navigateTo`; changing state goes through `update`.**

## Served under a base

The table is written from the application's root, and it stays that way when
the application is served below one — Vite's
[`base`](https://vite.dev/config/shared-options#base), `base: '/docs/'`. The
router reads it from `import.meta.env.BASE_URL` and does the rest:

- `href` and `navigateTo` put it in front of every link: `href('/products')`
  is `/docs/products`, and `href('/')` is `/docs/`.
- `usePathname` takes it off, so what it returns compares with the patterns:
  `/products` at `/docs/products`. `useMatch` follows, and `<Router>` matches
  the table against the pathname below the base.
- A URL outside the base is not the application's, and `<Router>` leaves it
  to the browser whatever the table says.

`withBase(pathname)` and `withoutBase(pathname)` are those two steps for code
of your own — `withoutBase` answers `null` for a URL outside the base. Each
takes the base as a second argument for code Vite does not process, which
has no `import.meta.env` to read. A relative base (`./`) names no path, so it
adds and removes nothing.

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

Under `@k8ordo/static` or `@k8ordo/server` this file is generated into
`.k8ordo/register.gen.ts` from `routes/` — for `@k8ordo/state` too, when the
application depends on it — so hand-writing it there is writing a second
answer to a question already answered. Hand-write it in a client application
that mounts `<Router>` itself.

The framework's generated `Register` also carries `params`: per pattern, the
type the route file's `paramsSchema` produces. With it, `href` and
`navigateTo` take a param as the page receives it — `{ id: 42 }` for a
schema that said number — and spell it the one way the schema reads back. A
value with no URL spelling (an object) is refused. Before `Register` is
augmented — or for a pattern no schema along its stack covers — a link takes
any value with one spelling (a string, a number, a bigint, a boolean), so a
link written for a schema compiles before the generated file exists. Once a
schema covers a pattern, a param the schemas leave alone is a string, as the
page receives it. `useParams` is unaffected: what a hand-written table matches
is always a string.

The shapes these checks use are exported for code of your own:
`RegisteredPattern` (every leaf pattern in the table — each page and each
`/*`, never a prefix with no page of its own), `RegisteredNavigablePattern`
(the ones a link can point at — no wildcards), `RegisteredParams<P>` (what a
link to `P` takes) and `RegisteredPageParams<P>` (what the page at `P`
receives). Before the augmentation the first two are any `/`-prefixed
string.

## Typed paths for @k8ordo/state

`@k8ordo/state`'s `Register` takes the same line this one does:

```ts
declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}
```

With that, `listState.href('/products', { q })` is checked against the same
table this router matches against, and the two packages agree on what a path
is. `NavigablePath<typeof routes, Path>` is that check, for any other
typed-path consumer: `Path` itself when one of the table's linkable patterns
matches it segment by segment — a literal segment spelled as the pattern
spells it, a `:param` taking any one non-empty segment, a `${string}` from a
template literal included — and `never` when none does. A trailing slash is
refused: matching treats `/products/` as `/products`, but a path built for a
link is spelled the one canonical way.

The path is checked against the patterns rather than collected into a union
of every path the table has: a `/:locale` page would put `/${string}` in such
a union, and `/${string}` takes every path there is.

## What navigation guarantees

**`finished` means the page is on screen.** The intercept handler resolves in
a layout effect, once React has committed the new tree and before the browser
paints it, so anything awaiting the platform's promise for a page change is
awaiting the render, not the URL write. The render it waits for is the first
commit of the new tree: a lazy page that suspends into a `<Suspense>` the
navigation mounts anew commits its fallback first, and `finished` resolves
then, before the chunk is in.

**A state change is not a page change.** When only the search or the entry
state moved, the pathname is the one whose tree is on screen: the route tree
is left alone, nothing remounts, and scroll and focus are not disturbed. This
is why a search update never scrolls the page back to the top. Such a
navigation is intercepted with no handler, so its `finished` —
`@k8ordo/state`'s `update().finished` included — settles as soon as the
navigation commits, with no render to wait for. The comparison is against the
page showing, not against the address bar — interception commits the URL
first, so a state update issued while another page is still loading is a page
change: it lets that page finish arriving, and its `finished` waits for that
render.

**Route changes render in the background.** The new tree renders at the
priority `useDeferredValue` gives it, so the old page stays on screen and
interactive while the new one prepares, and a `<Suspense>` that is already
showing keeps its content instead of falling back. It is deliberately not a
transition: while any async action is pending React holds every transition
until that action ends, which would stall a page change behind an unrelated
action and deadlock an action that awaits `finished`. The commit is still
tagged with `addTransitionType` — `navigation`, and one of `navigation-push`,
`navigation-replace`, `navigation-traverse` — which is what a
`<ViewTransition>` reads to animate a page change and nothing else (below).

**A new page starts at the top.** Once the new tree is on screen, the
viewport goes where a document load would have put it: the top, or the
element a `#fragment` names. Back and forward are left to the browser, which
restores the position it saved. A state change never moves the viewport —
same pathname, same place — so a filter update does not scroll the reader
back to the top.

**Superseded navigations abort.** A second navigation aborts the first through
the platform's own signal: the overtaken `finished` rejects with the abort
reason, and its tree never reaches the screen even if its load had already
come back. `load` receives that signal, so a payload fetch under the framework
is cancelled outright. A `React.lazy` chunk cannot be — a dynamic import takes
no signal — so in a client application it finishes in the background and is
kept for the next visit, while the page it belonged to is never shown.

## Animating page changes

A route change renders in the background, and React's `<ViewTransition>`
animates what such a render changes, as it does a transition. Put one around
the hole the pages render into and key it on the router's transition types,
so it animates page changes and stays out of every transition — a `Button`'s
pending action is one, and must not cross-fade the page:

```tsx
import { Outlet } from '@k8ordo/router';
import { ViewTransition } from 'react';

export const RootLayout = () => (
  <>
    <nav>…</nav>
    <ViewTransition
      default="none"
      update={{ navigation: 'auto', default: 'none' }}
    >
      <Outlet />
    </ViewTransition>
  </>
);
```

`update`, because the boundary stays and its content changes; `auto` is the
browser's own cross-fade. The router tags every page change `navigation`,
plus the kind the platform reported — `navigation-push`,
`navigation-replace` or `navigation-traverse` — so a back button can slide
the other way from a link:

```tsx
<ViewTransition
  default="none"
  update={{
    'navigation-push': 'slide-forward',
    'navigation-replace': 'slide-forward',
    'navigation-traverse': 'slide-back',
    default: 'none',
  }}
>
  <Outlet />
</ViewTransition>
```

with each class styled through `::view-transition-old(.slide-back)` and
`::view-transition-new(.slide-back)`. A state change — `@k8ordo/state`'s
`update()` — never changes the tree, so it never animates. Under the
framework the same `<ViewTransition>` wraps a layout's `children`, and a
Server Component layout can render it directly.

`@k8ordo/ui`'s stylesheet turns view-transition animations off under
`prefers-reduced-motion`; an application without it adds that rule itself.

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
const [latest, setLatest] = useState(initial);
const { generation } = useInterceptedNavigation<Value>({
  claim: (url) => boolean, // synchronous: the only moment interception is possible
  load: (url, signal) => Value | Promise<Value>,
  apply: setLatest, // an ordinary update, never inside a transition
});
const shown = useDeferredValue(latest); // render this, not `latest`
```

A host renders what `apply` set through `useDeferredValue`, in the same
component that calls the hook. That is what renders the new page in the
background and keeps the old one on screen meanwhile, and what the hook
itself follows: `generation` and `finished` move in the same deferred commit.

`generation` changes exactly when a new tree is put on screen — not when the
URL moved — and a host provides it through `<NavigationGeneration value>` so
the table's `error` boundaries know when to let a failure go. `<Router>` does
this itself; the framework's runtime does too.

The table itself stays on the server, generated from `routes/`, and the
framework matches against it with `match(pathname, accept)`. Each match that
fits is handed to `accept` first, and one it declines — a param a
`paramsSchema` along its stack refused — is passed over as if the pattern had
not fit, so the walk goes on to the next pattern, the catch-all included.

A framework `route.ts` — an answer that is not a page, a feed or JSON —
exports a function per request method, and `RouteContext<'/feed.xml'>` is
what each receives: the `Request`, and `params` typed as a page's are.

A page under the framework says it is not there with `notFound()` — the
product its id names does not exist. It throws, so nothing after it runs, and
the framework answers with the nearest `not-found.tsx` under a 404. It lives
here rather than in a mode package so a page reads the same under either;
`isNotFound(value)` recognises what it throws, by a registry brand rather than
a class, since a page and the framework may hold two copies of this package.
Under a client `<Router>` there is no status to answer with, and `notFound()`
is an error like any other.

What carries across unchanged is everything that needs no table: `href`,
`navigateTo` and `bindParams`, `usePathname`, `useMatch` and `matchPath`, and
`normalizePathname`. `usePathname` needs one thing on the server,
where there is no Navigation API to read: the pathname the render is for,
supplied by `<PathnameProvider pathname>`. `<Router>` mounts one itself and
both mode runtimes supply it, so an application never writes it — only a host
building its own seam out of `useInterceptedNavigation` has to. What does not
carry across is `useRoute` and `useParams` —
both read the match from context, and under the framework there is no match in
the browser to read. A framework page receives its `params` as a prop from the
server instead, which is the only form Server Components can take them in.

Those props have a type here, by the pattern the directory puts the file
under: `PageProps<'/products/:id'>` is `{ params, pathname }` with `params`
typed by the schemas the framework ran (the generated `Register` carries
them), and `LayoutProps<'/products'>` adds `children` — with `params` left as
strings whatever the schemas say, since `not-found.tsx` renders under a layout
whether or not its schemas accepted. Under `@k8ordo/server` the generated `Register` also carries
the `request`, so both types gain `request` there and a page that reads it
fails to type-check under a build into files. A route file may equally declare
its props inline — the generated table checks them at the import either way —
and a layout whose pattern has no page of its own has to: `LayoutProps` takes
only a pattern the table has a page at.
