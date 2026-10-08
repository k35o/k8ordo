# @k8ordo/framework

Turns `src/routes/` into an application of React Server Components, built
with Vite. The application is either built into files ahead of time
(`mode: 'static'`) or rendered per request (`mode: 'server'`); the routes,
the boundaries and the request handler are the same in both.

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

Towards `mode: 'static'`:

- list the values of every route with parameters in `paths`,
- remove what static mode refuses (below), and every read of the `request`
  prop.

|                                 | `mode: 'static'`                                 | `mode: 'server'`                        |
| ------------------------------- | ------------------------------------------------ | --------------------------------------- |
| What ships                      | `dist/client/`, files any static host serves     | `dist/`, run with `node dist/server.js` |
| A route with parameters         | its values listed by the `paths` option          | any value, arriving with the request    |
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
  src/routes/_parts/guestbook.ts
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
  src/routes/_parts/session.ts
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

Neither mode needs `"type": "module"` in the application's `package.json`:
the build writes `dist/package.json`, which says the `.js` files in `dist/`
are ES modules. Vite still loads its config by the application's `type`,
though, so an application without `type: module` names it
`vite.config.mts`: as `vite.config.ts` it warns on every build and every
`vite dev` that it is ESM in a file loaded as CommonJS, and a config using
top-level `await` does not load at all.

```ts
// vite.config.ts (vite.config.mts without "type": "module")
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework({ mode: 'static' })] });
// or framework({ mode: 'server' })
```

```json
// tsconfig.json — the generated type wiring lives in .k8ordo/
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts", "*.ts", "*.mts"]
}
```

That is a complete `tsconfig.json` for a new application; to an existing
one, add what it lacks. Without `jsx`, `tsc` cannot read the route files
the generated table imports, and `vite/client` is what types
`import.meta.env`.

`moduleResolution` is `bundler`, the way Vite resolves: the generated files
import without file extensions, and under `nodenext` none of those imports
resolve, so the table they register is lost along with them.

`.k8ordo` starts with a dot, and a bare directory entry in `include` silently
skips it — the glob is what makes the generated types apply. Without them
the build still works, but `tsc` checks against no table, and under
`mode: 'server'` a page reading `request` or `search` fails to type-check. A
fresh clone has no `.k8ordo/` until `vite build` or `vite dev` writes it, so
CI runs the build before `tsc`
([The generated files](references/routing.md#the-generated-files)).
`*.ts` and `*.mts` are what take in `vite.config.ts` or `vite.config.mts`,
so a missing `mode`, or an option the mode does not take, is a type error
in the editor as well as the error `framework()` throws when the config
loads.

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
`paths` does not list still renders, a `redirect.ts` answers with a `307`
(`308` when `permanent`) rather than a page that sends the visitor on, an
unknown URL gets the handler's 404 rather than the host's `404.html`, and a
page whose Server Component throws answers a `500` carrying the thrown
message, where the build would stop.

`vite preview` after a static build is not the host either. It serves what
exists in `dist/client/` as a file — `/old/index.html`, `404.html`,
`sitemap.xml` — and hands every other URL, a page's own URL included, to the
same handler compiled into `dist/rsc/`, which answers as `vite dev` does
above. To see what a host will serve, serve `dist/client/` with a static file
server.

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
- `@k8ordo/framework/serve` — server mode only. `serve`, the Node.js server
  for a build: what `dist/server.js` runs, for a server of your own to
  import.
- `@k8ordo/framework/vercel` — server mode only. `vercel()`, the plugin that
  writes a build for Vercel.
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

- `paths` — the pathnames of routes with parameters
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
  pathnames with `paths`.
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
  writes, `serve`, the request handler on other runtimes, `vercel()`, a tab
  opened before a deploy, and serving under Vite's `base`.
