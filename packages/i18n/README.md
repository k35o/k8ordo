# @k8ordo/i18n

The locale axis of an application, owned. One locale set declares which
locales exist and which is the default, and derives the URL segment, the
params schema of the `[locale]` route, negotiation from `navigator.languages`
or `Accept-Language`, and the static build's path list. Each message is a
function — `message({ ja: 'ホーム', en: 'Home' })` — that reads the locale
where it is called: the request on the server, the URL in the browser. So the
same line renders in a Server Component and in a Client Component, there is
no provider and no hook, and a bundler keeps only the messages a client module
names. No message grammar: interpolation is a template literal and plurals are
`Intl.PluralRules`.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/i18n
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install @k8ordo/i18n
# or
pnpm add @k8ordo/i18n
```

## Peer Dependencies

| Package      | Version | Needed for                    |
| ------------ | ------- | ----------------------------- |
| `typescript` | ≥7.0.2  | the shipped type declarations |

No React import and no schema library: a message is a plain function, and a
locale set is a list that checks membership itself. `locales.paramsSchema`
speaks Standard Schema, which is what `@k8ordo/static` and `@k8ordo/server`
run for a route's params. On a server the current locale rides on
`AsyncLocalStorage`, reached through `process.getBuiltinModule`, so a server
runtime has to provide that API; Node 24, which the framework modes require,
does.

## Quick Start

The locale set in its own module, registered once so every message is held
to it:

```ts
// i18n.ts
import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales(['ja', 'en']);

declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}
```

Each message is one export, with its text in every locale:

```ts
// messages/nav.ts
import { message } from '@k8ordo/i18n';

export const home = message({ ja: 'ホーム', en: 'Home' });
export const greeting = message({
  ja: (name: string) => `こんにちは、${name}さん`,
  en: (name) => `Hello, ${name}`, // the arguments are typed by ja
});
```

The `[locale]` route's layout declares the schema; accepting a locale makes it
the locale of that render:

```tsx
// routes/[locale]/layout.tsx
import { locales } from '../../i18n';

export const { paramsSchema } = locales; // /fr/… is a 404
```

And a message is called the same way everywhere:

```tsx
// routes/[locale]/page.tsx — a Server Component
import * as nav from '../../messages/nav';

export default function Page() {
  return <h1>{nav.home()}</h1>;
}
```

```tsx
// components/toolbar.tsx — a Client Component, the same line
'use client';
import * as nav from '../messages/nav';

export function Toolbar() {
  return <button>{nav.greeting('k8o')}</button>;
}
```

Where a Server Component hands text to a Client Component as a prop, it calls
the message and passes the string: a function does not cross that boundary.

`/` negotiates and redirects; `<html lang>` and a language switcher read
`locales.getLocale()`; a static build passes `paths: locales.paths`. Links
stay `@k8ordo/router`'s: `bindParams(() => ({ locale: locales.getLocale() }))`
gives an `href` that spells `/:locale/…` patterns without the locale.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/i18n` for locales and translated text. Before adding a message
or touching a `[locale]` route, read `node_modules/@k8ordo/i18n/docs/GUIDE.md`.
The locale set is declared once with `defineLocales` and registered through
`Register`; each message is a `message({ ja, en })` export, called where it
renders — the same call in a Server and a Client Component. There is no
provider, no hook and no message grammar: never pass the locale down as a
prop, interpolate inside the message's own function, and from a Server
Component hand a `'use client'` component the called string, not the message.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/i18n/docs/GUIDE.md`      |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/i18n/docs/GUIDE.md         |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
