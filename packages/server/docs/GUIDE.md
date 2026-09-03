# @k8ordo/server

Runs a k8ordo application. Pages are rendered per request, so they can depend
on the request, answer with real HTTP status codes, and receive Server
Actions.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

The framework is deliberately strict. Its constraints are not there to make
things quick; they are there so the structure of an application — where its
URLs live, where its execution boundaries are — stays in a form that can be
checked rather than remembered.

## Setting up

```ts
// vite.config.ts
import { k8ordoServer } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [k8ordoServer()] });
```

```json
// tsconfig.json — the generated type wiring lives here
{ "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"] }
```

The mode is the dependency: installing this package is what makes the
application one that runs. The alternative, `@k8ordo/static`, renders every
route at build time and ships files instead.

## routes/

`src/routes/` is the application's pathname space, and holds nothing else.

```
src/routes/
  layout.tsx            wraps everything below it, through `children`
  page.tsx              /
  not-found.tsx         whatever nothing else matched — and a real 404
  products/
    page.tsx            /products
    [id]/page.tsx       /products/:id
  (docs)/               a route group: its own layout, no URL segment
    layout.tsx
    guide/page.tsx      /guide
  _parts/               private to the route above it; never a route
```

- `page.tsx`, `layout.tsx` and `not-found.tsx` are the only filenames the
  grammar accepts. Anything else has to live under a `_`-prefixed directory.
- A page receives `params`; a layout receives `children`. Server Components
  cannot read context, so nesting is by prop.
- The build refuses a directory whose name cannot be a URL segment, a param
  repeated within one path, a layout with no page below it, and two route
  groups laying claim to the same URL. Every problem is reported, not just the
  first.
- Parameters need no enumeration here — the value arrives with the request.

From this, the framework generates `.k8ordo/routes.gen.ts` — an ordinary
`defineRoutes` table you can open and read — and `.k8ordo/register.d.ts`,
which wires typed paths into `@k8ordo/router` and `@k8ordo/state`. Neither is
yours to edit, and neither is yours to write.

## Execution boundaries

Server is the default: a file with no directive is a Server Component.

```tsx
'use client'; // React's own word for it, written by hand
```

The build fails if a `.server.ts` module ever reaches the client bundle — at
resolution, and again on what actually made it into the output, because a
client component's graph is assembled while rendering rather than crawled from
an entry. Put secrets and database clients behind that suffix and no number of
intermediate imports can carry them across.

## Building and running

```bash
vite build
```

```js
// serve.js
import { serve } from '@k8ordo/server';

await serve({ port: 3000 });
```

`serve` hands out the client build's files as they are and passes everything
else to the request handler: HTML for a page, its RSC payload for a client
navigation, and the not-found page under a genuine 404. A request pathname may
only ever name a file inside the build output, whatever it is spelled like.

For another host, the built handler is a plain function — `dist/rsc/index.js`
default-exports `(request: Request) => Promise<Response>` — so anything that
speaks that shape can run it.

## What running buys over static

A page can read the request; an unknown URL gets a real 404 rather than the
host's own error page; parameterised routes need no list of values; and a form
can post to a Server Action. If none of that is needed, `@k8ordo/static`
renders the same application into files with the same grammar, the same
boundaries, and the same handler — called once per route instead of once per
request.
