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
    404.html              not-found.tsx, rendered
    sitemap.xml           every page above, when `site` is set
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
host answers it — with `404.html` and a real 404. That is also what happens
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

`serve` hands out the client build's files as they are and passes everything
else to the request handler: HTML for a page, its RSC payload for a client
navigation, and `not-found.tsx` under a genuine 404. Only a `GET` or `HEAD`
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

Server mode only: beside `framework({ mode: 'static' })`, `vercel()` stops
the build when the config loads. A static build is `dist/client/`, which
Vercel serves as files without an adapter.

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
`vercel build` and `vercel deploy --prebuilt` deploy as it is. The client
build becomes static files on Vercel's CDN — a file under `assets/` is sent
`immutable` once a file has answered, so a missing one is never cached — and
every request that names no file goes to one Node.js function, the request
handler, handed to Vercel as `fetch` and streaming its answer. Under a
`base` the static files sit below it, as `serve` hands them out, and the
handler answers every URL outside it with a `404`. The copies compressed for
`serve` are left out: Vercel compresses on its own, and each is one more file
to upload.

**The function carries everything it imports.** A Vercel function holds
nothing but its own directory, which is all the handler needs: server mode
bundles every dependency into it. A dependency left out with
`resolve.external` is not in the function, so it does not work there. Each
build replaces `.vercel/output/` and nothing else: the project link
`vercel pull` writes beside it stays.

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
each page at its URL, base included. Under `mode: 'server'`, `serve` reads
the base the build was made for from `dist/rsc/index.js` and hands out the
client build's files below it; a host calling the handler itself passes the
URL as the visitor asked for it, base included.

The base has to be a path from the root. A relative base (`./`) or another
origin says nothing about which URL is which page, and the build refuses it:

```
k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got './'
```
