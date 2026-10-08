# @k8ordo/framework

Turns `src/routes/` into an application of React Server Components, built
with Vite — either built into files ahead of time for any static host
(`mode: 'static'`), or rendered per request, which is what gives an
application Server Actions, guards, cookies and a real 404
(`mode: 'server'`). Switching is changing `mode`; the routes, the boundaries
and the request handler stay as they are.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/en/framework
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install react react-dom server-only
npm install -D @k8ordo/framework @k8ordo/router vite typescript @types/node @types/react @types/react-dom
# or
pnpm add react react-dom server-only
pnpm add -D @k8ordo/framework @k8ordo/router vite typescript @types/node @types/react @types/react-dom
```

`@k8ordo/router` is a required peer, so the application and the framework
share one copy, but the application imports from `@k8ordo/framework`, which
re-exports what it needs (`href`, `notFound`, `PageProps`, …). Both are dev
dependencies in either mode: the build bundles what the application runs.

## Peer Dependencies

<!-- peers -->

| Package          | Version | Required | Needed for                                 |
| ---------------- | ------- | -------- | ------------------------------------------ |
| `@k8ordo/router` | ^1.0.0  | yes      | routing, re-exported by the framework      |
| `react`          | ≥19.3.0 | yes      | rendering                                  |
| `react-dom`      | ≥19.3.0 | yes      | rendering                                  |
| `vite`           | ≥8.0.0  | yes      | the build (`framework()` is a Vite plugin) |

<!-- /peers -->

## Quick Start

```ts
// vite.config.ts
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      paths: () => ['/products/1', '/products/2'], // for routes with parameters
      site: 'https://example.com', // and a sitemap.xml
    }),
  ],
});
// or: framework({ mode: 'server' }) — rendered per request
```

```
src/routes/
  layout.tsx            <html> and <body>; wraps everything through `children`
  page.tsx              /
  not-found.tsx         static: 404.html — server: a real 404
  error.tsx             shown in place of what is below when it throws
  products/[id]/page.tsx   /products/:id — `export const paramsSchema` types :id
  old/redirect.ts       /old sends the visitor elsewhere
  feed.xml/route.ts     /feed.xml answered by its GET — a Response, not a page
  admin/guard.ts        server mode: runs before everything under /admin
```

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

```bash
vite dev     # renders per request, with Fast Refresh
vite build   # static: dist/client/ is the site
```

Under `mode: 'server'` the build is a `dist/` that runs on its own — every
dependency bundled in, nothing to install where it is deployed — a form
posts to a Server Action, and a page receives `request`, the headers and the
cookies, read-only:

```bash
vite build
PORT=3000 node dist/server.js
```

```ts
// src/routes/_parts/actions.ts
'use server';

import { href } from '@k8ordo/framework';
import { redirect } from '@k8ordo/framework/server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect(href('/talks')); // 303 without JavaScript, a navigation with it
}
```

The built handler, `dist/rsc/index.js`, is a plain
`(request: Request) => Promise<Response>` that needs nothing from its runtime
but `AsyncLocalStorage`, so Node.js, Bun, Deno and Cloudflare Workers
(`nodejs_compat`) all run it, and `vercel()` from `@k8ordo/framework/vercel`
writes a build for Vercel.

Under `mode: 'static'` there is no request, so the build refuses by name
whatever needs one — a `'use server'` module, a `guard.ts`, an import of
`@k8ordo/framework/server` — in `vite dev` as well: `this application wants
mode: 'server'`.

## Migrating from `@k8ordo/static` or `@k8ordo/server`

Both 0.1.0 packages are this one now, and `mode` says which of them an
application was. Swap the dependency for `@k8ordo/framework` in
`devDependencies`, keep `@k8ordo/router` at `^1.0.0` there too, and move the
imports:

| 0.1.0                                                              | 1.0.0                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| `framework()` from `@k8ordo/static`                                | `framework({ mode: 'static' })` from `@k8ordo/framework/vite` |
| `framework()` from `@k8ordo/server`                                | `framework({ mode: 'server' })` from `@k8ordo/framework/vite` |
| a `serve.js` calling `serve` from `@k8ordo/server`                 | `node dist/server.js`, which the build writes                 |
| `serve` from `@k8ordo/server` in a server of your own              | `@k8ordo/framework/serve`, in `dependencies`                  |
| `redirect`, `RedirectTarget`, `RouteRequest` from `@k8ordo/server` | `@k8ordo/framework/server`                                    |
| `href`, `notFound`, `PageProps`, … from `@k8ordo/router`           | `@k8ordo/framework`                                           |

`useParams` and `useRoute` are not re-exported: a page takes `params` from
its props. `.k8ordo/` is rewritten by the next `vite dev` or `vite build`.
Everything else that changed since 0.1.0 — `redirect()` lost its options,
`sitemap()` is gone, the static mode refuses what needs a request — is in the
[1.0.0 entry of the changelog](https://github.com/k35o/k8ordo/blob/main/packages/framework/CHANGELOG.md).

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
This application is built with `@k8ordo/framework` (see `mode` in
`vite.config.ts`). Before adding or changing a route, read
`node_modules/@k8ordo/framework/docs/GUIDE.md`, then only the
`docs/references/*.md` it lists that the task needs. `src/routes/` is the
pathname space and holds only page.tsx, layout.tsx, not-found.tsx,
error.tsx, loading.tsx, redirect.ts, guard.ts and route.ts; everything else
goes under a `_`-prefixed directory. Never edit `.k8ordo/` — it is
generated. Import from `@k8ordo/framework` (never `@k8ordo/router`), and the
request API from `@k8ordo/framework/server`, which `mode: 'static'` refuses.
Build links with `href()`; search params are `@k8ordo/state`'s.
```

What each surface gives an agent:

| Surface                    | Where                                                 |
| -------------------------- | ----------------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/framework/docs/GUIDE.md`        |
| Reference docs             | `node_modules/@k8ordo/framework/docs/references/*.md` |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt        |
| Markdown twin on the web   | https://ordo.k8o.me/framework/docs/GUIDE.md           |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
