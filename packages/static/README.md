# @k8ordo/static

Builds a k8ordo application into files. Every route is rendered ahead of time
— React Server Components at build time — and what ships is a directory a
static host can serve: HTML per page, its RSC payload beside it for client
navigation, `404.html`, and a sitemap. No server at run time.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/static
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
pnpm add @k8ordo/router react react-dom server-only
pnpm add -D @k8ordo/static vite
```

The mode is the dependency: installing this package is what makes the
application static, and `@k8ordo/server` is the other choice. Nothing else
about the application changes between them.

## Peer Dependencies

| Package          | Version | Needed for                                 |
| ---------------- | ------- | ------------------------------------------ |
| `@k8ordo/router` | ^0.1.0  | the route table the framework generates    |
| `react`          | ≥19.3.0 | rendering                                  |
| `react-dom`      | ≥19.3.0 | rendering                                  |
| `vite`           | ≥8.2.1  | the build (`framework()` is a Vite plugin) |

## Quick Start

```ts
// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      paths: () => ['/products/1', '/products/2'], // for routes with parameters
      site: 'https://example.com', // and a sitemap.xml
    }),
  ],
});
```

```
src/routes/
  layout.tsx            <html> and <body>; wraps everything through `children`
  page.tsx              /
  not-found.tsx         404.html
  error.tsx             shown in place of what is below when it throws
  products/[id]/page.tsx   /products/:id — `export const paramsSchema` types :id
  old/redirect.ts       /old sends the visitor elsewhere
```

```bash
vite dev     # a real server, so the pages behave as they will in production
vite build   # dist/client/ is the site
```

Server is the default; the browser side is opted into with `'use client'`,
and a module that imports `server-only` can never reach the client bundle. A
`'use server'` module fails the build — and `vite dev` — by name: a file
cannot receive a Server Action, and that application wants `@k8ordo/server`.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
This application is built with `@k8ordo/static`. Before adding or changing a
route, read `node_modules/@k8ordo/static/docs/GUIDE.md`. `src/routes/` is
the pathname space and holds only page.tsx, layout.tsx, not-found.tsx,
error.tsx and redirect.ts; everything else goes under a `_`-prefixed
directory. Never edit `.k8ordo/` — it is generated. Build links with
`href()` from `@k8ordo/router`; search params are `@k8ordo/state`'s.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/static/docs/GUIDE.md`    |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/static/docs/GUIDE.md       |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
