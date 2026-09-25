# @k8ordo/server

Runs a k8ordo application. Every request is answered by rendering, which is
what makes route parameters need no list of values, an unknown URL a real 404,
and a Server Action something a form can post to.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

The framework is deliberately strict. Its constraints are not there to make
things quick; they are there so the structure of an application — where its
URLs live, where its execution boundaries are — stays in a form that can be
checked rather than remembered.

## The mode is the dependency

Installing this package is what makes an application one that runs. The
alternative, `@k8ordo/static`, renders every route at build time and ships
files; nothing else about the application changes between them — the same
route grammar, the same boundaries, the same request handler, called for each
route at build time instead of once per request. The plugin is called
`framework()` in both packages for that reason: the mode is the import, and
`vite.config.ts` reads the same either way.

## Getting started

```bash
pnpm add @k8ordo/router @k8ordo/server react react-dom server-only
pnpm add -D vite
```

`@k8ordo/server` is a runtime dependency: `serve` and the built handler are
what the deployed application runs. `@k8ordo/static` is only ever needed at
build time, which is why its guide installs it with `-D`.

The package has three entries, split by where the code runs.
`@k8ordo/server` is the plugin, for `vite.config.ts`, and loads Vite.
`@k8ordo/server/runtime` is what code inside the request handler imports —
`redirect()`, `cookies()`, `responseHeaders()`, `requestHeaders()`, and the
`RedirectTarget`, `RouteRequest` and `Guard` types — and needs nothing from
Node, so it goes wherever the
handler goes.
`@k8ordo/server/serve` is `serve`, the Node.js server for a build. Neither of
the last two loads Vite, so the built application runs from an install
without dev dependencies.

```ts
// vite.config.ts
import { framework } from '@k8ordo/server';
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
vite dev     # the same pipeline as production, with Fast Refresh
vite build   # dist/
node serve.js
```

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you
cannot change.

**The root layout is the document, and hydration checks all of it.** Anything
that rewrites the HTML on the way to the browser — a CDN that inlines web
fonts, obfuscates email addresses, or defers scripts — changes a tree React is
about to reconcile, and hydration fails on the difference. The way to be
unaffected is to give such a service nothing to rewrite: serve the assets from
the same origin rather than linking them from another one.

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched — and a real 404
  error.tsx             shown in place of what is below when it throws
  guard.ts              runs before whatever answers below it
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
  `guard.ts` are the only filenames the grammar accepts. Anything else lives under a
  `_`-prefixed directory. A file or directory whose name starts with `_` or
  `.` is skipped entirely.
- **A page receives `params`; a layout receives `children`.** Server Components
  cannot read context, so nesting is by prop. Both also receive `pathname` —
  the URL this render is for, which is how a component above a parameter can
  see the value that parameter names.
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

**An async page streams.** The layout above it is on screen first, and the
page follows in the same response once its data arrives. The browser
hydrates when the last of it is in place, not before: a boundary still on
its way cannot be hydrated, and a context that changes as the page hydrates —
a colour scheme read from the browser — would make React render it again
beside the copy still streaming in. Until then the page is what it is
without JavaScript: links load documents and forms post.

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
any, a failed client navigation falls back to a document load, so the server's
own answer — its 500, its error page — is what the visitor sees.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration. In production the error the browser sees
carries React's generic message, not the thrown one, and an empty `digest` —
the message is in the server's log.

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
both. The answer is a `307`, or a `308` when `permanent`; a client navigation
to it sees HTML come back instead of a payload, hands the URL to the browser,
and the browser follows the redirect as a document load, so the address bar
ends up right. The generated table checks the default export's shape;
`RedirectTarget` from this package is that type, for a file that wants the
error where it is written (`export default '/products' satisfies
RedirectTarget`).

A Server Action ends with `redirect()` from `@k8ordo/server/runtime`:

```ts
'use server';

import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect(href('/talks')); // thrown: the lines after it never run
}
```

A form posted without JavaScript is answered with a `303` to the target; one
posted by the client runtime is answered with a payload that tells the
router to navigate there. The target is a URL, sent as given — build it with
`href()`, which carries Vite's `base` when the application is served under
one, where a `redirect.ts` target is a pattern in the table's terms and gets
the base put in front. `redirect()` is for actions: a page that should
send the visitor elsewhere is a `redirect.ts`, where the build can see it.

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
crosses.

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

## Running the build

```bash
vite build
```

```js
// serve.js
import { serve } from '@k8ordo/server/serve';

const server = await serve({ port: 3000 });
// server.url, server.port; await server.close() to stop
```

`serve` takes three options: `dist`, the build output holding `client/` and
`rsc/` (default `dist`, resolved against the working directory); `port`
(default `3000`); and `host` (default `localhost`, which only the same machine
can reach — inside a container, pass `host: '0.0.0.0'`).

`serve` hands out the client build's files as they are and passes everything
else to the request handler: HTML for a page, its RSC payload for a client
navigation, and `not-found.tsx` under a genuine 404. Only a `GET` or `HEAD`
is answered from a file; any other method reaches the handler, even at a path
that names a file. A file is sent with the type registered for its extension
— with `charset=utf-8` on text — or as `application/octet-stream` when none
is registered. A file under `assets/` has its content hash in its name and is
sent `immutable`; any other file is sent `no-cache`. A `HEAD` gets the
headers a `GET` would and no body, whether a file or the handler answers it.
It returns where it listens and a way to stop — `port: 0` asks the system
for a free port, which is what a test wants. A request pathname may only ever
name a file inside the build output, whatever it is spelled like — traversal
is not a case weighed per request but an outcome the path resolution cannot
produce.

**Nothing is compressed twice, or sent twice.** `vite build` writes a Brotli
and a gzip copy beside every file of the client build whose type compresses
(`app-1a2b.js.br`, `app-1a2b.js.gz`, each kept only when it came out
smaller), and `serve` sends the one the request's `Accept-Encoding` prefers —
`br` when both are equally welcome — with `Vary: Accept-Encoding`. Every file
carries an `ETag` taken from its contents, not its modification time, so a
revalidation against a deploy that did not change the file, or against another
server built from the same source, ends in a `304`; the contents are read for
it once per file. A `Range` asking for one span of a file is answered with
`206` — what Safari needs before it will play a `<video>` — a range past the
end with `416`, and anything else (several spans, a `Range` that cannot be
read, an `If-Range` naming another version) with the whole file.

A page and its payload are compressed as they stream, under the same
negotiation: every part React writes is flushed as it is written, so the
shell reaches the browser before the slowest boundary has finished rendering.
An answer in a type that is compressed already (an image), one the handler
encoded itself, or one marked `Cache-Control: no-transform` is sent as it is.

When the handler throws, `serve` answers `500` with the body `internal
error` and logs what was thrown (`k8ordo: GET /products/1 failed`): the
details are for whoever runs the server, not for the visitor. A body that
fails after it has started streaming can no longer change its status, so the
connection is cut rather than left open on half a page.

### The request handler

`serve` is one host for the build. What it hosts — the application itself —
is the request handler, and anything that turns a request into a `Request`
and a `Response` back into an answer can host it:

```js
import handler from './dist/rsc/index.js';

const response = await handler(new Request('https://example.com/products/1'));
```

`dist/rsc/index.js` default-exports `(request: Request) => Promise<Response>`,
the same handler `@k8ordo/static` builds and calls at build time, compiled
for that mode. It loads `dist/ssr/` from beside itself, so the two travel
together, and it imports the application's dependencies by name, so they
have to resolve where it runs — or be bundled in, as Wrangler does.

**It runs wherever `AsyncLocalStorage` does.** Past the web platform's
`Request`, `Response` and streams, the one thing the handler takes from its
runtime is `AsyncLocalStorage` from `node:async_hooks`: React keeps each
render's state in it, and a `paramsSchema` writes to it. Node.js, Bun, Deno,
and Cloudflare Workers with the `nodejs_compat` flag all have it, and each
takes the handler as it is once it is imported:

```js
// Deno
Deno.serve(handler);

// Bun
Bun.serve({ fetch: handler });

// Cloudflare Workers — worker.js
export default { fetch: handler };
```

What the handler runs keeps that promise only as long as it imports nothing
that needs Node either — which is why `redirect()` and the types come from
`@k8ordo/server/runtime`, and `serve` from an entry of its own. A route file
or a Server Action that reads `node:fs` ties the application to a runtime
that has it.

**The handler serves no files.** Put `dist/client/` in front of it — the
files under `assets/` with `Cache-Control: public, max-age=31536000,
immutable`, since their names carry their contents' hash — and hand it every
request that names none. On Workers that is static assets pointed at the
client build, which answer before the Worker runs:

```jsonc
// wrangler.jsonc
{
  "main": "worker.js",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "dist/client" },
}
```

The handler answers `GET`, `HEAD` and `POST`, and any other method with a `405` whose
`Allow` header names those three, so a host needs no method filter of its
own. A `HEAD` gets the status and headers a `GET` would, with a `null` body:
both are settled before the page renders, so the page is not rendered for it.

**Build the `Request` with the URL the visitor asked for.** A `POST` — a
Server Action or not — is accepted only when its `Origin` header is present
and names that URL's host, which is what stops another site's form from
calling your functions with your visitor's cookies; anything else is answered
with a `403`. Behind a proxy that means passing the public host through;
`serve` reads it from the request's own `Host` header, so a proxy in front of
it has to pass the original `Host` on unchanged.

### Deploying to Vercel

```ts
// vite.config.ts
import { framework } from '@k8ordo/server';
import { vercel } from '@k8ordo/server/vercel';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework(), vercel()] });
```

With `vercel()` beside `framework()`, `vite build` also writes
`.vercel/output/` in the shape of Vercel's Build Output API (v3), which
`vercel build` and `vercel deploy --prebuilt` deploy as it is. The client
build becomes static files on Vercel's CDN — a file under `assets/` is sent
`immutable` once a file has answered, so a missing one is never cached — and
every request that names no file goes to one Node.js function, the request
handler, handed to Vercel as `fetch` and streaming its answer. Under a
`base` the static files sit below it, as `serve` hands them out, and the
handler answers every URL outside it with a `404`. The copies compressed for
`serve` are left out: Vercel compresses on its own, and each is one more file
to upload.

**The function carries everything it imports.** A Vercel function holds
nothing but its own directory, so under `vercel()` the handler is built with
every dependency bundled in. A dependency that ships a native binary, or that
reads its own files by path, cannot be bundled that way and does not work
there. Each build replaces `.vercel/output/` and nothing else: the project link
`vercel pull` writes beside it stays.

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
`Register` for you, so a filter is typed against the same routes. Changing the
search does not change the page: the router leaves the route tree alone,
nothing remounts, and the scroll position stays where the reader left it.

A page never sees the search: `useAppState` reads it in the browser, so a
server render shows the url slot's defaults and the live URL takes over on
hydration. That is the same split the router draws at the `?` — the pathname
is the framework's, everything after it is state's.

`@k8ordo/form` derives a form's constraint attributes, its messages and its
server-side validation from one zod schema — and since this mode has Server
Actions, the submission has somewhere to arrive.

## Server Actions

```ts
// src/routes/_parts/actions.ts
'use server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  return null;
}
```

```tsx
// src/routes/_parts/talk-form.tsx
'use client';

import { useActionState } from 'react';

import { createTalk } from './actions';

export function TalkForm() {
  const [state, formAction] = useActionState(createTalk, {});
  return <form action={formAction}>…</form>;
}
```

**`'use server'` and `server-only` say different things**, and an actions
module wants the first only. `'use server'` marks a function the client may
_call_, which runs on the server; `server-only` marks a module the client may
never _reach_. The client only ever receives a reference to an action, so the
two do not collide — but the mark belongs on what the action reads: keep
secrets and database clients in a `*.server.ts` module and import that.

An action answers the request as much as a guard does, so it has the same
API: `cookies()` to read and write the cookies, `responseHeaders()` to add to
the answer, and `requestHeaders()` for the headers the request arrived with —
an action is handed its arguments, not the request.

```ts
'use server';

import { cookies, redirect } from '@k8ordo/server/runtime';

export async function signIn(_previous: FormState, formData: FormData) {
  const session = await startSession(formData);
  if (session === null) return { error: 'wrong password' };
  cookies().set('session', session.token, { maxAge: 60 * 60 * 24 * 30 });
  redirect('/account');
}
```

What an action writes goes on its answer: the page it re-rendered, the `303`
to where it redirected, or the payload the client runtime applies. The page
re-rendered after it sees the cookies the request carried in `request`, not
what the action wrote.

Calling the action re-renders the page and sends both answers back together,
so the screen is up to date by the time the caller has its value — one round
trip, not two.

A form also works **before JavaScript loads**. React renders the fields that
identify the action into the HTML; posting them is an ordinary form
submission, and the server runs the action and answers with the same page,
re-rendered — or a `303` when the action ended with `redirect()`.
`useActionState`'s result survives that trip, so the same component handles
both worlds without knowing which one it is in.

## Guards

A `guard.ts` decides whether a request gets through, before anything below
its directory answers it. It can sit at any level, and the guards along a URL
run outer first, one at a time:

```ts
// src/routes/admin/guard.ts
import { cookies } from '@k8ordo/server/runtime';
import type { Guard } from '@k8ordo/server/runtime';

const guard: Guard<'/admin'> = () => {
  if (cookies().has('session')) return;
  return new Response(null, { status: 303, headers: { location: '/login' } });
};

export default guard;
```

It receives `{ request, params }` — the `Request` as it arrived, and the
params of the pattern its directory puts it under, as the strings the URL
carried: a guard runs above every layout, where no schema has typed them.
`Guard<'/admin/:id'>` from `@k8ordo/server/runtime` is its type, and the
generated table checks each `guard.ts` against its directory's pattern either
way.

**A `Response` ends the request; nothing lets it through.** A redirect, a
`401`, a `403` — whatever it returns is the answer, and the guards inside it
and the page below never run. Returning nothing hands the request on to the
next guard, and the last one to what answers the URL.

Letting a request through can still add to its answer. `responseHeaders()`
is the `Headers` the final response will carry, whatever answers — the page,
its payload, the not-found, or a guard further in that ends the request:

```ts
// src/routes/guard.ts
import { responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  responseHeaders().set('x-content-type-options', 'nosniff');
}
```

A header the answer already carries is replaced. `responseHeaders()` works
while a guard or a Server Action runs and throws anywhere else — a page is a
render, and a render that wrote the response would be a second handler.

There is no `next()` that runs the page and hands its answer back to be
rewritten: a page streams, and its headers are on the wire before its body is
written, so a guard decides before the page starts, never after.

**What a guard covers.** A guard runs before every URL below its directory —
each page, its payload for a client navigation, a `HEAD`, a Server Action
posted to it, and a `not-found.tsx` below it; the root's also runs for a URL
nothing answers. A `redirect.ts` is answered before any guard runs: a
directory that redirects has nothing below it to guard. A guard does not
protect a Server Action as such — an action is a function any page can call,
posted to whichever URL calls it — so an action checks what it needs itself.

The guards run after the params schemas have matched the URL, so a guard
under `[locale]` runs in the locale the URL names, and before the Server
Action a `POST` carries.

## Cookies

`cookies()` is the request's cookies, to read and to write, from a
`guard.ts` or a Server Action:

```ts
import { cookies } from '@k8ordo/server/runtime';

cookies().get('session'); // string | undefined
cookies().set('session', token, { maxAge: 60 * 60 * 24 });
cookies().delete('session');
```

A read sees what the request carried, with what was set or deleted earlier in
the same request — a guard's write is what a Server Action after it reads —
and every write reaches the browser as a `Set-Cookie` on the answer, whatever
the answer is. A cookie written twice at the same path and domain is said
once, the last way.

`set` takes `path`, `domain`, `maxAge` (seconds), `expires`, `httpOnly`,
`secure` and `sameSite` (`'strict' | 'lax' | 'none'`, the last only with
`secure`). The defaults are what a session wants: `path: '/'`,
`httpOnly: true`, `secure: true` and `sameSite: 'lax'`. `localhost` counts as
secure to the browsers that matter; anywhere else served over plain HTTP,
say `secure: false`. A name outside RFC 6265's token characters throws.
`delete` takes the `path` and `domain` the cookie was set with, since those
are what a browser keys it by.

A page never writes a cookie: it reads `request.cookies` from its props, the
cookies the request carried.

## Reading the request

A page and a layout receive `request` beside `params` and `pathname`: the
headers, and the cookies parsed by name, both read-only.

```tsx
// src/routes/layout.tsx
import type { LayoutProps } from '@k8ordo/router';

export default function RootLayout({ children, request }: LayoutProps<'/'>) {
  const theme = request.cookies.get('theme') ?? 'light';
  const language = request.headers.get('accept-language') ?? 'en';
  return (
    <html data-theme={theme} lang={language.split(',')[0]}>
      <body>{children}</body>
    </html>
  );
}
```

`PageProps` and `LayoutProps` carry `request` because the generated
`.k8ordo/register.gen.ts` says this mode has one; `RouteRequest` from
`@k8ordo/server/runtime` is its type, for a component further down that takes
it as a prop.

Nothing lets a page write to the response — no status, no `Set-Cookie` —
because a page is a render, and a render that answered the request would be
a second handler. What the response carries beyond the page is decided before
it renders, in a `guard.ts`, or by the Server Action a `POST` carries;
`cookies()` there is what writes a cookie.

The field exists only under this mode: the generated `Page` and `Layout`
types carry it here and not under `@k8ordo/static`, so a page that reads it
fails to type-check when the application is built into files, where there is
no request to read. The search params are still not here — they are
`@k8ordo/state`'s, read in the browser.

## What running buys over static

An unknown URL gets a real 404 from the application rather than whatever the
host would have said; parameterised routes need no list of values, so a
catalogue that changes does not need a rebuild; a form can post to a Server
Action, and an action can `redirect()`; a page can read the request's
headers and cookies; and a `guard.ts` decides whether a request gets through
before anything renders. If none of that is needed, `@k8ordo/static` renders the
same application into files — the same grammar, the same boundaries, the same
handler, called for each route at build time.
