# Parameters

What a route parameter arrives as, and — under `mode: 'static'` — how the
build learns which values to render, and what answers the ones it did not.
Under `mode: 'server'` a value comes with the request and needs no list.

## Parameters with a schema

A parameter arrives as a string, because a URL carries nothing else. A page —
or a layout, for every page below it — may say what it expects instead
(`paramsSchema`, not `params`: the page's own prop is `params`, and a
module-level binding of the same name would shadow it):

```tsx
// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/framework';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return <h1>{params.id}</h1>; // a number — the schema said so
}
```

The generator sees the `paramsSchema` export and wires it in: the schemas along a
page's stack — every layout above it that declared one, then its own — run
before the page renders, each replacing the strings it names with what it
produced. `PageProps<'/products/:id'>` is those props by the pattern —
`params` typed by the schemas, and `pathname`, plus `request` under
`mode: 'server'` — read from the generated `Register`; a page may equally
declare its props inline (`{ params: { id: number } }`), since the generated
table checks them where it uses the component either way.
The export is found by parsing the file, so any spelling of it counts —
`export const { paramsSchema } = locales` included — and the words inside a
string or a comment do not. The generated table checks each schema against
its file's pattern, and only loosely: on a pattern that has params, a schema
that names none of them is a type error there, which type-checking reports and
`vite build` does not; anything else passes. A schema that requires a param a
page's pattern lacks refuses every pathname of that page, so that page never
answers. Any library that implements Standard Schema works — zod, zod/mini, or
another — and the schema must be synchronous, because which pattern answers a
pathname is decided before anything renders. The file that exports it must be
a Server Component file: from a `'use client'` module the export reaches the
handler as a client reference, not a schema. A layout that has to be a client
component keeps its schema in a Server Component `layout.tsx` that renders the
client shell.

**A refused param is a pathname the pattern does not answer.** `/products/shoes`
does not become a page that renders with `NaN`; the walk goes on to whatever
the table declares next, which in the end is `not-found.tsx` under a 404 —
exactly as if the directory had never matched. A catch-all is never
refused: it answers what nothing else did, and a 404 is already what a refused
param means. The schemas of the layouts above its `not-found.tsx` still run
over its params, for what they write to the render — the locale of
`/en/missing` is the one `@k8ordo/i18n`'s schema accepted — and when one
refuses (`/fr/missing`), the not-found renders as if none had run.

**Links take what the page receives.** The generated `Register` carries the
schema's output type per pattern, so `href('/products/:id', { id: 42 })` takes
the number and spells it the one way the schema will read back; a string there
is a type error, as is an object.

A layout receives its params as strings whatever it declared — under
`not-found.tsx`, which renders whatever the schemas said, a typed value would
be a lie, and a not-found receives strings for the same reason. A layout that
wants the parsed value beside the page's parses it itself, or declares the
schema and lets the pages below it receive the result.

## Routes with parameters

Static mode only. A build into files cannot invent parameter values, so it
asks the parameter's own directory for them — a `paths.ts`, one more route
file:

```ts
// src/routes/products/[id]/paths.ts
import type { Paths } from '@k8ordo/framework';

import { listProducts } from '../../../lib/catalog.server';

const paths: Paths<'/products/:id'> = async () =>
  (await listProducts()).map((product) => String(product.id));

export default paths;
```

Its default export is a function returning the values the directory's
parameter takes: an array of strings, or a promise of one. `Paths<Pattern>`
is its type — exported from `@k8ordo/framework`, a type only — where the
pattern is the directory's own, ending in that parameter; the generated
table checks each file against it.

**It runs where the pages run.** The build asks from the built RSC bundle,
and `vite dev` through the RSC environment's module runner: the module graph
the pages are in. So a `paths.ts` imports the application's modules by their
aliases, a `server-only` one included, and shares their instances with the
pages — a catalog it read and cached is the one the pages then read.

**It covers everything below its directory.** The `page.tsx` beside it, and
every page, `route.ts` and `redirect.ts` in the directories below, are
written once per value: with `blog/[slug]/paths.ts`, so are
`blog/[slug]/og.png/route.ts` (`/blog/:slug/og.png`) and
`blog/[slug]/article.md/route.ts`. No pattern is expanded by hand.

**It receives the params above it**, and is called once per combination of
their values:

```ts
// src/routes/[locale]/paths.ts
import type { Paths } from '@k8ordo/framework';

const paths: Paths<'/:locale'> = () => ['ja', 'en'];

export default paths;
```

```ts
// src/routes/[locale]/posts/[id]/paths.ts
import type { Paths } from '@k8ordo/framework';

import { postsIn } from '../../../../lib/posts.server';

const paths: Paths<'/:locale/posts/:id'> = async ({ locale }) =>
  (await postsIn(locale)).map((post) => String(post.id));

export default paths;
```

The params arrive as the strings the files above returned — no
`paramsSchema` has run. A `paths.ts` below a parameter whose directory has
none cannot be asked, and the build refuses:

```
[locale]/posts/[id]/paths.ts is asked for its values once per value of the parameters above it, and /:locale/posts still holds one — give that parameter's directory a paths.ts too
```

**A value is the segment as a visitor reads it** — `café`, `a b` — not
URL-escaped; the build escapes it for the URL and writes the file under the
unescaped name. Values are non-empty strings, so an id is spelled
(`String(product.id)`), and a value repeated is written once:

```
tags/[tag]/paths.ts has to return an array of non-empty strings, the values of :tag
```

A value that is `..` names a file outside the output, and `!fallback` is the
segment the build keeps for shells:

```
a pathname to write leaves the output: /products/..
a paths.ts returned !fallback, which the build keeps for shells: /posts/!fallback
```

A parameter with no `paths.ts` in its directory stays open, and an open
route **fails the build** — unless its page has a `fallback.tsx` beside it,
whose shell answers the values the build did not write
([Values the build did not write](#values-the-build-did-not-write)):

```
static build needs the values of /tags/:tag — a paths.ts in each parameter's directory returns them, and a fallback.tsx beside a page answers the ones the build does not write
```

Shipping a site quietly missing half its pages is worse than not shipping one.
Parameterless routes need no declaration; they are taken from the table.

A returned value that a `paramsSchema` along its route's stack refuses
fails the build too — it would otherwise be written as a 404 page under a
URL the site claims to have — and so does one whose page says `notFound()`:

```
a paths.ts returned values a params schema refused: /products/shoes
a paths.ts returned values whose page called notFound(): /products/3
```

Neither is written to `dist/client/`. A build that meets both names them in
one error, with any page that failed to render, so fixing one does not reveal
the next.

`paths.ts` belongs in a `[param]` directory and nowhere else
([What the build refuses](routing.md#what-the-build-refuses)), and
`framework()` takes no `paths` option — passing one throws when the config
loads:

```
framework() takes no paths — a parameter's values come from a paths.ts in its directory under routes/
```

Under `mode: 'server'` a `paths.ts` is never read and nothing of it is
built in, so the same `routes/` works in both modes.

## Values the build did not write

Static mode only. A page whose values outgrow the build — a post published
after the site was deployed, an id in a link nobody listed — keeps a
`fallback.tsx` beside it:

```
src/routes/posts/[id]/
  paths.ts        the ids the build writes
  page.tsx        each of them, rendered at build time
  fallback.tsx    every other id: the shell, its post drawn in the browser
```

The build writes the page for each id `paths.ts` returns, and once more a
**shell**: the layouts above rendered as HTML, with the `fallback.tsx` in
the page's place, at `posts/!fallback/`. The host answers any other id with
it, through the rewrites the build writes beside the pages
([Rewrites to a shell](deploy.md#rewrites-to-a-shell)), and the browser,
which has the id in its URL, reads the post itself. Without the `paths.ts`
the build writes no post at all, and the shell answers every id.

```tsx
// src/routes/posts/[id]/page.tsx — the ids paths.ts returns
import { notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';

import { PostArticle } from '../../../components/post';
import { findPost } from '../../../lib/posts.server';

export { postParams as paramsSchema } from '../../../lib/post-params';

export default async function PostPage({ params }: PageProps<'/posts/:id'>) {
  const post = await findPost(params.id);
  if (post === undefined) notFound();
  return <PostArticle post={post} />;
}
```

```tsx
// src/routes/posts/[id]/fallback.tsx — every other id
import { Suspense } from 'react';

import { PostFromUrl } from '../../../components/post-from-url';

export default function PostShell() {
  return (
    <Suspense fallback={<p>loading the post…</p>}>
      <PostFromUrl />
    </Suspense>
  );
}
```

```tsx
// src/components/post-from-url.tsx
'use client';

import { notFound, useMatch } from '@k8ordo/framework';
import { use } from 'react';

import { postId } from '../lib/post-params';
import { readPost } from '../lib/posts';
import { PostArticle } from './post';

export function PostFromUrl() {
  const match = useMatch('/posts/:id');
  if (match === null) return null; // the URL has moved on: the visitor is leaving
  const id = postId.safeParse(match.id); // the page's schema does not run for a shell
  const post = id.success ? use(readPost(id.data)) : undefined;
  if (post === undefined) notFound();
  return <PostArticle post={post} />;
}
```

```tsx
// src/components/post.tsx — the page and the shell draw a post the same way
export type Post = { readonly id: number; readonly title: string };

export function PostArticle({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title}</title>
      <h1>{post.title}</h1>
    </article>
  );
}
```

```ts
// src/lib/post-params.ts — one schema for the page and the browser
import * as z from 'zod/mini';

export const postId = z.coerce.number().check(z.int(), z.positive());
export const postParams = z.object({ id: postId });
```

```ts
// src/lib/posts.ts — a post, read from the browser
import type { Post } from '../components/post';

// use() needs the same promise on every render, so one per id
const reads = new Map<number, Promise<Post | undefined>>();

export const readPost = (id: number): Promise<Post | undefined> => {
  const read =
    reads.get(id) ??
    fetch(`https://api.example.com/posts/${String(id)}`).then(
      async (response) => {
        if (response.status === 404) return undefined;
        if (!response.ok)
          throw new Error(`post ${String(id)}: ${String(response.status)}`);
        return (await response.json()) as Post;
      },
    );
  reads.set(id, read);
  return read;
};
```

```ts
// src/routes/posts/[id]/paths.ts
import type { Paths } from '@k8ordo/framework';

import { listPosts } from '../../../lib/posts.server';

const paths: Paths<'/posts/:id'> = async () =>
  (await listPosts()).map((post) => String(post.id));

export default paths;
```

`paths.ts` reads the ids through `posts.server.ts`, the module the page
reads a post through: it runs in the server environment, where a module
that imports `server-only` loads. No parameter stands above `[id]`, so the
shell stands at the pattern itself, `/posts/:id`.

### What a `fallback.tsx` is handed

Nothing. It stands for every value the build did not write, so it has none
to receive — no `params`, no `pathname`. It may be a Server Component, sync
or async, rendered once at build time, so it may read `server-only` data
that is the same for every value it stands for; or a `'use client'` one.
What depends on the value is a client component inside it, which reads the
value from the URL in the browser.

### Reading the value in the browser

The browser hydrates a shell as it was rendered for `/posts/!fallback`,
keeping every element the build wrote, as it does `404.html`, and renders it
again where the visitor is once it is hydrated. What the `fallback.tsx`
renders was left to the browser by the build, so a client component inside
it reads the visitor's URL from its first render.

Below a `fallback.tsx`, `useMatch()` and `usePathname()` wait for the
browser on their own: in the build's render they suspend, as
[`use(browser())`](boundaries.md#components-that-need-a-browser) does, so
the build never writes what they would read there. Put a `<Suspense>` around
what reads them, inside `fallback.tsx`: its fallback is what the HTML shows
in their place, the placeholder a visitor sees until the browser has the
value. Without one, the framework's own, around the whole `fallback.tsx`,
leaves nothing there. The layouts above stay HTML either way.

`useMatch()` returns `null` when the URL no longer fits the pattern. That
happens on the way out: a navigation commits the URL before the next page
arrives, and the shell still on screen renders once more with it. Render
`null` then — `notFound()` there would flash the not-found as the visitor
leaves.

The value arrives as the URL spelled it, and the page's `paramsSchema`
never runs for a shell: the host's rule answers whatever fits the pattern,
`/posts/abc` as much as `/posts/3`. Check it in the browser with the schema
the page exports, and say `notFound()` for anything that is not a post.

A link to an unbuilt value navigates in place: its payload URL is answered
with the shell's payload, and the shell renders for the new URL. From one
unbuilt value to another, the same shell renders again, and the components
inside it read the new URL.

### `notFound()` in a shell

The host has already answered with the shell, under `200`, and a file cannot
be asked for its 404. So a shell carries its not-found with it: the nearest
`not-found.tsx`, rendered at build time into the shell's payload, in the
shell's layouts and locale. A client component below the `fallback.tsx` that
says `notFound()` while it renders puts that tree in the shell's place — the
URL and the history stay as they are, and so does the `200`. Only while it
renders: thrown from an effect or an event handler, `notFound()` reaches no
boundary.

Rendered once for every value the shell answers, that not-found is the
nearest one that takes none of the parameters the shell leaves to the
browser: a `not-found.tsx` beside the `fallback.tsx` would receive
`!fallback` as the value, so it is passed over for the next one up. It
receives the shell's pathname, `/ja/posts/!fallback`, as the layouts do, so
what it shows of the visitor's URL comes from a client component.

On the server's side of the shell — the `fallback.tsx` itself, or a layout
above it — there is no value to disown, and `notFound()` stops the build:

```
the shell for /posts/:id called notFound() while it rendered, and a shell has no value to disown — call notFound() from the client component that reads the value in the browser
```

### Where a shell stands

A shell stands at a **location**: a pathname whose remaining `:name`
segments are left to the browser. Which parameters a location fills is
decided by the `paths.ts` files above the `fallback.tsx`: a parameter whose
directory has one is filled, once per value, and a parameter without one is
left open. With no parameter above, the location is the pattern itself —
`/posts/:id`, one shell for every id. With one above that lists its values,
there is a shell per value:

```
src/routes/[locale]/
  paths.ts            ja, en
  layout.tsx
  posts/[id]/
    page.tsx
    fallback.tsx      shells at /ja/posts/:id and /en/posts/:id
```

Each location is its own shell, rendered for its own URL — the location
with `!fallback` for each parameter left open, `/ja/posts/!fallback`, a
segment no route directory can be named — and written there. The filled
values are the upper values the site has: no shell stands at
`/:locale/posts/:id`, which would answer `/fr/posts/1` too. A `paths.ts` in
`posts/[id]/` as well changes no location: the ids it returns are written as
pages under each locale, and the same two shells answer the rest.

**A parameter a layout above receives has to be filled.** A layout above
the `fallback.tsx` is written into the shell once, as HTML, for every value
the shell answers, so each parameter it receives is one the shell has to
know. With `src/routes/[locale]/layout.tsx`, that layout receives `locale`,
so `/:locale/posts/:id` cannot be a location — `/ja/posts/:id` and
`/en/posts/:id` can — and without a `[locale]/paths.ts` the build says so:

```
these shells leave out a parameter a layout above their fallback.tsx receives, so its directory needs a paths.ts: /:locale/posts/:id (:locale, received by [locale]/layout.tsx)
```

The parameters a shell may leave are the ones no layout above the
`fallback.tsx` receives, which is also why a `layout.tsx` cannot sit beside
it ([What the build refuses](routing.md#what-the-build-refuses)).

**A shell runs only the layouts' schemas.** There is no value for the
page's `paramsSchema` to parse, so it never runs for a shell; the schemas of
the layouts above do, over the parameters the location fills. A schema whose
work has to reach the shell belongs on a layout — `@k8ordo/i18n`'s, which
sets the locale the shell's messages are rendered in, on
`[locale]/layout.tsx` (`export const { paramsSchema } = locales;`). A layout
schema that refuses a value a `paths.ts` above the shell returned stops the
build:

```
the shells stand where a params schema refuses the values above them: /xx/posts/:id
```

**Layouts render with the shell's pathname.** A layout above a shell
receives the parameters its location fills, as strings, and as `pathname`
the shell's own — `/ja/posts/!fallback`, whichever post the visitor asked
for. What a layout writes from it — a canonical URL, `og:url`, `hreflang`
links, breadcrumbs — is the same for every value the shell answers, so the
build warns when a shell's HTML, its scripts aside, holds `!fallback`:

```
k8ordo: the shell for /ja/posts/:id has "!fallback" in its HTML — a layout wrote the shell's pathname into the page (a link, a canonical URL); derive what depends on the URL in a client component
```

Render what depends on the value below the layouts: in the page, for the
values the build wrote, and in the client component inside `fallback.tsx`,
which reads the visitor's URL. React hoists a `<title>`, `<meta>` or
`<link>` from either. A parameter no layout receives can still be one a
layout derives something from: a root layout that takes `<html lang>` from
the first segment of `pathname` reads `!fallback` there at the bare
`/:locale/posts/:id`, and every value gets its default language. Give that
parameter's directory a `paths.ts`, and the shells stand below its values.

### Routes below a fallback's parameter

A `fallback.tsx` answers its own page's pattern and nothing below it.
`posts/[id]/comments/page.tsx` is `/posts/:id/comments`, a pattern of its
own: it is written for the ids `posts/[id]/paths.ts` returns, and for no
other — unless it keeps a `fallback.tsx` of its own, whose shell stands at
`/posts/:id/comments`. With no `paths.ts` in `posts/[id]/` and no
`fallback.tsx` of its own, it stops the build, as any open route does. A
`redirect.ts` or `route.ts` below the parameter cannot have a
`fallback.tsx`, so it answers only the values returned.

### What it costs

- **What an unbuilt value shows cannot be a Server Component.** It is
  drawn in the browser, from data the browser fetches; the build renders
  only what is the same for every value — the layouts and the
  `fallback.tsx`.
- **Its HTML is the shell's.** No per-value `<title>`, no Open Graph tags:
  a crawler that runs no JavaScript and a link preview both read the
  placeholder. A value that matters to them is one a `paths.ts` returns,
  and a rebuild is what writes it.
- **An unknown value answers `200`.** The host rewrites by shape, so
  `/posts/999` gets the shell too, and the not-found it shows in place is a
  soft 404 to a crawler. Give `not-found.tsx` a
  `<meta name="robots" content="noindex">`.
- **The data has to be reachable from the browser**: an API the visitor's
  browser may call — CORS allowing the site's origin — and, when `csp` sets
  a policy, the API's origin in its `connect-src`
  ([Content Security Policy](csp.md#static-mode-hashes-in-a-meta)).
- **It needs a host that rewrites.** On a host without rewrites — GitHub
  Pages — an unbuilt value gets the host's `404.html`, shell or not.

### What else stops the build

Every refusal of what the `paths.ts` files returned is said before anything
is rendered, with the others above.

A shell's rule catches every URL of its location's shape that no file
answers, so a location must not catch URLs that a pattern declared before
it answers — the table would give them to that pattern, the host to the
shell. Either it shares a parameter's position with that pattern, and
catches infinitely many of them, or the two overlap in one URL the build
did not write:

```
the shell for /:lang/:id ([lang]/[id]/fallback.tsx) would also answer URLs /docs/:section (docs/[section]/page.tsx) is declared first for — give docs/[section]/page.tsx a fallback.tsx too, or put the shell where it cannot match, with a paths.ts above it
the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) would also answer /ja/posts/new, which [locale]/posts/new/page.tsx is declared first for and the build did not write — return its value from that parameter's paths.ts, or put the shell where it cannot match, with a paths.ts above it
```

A URL the build did write is not one of them — its file answers before any
rule — so `[locale]/posts/first/redirect.ts` beside
`[locale]/posts/[id]/fallback.tsx` builds.

The build then renders each shell at its own URL, and the table walks in
its own order, so another route can answer that URL instead — a page that
takes `!fallback` as a value, or the shell of another `fallback.tsx` the
table tries first. Neither is written, and a shell that throws while it
renders is named by its location, as a page is:

```
the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) was answered by another route, which took "!fallback" as a value
the shell for /en/posts/:id ([locale]/posts/[id]/fallback.tsx) was answered by en/[section]/[slug]/fallback.tsx, which the table tries first — put the shell where that pattern cannot match, with a paths.ts above it
static build could not render /ja/posts/:id — see the error above
```

The grammar's refusals — a `fallback.tsx` with no `page.tsx` beside it, or
beside a `layout.tsx`, or with nothing to leave to the browser, and a
`paths.ts` outside a `[param]` directory — are in
[What the build refuses](routing.md#what-the-build-refuses).

### Under `vite dev`, and under server mode

`vite dev` answers a value as the build's host will, so what works locally
is what is deployed. A value a `paths.ts` returns is rendered by its
`page.tsx`. A value none returns is answered with the shell where a
`fallback.tsx` stands beside the page, and otherwise with the not-found: a
document is rendered as `not-found.tsx` under a 404, and a payload request
gets a plain 404, so the browser loads the document; an application with no
`not-found.tsx` gets a bare 404. It says which, once per pattern or
`fallback.tsx`:

```
k8ordo: no paths.ts returns /posts/3, so vite dev answers it with the not-found, as the build's host will — return its value from the paths.ts of /posts/:id to render it
k8ordo: no paths.ts returns /posts/3, so vite dev answers it with posts/[id]/fallback.tsx's shell, as the build's host will
```

It asks the `paths.ts` files once and keeps the answer until a file under
`routes/` changes, and asks again when a request names a value it does not
hold — so a value the data has gained since is rendered without a restart.
A URL no pattern with a parameter could match never waits for them. What
the build would refuse is logged as a warning,
`k8ordo: the build will refuse this: …`, and a `paths.ts` that throws
leaves every value to its page:
`k8ordo: a paths.ts failed, so vite dev renders every value with page.tsx: …`.

Under `mode: 'server'` every value is rendered by its page, per request, and
neither a `fallback.tsx` nor a `paths.ts` is read — nothing of them is built
in — so switching modes needs no change to the files. The grammar's rules
for them hold in both modes.
