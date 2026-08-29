# k8ordo

A family of React libraries that assume the platform you already have.

k8ordo takes React 19 and Server Components as given, uses anything that has
reached [Baseline](https://web.dev/baseline), and ships no polyfills, no
fallbacks, and no legacy branches. Nothing here is a compatibility layer for a
browser or a framework you are not using.

## Members

| Package | What it is |
| --- | --- |
| [`@k8ordo/ui`](packages/ui) | React UI components with semantic design tokens, i18n, and generative-UI adapters |

`@k8ordo/*` holds **primary libraries only** — the ones an application imports
and builds on. Tools that plug into someone else's ecosystem (lint configs,
bundler plugins, Storybook addons) are not members and live in their own
repositories.

## Documentation

- [ordo.k8o.me](https://ordo.k8o.me) — the family's documentation site
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
  docs/                  # ordo.k8o.me (Vite + @funstack/router)
packages/
  ui/                    # @k8ordo/ui
examples/
  ui-integrations/       # @k8ordo/ui × generative UI adapters (Vite)
  ui-nextjs/             # @k8ordo/ui × Next.js
  ui-css-modules/        # @k8ordo/ui with prebuilt CSS, no Tailwind
```

Each example belongs to exactly one member and is named for it. An example that
covers several members at once cannot tell you which package broke the build,
and it drags one member's dependencies onto everyone.

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

## Adding a member

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
