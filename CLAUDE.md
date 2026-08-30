# Agent guide — k8ordo

k8ordo is the monorepo for the `@k8ordo/*` family. Vite+ (`vp`) is the unified toolchain — dev, build, test, lint/format (Oxlint/Oxfmt) — with Tailwind CSS 4 driven by semantic design tokens. `@k8ordo/ui` is the first member; `apps/docs` documents them all.

## The family

`@k8ordo/*` holds **primary libraries only** — the ones an application imports and builds on. Tools that plug into someone else's ecosystem (lint configs, bundler plugins, Storybook addons) are not members; they live in their own repositories under `@k8o/*` or unscoped names. Being a support tool is not a lesser thing — it is a different thing, and mixing the two makes the scope meaningless.

Every member shares the same discipline:

- **React 19 and RSC are assumed.** No framework-agnostic core and no adapter layer for other frameworks — we would never use one, so building it would be an indirection nobody pays for.
- **Anything in Baseline is fair game, and nothing else is carried.** No polyfills, no fallbacks, no legacy branches. `pnpm check:no-polyfills` enforces the dependency half of this in CI; the rest is on the author, since checking Baseline usage itself (JS *and* CSS) would take a linter of its own.
- **Identifiers name what the package owns, never the family.** The scope already says `k8ordo`, so `UIProvider`, not `OrdoProvider` — the same reason TanStack ships `QueryClientProvider` and not `TanStackProvider`.

## Adding a member

1. `packages/<name>/` with its own `package.json`, `tsconfig.json`, and `vite.config.ts` (the `pack` section defines the publishable build). There is deliberately no template yet — write it once by hand; extract a template when a third member proves what is actually shared.
2. **Ship the member's own docs inside the package**: a `docs/` directory listed in `files`, so an agent reads the exact installed version out of `node_modules/@k8ordo/<name>/docs/`. The home page promises this on behalf of every member ("readable by agents"), so a member that does not ship docs makes the family's claim false. `@k8ordo/ui` is the pattern: `GUIDE.md` as the entry point, `references/*.md` behind it, and `llms.txt` as the index.
3. Examples go to `examples/<name>-<variant>/`, owned by one member. Never bolt a new member onto an existing example: a kitchen-sink example cannot tell you which package broke the build, and it drags one member's dependencies onto everyone.
4. Docs go under `/<name>/…` on the site. Only `/` is family-level. See `apps/docs/CLAUDE.md`.
5. CI picks the member up automatically for `tests` and `package` (both filter `./packages/*`). The `tokens`, `chromatic`, and `vrt` jobs stay pinned to `@k8ordo/ui` — design tokens, prop extraction, and screenshots are specific to a styled component library.
6. First publish of a brand-new package name cannot use OIDC: a trusted publisher can only be configured on a package that already exists. Publish once by hand, then register the trusted publisher (`k35o` / `k8ordo` / `release.yml`) and let CI take over.

## Documentation language

**Anything an agent reads is English. Everything else may be Japanese.**

English, because an AI coding assistant consumes it directly:

- `CLAUDE.md` / `AGENTS.md` at every level
- `packages/ui/docs/**` — shipped inside the npm package and read out of `node_modules/`
- `.claude/skills/**`
- Any string a generator writes into those files (see `packages/ui/scripts/generate-components-md.ts`)

Japanese is fine elsewhere: commit messages, PR and issue text, code comments,
tooling output meant for a developer, and the documentation site's own copy
(which is bilingual with Japanese as the default locale).

## Commands

```bash
pnpm build              # build all packages
pnpm typecheck
pnpm test
pnpm check              # lint/format check (pnpm check:write to auto-fix)
```

## Gotchas

- Run `pnpm build` before `pnpm check` / `pnpm typecheck` on a fresh checkout or worktree: docs/examples resolve `@k8ordo/ui` types from `dist/`, so without it type-aware lint reports bogus `no-unsafe-*` errors (and parallel checks can die with exit 137). CI builds in the install action.
- Use `type`, not `interface`.
- No `@ts-ignore` — use `@ts-expect-error` with an explanation.
- No skipped tests (`test.skip`, `describe.skip`).
- The pre-commit hook (`vp staged`) runs `vp check --fix` and auto-stages the fixes.

## Release

Versioning uses pnpm's built-in release management, driven in CI by [k35o/pnpm-release-action](https://github.com/k35o/pnpm-release-action). To author a change, run `pnpm change` and include the generated `.changeset/<name>.md` in the PR. Pushes to `main` either update the release PR (branch `pnpm-release/main`) or, when no intents are pending, publish to npm via OIDC trusted publishing. Config lives under the `versioning` key in `pnpm-workspace.yaml`.
