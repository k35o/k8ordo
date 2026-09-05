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

`vite dev` is a running server and will happily accept that POST, which is why
the answer is a build that stops rather than a note in a guide.

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

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you cannot
change.

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched
  products/
    page.tsx            /products
    [id]/page.tsx       /products/:id
  (docs)/               a route group: its own layout, no URL segment
    layout.tsx
    guide/page.tsx      /guide
  _parts/               private to the route above it; never a route
  _data/                the same, for anything that is not a component
```

- `page.tsx`, `layout.tsx` and `not-found.tsx` are the only filenames the
  grammar accepts. Anything else lives under a `_`-prefixed directory, which
  the grammar skips entirely.
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

### What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                                     | error                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                                 | `routes/ holds only page.tsx, layout.tsx and not-found.tsx — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                                     | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                     |
| `pro ducts/page.tsx`                                 | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                     |
| `[id]/things/[id]/page.tsx`                          | `":id" is already taken by an ancestor — params must be unique within a path`                               |
| `orphan/layout.tsx` and no page below                | `has a layout but no page.tsx below it, so it can never render`                                             |
| `(a)/page.tsx` and `(b)/page.tsx`                    | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                               |
| `(docs/page.tsx`                                     | `"(docs" is not a valid route group — use (name)`                                                           |
| `products/sub/layout.tsx` and no page anywhere below | `declares no route — every directory needs a page.tsx somewhere below it`                                   |
| `(shop)/[id]/page.tsx` beside `about/page.tsx`       | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                 |

The generated table lists literal segments before parameters, so `about/`
beside `[slug]/` is reachable without saying anything. A route group holds
both kinds under one key and the table cannot interleave across it, which is
the one shape where a declared route can still be shadowed — so it is reported
rather than shipped.

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
is.

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

Anything that needs the request: Server Actions, per-request data, and status
codes the application decides. A file cannot receive a form submission, and
whether `404.html` is served with a 404 rather than a 200 is the host's
setting — the build can write the page, but not the response.

If the application needs any of that, it wants `@k8ordo/server`. Everything
above stays exactly as it is.
