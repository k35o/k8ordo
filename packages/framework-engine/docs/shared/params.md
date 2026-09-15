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
