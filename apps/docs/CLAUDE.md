# Agent guide — apps/docs

Documentation site for the `@k8ordo/*` packages (`ui`, `form`, `state`,
`router`, `static`, `server`, `i18n`), built with `@k8ordo/static` — the site
runs on the family's own framework, so a change to it is felt here first. The
`framework-engine` is internal and has no page: an application installs a mode
package, never the engine. The site also dogfoods
`@k8ordo/state`, `@k8ordo/form`, and `@k8ordo/i18n`: the theme and
writing-mode preferences are `defineLocalState`s (`src/theme/state.ts`),
`/state`'s live demo is a real `definePageState` on the page's own URL,
`/form`'s live demo is a GET filter form whose constraints and URL state come
from one schema (`src/routes/[locale]/form/_parts/`), and every word on the
site comes from the `defineDictionary` in `src/i18n/` — the locale set there
is what the `[locale]` layout's `paramsSchema`, the root layout's `<html
lang>`, `vite.config.ts`'s path expansion, and the `/` redirect all read.

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
  needs pathnames at build time; `vite.config.ts` expands the patterns the build
  hands it across `LOCALES` rather than listing pages twice.
- **Nothing here works around the framework.** Scroll-to-top after a
  navigation, the error boundary around a page, and "is a page under
  `/ui/components/*` showing" are all the router's and the framework's job
  now (`useMatch`, `error.tsx`, the router's own scroll handling). When the
  site needs something the packages do not give it, the fix belongs in the
  package, and the site is where the pressure is felt first.
- **Navigation mirrors the URL layout**: the header's first row is the packages and nothing else; the second row is the sections of the package you are currently in, so it is absent everywhere except under `/ui` (`src/components/navigation.tsx`). The side navigation on catalog pages is decided by `useMatch('/:locale/ui/components/*')` and its three siblings in `src/routes/[locale]/_parts/locale-shell.tsx` — a pattern from the generated table plus `/*`, checked by the generated `Register`, so a renamed section fails to compile rather than silently losing its sidebar. `/*` does not match the index page itself (`/ja/ui/components` has no trailing segment), which is what keeps the catalog pages sidebar-free. The footer is the same rule in columns — one `Packages` column, then a column per package that has sections. Never promote one package's sections to a site-wide row: with a single package it reads as convenience, with six it makes that package look like the site's spine.
- **URL layout**: package-first. Everything a package documents lives under `/<package>/…` — `@k8ordo/ui` owns `/ui/get-started`, `/ui/components/*`, `/ui/hooks/*`, and so on. `/<package>` itself is that package's landing page (`src/routes/[locale]/ui/page.tsx`): what it is, what it gives you, where to start. Only `/` is shared — it introduces k8ordo, lists the packages, and states what they all commit to. Add a new package by adding its own `/<package>` landing plus a `/<package>/…` subtree, and a row in `PACKAGES` on the home page; never put a package's sections at the top level, where they would sit at the same depth as package names.
- **Unmatched routes**: `src/routes/[locale]/not-found.tsx` is rendered into a
  single `404.html`, which a static host serves for anything it does not have.
  One file for every locale, so the `:locale` it was rendered with is the build's
  sentinel, not a language. The layout therefore takes the locale from the URL
  the visitor is actually on (`usePathname`), falling back to `DEFAULT_LOCALE`
  only when that has none either — which is why the file is Japanese as served
  and becomes English the moment it hydrates on an `/en/…` URL. A visitor with
  JavaScript off keeps the Japanese one; one file cannot be both.
- **An unknown locale is a 404.** `src/routes/[locale]/layout.tsx` exports
  `paramsSchema = z.object({ locale: z.enum(LOCALES) })`, so `/fr/ui` is a
  pathname the `/:locale/…` patterns do not answer: the walk falls through to
  `not-found.tsx` under a real 404, under `@k8ordo/server` as much as on the
  static host (where `404.html` was already what got served). The layout
  still receives `params.locale` as a string — a layout's params are never
  typed by its schema, because under `not-found.tsx` nothing is validated —
  and `vite.config.ts` only ever expands `LOCALES`, so the build never asks
  for a pathname the schema would refuse. The schema lives in a Server
  Component on purpose: a value exported from a `'use client'` module reaches
  the RSC side as a client reference, not a schema, which is why the layout
  is split into `layout.tsx` (schema, Server Component) and
  `_parts/locale-shell.tsx` (providers, header, hooks — the client part).
- **Errors**: `src/routes/[locale]/error.tsx` renders `ErrorFallback` in the
  layout's hole when a page throws, and `src/routes/error.tsx` is the
  full-screen last resort when the locale shell itself does. Both are client
  components receiving `{ error, reset }` and no params, so they read the
  locale from `usePathname()` the way the 404 does. There is no
  `react-error-boundary` and no `<ErrorBoundary>` in the layout.
- **Titles**: every `page.tsx` renders its own `<title>` through
  `src/components/page-title.tsx` (`<PageTitle name="Button" />` or
  `<PageTitle k="nav.hooks" />` → `Button · k8ordo`); `PackageLanding` does it
  for the landings, `not-found.tsx` renders its own, and the home page and the
  `/` redirect page write a bare `<title>k8ordo</title>`. The root layout
  renders none — React 19 hoists a `<title>` from anywhere, and two on screen
  is two, not a fallback. A new page without one is a regression:
  `grep -L "PageTitle\|PackageLanding\|<title" src/routes/**/page.tsx` should
  print nothing (the built HTML is the proof: every `index.html` under
  `dist/client/` carries exactly one `<title>`).
- **Sitemap**: `framework({ site: 'https://ordo.k8o.me' })` in
  `vite.config.ts` makes the build write `dist/client/sitemap.xml` listing
  every page it rendered. Nothing here maintains a page list by hand.
- **Preferences live in `@k8ordo/state`**: `src/theme/state.ts` holds
  `themeState` (`theme`, `mode?: 'light' | 'dark'`) and `writingModeState`
  (`writing-mode`, `mode?: 'horizontal' | 'vertical'`), both
  `defineLocalState`. It is a directive-free module because
  `src/routes/layout.tsx` (a Server Component) needs `themeState.inlineRead()`
  for the pre-hydration `<script>` that adds the `dark` class — the storage
  key and the JSON envelope are never spelled out by hand. The `@k8ordo/ui`
  storage hooks (`useLocalStorage`, `useSessionStorage`, `useHash`) no longer
  exist, so neither do their pages.
- **i18n**: `@k8ordo/i18n`. `src/i18n/locales.ts` is `defineLocales(['ja',
'en'])` — the one place the list is spelled — and `src/i18n/dictionary.ts`
  is `defineDictionary(locales, { ja, en })`; `messages/ja.ts` sets the
  shape and `messages/en.ts` is `Translations<typeof ja>`, so a key added to
  one fails to compile until the other has it (there is no separate key
  list). `src/i18n/client.ts` binds the hooks to this one dictionary so call
  sites write `useTranslation()`. `MessageKey` is `TextKeyOf` — the keys
  `t()` takes with no arguments — which is what `<T k>` and the `labelKey`s
  in `data/` accept; a function message (`i18n.demoGreeting`) is called with
  its literal key. Locale-prefixed routing (`/ja/`, `/en/`) is
  `locales.localize` / `locales.delocalize`; the `/` page negotiates with
  `locales.negotiate(navigator.languages)`.
- **Styling**: Tailwind CSS 4, uses `@k8ordo/ui` design tokens
- **Root provider**: `UIProvider` wraps each locale subtree in
  `src/routes/[locale]/_parts/locale-shell.tsx`, passing the `en` dictionary on `/en/` so
  component built-in strings follow the site locale
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
      ui/components/<name>/page.tsx
      ui/components/_previews/      # `_` never appears in a URL
  constants.ts         # Shared constants (e.g. STORYBOOK_URL)
  components/          # Shared doc components (CodeBlock, PropsTable, etc.)
  data/                # Navigation data (components-nav, helpers-nav, hooks-nav)
  i18n/                # @k8ordo/i18n wiring (locales, dictionary, client hooks, messages)
  styles/              # CSS entry
  theme/               # state.ts (defineLocalState), theme + writing-mode contexts
```

## Page Patterns

### Component Documentation Page

Each component/helper/hook is a directory under `src/routes/[locale]/ui/…`
whose `page.tsx` default-exports the page, following this structure:

1. **Title**: `<PageTitle name="Button" />` as the first child (see Titles above)
2. **Header**: `Heading` + description via `<T>` i18n component + Storybook link
3. **Import section**: `CodeBlock` showing import statement
4. **Usage section**: Multiple `ComponentPreview` blocks demonstrating variants, sizes, states, etc.
5. **Props table**: `PropsTable` with `PropItem[]` array

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

### Preview Components

Complex interactive previews live in the sibling `_previews/<name>-previews.tsx`
and are imported by the page. A `_`-prefixed directory is invisible to the route
grammar, which is why previews can live inside `routes/` at all.

## Shared Doc Components

| Component          | Purpose                              |
| ------------------ | ------------------------------------ |
| `PageTitle`        | The page's `<title>` (`… · k8ordo`)  |
| `PackageLanding`   | A package's `/<package>` landing     |
| `CodeBlock`        | Syntax-highlighted code with Shiki   |
| `ComponentPreview` | Live preview + code block combo      |
| `PropsTable`       | Props documentation table            |
| `T`                | i18n translation component           |
| `InstallTabs`      | Package manager install command tabs |
| `TokenCard`        | Design token display card            |

## The framework it runs on

`@k8ordo/static` and `@k8ordo/router` live in this repository
([packages/static](../../packages/static), [packages/router](../../packages/router)),
as do `@k8ordo/state` and `@k8ordo/form`, which the site's demos and its own
preferences run on. Their guides are `docs/GUIDE.md` in each package. Being the framework's own
first application is the point: what the site needs is the pressure the
framework is designed against.

## Key Dependencies

- **@k8ordo/static** + **@k8ordo/router** (workspace) for the framework itself
- **@k8ordo/ui** (workspace) for UI components
- **@k8ordo/state** + **@k8ordo/form** (workspace) for the preferences and the live demos
- **shiki** for syntax highlighting
