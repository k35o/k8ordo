# @k8ordo/router

The URL's pathname axis, owned. One route table is the application's pathname
schema, and from it come the types, the matching, the links, and the
navigation — over the Navigation API and URLPattern. Search params and
history-entry state are not its business; those belong to `@k8ordo/state`,
and the division is the URL's own `?`.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/router
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install @k8ordo/router
# or
pnpm add @k8ordo/router
```

Under `@k8ordo/static` or `@k8ordo/server` this package is what the framework
builds on: the table is generated from `src/routes/`, and what an application
uses of it is the half that needs no table — `href`, `navigateTo` and
`bindParams`; `usePathname`, `useMatch` and `matchPath` — plus the route
files' props types, `PageProps` and `LayoutProps`. On its own it is the whole
router for an application that renders in the browser.

## Peer Dependencies

| Package        | Version | Needed for                    |
| -------------- | ------- | ----------------------------- |
| `react`        | ≥19.3.0 | `<Router>` and the hooks      |
| `typescript`   | ≥7.0.2  | the shipped type declarations |
| `@types/react` | ≥19.3.0 | the shipped type declarations |

No runtime dependencies. The Navigation API and URLPattern are the platform's.

## Quick Start

```ts
// routes.ts — the pathname schema, in one place
import { defineRoutes } from '@k8ordo/router';

export const routes = defineRoutes({
  '/': Home,
  '/products': {
    layout: Shell,
    error: ProductsError, // shown inside Shell when what is below throws
    children: { '/': ProductList, '/:id': ProductPage },
  },
  '/*': NotFound,
});
```

```tsx
// app.tsx — mounted once; layouts render what they wrap through <Outlet />
import { Outlet, Router } from '@k8ordo/router';

export const App = () => <Router routes={routes} />;
export const Shell = () => (
  <section>
    <nav>…</nav>
    <Outlet />
  </section>
);
```

```tsx
// anywhere — from the pattern string alone, never importing the table
import { href, navigateTo, useMatch, useParams } from '@k8ordo/router';

<a href={href('/products/:id', { id })}>…</a>; // a plain <a> is a client navigation
navigateTo('/products'); // push; the back button undoes it
const { id } = useParams('/products/:id'); // typed from the pattern
const inProducts = useMatch('/products/*'); // which section is showing
```

Augment `Register` once (`interface Register { routes: typeof routes }`) and
every pattern is checked against the table. The [design guide](docs/GUIDE.md)
covers the grammar (params, wildcards, route groups, declaration order), what
navigation guarantees (`finished` after the tree is on screen, scroll to top
or fragment on a new page, superseded navigations abort), error boundaries in
the table, and how the framework reuses the navigation half.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/router` for routing. Before touching routes or links, read
`node_modules/@k8ordo/router/docs/GUIDE.md`. The route table is the one
place the pathname space is declared; pages build links with
`href(pattern, params)` from the pattern string and never import the table.
There is no `<Link>` — a plain `<a>` is a client navigation. Search params
are `@k8ordo/state`'s, never the router's.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/router/docs/GUIDE.md`    |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/router/docs/GUIDE.md       |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
