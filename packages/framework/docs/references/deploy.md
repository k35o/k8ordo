# Running and deploying

What `vite build` writes, and what a host has to know to serve it. Under
`mode: 'static'` that is a directory of files; under `mode: 'server'` it is
a server that runs on its own, `node dist/server.js`, around a request
handler another host can run instead.

## The output

Static mode only.

```
dist/
  client/
    index.html            /
    index.rsc             the same page as a payload
    products/
      index.html          /products
      index.rsc
      1/index.html        /products/1
      1/index.rsc
      !fallback/          the shell of [id]/fallback.tsx, for every other id
        index.html
        index.rsc
    404.html              not-found.tsx, rendered
    sitemap.xml           every page above, when `site` is set
    _redirects            how a host reaches the shells, when there are any
    assets/…              the client bundle
  rsc/  ssr/              the machinery that produced the above
  package.json            { "type": "module" }
```

Serve `dist/client/` with anything. The rest of `dist/` rendered it, and
`dist/package.json` is what lets the build load that machinery as ES
modules whatever the application's own `package.json` says about `type`.
A page arrives as HTML with the payload it was rendered from written into
it, so hydration reads what the build rendered rather than asking for the
page again. From there, a link to another page fetches that page's
`index.rsc` instead of reloading the document — navigation stays
client-side even though the site is a pile of files. The payload lives at
a path rather than behind a header or a query because static hosting
varies on neither.

A URL the site does not have is nobody's to render in the browser: the answer
is not a payload, so the navigation becomes an ordinary document load and the
host answers it — with `404.html` and a real 404. A value a `fallback.tsx`
stands for is the exception: the host's rewrite answers it with the shell
([Rewrites to a shell](#rewrites-to-a-shell)). That is also what happens
for the files sitting beside the site, so a link to `/robots.txt` fetches the
file rather than disappearing into the router. Mark a link the host answers
with a download as `<a href="/report.csv" download>`: the navigate event then
already says it is a download, and the router leaves it to the browser, where
`Content-Disposition` only arrives with the answer, by which time the URL has
been committed.

`not-found.tsx` becomes `404.html`, the file most static hosts serve for an
unknown URL. Declaring a not-found page in this mode therefore means
something, even though nothing is running to route the request. Whether the
host serves it with a 404 rather than a 200 is the host's setting: the build
can write the page, but not the response. Only one can be represented,
wherever it sits — under a locale segment is fine — because a host has one
blanket 404; a table declaring two fails the build rather than silently
picking one:

```
a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /:locale/*, /*
```

That one file is rendered for a pathname the site does not have, which is what
any 404 is. Its `pathname` is such a URL, and where a parameter sits above
`not-found.tsx`, that parameter is filled with a segment no route declared —
so `params.<name>` there is not a value the application named. Treat it as you
must treat any parameter under `mode: 'server'`, where `/:locale/*` matches
`/fr/anything` too: validate it, and read what the visitor actually typed from
`usePathname()` in a client component. The browser does not hydrate this file:
it was rendered for another URL, so anything a component reads from the URL
while it renders (`@k8ordo/i18n`'s messages read the locale segment) would
disagree with it. The browser renders it afresh instead, where the visitor is,
and a client component sees their URL from its first render. A visitor
without JavaScript keeps whatever the build's render produced.

## Rewrites to a shell

Static mode only. A shell
([Values the build did not write](params.md#values-the-build-did-not-write))
is written at its own URL — `posts/!fallback/` — and reached through a
rewrite: the host answers a URL no file answers with the shell's file,
under `200`, the URL left as the visitor asked for it. Whenever it writes a
shell, the build writes the rules into `dist/client/_redirects`, in the
format Netlify and Cloudflare both read. For
`[locale]/posts/[id]/fallback.tsx`, with `paths` supplying `/en/posts/:id`
and `/ja/posts/:id`, the ids `1` and `2`, and a
`[locale]/posts/first/redirect.ts` beside them:

```
# @k8ordo/framework: built URLs the rules below would also catch
/en/posts/1 /en/posts/1 200
/en/posts/1/index.rsc /en/posts/1/index.rsc 200
/en/posts/2 /en/posts/2 200
/en/posts/2/index.rsc /en/posts/2/index.rsc 200
/en/posts/first /en/posts/first 200
/en/posts/first/index.rsc /en/posts/!fallback/ 200
/ja/posts/1 /ja/posts/1 200
/ja/posts/1/index.rsc /ja/posts/1/index.rsc 200
/ja/posts/2 /ja/posts/2 200
/ja/posts/2/index.rsc /ja/posts/2/index.rsc 200
/ja/posts/first /ja/posts/first 200
/ja/posts/first/index.rsc /ja/posts/!fallback/ 200
# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell
/en/posts/:p1 /en/posts/!fallback/ 200
/ja/posts/:p1 /ja/posts/!fallback/ 200
/en/posts/:p1/index.rsc /en/posts/!fallback/index.rsc 200
/ja/posts/:p1/index.rsc /ja/posts/!fallback/index.rsc 200
```

The last block is the shells': for each location, a rule for its page and
one for its payload. A client navigation to `/en/posts/3` fetches
`/en/posts/3/index.rsc`, gets the shell's payload and stays in place;
without the payload rule it becomes a document load, which the page rule
answers. Placeholders are named by position, `:p1`, `:p2`, …, because
Cloudflare reads a `:` as one only before a letter. Every page rule comes
before every payload rule, which matters only past Cloudflare's limits
(below).

The first block lists the built URLs those rules would also catch, each
answered by itself, for a host that applies rules before files and would
otherwise answer `/en/posts/1` with the shell. A built `redirect.ts` or
`route.ts` has no payload, so its payload URL is answered with the shell's
HTML instead: a client navigation to `/en/posts/first` then gets HTML,
loads the document, and the redirect answers it — where the shell's payload
would have rendered in its place. A built value whose URL holds a `:`
before a letter, or a `*`, cannot be listed, since both hosts read it as a
placeholder or a splat:

```
k8ordo: _redirects cannot list /en/posts/a:b — Cloudflare and Netlify read ":b" as a placeholder, so on Cloudflare a shell answers it
```

Between the two blocks go the application's own rules, its
`public/_redirects` as written: its specific rules then win over the
shells', and on Cloudflare its static rules stay static. One with a
placeholder or a splat that catches a shell's URL hides that shell, and the
build names it:

```
k8ordo: public/_redirects line "/* /index.html 200" matches /en/posts/:id before its shell's rule, so that shell is never served
```

A rule catches every URL of its shape that no file answers. A bare shell of
two segments both left open, `/:a/:b`, therefore also answers a missing
`/assets/x.js` — with HTML, where the host would have sent a 404.

### Netlify

Netlify reads `_redirects` from the root of what it publishes and tries
files before rules. Nothing else is needed.

### Cloudflare Workers static assets

Rules come before files there, which is what the first block is for, and
the assets' settings decide whether the rules work:

```jsonc
// wrangler.jsonc
{
  "assets": {
    "directory": "dist/client",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page",
  },
}
```

- `html_handling` has to be `auto-trailing-slash`, the default, or
  `force-trailing-slash`. The shell rules rewrite to `…/!fallback/`, a
  directory's own URL under those two. Under `drop-trailing-slash` that URL
  is redirected to `…/!fallback`, which the same rule catches again, and
  under `none` it is a 404.
- `404.html` is served only under `not_found_handling: "404-page"`.
- A Worker that runs before the assets bypasses `_redirects`, and the
  shells with it.

A built page still redirects to its slash form, `/en/posts/1` to
`/en/posts/1/`, as it does without `_redirects`. An unbuilt value is matched
as written: `/en/posts/3/` matches no rule and is a 404 there, where
Netlify, Vercel, `serve` and `vite preview` answer it with the shell.

**Cloudflare reads at most 2,000 static rules and 100 dynamic ones**,
counted in file order: a rule is static while it has no placeholder and no
rule before it had one, and every rule after the first dynamic one counts
as dynamic, the application's own included. Past the static limit a rule
is skipped, so a built page past it is answered by its shell; past the
dynamic limit the rest of the file is ignored. Each built value a shell
rule would catch costs two static rules, its page's and its payload's, so
beside its shells a site keeps about 1,000 such pages on Cloudflare. The
build counts the file Cloudflare's way and warns past either limit:

```
k8ordo: _redirects has 2412 rules Cloudflare counts as static; it reads 2,000 and skips the rest, so a built page past them is answered by its shell there
k8ordo: _redirects has 130 rules Cloudflare counts as dynamic; it reads 100 and ignores the rest of the file — the shell payload rules go first (navigations to those values become document loads), then document rules (those values 404)
```

### Cloudflare Pages

Pages reads the same file, with the same parser and limits. Its handler is
the older one: it re-encodes no target, and handles a trailing slash the
way `auto-trailing-slash` does, with nothing to set.

### Vercel

Vercel never reads `_redirects`; `vercel()` writes the same rewrites as
routes ([Deploying to Vercel](#deploying-to-vercel)). A build that runs on
Vercel and writes shells without it says so:

```
k8ordo: this build runs on Vercel, which does not read _redirects — add vercel() from @k8ordo/framework/vercel, or the shells are never served
```

### Other hosts

For each shell location `L` with shell pathname `S` — `/en/posts/:id` and
`/en/posts/!fallback` — two rewrites, status `200` and the URL unchanged,
each applied only when no file answers the request:

1. `<base>L` → `<base>S/index.html`, or `<base>S/` where the host serves a
   directory's index;
2. `<base>L/index.rsc` → `<base>S/index.rsc`, for client navigations.
   Without it a navigation to an unbuilt value becomes a document load, and
   still arrives.

A `:name` matches exactly one segment. A built `redirect.ts` or `route.ts`
whose payload URL rule 2 would catch has no payload file, so that URL needs
a rule of its own ahead of rule 2, answering with an HTML file — the
shell's. A host that applies rules before files also needs, listed first, a
rule answering each built file those rules would match with itself: the
first block of `_redirects`.

A host without rewrites — GitHub Pages — cannot serve a shell: an unbuilt
value gets its `404.html`.

## Serving a static build

Static mode only. `vite preview` serves the build as a static host does,
reading `_redirects` the way Netlify reads it: the file a URL names, a
directory's `index.html`, the target of the first `200` rule in
`dist/client/_redirects` that matches, when that is a file, then `404.html`
under a `404`. It answers a `GET` or a `HEAD`, and any other method with a
`405`. The request handler is never called: a page is the file the build
wrote, with its Content-Security-Policy `<meta>`, so what preview shows is
what a host serves.

A static build writes no `dist/server.js`, but `serve` from
`@k8ordo/framework/serve` serves it the same way
([Running the build](#running-the-build) has its options). It reads the
build's mode from `dist/rsc/index.js`, and the build's `_redirects` only for
a static one: Vite copies `public/_redirects` into a server build too, and
its rules are not that server's to apply. Each file is sent as any file
`serve` sends, and whether it is `immutable` is decided by the file sent
rather than the URL, so a shell a rule answers at `/assets/x.js` is not
cached for a year. A URL outside the base gets a plain `404`.

## Running the build

Server mode only.

```bash
vite build
node dist/server.js
```

```
dist/
  server.js               node dist/server.js
  package.json            { "type": "module" }
  rsc/index.js            the request handler
  ssr/                    what the handler renders HTML with
  client/                 the browser's files, with .br and .gz copies
```

**`dist/` runs on its own.** The build bundles into `dist/` every
dependency the server imports — `serve` and its own into `server.js`, the
application's into the handler — and leaves out only Node's built-in
modules, so a host needs `dist/` and Node.js and nothing else: no
`npm install`, no `node_modules`, not even the application's
`package.json`. Copy `dist/` to the server and run `node dist/server.js`
from anywhere. `dist/package.json`, written in either mode, is what makes
Node read the `.js` files inside as ES modules wherever `dist/` lands,
whatever the application's own `package.json` says about `type`. With
nothing read at run time, `@k8ordo/framework`, `@k8ordo/router` and the
rest of the build's inputs can all be dev dependencies.

`server.js` listens where two environment variables say: `PORT` (default
`3000`) and `HOST` (default `localhost`, which only the same machine can
reach — inside a container, `HOST=0.0.0.0`). Node listens on one of the
addresses `localhost` names, often only `::1`, so a proxy on the same
machine reaches the default at `localhost`, not `127.0.0.1`; give it
`HOST=127.0.0.1` to be reached there.

```bash
PORT=8080 HOST=0.0.0.0 node dist/server.js
```

On `SIGTERM` or `SIGINT`, `server.js` stops taking connections, finishes the
answers already under way, and exits with `0`. Run as a container's first
process, where Node ignores a signal nothing handles, it still stops when
the container is told to, rather than when the grace period runs out.

**A dependency that cannot be bundled stays installed.** One that ships a
native binary, or reads its own files by path, does not survive bundling.
Name it in the `rsc` environment's `resolve.external`, which wins over the
bundling, keep it in `dependencies`, and run `dist/` inside the
application's directory after an install without dev dependencies
(`npm install --omit=dev`), where Node finds it:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [framework({ mode: 'server' })],
  environments: { rsc: { resolve: { external: ['better-sqlite3'] } } },
});
```

`server.js` is `serve` from `@k8ordo/framework/serve`, handed the build it
sits in. A server of your own — one that does more than serve the build —
imports it directly, and then `@k8ordo/framework` is a runtime dependency,
installed where the server runs:

```js
// serve.js
import { serve } from '@k8ordo/framework/serve';

const server = await serve({ port: 3000 });
// server.url, server.port; await server.close() to stop
```

`serve` takes three options (`ServeOptions`): `dist`, the build output
holding `client/` and `rsc/` (default `dist`, resolved against the working
directory); `port` (default `3000`); and `host` (default `localhost` —
inside a container, `'0.0.0.0'`). Stopping it on a signal is up to the
server that calls it: `await server.close()`.

For a server build, `serve` hands out the client build's files as they are
and passes everything else to the request handler: HTML for a page, its RSC
payload for a client navigation, and `not-found.tsx` under a genuine 404. A
static build it serves as a static host does, and never calls the handler
([Serving a static build](#serving-a-static-build)). Only a `GET` or `HEAD`
is answered from a file; any other method reaches the handler, even at a path
that names a file. A file is sent with the type registered for its extension
— with `charset=utf-8` on text — or as `application/octet-stream` when none
is registered. A file under `assets/` has its content hash in its name and is
sent `immutable`; any other file is sent `no-cache`. A `HEAD` gets the
headers a `GET` would and no body, whether a file or the handler answers it.
It returns where it listens and a way to stop (`Server`) — `port: 0` asks the
system for a free port, which is what a test wants. A request pathname may
only ever name a file inside the build output, whatever it is spelled like —
traversal is not a case weighed per request but an outcome the path
resolution cannot produce.

**Nothing is compressed twice, or sent twice.** `vite build` writes a Brotli
and a gzip copy beside every file of the client build whose type compresses
(`app-1a2b.js.br`, `app-1a2b.js.gz`, each kept only when it came out
smaller), and `serve` sends the one the request's `Accept-Encoding` prefers —
`br` when both are equally welcome — with `Vary: Accept-Encoding`. Every file
carries an `ETag` taken from its contents, not its modification time, so a
revalidation against a deploy that did not change the file, or against another
server built from the same source, ends in a `304`; the contents are read for
it once per file. A `Range` asking for one span of a file is answered with
`206` — what Safari needs before it will play a `<video>` — a range past the
end with `416`, and anything else (several spans, a `Range` that cannot be
read, an `If-Range` naming another version) with the whole file.

A page and its payload are compressed as they stream, under the same
negotiation: every part React writes is flushed as it is written, so the
shell reaches the browser before the slowest boundary has finished rendering.
An answer in a type that is compressed already (an image), one the handler
encoded itself, or one marked `Cache-Control: no-transform` is sent as it is.

When the handler throws, `serve` answers `500` with the body `internal
error` and logs what was thrown (`k8ordo: GET /products/1 failed`): the
details are for whoever runs the server, not for the visitor. A body that
fails after it has started streaming can no longer change its status, so the
connection is cut rather than left open on half a page.

## The request handler

Server mode only. `dist/server.js` is one host for the build. What it
hosts — the application itself — is the request handler, and anything that
turns a request into a `Request` and a `Response` back into an answer can
host it:

```js
import handler from './dist/rsc/index.js';

const response = await handler(new Request('https://example.com/products/1'));
```

`dist/rsc/index.js` default-exports `(request: Request) => Promise<Response>`,
the same handler a static build calls for each route at build time. It loads
`dist/ssr/` from beside itself, so the two travel together, and has every
dependency bundled in, so nothing has to be installed where it runs.

**It runs wherever `AsyncLocalStorage` does.** Past the web platform's
`Request`, `Response` and streams, the one thing the handler takes from its
runtime is `AsyncLocalStorage` from `node:async_hooks`: React keeps each
render's state in it, and a `paramsSchema` writes to it. Node.js, Bun, Deno,
and Cloudflare Workers with the `nodejs_compat` flag all have it, and each
takes the handler as it is once it is imported:

```js
// Deno
Deno.serve(handler);

// Bun
Bun.serve({ fetch: handler });

// Cloudflare Workers — worker.js
export default { fetch: handler };
```

What the handler runs keeps that promise only as long as it imports nothing
that needs Node either — which is why `redirect()` and the request API come
from `@k8ordo/framework/server`, and `serve` from an entry of its own. A
route file or a Server Action that reads `node:fs` ties the application to a
runtime that has it.

**The handler serves no files.** Put `dist/client/` in front of it — the
files under `assets/` with `Cache-Control: public, max-age=31536000,
immutable`, since their names carry their contents' hash — and hand it every
request that names none. On Workers that is static assets pointed at the
client build, which answer before the Worker runs:

```jsonc
// wrangler.jsonc
{
  "main": "worker.js",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "dist/client" },
}
```

The handler answers `GET`, `HEAD` and `POST`, and any other method with a
`405` whose `Allow` header names those three (a `route.ts` answers the
methods it exports), so a host needs no method filter of its own. A `HEAD`
gets the status and headers a `GET` would, with a `null` body: the page's own
component runs, since it may say `notFound()`, and nothing it renders is
sent.

**Build the `Request` with the URL the visitor asked for.** A `POST` — a
Server Action or not — is accepted only when its `Origin` header is present
and names that URL's host, which is what stops another site's form from
calling your functions with your visitor's cookies; anything else is answered
with a `403`. Behind a proxy that means passing the public host through;
`serve` reads it from the request's own `Host` header, so a proxy in front of
it has to pass the original `Host` on unchanged, and the path alone, as a
browser sends it: a request line that names a host of its own
(`GET http://…`), or a `Host` that is not a host, is answered with a `400`.
A host that builds the URL from a path itself appends the path to the origin
as text instead of resolving it with `new URL(path, origin)`: resolved, the
path of `https://example.com//evil.test/` is a URL on `evil.test`, and a form
on evil.test would pass the check.

## Deploying to Vercel

`vercel()` takes either mode, on either side of `framework()`:

```ts
// vite.config.ts
import { framework } from '@k8ordo/framework/vite';
import { vercel } from '@k8ordo/framework/vercel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'server' }), vercel()],
});
```

With `vercel()` beside `framework()`, `vite build` also writes
`.vercel/output/` in the shape of Vercel's Build Output API (v3), which
`vercel build` and `vercel deploy --prebuilt` deploy as it is. Each build
replaces `.vercel/output/` and nothing else: the project link `vercel pull`
writes beside it stays.

**Under `mode: 'server'`** the client build becomes static files on
Vercel's CDN — a file under `assets/` is sent `immutable` once a file has
answered, so a missing one is never cached — and every request that names
no file goes to one Node.js function, the request handler, handed to Vercel
as `fetch` and streaming its answer. Under a
`base` the static files sit below it, as `serve` hands them out, and the
handler answers every URL outside it with a `404`. The copies compressed for
`serve` are left out: Vercel compresses on its own, and each is one more file
to upload.

**The function carries everything it imports.** A Vercel function holds
nothing but its own directory, which is all the handler needs: server mode
bundles every dependency into it. A dependency left out with
`resolve.external` is not in the function, so it does not work there.

**Under `mode: 'static'`** there is no function. The client build becomes
static files at the base — a file under `assets/` sent `immutable`, and
`_redirects` left out, since Vercel never reads it and would serve it as a
file — and its rewrites become routes Vercel tries only when no file
answered: the payload URL of a built `redirect.ts` or `route.ts`, then each
shell's page (with or without a trailing slash) and its payload, all matched
case-sensitively, as the route table matches; then `404.html` under a `404`,
when the build wrote one. `vercel()` writes them once the last page is
written, whichever side of `framework()` it sits.

## A tab opened before a deploy

A tab keeps running the script it loaded, while every payload it fetches
comes from whatever is deployed now — and a new deploy may render a client
component that script has never heard of. So every payload names the client
it was rendered for, the URL of the script its page's HTML loads, and one
that names another script is never rendered: the navigation becomes a
document load of the same URL, and the visitor gets the new page with the
script that can render it instead of `error.tsx`. Under `mode: 'server'` a
Server Action's answer is held to the same rule: the page is loaded again
rather than the answer applied.

The bundler hashes into that URL everything the script can load, so a deploy
that changed nothing the browser runs leaves every open tab navigating in
place, and servers built apart from the same source agree.

## Served under a base

An application served below the root of its origin — `https://example.com/docs/`
— says so with Vite's `base`, and nothing else in it changes:

```ts
// vite.config.ts
export default defineConfig({
  base: '/docs/',
  plugins: [framework({ mode: 'static' })],
});
```

`routes/` is still written from the application's root:
`routes/products/page.tsx` is `/products` in the table and `/docs/products`
in the address bar. What crosses between the two gains or loses the base on
the way:

- A link built with `href()` or `navigateTo()` carries it. A page receives
  `pathname` without it, and `usePathname()` returns it without it.
- A page's payload sits beside it — `/docs/products/index.rsc` — and the
  client build's files are under `/docs/assets/`.
- A `redirect.ts` target is written from the root, like the table, and is
  sent with the base in front; one that names another origin is sent as
  written.
- Under `mode: 'server'`, a redirect the application builds itself is sent
  as written: `redirect()` from a Server Action, and the `location` of a
  `Response` a `guard.ts` returns. Both are URLs, so build them with
  `href()` — `redirect(href('/talks'))`, `location: href('/login')` — or
  give a pathname built some other way its base with `withBase()`.
- A URL outside the base is none of the application's: the handler answers
  it with a `404`, and the client runtime leaves it to the browser.

Under `mode: 'static'` the pages are written into `dist/client/` at their
pathnames in the table, so the host serves that directory at `/docs/`; the
`paths` option takes pathnames without the base, and `sitemap.xml` lists
each page at its URL, base included. `_redirects` is written at the root of
`dist/client/` too, with the base in every line
(`/docs/posts/:p1 /docs/posts/!fallback/ 200`), but a host reads it only at
the root of what it publishes: move it there. Under `mode: 'server'`, `serve` reads
the base the build was made for from `dist/rsc/index.js` and hands out the
client build's files below it; a host calling the handler itself passes the
URL as the visitor asked for it, base included.

The base has to be a path from the root. A relative base (`./`) or another
origin says nothing about which URL is which page, and the build refuses it:

```
k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got './'
```
