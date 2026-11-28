# Content Security Policy

The framework decides no policy. It signs the inline scripts it writes
itself — the payload it puts into the HTML for hydration, and React's own —
and the one `<style>` it writes into `<head>`, empty, which keeps the
Server Components' stylesheets before the client components'
([How a page is sent](routing.md#how-a-page-is-sent)); the policy that names
them is the application's to write. An inline
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
import { ColorSchemeScript } from '@k8ordo/color-scheme';
import { nonce } from '@k8ordo/framework/server';

// …inside <head>
<ColorSchemeScript nonce={nonce()} />;
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

The framework's `<style>` carries the nonce too, so a policy that restricts
styles names it in `style-src` as well. `vite dev` adds each stylesheet as a
`<style>` of its own, which nothing signs, so allow `'unsafe-inline'` there
instead — beside a nonce it would be ignored:

```ts
const styles = import.meta.env.DEV
  ? "'self' 'unsafe-inline'"
  : `'self' 'nonce-${nonce()}'`;
```

React, signing styles with the nonce, writes a `<style>` with `href` and
`precedence` into the HTML only when it carries the same nonce: give one a
Server Component renders `nonce={nonce()}`. One a client component renders
cannot read it, and is left out of the HTML.

## Static mode: hashes in a `<meta>`

Static mode only. A file cannot carry a nonce — everyone reads the same
one — so the build names what the framework signed by hash, and leaves no
nonce in what it writes. Give the plugin the policy as `csp`, directives and
their sources (`ContentSecurityPolicy`), and each page gets it in a
`<meta http-equiv="Content-Security-Policy">` first in its `<head>` after
the `<meta charSet>` (a browser looks for the encoding only in the first
1024 bytes, which a policy naming many hashes outgrows), with the hashes of
that page's framework scripts added wherever a script element is decided —
`script-src` (made from `default-src` when only that was given) and
`script-src-elem` when given:

```ts
// vite.config.ts
import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      site: 'https://example.com',
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});
```

The framework's empty `<style>` is named by hash the same way, wherever a
style element is decided — `style-src-elem`, `style-src`, or `style-src`
made from `default-src` — unless the policy lets it in already with
`'unsafe-inline'`: a hash beside that would turn `'unsafe-inline'` off for
every `style` attribute as well.

An inline script of the application's is allowed by its hash in that policy,
as `colorSchemeScriptHash()` gives `@k8ordo/color-scheme`'s (pass it the
props `ColorSchemeScript` is given, `nonce` aside); any other inline script
on the page — one that reached it from content — is refused. The framework's module
script is allowed by where it comes from (`'self'`), since nothing in a file
can sign it, which is why the build refuses a policy with `'strict-dynamic'`.
It refuses `frame-ancestors`, `report-uri` and `sandbox` too, which a
`<meta>` ignores: set those as headers at the host. It refuses `report-to`
as well: the endpoint it names is defined only by a `Reporting-Endpoints`
response header, so set a policy that reports as a header at the host.
That header cannot carry the hashes the build adds page by page, and a
script runs only where every policy allows it: wherever the header decides
a script element — `script-src` (`default-src` without it) and
`script-src-elem` — allow `'self'` and `'unsafe-inline'` with no hash or
nonce beside them (either turns `'unsafe-inline'` off), and keep `csp`,
without `report-to`, for the `<meta>`, which allows inline scripts only by
hash. The `<style>`'s hash is the same on every page —
`'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='`, an empty one's —
so a header that restricts styles can name it. Without `csp`, no policy is written. There is no `nonce()` for this
mode: what an application signed with it would land in the file, and make
every build differ.

A `fallback.tsx`'s shell draws its page in the browser from data the
browser fetches
([Values the build did not write](params.md#values-the-build-did-not-write)),
so a policy that restricts `connect-src`, or `default-src` in its place,
names the API's origin there:
`'connect-src': ["'self'", 'https://api.example.com']`.

## A script of the application's that runs before the first paint

A preference only the browser applies — a density kept with
`@k8ordo/state`'s `defineLocalState`, say — reaches `<html>` before the
first paint through an inline script in the root layout's `<head>`, which
reads the stored value with `inlineRead()`
([Routing](routing.md#how-a-page-is-sent) says why `<head>`). Write it the
way `@k8ordo/color-scheme` writes its own, under either mode:

- **A `'use client'` component, not a `<script>` in the layout.** The text of
  a `<script>` a Server Component renders goes into every page's payload —
  each `.rsc`, and the copy written into the HTML for hydration — though a
  script that arrives with a navigation never runs. A client component's
  payload carries only its props, and the server render and hydration both
  build the text from its module.
- **The nonce as a prop.** The root layout passes `nonce()` under server
  mode. Under static mode it passes nothing, and `csp` names the hash of the
  same text, which a module without a directive exports for both the
  component and `vite.config.ts`.

```ts
// src/lib/density-script.ts
import { densityState } from '../state';

export const densityScript = `(() => {
  const s = ${densityState.inlineRead()};
  if (s && s.density === 'compact') {
    document.documentElement.dataset.density = 'compact';
  }
})();`;
```

```tsx
// src/components/density-script.tsx
'use client';

import { densityScript } from '../lib/density-script';

export function DensityScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce}>{densityScript}</script>;
}
```

```tsx
// src/routes/layout.tsx — server mode; under static mode, no nonce
<head>
  <ColorSchemeScript nonce={nonce()} />
  <DensityScript nonce={nonce()} />
</head>
```

```ts
// vite.config.ts — static mode
import { densityScript } from './src/lib/density-script';

const hashOf = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return `'sha256-${btoa(String.fromCodePoint(...new Uint8Array(digest)))}'`;
};

// csp: { 'script-src': ["'self'", await colorSchemeScriptHash(), await hashOf(densityScript)], … }
```

The script changes `<html>` before React hydrates it, so `<html>` carries
`suppressHydrationWarning`, as it does for `@k8ordo/color-scheme`.
