# @k8ordo/static

Builds a k8ordo application into files. Every route is rendered ahead of time,
and what ships is a directory a static host can serve — no server at run time.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

The framework is deliberately strict. Its constraints are not there to make
things quick; they are there so the structure of an application — where its
URLs live, where its execution boundaries are — stays in a form that can be
checked rather than remembered.

## The mode is the dependency

Installing this package is what makes an application static. Request-time data
is not a rule to remember here: there is no request, so there is nothing to
read it from. A Server Action is the one thing the underlying RSC pipeline
would still compile, so the build refuses it by name rather than shipping a
form that posts into nothing:

```
static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':
  src/routes/_parts/guestbook.ts
this application wants @k8ordo/server
```

`vite dev` is a running server that would happily accept that POST, so the
same refusal is said there too, the moment the file is seen — a form that
works in development and posts into nothing in production would be the worst
of the two.

Choosing the other mode means installing `@k8ordo/server` instead, and nothing
else about the application changes — the same route grammar, the same
boundaries, the same request handler, called once per route instead of once
per request. The plugin is called `framework()` in both packages for that
reason: the mode is the import, and `vite.config.ts` reads the same either
way.

## Getting started

```bash
pnpm add @k8ordo/router react react-dom server-only
pnpm add -D @k8ordo/static vite
```

```ts
// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework()] });
```

```json
// tsconfig.json — the generated type wiring lives in .k8ordo/
{
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"]
}
```

`.k8ordo` starts with a dot, and a bare directory entry in `include` silently
skips it — the glob is what makes the generated types apply. Without it the
build still works and `href` simply stops being checked against the table.

```tsx
// src/routes/layout.tsx — no directive, so this is a Server Component
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// src/routes/page.tsx
export default function HomePage() {
  return <h1>hello</h1>;
}
```

```bash
vite dev     # a real server, so the pages behave as they will in production
             # (Fast Refresh included — the framework brings React's plugin)
vite build   # dist/client/ is the site
```

`framework()` takes three options: `routesDir` (default `src/routes`),
`paths` (below, for routes with parameters), and `site` — the origin the
site is served from, `https://example.com`. With `site` the build also writes
`sitemap.xml`, listing every page it rendered; without it there is no sitemap,
because a sitemap of relative URLs is not one.

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you cannot
change.
**The root layout is the document, and hydration checks all of it.** Anything
that rewrites the HTML between the build and the browser — a CDN that inlines
web fonts, obfuscates email addresses, or defers scripts — changes a tree React
is about to reconcile, and hydration fails on the difference. The way to be
unaffected is to give such a service nothing to rewrite: serve the assets from
the same origin rather than linking them from another one.

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched
  error.tsx             shown in place of what is below when it throws
  old/redirect.ts       /old sends the visitor elsewhere
  products/
    page.tsx            /products
    [id]/page.tsx       /products/:id
  (docs)/               a route group: its own layout, no URL segment
    layout.tsx
    guide/page.tsx      /guide
  _parts/               private to the route above it; never a route
  _data/                the same, for anything that is not a component
```

- `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx` and `redirect.ts`
  are the only filenames the grammar accepts. Anything else lives under a
  `_`-prefixed directory, which the grammar skips entirely.
- **A page receives `params`; a layout receives `children`.** Server Components
  cannot read context, so nesting is by prop. Both also receive `pathname` —
  the URL this render is for, which is how a component above a parameter can
  see the value that parameter names.
- A directory name is a literal URL segment, `[name]` is a parameter, `(name)`
  is a group, and `_name` is private.

```tsx
// src/routes/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>{params.id}</h1>;
}
```

<!-- shared:refuses -->

### What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                                     | error                                                                                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                                 | `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                                     | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                                          |
| `pro ducts/page.tsx`                                 | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                                          |
| `[id]/things/[id]/page.tsx`                          | `":id" is already taken by an ancestor — params must be unique within a path`                                                    |
| `orphan/layout.tsx` and no page below                | `has a layout but no page.tsx below it, so it can never render`                                                                  |
| `(a)/page.tsx` and `(b)/page.tsx`                    | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                                                    |
| `(docs/page.tsx`                                     | `"(docs" is not a valid route group — use (name)`                                                                                |
| `products/sub/layout.tsx` and no page anywhere below | `declares no route — every directory needs a page.tsx somewhere below it`                                                        |
| `(shop)/[id]/page.tsx` beside `about/page.tsx`       | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                                      |
| `old/page.tsx` and `old/redirect.ts`                 | `"old" cannot both render page.tsx and redirect — keep one`                                                                      |

The generated table lists literal segments before parameters, so `about/`
beside `[slug]/` is reachable without saying anything. A route group holds
both kinds under one key and the table cannot interleave across it, which is
the one shape where a declared route can still be shadowed — so it is reported
rather than shipped.

<!-- /shared:refuses -->

<!-- shared:generated -->

## The generated files

The framework writes `.k8ordo/` and keeps it in step with the directories.
It is generated, ignored by git, and not yours to edit — but it is ordinary
source, so it is yours to read:

```ts
// .k8ordo/routes.gen.ts
import { defineRoutes } from '@k8ordo/router';

import layout from '../src/routes/layout';
import page from '../src/routes/page';
import products_id_page from '../src/routes/products/[id]/page';
import products_page from '../src/routes/products/page';

export const routes = defineRoutes({
  '/': {
    layout: layout,
    children: {
      '/': page,
      '/products': {
        children: { '/': products_page, '/:id': products_id_page },
      },
    },
  },
});
```

`.k8ordo/register.gen.ts` wires that table into `@k8ordo/router` — and into
`@k8ordo/state` when the application depends on it — so typed paths work
everywhere without a line of ceremony:

```tsx
import { href } from '@k8ordo/router';

<a href={href('/products/:id', { id })}>…</a>; // checked against routes/
```

<!-- /shared:generated -->

<!-- shared:params -->

## Parameters with a schema

A parameter arrives as a string, because a URL carries nothing else. A page —
or a layout, for every page below it — may say what it expects instead
(`paramsSchema`, not `params`: the page's own prop is `params`, and a
module-level binding of the same name would shadow it):

```tsx
// src/routes/products/[id]/page.tsx
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: { params: { id: number } }) {
  return <h1>{params.id}</h1>; // a number — the schema said so
}
```

The generator sees the `paramsSchema` export and wires it in: the schemas along a
page's stack — every layout above it that declared one, then its own — run
before the page renders, each replacing the strings it names with what it
produced, and the generated `Page<…>` type is what the file's own props are
checked against. A schema may name only the params its pattern has; naming
another is a build error where the table is generated. Any library that
implements Standard Schema works — zod, zod/mini, or another — and the schema
must be synchronous, because which pattern answers a pathname is decided
before anything renders. The file that exports it must be a Server Component
file: from a `'use client'` module the export reaches the handler as a client
reference, not a schema. A layout that has to be a client component keeps its
schema in a Server Component `layout.tsx` that renders the client shell.

**A refused param is a pathname the pattern does not answer.** `/products/shoes`
does not become a page that renders with `NaN`; the walk goes on to whatever
the table declares next, which in the end is `not-found.tsx` under a real
404 — exactly as if the directory had never matched. A catch-all's own params
are never validated: it answers what nothing else did, and a 404 is already
what a refused param means.

**Links take what the page receives.** The generated `Register` carries the
schema's output type per pattern, so `href('/products/:id', { id: 42 })` takes
the number and spells it the one way the schema will read back; a string there
is a type error, as is an object.

A layout receives its params as strings whatever it declared — under
`not-found.tsx`, where nothing is validated, a typed value would be a lie. A
layout that wants the parsed value beside the page's parses it itself, or
declares the schema and lets the pages below it receive the result.

<!-- /shared:params -->

## Errors

An `error.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows in
place of everything below it when that throws — inside the layout, so the
frame survives the failure. It is a client component, because catching a
render error is something only the browser can do:

```tsx
// src/routes/error.tsx
'use client';

export default function RouteError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return (
    <section>
      <p>something went wrong</p>
      <button onClick={reset} type="button">
        try again
      </button>
    </section>
  );
}
```

`reset` renders the subtree again in place; navigating away clears the
failure on its own. The nearest `error.tsx` above the throw is the one that
answers, and the root one catches everything below the root layout. Without
any, a failed client navigation falls back to a document load, so the server's
own answer — its 500, its error page — is what the visitor sees.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration. In production the error the browser sees
carries a digest, not the message — the message is in the server's log.

At build time that rule does not apply: a page that throws while being
rendered into a file is not a page, and the build stops naming it —
`static build could not render /broken` — rather than writing an HTML whose
error shows only once a visitor's browser has rendered it. `error.tsx` under
this mode is for what fails in the browser: a client component, after
hydration.

## Redirects

A directory that has moved keeps a `redirect.ts` instead of a `page.tsx`:

```ts
// src/routes/old/redirect.ts
export default '/products';
// or: export default { to: '/:locale/new', permanent: true };
```

The target is a pattern the matched params fill in, so `/:locale/legacy` can
send to `/:locale/new`. A redirect is consulted before the table — a
directory that redirects has no page to render — and a directory cannot hold
both. In this mode the redirect is written as a page that sends the visitor
on (`<meta http-equiv="refresh">` and a link), because no server will ever
send the status; there is no `index.rsc` beside it, so a client navigation to
it hands the URL to the browser, which loads that page and follows it.

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

## Execution boundaries

Server is the default: a file with no directive is a Server Component. The
browser side is opted into with React's own word for it.

```tsx
// src/routes/_parts/counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

A Server Component imports it like anything else, and only that component
crosses:

```tsx
import { Counter } from './_parts/counter';

export default function HomePage() {
  return <Counter />; // the page stays on the server
}
```

<!-- shared:browser-only -->

### Components that need a browser

A client component that reads something only a browser has — `localStorage`,
the visitor's time zone, `navigator` — says so with React's `use(browser())`
(`browser` from `react-dom`), under a `<Suspense>`:

```tsx
'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('the draft is stored in localStorage'));
  return <textarea defaultValue={localStorage.getItem('draft') ?? ''} />;
}

export function Editor() {
  return (
    <Suspense fallback={<p>loading the draft…</p>}>
      <SavedDraft />
    </Suspense>
  );
}
```

The server render — a build into files as much as a request — leaves the
fallback in the HTML, and the browser renders the component after hydration.
That is not a failure: the build does not stop for it and the handler logs
nothing. The `<Suspense>` is not optional: without one above it the server
render has nowhere to leave the fallback, and fails. This is what a
`typeof window` check or a "mounted" flag used to do; neither is needed.

<!-- /shared:browser-only -->

<!-- shared:server-only -->

### Server-only modules

A module that imports `server-only` may never reach the client:

```ts
// src/routes/_data/catalog.server.ts
import 'server-only';

export const listProducts = () => db.query('select …');
```

The build fails when one does, and names the whole chain that got it there —
including through a client component's graph, which is assembled while
rendering rather than crawled from an entry:

```
'server-only' cannot be imported in client build ('ssr' environment):
 imported by src/routes/_data/catalog.server.ts
  imported by src/routes/_parts/counter.tsx
   imported by virtual:vite-rsc/client-references
```

Secrets and database clients behind that import cannot cross however many
modules sit in between. `server-only` is the package React's own ecosystem
uses for this; the build resolves the specifier itself, and installing it is
what lets TypeScript resolve it too.

**Name such a file `*.server.ts`.** The guarantee comes from the import; the
name is so a reader sees it in the directory tree and at every import site,
without opening the file. A third-party module that does not mark itself can
be wrapped in one of these to come under the same check.

<!-- /shared:server-only -->

## Routes with parameters

Static rendering cannot invent parameter values, so it asks for them:

```ts
framework({
  paths: async () => {
    const products = await readCatalog();
    return products.map((product) => `/products/${product.id}`);
  },
});
```

The patterns that still need covering are handed in, so a parameter that takes
the same values everywhere — a locale segment, say — is expanded rather than
listed once per page:

```ts
framework({
  paths: (patterns) =>
    patterns.flatMap((pattern) =>
      ['ja', 'en'].map((locale) => pattern.replace('/:locale', `/${locale}`)),
    ),
});
```

A parameterised route with no path supplied **fails the build**:

```
static build needs pathnames for /products/:id — supply them with the "paths" option
```

Shipping a site quietly missing half its pages is worse than not shipping one.
Parameterless routes need no declaration; they are taken from the table.

The other direction counts too — a supplied pathname nothing matched costs
exactly the page it was meant to add:

```
the "paths" option supplied pathnames no route wants: /produtcs/2
```

which is either a typo or a value that still contains a parameter
(`/ja/blog/:slug` — what expanding only one of two parameters leaves behind).
Pathnames are taken as a URL carries them, so `href()` output is accepted as
is. A supplied pathname whose page declares a `params` schema that refuses it
fails the build too — it would otherwise be written as a 404 page under a
URL the site claims to have:

```
the "paths" option supplied pathnames a params schema refused: /products/shoes
```

## The output

```
dist/
  client/
    index.html            /
    index.rsc             the same page as a payload
    products/
      index.html          /products
      index.rsc
      1/index.html        /products/1
      1/index.rsc
    404.html              not-found.tsx, rendered
    sitemap.xml           every page above, when `site` is set
    assets/…              the client bundle
  rsc/  ssr/              the machinery that produced the above
```

Serve `dist/client/` with anything. A page arrives as HTML with the payload
it was rendered from written into it, so hydration reads what the server read
rather than asking for the page again. From there, a link to another page
fetches that page's `index.rsc` instead of reloading the document — navigation
stays client-side even though the site is a pile of files. The payload lives
at a path rather than behind a header or a query because static hosting varies
on neither.

A URL the site does not have is nobody's to render in the browser: the answer
is not a payload, so the navigation becomes an ordinary document load and the
host answers it — with `404.html` and a real 404. That is also what happens
for the files sitting beside the site, so a link to `/robots.txt` fetches the
file rather than disappearing into the router. Mark a link the host answers
with a download as `<a href="/report.csv" download>`: the browser tells the
router before the click, where `Content-Disposition` only arrives with the
answer, by which time the URL has been committed.

`not-found.tsx` becomes `404.html`, the file most static hosts serve for an
unknown URL. Declaring a not-found page in this mode therefore means
something, even though nothing is running to route the request. Only one can
be represented, wherever it sits — under a locale segment is fine — because a
host has one blanket 404; a table declaring two fails the build rather than
silently picking one:

```
a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /*, /:locale/*
```

That one file is rendered for a pathname the site does not have, which is what
any 404 is. Its `pathname` is such a URL, and where a parameter sits above
`not-found.tsx`, that parameter is filled with a segment no route declared —
so `params.<name>` there is not a value the application named. Treat it as you
must treat any parameter under a running server, where `/:locale/*` matches
`/fr/anything` too: validate it, and read what the visitor actually typed from
`usePathname()` in a client component after hydration. A visitor without
JavaScript keeps whatever that render produced.

## Alongside the rest of k8ordo

`@k8ordo/state` owns the search params, and this framework generates its
`Register` for you, so a filter is typed against the same routes:

```tsx
'use client';
import { useAppState } from '@k8ordo/state';

const [{ q }, update] = useAppState(listState, ['q']);
```

Changing the search does not change the page: the router leaves the route tree
alone, nothing remounts, and the scroll position stays where the reader left
it. `@k8ordo/form` pairs with it for search and filter forms, which are GET
forms and work before JavaScript loads — a good fit for a static site.

A page never sees the search: `useAppState` reads it in the browser, so a
server render shows the url slot's defaults and the live URL takes over on
hydration. That is the same split the router draws at the `?` — the pathname
is the framework's, everything after it is state's.

## What static cannot do

Anything that needs the request: Server Actions and `redirect()` from them,
the `request` a page reads under `@k8ordo/server`, and status codes the
application decides. A file cannot receive a form submission, and
whether `404.html` is served with a 404 rather than a 200 is the host's
setting — the build can write the page, but not the response.

If the application needs any of that, it wants `@k8ordo/server`. Everything
above stays exactly as it is.
