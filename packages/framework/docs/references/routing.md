# Routing

How the framework turns `src/routes/` into the application's URLs.
Installing and configuring it is in [the guide](../GUIDE.md).

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched
  error.tsx             shown in place of what is below when it throws
  loading.tsx           shown while what is below it loads
  guard.ts              runs before whatever answers below it (server mode)
  old/redirect.ts       /old sends the visitor elsewhere
  feed.xml/route.ts     /feed.xml answered by its GET, not a page
  products/
    page.tsx            /products
    [id]/page.tsx       /products/:id
    [id]/fallback.tsx   the ids a static build did not write (static mode)
  (docs)/               a route group: its own layout, no URL segment
    layout.tsx
    guide/page.tsx      /guide
src/components/         components: outside routes/, so never a route
src/lib/                every other module, flat
```

- `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`,
  `fallback.tsx`, `paths.ts`, `redirect.ts`, `guard.ts` and `route.ts` are
  the only filenames the grammar accepts. `mode: 'static'` refuses
  `guard.ts` ([Choosing a mode](../GUIDE.md#what-static-mode-refuses)), and
  `mode: 'server'` never renders `fallback.tsx` and never reads `paths.ts`,
  though it checks where each sits
  ([Values the build did not write](#values-the-build-did-not-write)). Any
  other file is refused: components live outside `routes/` in
  `src/components/` and every other module — Server Actions, schemas, state
  definitions, data, helpers — in `src/lib/`, and a route file imports them
  from there. Only a file or directory whose name starts with `.` is
  skipped, so a `.DS_Store` or an editor's swap file does not break the
  build.
- A directory name is a literal URL segment of letters, digits, `.`, `_`, `~`
  and `-`; `[name]` is a parameter and `(name)` is a group. `_` is an
  ordinary character, so `_drafts/page.tsx` answers `/_drafts`. A name that
  starts with `.` is never read, so `/.well-known` cannot be declared as a
  route.
- **A page receives `params`; a layout receives `children`.** Server Components
  cannot read context, so nesting is by prop. Both also receive `pathname` —
  the URL this render is for, which is how a component above a parameter can
  see the value that parameter names (above a `fallback.tsx`, the shell's
  own, `/posts/!fallback`). Under `mode: 'server'` both also
  receive `request` ([Reading the request](guards.md#reading-the-request)).
- A parameter's values arrive with the request under `mode: 'server'`, and
  need no list. Under `mode: 'static'` the build has no request to take them
  from, and a `paths.ts` in the parameter's directory returns them, for
  every route below it
  ([Routes with parameters](params.md#routes-with-parameters)); a
  `fallback.tsx` beside the page answers the ones it does not return.

```tsx
// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/framework';

import { findProduct } from '../../../lib/catalog.server';

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id); // a Server Component: just read it
  return <h1>{product?.name ?? 'unknown product'}</h1>;
}
```

`PageProps<P>` and `LayoutProps<P>` take a pattern the table has a page at.
A layout whose directory holds no `page.tsx` of its own — `blog/[slug]/`
with only `comments/page.tsx` below it — has no such pattern, so it declares
its props inline. Its params are strings, and under `mode: 'server'` it may
add `request: RouteRequest` (from `@k8ordo/framework/server`) to read the
request:

```tsx
// src/routes/blog/[slug]/layout.tsx
import type { ReactNode } from 'react';

export default function PostLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  return <article data-slug={params.slug}>{children}</article>;
}
```

The generated table checks those props against the pattern at the import,
as it checks every route file's.

## How a page is sent

**Each page loads its own.** `page.tsx`, `not-found.tsx`, `route.ts` and
`fallback.tsx` are imported when a request reaches them, so the client
components each renders and the CSS each imports — its Server Components'
CSS Modules included — are loaded only once a page renders it, or, for a
client component, once a link to such a page is fetched ahead
([Fetching the next page ahead](#fetching-the-next-page-ahead)). What a
`layout.tsx`, `error.tsx` or `loading.tsx` imports, every page below it
loads: import CSS every page needs in the root layout. A route file imported
from anywhere else — a layout importing an export of a page — is in every
page again, and the build warns, naming it.

**What every page loads comes in at most two files.** The client entry's —
React, the router and the framework's own code — and the frame's: the
client components of every `layout.tsx`, `error.tsx` and `loading.tsx`, and
the framework's own boundaries, with everything they import. A module a page
shares with the entry or the frame is in that file, since every page loads
it anyway; what pages share only among themselves stays in files of their
own, loaded by the pages that render it. The framework sets the client
build's `build.rolldownOptions.output.codeSplitting` to do this, so in the
client environment an application's own `manualChunks` is ignored, and a
`codeSplitting` group of its own takes a module from the entry or the frame
only with a `priority` above `2`.

**Under `mode: 'server'` an async page answers, then streams.** The document
waits for the page's own component — its data — before anything is sent,
because the page may still say `notFound()`
([Errors](errors.md#a-page-that-is-not-there)); what the page puts under a
`<Suspense>` follows in the same response as it arrives. The browser hydrates
when the last of it is in place and the client components it renders have
loaded, not before: a boundary still on its way cannot be hydrated, and a
context that changes as the page hydrates — a colour scheme read from the
browser — would make React render it again beside the copy still streaming
in, or put a boundary's fallback in place of a component still loading.
Until then the page is what it is without JavaScript: links load documents
and forms post. A client navigation likewise keeps the page on screen until
the next one's client components have loaded; what the next page puts under
a `<Suspense>` of its own — a `loading.tsx` is one — shows its fallback until
it arrives.

**Under `mode: 'static'` a file is written whole.** The build waits for every
`<Suspense>` boundary on the page and writes each in place, so a file never
carries a hole for a script to fill after hydration has started.

**A Server Component's stylesheet comes before a client component's.** In
`<head>`, every stylesheet Server Components import — the root layout's
first — comes before every one client components import, however the page
was reached: loaded as a document, by a client navigation, or streamed after
the shell under `mode: 'server'`. Where two rules of equal specificity set
the same property on one element, the client component's wins. To have a
Server Component's win, give it a higher specificity, or put the two in
cascade layers and declare their order at the top of the CSS the root layout
imports, the first file in `<head>` to name them:

```css
/* src/styles/globals.css */
@layer base, components, overrides;
```

No order is kept among client components' stylesheets: a file lists them in
the order the render named them, and a client navigation adds each as it
loads. Nor is one taken out: a stylesheet a page loaded, or a link fetched
ahead, applies to every page after it in the tab. Keep the selectors of the
CSS a page or a client component imports to its own elements — a CSS
Module's classes — and import what every page needs in the root layout.

**A script in `<head>` runs before the stylesheets.** React writes what it
hoists into `<head>` — every stylesheet among it — ahead of what the root
layout put there, and a script after a stylesheet waits for it to load,
while the browser may paint the page without what the script sets. So the
framework moves each inline classic script of `<head>` — no `src`, no
`type` — ahead of the first stylesheet there, in the order the layout wrote
them, in either mode and under `vite dev`. It is the place for a script that
has to run before the first paint, such as `@k8ordo/color-scheme`'s:

```tsx
// src/routes/layout.tsx
import { ColorSchemeScript } from '@k8ordo/color-scheme';
import type { LayoutProps } from '@k8ordo/framework';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <ColorSchemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Such a script runs before any of the page's CSS has loaded: it can set a
class or an attribute on `<html>`, but a style it computes reads none of
that CSS. A script with a `src` or a `type` stays where React wrote it, and
so does one inside a `<noscript>` or a `<template>`, and every script in
`<body>`. Under `mode: 'static'` the policy's `<meta>` comes right after
the `<meta charSet>` that opens `<head>` (first in `<head>` when there is
none), ahead of the moved scripts, so the policy covers them
([Content Security Policy](csp.md#static-mode-hashes-in-a-meta)).

## What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                                                          | error                                                                                                                                                                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                                                      | `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts, guard.ts, route.ts, loading.tsx, fallback.tsx, paths.ts — move "helper.ts" out of routes/`                                         |
| `[123]/page.tsx`                                                          | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                                                                                                                             |
| `pro ducts/page.tsx`                                                      | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                                                                                                                             |
| `[id]/things/[id]/page.tsx`                                               | `":id" is already taken by an ancestor — params must be unique within a path`                                                                                                                                       |
| `orphan/layout.tsx` and no page below                                     | `has a layout but no page.tsx below it, so it can never render`                                                                                                                                                     |
| `(a)/page.tsx` and `(b)/page.tsx`                                         | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                                                                                                                                       |
| `(docs/page.tsx`                                                          | `"(docs" is not a valid route group — use (name)`                                                                                                                                                                   |
| `empty/error.tsx` and no page, redirect or route below                    | `declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it`                                                                                                            |
| `(shop)/sale/page.tsx` and `(shop)/[id]/page.tsx` beside `about/page.tsx` | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                                                                                                                         |
| `old/page.tsx` and `old/redirect.ts`                                      | `"old" cannot both render page.tsx and redirect — keep one`                                                                                                                                                         |
| `api/page.tsx` and `api/route.ts`                                         | `"api" cannot both render page.tsx and answer from route.ts — keep one`                                                                                                                                             |
| `old/redirect.ts` and `old/route.ts`                                      | `"old" cannot both redirect and answer from route.ts — keep one`                                                                                                                                                    |
| `api/route.ts` exporting no method                                        | `exports none of GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS — a route.ts answers the methods it exports`                                                                                                          |
| `products/page.tsx` exporting `search`, without `@k8ordo/state`           | `exports search, which is read through @k8ordo/state — add it to the application’s dependencies`                                                                                                                    |
| `feed/[id]/route.ts` and `feed/[id]/fallback.tsx`                         | `fallback.tsx stands in for the page.tsx beside it, and "feed/[id]" has none`                                                                                                                                       |
| `posts/[id]/layout.tsx` beside `posts/[id]/fallback.tsx`                  | `fallback.tsx cannot sit beside layout.tsx — that layout receives every parameter of "posts/[id]", so no shell could leave one to the browser; move the layout one directory up, or into page.tsx and fallback.tsx` |
| `about/page.tsx` and `about/fallback.tsx`                                 | `fallback.tsx stands in for values the build did not write, and "/about" has no parameter; remove it`                                                                                                               |
| `[locale]/layout.tsx` above `[locale]/about/fallback.tsx`                 | `fallback.tsx has nothing to leave to the browser — [locale]/layout.tsx receives every parameter of "/:locale/about"; remove fallback.tsx and return the values from a paths.ts`                                    |
| `posts/paths.ts`                                                          | `paths.ts gives the values of its directory's parameter, and "posts" is not a [param] directory — move it into the parameter's directory`                                                                           |

The generated table lists literal segments before parameters, so `about/`
beside `[slug]/` is reachable without saying anything. A route group holds
both kinds under one key and the table cannot interleave across it, which is
the one shape where a declared route can still be shadowed — so it is reported
rather than shipped.

The `fallback.tsx` and `paths.ts` rows hold in both modes, so switching
modes needs no change to the files. `mode: 'static'` refuses more on top of
these: whatever needs a request
([What static mode refuses](../GUIDE.md#what-static-mode-refuses)), a
parameter no `paths.ts` gives values to
([Routes with parameters](params.md#routes-with-parameters)), and a shell
standing where it cannot
([What else stops the build](params.md#what-else-stops-the-build)).

## The values of a parameter

Under `mode: 'static'`, a `paths.ts` is what the build asks for the values
a parameter takes: its default export, a function typed `Paths<Pattern>`,
returns them, and every page, `route.ts` and `redirect.ts` below its
directory is written once per value. What it is handed, what a value is and
where it runs are in
[Routes with parameters](params.md#routes-with-parameters); the grammar's
part is where it may sit.

- **In a `[param]` directory**, whose parameter it gives values to. In the
  root, a literal directory or a group it is refused.
- **With or without a `page.tsx` beside it.** The values are for whatever
  sits below: `[locale]/paths.ts` beside only a `layout.tsx` gives the
  locale of every page under it.
- **With or without a `fallback.tsx` beside it.** With both, the values
  returned are written as pages and the shell answers the rest.

Under `mode: 'server'` it is not read, and nothing of it is built.

## Values the build did not write

Under `mode: 'static'`, a `fallback.tsx` beside a `page.tsx` is what the
values no `paths.ts` returns are answered with: a shell, the layouts above
written as HTML with the `fallback.tsx` in the page's place, which a host
serves for any such value and the browser fills in from the URL. What it
renders, how it reads the value and what it costs are in
[Values the build did not write](params.md#values-the-build-did-not-write);
the grammar's part is where it may sit.

- **Beside a `page.tsx`.** It stands in for that page, so a directory that
  redirects or answers from a `route.ts` cannot have one.
- **Under a pattern with a parameter**, at least one of which no layout
  above it receives. A layout above is written into the shell once, as
  HTML, for every value the shell answers, so a parameter it receives is one
  the shell has to know — given by a `paths.ts` in that parameter's
  directory, which puts a shell below each of its values
  (`/ja/posts/:id`). The parameters left to the browser are the rest.
- **With no `layout.tsx` beside it.** That layout would receive every
  parameter, and leave the browser none. Move it one directory up, where it
  no longer receives the parameter, or put its markup inside `page.tsx` and
  `fallback.tsx`.

It receives no props, and an `error.tsx` or `loading.tsx` beside it or above
wraps it as it wraps the page. It answers its own page's pattern and nothing
below it: `posts/[id]/comments/page.tsx` is written for the values
`posts/[id]/paths.ts` returns, or keeps a `fallback.tsx` of its own, and a
`redirect.ts` or `route.ts` there answers only the values returned.

Under `mode: 'server'` every value is rendered by its page, per request, and
nothing of a `fallback.tsx` is built.

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

It receives no props. It shows for whatever inside the page suspends as it
streams, and when a client navigation enters its directory with the next
page's payload begun but the page in it not yet arrived. Until that payload
begins to arrive the current page stays on screen, and a page change below
one already on screen keeps the current page showing while the next one
loads — every page change renders in the background — so
`usePendingPathname()` is how a link or a bar says that one is under way:

```tsx
'use client';

import { usePendingPathname } from '@k8ordo/framework';

export function Progress() {
  const pending = usePendingPathname();
  return pending === null ? null : <p role="status">loading {pending}…</p>;
}
```

How often it shows depends on the mode. Under `mode: 'server'` a document
waits for the page's own component before anything is sent and writes the
page in place, so its HTML does not show it, and a visitor without
JavaScript, or a crawler, reads the page; what the page put under a
`<Suspense>` of its own shows that boundary's fallback meanwhile. The
exception is a component inside the page that awaits data outside a
`<Suspense>` of its own: it holds the page back, and the HTML shows the
`loading.tsx` in its place. A client navigation's payload streams from the
start, so a navigation shows it while the server is still rendering the
page. Under `mode: 'static'` a file
is written whole and never shows one, and a navigation's payload is a file
too, which usually arrives in one piece — a navigation seldom shows it, and
`usePendingPathname()` is what is seen meanwhile.

## Answers that are not pages

A `route.ts` answers its directory's URL with a `Response` rather than a
page — an RSS feed, `robots.txt`, JSON, a webhook. It exports a function for
each request method it answers:

```ts
// src/routes/feed.xml/route.ts
import type { RouteContext } from '@k8ordo/framework';

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
`RouteContext<P>` is that type, and the generated table checks each module
against its pattern. A `route.ts` exporting none of `GET`, `HEAD`, `POST`,
`PUT`, `PATCH`, `DELETE` and `OPTIONS` is refused, since it could only ever
answer `405`.

A directory answers from a `route.ts` or renders a `page.tsx` (or redirects),
never two of them, and the layouts above a `route.ts` do not wrap it —
nothing renders. It takes its place in the table's order the way a page does,
literals before params, so `api/[id]/route.ts` beside `api/latest/page.tsx`
leaves `/api/latest` to the page. A client navigation to it gets no payload,
and loads the document instead.

### Under server mode

Any of the seven methods may be exported, and each answers only its own; a
`HEAD` with no export of its own is its `GET` with the body left off, and a
method it does not export gets a `405` whose `Allow` names the ones it does.
The guards above it run first. A `POST` to a `route.ts` is not held to the
same-origin rule a Server Action is — what posts to one, a webhook, is not a
form on this site — so it checks what it needs itself. It answers the request
as much as a guard does: [`cookies()`](guards.md#cookies),
`responseHeaders()` and `requestHeaders()` work inside it.

### Under static mode

The build calls its `GET` once for each pathname the site has — a pattern
with params takes its values from the `paths.ts` files above it, as a
page's does ([Parameters](params.md#routes-with-parameters)) — with a request whose
origin is `site` when that option is given (an RSS feed's links are
absolute), and writes what it answered as the file at that pathname:
`dist/client/feed.xml`. A file keeps no type of its own, so a static host
serves it with the type its extension says — `vite preview` and `serve` too,
which send a file with no extension as `application/octet-stream`. On
Vercel, `vercel()` serves it with the `Content-Type` its `GET` answered, the
type `vite dev` sends ([Deploying to Vercel](deploy.md#deploying-to-vercel)).
The `GET` has to answer `200`; anything else stops the build naming the
pathname. A file answers nothing but `GET`, so a `route.ts` exporting
another method is refused by name, in the build and in `vite dev`:

```
static build writes a route.ts as the file its GET answers, and a file cannot answer another method — these export one:
  src/routes/api/route.ts (POST)
this application wants mode: 'server'
```

The methods are read by name, so a `route.ts` that re-exports another
module with `export * from` is refused too: what it brings could be a `POST`
the build never sees. `export { GET } from '../../lib/feed'` names it.

A `route.ts` at `/` cannot be a file (the host serves `/` from `index.html`),
nor one with pages written below it, which would need a directory of the same
name. What it writes is not a page, so `sitemap.xml` leaves it out.

Nor can a `route.ts` write a file the build writes itself — `404.html`
beside a `not-found.tsx`, `_redirects` when there are shells,
`client-files.json`, a page's `index.html` or `index.rsc` — since one would
replace the other. It stops before it renders anything, naming every such
`route.ts` in one error, each beside what is in its way:

```
static build writes a route.ts as the file its GET answers, and these cannot be written — remove the route.ts, or what else is written there:
  client-files.json: src/routes/client-files.json/route.ts, and the build lists there what each page loads beyond its payload
```

`sitemap.xml` is the exception: a `route.ts` there is the application's own
list of the site, with the dates and priorities only it knows, so the build
writes none of its own and leaves the file to it — `site` given or not. Keep
`site` all the same: it is the origin of the `request.url` every `route.ts`
is handed, which a sitemap's absolute URLs are built from. Rules of your own for a host go in
`public/_redirects`, which the build adds to its own. `vite dev` does not
stop: only the build writes the files.

Name the type in the `Response`. A string body with none is sent as
`text/plain;charset=UTF-8` — the `Response` sets it — so a `sitemap.xml`
returned that way is plain text on Vercel and in `vite dev`, whatever its
extension says. `vite dev` shows it before a deploy does.

## The generated files

The framework writes `.k8ordo/` and keeps it in step with the directories.
It is generated, ignored by git, and not yours to edit — but it is ordinary
source, so it is yours to read:

```ts
// .k8ordo/routes.gen.ts
import { defineRoutes } from '@k8ordo/framework/generated';
import type { ParamsOf, ParsedParams } from '@k8ordo/framework/generated';
import { lazy } from 'react';
import type { ComponentType, ReactNode } from 'react';

import layout from '../src/routes/layout';

const page = () => import('../src/routes/page');
const products_page = () => import('../src/routes/products/page');
const products_id_page = () => import('../src/routes/products/[id]/page');

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

export const pageModules = {
  '/': page,
  '/products': products_page,
  '/products/:id': products_id_page,
} as const;

export const routeModules = {} as const;

export const guards = {} as const;

export const redirects = {} as const;

export const fallbacks = {} as const;

export const paths = {} as const;

export const routes = defineRoutes({
  '/': {
    layout: layout satisfies Layout<'/'>,
    children: {
      '/': lazy(page) satisfies Page<'/'>,
      '/products': {
        children: {
          '/': lazy(products_page) satisfies Page<'/products'>,
          '/:id': lazy(products_id_page) satisfies Page<'/products/:id'>,
        },
      },
    },
  },
});
```

Each `satisfies` checks a route file's props against the pattern its directory
puts it under — a type check, so `tsc` reports a mismatch and `vite build`,
which does not type-check, passes. A page and a not-found stand in `routes`
as `lazy()` over what imports them: `pageModules` lists, per pattern, what
imports the page or the not-found that answers it, and the handler renders
what it imported in that place. Under `mode: 'server'` the `Page` and
`Layout` types also carry `request`, typed by `RouteRequest` from
`@k8ordo/framework/server`. `redirects` is where each `redirect.ts`
sends the visitor once the walk of `routes` reaches its pattern,
`paramSchemas` holds, per page pattern, the schemas it runs when the walk
reaches that pattern, before the page renders — a page's own read off the
page once the walk has imported it — `routeModules` what imports the
`route.ts` that answers a pattern (the place of each, and of each
`redirect.ts`, in `routes` is held by a component that renders nothing),
`guards` the `guard.ts` files that run before a pattern answers, outer first,
`searchReaders` what reads the search for a page that exports `search`, and
`fallbacks`, under `mode: 'static'`, what imports the `fallback.tsx` beside a
page and the parameters its shell may leave to the browser (under
`mode: 'server'` it is always empty, and no `fallback.tsx` is imported), and
`paths`, under `mode: 'static'`, what imports each `paths.ts`, by its file,
each checked against `Paths` of its directory's pattern in a `PathsChecks`
type (under `mode: 'server'` it too is empty); all seven are empty here
because no route file declares any.

`.k8ordo/register.gen.ts` registers that table with the framework — and with
`@k8ordo/state` when the application depends on it — so typed paths work
everywhere without a line of ceremony. It also says what the mode hands a
route file: under `mode: 'server'` it registers the `request`, which is how
`PageProps` and `LayoutProps` gain that field there and not under
`mode: 'static'`:

```tsx
import { href } from '@k8ordo/framework';

<a href={href('/products/:id', { id })}>…</a>; // checked against routes/
```

It registers the locale set with `@k8ordo/i18n` too, when the application
has one: its `package.json` lists `@k8ordo/i18n` (in `dependencies` or
`devDependencies`), and `src/i18n.ts` exports the set as `locales`. That is
the `Register` an application outside the framework writes by hand, so here
it writes none, and a message missing a locale does not compile:

```ts
// .k8ordo/register.gen.ts (the part for @k8ordo/i18n)
import type { LocaleOf } from '@k8ordo/i18n';

import type { locales } from '../src/i18n';

declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}
```

The export is read from the file's syntax, as a route file's are, and never
by running it: `export const locales = defineLocales(…)` and
`export { locales } from './locales'` count, a type-only export and
`export *` do not. A `src/i18n.ts` without the export gets nothing
generated and a warning naming it, since every message would compile
unchecked; an application that keeps its set elsewhere writes the
`Register` by hand. `vite dev` writes the file again as `src/i18n.ts` comes,
goes, or gains or loses the export. A hand-written augmentation left in the
application still compiles beside it, since both declare the same type.

Neither file names `@k8ordo/router`: they import from
`@k8ordo/framework/generated`, so the application's code, generated or not,
reads only the framework.

`vite build` and `vite dev` write both files as they start, so a fresh
clone — a CI checkout among them — has neither until something writes them.
`k8ordo generate`, the package's command, writes them and stops there: it
reads the Vite config in the working directory as `vite build` does, so the
`mode` and `routesDir` given to `framework()` are the ones it uses, then
builds nothing and renders no page — no `paths.ts` is read, and nothing a
page reads is touched. A `routes/` with the problems of
[What the build refuses](#what-the-build-refuses) fails it as it fails the
build, with `routes/ is not a valid pathname space:` and every problem
named, and nothing is written. What `mode: 'static'` refuses on top of
those — a `guard.ts`, a `route.ts` answering more than `GET`, a page
reading `search`, an `export *`, a Server Action, whatever a `paths.ts`
returns — it does not check, so its success is not the build's. Run it
before `tsc`; it is also how a CI job without the data a build reads — the
database behind a `paths.ts`, say — has the types:

```yaml
# .github/workflows/ci.yml, in the application's directory
- run: pnpm exec k8ordo generate
- run: pnpm exec tsc --noEmit
```

Without the files, `tsc` checks against no table: `href` takes any string,
params typed by a `paramsSchema` are strings, a message missing a locale
compiles, and under `mode: 'server'` the
`request` and `search` props are not in `PageProps` or `LayoutProps`, so a
page that reads them fails with `Property 'request' does not exist`. That is
the error static mode gives on purpose, but here the mode is not the cause.

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

## Counting page views

A page change here is not a document load, and it is not `pushState`
either — the router commits it through the Navigation API — so an analytics
script that counts only loads, or that watches the History API, misses
it. The platform says when a page change is done: `navigatesuccess` fires
once the new page is on screen, its `<title>` in place.

```tsx
'use client';

import { useEffect } from 'react';

export function PageViews() {
  useEffect(() => {
    let counted = location.pathname;
    const count = () => {
      // a search or a fragment that moved is a navigation too
      if (location.pathname === counted) return;
      counted = location.pathname;
      gtag('event', 'page_view', {
        page_location: location.href,
        page_title: document.title,
      });
    };
    navigation.addEventListener('navigatesuccess', count);
    return () => {
      navigation.removeEventListener('navigatesuccess', count);
    };
  }, []);
  return null;
}
```

Render it from the root layout; the same listener works from a plain
script with no React at all. `usePathname()` is not the moment to count
from: it follows the URL, which the router commits before the next page
arrives, so the title read then is still the page being left. Turn off the
tool's own counting of history changes as well — going back and forward
still fires `popstate`, and those views would be counted twice.

## MDX

The framework compiles no MDX; an application adds a compiler as a Vite
plugin, ahead of `framework()` and before the framework's own transforms see
the file:

```ts
// vite.config.ts
import { framework } from '@k8ordo/framework/vite';
import mdx from '@mdx-js/rollup';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [{ enforce: 'pre', ...mdx() }, framework({ mode: 'static' })],
});
```

An `.mdx` file is then a module whose default export is a Server Component,
imported like any other — statically, or late through `import.meta.glob` so
each page reads only its own:

```tsx
// src/routes/posts/[slug]/page.tsx
const posts = import.meta.glob<{ default: ComponentType }>(
  '../../../content/*.mdx',
);

export default async function PostPage({ params }: PageProps<'/posts/:slug'>) {
  const load = posts[`../../../content/${params.slug}.mdx`];
  if (load === undefined) notFound();
  const { default: Post } = await load();
  return <Post />;
}
```

**CSS an `.mdx` file imports reaches the pages that render it**, as a `.tsx`
module's does: `import './post.module.css'` or `import 'katex/dist/katex.css'`
at the top of the file is linked in the HTML of the pages rendering that
file's default export, and of no other. No query on the import is needed.
(`?vite-rsc-css-export=default`, the RSC plugin's own, still works and is
left alone.)

The stylesheets ride on the component the module exports, in an `.mdx` as in
a `.tsx`: a module that imports CSS and exports only a table of components
(`export const components = { h1: Heading }`) for another module to render
carries none of it to the page. Export a component that renders with the
table — `export function Article({ children })` — from the module that
imports the CSS.

## Fetching the next page ahead

The client runtime listens on the whole document for a pointer moving onto a
link, a link taking focus, and a press starting on one — `pointerover`,
`focusin` and `pointerdown` — and fetches that page's payload there and then,
so a click often finds the page already in hand. Nothing needs wiring: any
`<a>` counts, the ones a component library renders included. The fetch
loads the client components that page renders, as a navigation would, and
with them their stylesheets, which apply to the page on screen from then on
([How a page is sent](#how-a-page-is-sent)).

A touch screen has no hover, and a tap's press and click come together,
leaving nothing to fetch ahead in. So under `mode: 'static'`, where the
primary pointer is coarse (`(pointer: coarse)`), the runtime fetches the
links on screen instead: once the document's `load` event has fired, each
link that has stayed on screen for a second, one at a time in the order
they appeared, at low fetch priority, passing over a link that left the
screen before its turn. While a page change loads it fetches nothing more,
and cancels a prefetch on its way to another page, so the page being
loaded has the connection to itself; that link is fetched first once the
new page shows. Under `mode: 'server'` it does not — every link a visitor
scrolls past would be a render on the server.

Only a link a click would load in place is fetched: the same origin and below
Vite's `base`, no `download`, no `target` other than `_self`, and not the
page on screen, where only the search or the fragment would change. To stop
it for a link — one whose page is expensive to render, or a long list a
visitor scrolls through on a phone — mark the link, or any element around
it, `data-k8ordo-prefetch="false"` (`data-k8ordo-prefetch={false}` in JSX
renders the same). The nearest element carrying the attribute decides, so
`"true"` opts a link back in inside a region that opted out.

```tsx
<nav data-k8ordo-prefetch={false}>
  <a href="/reports">Reports</a>
  <a data-k8ordo-prefetch href="/">
    Home
  </a>
</nav>
```

Under `mode: 'server'` a page is rendered per request, so what was fetched
is used by the next navigation to that page, once, and only if it starts
within 30 seconds of the fetch starting. After that — or once a navigation
has used it — the page is fetched afresh, as it would have been with nothing
prefetched, so a page hovered and left alone never shows up later as it was
then. A Server Action's answer drops everything prefetched, since the action
may have changed what those pages show.

Under `mode: 'static'` a page is a file, the same until the next deploy, so
it is kept: every page fetched — ahead, or by a navigation that found none —
and the page the document arrived as are handed to every navigation to
them, going back and forward included, without asking the host again. The
tab keeps the 50 pages it used most recently. A page left while it was
still arriving goes on arriving, so going back to it shows it whole. Under
`vite dev` pages are rendered per request whatever the mode, and are kept
as under `mode: 'server'`.

In either mode a fetch that failed is dropped at once, so the navigation
asks again. A prefetch dropped before any navigation used it is cancelled
if it is still on its way, and one a navigation took is cancelled with that
navigation when another overtakes it, unless a later navigation is waiting
for it too — the same as a fetch the navigation had started itself.

Under `mode: 'static'` the build also writes `client-files.json`: for each
page, the scripts and stylesheets its client components need and the
stylesheets its Server Components link, less those every page loads. The
runtime reads it at low priority once the document runs, and whenever it
asks for a page's payload — a prefetch or a navigation — it links that
page's files at the same moment and at the payload's priority
(`<link rel="modulepreload">` for a script, `<link rel="preload"
as="style">` for a stylesheet) instead of waiting for the payload to name
them, a round trip later. The links on screen are fetched only once the
list has been read. A stylesheet still applies only once the page that
needs it is shown, and the page waits for it: a client component's once
that component loads, a Server Component's once it has arrived. A page the
list leaves out — a shell's value, or a host that lost the file — loads as
it would without one, its Server Components' stylesheets fetched as its
payload names them.

A page fetched ahead has its stylesheets fetched too, and they apply only
once the page is visited. Until then Chromium logs that the file "was
preloaded using link preload but not used within a few seconds", once per
file — more of them under a touch screen, where the links on screen are
fetched ahead. The warning is harmless: a visit uses what was fetched.
`<link rel="prefetch">`, which would not warn, is not in Safari, so it is
not used. Mark a long list `data-k8ordo-prefetch="false"` to fetch, and
warn, less.

Under `mode: 'server'` a prefetch is a render, as a navigation is — the
reason to mark a link to an expensive page. The platform's Speculation
Rules are not used: they are Chromium's alone, not Baseline. Nor is there a
check for a visitor saving data: the Network Information API is not
Baseline either.
