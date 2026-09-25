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

The package has two entries, split by where the code runs. `@k8ordo/server`
is the plugin, for `vite.config.ts`, and loads Vite. What the application's
own code imports — `serve`, `redirect()`, and the `RedirectTarget` and
`RouteRequest` types — comes from `@k8ordo/server/runtime`, which does not, so
the built application runs from an install without dev dependencies.

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

| routes/ contains                                                          | error                                                                                                                            |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                                                      | `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                                                          | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                                          |
| `pro ducts/page.tsx`                                                      | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                                          |
| `[id]/things/[id]/page.tsx`                                               | `":id" is already taken by an ancestor — params must be unique within a path`                                                    |
| `orphan/layout.tsx` and no page below                                     | `has a layout but no page.tsx below it, so it can never render`                                                                  |
| `(a)/page.tsx` and `(b)/page.tsx`                                         | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                                                    |
| `(docs/page.tsx`                                                          | `"(docs" is not a valid route group — use (name)`                                                                                |
| `empty/error.tsx` and no page or redirect below                           | `declares no route — every directory needs a page.tsx (or redirect.ts) somewhere below it`                                       |
| `(shop)/sale/page.tsx` and `(shop)/[id]/page.tsx` beside `about/page.tsx` | `"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`                                      |
| `old/page.tsx` and `old/redirect.ts`                                      | `"old" cannot both render page.tsx and redirect — keep one`                                                                      |

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
visitor — and `paramSchemas` holds, per page pattern, the schemas it runs when
the walk reaches that pattern, before the page renders; both are empty here
because no route file declares either.

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

import { redirect } from '@k8ordo/server/runtime';

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
import { serve } from '@k8ordo/server/runtime';

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

When the handler throws, `serve` answers `500` with the body `internal
error` and logs what was thrown (`k8ordo: GET /products/1 failed`): the
details are for whoever runs the server, not for the visitor. A body that
fails after it has started streaming can no longer change its status, so the
connection is cut rather than left open on half a page.

For another host, the built handler is a plain function:

```js
import handler from './dist/rsc/index.js';

const response = await handler(new Request('https://example.com/products/1'));
```

Anything that speaks `(request: Request) => Promise<Response>` can run it —
and it is the same handler `@k8ordo/static` builds and calls at build time,
compiled for that mode.

It answers `GET`, `HEAD` and `POST`, and any other method with a `405` whose
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

<!-- shared:prefetch -->

### Fetching the next page ahead

The client runtime listens on the whole document for a pointer moving onto a
link, a link taking focus, and a press starting on one — `pointerover`,
`focusin` and `pointerdown` — and fetches that page's payload there and then,
so a click often finds the page already in hand. Nothing needs wiring: any
`<a>` counts, the ones a component library renders included.

Only a link a click would load in place is fetched: the same origin, no
`download`, no `target` other than `_self`, and not the page on screen, where
only the search or the fragment would change. To stop it for a link — one
whose page is expensive to render, say — mark the link, or any element
around it, `data-k8ordo-prefetch="false"` (`data-k8ordo-prefetch={false}` in
JSX renders the same). The nearest element carrying the attribute decides,
so `"true"` opts a link back in inside a region that opted out.

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
failed is dropped at once, so the navigation asks again.

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

Calling the action re-renders the page and sends both answers back together,
so the screen is up to date by the time the caller has its value — one round
trip, not two.

A form also works **before JavaScript loads**. React renders the fields that
identify the action into the HTML; posting them is an ordinary form
submission, and the server runs the action and answers with the same page,
re-rendered — or a `303` when the action ended with `redirect()`.
`useActionState`'s result survives that trip, so the same component handles
both worlds without knowing which one it is in.

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
a second handler.

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
handler, called for each route at build time.
