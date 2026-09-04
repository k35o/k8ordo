# Agent guide — apps/docs

Documentation site for the `@k8ordo/*` packages (`ui`, `form`, `state`,
`router`, `static`, `server`), built with `@k8ordo/static` — the site runs on
the family's own framework, so a change to it is felt here first. The
`framework-engine` is internal and has no page: an application installs a mode
package, never the engine. The site also dogfoods
`@k8ordo/state`: the theme preference is a `defineLocalState`
(`src/theme/context.tsx`, paired with the init script in `src/root.tsx`),
and `/state`'s live demo is a real `definePageState` on the page's own URL.

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
- **Navigation mirrors the URL layout**: the header's first row is the packages and nothing else; the second row is the sections of the package you are currently in, so it is absent everywhere except under `/ui` (`src/components/navigation.tsx`). The footer is the same rule in columns — one `Packages` column, then a column per package that has sections. Never promote one package's sections to a site-wide row: with a single package it reads as convenience, with six it makes that package look like the site's spine.
- **URL layout**: package-first. Everything a package documents lives under `/<package>/…` — `@k8ordo/ui` owns `/ui/get-started`, `/ui/components/*`, `/ui/hooks/*`, and so on. `/<package>` itself is that package's landing page (`src/pages/ui.tsx`): what it is, what it gives you, where to start. Only `/` is shared — it introduces k8ordo, lists the packages, and states what they all commit to. Add a new package by adding its own `/<package>` landing plus a `/<package>/…` subtree, and a row in `PACKAGES` on the home page; never put a package's sections at the top level, where they would sit at the same depth as package names.
- **Unmatched routes**: `src/routes/[locale]/not-found.tsx` is rendered into a
  single `404.html`, which a static host serves for anything it does not have.
  One file for every locale, so it cannot know which one it is under: the layout
  falls back to `DEFAULT_LOCALE` when `params.locale` is not a real locale (which
  is what the sentinel segment used to render it looks like).
- **i18n**: Custom i18n system in `src/i18n/` with locale-based routing (`/ja/`, `/en/`)
- **Styling**: Tailwind CSS 4, uses `@k8ordo/ui` design tokens
- **Root provider**: `UIProvider` wraps each locale subtree in
  `src/routes/[locale]/layout.tsx`, passing the `en` dictionary on `/en/` so
  component built-in strings follow the site locale
- **Where the browser is**: `usePathname()` from `@k8ordo/router`. Under the
  framework the browser holds no route table, so `useRoute` / `useParams` have
  no match to read — a page receives `params` as a prop, and anything else asks
  the platform.

### Directory Structure

```
src/
  routes/              # the URL space, and nothing else
    layout.tsx         # <html>/<head>/<body> — the document itself
    page.tsx           # / — detects the locale and redirects
    [locale]/
      layout.tsx       # providers, header, sidebar, footer
      page.tsx         # /:locale
      not-found.tsx    # /:locale/* — becomes 404.html
      ui/components/<name>/page.tsx
      ui/components/_previews/      # `_` は URL に出ない
  constants.ts         # Shared constants (e.g. STORYBOOK_URL)
  components/          # Shared doc components (CodeBlock, PropsTable, etc.)
  data/                # Navigation data (components-nav, helpers-nav, hooks-nav)
  i18n/                # i18n system (context, locales, messages, utils)
  styles/              # CSS entry
  theme/               # Theme utilities
```

## Page Patterns

### Component Documentation Page

Each component/helper/hook is a directory under `src/routes/[locale]/ui/…`
whose `page.tsx` default-exports the page, following this structure:

1. **Header**: `Heading` + description via `<T>` i18n component + Storybook link
2. **Import section**: `CodeBlock` showing import statement
3. **Usage section**: Multiple `ComponentPreview` blocks demonstrating variants, sizes, states, etc.
4. **Props table**: `PropsTable` with `PropItem[]` array

```tsx
export default function ButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
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
| `CodeBlock`        | Syntax-highlighted code with Shiki   |
| `ComponentPreview` | Live preview + code block combo      |
| `PropsTable`       | Props documentation table            |
| `T`                | i18n translation component           |
| `InstallTabs`      | Package manager install command tabs |
| `TokenCard`        | Design token display card            |

## The framework it runs on

`@k8ordo/static` and `@k8ordo/router` live in this repository
([packages/static](../../packages/static), [packages/router](../../packages/router)).
Their guides are `docs/GUIDE.md` in each package. Being the framework's own
first application is the point: what the site needs is the pressure the
framework is designed against.

## Key Dependencies

- **@k8ordo/static** + **@k8ordo/router** (workspace) for the framework itself
- **@k8ordo/ui** (workspace) for UI components
- **shiki** for syntax highlighting
- **motion** for animations
- **react-error-boundary** for error handling
