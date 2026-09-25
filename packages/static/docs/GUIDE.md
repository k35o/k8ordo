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

A `guard.ts` — what `@k8ordo/server` runs before a request is answered — is
refused the same way, by name, in the build and in `vite dev`: a file is never
requested of anything that could run one.

```
static build cannot run guard.ts — a file has no request to guard, and these are guards:
  src/routes/admin/guard.ts
this application wants @k8ordo/server
```

Choosing the other mode means installing `@k8ordo/server` instead, and nothing
else about the application changes — the same route grammar, the same
boundaries, the same request handler, called for each route at build time
instead of once per request. The plugin is called `framework()` in both
packages for that reason: the mode is the import, and `vite.config.ts` reads
the same either way.

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
vite dev     # renders per request, with Fast Refresh (the framework brings
             # React's plugin)
vite build   # dist/client/ is the site
```

`vite dev` runs the same handler but writes no files, so it is not the build:
a param value `paths` does not list still renders, a `redirect.ts` answers
with a `307` (`308` when `permanent`) rather than a page that sends the
visitor on, an unknown URL gets the handler's 404 rather than the host's
`404.html`, and a page whose Server Component throws answers a `500` carrying
the thrown message, not `error.tsx` — the build would stop there.

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

- `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `redirect.ts` and
  `guard.ts` are the only filenames the grammar accepts — and this mode
  refuses `guard.ts` (above). Anything else lives under a
  `_`-prefixed directory. A file or directory whose name starts with `_` or
  `.` is skipped entirely.
- **A page receives `params`; a layout receives `children`.** Server Components
  cannot read context, so nesting is by prop. Both also receive `pathname` —
  the URL this render is for, which is how a component above a parameter can
  see the value that parameter names.
- A directory name is a literal URL segment, `[name]` is a parameter, `(name)`
  is a group, and `_name` (or `.name`) is private.

```tsx
// src/routes/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>{params.id}</h1>;
}
```

<!-- shared:refuses -->

### What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                                                          | error                                                                                                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `products/helper.ts`                                                      | `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts, guard.ts — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                                                          | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                                                    |
| `pro ducts/page.tsx`                                                      | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                                                    |
| `[id]/things/[id]/page.tsx`                                               | `":id" is already taken by an ancestor — params must be unique within a path`                                                              |
| `orphan/layout.tsx` and no page below                                     | `has a layout but no page.tsx below it, so it can never render`                                                                            |
| `(a)/page.tsx` and `(b)/page.tsx`                                         | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                                                              |
| `(docs/page.tsx`                                                          | `"(docs" is not a valid route group — use (name)`                                                                                          |
| `empty/error.tsx` and no page or redirect below                           | `declares no route — every directory needs a page.tsx (or redirect.ts) somewhere below it`                                                 |
| `(shop)/sale/page.tsx` and `(shop)/[id]/page.tsx` beside `about/page.tsx` | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                                                |
| `old/page.tsx` and `old/redirect.ts`                                      | `"old" cannot both render page.tsx and redirect — keep one`                                                                                |

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
the walk reaches that pattern, before the page renders, and `guards` the
`guard.ts` files that run before a pattern answers, outer first (a mode that
builds files refuses them); all three are empty here because no route file
declares any.

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

<!-- shared:params -->

## Parameters with a schema

A parameter arrives as a string, because a URL carries nothing else. A page —
or a layout, for every page below it — may say what it expects instead
(`paramsSchema`, not `params`: the page's own prop is `params`, and a
module-level binding of the same name would shadow it):

```tsx
// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return <h1>{params.id}</h1>; // a number — the schema said so
}
```

The generator sees the `paramsSchema` export and wires it in: the schemas along a
page's stack — every layout above it that declared one, then its own — run
before the page renders, each replacing the strings it names with what it
produced. `PageProps<'/products/:id'>` from `@k8ordo/router` is those props
by the pattern — `params` typed by the schemas, and `pathname` — read from
the generated `Register`, so nothing in the page depends on which mode is
installed; a page may equally declare its props inline (`{ params: { id:
number } }`), since the generated table checks them where it uses the
component either way.
The export is found by parsing the file, so any spelling of it counts —
`export const { paramsSchema } = locales` included — and the words inside a
string or a comment do not. The generated table checks each schema against
its file's pattern, and only loosely: on a pattern that has params, a schema
that names none of them is a type error there, which type-checking reports and
`vite build` does not; anything else passes. A schema that requires a param a
page's pattern lacks refuses every pathname of that page, so that page never
answers. Any library that implements Standard Schema works — zod, zod/mini, or
another — and the schema must be synchronous, because which pattern answers a
pathname is decided before anything renders. The file that exports it must be
a Server Component file: from a `'use client'` module the export reaches the
handler as a client reference, not a schema. A layout that has to be a client
component keeps its schema in a Server Component `layout.tsx` that renders the
client shell.

**A refused param is a pathname the pattern does not answer.** `/products/shoes`
does not become a page that renders with `NaN`; the walk goes on to whatever
the table declares next, which in the end is `not-found.tsx` under a real
404 — exactly as if the directory had never matched. A catch-all is never
refused: it answers what nothing else did, and a 404 is already what a refused
param means. The schemas of the layouts above its `not-found.tsx` still run
over its params, for what they write to the render — the locale of
`/en/missing` is the one `@k8ordo/i18n`'s schema accepted — and when one
refuses (`/fr/missing`), the not-found renders as if none had run.

**Links take what the page receives.** The generated `Register` carries the
schema's output type per pattern, so `href('/products/:id', { id: 42 })` takes
the number and spells it the one way the schema will read back; a string there
is a type error, as is an object.

A layout receives its params as strings whatever it declared — under
`not-found.tsx`, which renders whatever the schemas said, a typed value would
be a lie, and a not-found receives strings for the same reason. A layout that
wants the parsed value beside the page's parses it itself, or declares the
schema and lets the pages below it receive the result.

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
any, a failed client navigation falls back to a document load, which here
loads the page's prerendered file — there is no server to answer with a 500
or an error page of its own.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration.

At build time that rule does not apply to a Server Component: a page whose
Server Component throws while being rendered into a file is not a page, and
the build stops rather than writing an HTML whose error shows only once a
visitor's browser has rendered it. The thrown message is logged beside the
page's URL, and the build ends naming every page that failed,
`static build could not render /broken — see the error above` — whether or
not a Suspense boundary sits above the throw. A `not-found.tsx` that throws
is named as `404.html`. A client component that throws while the build
renders the HTML is left to the browser when a Suspense boundary sits above
it, and the file is written; with none, it stops the build the same way.
`error.tsx` under this mode is for what fails in the browser: a client
component, after hydration.

<!-- shared:not-found -->

## A page that is not there

A params schema decides what a URL's params look like; whether the thing they
name exists is the page's to say. `notFound()` from `@k8ordo/router` says it:

```tsx
// src/routes/products/[id]/page.tsx
import { notFound } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}
```

It throws, so the lines after it never run, and the page is answered instead
by what the table answers for a URL nothing matched there — the nearest
`not-found.tsx` above it, inside the layouts above that — under a 404. With no
`not-found.tsx` at all, the framework's own answers. It comes from the router
rather than the mode package, so the page reads the same under either.

`notFound()` is the page's word about itself: thrown from the page's own
component, before it returns.

<!-- /shared:not-found -->

**A build waits for the whole page**, so `notFound()` counts from anywhere in
it. A pathname the `paths` option supplied whose page says it fails the build,
naming the pathname — it would otherwise be written as a 404 page under a URL
the site claims to have (see Routes with parameters, below).

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
    patterns.flatMap((pattern) => {
      const segments = pattern.split('/');
      if (!segments.includes(':locale')) return [pattern];
      return ['ja', 'en'].map((locale) =>
        segments
          .map((segment) => (segment === ':locale' ? locale : segment))
          .join('/'),
      );
    }),
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
Pathnames are taken as a URL carries them, escapes included
(`/products/caf%C3%A9`) — `href()` output as it is, unless the application is
served under a `base`: these are pathnames in the table's terms, and `href()`
puts the base in front. Only the file name is decoded, and a pathname whose escapes do not decode,
or that decodes to a `..` segment, fails the build — neither names a file
inside the output:

```
the "paths" option supplied a pathname with a malformed escape: /products/%zz
the "paths" option supplied a pathname that leaves the output: /products/..%2F..
```

A supplied pathname that a `paramsSchema` along its route's stack refuses
fails the build too — it would otherwise be written as a 404 page under a
URL the site claims to have — and so does one whose page says `notFound()`:

```
the "paths" option supplied pathnames a params schema refused: /products/shoes
the "paths" option supplied pathnames whose page called notFound(): /products/3
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
it was rendered from written into it, so hydration reads what the build
rendered rather than asking for the page again. From there, a link to another
page fetches that page's `index.rsc` instead of reloading the document —
navigation stays client-side even though the site is a pile of files. The
payload lives at a path rather than behind a header or a query because static
hosting varies on neither.

A URL the site does not have is nobody's to render in the browser: the answer
is not a payload, so the navigation becomes an ordinary document load and the
host answers it — with `404.html` and a real 404. That is also what happens
for the files sitting beside the site, so a link to `/robots.txt` fetches the
file rather than disappearing into the router. Mark a link the host answers
with a download as `<a href="/report.csv" download>`: the navigate event then
already says it is a download, and the router leaves it to the browser, where
`Content-Disposition` only arrives with the answer, by which time the URL has
been committed.

`not-found.tsx` becomes `404.html`, the file most static hosts serve for an
unknown URL. Declaring a not-found page in this mode therefore means
something, even though nothing is running to route the request. Only one can
be represented, wherever it sits — under a locale segment is fine — because a
host has one blanket 404; a table declaring two fails the build rather than
silently picking one:

```
a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /:locale/*, /*
```

That one file is rendered for a pathname the site does not have, which is what
any 404 is. Its `pathname` is such a URL, and where a parameter sits above
`not-found.tsx`, that parameter is filled with a segment no route declared —
so `params.<name>` there is not a value the application named. Treat it as you
must treat any parameter under a running server, where `/:locale/*` matches
`/fr/anything` too: validate it, and read what the visitor actually typed from
`usePathname()` in a client component. The browser does not hydrate this file:
it was rendered for another URL, so anything a component reads from the URL
while it renders (`@k8ordo/i18n`'s messages read the locale segment) would
disagree with it. The browser renders it afresh instead, where the visitor is,
and a client component sees their URL from its first render. A visitor
without JavaScript keeps whatever the build's render produced.

<!-- shared:prefetch -->

### Fetching the next page ahead

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

<!-- shared:deploys -->

### A tab opened before a deploy

A tab keeps running the script it loaded, while every payload it fetches
comes from whatever is deployed now — and a new deploy may render a client
component that script has never heard of. So every payload names the client
it was rendered for, the URL of the script its page's HTML loads, and one
that names another script is never rendered: the navigation becomes a
document load of the same URL, and the visitor gets the new page with the
script that can render it instead of `error.tsx`. Under `@k8ordo/server` a
Server Action's answer is held to the same rule: the page is loaded again
rather than the answer applied.

The bundler hashes into that URL everything the script can load, so a deploy
that changed nothing the browser runs leaves every open tab navigating in
place, and servers built apart from the same source agree.

<!-- /shared:deploys -->

<!-- shared:base -->

## Served under a base

An application served below the root of its origin — `https://example.com/docs/`
— says so with Vite's `base`, and nothing else in it changes:

```ts
// vite.config.ts
export default defineConfig({
  base: '/docs/',
  plugins: [framework()],
});
```

`routes/` is still written from the application's root:
`routes/products/page.tsx` is `/products` in the table and `/docs/products`
in the address bar. What crosses between the two gains or loses the base on
the way:

- A link built with `href()` or `navigateTo()` carries it. A page receives
  `pathname` without it, and `usePathname()` returns it without it.
- A page's payload sits beside it — `/docs/products/index.rsc` — and the
  client build's files are under `/docs/assets/`.
- A `redirect.ts` target is written from the root, like the table, and is
  sent with the base in front; one that names another origin is sent as
  written. `redirect()` from a Server Action takes a URL, so build it with
  `href()`.
- A URL outside the base is none of the application's: the handler answers
  it with a `404`, and the client runtime leaves it to the browser.

Under `@k8ordo/static` the pages are written into `dist/client/` at their
pathnames in the table, so the host serves that directory at `/docs/`; the
`paths` option takes pathnames without the base, and `sitemap.xml` lists
each page at its URL, base included. Under `@k8ordo/server`, `serve` reads
the base the build was made for from `dist/rsc/index.js` and hands out the
client build's files below it; a host calling the handler itself passes the
URL as the visitor asked for it, base included.

The base has to be a path from the root. A relative base (`./`) or another
origin says nothing about which URL is which page, and the build refuses it:

```
k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got './'
```

<!-- /shared:base -->

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
the `request` a page reads under `@k8ordo/server`, a `guard.ts` deciding
whether a request gets through, and status codes the application decides. A file cannot receive a form submission, and
whether `404.html` is served with a 404 rather than a 200 is the host's
setting — the build can write the page, but not the response.

If the application needs any of that, it wants `@k8ordo/server`. Everything
above stays exactly as it is.
