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
