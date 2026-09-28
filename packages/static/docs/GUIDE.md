# @k8ordo/static

Builds a k8ordo application into files. Every route is rendered ahead of time,
and what ships is a directory a static host can serve — no server at run time.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

The framework is deliberately strict. Its constraints are not there to make
things quick; they are there so the structure of an application — where its
URLs live, where its execution boundaries are — stays in a form that can be
checked rather than remembered.

## The mode is the dependency

Installing this package is what makes an application static. Request-time data
is not a rule to remember here: there is no request, so there is nothing to
read it from. A Server Action is the one thing the underlying RSC pipeline
would still compile, so the build refuses it by name rather than shipping a
form that posts into nothing:

```
static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':
  src/routes/_parts/guestbook.ts
this application wants @k8ordo/server
```

`vite dev` is a running server that would happily accept that POST, so the
same refusal is said there too, the moment the file is seen — a form that
works in development and posts into nothing in production would be the worst
of the two.

A `guard.ts` — what `@k8ordo/server` runs before a request is answered — is
refused the same way, by name, in the build and in `vite dev`: a file is never
requested of anything that could run one.

```
static build cannot run guard.ts — a file has no request to guard, and these are guards:
  src/routes/admin/guard.ts
this application wants @k8ordo/server
```

Choosing the other mode means installing `@k8ordo/server` instead, and nothing
else about the application changes — the same route grammar, the same
boundaries, the same request handler, called for each route at build time
instead of once per request. The plugin is called `framework()` in both
packages for that reason: the mode is the import, and `vite.config.ts` reads
the same either way.

## Getting started

```bash
pnpm add @k8ordo/router react react-dom server-only
pnpm add -D @k8ordo/static vite
```

```ts
// vite.config.ts
import { framework } from '@k8ordo/static';
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
vite dev     # renders per request, with Fast Refresh (the framework brings
             # React's plugin)
vite build   # dist/client/ is the site
```

`vite dev` runs the same handler but writes no files, so it is not the build:
a param value `paths` does not list still renders, a `redirect.ts` answers
with a `307` (`308` when `permanent`) rather than a page that sends the
visitor on, an unknown URL gets the handler's 404 rather than the host's
`404.html`, and a page whose Server Component throws answers a `500` carrying
the thrown message, not `error.tsx` — the build would stop there.

`framework()` takes four options: `routesDir` (default `src/routes`),
`paths` (for routes with parameters — see
[Parameters](references/params.md#routes-with-parameters)), `csp` (see
[Content Security Policy](references/deploy.md#content-security-policy)), and
`site` — the origin the site is served from, `https://example.com`. With `site` the build also writes
`sitemap.xml`, listing every page it rendered; without it there is no sitemap,
because a sitemap of relative URLs is not one.

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you cannot
change.
**The root layout is the document, and hydration checks all of it.** Anything
that rewrites the HTML between the build and the browser — a CDN that inlines
web fonts, obfuscates email addresses, or defers scripts — changes a tree React
is about to reconcile, and hydration fails on the difference. The way to be
unaffected is to give such a service nothing to rewrite: serve the assets from
the same origin rather than linking them from another one.

## What static cannot do

Anything that needs the request: Server Actions and `redirect()` from them,
the `request` a page reads under `@k8ordo/server`, a `guard.ts` deciding
whether a request gets through, and status codes the application decides. A file cannot receive a form submission, and
whether `404.html` is served with a 404 rather than a 200 is the host's
setting — the build can write the page, but not the response.

If the application needs any of that, it wants `@k8ordo/server`. Everything
else in these docs stays exactly as it is.

## References

Each topic has a reference of its own. Read the one the task needs:

- [Routing](references/routing.md): the `routes/` grammar and what the build
  refuses, `loading.tsx`, a `route.ts` written as the file its `GET` answers,
  the generated `.k8ordo/` files, titles, and fetching the next page ahead.
- [Parameters](references/params.md): typing parameters with `paramsSchema`,
  and supplying the pathnames of parameterised routes with `paths`.
- [Errors and redirects](references/errors.md): `error.tsx`, what fails the
  build, `notFound()` and `not-found.tsx`, and a `redirect.ts` written as a
  page that sends the visitor on.
- [Execution boundaries](references/boundaries.md): `'use client'`,
  components that need a browser, `server-only` modules, and the search as
  `@k8ordo/state`'s.
- [The output and deploying](references/deploy.md): what `dist/client/`
  holds, `404.html`, a tab opened before a deploy, serving under Vite's
  `base`, and a Content-Security-Policy by hash.
