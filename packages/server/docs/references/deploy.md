# Running and deploying

What `vite build` writes, and the hosts that run it.

## Running the build

```bash
vite build
```

```js
// serve.js
import { serve } from '@k8ordo/server/serve';

const server = await serve({ port: 3000 });
// server.url, server.port; await server.close() to stop
```

`serve` takes three options: `dist`, the build output holding `client/` and
`rsc/` (default `dist`, resolved against the working directory); `port`
(default `3000`); and `host` (default `localhost`, which only the same machine
can reach — inside a container, pass `host: '0.0.0.0'`).

`serve` hands out the client build's files as they are and passes everything
else to the request handler: HTML for a page, its RSC payload for a client
navigation, and `not-found.tsx` under a genuine 404. Only a `GET` or `HEAD`
is answered from a file; any other method reaches the handler, even at a path
that names a file. A file is sent with the type registered for its extension
— with `charset=utf-8` on text — or as `application/octet-stream` when none
is registered. A file under `assets/` has its content hash in its name and is
sent `immutable`; any other file is sent `no-cache`. A `HEAD` gets the
headers a `GET` would and no body, whether a file or the handler answers it.
It returns where it listens and a way to stop — `port: 0` asks the system
for a free port, which is what a test wants. A request pathname may only ever
name a file inside the build output, whatever it is spelled like — traversal
is not a case weighed per request but an outcome the path resolution cannot
produce.

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

`serve` is one host for the build. What it hosts — the application itself —
is the request handler, and anything that turns a request into a `Request`
and a `Response` back into an answer can host it:

```js
import handler from './dist/rsc/index.js';

const response = await handler(new Request('https://example.com/products/1'));
```

`dist/rsc/index.js` default-exports `(request: Request) => Promise<Response>`,
the same handler `@k8ordo/static` builds and calls at build time, compiled
for that mode. It loads `dist/ssr/` from beside itself, so the two travel
together, and it imports the application's dependencies by name, so they
have to resolve where it runs — or be bundled in, as Wrangler does.

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
that needs Node either — which is why `redirect()` and the types come from
`@k8ordo/server/runtime`, and `serve` from an entry of its own. A route file
or a Server Action that reads `node:fs` ties the application to a runtime
that has it.

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

The handler answers `GET`, `HEAD` and `POST`, and any other method with a `405` whose
`Allow` header names those three, so a host needs no method filter of its
own. A `HEAD` gets the status and headers a `GET` would, with a `null` body:
the page's own component runs, since it may say `notFound()`, and nothing it
renders is sent.

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

```ts
// vite.config.ts
import { framework } from '@k8ordo/server';
import { vercel } from '@k8ordo/server/vercel';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework(), vercel()] });
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
nothing but its own directory, so under `vercel()` the handler is built with
every dependency bundled in. A dependency that ships a native binary, or that
reads its own files by path, cannot be bundled that way and does not work
there. Each build replaces `.vercel/output/` and nothing else: the project link
`vercel pull` writes beside it stays.

<!-- shared:deploys -->

## A tab opened before a deploy

A tab keeps running the script it loaded, while every payload it fetches
comes from whatever is deployed now — and a new deploy may render a client
component that script has never heard of. So every payload names the client
it was rendered for, the URL of the script its page's HTML loads, and one
that names another script is never rendered: the navigation becomes a
document load of the same URL, and the visitor gets the new page with the
script that can render it instead of `error.tsx`. Under `@k8ordo/server` a
Server Action's answer is held to the same rule: the page is loaded again
rather than the answer applied.

The bundler hashes into that URL everything the script can load, so a deploy
that changed nothing the browser runs leaves every open tab navigating in
place, and servers built apart from the same source agree.

<!-- /shared:deploys -->

<!-- shared:base -->

## Served under a base

An application served below the root of its origin — `https://example.com/docs/`
— says so with Vite's `base`, and nothing else in it changes:

```ts
// vite.config.ts
export default defineConfig({
  base: '/docs/',
  plugins: [framework()],
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
- Under `@k8ordo/server`, a redirect the application builds itself is sent
  as written: `redirect()` from a Server Action, and the `location` of a
  `Response` a `guard.ts` returns. Both are URLs, so build them with
  `href()` — `redirect(href('/talks'))`, `location: href('/login')` — or
  give a pathname built some other way its base with `withBase()` from
  `@k8ordo/router`.
- A URL outside the base is none of the application's: the handler answers
  it with a `404`, and the client runtime leaves it to the browser.

Under `@k8ordo/static` the pages are written into `dist/client/` at their
pathnames in the table, so the host serves that directory at `/docs/`; the
`paths` option takes pathnames without the base, and `sitemap.xml` lists
each page at its URL, base included. Under `@k8ordo/server`, `serve` reads
the base the build was made for from `dist/rsc/index.js` and hands out the
client build's files below it; a host calling the handler itself passes the
URL as the visitor asked for it, base included.

The base has to be a path from the root. A relative base (`./`) or another
origin says nothing about which URL is which page, and the build refuses it:

```
k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got './'
```

<!-- /shared:base -->
