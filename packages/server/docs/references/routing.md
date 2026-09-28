# Routing

How `@k8ordo/server` turns `src/routes/` into the application's URLs.
Installing and configuring it is in [the guide](../GUIDE.md).

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched — and a real 404
  error.tsx             shown in place of what is below when it throws
  loading.tsx           shown while what is below it loads
  guard.ts              runs before whatever answers below it
  old/redirect.ts       /old sends the visitor elsewhere
  feed.xml/route.ts     /feed.xml answered by its GET, not a page
  products/
    page.tsx            /products
    [id]/page.tsx       /products/:id
  (docs)/               a route group: its own layout, no URL segment
    layout.tsx
    guide/page.tsx      /guide
  _parts/               private to the route above it; never a route
  _data/                the same, for anything that is not a component
```

- `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`,
  `redirect.ts`, `guard.ts` and `route.ts` are the only filenames the grammar
  accepts.
  Anything else lives under a
  `_`-prefixed directory. A file or directory whose name starts with `_` or
  `.` is skipped entirely.
- **A page receives `params`; a layout receives `children`.** Server Components
  cannot read context, so nesting is by prop. Both also receive `pathname` —
  the URL this render is for, which is how a component above a parameter can
  see the value that parameter names. Under this mode both also receive
  `request` ([Reading the request](guards.md#reading-the-request)).
- Parameters need no enumeration in this mode — the value arrives with the
  request.

```tsx
// src/routes/products/[id]/page.tsx
import { findProduct } from '../../_data/catalog.server';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await findProduct(params.id); // a Server Component: just read it
  return <h1>{product?.name ?? 'unknown product'}</h1>;
}
```

**An async page answers, then streams.** The document waits for the page's
own component — its data — before anything is sent, because the page may
still say `notFound()` ([Errors](errors.md#a-page-that-is-not-there)); what
the page puts under a `<Suspense>` follows in the same response as it
arrives. The browser hydrates when the last of it
is in place, not before: a boundary still on
its way cannot be hydrated, and a context that changes as the page hydrates —
a colour scheme read from the browser — would make React render it again
beside the copy still streaming in. Until then the page is what it is
without JavaScript: links load documents and forms post.

<!-- shared:refuses -->

## What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                                                          | error                                                                                                                                                             |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                                                      | `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts, guard.ts, route.ts, loading.tsx — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                                                          | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                                                                           |
| `pro ducts/page.tsx`                                                      | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                                                                           |
| `[id]/things/[id]/page.tsx`                                               | `":id" is already taken by an ancestor — params must be unique within a path`                                                                                     |
| `orphan/layout.tsx` and no page below                                     | `has a layout but no page.tsx below it, so it can never render`                                                                                                   |
| `(a)/page.tsx` and `(b)/page.tsx`                                         | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                                                                                     |
| `(docs/page.tsx`                                                          | `"(docs" is not a valid route group — use (name)`                                                                                                                 |
| `empty/error.tsx` and no page, redirect or route below                    | `declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it`                                                          |
| `(shop)/sale/page.tsx` and `(shop)/[id]/page.tsx` beside `about/page.tsx` | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                                                                       |
| `old/page.tsx` and `old/redirect.ts`                                      | `"old" cannot both render page.tsx and redirect — keep one`                                                                                                       |
| `api/page.tsx` and `api/route.ts`                                         | `"api" cannot both render page.tsx and answer from route.ts — keep one`                                                                                           |
| `old/redirect.ts` and `old/route.ts`                                      | `"old" cannot both redirect and answer from route.ts — keep one`                                                                                                  |
| `api/route.ts` exporting no method                                        | `exports none of GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS — a route.ts answers the methods it exports`                                                        |
| `products/page.tsx` exporting `search`, without `@k8ordo/state`           | `exports search, which is read through @k8ordo/state — add it to the application’s dependencies`                                                                  |

The generated table lists literal segments before parameters, so `about/`
beside `[slug]/` is reachable without saying anything. A route group holds
both kinds under one key and the table cannot interleave across it, which is
the one shape where a declared route can still be shadowed — so it is reported
rather than shipped.

<!-- /shared:refuses -->

<!-- shared:loading -->

## While a page loads

A `loading.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows while
what is below it suspends: a `<Suspense>` the framework puts at that level,
inside its `error.tsx` boundary, so what the boundary catches is what the
fallback stood in for.

```tsx
// src/routes/products/loading.tsx
export default function ProductsLoading() {
  return <p>loading products…</p>;
}
```

It receives no props. It shows when a client navigation enters its directory
while the page there is still on its way, and for whatever inside the page
suspends as it streams. A page change below one already on screen keeps the
current page showing while the next one loads — every page change renders in
the background — and `usePendingPathname()` from `@k8ordo/router` is how a
link or a bar says that one is under way:

```tsx
'use client';

import { usePendingPathname } from '@k8ordo/router';

export function Progress() {
  const pending = usePendingPathname();
  return pending === null ? null : <p role="status">loading {pending}…</p>;
}
```

<!-- /shared:loading -->

A document waits for the page's own component before anything is sent — it
may still say `notFound()` — so in the HTML a `loading.tsx` shows only for what
the page leaves under a `<Suspense>` of its own; a client navigation, which has
no status to wait for, shows it while the page's payload streams in.

<!-- shared:route-handlers -->

## Answers that are not pages

A `route.ts` answers its directory's URL with a `Response` rather than a
page — an RSS feed, `robots.txt`, JSON, a webhook. It exports a function for
each request method it answers:

```ts
// src/routes/feed.xml/route.ts
import type { RouteContext } from '@k8ordo/router';

export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const origin = new URL(request.url).origin;
  return new Response(rss(origin, await listProducts()), {
    headers: { 'content-type': 'application/rss+xml;charset=utf-8' },
  });
}
```

A directory named like a file is an ordinary segment, so `feed.xml/route.ts`
answers `/feed.xml`. Each export receives `{ request, params }`: the
`Request`, and the params its pattern names, typed by the `paramsSchema`
exports along its stack as a page's are — a `route.ts` may export one too.
`RouteContext<P>` from `@k8ordo/router` is that type, and the generated table
checks each module against its pattern. A `route.ts` exporting none of `GET`,
`HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTIONS` is refused, since it
could only ever answer `405`.

A directory answers from a `route.ts` or renders a `page.tsx` (or redirects),
never two of them, and the layouts above a `route.ts` do not wrap it —
nothing renders. It takes its place in the table's order the way a page does,
literals before params, so `api/[id]/route.ts` beside `api/latest/page.tsx`
leaves `/api/latest` to the page. A client navigation to it gets no payload,
and loads the document instead.

<!-- /shared:route-handlers -->

**What a running server does with it.** Any of the seven methods may be
exported, and each answers only its own; a `HEAD` with no export of its own
is its `GET` with the body left off, and a method it does not export gets a
`405` whose `Allow` names the ones it does. The guards above it run first. A
`POST` to a `route.ts` is not held to the same-origin rule a Server Action is
— what posts to one, a webhook, is not a form on this site — so it checks
what it needs itself. It answers the request as much as a guard does:
[`cookies()`](guards.md#cookies), `responseHeaders()` and `requestHeaders()`
work inside it.

<!-- shared:generated -->

## The generated files

The framework writes `.k8ordo/` and keeps it in step with the directories.
It is generated, ignored by git, and not yours to edit — but it is ordinary
source, so it is yours to read:

```ts
// .k8ordo/routes.gen.ts
import { defineRoutes } from '@k8ordo/router';
import type { ParamsOf, ParsedParams } from '@k8ordo/router';
import type { ComponentType, ReactNode } from 'react';

import page from '../src/routes/page';
import products_page from '../src/routes/products/page';
import products_id_page from '../src/routes/products/[id]/page';
import layout from '../src/routes/layout';

type Page<P extends string, S extends readonly unknown[] = []> = ComponentType<{
  params: ParsedParams<P, S>;
  pathname: string;
}>;
type Layout<P extends string> = ComponentType<{
  params: ParamsOf<P>;
  pathname: string;
  children: ReactNode;
}>;

export const paramSchemas = {} as const;

export const searchReaders = {} as const;

export const routeModules = {} as const;

export const guards = {} as const;

export const redirects = {} as const;

export const routes = defineRoutes({
  '/': {
    layout: layout satisfies Layout<'/'>,
    children: {
      '/': page satisfies Page<'/'>,
      '/products': {
        children: {
          '/': products_page satisfies Page<'/products'>,
          '/:id': products_id_page satisfies Page<'/products/:id'>,
        },
      },
    },
  },
});
```

Each `satisfies` checks a route file's props against the pattern its directory
puts it under — a type check, so `tsc` reports a mismatch and `vite build`,
which does not type-check, passes. Under `@k8ordo/server` the `Page` and
`Layout` types also carry `request`. `redirects` is what the request handler
consults before it walks `routes` — where each `redirect.ts` sends the
visitor — `paramSchemas` holds, per page pattern, the schemas it runs when
the walk reaches that pattern, before the page renders, `routeModules` the
`route.ts` that answers a pattern (its place in `routes` is held by a
component that renders nothing), and `guards` the `guard.ts` files that run
before a pattern answers, outer first (a mode that builds files refuses
them), and `searchReaders` what reads the search for a page that exports
`search`; all five are empty here because no route file declares any.

`.k8ordo/register.gen.ts` wires that table into `@k8ordo/router` — and into
`@k8ordo/state` when the application depends on it — so typed paths work
everywhere without a line of ceremony. It also says what the mode hands a
route file: under `@k8ordo/server` it registers the `request`, which is how
`PageProps` / `LayoutProps` from the router gain that field there and not
under a build into files:

```tsx
import { href } from '@k8ordo/router';

<a href={href('/products/:id', { id })}>…</a>; // checked against routes/
```

<!-- /shared:generated -->

<!-- shared:titles -->

## Titles and metadata

There is no metadata API, because React 19 already hoists `<title>`,
`<meta>` and `<link>` rendered anywhere in the tree into `<head>`. A page
renders its own title where it renders everything else:

```tsx
export default function ProductPage({ params }: { params: { id: number } }) {
  return (
    <>
      <title>{`Product ${String(params.id)}`}</title>
      <meta content="…" name="description" />
      <h1>…</h1>
    </>
  );
}
```

Keep one `<title>` on screen at a time: the root layout renders none, each
page renders its own, and `not-found.tsx` renders one too. Two titles at once
is not a fallback chain — React renders both.

<!-- /shared:titles -->

<!-- shared:prefetch -->

## Fetching the next page ahead

The client runtime listens on the whole document for a pointer moving onto a
link, a link taking focus, and a press starting on one — `pointerover`,
`focusin` and `pointerdown` — and fetches that page's payload there and then,
so a click often finds the page already in hand. Nothing needs wiring: any
`<a>` counts, the ones a component library renders included.

Only a link a click would load in place is fetched: the same origin and below
Vite's `base`, no `download`, no `target` other than `_self`, and not the
page on screen, where only the search or the fragment would change. To stop
it for a link — one whose page is expensive to render, say — mark the link,
or any element around it, `data-k8ordo-prefetch="false"`
(`data-k8ordo-prefetch={false}` in JSX renders the same). The nearest element
carrying the attribute decides, so `"true"` opts a link back in inside a
region that opted out.

```tsx
<nav data-k8ordo-prefetch={false}>
  <a href="/reports">Reports</a>
  <a data-k8ordo-prefetch href="/">
    Home
  </a>
</nav>
```

What was fetched is used by the next navigation to that page, once, and only
if it starts within 30 seconds of the fetch starting. After that — or once a
navigation has used it — the page is fetched afresh, as it would have been
with nothing prefetched, so a page hovered and left alone never shows up
later as it was then. A Server Action's answer drops everything prefetched,
since the action may have changed what those pages show, and a prefetch that
failed is dropped at once, so the navigation asks again. A prefetch dropped
before any navigation used it is cancelled if it is still on its way, and one
a navigation took is cancelled with that navigation when another overtakes
it — the same as a fetch the navigation had started itself.

Under `@k8ordo/static` a prefetch is a request for a file. Under
`@k8ordo/server` it is a render, as a navigation is — the reason to mark a
link to an expensive page. The platform's Speculation Rules are not used:
they are Chromium's alone, not Baseline.

<!-- /shared:prefetch -->
