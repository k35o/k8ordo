# Errors and redirects

What the framework does when a page throws, is not there, or has moved.

## When a page throws

An `error.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows in
place of everything below it when that throws — inside the layout, so the
frame survives the failure. It is a client component, because catching a
render error is something only the browser can do:

```tsx
// src/routes/error.tsx
'use client';

import type { ErrorProps } from '@k8ordo/framework';

export default function RouteError({ reset }: ErrorProps) {
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
any, a failed client navigation falls back to a document load: under
`mode: 'server'` the server's own answer — its 500, its error page — is what
the visitor sees, and under `mode: 'static'` the page's prerendered file.

**A server render has no error boundaries.** What it has is the rule that a
subtree which throws inside a Suspense boundary is left for the browser to
render; the boundary here is one, so the HTML arrives with the frame in place
and a hole where the page was, the browser throws at the same spot, and
`error.tsx` shows after hydration. In production the error the browser sees
carries React's generic message, not the thrown one, and an empty `digest` —
the message is in the server's log.

### What fails a static build

Static mode only. At build time that rule does not apply to a Server
Component: a page whose Server Component throws while being rendered into a
file is not a page, and the build stops rather than writing an HTML whose
error shows only once a visitor's browser has rendered it. The thrown message
is logged beside the page's URL, and the build ends naming every page that
failed, `static build could not render /broken — see the error above` —
whether or not a Suspense boundary sits above the throw. A `not-found.tsx`
that throws is named as `404.html`. A client component that throws while the
build renders the HTML is left to the browser when a Suspense boundary sits
above it, and the file is written; with none, it stops the build the same
way. `error.tsx` under this mode is for what fails in the browser: a client
component, after hydration.

## A page that is not there

A params schema decides what a URL's params look like; whether the thing they
name exists is the page's to say. `notFound()` says it:

```tsx
// src/routes/products/[id]/page.tsx
import { notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';

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
its own only when there is no root layout either). Under `mode: 'server'` it
is also what a URL nothing matches gets from such an application; under
`mode: 'static'` no `404.html` is written, so such a URL gets the host's own 404.

`notFound()` is the page's word about itself: thrown from the page's own
component, before it returns.

**Under `mode: 'server'` a document waits for its page.** A status leaves
before the body it heads, so a page's HTML is not sent until the page's own
component has answered — fetched what it needs and returned, or said
`notFound()`. What streams after that is what the page puts under a
`<Suspense>` of its own. A client navigation has no status to get right, so
its payload streams from the start; a page that says `notFound()` there sends
the browser back to the server for a document load of the same URL, which is
answered with the 404. A `HEAD` for a page runs the page for the same reason,
and sends no body. Thrown from further down, once the page has returned and
its response has started, `notFound()` is an error like any other, and the
nearest `error.tsx` answers it.

**Under `mode: 'static'` a build waits for the whole page**, so `notFound()`
counts from anywhere in it. A pathname the `paths` option supplied whose page
says it fails the build, naming the pathname — it would otherwise be written
as a 404 page under a URL the site claims to have (see
[Routes with parameters](params.md#routes-with-parameters)). The 404 itself
is the host's to send: `not-found.tsx` is written as `404.html`
([The output](deploy.md#the-output)).

**Under a `fallback.tsx` it is shown in place.** A host answers an unbuilt
value with the shell, under `200`, before anything knows whether the value
exists, so the shell carries its nearest `not-found.tsx` in its payload. A
client component below the `fallback.tsx` that says `notFound()` while it
renders puts that in the shell's place, with the URL and the status as they
were; said from an effect or an event handler, it reaches nothing. Said
while the build renders the shell — from the `fallback.tsx` itself or a
layout above it — it stops the build, since a shell has no value to disown
([`notFound()` in a shell](params.md#notfound-in-a-shell)).

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
generated table checks the default export's shape; `RedirectTarget` is that
type, for a file that wants the error where it is written
(`export default '/products' satisfies RedirectTarget`, with
`import type { RedirectTarget } from '@k8ordo/framework/server'`, which
`mode: 'static'` lets through; `import { type RedirectTarget }` is kept as an
import of the module under `verbatimModuleSyntax`, and refused).

**Under `mode: 'server'`** the answer to a `GET` or `HEAD` is a `307`, or a
`308` when `permanent`, and any other method gets a `405`; a client
navigation to it sees HTML come back instead of a payload, hands the URL to
the browser, and the browser follows the redirect as a document load, so the
address bar ends up right.

**Under `mode: 'static'`** the redirect is written as a page that sends the
visitor on (`<meta http-equiv="refresh">` and a link), because no server will
ever send the status; there is no `index.rsc` beside it, so a client
navigation to it hands the URL to the browser, which loads that page and
follows it.

A Server Action sends the visitor elsewhere with `redirect()` instead
([Ending with a redirect](actions.md#ending-with-a-redirect)), under
`mode: 'server'` only.
