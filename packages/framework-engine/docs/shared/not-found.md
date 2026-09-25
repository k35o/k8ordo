## A page that is not there

A params schema decides what a URL's params look like; whether the thing they
name exists is the page's to say. `notFound()` from `@k8ordo/router` says it:

```tsx
// src/routes/products/[id]/page.tsx
import { notFound } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';

export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  if (product === undefined) notFound();
  return <h1>{product.name}</h1>;
}
```

It throws, so the lines after it never run, and the page is answered instead
by what the table answers for a URL nothing matched there — the nearest
`not-found.tsx` above it, inside the layouts above that — under a 404. With no
`not-found.tsx` at all, the framework's own answers — a `404` heading and a
line, with a `<title>`, rendered inside the root layout, so the visitor keeps
the document's frame, its `<html lang>` and its stylesheets (a document of
its own only when there is no root layout either). It is also what a URL
nothing matches gets from such an application. `notFound()` comes from the
router rather than the mode package, so the page reads the same under
either.

`notFound()` is the page's word about itself: thrown from the page's own
component, before it returns.
