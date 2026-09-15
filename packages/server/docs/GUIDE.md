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
route grammar, the same boundaries, the same request handler, called once per
route instead of once per request. The plugin is called `framework()` in both
packages for that reason: the mode is the import, and `vite.config.ts` reads
the same either way.

## Getting started

```bash
pnpm add @k8ordo/router @k8ordo/server react react-dom server-only
pnpm add -D vite
```

`@k8ordo/server` is a runtime dependency: `serve` and the built handler are
what the deployed application runs. `@k8ordo/static` is only ever needed at
build time, which is why its guide installs it with `-D`.

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
number } }`), since the generated table checks them at the import either way.
A schema may name only the params its pattern has; naming
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
ends up right.

A Server Action ends with `redirect()` from `@k8ordo/server`:

```ts
'use server';

import { redirect } from '@k8ordo/server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect('/talks'); // thrown: the lines after it never run
}
```

A form posted without JavaScript is answered with a `303` to the target; one
posted by the client runtime is answered with a payload that tells the
router to navigate there. `redirect()` is for actions: a page that should
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
import { serve } from '@k8ordo/server';

const server = await serve({ port: 3000 });
// server.url, server.port; await server.close() to stop
```

`serve` hands out the client build's files as they are and passes everything
else to the request handler: HTML for a page, its RSC payload for a client
navigation, and `not-found.tsx` under a genuine 404. It returns where it
listens and a way to stop — `port: 0` asks the system for a free port, which
is what a test wants. A request pathname may
only ever name a file inside the build output, whatever it is spelled like —
traversal is not a case weighed per request but an outcome the path resolution
cannot produce.

For another host, the built handler is a plain function:

```js
import handler from './dist/rsc/index.js';

const response = await handler(new Request('https://example.com/products/1'));
```

Anything that speaks `(request: Request) => Promise<Response>` can run it —
which is also exactly what `@k8ordo/static` calls at build time.

**Build the `Request` with the URL the visitor asked for.** A Server Action is
accepted only when its `Origin` matches that URL's host, which is what stops
another site's form from calling your functions with your visitor's cookies.
Behind a proxy that means passing the public host through; `serve` reads it
from the request's own `Host` header, so a proxy that rewrites it has to say
where it really came from.

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
never _reach_. An actions file importing `server-only` would be claiming both,
and the second forbids what the first exists for.

Calling the action re-renders the page and sends both answers back together,
so the screen is up to date by the time the caller has its value — one round
trip, not two.

A form also works **before JavaScript loads**. React renders the fields that
identify the action into the HTML; posting them is an ordinary form
submission, and the server runs the action and answers with the next page.
`useActionState`'s result survives that trip, so the same component handles
both worlds without knowing which one it is in.

## Reading the request

A page and a layout receive `request` beside `params` and `pathname`: the
headers, and the cookies parsed by name, both read-only.

```tsx
import type { PageProps } from '@k8ordo/router';

export default function HomePage({ request }: PageProps<'/'>) {
  const theme = request.cookies.get('theme') ?? 'light';
  const language = request.headers.get('accept-language');
  return <html data-theme={theme}>…</html>;
}
```

`PageProps` and `LayoutProps` carry `request` because the generated
`.k8ordo/register.gen.ts` says this mode has one; `RouteRequest` from this
package is its type, for a component further down that takes it as a prop.

Nothing lets a page write to the response — no status, no `Set-Cookie` —
because a page is a render, and a render that answered the request would be
a second handler. Setting a cookie is a Server Action's job.

The field exists only under this mode: the generated `Page` and `Layout`
types carry it here and not under `@k8ordo/static`, so a page that reads it
fails to type-check when the application is built into files, where there is
no request to read. The search params are still not here — they are
`@k8ordo/state`'s, read in the browser.

## What running buys over static

An unknown URL gets a real 404 from the application rather than whatever the
host would have said; parameterised routes need no list of values, so a
catalogue that changes does not need a rebuild; a form can post to a Server
Action, and an action can `redirect()`; and a page can read the request's
headers and cookies. If none of that is needed, `@k8ordo/static` renders the
same application into files — the same grammar, the same boundaries, the same
handler, called once per route.
