# Errors and redirects

What `@k8ordo/static` does when a page throws, is not there, or has moved.

## When a page throws

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
any, a failed client navigation falls back to a document load, which here
loads the page's prerendered file — there is no server to answer with a 500
or an error page of its own.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration.

At build time that rule does not apply to a Server Component: a page whose
Server Component throws while being rendered into a file is not a page, and
the build stops rather than writing an HTML whose error shows only once a
visitor's browser has rendered it. The thrown message is logged beside the
page's URL, and the build ends naming every page that failed,
`static build could not render /broken — see the error above` — whether or
not a Suspense boundary sits above the throw. A `not-found.tsx` that throws
is named as `404.html`. A client component that throws while the build
renders the HTML is left to the browser when a Suspense boundary sits above
it, and the file is written; with none, it stops the build the same way.
`error.tsx` under this mode is for what fails in the browser: a client
component, after hydration.

<!-- shared:not-found -->

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

<!-- /shared:not-found -->

**A build waits for the whole page**, so `notFound()` counts from anywhere in
it. A pathname the `paths` option supplied whose page says it fails the build,
naming the pathname — it would otherwise be written as a 404 page under a URL
the site claims to have (see [Routes with parameters](params.md#routes-with-parameters)).

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
both. In this mode the redirect is written as a page that sends the visitor
on (`<meta http-equiv="refresh">` and a link), because no server will ever
send the status; there is no `index.rsc` beside it, so a client navigation to
it hands the URL to the browser, which loads that page and follows it.
