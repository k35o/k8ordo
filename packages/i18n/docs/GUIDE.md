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
  literal, and plurals, dates and numbers are `Intl` — the set only draws
  the `Intl` object for the current locale ([Formatting](#formatting)).
  TypeScript checks the arguments because they are arguments.
- **Loading.** Messages are ordinary exports. Which ones reach the browser is
  decided by the bundler from what each client module imports, not by a
  loader, a namespace list, or a provider prop.

## The shape of it

```ts
// i18n.ts — the one place the list is spelled
import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});

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

export const { paramsSchema } = locales;
```

```tsx
// anywhere — a Server Component or a Client Component, the same line
import * as nav from '../messages/nav';

<h1>{nav.home()}</h1>
<p>{nav.greeting(name)}</p>
```

That is all a working setup needs: `defineLocales`, `Register` (with
`LocaleOf`), `message`, and `paramsSchema` on the `[locale]` segment.

## The locale set

`defineLocales(definitions, { default? })` returns the set. `definitions` is
keyed by locale tag, and each locale states its `timeZone` and its `dir`. The
first entry is the default unless told otherwise (without `default`,
`locales.default` is typed as the whole union); every tag must be BCP 47
(checked with `Intl.Locale`); an empty set, a default outside the list, a time
zone the runtime does not know, and a `dir` other than `ltr` / `rtl` throw at
the definition, not later.

| Member                | What it is                                                                        |
| --------------------- | --------------------------------------------------------------------------------- |
| `all`                 | The tags, in order.                                                               |
| `definitions`         | Each locale's `{ timeZone, dir }`, as given.                                      |
| `default`             | The tag used when nothing names one.                                              |
| `is(value)`           | Membership as a type guard.                                                       |
| `negotiate(…)`        | The best supported tag for a preference list.                                     |
| `negotiateRequest(…)` | The best supported tag for a `Request`: a cookie, then `Accept-Language`.         |
| `localize`            | `'/ui'` → `'/en/ui'`; `'/'` → `'/en'`.                                            |
| `delocalize`          | `'/en/ui'` → `{ locale: 'en', pathname: '/ui' }`; `'/x'` → `{ locale: null, … }`. |
| `paths`               | The static build's `paths` option: `/:locale` expanded to every locale.           |
| `paramsSchema`        | The `[locale]` segment's schema (Standard Schema; no schema library).             |
| `getLocale()`         | The locale of the render in progress. Not a hook.                                 |
| `run(locale, fn)`     | Server only: runs `fn` with `locale` current.                                     |
| `dateTimeFormat`…     | `Intl` for the current locale ([Formatting](#formatting)).                        |

`LocaleOf<typeof locales>` is the tag union and `LocaleDefinition` one
locale's `{ timeZone, dir }`. `delocalize` says `null` for a first segment
that is not a locale rather than guessing the default, so the root layout and
the 404 page choose the fallback visibly.

### `timeZone` and `dir`

Neither can be derived from the runtime, so each locale declares both.

`timeZone` is the IANA time zone the locale's dates are shown in. The
runtime's own zone is the server's on the server and the visitor's in the
browser, so a date left to it renders one way in the HTML and another while
hydrating — a different day, near midnight. One zone per locale gives both
sides the same value. Which zone is a product decision: a site about events in
Tokyo may show its English pages in `Asia/Tokyo` too; a display that should
follow each visitor's own zone belongs in a part that renders in the browser
only.

`dir` is the direction the locale's text runs in, for `<html dir>`.
`Intl.Locale`'s `getTextInfo()` has not reached every browser, so it is
declared rather than derived.

### Negotiation

`negotiate` takes the list as the browser or the header gives it and tries
each requested tag in order — the exact tag, then the first supported locale
that speaks its language — before falling back to the default. Nothing
matching across the whole list is the default; a tag that is not BCP 47 is
skipped, because the list is user input.

```ts
locales.negotiate(navigator.languages); // in the browser
locales.negotiateRequest(request, { cookie: 'locale' }); // on a server
```

`negotiateRequest(request, { cookie? })` is the server's form. The cookie
named by `cookie` comes first when the request carries it — the locale the
visitor chose before, written where they switched language — then the
`Accept-Language` header in its order of preference. Both go through
`negotiate`, so a cookie still holding a locale the set no longer lists falls
through to the header. The name is the application's: a language switcher
that writes it (`cookieStore.set('locale', next)`) and the server that reads it
agree on one. Without `cookie`, only the header is read.

`parseAcceptLanguage(header)` is the header half on its own: it turns an
`Accept-Language` header into a preference list for `negotiate`: `q` weights decide the order (a `q` that is not a number is ignored),
ties keep the header's order, a weight of 0 or less (an empty `q=` included)
and `*` are dropped, and a missing header is an empty list.

## Messages

`message(variants)` declares one message with its text in every locale.
Once `Register` carries the app's locale union, a variant missing for any
locale is a type error at the declaration — that is the whole "untranslated
key does not compile" guarantee, per message, with no key list to maintain.

A message is either text in every locale or a function in every locale;
the two are not mixed within one message. For a function message the
argument types come from the variant you annotate, and every other variant
is held to them. Declare every parameter in every variant, an unused one as
`_count`: whether a variant that declares fewer compiles depends on which
locale holds it, and with no annotation at all the arguments are `unknown`.

```ts
export const items = message({
  ja: (count: number) => `${String(count)} 件`,
  en: (count) =>
    `${String(count)} ${locales.pluralRules().select(count) === 'one' ? 'item' : 'items'}`,
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

## Formatting

Plurals, dates, numbers and lists are `Intl` itself; there is no format
syntax here. The set draws the `Intl` object for the current locale:

| Member                         | Returns                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `dateTimeFormat(options?)`     | `Intl.DateTimeFormat` in the current locale and its `timeZone`. |
| `numberFormat(options?)`       | `Intl.NumberFormat` in the current locale.                      |
| `relativeTimeFormat(options?)` | `Intl.RelativeTimeFormat` in the current locale.                |
| `pluralRules(options?)`        | `Intl.PluralRules` in the current locale.                       |
| `listFormat(options?)`         | `Intl.ListFormat` in the current locale.                        |

```tsx
<time dateTime={date.toISOString()}>
  {locales.dateTimeFormat({ dateStyle: 'medium' }).format(date)}
</time>
```

What comes back is the `Intl` object, so `format`, `formatToParts`,
`formatRange`, `select` and the options are `Intl`'s own. One is made per
locale and options and returned again after that, so calling it where a
component or a message renders costs a lookup. Options are keyed by their
JSON: the same options in another order make a second object, never a
different answer. None of them is a hook, and each reads the current locale
the way a message does, so the same call works in a Server Component, a
Client Component, and inside a message's function.

`dateTimeFormat` writes a date only in the locale's `timeZone`. Its options
type refuses a `timeZone`, and one forced through with `as` is overridden. The
runtime's own zone is the server's on one side and the visitor's on the other,
so a date left to it reads differently in the HTML and while hydrating; the
locale's zone is the same on both. A display that should follow the visitor's
own zone — a local clock, a time relative to now — differs between the two by
nature: use `Intl` directly for it, in a part that renders in the browser
only. An `Intl` API not listed here (`Intl.Collator`, `Intl.DisplayNames`)
takes the tag from `locales.getLocale()`.

## Where the locale comes from

**On the server**, `paramsSchema` accepting a locale makes it the current
one for the render of the page that accepted it — the Server Components, the
HTML they become, and the client components that run on the server for
that HTML — and for nothing else. Concurrent renders stay apart
(`AsyncLocalStorage`). An acceptance belongs to the pattern that answered,
not to the request: when a schema further down the same stack refuses
(`/en/blog/nope`, where the page's slug schema says no), the pattern does
not answer and the locale goes with it. The 404 that answers instead runs
the schemas above its `not-found.tsx` on its own, so it is in the locale its
URL names — `/en/blog/nope` as `/en/nothing` is — and in the default under a
segment the set refuses (`/fr/nothing`). Outside a `[locale]` route — a
test, code that runs before the route matched — use
`locales.run(locale, fn)`; and when nothing names a locale, messages render
in the default.

The server keeps the locale in `AsyncLocalStorage`, reached through
`process.getBuiltinModule`. A runtime without them throws from
`paramsSchema` and from `run`, rather than accepting a locale and rendering
the page in the default.

**In the browser**, the URL is the locale: the first segment of
`location.pathname`, read when a message is called. Changing locale is a
navigation to the same pathname under the other segment
(`locales.localize(locales.delocalize(pathname).pathname, 'en')`), which
re-renders the page; there is no state to keep in sync.

Under Vite's `base` (`base: '/docs/'`), the segment read is the first one
below it — `/docs/en/ui` is in `en` — as the route table's `[locale]` sits
below it too. `localize` and `delocalize` work on pathnames in the table's
terms, which is what `usePathname` returns; the one you navigate to gets the
base back from `@k8ordo/router`'s `withBase`.

A first segment that is not one of the set's locales is no locale, and the
default applies; before the set has been defined in that environment, a
segment no message has text for is read the same way, so a 404 page never
throws on `/fr/…`.

`locales.getLocale()` reads the same source for code that needs the tag
itself: `<html lang>`, a language switcher, an `Intl` API the set does not
draw.

### The `/` page

`/` is the one URL without a locale. Render nothing there and redirect from
an effect — through the bound `navigateTo` where the router is
`@k8ordo/router` (below), or `locales.localize` otherwise:

```tsx
'use client';
useEffect(() => {
  navigateTo(
    '/:locale',
    { locale: locales.negotiate(navigator.languages) },
    { history: 'replace' },
  );
}, []);
```

Under `@k8ordo/server` a page can make the same decision from the request —
`locales.negotiateRequest(request, { cookie: 'locale' })` — but cannot answer
with a redirect: a page never writes to the response, and
`redirect.ts` fills its target from the params, not the headers. `serve` has
no hook for it either, so a server-side redirect sits outside the app: a proxy
in front of `serve`, or a host of your own around the built handler
(`dist/rsc/index.js`), answers `/` with a `307`.

### `<html lang>` and `dir`

The root layout sits above `[locale]` and receives `pathname`. On a page the
schema has already run for that page, so `locales.getLocale()` is right, and
`locales.delocalize(pathname).locale ?? locales.default` says the same thing
in terms of the URL alone. On a 404 they agree too: the schema runs over the
catch-all's params, so `getLocale()` is the URL's locale where it names one
and the default where it does not, as `delocalize` reads it.

```tsx
const locale = locales.delocalize(pathname).locale ?? locales.default;

<html dir={locales.definitions[locale].dir} lang={locale}>
```

## Static builds

`@k8ordo/static` asks for the pathnames of every pattern with a parameter.
The set answers for its own segment:

```ts
framework({ paths: locales.paths });
```

`/:locale` in every pattern becomes one pathname per locale. A pattern with
another parameter comes back still holding it (`/ja/blog/:slug`), which the
build does not render: it stops with `static build needs pathnames for
/:locale/blog/:slug`. A site with a second parameter expands the rest in the
same function: `paths: (patterns) =>
locales.paths(patterns).flatMap(expandSlug)`.

Each path is rendered as its own request, so the schema names the locale
for each and the messages come out in that locale; the build renders several
at once, and none lends its locale to another. The `404.html` a static host
serves for everything else is rendered once, by the catch-all under the
build's sentinel segment, which the schema refuses — so it is in the default
locale whatever the build rendered before it, and cannot follow the
visitor's. The browser does not hydrate it: it was rendered for another URL,
and a message read while hydrating would disagree with the text written
there. It renders the file afresh where the visitor is instead, so its client
components come out in their locale once the script runs, and a visitor
without JavaScript keeps the default.

## Alongside the rest of k8ordo

- **`@k8ordo/router`**: the locale is a param of every pattern
  (`/:locale/products/:id`), and the router's `bindParams` supplies it from
  this package once, so links stay typed against the table and never spell
  the locale:

  ```ts
  // links.ts
  export const { href, navigateTo } = bindParams(() => ({
    locale: locales.getLocale(),
  }));
  ```

  `href('/:locale/products/:id', { id })` then reads the current locale;
  `navigateTo('/:locale', { locale: 'en' }, { history: 'replace' })`
  overrides it. Neither package imports the other: the line above is the
  application's. `localize` / `delocalize` remain for a pathname in hand —
  the language switcher, which takes the page it is on to another locale.

- **`@k8ordo/ui`**: its built-in strings read `currentLocale()` from this
  package — the locale messages render in, or `null` (English there) when no
  set is defined in that environment — so they follow the app's locale with
  nothing passed. `ja` and `en` ship with it; another locale is registered
  next to the set with `registerMessages` from `@k8ordo/ui/i18n`. The module
  that defines the set has to be loaded in the browser too, or the components
  there speak English.
- **`@k8ordo/form`**: constraint messages are messages, and a message called
  where the constraint is declared keeps the text of whatever locale was
  current then. Hand zod the message instead, so it is called when zod
  reports the issue — and a `defineForm` rule the same way, which calls it
  when the rule is reported:

  ```ts
  export const talkForm = defineForm(
    z.object({
      title: z
        .string()
        .min(1, { error: m.talk.titleRequired })
        .max(120, { error: () => m.talk.titleTooLong(120) }),
      status: z.enum(['draft', 'rejected']),
      reason: z.string(),
    }),
    [requiredWhen('reason', 'status', 'rejected', m.talk.reasonRequired)],
  );
  ```

  The definition stays at module scope; what has to happen per request is
  calling it. Call `formFields` during the page's render, not at module
  scope. A Server Action runs outside the `[locale]` render, so the page
  binds the locale to it (`createTalk.bind(null, locales.getLocale())`), and
  the action checks it with `locales.is` and calls `parseForm` inside
  `locales.run`.

## What it guarantees

- A locale outside the list never reaches a page: the schema refuses it.
- A message missing a locale does not compile once `Register` is merged.
  From JavaScript, or through `as`, it throws where it is read, naming the
  locale and the variants present — never `undefined`.
- Arguments to a function message are typed by the function.
- A page under `[locale]` never renders in a locale its URL does not spell:
  on the server its schema accepted that locale, and in the browser the URL
  is what is read. A locale accepted for one page reaches no other page, no
  404, and nothing rendered after it; a 404 is in the locale its own URL
  names, or the default.
- On a server runtime without `AsyncLocalStorage`, accepting a locale throws
  rather than rendering in the default.
- A date written through `dateTimeFormat` is in its locale's time zone on the
  server and in every browser; the type refuses any other.

## Testing

Under Node, `locales.run('en', () => nav.home())` renders in `en`; without
it, the default. Called directly, `paramsSchema` sets the locale for the
rest of the caller's async context — the framework gives each pattern's
schemas a context of their own, a test does not — so wrap a test that
validates in `run` to keep tests apart. A test that calls `defineLocales`
itself replaces the set messages read: the last one defined wins. In a
browser environment, `history.replaceState(null, '', '/en/…')` is the locale
and `run` throws; an environment that defines `document`, such as jsdom or
happy-dom, counts as one.
