# Content Security Policy

The framework decides no policy. It signs the inline scripts it writes
itself — the payload it puts into the HTML for hydration, and React's own —
and the policy that names them is the application's to write. An inline
script of the application's own, `@k8ordo/color-scheme`'s among them, is the
application's to allow the same way.

How the framework signs them depends on the mode: a nonce per answer under
`mode: 'server'`, a hash in a file under `mode: 'static'`.

## Server mode: a nonce per answer

Server mode only. Every answer is signed with a nonce of its own, and
`nonce()` from `@k8ordo/framework/server` reads it — from a `guard.ts`,
which names it in the header it writes
([Guards](guards.md#guards)), and from a layout or a page, which signs a
script of its own with it:

```ts
// src/routes/guard.ts
import { nonce, responseHeaders } from '@k8ordo/framework/server';

export default function guard() {
  const scripts = [`'nonce-${nonce()}'`, "'strict-dynamic'"];
  if (import.meta.env.DEV) scripts.push("'unsafe-eval'");
  responseHeaders().set(
    'content-security-policy',
    `script-src ${scripts.join(' ')}; object-src 'none'; base-uri 'none'`,
  );
}
```

```tsx
// src/routes/layout.tsx
import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/framework/server';

// …inside <body>
<ColorSchemeProvider nonce={nonce()}>{children}</ColorSchemeProvider>;
```

The framework's module script carries the nonce as well, so under
`'strict-dynamic'` it loads the rest of the client. `nonce()` reads the same
value anywhere the request is being answered, the render included — signing
a script is not writing the response — and throws outside one. A nonce is
worth something only while it is new: an answer that carries one is not one
to keep in a shared cache.

`'unsafe-eval'` is for `vite dev` alone. React's development build calls
`eval()` — to show a Server Component's stack in the browser's console — and
under a policy without it every page load logs an error saying so. A
production build never calls it, and `import.meta.env.DEV` keeps the source
out of it.

## Static mode: hashes in a `<meta>`

Static mode only. A file cannot carry a nonce — everyone reads the same
one — so the build names what the framework signed by hash, and leaves no
nonce in what it writes. Give the plugin the policy as `csp`, directives and
their sources (`ContentSecurityPolicy`), and each page gets it in a
`<meta http-equiv="Content-Security-Policy">` first in its `<head>`, with the
hashes of that page's framework scripts added wherever a script element is
decided — `script-src` (made from `default-src` when only that was given)
and `script-src-elem` when given:

```ts
// vite.config.ts
import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
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
is written. There is no `nonce()` for this mode: what an application signed
with it would land in the file, and make every build differ.

A `fallback.tsx`'s shell draws its page in the browser from data the
browser fetches
([Values the build did not write](params.md#values-the-build-did-not-write)),
so a policy that restricts `connect-src`, or `default-src` in its place,
names the API's origin there:
`'connect-src': ["'self'", 'https://api.example.com']`.
