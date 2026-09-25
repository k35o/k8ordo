# @k8ordo/state

Declare state by where it lives — URL search params, hidden history-entry
state, localStorage, sessionStorage, a cookie, or memory. One zod schema per
boundary place (URL, entry, Web Storage, cookie) derives the server-side
read, canonical links, salvage of stale data, and a client subscription with exact per-key
change detection; memory never crosses a boundary, so it is a typed shared
box with no schema. Links and GET forms write the URL before JavaScript loads
under any router (the server renders what they wrote wherever it reads the
search); imperative URL updates ride the Navigation API.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/state
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install @k8ordo/state zod
# or
pnpm add @k8ordo/state zod
```

## Peer Dependencies

| Package          | Version | Needed for                                               |
| ---------------- | ------- | -------------------------------------------------------- |
| `react`          | ≥19.3.0 | `useAppState`                                            |
| `zod`            | ^4.4.3  | the schemas (`zod/mini` works, and is the lighter pick)  |
| `@k8ordo/router` | ^0.1.0  | optional — typed `href` paths from the app's route table |
| `typescript`     | ≥7.0.2  | the shipped type declarations                            |
| `@types/react`   | ≥19.3.0 | the shipped type declarations                            |

The schema ships to the browser here — the client parses and serializes with
it — so reach for `zod/mini` unless the app already pays for classic `zod`.
`@k8ordo/router` is a type-only peer: it is never loaded at runtime.

## Quick Start

One definition per place, in a shared module with no `'use client'`:

```ts
// state.ts
import { defineLocalState, definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const listState = definePageState('list', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number(), 1),
  }),
});

export const prefs = defineLocalState(
  'prefs',
  z.object({ view: z._default(z.enum(['grid', 'table']), 'grid') }),
);
```

```tsx
// page.tsx — a Next.js Server Component
import { listState } from './state';

export default async function Page({ searchParams }: PageProps<'/products'>) {
  const url = listState.parseUrl(await searchParams); // typed, defaults applied
  const products = await fetchProducts(url);
  return (
    <>
      <Filters initialUrl={url} />
      <ProductList products={products} />
      <a href={listState.href('/products', { ...url, page: url.page + 1 })}>
        next
      </a>
    </>
  );
}
```

```tsx
// filters.tsx
'use client';
import { useAppState } from '@k8ordo/state';
import { listState, prefs } from './state';

export function Filters({ initialUrl }: FiltersProps) {
  const [{ q, page }, update] = useAppState(listState, { initialUrl });
  const [{ view }, updatePrefs] = useAppState(prefs, ['view']);

  return (
    <>
      <p>{q === '' ? 'all products' : `searching “${q}”`}</p>
      <button type="button" onClick={() => update({ page: page + 1 })}>
        next page
      </button>
      <button type="button" onClick={() => updatePrefs({ view: 'table' })}>
        table view
      </button>
    </>
  );
}
```

`parseUrl` needs a router that hands the page its search, as Next.js does;
under `@k8ordo/static` and `@k8ordo/server` a page never sees it, and
`useAppState` reads the url slot in the browser. A preference the server
should render goes in `defineCookieState` instead of `defineLocalState`:
under `@k8ordo/server`, `parseCookies(request.cookies)` reads it and
`initialCookie` seeds the first render, so the default never flashes.

`update()` applies synchronously, batches per handler into one write (memory
applies per call), and returns `{ committed, finished }` handles. `href` omits
every field at its default, so every link is canonical. A value the schema
rejects — a URL a user edited, a row an older schema wrote — falls back to its
own default, field by field.

The [design guide](docs/GUIDE.md) covers the rest: the places and when each
fits, history-entry state, cookie state the server renders (and why it is
never a secret), migrating stored rows with `version` and `migrate`,
batching and update handles, subscription granularity,
router requirements, typed routes via `Register`, reading local state before
hydration with `inlineRead()`, and GET forms with `@k8ordo/form`.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/state` for URL, history-entry, localStorage, sessionStorage,
cookie and shared memory state. Before adding or changing state, read
`node_modules/@k8ordo/state/docs/GUIDE.md`. Declare each state by where it
lives (`definePageState` / `defineLocalState` / `defineSessionState` /
`defineCookieState` / `defineMemoryState`) in a shared module, read the url slot with `parseUrl`
where the router hands the page its search and a cookie state with
`parseCookies` where it hands the page the request's cookies, build links
with `href`, and subscribe on the client with `useAppState`. Every boundary
field needs a default or `.optional()`; never put a secret in a cookie state
(the browser writes it, so it cannot be `HttpOnly`); never mirror a
definition's values into React state.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/state/docs/GUIDE.md`     |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/state/docs/GUIDE.md        |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
