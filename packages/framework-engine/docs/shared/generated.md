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
