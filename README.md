# k8ordo

React libraries that use Baseline features without holding back.

Every package here commits to the same four things:

- **Baseline only, from the day it lands.** A feature is fair game the moment it reaches [Baseline](https://web.dev/baseline) **newly available** — shipped in all four core browsers — rather than 30 months later at widely available. No polyfills, no fallbacks, no legacy branches. Built out of the newest features, it needs the newest browsers — it does not drop old ones, it never ran on them.
- **Always on the latest React.** React 19 and Server Components are assumed, and each new idiom is adopted as it lands. No compatibility path is kept around, so there is only ever one way to write it.
- **TypeScript safe.** Types are not there to check what you wrote after the fact — they are there to make the mistake unwritable. Docs and generated artifacts are derived from the types, so they cannot drift from the implementation.
- **Readable by agents.** Every package ships its own documentation inside its npm package, so an agent reads the exact version you installed — nothing to copy, nothing to re-sync, no version drift.

## Members

| Package | What it is |
| --- | --- |
| [`@k8ordo/ui`](packages/ui) | React UI components with semantic design tokens, i18n, and generative-UI adapters |
| [`@k8ordo/form`](packages/form) | HTML constraint attributes, messages, and server-side validation from one zod schema |
| [`@k8ordo/state`](packages/state) | State declared by where it lives — URL, history entry, localStorage, memory — from one zod schema |
| [`@k8ordo/router`](packages/router) | The URL's pathname axis: one route table, typed paths, over the Navigation API |
| [`@k8ordo/static`](packages/static) | Builds an application into files — every route rendered ahead of time |
| [`@k8ordo/server`](packages/server) | Runs an application — RSC per request, with Server Actions |

`@k8ordo/*` holds **primary libraries only** — the ones an application imports
and builds on. Tools that plug into someone else's ecosystem (lint configs,
bundler plugins, Storybook addons) do not go here and live in their own
repositories.

## Documentation

- [ordo.k8o.me](https://ordo.k8o.me) — the documentation site
- [Storybook](https://main--687a213c85e2e4589d8db1bb.chromatic.com) — every `@k8ordo/ui` story
- [`packages/ui/README.md`](packages/ui/README.md) — installation, API, and generative-UI integrations

The design guide and component reference also ship inside the published npm
package, so an AI coding assistant reads the version you actually installed.
See [AI Agent Documentation](packages/ui/README.md#ai-agent-documentation).

## Development

A pnpm workspace driven by [Vite+](https://vite.plus) (`vp`) — dev, build,
test, and lint/format all run through it.

Tool versions are pinned in [`mise.toml`](mise.toml): Node.js 24.16.0 and pnpm
11.15.1. Any Node.js ≥ 24.13.0 works if you do not use mise.

```bash
mise install
pnpm install
pnpm build
```

```
apps/
  docs/                  # ordo.k8o.me (@k8ordo/static でビルドしている)
packages/
  ui/                    # @k8ordo/ui
  form/                  # @k8ordo/form
  state/                 # @k8ordo/state
  router/                # @k8ordo/router
  framework-engine/      # @k8ordo/framework-engine (internal)
  static/                # @k8ordo/static
  server/                # @k8ordo/server
examples/
  ui-integrations/       # @k8ordo/ui × generative UI adapters (Vite)
  ui-nextjs/             # @k8ordo/ui × Next.js
  ui-css-modules/        # @k8ordo/ui with prebuilt CSS, no Tailwind
  static-basic/          # @k8ordo/static
  server-basic/          # @k8ordo/server
```

Each example belongs to exactly one package and is named for it. An example that
covers several packages at once cannot tell you which package broke the build,
and it drags one package's dependencies onto everyone.

| Command | |
| --- | --- |
| `pnpm build` | Build every package and app |
| `pnpm test` | Run every test |
| `pnpm typecheck` | Type check every workspace |
| `pnpm check` | Lint and format check (`check:write` to auto-fix) |
| `pnpm check:no-polyfills` | Fail if a polyfill dependency has crept in |
| `pnpm change` | Record a release intent for the changed packages |

Run `pnpm build` before `pnpm check` or `pnpm typecheck` on a fresh checkout:
the docs site and examples resolve `@k8ordo/ui` types from `dist/`.

## Adding a package

The intake steps — where the package goes, who owns which example, how the docs
site is laid out, what CI picks up automatically, and why a brand-new package
name cannot use OIDC on its first publish — are in [`CLAUDE.md`](CLAUDE.md).

## Contributing

[`CONTRIBUTING.md`](CONTRIBUTING.md) covers the component workflow, testing,
visual regression testing, and the release process.

## License

MIT — see [LICENSE](LICENSE).

## Author

**k8o** ([GitHub](https://github.com/k35o))
