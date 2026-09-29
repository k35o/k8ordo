# Guards, cookies and the request

What decides a request before a page renders, and what a page may read of
it.

## Guards

A `guard.ts` decides whether a request gets through, before anything below
its directory answers it. It can sit at any level, and the guards along a URL
run outer first, one at a time:

```ts
// src/routes/admin/guard.ts
import { href } from '@k8ordo/router';
import { cookies } from '@k8ordo/server/runtime';
import type { Guard } from '@k8ordo/server/runtime';

const guard: Guard<'/admin'> = () => {
  if (cookies().has('session')) return;
  return new Response(null, {
    status: 303,
    headers: { location: href('/login') },
  });
};

export default guard;
```

It receives `{ request, params }` — the `Request` as it arrived, and the
params of the pattern its directory puts it under, as the strings the URL
carried: a guard runs above every layout, where no schema has typed them.
`Guard<'/admin/:id'>` from `@k8ordo/server/runtime` is its type, and the
generated table checks each `guard.ts` against its directory's pattern either
way.

**A `Response` ends the request; nothing lets it through.** A redirect, a
`401`, a `403` — whatever it returns is the answer, and the guards inside it
and the page below never run. Returning nothing hands the request on to the
next guard, and the last one to what answers the URL.

A redirect's `location` goes out as the guard wrote it. It is a URL, not a
pattern in the table's terms like a `redirect.ts` target, so build it with
`href()`, which carries Vite's `base` when the application is served under
one. A pathname built some other way gets its base from `withBase()` in
`@k8ordo/router`.

Letting a request through can still add to its answer. `responseHeaders()`
is the `Headers` the final response will carry, whatever answers — the page,
its payload, the not-found, or a guard further in that ends the request:

```ts
// src/routes/guard.ts
import { responseHeaders } from '@k8ordo/server/runtime';

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
each page, its payload for a client navigation, a `HEAD`, a Server Action
posted to it, and a `not-found.tsx` below it; the root's also runs for a URL
nothing answers. A `redirect.ts` is answered before any guard runs: the URL
it answers has no page to guard, and the pages below its directory are
guarded as usual. A guard does not
protect a Server Action as such — an action is a function any page can call,
posted to whichever URL calls it — so an action checks what it needs itself.

The guards run after the params schemas have matched the URL, so a guard
under `[locale]` runs in the locale the URL names, and before the Server
Action a `POST` carries.

## Cookies

`cookies()` is the request's cookies, to read and to write, from a
`guard.ts`, a `route.ts` or a Server Action:

```ts
import { cookies } from '@k8ordo/server/runtime';

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
`secure`). The defaults are what a session wants: `path: '/'`,
`httpOnly: true`, `secure: true` and `sameSite: 'lax'` — except that over
plain HTTP to this machine (`localhost`, `127.0.0.1`, `[::1]`) `secure`
defaults to `false`, because Safari drops a `Secure` cookie there where
Chromium and Firefox keep it. Anywhere else served over plain HTTP, say
`secure: false`; `sameSite: 'none'` stays `Secure` everywhere. A name outside
RFC 6265's token characters throws.
`delete` takes the `path` and `domain` the cookie was set with, since those
are what a browser keys it by.

A page never writes a cookie: it reads `request.cookies` from its props, the
cookies the request carried.

## Reading the request

A page and a layout receive `request` beside `params` and `pathname`: the
headers, and the cookies parsed by name, both read-only.

```tsx
// src/routes/layout.tsx
import type { LayoutProps } from '@k8ordo/router';

export default function RootLayout({ children, request }: LayoutProps<'/'>) {
  const theme = request.cookies.get('theme') ?? 'light';
  const language = request.headers.get('accept-language') ?? 'en';
  return (
    <html data-theme={theme} lang={language.split(',')[0]}>
      <body>{children}</body>
    </html>
  );
}
```

`PageProps` and `LayoutProps` carry `request` because the generated
`.k8ordo/register.gen.ts` says this mode has one; `RouteRequest` from
`@k8ordo/server/runtime` is its type, for a component further down that takes
it as a prop.

Nothing lets a page write to the response — no status, no `Set-Cookie` —
because a page is a render, and a render that answered the request would be
a second handler. What the response carries beyond the page is decided before
it renders, in a `guard.ts`, or by the Server Action a `POST` carries;
`cookies()` there is what writes a cookie.

The field exists only under this mode: the generated `Page` and `Layout`
types carry it here and not under `@k8ordo/static`, so a page that reads it
fails to type-check when the application is built into files, where there is
no request to read. The search is not here either — it is `@k8ordo/state`'s,
read in the browser, or handed to a page that exports `search`
([Execution boundaries](boundaries.md#alongside-the-rest-of-k8ordo)).

<!-- shared:csp -->

## Content Security Policy

The framework decides no policy. It signs the inline scripts it writes
itself — the payload it puts into the HTML for hydration, and React's own —
and the policy that names them is the application's to write. An inline
script of the application's own, `@k8ordo/color-scheme`'s among them, is the
application's to allow the same way.

<!-- /shared:csp -->

Every answer is signed with a nonce of its own, and `nonce()` from
`@k8ordo/server/runtime` reads it — from a `guard.ts`, which names it in the
header it writes (see [Guards](#guards) above), and from a layout or a
page, which signs a script of its own with it:

```ts
// src/routes/guard.ts
import { nonce, responseHeaders } from '@k8ordo/server/runtime';

export default function guard() {
  responseHeaders().set(
    'content-security-policy',
    `script-src 'nonce-${nonce()}' 'strict-dynamic'; object-src 'none'; base-uri 'none'`,
  );
}
```

```tsx
// src/routes/layout.tsx
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/server/runtime';

// …inside <body>
<ColorSchemeProvider nonce={nonce()}>{children}</ColorSchemeProvider>;
```

The framework's module script carries the nonce as well, so under
`'strict-dynamic'` it loads the rest of the client. `nonce()` reads the same
value anywhere the request is being answered, the render included — signing
a script is not writing the response — and throws outside one. A nonce is
worth something only while it is new: an answer that carries one is not one
to keep in a shared cache.
