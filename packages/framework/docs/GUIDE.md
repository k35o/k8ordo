# @k8ordo/framework

Turns `src/routes/` into an application of React Server Components, built
with Vite, that runs with or without a server: `mode: 'static'` renders every
page at build time and needs no server, and `mode: 'server'` renders per
request on one. The routes, the boundaries and the request handler are the
same in both.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

The framework is deliberately strict. Its constraints are not there to make
things quick; they are there so the structure of an application — where its
URLs live, where its execution boundaries are — stays in a form that can be
checked rather than remembered.

## Choosing a mode

The question is whether the application needs the request. If it does, it
wants `mode: 'server'`; if it does not, `mode: 'static'`. The route grammar,
the boundaries and the request handler are the same in both: the handler is
called for each route at build time instead of once per request.

Switching takes more than changing `mode`. Towards `mode: 'server'`:

- drop `paths`, `site` and `csp`, which it refuses — the policy becomes a
  header a `guard.ts` writes, and no `sitemap.xml` is written,
- run the build with `node dist/server.js`, or hand its request handler to
  a host of your own ([Running and deploying](references/deploy.md)).

A `fallback.tsx` may stay: server mode renders every value with its page
and never renders it. Its placement is still checked, so a misplaced one
fails either build.

Towards `mode: 'static'`:

- list the values of every route with parameters in `paths` — and, for
  values the build cannot know, put a `fallback.tsx` beside the page
  ([Values the build did not write](references/params.md#values-the-build-did-not-write)),
- remove what static mode refuses (below), and every read of the `request`
  prop.

|                                 | `mode: 'static'`                                 | `mode: 'server'`                        |
| ------------------------------- | ------------------------------------------------ | --------------------------------------- |
| What ships                      | `dist/client/`, files any static host serves     | `dist/`, run with `node dist/server.js` |
| A route with parameters         | its values listed by the `paths` option          | any value, arriving with the request    |
| A value `paths` does not list   | `404.html`, or a `fallback.tsx`'s shell          | rendered by its page                    |
| A URL nothing answers           | the host serves `404.html`                       | the application answers with a real 404 |
| `redirect.ts`                   | written as a page that sends the visitor on      | answered with `307` / `308`             |
| `route.ts`                      | written as the file its `GET` answers            | answers every method it exports         |
| Server Actions (`'use server'`) | refused                                          | a form posts to one                     |
| `guard.ts`                      | refused                                          | runs before a request is answered       |
| The `request` prop              | not in the types, and refused when read          | the headers and cookies, read-only      |
| A page exporting `search`       | refused                                          | receives the search, parsed             |
| `@k8ordo/framework/server`      | refused                                          | `cookies()`, `redirect()`, `nonce()`, … |
| Content Security Policy         | the `csp` option, inline scripts allowed by hash | a header a guard writes, with `nonce()` |

### What static mode refuses

Under `mode: 'static'` there is no request, so nothing that answers one can
be built. The build does not leave such code to fail quietly in production:
it refuses it by name, every offending file of a kind at once. What the route
files declare — a `guard.ts`, a page's `search`, a `route.ts`'s methods — is
refused before anything is compiled; the `@k8ordo/framework/server` imports
and `'use server'` modules only after compiling, which is what finds them.
So a build stopped by the first can stop again on the second.

```
static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':
  src/lib/guestbook.ts
this application wants mode: 'server'
```

The same refusal, with the same last line, is said for:

- a module importing `@k8ordo/framework/server` (`import type { … }` is
  erased before the build sees it, and passes; `import { type … }` stays
  behind as an import of the module under `verbatimModuleSyntax`, and is
  refused),
- a `'use server'` module,
- a `guard.ts`,
- a page that exports `search`,
- a `route.ts` that exports any method but `GET`.

```
static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:
  src/lib/session.ts
this application wants mode: 'server'
```

The build names the application's own modules. A dependency it leaves
external — one installed in `node_modules` — is not compiled, so its import
of `@k8ordo/framework/server` is not seen; what is refused there is the call
— `cookies()`, `requestHeaders()`, `responseHeaders()`, `nonce()` — and the
page or `route.ts` that made it fails to build. A page reading the `request`
prop fails the same way, with the same last line.

A `route.ts` or a page that re-exports with `export * from` is refused as
well: the build reads a route's methods and a page's `search` by name, and
`export *` names none.

`vite dev` is a running server that would accept the POST and run the
guard, so it says the same thing, naming the module the moment it is
compiled. Code that works in development and does nothing in production
would be the worst of the two.

## Getting started

```bash
pnpm add react react-dom server-only
pnpm add -D @k8ordo/framework @k8ordo/router vite typescript @types/node @types/react @types/react-dom
```

`@k8ordo/router` is a required peer: the framework is built on it, and the
application and the framework have to share one copy. Install it, but import
from `@k8ordo/framework`, which re-exports what an application needs.
`server-only` is what marks a module the client may never reach
([Execution boundaries](references/boundaries.md#server-only-modules)).

The framework and the router are dev dependencies in either mode: the build
bundles what the application runs, so nothing reads them once it is built.
A server of your own that imports `@k8ordo/framework/serve` is the one
exception, and puts the framework in `dependencies`
([Running and deploying](references/deploy.md#running-the-build)).

```ts
// vite.config.ts
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework({ mode: 'static' })] });
// or framework({ mode: 'server' })
```

The framework writes the route table and its types into `.k8ordo/`. Add it
to `include` in `tsconfig.json` as a glob, `.k8ordo/**/*.ts` (an entry
naming only the dot-directory leaves its files out), and `href()`'s paths
and a page's `params` are typed. The generated files import without file
extensions, so they resolve under `moduleResolution: "bundler"`, as Vite
does. A fresh clone has no `.k8ordo/` until `vite build` or `vite dev`
writes it, so CI runs the build before `tsc`
([The generated files](references/routing.md#the-generated-files)).

```tsx
// src/routes/layout.tsx — no directive, so this is a Server Component
import type { LayoutProps } from '@k8ordo/framework';

export default function RootLayout({ children }: LayoutProps<'/'>) {
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

`src/routes/` holds route files and nothing else. Components go in
`src/components/`, and every other module — Server Actions, schemas, state
definitions, data, helpers — in `src/lib/`
([Routing](references/routing.md#routes)).

```bash
vite dev     # renders per request, with Fast Refresh (the framework brings
             # React's plugin)
vite build   # static: dist/client/ is the site
             # server: dist/, run with node dist/server.js
```

How a build is served — `node dist/server.js`, the hosts other than
Node.js, a static host — is in [Running and deploying](references/deploy.md).

The root layout renders `<html>` and `<body>`: the framework has no document
template of its own, because a template you cannot see is a template you
cannot change.

**The root layout is the document, and hydration checks all of it.** Anything
that rewrites the HTML on the way to the browser — a CDN that inlines web
fonts, obfuscates email addresses, or defers scripts — changes a tree React
is about to reconcile, and hydration fails on the difference. The way to be
unaffected is to give such a service nothing to rewrite: serve the assets from
the same origin rather than linking them from another one.

### `vite dev` under static mode

`vite dev` runs the handler per request in either mode, and writes no files.
Under `mode: 'static'` that makes it not quite the build: a parameter value
`paths` does not list still renders with its page, a `redirect.ts` answers
with a `307` (`308` when `permanent`) rather than a page that sends the
visitor on, an unknown URL gets the handler's 404 rather than the host's
`404.html`, and a page whose Server Component throws answers a `500`
carrying the thrown message, where the build would stop.

Beside a `fallback.tsx`, a value `paths` does not list gets the shell
instead, as a host's rewrite would answer it, and `vite dev` says so once
per `fallback.tsx`. It calls `paths` only for an application with a
`fallback.tsx`, and again only when the patterns it hands in change, so a
value added to the data since is answered as an unlisted one.

`vite preview` after a static build serves it as a static host does: the
files in `dist/client/`, the rewrites in its `_redirects`, and `404.html`
under a `404`. It never calls the handler, so a page is the file the build
wrote, with its Content-Security-Policy `<meta>`
([Serving a static build](references/deploy.md#serving-a-static-build)).

## The entries

The package is split by where the code runs.

- `@k8ordo/framework` — what the application's own code imports: `href`,
  `navigateTo`, `bindParams`, `notFound`, `usePathname`,
  `usePendingPathname`, `useMatch`, `matchPath`, `withBase`, and the types
  `PageProps`, `LayoutProps`, `RouteContext` and `ErrorProps`, re-exported
  from `@k8ordo/router`. `useParams` and `useRoute` are not among them: they
  read a `<Router>` the framework never renders, and a page receives
  `params` as a prop instead.
- `@k8ordo/framework/vite` — `framework()`, for `vite.config.ts` only. It
  loads Vite.
- `@k8ordo/framework/server` — server mode only. What code inside the
  request handler imports: `cookies()`, `responseHeaders()`,
  `requestHeaders()`, `redirect()`, `nonce()`, and the types `Guard`,
  `GuardContext`, `RouteRequest` and `RedirectTarget`.
- `@k8ordo/framework/serve` — `serve`, the Node.js server for a build: what
  `dist/server.js` runs, for a server of your own to import. A static build
  it serves as a static host does, its `_redirects` applied.
- `@k8ordo/framework/vercel` — `vercel()`, the plugin that writes a build
  of either mode for Vercel.
- `@k8ordo/framework/generated` — what the generated `.k8ordo/` files
  import. Not for code written by hand.

`/server` needs nothing from Node but `AsyncLocalStorage`, so it goes
wherever the handler goes, and `/serve` is apart from it for that reason.
Neither loads Vite, so a server of your own runs from an install without
dev dependencies.

## The options

`framework()` takes `mode`, which is required, and `routesDir`, the route
directory (default `src/routes`). Three more describe files, so only
`mode: 'static'` takes them — passing them with `mode: 'server'` is a type
error:

- `paths` — the pathnames of routes with parameters, and where a
  `fallback.tsx`'s shell stands
  ([Parameters](references/params.md#routes-with-parameters)).
- `site` — the origin the site is served from, `https://example.com`. With
  it the build also writes `sitemap.xml`, listing every page it rendered;
  without it there is no sitemap, because a sitemap of relative URLs is not
  one.
- `csp` — the Content-Security-Policy each page carries
  ([Content Security Policy](references/csp.md#static-mode-hashes-in-a-meta)).

## References

Each topic has a reference of its own. Read the one the task needs:

- [Routing](references/routing.md): the `routes/` grammar and what the build
  refuses, how a page answers and streams, `loading.tsx`, `route.ts`, the
  generated `.k8ordo/` files, titles, and fetching the next page ahead.
- [Parameters](references/params.md): typing parameters with `paramsSchema`,
  what a refused value becomes, and, under static mode, supplying the
  pathnames with `paths` and answering the values it does not list with a
  `fallback.tsx`.
- [Errors and redirects](references/errors.md): `error.tsx`, what fails a
  static build, `notFound()` and `not-found.tsx`, and `redirect.ts`.
- [Execution boundaries](references/boundaries.md): `'use client'`,
  components that need a browser, `server-only` modules, and the search —
  `@k8ordo/state`'s, or handed to a page that exports `search`.
- [Server Actions](references/actions.md): server mode only. `'use server'`,
  what an action may read and write, the page context it runs in, forms
  before JavaScript, and ending with `redirect()`.
- [Guards, cookies and the request](references/guards.md): server mode
  only. `guard.ts`, `responseHeaders()`, `cookies()`, and the `request` a
  page reads.
- [Content Security Policy](references/csp.md): `nonce()` under server
  mode, the `csp` option and hashes under static mode.
- [Running and deploying](references/deploy.md): what a static build
  writes, the rewrites that reach its shells on each host, `serve` and
  `vite preview`, the request handler on other runtimes, `vercel()`, a tab
  opened before a deploy, and serving under Vite's `base`.
