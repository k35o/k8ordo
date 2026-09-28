# The output and deploying

What `vite build` writes, and what a host has to know to serve it.

## The output

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
```

Serve `dist/client/` with anything. A page arrives as HTML with the payload
it was rendered from written into it, so hydration reads what the build
rendered rather than asking for the page again. From there, a link to another
page fetches that page's `index.rsc` instead of reloading the document —
navigation stays client-side even though the site is a pile of files. The
payload lives at a path rather than behind a header or a query because static
hosting varies on neither.

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
something, even though nothing is running to route the request. Only one can
be represented, wherever it sits — under a locale segment is fine — because a
host has one blanket 404; a table declaring two fails the build rather than
silently picking one:

```
a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /:locale/*, /*
```

That one file is rendered for a pathname the site does not have, which is what
any 404 is. Its `pathname` is such a URL, and where a parameter sits above
`not-found.tsx`, that parameter is filled with a segment no route declared —
so `params.<name>` there is not a value the application named. Treat it as you
must treat any parameter under a running server, where `/:locale/*` matches
`/fr/anything` too: validate it, and read what the visitor actually typed from
`usePathname()` in a client component. The browser does not hydrate this file:
it was rendered for another URL, so anything a component reads from the URL
while it renders (`@k8ordo/i18n`'s messages read the locale segment) would
disagree with it. The browser renders it afresh instead, where the visitor is,
and a client component sees their URL from its first render. A visitor
without JavaScript keeps whatever the build's render produced.

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

<!-- shared:csp -->

## Content Security Policy

The framework decides no policy. It signs the inline scripts it writes
itself — the payload it puts into the HTML for hydration, and React's own —
and the policy that names them is the application's to write. An inline
script of the application's own, `@k8ordo/color-scheme`'s among them, is the
application's to allow the same way.

<!-- /shared:csp -->

A file cannot carry a nonce — everyone reads the same one — so the build
names what the framework signed by hash, and leaves no nonce in what it
writes. Give the plugin the policy as `csp`, directives and their sources,
and each page gets it in a `<meta http-equiv="Content-Security-Policy">`
first in its `<head>`, with the hashes of that page's framework scripts added
wherever a script element is decided — `script-src` (made from `default-src`
when only that was given) and `script-src-elem` when given:

```ts
// vite.config.ts
import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});
```

An inline script of the application's is allowed by its hash in that policy,
as `colorSchemeScriptHash()` gives `@k8ordo/color-scheme`'s (pass it the
`defaultPreference` the provider is given); any other inline script on the
page — one that reached it from content — is refused. The framework's module
script is allowed by where it comes from (`'self'`), since nothing in a file
can sign it, which is why the build refuses a policy with `'strict-dynamic'`.
It refuses `frame-ancestors`, `report-uri` and `sandbox` too, which a
`<meta>` ignores: set those as headers at the host. Without `csp`, no policy
is written.
