# Agent guide — packages/i18n

`@k8ordo/i18n` — the locale axis, owned. `defineLocales` is the set (the
list, the default, membership, negotiation, the URL segment, the `[locale]`
params schema); `defineDictionary` is the messages, typed by the default
locale's shape. `translator(locale)` is `t` on the server; `LocaleProvider` +
`useTranslation(dictionary)` are the client. The shared discipline (React 19 /
RSC assumed, Baseline newly available only, no polyfills) and how a new
package joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (locales, dictionary, Accept-Language; node) + browser (provider + hooks, chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **A string crosses the boundary; nothing else does.** `LocaleProvider`
  takes `locale: string` so a Server Component layout can render it with
  `params.locale`. The dictionary (which holds functions) and the locale set
  are imported by whoever needs them — that is why `useTranslation` takes
  the dictionary as an argument instead of reading it from context. Do not
  add a dictionary prop to the provider.
- **The default locale sets the shape.** `defineDictionary`'s second
  parameter is `Msgs & { [K in L]: Translations<Msgs[D]> }`: `Msgs` is
  inferred from the literal, and the intersection is what makes a missing or
  mistyped key an error at the definition. `D` is carried on `Locales<L, D>`
  for exactly this — do not collapse it into `L`.
- **Refuse where it is defined, not where it is read.** A tag that is not
  BCP 47, a default outside the list, a repeated locale, a locale without
  messages, a message a locale lacks — all throw from `defineLocales` /
  `defineDictionary`. `translator` and `useTranslation` throw on a locale
  outside the set. Nothing returns `undefined` for a key.
- **No grammar.** A message is a string or a function; interpolation is the
  function's own template literal, plurals and formats are `Intl`. Do not
  add placeholder syntax, ICU parsing, or a `formatters` option.
- **Negotiation is per requested tag, in order** — exact, then the first
  supported locale speaking the same language, then the default (RFC 4647
  lookup shape). Exact matches across the whole list are not searched first;
  the test `['en-US', 'ja']` → `'en'` is the guard.
- **`delocalize` says `null`, never the default.** The root layout and the
  404 page choose the fallback visibly.

## Layout

```
src/
  locales.ts          defineLocales(): the set; negotiate; localize/delocalize;
                      the Standard Schema for [locale] (no schema library)
  dictionary.ts       defineDictionary(): Translations<Base>, translator(locale)
  accept-language.ts  parseAcceptLanguage(): header → preference list
  provider.tsx        LocaleProvider (string prop), useLocale() ('use client')
  use-translation.ts  useTranslation(dictionary) ('use client')
  index.ts
```

## Conventions

- `type`, not `interface`. There is no `Register` here: the dictionary is
  passed to the hook, so types flow from the argument and nothing needs
  merging. `MessageKeyOf<typeof dictionary>` is the app's key type.
- The Standard Schema object is hand-written (`LocaleParamsSchema`) so the
  package has no zod peer; keep `version: 1`, `vendor`, and the sync
  `validate` shape the framework's `parseParams` reads.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
