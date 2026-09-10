# @k8ordo/i18n

The locale axis of an application, owned. One locale set declares which
locales exist and which is the default, and derives the URL segment, the
params schema of the `[locale]` route, negotiation from `navigator.languages`
or `Accept-Language`, and the static build's path list. One dictionary holds
the messages — strings, or functions of the values a message needs — typed by
the default locale, so a key that is not translated does not compile. No
message grammar: interpolation is a template literal and plurals are
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

| Package        | Version  | Needed for                     |
| -------------- | -------- | ------------------------------ |
| `react`        | ≥19.2.6  | `LocaleProvider` and the hooks |
| `typescript`   | ≥7.0.2   | the shipped type declarations  |
| `@types/react` | ≥19.2.18 | the shipped type declarations  |

No schema library: a locale set is a list, and a list checks membership
itself. `locales.paramsSchema` speaks Standard Schema, which is what
`@k8ordo/static` and `@k8ordo/server` run for a route's params.

## Quick Start

The locale set in its own module, imported by everything that needs the list:

```ts
// i18n/locales.ts
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales(['ja', 'en']);
```

The default locale's messages set the shape; every other locale is held to it:

```ts
// i18n/ja.ts
export const ja = {
  'nav.home': 'ホーム',
  greeting: (name: string) => `こんにちは、${name}`,
};

// i18n/en.ts
import type { Translations } from '@k8ordo/i18n';
export const en: Translations<typeof ja> = {
  'nav.home': 'Home',
  greeting: (name) => `Hello, ${name}`,
};

// i18n/index.ts
import { defineDictionary } from '@k8ordo/i18n';
export const dictionary = defineDictionary(locales, { ja, en });
```

```tsx
// routes/[locale]/layout.tsx — Server Component
import { LocaleProvider } from '@k8ordo/i18n';
import { locales } from '../../i18n/locales';

export const paramsSchema = locales.paramsSchema; // /fr/… is a 404

export default function LocaleLayout({ params, children }: LayoutProps) {
  return <LocaleProvider locale={params.locale}>{children}</LocaleProvider>;
}
```

```tsx
// routes/[locale]/page.tsx — Server Component
import { dictionary } from '../../i18n';

export default function Home({ params }: PageProps<'/:locale'>) {
  const t = dictionary.translator(params.locale);
  return <h1>{t('nav.home')}</h1>;
}
```

```tsx
// components/greeting.tsx
'use client';
import { useTranslation } from '@k8ordo/i18n';
import { dictionary } from '../i18n';

export function Greeting({ name }: { name: string }) {
  const { t, locale } = useTranslation(dictionary);
  return <p lang={locale}>{t('greeting', name)}</p>;
}
```

The provider carries a string, so a Server Component renders it directly;
the dictionary is imported by the client component that needs it and never
crosses the boundary as a prop.

The [design guide](docs/GUIDE.md) covers the rest: negotiation and the `/`
redirect, `<html lang>`, `localize` / `delocalize` for menus and language
switchers, static path expansion, and pairing with `@k8ordo/router`,
`@k8ordo/ui`, and `@k8ordo/form`.

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/i18n` for locales and translated wording. Before adding a locale
or a message, read `node_modules/@k8ordo/i18n/docs/GUIDE.md`. Declare the
locale set once with `defineLocales` and the messages with `defineDictionary`
(the default locale sets the shape; annotate every other locale with
`Translations<typeof base>`). Read `t` on the server with
`dictionary.translator(params.locale)` and on the client with
`useTranslation(dictionary)`; render `<LocaleProvider locale>` from the
`[locale]` layout with a string. Interpolate with a function message, never
a message grammar; the locale lives in the URL, never in a cookie.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/i18n/docs/GUIDE.md`      |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/i18n/docs/GUIDE.md         |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
