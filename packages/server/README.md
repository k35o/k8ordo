# @k8ordo/server

Runs a k8ordo application. Every request is answered by rendering — React
Server Components per request — which is what makes route parameters need no
list of values, an unknown URL a real 404, a Server Action something a form
can post to, and the request's headers and cookies something a page can read.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/server
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
pnpm add @k8ordo/router @k8ordo/server react react-dom server-only vite
```

The mode is the dependency: installing this package is what makes the
application one that runs, and `@k8ordo/static` is the other choice. Nothing
else about the application changes between them. `vite` is a runtime
dependency here, not a development one: this package's entry, where `serve`
and `redirect` come from, imports it.

## Peer Dependencies

| Package          | Version | Needed for                              |
| ---------------- | ------- | --------------------------------------- |
| `@k8ordo/router` | ^0.1.0  | the route table the framework generates |
| `react`          | ≥19.3.0 | rendering                               |
| `react-dom`      | ≥19.3.0 | rendering                               |
| `vite`           | ≥8.2.1  | the build, and `serve` at run time      |

## Quick Start

```ts
// vite.config.ts
import { framework } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework()] });
```

```
src/routes/
  layout.tsx            <html> and <body>; wraps everything through `children`
  page.tsx              /
  not-found.tsx         a real 404
  error.tsx             shown in place of what is below when it throws
  products/[id]/page.tsx   /products/:id — `export const paramsSchema` types :id
  old/redirect.ts       /old answers 307 with where to go
```

```js
// serve.js
import { serve } from '@k8ordo/server';

const server = await serve({ port: 3000 }); // { port, url, close }
```

```ts
// src/routes/_parts/actions.ts
'use server';

import { redirect } from '@k8ordo/server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect('/talks'); // 303 without JavaScript, a navigation with it
}
```

A page receives `params`, `pathname` and `request` — the headers and the
cookies, read-only. The built handler is a plain
`(request: Request) => Promise<Response>` in `dist/rsc/index.js`, so any host
that speaks that can run it.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
This application is built with `@k8ordo/server`. Before adding or changing a
route or a Server Action, read `node_modules/@k8ordo/server/docs/GUIDE.md`.
`src/routes/` is the pathname space and holds only page.tsx, layout.tsx,
not-found.tsx, error.tsx and redirect.ts; everything else goes under a
`_`-prefixed directory. Never edit `.k8ordo/` — it is generated. A Server
Action ends with `redirect()` from `@k8ordo/server`, not a returned URL.
Build links with `href()` from `@k8ordo/router`; search params are
`@k8ordo/state`'s.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/server/docs/GUIDE.md`    |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/server/docs/GUIDE.md       |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
