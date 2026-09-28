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
route grammar, the same boundaries, the same request handler, called for each
route at build time instead of once per request. The plugin is called
`framework()` in both packages for that reason: the mode is the import, and
`vite.config.ts` reads the same either way.

## Getting started

```bash
pnpm add @k8ordo/router @k8ordo/server react react-dom server-only
pnpm add -D vite
```

`@k8ordo/server` is a runtime dependency: `serve` and the built handler are
what the deployed application runs. `@k8ordo/static` is only ever needed at
build time, which is why its guide installs it with `-D`.

The package has three entries, split by where the code runs.
`@k8ordo/server` is the plugin, for `vite.config.ts`, and loads Vite.
`@k8ordo/server/runtime` is what code inside the request handler imports —
`redirect()`, `cookies()`, `responseHeaders()`, `requestHeaders()`,
`nonce()`, and the `RedirectTarget`, `RouteRequest` and `Guard` types — and
needs nothing from
Node, so it goes wherever the
handler goes.
`@k8ordo/server/serve` is `serve`, the Node.js server for a build. Neither of
the last two loads Vite, so the built application runs from an install
without dev dependencies.

```ts
// vite.config.ts
import { framework } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework()] });
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

`serve.js` and the hosts other than Node.js are in
[Running and deploying](references/deploy.md).

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you
cannot change.

**The root layout is the document, and hydration checks all of it.** Anything
that rewrites the HTML on the way to the browser — a CDN that inlines web
fonts, obfuscates email addresses, or defers scripts — changes a tree React is
about to reconcile, and hydration fails on the difference. The way to be
unaffected is to give such a service nothing to rewrite: serve the assets from
the same origin rather than linking them from another one.

## What running buys over static

An unknown URL gets a real 404 from the application rather than whatever the
host would have said; parameterised routes need no list of values, so a
catalogue that changes does not need a rebuild; a form can post to a Server
Action, and an action can `redirect()`; a page can read the request's
headers and cookies; and a `guard.ts` decides whether a request gets through
before anything renders. If none of that is needed, `@k8ordo/static` renders the
same application into files — the same grammar, the same boundaries, the same
handler, called for each route at build time.

## References

Each topic has a reference of its own. Read the one the task needs:

- [Routing](references/routing.md): the `routes/` grammar and what the build
  refuses, how a page answers and then streams, `loading.tsx`, `route.ts`,
  the generated `.k8ordo/` files, titles, and fetching the next page ahead.
- [Parameters](references/params.md): typing parameters with `paramsSchema`,
  and what a refused value becomes.
- [Errors and redirects](references/errors.md): `error.tsx`, `notFound()`
  and `not-found.tsx` under a real 404, and `redirect.ts`.
- [Execution boundaries](references/boundaries.md): `'use client'`,
  components that need a browser, `server-only` modules, and the search —
  `@k8ordo/state`'s, or handed to a page that exports `search`.
- [Server Actions](references/actions.md): `'use server'`, what an action
  may read and write, the page context it runs in, forms before JavaScript,
  and ending with `redirect()`.
- [Guards, cookies and the request](references/guards.md): `guard.ts`,
  `responseHeaders()`, `cookies()`, the `request` a page reads, and a
  Content-Security-Policy with `nonce()`.
- [Running and deploying](references/deploy.md): `serve`, the request
  handler on other runtimes, `vercel()`, a tab opened before a deploy, and
  serving under Vite's `base`.
