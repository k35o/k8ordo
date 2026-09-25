# Agent guide — packages/i18n

`@k8ordo/i18n` — the locale axis, owned. `defineLocales` is the set (the
list with each locale's `timeZone` and `dir`, the default, membership,
negotiation, the URL segment, the static build's path expansion (`paths`),
the `[locale]` params schema, the current locale); `message` is one message
as a function that reads the current locale where it is called. No provider, no hook. The shared discipline
(React 19 / RSC assumed, Baseline newly available only, no polyfills) and
how a new package joins are in the repository root's
[`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (locales, messages, request scope, Accept-Language; node) + browser (URL locale, chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **`message()` has no side effect at the declaration.** It returns a
  closure and touches nothing else — no registry, no validation, no
  `throw`. This is what lets a bundler drop an unreferenced message, which
  is the whole reason messages are functions rather than dictionary
  entries. Measured: a top-level function with a `throw` in its body is
  treated as side-effectful and nothing is dropped; a closure returned from
  another call (`locales.message`) is not analysed at all. Keep `message` a
  module-level function; validate where the message is read.
- **The locale is read, never carried.** On a server it lives in an
  `AsyncLocalStorage` reached through `process.getBuiltinModule` (so the
  same build runs in a browser) and stored on `globalThis` under
  `Symbol.for('@k8ordo/i18n/storage')`, because the RSC and SSR
  environments are separate module graphs in one process and both must see
  the value. `paramsSchema.validate` sets it with `enterWith`, which writes
  to whatever async context it runs in; the scope is the framework's side.
  The engine runs each pattern's schemas in a context of their own and
  starts the render in the one of the pattern that answered
  (`packages/framework-engine/src/runtime/params.ts`), so a locale accepted
  by a pattern a later schema refused is dropped, and a static build
  rendering many pages from one context lends no page's locale to another or
  to `404.html`. The catch-all runs the schemas of the layouts above its
  not-found too, without being refused by them, so a 404 under `/en/…`
  renders in `en`. Outside the browser, a runtime with no `AsyncLocalStorage`
  makes `validate` throw, as `run` does — accepting a locale `getLocale()`
  cannot see would silently render the default. In the browser
  `location.pathname`'s first segment is the locale, read as a message
  renders. That agrees with the server's HTML only because the HTML was
  rendered for the same URL: the engine renders a document drawn for another
  one (`404.html`) afresh instead of hydrating it
  (`packages/framework-engine/src/runtime/mount.ts`). Do not add a provider
  or a hook; do not pass the locale as a prop.
- **The last set to define itself is the one messages read.**
  `defineLocales` registers `{ default, is }` on `globalThis` (last wins, so
  a dev server re-evaluating `i18n.ts` under HMR is what messages see next)
  so `message()` can tell an unknown segment (`/fr/…` on a 404 page) from a
  locale, and can render the default when nothing names one. An application
  has one set; a test that defines others re-defines the one its messages
  read. Before any set registers (a client graph that never imports the
  module defining it), a segment no message has text for counts as no
  locale, so a 404 page does not throw.
- **Refuse where it is read, name what is missing.** A message lacking the
  named locale throws from the call, listing the variants present. An empty
  set, a tag that is not BCP 47, a default outside the list, a time zone
  `Intl.DateTimeFormat` refuses (or a missing one, which it would quietly
  replace with the runtime's own), and a `dir` other than `ltr` / `rtl`
  still throw from `defineLocales` — that one runs once.
- **A locale's time zone and direction are declared, never derived.** The
  runtime's time zone is the server's on one side and the visitor's on the
  other, so anything formatted in it disagrees across hydration; and
  `Intl.Locale#getTextInfo` is not Baseline. Do not default either.
- **No grammar.** A message is text in every locale or a function in every
  locale; interpolation is the function's own template literal; plurals and
  formats are `Intl`. Do not add placeholder syntax, ICU parsing, or a
  `formatters` option.
- **Negotiation is per requested tag, in order** — exact, then the first
  supported locale speaking the same language, then the default (RFC 4647
  lookup shape). The test `['en-US', 'ja']` → `'en'` is the guard.
- **`delocalize` says `null`, never the default.** The root layout and the
  404 page choose the fallback visibly.

## Layout

```
src/
  locales.ts          defineLocales(): the set; negotiate; localize/delocalize;
                      paths (static path expansion);
                      the Standard Schema for [locale] (no schema library);
                      getLocale / run
  message.ts          message(): one message as a function; Message, Variants
  current.ts          where the current locale is kept on each side; the registry
  register.ts         Register (the one interface) and RegisteredLocale
  accept-language.ts  parseAcceptLanguage(): header → preference list
  index.ts
```

## Conventions

- `type`, not `interface` — except `Register`, which exists to be merged
  (`declare module '@k8ordo/i18n' { interface Register { locale: … } }`).
  Augmentations in tests need the same `oxlint-disable-next-line
typescript/consistent-type-definitions` the state package uses, or
  `vp check --fix` rewrites them into a `type` and breaks the merge.
- The Standard Schema object is hand-written (`LocaleParamsSchema`) so the
  package has no zod peer; keep `version: 1`, `vendor`, and the sync
  `validate` shape the framework's `parseParams` reads.
- Tests that call `paramsSchema.validate` wrap it in `locales.run` so the
  `enterWith` does not leak into later tests.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
