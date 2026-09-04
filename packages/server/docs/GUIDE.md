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
route instead of once per request.

## Getting started

```bash
pnpm add @k8ordo/router @k8ordo/server react react-dom server-only
pnpm add -D vite
```

```ts
// vite.config.ts
import { k8ordoServer } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [k8ordoServer()] });
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
  _data/                the same, for anything that is not a component
```

- `page.tsx`, `layout.tsx` and `not-found.tsx` are the only filenames the
  grammar accepts. Anything else lives under a `_`-prefixed directory, which
  the grammar skips entirely.
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

### What the build refuses

Every problem is reported, not just the first, and each names the file:

| routes/ contains                      | error                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `products/helper.ts`                  | `routes/ holds only page.tsx, layout.tsx and not-found.tsx — move "helper.ts" under a _-prefixed directory` |
| `[123]/page.tsx`                      | `"[123]" is not a valid param directory — use [name] with a letter or underscore first`                     |
| `pro ducts/page.tsx`                  | `"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -`                                     |
| `[id]/things/[id]/page.tsx`           | `":id" is already taken by an ancestor — params must be unique within a path`                               |
| `orphan/layout.tsx` and no page below | `has a layout but no page.tsx below it, so it can never render`                                             |
| `(a)/page.tsx` and `(b)/page.tsx`     | `"/" is already declared by (a)/page.tsx — route groups do not separate URLs`                               |

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

`.k8ordo/register.d.ts` wires that table into `@k8ordo/router` — and into
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
crosses.

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

## Running the build

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
navigation, and `not-found.tsx` under a genuine 404. A request pathname may
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

## Alongside the rest of k8ordo

`@k8ordo/state` owns the search params, and this framework generates its
`Register` for you, so a filter is typed against the same routes. Changing the
search does not change the page: the router leaves the route tree alone,
nothing remounts, and the scroll position stays where the reader left it.

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

## What running buys over static

An unknown URL gets a real 404 from the application rather than whatever the
host would have said; parameterised routes need no list of values, so a
catalogue that changes does not need a rebuild; and a form can post to a
Server Action. A page receives its `params` and nothing else of the request —
there is no headers or cookies API yet. If none of that is needed,
`@k8ordo/static` renders the same application into files — the same grammar,
the same boundaries, the same handler, called once per route.
