# Agent guide — apps/docs

Documentation site for `@k8ordo/ui`, built with Vite and `@funstack/router`.

## Commands

```bash
pnpm dev               # Start dev server
pnpm build             # Production build
pnpm typecheck         # Type check
pnpm check             # Oxlint/Oxfmt lint/format check
pnpm check:write       # Oxlint/Oxfmt lint/format auto-fix
```

## Architecture

- **Routing**: `@funstack/router` with `@funstack/static` for SSG
- **URL layout**: package-first. Everything a package documents lives under `/<package>/…` — `@k8ordo/ui` owns `/ui/get-started`, `/ui/components/*`, `/ui/hooks/*`, and so on. `/<package>` itself is that package's landing page (`src/pages/ui.tsx`): what it is, what it gives you, where to start. Only `/` is shared — it introduces k8ordo, lists the packages, and states what they all commit to. Add a new package by adding its own `/<package>` landing plus a `/<package>/…` subtree, and a row in `PACKAGES` on the home page; never put a package's sections at the top level, where they would sit at the same depth as package names.
- **Unmatched routes**: the wildcard `path: '/*'` at the end of the `/:locale` children renders `src/pages/not-found.tsx`. Without it an unknown path renders nothing at all — a blank body, not a 404 page.
- **i18n**: Custom i18n system in `src/i18n/` with locale-based routing (`/ja/`, `/en/`)
- **Styling**: Tailwind CSS 4, uses `@k8ordo/ui` design tokens
- **Root provider**: `UIProvider` wraps each locale subtree in `src/layouts/locale-layout.tsx`, passing the `en` dictionary on `/en/` so component built-in strings follow the site locale

### Directory Structure

```
src/
  app.tsx              # App entry with route definitions
  router.tsx           # Router wrapper with UIProvider
  constants.ts         # Shared constants (e.g. STORYBOOK_URL)
  components/          # Shared doc components (CodeBlock, PropsTable, etc.)
  data/                # Navigation data (components-nav, helpers-nav, hooks-nav)
  i18n/                # i18n system (context, locales, messages, utils)
  layouts/             # Layout components (locale-layout)
  pages/               # Documentation pages
    components/        # Component doc pages + _previews/
    helpers/           # Helper doc pages + _previews/
    hooks/             # Hook doc pages + _previews/
  styles/              # CSS entry
  theme/               # Theme utilities
```

## Page Patterns

### Component Documentation Page

Each component/helper/hook has a dedicated page file (`<name>-page.tsx`) following this structure:

1. **Header**: `Heading` + description via `<T>` i18n component + Storybook link
2. **Import section**: `CodeBlock` showing import statement
3. **Usage section**: Multiple `ComponentPreview` blocks demonstrating variants, sizes, states, etc.
4. **Props table**: `PropsTable` with `PropItem[]` array

```tsx
export function ButtonPage() {
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

Complex interactive previews live in `_previews/<name>-previews.tsx` and are imported by the page.

## Shared Doc Components

| Component          | Purpose                              |
| ------------------ | ------------------------------------ |
| `CodeBlock`        | Syntax-highlighted code with Shiki   |
| `ComponentPreview` | Live preview + code block combo      |
| `PropsTable`       | Props documentation table            |
| `T`                | i18n translation component           |
| `InstallTabs`      | Package manager install command tabs |
| `TokenCard`        | Design token display card            |

## @funstack/router

`@funstack/router` is a modern React router built on the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) (not the History API). It uses the [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) for path matching.

### Entrypoints

- `@funstack/router` — Main entrypoint. Provides `Router`, `Outlet`, hooks (`useLocation`, `useRouteParams`, etc.), and route definition utilities (`route()`, `routeState()`).
- `@funstack/router/server` — Server entrypoint for React Server Components. Provides `route()` and `routeState()` for defining routes in server modules.

### Detailed Docs

API references, examples, and best practices are available at:

```
node_modules/@funstack/router/dist/docs/index.md
```

## Key Dependencies

- **@funstack/router** + **@funstack/static** for routing and SSG
- **@k8ordo/ui** (workspace) for UI components
- **shiki** for syntax highlighting
- **motion** for animations
- **react-error-boundary** for error handling
