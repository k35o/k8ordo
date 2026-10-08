# Parameters

What a route parameter arrives as, and — under `mode: 'static'` — how the
build learns which values to render. Under `mode: 'server'` a value comes
with the request and needs no list.

## Parameters with a schema

A parameter arrives as a string, because a URL carries nothing else. A page —
or a layout, for every page below it — may say what it expects instead
(`paramsSchema`, not `params`: the page's own prop is `params`, and a
module-level binding of the same name would shadow it):

```tsx
// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/framework';
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
produced. `PageProps<'/products/:id'>` is those props by the pattern —
`params` typed by the schemas, and `pathname`, plus `request` under
`mode: 'server'` — read from the generated `Register`; a page may equally
declare its props inline (`{ params: { id: number } }`), since the generated
table checks them where it uses the component either way.
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
the table declares next, which in the end is `not-found.tsx` under a 404 —
exactly as if the directory had never matched. A catch-all is never
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

## Routes with parameters

Static mode only. A build into files cannot invent parameter values, so it
asks for them:

```ts
framework({
  mode: 'static',
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
  mode: 'static',
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
puts the base in front. Only the file name is decoded, and a pathname whose
escapes do not decode, or that decodes to a `..` segment, fails the build —
neither names a file inside the output:

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

Neither is written to `dist/client/`. A build that meets both names them in
one error, with any page that failed to render, so fixing one does not reveal
the next.
