# @k8ordo/i18n

The locale axis of an application, owned.

One locale set declares which locales exist and which is the default, and
derives everything that depends on the list: the URL segment, the params
schema of the `[locale]` route, negotiation from `navigator.languages` or
`Accept-Language`, and the static build's path list. Each message is a
function — `message({ ja: 'ホーム', en: 'Home' })` — that reads the locale
where it is called. On the server that is the request the `[locale]` schema
accepted; in the browser it is the URL. So the same call renders in a Server
Component and in a Client Component, there is no provider and no hook, and a
bundler keeps only the messages a client module names.

Like every k8ordo package it assumes React 19 and Server Components, uses
only what has reached Baseline newly available, and ships no polyfills or
legacy fallbacks.

## What it does not own

- **The pathname.** `@k8ordo/router` owns routes; this package owns the
  locale segment in front of them and nothing after it.
- **A message grammar.** No placeholder syntax, no ICU. A message with
  values is a function of those values: interpolation is a template
  literal, plurals are `Intl.PluralRules`, dates and numbers are `Intl`.
  TypeScript checks the arguments because they are arguments.
- **Loading.** Messages are ordinary exports. Which ones reach the browser is
  decided by the bundler from what each client module imports, not by a
  loader, a namespace list, or a provider prop.

## The shape of it

```ts
// i18n.ts — the one place the list is spelled
import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales(['ja', 'en']);

declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}
```

```ts
// messages/nav.ts — each message is one export
import { message } from '@k8ordo/i18n';

export const home = message({ ja: 'ホーム', en: 'Home' });
export const greeting = message({
  ja: (name: string) => `こんにちは、${name}さん`,
  en: (name) => `Hello, ${name}`,
});
```

```tsx
// routes/[locale]/layout.tsx — a Server Component
import { locales } from '../../i18n';

export const paramsSchema = locales.paramsSchema;
```

Spell it as that assignment: the framework finds a route's schema by
reading the file for `export const paramsSchema`, so a destructuring export
(`export const { paramsSchema } = locales`) would go unnoticed and `/fr/…`
would render in the default locale. A linter's `prefer-destructuring`
autofix rewrites it into exactly that, so disable the rule on the line.

```tsx
// anywhere — a Server Component or a Client Component, the same line
import * as nav from '../messages/nav';

<h1>{nav.home()}</h1>
<p>{nav.greeting(name)}</p>
```

That is the whole surface: `defineLocales`, `Register`, `message`, and
`paramsSchema` on the `[locale]` segment.

## The locale set

`defineLocales(all, { default? })` returns the set. The first entry is the
default unless told otherwise; every tag must be BCP 47 (checked with
`Intl.Locale`); a repeated tag or a default outside the list throws at the
definition, not later.

| Member            | What it is                                                                        |
| ----------------- | --------------------------------------------------------------------------------- |
| `all`             | The tags, in order.                                                               |
| `default`         | The tag used when nothing names one.                                              |
| `is(value)`       | Membership as a type guard.                                                       |
| `negotiate(…)`    | The best supported tag for a preference list.                                     |
| `localize`        | `'/ui'` → `'/en/ui'`; `'/'` → `'/en'`.                                            |
| `delocalize`      | `'/en/ui'` → `{ locale: 'en', pathname: '/ui' }`; `'/x'` → `{ locale: null, … }`. |
| `paramsSchema`    | The `[locale]` segment's schema (Standard Schema; no schema library).             |
| `getLocale()`     | The locale of the render in progress. Not a hook.                                 |
| `run(locale, fn)` | Server only: runs `fn` with `locale` current.                                     |

`LocaleOf<typeof locales>` is the tag union. `delocalize` says `null` for a
first segment that is not a locale rather than guessing the default, so the
root layout and the 404 page choose the fallback visibly.

### Negotiation

`negotiate` takes the list as the browser or the header gives it and tries
each requested tag in order — the exact tag, then the first supported locale
that speaks its language — before falling back to the default. Nothing
matching across the whole list is the default; a tag that is not BCP 47 is
skipped, because the list is user input.

```ts
locales.negotiate(navigator.languages); // in the browser
locales.negotiate(parseAcceptLanguage(request.headers.get('accept-language')));
```

`parseAcceptLanguage(header)` turns an `Accept-Language` header into that
list: `q` weights decide the order, ties keep the header's order, `q=0` and
`*` are dropped, and a missing header is an empty list.

## Messages

`message(variants)` declares one message with its text in every locale.
Once `Register` carries the app's locale union, a variant missing for any
locale is a type error at the declaration — that is the whole "untranslated
key does not compile" guarantee, per message, with no key list to maintain.

A message is either text in every locale or a function in every locale;
the two are not mixed within one message. For a function message the
arguments are typed by the variant you annotate, and every other variant
is held to the same parameters:

```ts
export const items = message({
  ja: (count: number) => `${String(count)} 件`,
  en: (count) =>
    `${String(count)} ${new Intl.PluralRules('en').select(count) === 'one' ? 'item' : 'items'}`,
});
```

The result is a `Message<Args>`: `() => string` for text, `(…args) =>
string` for a function. That type is what a component that takes a message
as a prop should accept —

```tsx
type NavItem = { path: string; label: Message };
const items: NavItem[] = [{ path: '/ui', label: nav.ui }];
…
<a href={item.path}>{item.label()}</a>
```

— so data can carry messages without carrying strings, and without any
component translating on another's behalf.

### Where messages live

Anywhere. A file per area (`messages/nav.ts`, `messages/form.ts`) with a
barrel that re-exports each as a namespace reads well at the call site:

```ts
// messages/index.ts
export * as nav from './nav';
export * as form from './form';
```

```tsx
import * as m from '../messages';
<h1>{m.nav.home()}</h1>;
```

A message that belongs to one component can sit next to that component.
Grouping related messages in an object (`export const button = { label:
message(…), hint: message(…) }`) is fine too; the bundler then keeps the
group together.

### Across the Server Component boundary

A message is a function, and a function does not cross from a Server
Component to a Client Component as a prop. Where a Server Component hands
text to a `'use client'` component, it calls the message and passes the
string — `<Dialog title={m.dialog.title()} />` — which is the rule the rest
of k8ordo already follows: only input crosses the boundary. Nothing further
down needs the string threaded through it, because any component, on either
side, can import a message and call it itself.

A component without a directive is shared: rendered by a Server Component it
runs on the server, rendered by a Client Component it runs in the browser,
and in both cases a `Message` prop is fine because it never crosses. A
component that only reads props and messages — a page title, a landing
layout — is best left without `'use client'` for exactly this reason.

### What reaches the browser

`message()` has no side effect at the declaration — it returns a function
and touches nothing — so a bundler treats an unreferenced message as dead
code. What a client bundle carries is therefore exactly the messages that
`'use client'` modules name, in every locale, and nothing a Server Component
rendered. This is the reason messages are functions and exports rather than
entries in a dictionary object: a dictionary is kept or dropped whole.

Keep the rule of thumb in mind: text that a Server Component renders costs
the client nothing, whichever module declares it. A client component that
needs text names it and pays for that message alone.

## Where the locale comes from

**On the server**, `paramsSchema` accepting a locale makes it the current
one for the rest of that request's render — the Server Components, the
HTML they become, and the client components that run on the server for
that HTML. Concurrent renders stay apart (`AsyncLocalStorage`). Outside a
`[locale]` route — a test, code that runs before the route matched — use
`locales.run(locale, fn)`; and when nothing names a locale, messages render
in the default.

**In the browser**, the URL is the locale: the first segment of
`location.pathname`, read when a message is called. Changing locale is a
navigation to the same pathname under the other segment
(`locales.localize(locales.delocalize(pathname).pathname, 'en')`), which
re-renders the page; there is no state to keep in sync.

A first segment that is not one of the set's locales is no locale, and the
default applies; before the set has been defined in that environment, a
segment no message has text for is read the same way, so a 404 page never
throws on `/fr/…`.

`locales.getLocale()` reads the same source for code that needs the tag
itself: `<html lang>`, a language switcher, `Intl` formatters.

### The `/` page

`/` is the one URL without a locale. Render nothing there and redirect from
an effect:

```tsx
'use client';
useEffect(() => {
  navigation.navigate(
    locales.localize('/', locales.negotiate(navigator.languages)),
    { history: 'replace' },
  );
}, []);
```

Under `@k8ordo/server` the same decision can be made on the server with
`parseAcceptLanguage` and a redirect.

### `<html lang>`

The root layout sits above `[locale]` and receives `pathname`; the schema
has already run for that request, so `locales.getLocale()` is right, and
`locales.delocalize(pathname).locale ?? locales.default` says the same thing
in terms of the URL alone.

## Static builds

`@k8ordo/static` asks for the pathnames of every pattern with a parameter.
Expand `[locale]` from the set — the list is spelled once:

```ts
framework({
  paths: (patterns) =>
    patterns.flatMap((pattern) =>
      locales.all.map((locale) => pattern.replace(':locale', locale)),
    ),
});
```

Each path is rendered as its own request, so the schema names the locale
for each and the messages come out in that locale. The `404.html` a static
host serves for everything else is rendered once, under the build's
sentinel locale; a client component on it reads the visitor's URL and
re-renders in theirs after hydration.

## Alongside the rest of k8ordo

- **`@k8ordo/router`**: `locales.localize` / `delocalize` are the only
  things here that touch a pathname. A link component that prefixes the
  current locale is `href(locales.localize(path, locales.getLocale()))`.
- **`@k8ordo/ui`**: its own built-in strings take a dictionary prop on
  `UIProvider`; pass `en` on `/en/…` from `locales.getLocale()`.
- **`@k8ordo/form`**: constraint messages are messages — `message({ ja:
(max: number) => …, en: … })` — called where the constraint is declared.

## What it guarantees

- A locale outside the list never reaches a page: the schema refuses it.
- A message missing a locale does not compile once `Register` is merged.
  From JavaScript, or through `as`, it throws where it is read, naming the
  locale and the variants present — never `undefined`.
- Arguments to a function message are typed by the function.
- No render is ever in a locale the URL does not spell (browser) or the
  request did not accept (server).

## Testing

Under Node, `locales.run('en', () => nav.home())` renders in `en`; without
it, the default. The `paramsSchema` sets the locale for the rest of its
scope too, so wrap a test that validates in `run` to keep tests apart. In a
browser environment, `history.replaceState(null, '', '/en/…')` is the
locale.
