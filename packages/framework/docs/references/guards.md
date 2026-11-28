# Guards, cookies and the request

Server mode only. What decides a request before a page renders, and what a
page may read of it. Under `mode: 'static'` there is no request: the build
refuses a `guard.ts` and any module importing `@k8ordo/framework/server`, and
a page's types have no `request` — one that reads it anyway fails to build
([What static mode refuses](../GUIDE.md#what-static-mode-refuses)).

## Guards

A `guard.ts` decides whether a request gets through, before anything below
its directory answers it. It can sit at any level, and the guards along a URL
run outer first, one at a time:

```ts
// src/routes/admin/guard.ts
import { href } from '@k8ordo/framework';
import { cookies, redirect } from '@k8ordo/framework/server';
import type { Guard } from '@k8ordo/framework/server';

const guard: Guard<'/admin'> = () => {
  if (!cookies().has('session')) redirect(href('/login'));
};

export default guard;
```

It receives `{ request, params }` — the `Request` for the page, and the
params of the pattern its directory puts it under, as the strings the URL
carried (a `[...name]` directory's as an array of them): a guard runs above
every layout, where no schema has typed them.
`Guard<'/admin/:id'>` is its type (`GuardContext<'/admin/:id'>` its
argument's), and the generated table checks each `guard.ts` against its
directory's pattern either way.

**A guard ends the request three ways; returning nothing lets it through.**
`redirect(url)` answers with a `303` to `url`; `notFound()` answers with
the nearest `not-found.tsx` under a 404, as for a URL nothing answers; and
a `Response` it returns — a `401`, a `403` — is the answer as it is. Both
functions throw, so the lines after them never run, and the guards inside it
and the page below never run either. What the guard wrote before it ended
the request — a cookie deleted, a header — goes out on the answer. Returning
nothing hands the request on to the next guard, and the last one to what
answers the URL. A redirect is `redirect()`, never a `Response` with a
`location` of your own: the one way an action ends with one too.

`redirect()` takes a URL, not a pattern in the table's terms like a
`redirect.ts` target, so build it with `href()`, which carries Vite's
`base` when the application is served under one. A pathname built some
other way gets its base from `withBase()`. A `303` is what a form posted
without JavaScript needs — the browser follows it with a `GET`, and a
guard runs before the Server Action a `POST` carries — and for a `GET` it
is the same as a `307`.

Letting a request through can still add to its answer. `responseHeaders()`
is the `Headers` the final response will carry, whatever answers — the page,
its payload, the not-found, or a guard further in that ends the request:

```ts
// src/routes/guard.ts
import { responseHeaders } from '@k8ordo/framework/server';

export default function guard() {
  responseHeaders().set('x-content-type-options', 'nosniff');
}
```

A header the answer already carries is replaced. `responseHeaders()` works
while a guard, a `route.ts` or a Server Action runs and throws anywhere else — a page is a
render, and a render that wrote the response would be a second handler.

There is no `next()` that runs the page and hands its answer back to be
rewritten: a page streams, and its headers are on the wire before its body is
written, so a guard decides before the page starts, never after.

**What a guard covers.** A guard runs before every URL below its directory —
each page, its payload for a client navigation (handed to the guard under
the page's URL, search included, so `new URL(request.url).pathname` is the
page's either way), a `HEAD`, a Server Action posted to it, a `route.ts`, and a `not-found.tsx` below it; the root's also
runs for a URL nothing answers. A `redirect.ts` is answered before any guard
runs: the URL it answers has no page to guard, and the pages below its
directory are guarded as usual. A guard does not protect a Server Action as
such — an action is a function any page can call, posted to whichever URL
calls it — so an action checks what it needs itself.

The guards run after the params schemas have matched the URL, so a guard
under `[locale]` runs in the locale the URL names, and before the Server
Action a `POST` carries.

## Cookies

`cookies()` is the request's cookies, to read and to write, from a
`guard.ts`, a `route.ts` or a Server Action:

```ts
import { cookies } from '@k8ordo/framework/server';

cookies().get('session'); // string | undefined
cookies().set('session', token, { maxAge: 60 * 60 * 24 });
cookies().delete('session');
```

A read sees what the request carried, with what was set or deleted earlier in
the same request — a guard's write is what a Server Action after it reads —
and every write reaches the browser as a `Set-Cookie` on the answer, whatever
the answer is. A cookie written twice at the same path and domain is said
once, the last way. The value is percent-encoded on its way into
`Set-Cookie` and decoded when a request brings it back, so `set` takes any
string as it is — an already encoded one would be encoded twice.

`set` takes `path`, `domain`, `maxAge` (seconds), `expires`, `httpOnly`,
`secure` and `sameSite` (`'strict' | 'lax' | 'none'`, the last only with
`secure`) — `CookieOptions`. The defaults are what a session wants:
`path: '/'`, `httpOnly: true`, `secure: true` and `sameSite: 'lax'` — except
that over plain HTTP to this machine (`localhost`, `127.0.0.1`, `[::1]`)
`secure` defaults to `false`, because Safari drops a `Secure` cookie there
where Chromium and Firefox keep it. Anywhere else served over plain HTTP, say
`secure: false`; `sameSite: 'none'` stays `Secure` everywhere. A name outside
RFC 6265's token characters throws.
`delete` takes the `path` and `domain` the cookie was set with
(`CookieScope`), since those are what a browser keys it by.

A page never writes a cookie: it reads `request.cookies` from its props —
the cookies the request carried, with what the guards and a Server Action
wrote earlier in the same request, so a write is seen by the render that
answers it.

## Work after the answer

`waitUntil(promise)` keeps the host from stopping before `promise` settles,
for work that goes on once the answer has left — a generation read to its
end and saved after the visitor closed the tab, a log line sent to another
service:

```ts
// src/routes/api/chat/route.ts
import { waitUntil } from '@k8ordo/framework/server';

export async function POST({ request }: { request: Request }) {
  const generation = await generate(await request.json());
  const [forVisitor, forStore] = generation.tee();
  // Reading forStore to its end does not depend on the visitor reading theirs.
  waitUntil(save(forStore));
  return new Response(forVisitor);
}
```

It means what a Service Worker's `waitUntil` means. The work has already
started when it is called — `save(forStore)` above runs whether or not it is
handed over — and the framework never calls anything again; handing the
promise over only tells the host the request is not finished yet. Without it
a host is free to stop once the response ends: Vercel freezes the function,
and `node dist/server.js` told to stop exits with the save half done.

It can be called wherever the request is in progress: a `guard.ts`, a
`route.ts`, a Server Action, a layout or a page, and from inside the stream
a `route.ts` answered with. It writes nothing to the response, which is why
a render may call it where `cookies()` may not. Outside a request it throws,
and under `mode: 'static'` it is refused with the rest of
`@k8ordo/framework/server`.

A promise that rejects does not become an unhandled rejection. The handler
logs it once, with the request it belongs to, and goes on:

```
k8ordo: waitUntil() of POST /api/chat failed Error: …
```

What keeps the process alive is the host's own means, so it depends on where
the handler runs — `node dist/server.js` waits before it exits, Vercel needs
`@vercel/functions` installed, and a runtime that calls the handler itself
hands it its own `waitUntil`: [Running the build](deploy.md#running-the-build),
[The request handler](deploy.md#the-request-handler) and
[Deploying to Vercel](deploy.md#deploying-to-vercel). `vite dev` and
`vite preview` have no host to tell and need none: the process stays up.

## Reading the request

A page and a layout receive `request` beside `params` and `pathname`: the
headers as they arrived, and the cookies by name — what the request carried,
with what a guard or a Server Action wrote earlier in the same request —
both read-only.

```tsx
// src/routes/layout.tsx
import type { LayoutProps } from '@k8ordo/framework';

import { Analytics } from '../components/analytics';
import { Shell } from '../components/shell';
import { density } from '../state';

export default function RootLayout({ children, request }: LayoutProps<'/'>) {
  const optedOut = request.headers.get('sec-gpc') === '1';
  return (
    <html lang="en">
      <body>
        <Shell initialCookie={density.parseCookies(request.cookies)}>
          {children}
        </Shell>
        {optedOut ? null : <Analytics />}
      </body>
    </html>
  );
}
```

`PageProps` and `LayoutProps` carry `request` because the generated
`.k8ordo/register.gen.ts` says this mode has one; `RouteRequest` from
`@k8ordo/framework/server` is its type, for a component further down that
takes it as a prop.

A preference kept in a `@k8ordo/state` cookie state renders without a flash
of the default this way: the layout above reads it with
`density.parseCookies(request.cookies)` and hands the result to the client
component as `initialCookie`. A guard, a `route.ts` or a Server Action reads
it with `density.parseCookies(cookies())`. The header the layout reads is
Global Privacy Control's `Sec-GPC`, which decides whether the page carries
an analytics script at all.

Nothing lets a page write to the response — no status, no `Set-Cookie` —
because a page is a render, and a render that answered the request would be
a second handler. What the response carries beyond the page is decided before
it renders, in a `guard.ts`, or by the Server Action a `POST` carries;
`cookies()` there is what writes a cookie.

The field exists only under this mode: the generated `Page` and `Layout`
types carry it here and not under `mode: 'static'`, so a page that reads it
fails to type-check when the application is built into files, where there is
no request to read. The search is not here either — it is `@k8ordo/state`'s,
read in the browser, or handed to a page that exports `search`
([The search](boundaries.md#the-search)).

A Content-Security-Policy with a nonce is written from a guard too:
[Content Security Policy](csp.md#server-mode-a-nonce-per-answer).
