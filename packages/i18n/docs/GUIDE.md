# @k8ordo/i18n

The locale axis of an application, owned. One locale set says which locales
exist and which is the default, and from it come the URL segment, the params
schema, negotiation, and the static build's path list. One dictionary holds
the messages, and from it come the keys, the server-side translator, and the
client hook — typed by the default locale's messages, so a key that is not
translated does not compile.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks. `Intl.Locale`, `Intl.PluralRules`, and the rest of `Intl` are
treated as simply present, which is why this package brings no formatting
grammar of its own.

## What it does not own

The pathname belongs to `@k8ordo/router`. This package owns one segment of it
— how a locale is spelled in a URL, and how to take it back off — and nothing
past that: no route table, no link builder. With `@k8ordo/router` a locale is
a route parameter (`/:locale/products`), and `href('/:locale/products', {
locale })` is the typed link; `localize` / `delocalize` exist for the paths
that are data rather than patterns (a navigation menu, a language switcher).

It does not own message formatting either. A message is a string, or a
function of the values the text needs — TypeScript's own template literal is
the interpolation, and `Intl.PluralRules` / `Intl.NumberFormat` /
`Intl.DateTimeFormat` are the plural and format rules. An ICU-style message
grammar would be a second language inside the first, checked by nothing.

It does not load messages lazily. The dictionary is a module; every locale in
it ships wherever the module is imported. An application that needs one locale
per bundle splits at the module level, and nothing here stands in the way.

## The shape of it

```
i18n/locales.ts    defineLocales(['ja', 'en'])         the set, imported by everything
i18n/ja.ts         the default locale's messages        sets the shape
i18n/en.ts         Translations<typeof ja>              must match it
i18n/index.ts      defineDictionary(locales, { ja, en })

server    params.locale  →  dictionary.translator(locale)  →  t
            ↓ <LocaleProvider locale={params.locale}>      a string crosses
client    useTranslation(dictionary)  →  { t, locale }     the module is imported
```

The provider carries a **string**. A Server Component layout renders it with
`params.locale` directly, and nothing that cannot cross the RSC boundary — the
locale set, the dictionary, a function message — is ever asked to. The client
component that needs the messages imports the dictionary itself.

## The locale set

```ts
// i18n/locales.ts
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales(['ja', 'en']);
export type Locale = LocaleOf<typeof locales>; // 'ja' | 'en'
```

The first entry is the default; `defineLocales(['en-US', 'ja'], { default:
'ja' })` says otherwise. Every entry must be a BCP 47 tag (`Intl.Locale` is
the judge), listed once, and the default must be one of them — each is refused
where the set is defined, not where it is first used.

| member         | what it is                                                               |
| -------------- | ------------------------------------------------------------------------ |
| `all`          | the locales, in the order given                                          |
| `default`      | the fallback for everything that finds no better answer                  |
| `is(value)`    | membership as a type guard — the check for `params.locale` and a segment |
| `negotiate()`  | the best supported locale for a preference list                          |
| `localize()`   | `('/ui', 'en')` → `'/en/ui'`; `('/', 'en')` → `'/en'`                    |
| `delocalize()` | `('/en/ui')` → `{ locale: 'en', pathname: '/ui' }`; no segment → `null`  |
| `paramsSchema` | the `[locale]` segment's params schema, in the shape the framework runs  |

`delocalize` answers `locale: null` for a pathname whose first segment is not
a locale, rather than guessing the default: the 404 page and the root layout
decide what to do with a URL that has none, and they should decide it
visibly.

### Negotiation

```ts
locales.negotiate(navigator.languages); // browser
locales.negotiate(parseAcceptLanguage(request.headers.get('accept-language'))); // server
```

Each requested tag is tried in order — the exact tag first, then the first
supported locale that speaks its language — and when nothing matches, the
default. So with `['ja', 'en']` supported, a browser asking for `en-US` gets
`en`, one asking for `fr, en-AU, ja` gets `en` (its second choice is spoken;
its third would have been exact), and one asking for `de` gets `ja`. Tags are
matched case-insensitively, and a tag that is not BCP 47 is skipped, not
thrown on: the list is user input. `parseAcceptLanguage` turns a header into
that list — `q` weights ordered, ties in header order, `q=0` and `*` dropped.

## The dictionary

```ts
// i18n/ja.ts — the default locale sets the shape
export const ja = {
  'nav.home': 'ホーム',
  greeting: (name: string) => `こんにちは、${name}`,
  items: (count: number) => `${new Intl.NumberFormat('ja').format(count)} 件`,
};
```

```ts
// i18n/en.ts — every other locale is held to it
import type { Translations } from '@k8ordo/i18n';
import type { ja } from './ja';

export const en: Translations<typeof ja> = {
  'nav.home': 'Home',
  greeting: (name) => `Hello, ${name}`,
  items: (count) =>
    `${new Intl.NumberFormat('en').format(count)} ${new Intl.PluralRules('en').select(count) === 'one' ? 'item' : 'items'}`,
};
```

```ts
// i18n/index.ts
import { defineDictionary } from '@k8ordo/i18n';
import { en } from './en';
import { ja } from './ja';
import { locales } from './locales';

export const dictionary = defineDictionary(locales, { ja, en });
export type MessageKey = MessageKeyOf<typeof dictionary>;
```

`Translations<typeof ja>` is the whole contract: the same keys, a string where
the default has a string, a function of the same parameters where the default
has a function. Add a key to `ja` and `en` fails to compile until it carries
it; give `greeting` a second parameter and every translation must take it too.
`defineDictionary` checks the same thing again at runtime, for a dictionary
that reached it through JavaScript or a cast, and refuses to be defined rather
than answering `undefined` later.

The dictionary knows its locales, so a message file that needs the locale — a
`NumberFormat`, a `PluralRules` — writes it in, as `ja.ts` and `en.ts` do
above. A function message is ordinary TypeScript: it can call anything, and
the caller's arguments are typed by it.

## Server — the translator

```tsx
// routes/[locale]/products/page.tsx — Server Component
import { dictionary } from '../../../i18n';
import { locales } from '../../../i18n/locales';

export const paramsSchema = locales.paramsSchema;

export default function Products({ params }: PageProps<'/:locale/products'>) {
  const t = dictionary.translator(params.locale);
  return <h1>{t('nav.home')}</h1>;
}
```

`translator(locale)` is `t` for one locale — a key, plus the arguments its
message takes, none for a plain string. The same locale returns the same
function, so it is safe to compare and to pass to `useMemo`. A locale outside
the set throws, which a page under `paramsSchema` never sees: the schema has
already turned `/fr/products` into a pathname the pattern does not answer.

## Client — the provider and the hook

```tsx
// routes/[locale]/layout.tsx — Server Component
import { LocaleProvider } from '@k8ordo/i18n';
import { locales } from '../../i18n/locales';

export const paramsSchema = locales.paramsSchema;

export default function LocaleLayout({ params, children }: LayoutProps) {
  return <LocaleProvider locale={params.locale}>{children}</LocaleProvider>;
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

`useTranslation(dictionary)` reads the provider's locale, checks it against the
dictionary's set (a provider carrying `'fr'` throws, rather than rendering
`undefined` in every string), and returns that locale's `t`. `useLocale()`
alone gives the string the provider was given; `useLocale(locales)` gives it
checked and typed.

An application with many call sites binds once:

```ts
// i18n/client.ts
'use client';
import { useTranslation as useDictionary } from '@k8ordo/i18n';
import { dictionary } from './index';

export const useTranslation = () => useDictionary(dictionary);
```

The hook takes the dictionary as an argument rather than reading it from the
provider for one reason: a provider value would have to be a prop, and the
dictionary — functions included — cannot be one across the RSC boundary. A
string can.

## Where the locale comes from

The locale lives in the URL, as its first segment, and nowhere else: a cookie
or a header would give two visitors different pages for one URL, which is
what breaks caching, sharing, and a static build alike. What the header and
`navigator.languages` are for is the one URL that has no locale — `/` — whose
only job is to send the visitor to one that does.

```tsx
// routes/page.tsx — under @k8ordo/static, the redirect runs in the browser
'use client';
import { useEffect } from 'react';
import { locales } from '../i18n/locales';

export default function Root() {
  useEffect(() => {
    navigation.navigate(
      locales.localize('/', locales.negotiate(navigator.languages)),
      {
        history: 'replace',
      },
    );
  }, []);
  return <title>…</title>;
}
```

Under `@k8ordo/server` the same decision can be made per request, from the
`Accept-Language` header, and answered with a redirect before anything
renders.

`<html lang>` has to be right in the HTML the server wrote — a crawler and a
screen reader read it before any script runs — and the root layout sits above
the `[locale]` segment, so it reads the locale off the pathname it is given:

```tsx
// routes/layout.tsx
export default function Root({ children, pathname }: RootProps) {
  const { locale } = locales.delocalize(pathname);
  return <html lang={locale ?? locales.default}>…</html>;
}
```

## Static builds

Every pattern under `[locale]` needs pathnames at build time, and the locale
set is where they come from:

```ts
// vite.config.ts
import { framework } from '@k8ordo/static';
import { locales } from './src/i18n/locales';

export default defineConfig({
  plugins: [
    framework({
      paths: (patterns) =>
        patterns.flatMap((pattern) =>
          locales.all.map((locale) =>
            pattern.replace('/:locale', `/${locale}`),
          ),
        ),
    }),
  ],
});
```

Import the locale set, not the dictionary: the config file runs in Node at
build time, and it needs the list, not the messages.

## Alongside the rest of k8ordo

- **`@k8ordo/router`** types the `:locale` parameter from the route table;
  `locales.paramsSchema` on the `[locale]` layout is what makes an unknown
  locale a real 404 instead of a page rendered in no language.
- **`@k8ordo/ui`** carries its own wording (`close`, `required`, `loading`,
  …) with Japanese as the default. Hand `UIProvider` the matching dictionary
  from `@k8ordo/ui/i18n` for the current locale — `messages={locale === 'en'
? en : undefined}` — from the same client component that renders it.
- **`@k8ordo/form`** takes its messages from the zod schema; a schema that
  wants translated wording builds them with `t` from the translator of the
  locale it is rendered for.

## What it guarantees

- **A key is a compile error until every locale has it**, and a function
  message's arguments are typed by the default locale's signature.
- **A locale outside the set never renders.** The params schema refuses it
  before the page is chosen, `translator` refuses it on the server, and
  `useTranslation` refuses it on the client.
- **The same locale returns the same `t`.** No new function per render; a
  translator is created once per locale and reused.
- **Nothing here touches the boundary with a function.** The provider's
  prop is a string; the dictionary and the locale set are imported, never
  passed.
- **No grammar of its own.** Interpolation is a template literal, plurals are
  `Intl.PluralRules`, formatting is `Intl`, and the set of locales is a list.

## Testing

`defineLocales`, `defineDictionary`, `translator`, `negotiate`,
`parseAcceptLanguage`, `localize`, and `delocalize` are pure and run in Node
with no DOM. `LocaleProvider`, `useLocale`, and `useTranslation` render under
any React test renderer; a component under test needs only a
`<LocaleProvider locale="…">` around it.
