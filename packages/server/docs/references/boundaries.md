# Execution boundaries

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

<!-- shared:browser-only -->

## Components that need a browser

A client component that reads something only a browser has — `localStorage`,
the visitor's time zone, `navigator` — says so with React's `use(browser())`
(`browser` from `react-dom`), under a `<Suspense>`:

```tsx
'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('the draft is stored in localStorage'));
  return <textarea defaultValue={localStorage.getItem('draft') ?? ''} />;
}

export function Editor() {
  return (
    <Suspense fallback={<p>loading the draft…</p>}>
      <SavedDraft />
    </Suspense>
  );
}
```

The server render — a build into files as much as a request — leaves the
fallback in the HTML, and the browser renders the component after hydration.
That is not a failure: the build does not stop for it and the handler logs
nothing. The `<Suspense>` is not optional: without one above it the server
render has nowhere to leave the fallback, and fails. This is what a
`typeof window` check or a "mounted" flag used to do; neither is needed.

<!-- /shared:browser-only -->

<!-- shared:server-only -->

## Server-only modules

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

<!-- /shared:server-only -->

## Alongside the rest of k8ordo

`@k8ordo/state` owns the search params, and this framework generates its
`Register` for you, so a filter is typed against the same routes. Changing the
search does not change the page: the router leaves the route tree alone,
nothing remounts, and the scroll position stays where the reader left it.

A page never sees the search: `useAppState` reads it in the browser, so a
server render shows the url slot's defaults and the live URL takes over on
hydration. That is the same split the router draws at the `?` — the pathname
is the framework's, everything after it is state's.

The one exception is a page that says what of the search it reads, by
exporting the url schema — `export const search = listState.url`. It receives
that slot, parsed as `listState.parseUrl` parses it, as `search`
(`PageProps<'/products'>` types it), and because it is rendered for the
search it was given, a navigation that moves the search loads it again, in
place: no scroll, no focus reset, nothing remounted. The generated table
reads it through `@k8ordo/state`, so the application depends on that. A
layout never receives it.

`@k8ordo/form` derives a form's constraint attributes, its messages and its
server-side validation from one zod schema — and since this mode has Server
Actions, the submission has somewhere to arrive.
