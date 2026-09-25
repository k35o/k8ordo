# Agent guide — apps/docs

Documentation site for the `@k8ordo/*` packages (`ui`, `form`, `state`,
`router`, `static`, `server`, `i18n`, `color-scheme`), built with
`@k8ordo/static` — the site runs on the family's own framework, so a change to
it is felt here first. The `framework-engine` is internal and has no page: an
application installs a mode package, never the engine. The site also dogfoods
`@k8ordo/state`, `@k8ordo/form`, `@k8ordo/i18n`, and `@k8ordo/color-scheme`:
the writing-mode preference is a `defineLocalState` (`src/theme/state.ts`),
the colour scheme is `@k8ordo/color-scheme`'s (`<ColorSchemeProvider>` in
the root layout's `<body>`, `useColorScheme()` in the header's switcher),
`/state`'s live demo is a real `definePageState` on the page's own URL,
`/form`'s live demo is a GET filter form whose constraints and URL state come
from one schema (`src/routes/[locale]/form/_parts/`), and every word on the
site is a `message()` under `src/messages/` — the locale set in `src/i18n.ts`
is what the `[locale]` layout's `paramsSchema`, the root layout's `<html
lang>`, `vite.config.ts`'s path expansion, the `/` redirect, and every
message's type all read.

## Commands

```bash
pnpm dev               # Start dev server
pnpm build             # Production build
pnpm typecheck         # Type check
pnpm check             # Oxlint/Oxfmt lint/format check
pnpm check:write       # Oxlint/Oxfmt lint/format auto-fix
```

## Architecture

- **Routing**: file-based. `src/routes/` _is_ the URL space (`@k8ordo/static`),
  and `.k8ordo/` holds the generated route table and type wiring — generated,
  git-ignored, and readable. Everything sits under `[locale]`, so every pattern
  needs pathnames at build time; `vite.config.ts` passes `paths: locales.paths`,
  which expands every `/:locale` pattern the build hands it once per locale
  rather than listing pages twice.
- **Nothing here works around the framework.** Scroll-to-top after a
  navigation, the error boundary around a page, and "is a page under
  `/ui/components/*` showing" are all the router's and the framework's job
  now (`useMatch`, `error.tsx`, the router's own scroll handling). When the
  site needs something the packages do not give it, the fix belongs in the
  package, and the site is where the pressure is felt first.
- **Navigation mirrors the URL layout**: the header's first row is the packages and nothing else; the second row is the sections of the package you are currently in (`src/components/navigation.tsx`). Both rows, the footer, the home page's package list, every `PackageLanding`'s "start here" links and every guide page's title and prev/next pager read one list, `PACKAGES` in `src/data/packages.ts` — a package's `sections` are in reading order, so adding a page to a package's guide is one line there plus the route. The side navigation on catalog pages is decided by `useMatch('/:locale/ui/components/*')` and its sibling for `/ui/ai/*` in `src/routes/[locale]/_parts/locale-shell.tsx` — a pattern from the generated table plus `/*`, checked by the generated `Register`, so a renamed section fails to compile rather than silently losing its sidebar. `/*` does not match the index page itself (`/ja/ui/components` has no trailing segment), which is what keeps the catalog pages sidebar-free. The footer is the same rule in columns — one column per package, headed by the package name (its landing) with its sections below. Never promote one package's sections to a site-wide row: with a single package it reads as convenience, with six it makes that package look like the site's spine.
- **URL layout**: package-first. Everything a package documents lives under `/<package>/…` — `@k8ordo/ui` owns `/ui/get-started`, `/ui/components/*`, `/ui/ai/*`, and so on. `/<package>` itself is that package's landing page (`src/routes/[locale]/ui/page.tsx`): what it is, what it gives you, where to start. Only `/` is shared — it introduces k8ordo, lists the packages, and states what they all commit to. Add a new package by adding its own `/<package>` landing plus a `/<package>/…` subtree starting at `/<package>/get-started`, and an entry in `PACKAGES` (`src/data/packages.ts`); never put a package's sections at the top level, where they would sit at the same depth as package names.
- **Unmatched routes**: `src/routes/[locale]/not-found.tsx` is rendered into a
  single `404.html`, which a static host serves for anything it does not have.
  One file for every locale, so the `:locale` it was rendered with is the build's
  sentinel, not a language — and the schema above `not-found.tsx` refuses it
  (a catch-all still answers; it only renders in no locale). Every message in
  the file therefore renders in `locales.default`, so it is Japanese as
  served, whichever `/en/…` pages the build rendered alongside it. The browser
  does not hydrate it — the framework renders a document drawn for another
  URL afresh — so client components read the visitor's URL from their first
  render: the messages, and the shell, which takes the locale from `usePathname`
  when its param is the sentinel, falling back to `locales.default` only when
  the URL has none either. The file becomes English the moment it renders on
  an `/en/…` URL. A visitor with JavaScript off keeps the Japanese one; one
  file cannot be both. Under the dev server (and `@k8ordo/server`) a 404 is
  rendered at the visitor's URL, where the schema accepts `en`, so it is
  English from the server's HTML on.
- **An unknown locale is a 404.** `src/routes/[locale]/layout.tsx` exports
  `const { paramsSchema } = locales` — the generator parses the file for the
  export, so any spelling of it counts — so `/fr/ui` is a
  pathname the `/:locale/…` patterns do not answer: the walk falls through to
  `not-found.tsx` under a real 404, under `@k8ordo/server` as much as on the
  static host (where `404.html` was already what got served). The layout
  still receives `params.locale` as a string — a layout's params are never
  typed by its schema, because `not-found.tsx` renders under it whether or not
  the schema accepted —
  and `locales.paths` only ever expands the listed locales, so the build never asks
  for a pathname the schema would refuse. The schema lives in a Server
  Component on purpose: a value exported from a `'use client'` module reaches
  the RSC side as a client reference, not a schema, which is why the layout
  is split into `layout.tsx` (schema, Server Component) and
  `_parts/locale-shell.tsx` (providers, header, hooks — the client part).
  Accepting the locale there is also what makes it the locale of that
  render for every message, on the server side.
- **Errors**: `src/routes/[locale]/error.tsx` renders `ErrorFallback` in the
  layout's hole when a page throws, and `src/routes/error.tsx` is the
  full-screen last resort when the locale shell itself does. Both are client
  components receiving `{ error, reset }` and no params; their messages read
  the locale from the URL themselves. There is no
  `react-error-boundary` and no `<ErrorBoundary>` in the layout.
- **Titles**: every `page.tsx` renders its own `<title>` through
  `src/components/page-title.tsx` (`<PageTitle name="Button" />` or
  `<PageTitle title={m.nav.theming} />` → `Button · k8ordo`); `PackageLanding` does it
  for the landings and `DocPage` for guide pages (`Links & location — @k8ordo/router · k8ordo`), `not-found.tsx` renders its own, and the home page and the
  `/` redirect page write a bare `<title>k8ordo</title>`. The root layout
  renders none — React 19 hoists a `<title>` from anywhere, and two on screen
  is two, not a fallback. A new page without one is a regression:
  `grep -L "PageTitle\|PackageLanding\|DocPage\|<title" src/routes/**/page.tsx` should
  print nothing (the built HTML is the proof: every `index.html` under
  `dist/client/` carries exactly one `<title>`).
- **Sitemap**: `framework({ site: 'https://ordo.k8o.me' })` in
  `vite.config.ts` makes the build write `dist/client/sitemap.xml` listing
  every page it rendered. Nothing here maintains a page list by hand.
- **The colour scheme is `@k8ordo/color-scheme`'s.** The root layout wraps
  everything inside `<body>` in `<ColorSchemeProvider>`, which renders the
  pre-paint inline script itself, and `src/components/theme-switcher.tsx`
  calls `useColorScheme()`; there is no theme context and no hand-written
  inline script here. The writing-mode
  preference stays the site's own `defineLocalState` in `src/theme/state.ts`
  (`writing-mode`, `mode?: 'horizontal' | 'vertical'`), a directive-free
  module so a Server Component could read it. The `@k8ordo/ui` storage hooks
  (`useLocalStorage`, `useSessionStorage`, `useHash`) no longer exist, so
  neither do their pages.
- **i18n**: `@k8ordo/i18n`. `src/i18n.ts` is `defineLocales({ ja: …, en: … })`
  — the one place the list is spelled, with each locale's `timeZone`
  (`Asia/Tokyo`, `UTC`) and `dir` — plus the `Register` augmentation
  that types every message against it, and `getLocale`. Messages live in
  `src/messages/<area>.ts`, one `message({ ja, en })` per export (a 3-level
  key became a group object: `m.components.button.description`), re-exported
  as namespaces from `src/messages/index.ts` so a call site reads
  `m.nav.home()`. The same call works in a Server Component and in a
  `'use client'` component; there is no provider, no hook, no `t`, and no
  key type — a prop that carries text carries a `Message` (a function) and
  the consumer calls it (`item.label()`), or, where a Server Component hands
  text to a Client Component, the string (`title={m.x.y()}`): a function
  does not cross that boundary, which is why `PageTitle` and
  `PackageLanding` are shared components without a directive. `<Rich>` takes
  the text as children and renders its backtick spans as `<Code>`. The
  bundler keeps only the messages a client module names — measure it with
  `grep -c "ja:" dist/client/assets/*.js` after a build; a Server Component's
  text never reaches the client. Every link is `href` / `navigateTo` from
  `src/links.ts` — the router's `bindParams` with the locale supplied by
  `locales.getLocale()` — so a path is a `/:locale/…` pattern of the
  generated table (`SitePath` for the ones navigation data may name) and a
  typo fails to compile. `locales.localize` remains only for the language
  switcher, which takes the pathname in hand to another locale;
  `delocalize` also reads the locale off the URL where no accepted param
  is in hand — the root layout's `<html lang>` and the 404 shell. The `/` page negotiates with
  `locales.negotiate(navigator.languages)` and `navigateTo('/:locale', …)`; `switch` is a reserved word, so
  that one component's group is `switchInput`.
- **Styling**: Tailwind CSS 4, uses `@k8ordo/ui` design tokens
- **Root provider**: `UIProvider` wraps each locale subtree in
  `src/routes/[locale]/_parts/locale-shell.tsx`, passing `dictionaries[locale]`
  from `@k8ordo/ui/i18n` as `messages`, so component built-in strings follow
  the site locale
- **Where the browser is**: `usePathname()` from `@k8ordo/router`. Under the
  framework the browser holds no route table, so `useRoute` / `useParams` have
  no match to read — a page receives `params` as a prop, and anything else asks
  the platform.

### Directory Structure

```
src/
  routes/              # the URL space, and nothing else
    layout.tsx         # <html>/<head>/<body> — the document itself, no <title>
    error.tsx          # the shell itself threw: full-screen ErrorFallback
    page.tsx           # / — detects the locale and redirects
    [locale]/
      layout.tsx       # paramsSchema (locale) — a Server Component
      _parts/locale-shell.tsx  # providers, header, sidebar, footer (client)
      error.tsx        # a page threw: ErrorFallback inside the shell
      page.tsx         # /:locale
      not-found.tsx    # /:locale/* — becomes 404.html
      form/_parts/     # the /form GET-form demo: state definition + form
      <package>/<section>/page.tsx  # a guide page: <DocPage> + <DocSection>s
      <package>/<section>/_parts/   # that page's live demo, if it has one
      ui/components/<name>/page.tsx
      ui/components/_previews/      # `_` never appears in a URL
  constants.ts         # Shared constants (e.g. STORYBOOK_URL)
  components/          # Shared doc components (CodeBlock, PropsTable, etc.)
    framework-guide/   # topics @k8ordo/static and @k8ordo/server share, rendered per mode
  data/                # PACKAGES (packages.ts), the sidebars (components-nav, ai-nav), generated props (component-props)
  i18n.ts              # defineLocales + Register — the locale set
  links.ts             # href / navigateTo with the locale bound; SitePath
  messages/            # message() per export, one file per area, index.ts re-exports namespaces
  styles/              # CSS entry
  theme/               # state.ts (writing-mode defineLocalState) + its context
```

## Page Patterns

### Component Documentation Page

Each component is a directory under `src/routes/[locale]/ui/components/`
whose `page.tsx` default-exports the page, following this structure:

1. **Title**: `<PageTitle name="Button" />` as the first child (see Titles above)
2. **Header**: `Heading` + description via `<Rich>{m.components.x.description()}</Rich>` + Storybook link
3. **Import section**: `CodeBlock` showing import statement
4. **Usage section**: Multiple `ComponentPreview` blocks demonstrating variants, sizes, states, etc.
5. **Props table**: `<PropsTable items={propsOf('Button')} inherits={inheritsOf('Button')} />` — read from the generated `@k8ordo/ui/props.json` through `src/data/component-props.ts`, never written by hand

```tsx
export default function ButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Button" />
      {/* Header */}
      {/* Import */}
      {/* Usage examples with ComponentPreview */}
      {/* Props table */}
    </div>
  );
}
```

### Package Guide Page

Every package other than `@k8ordo/ui` documents itself as a guide: a
`get-started` page, then topic pages, each a directory under
`src/routes/[locale]/<package>/` listed in that package's `sections` in
`PACKAGES`. The page is a Server Component:

```tsx
export default function RouterLinksPage() {
  return (
    <DocPage
      introduction={m.routerLinks.introduction}
      path="/:locale/router/links"
    >
      <DocSection
        title={m.routerLinks.hrefTitle}
        description={m.routerLinks.hrefDescription}
      >
        <CodeBlock code={HREF_EXAMPLE} lang="tsx" />
      </DocSection>
    </DocPage>
  );
}
```

- `DocPage` takes its title from the section's label in `PACKAGES`, so the
  header, footer, pager and `<title>` cannot disagree; it renders the
  prev/next pager itself.
- Its words live in `src/messages/<package>-<section>.ts` (namespace
  `m.<package><Section>`), with `introduction` as the page's lead.
- Code samples carry no natural-language comments — both locales see the same
  sample — apart from a leading file-path comment; the explanation belongs in
  the messages around it.
- A live demo is a `'use client'` component in the page's own `_parts/`, and
  only where touching it teaches something the prose cannot.
- `@k8ordo/static` and `@k8ordo/server` share their routing, params, errors,
  and boundaries topics: the words are `src/messages/framework-<topic>.ts`,
  the markup `src/components/framework-guide/<topic>.tsx` taking
  `mode: 'static' | 'server'`, and each mode's page adds only what is its own.

### Preview Components

Complex interactive previews live in the sibling `_previews/<name>-previews.tsx`
and are imported by the page. A `_`-prefixed directory is invisible to the route
grammar, which is why previews can live inside `routes/` at all.

## Shared Doc Components

| Component          | Purpose                              |
| ------------------ | ------------------------------------ |
| `PageTitle`        | The page's `<title>` (`… · k8ordo`)  |
| `PackageLanding`   | A package's `/<package>` landing     |
| `PackageExample`   | A landing's worked example           |
| `DocPage`          | A package guide page, with its pager |
| `DocSection`       | A guide page's h2 section            |
| `CodeBlock`        | Syntax-highlighted code with Shiki   |
| `ComponentPreview` | Live preview + code block combo      |
| `PropsTable`       | Props documentation table            |
| `Rich`             | Text with backtick spans as `<Code>` |
| `InstallTabs`      | Package manager install command tabs |
| `TokenCard`        | Design token display card            |

## The framework it runs on

`@k8ordo/static` and `@k8ordo/router` live in this repository
([packages/static](../../packages/static), [packages/router](../../packages/router)),
as do `@k8ordo/state`, `@k8ordo/form`, `@k8ordo/i18n` and
`@k8ordo/color-scheme`, which the site's demos, its words and its own
preferences run on. Their guides are `docs/GUIDE.md` in each package. Being the framework's own
first application is the point: what the site needs is the pressure the
framework is designed against.

## Key Dependencies

- **@k8ordo/static** + **@k8ordo/router** (workspace) for the framework itself
- **@k8ordo/ui** (workspace) for UI components
- **@k8ordo/state** + **@k8ordo/form** (workspace) for the preferences and the live demos
- **@k8ordo/i18n** + **@k8ordo/color-scheme** (workspace) for every message and the colour scheme
- **shiki** for syntax highlighting
