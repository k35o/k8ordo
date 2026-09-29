# Errors and redirects

What `@k8ordo/server` answers when a page throws, is not there, or has
moved.

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
any, a failed client navigation falls back to a document load, so the server's
own answer — its 500, its error page — is what the visitor sees.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration. In production the error the browser sees
carries React's generic message, not the thrown one, and an empty `digest` —
the message is in the server's log.

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

**A document waits for its page.** A status leaves before the body it heads,
so a page's HTML is not sent until the page's own component has answered —
fetched what it needs and returned, or said `notFound()`. What streams after
that is what the page puts under a `<Suspense>` of its own. A client
navigation has no status to get right, so its payload streams from the start;
a page that says `notFound()` there sends the browser back to the server for a
document load of the same URL, which is answered with the 404. A `HEAD` for a
page runs the page for the same reason, and sends no body. Thrown from further
down, once the page has returned and its response has started, `notFound()`
is an error like any other, and the nearest `error.tsx` answers it.

## Redirects

A directory that has moved keeps a `redirect.ts` instead of a `page.tsx`:

```ts
// src/routes/old/redirect.ts
export default '/products';
// or: export default { to: '/:locale/new', permanent: true };
```

The target is a pattern the matched params fill in, so `/:locale/legacy` can
send to `/:locale/new`. A redirect holds its place in the table as a page
does, so a literal directory beside a `[slug]/redirect.ts` keeps its URL; a
directory that redirects has no page to render, so it cannot hold both. The
answer to a `GET` or `HEAD` is a `307`, or a `308` when `permanent`, and any
other method gets a `405`; a client navigation
to it sees HTML come back instead of a payload, hands the URL to the browser,
and the browser follows the redirect as a document load, so the address bar
ends up right. The generated table checks the default export's shape;
`RedirectTarget` from this package is that type, for a file that wants the
error where it is written (`export default '/products' satisfies
RedirectTarget`).
