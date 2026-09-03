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

## Setting up

```ts
// vite.config.ts
import { k8ordoStatic } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [k8ordoStatic()] });
```

```json
// tsconfig.json — the generated type wiring lives here
{ "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"] }
```

The mode is the dependency. Installing this package means the application is
static, so there are no Server Actions to reach for and no request to depend
on — not as a rule to remember, but as APIs that do not exist. Choosing the
other mode means installing `@k8ordo/server` instead.

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
```

- `page.tsx`, `layout.tsx` and `not-found.tsx` are the only filenames the
  grammar accepts. Anything else has to live under a `_`-prefixed directory.
- A page receives `params`; a layout receives `children`. Server Components
  cannot read context, so nesting is by prop.
- The build refuses a directory whose name cannot be a URL segment, a param
  repeated within one path, a layout with no page below it, and two route
  groups laying claim to the same URL. Every problem is reported, not just the
  first.

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

## Building

```bash
vite build
```

Output is `dist/client/` — an `index.html` and an `index.rsc` per route — plus
the render machinery under `dist/rsc/` and `dist/ssr/` that produced them.
Serve `dist/client/` with anything.

Pages render on the server; interactivity hydrates in the browser; and a link
to another page fetches that page's payload instead of reloading the document,
so navigation stays client-side even though the site is a pile of files.

## Routes with parameters

Static rendering cannot invent parameter values, so it asks for them:

```ts
k8ordoStatic({
  paths: async () => {
    const products = await readCatalog();
    return products.map((product) => `/products/${product.id}`);
  },
});
```

A parameterised route with no path supplied **fails the build**. Shipping a
site quietly missing half its pages is worse than not shipping one.

## What static cannot do

Anything that needs the request: Server Actions, per-request data, real HTTP
status codes. A file cannot receive a form submission, and a static host
answers an unknown URL with its own 404 page rather than yours. If the
application needs those, it wants `@k8ordo/server` — the same route grammar,
the same boundaries, the same handler, called per request instead of once per
route.
