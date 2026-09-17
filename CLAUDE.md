# Agent guide — k8ordo

k8ordo is the monorepo for the `@k8ordo/*` packages. Vite+ (`vp`) is the unified toolchain — dev, build, test, lint/format (Oxlint/Oxfmt) — with Tailwind CSS 4 driven by semantic design tokens. `@k8ordo/ui` is the first of them; `apps/docs` documents them all.

## What goes in `@k8ordo/*`

`@k8ordo/*` holds **primary libraries only** — the ones an application imports and builds on. Tools that plug into someone else's ecosystem (lint configs, bundler plugins, Storybook addons) do not go here; they live in their own repositories under `@k8o/*` or unscoped names. Being a support tool is not a lesser thing — it is a different thing, and mixing the two makes the scope meaningless.

The family's own framework is primary, not a support tool, even though it is delivered as Vite plugins. Vite+ is assumed infrastructure here — the layer everything already stands on — so a plugin that defines what an application *is* (its route grammar, its execution boundaries, how it is built and served) is the foundation an app builds on, not an addon to someone else's ecosystem. The test is who the artifact serves: `@k8ordo/static` and `@k8ordo/server` serve k8ordo applications, and an eslint config serves eslint.

The same test admits `@k8ordo/ui`'s generative-UI adapters (`@k8ordo/ui/json-render`, `@k8ordo/ui/openui`, `@k8ordo/ui/ai-sdk`). They plug into other ecosystems, but what they serve is an application that already uses `@k8ordo/ui` and wants an LLM to compose *these* components: the catalog is a description of this library, and it would be a different, thinner thing published anywhere else. An adapter whose value would survive without `@k8ordo/ui` behind it does not belong here.

`packages/framework-engine` is the one directory here that is not a member: a private workspace package both modes bundle at pack time, never published.

Every package here shares the same discipline:

- **React 19 and RSC are assumed.** No framework-agnostic core and no adapter layer for other frameworks — we would never use one, so building it would be an indirection nobody pays for.
- **Anything at Baseline *newly available* is fair game, and nothing else is carried.** Newly available, not widely available: a feature is usable the moment all four core browsers ship it, without waiting the further 30 months. No polyfills, no fallbacks, no legacy branches. This is not a decision to drop old browsers — a library built out of the newest features never ran on them in the first place. `pnpm check:no-polyfills` enforces the dependency half of this in CI; the rest is on the author, since checking Baseline usage itself (JS *and* CSS) would take a linter of its own.
- **Identifiers name what the package owns, never the scope.** The scope already says `k8ordo`, so `UIProvider`, not `OrdoProvider`.

## Adding a package

1. `packages/<name>/` with its own `package.json`, `tsconfig.json`, and `vite.config.ts` (the `pack` section defines the publishable build), plus a `check:package` script (`publint` + `attw`) so CI validates the tarball. There is deliberately no template: each manifest is copied from the nearest sibling and kept small enough to read.
2. **Ship the package's own docs with it**: a `docs/` directory listed in `files`, so an agent reads the exact installed version out of `node_modules/@k8ordo/<name>/docs/`. The home page promises this on behalf of every package ("readable by agents"), so a package that does not ship docs makes that claim false. `@k8ordo/ui` is the pattern: `GUIDE.md` as the entry point, `references/*.md` behind it, and `llms.txt` as the index. Every package also has a `README.md` (the npm page: pitch, install, peer table, quick start, the "AI Agent Documentation" block) and an `AGENTS.md` that is a symlink to its `CLAUDE.md`. `@k8ordo/static` and `@k8ordo/server` share the common sections of their guides from `packages/framework-engine/docs/shared/` — edit the fragment, never the copy; `pnpm check` fails on drift.
3. Examples are built from the family's own pieces: an application on `@k8ordo/static` or `@k8ordo/server` (`examples/static-basic`, `examples/server-basic`), using whichever `@k8ordo/*` packages it needs. An example is where the family is seen working together, so it composes packages freely; which package broke is what each package's own tests say. An example does not show a package wired into someone else's framework, with one exception: `@k8ordo/ui` keeps its `ui-*` examples under Next.js and plain Vite, because a component library is the member people drop into an application they already have.
4. Docs go under `/<name>/…` on the site. Only `/` is shared. See `apps/docs/CLAUDE.md`.
5. CI picks the package up automatically for `tests` and `package` (both filter `./packages/*`). The `tokens`, `chromatic`, and `vrt` jobs stay pinned to `@k8ordo/ui` — design tokens, prop extraction, and screenshots are specific to a styled component library.
6. First publish of a brand-new package name cannot use OIDC: a trusted publisher can only be configured on a package that already exists. Publish once by hand **before** the branch lands on `main` — the merge push itself enters publish mode, and `pnpm publish` E404s on a name npm does not know yet. Publish in dependency order (a package before anything that depends on it), then register the trusted publisher (`k35o` / `k8ordo` / `release.yml`) for each and let CI take over.
7. **An internal dependency is `workspace:`, in `peerDependencies` too.** pnpm's release plan refuses a plain range there (`Internal dependencies must use the workspace: protocol so that dependency ranges never need rewriting at release time`), and the whole Release job fails before it can open a release PR.

## Documentation language

**Anything an agent reads is English. Everything else may be Japanese.**

English, because an AI coding assistant consumes it directly:

- `CLAUDE.md` / `AGENTS.md` at every level
- `packages/*/docs/**` — shipped inside every npm package and read out of `node_modules/@k8ordo/<name>/docs/`
- `.claude/skills/**`
- Any string a generator writes into those files (see `packages/ui/scripts/generate-components-md.ts`)

Japanese is fine elsewhere: commit messages, PR and issue text, code comments,
tooling output meant for a developer, and the documentation site's own copy
(which is bilingual with Japanese as the default locale).

## Commands

```bash
pnpm build              # build all packages and apps (the docs site included)
pnpm typecheck
pnpm test
pnpm check              # lint/format check (pnpm check:write to auto-fix)
```

## Gotchas

- Run `pnpm build` before `pnpm check` / `pnpm typecheck` on a fresh checkout or worktree: docs/examples resolve `@k8ordo/*` types from each package's `dist/`, so without it type-aware lint reports bogus `no-unsafe-*` errors (and parallel checks can die with exit 137). CI builds in the install action. The framework applications (`apps/docs`, `examples/static-basic`, `examples/server-basic`) also type-check and type-aware-lint against their generated `.k8ordo/`, which only a build of that application writes — `pnpm build` writes the docs one and `pnpm build:examples` the examples', so run them before a typecheck or check there; CI's `types` and `lint` jobs build all three first. Without the table `PageProps` falls back to string params, and lint misreads a needed `String()` as redundant.
- Use `type`, not `interface` — except `Register` (router, state, i18n, and the generated `.k8ordo/register.gen.ts`), which exists to be merged.
- No `@ts-ignore` — use `@ts-expect-error` with an explanation.
- No skipped tests (`test.skip`, `describe.skip`).
- The pre-commit hook (`vp staged`) runs `vp check --fix` and auto-stages the fixes.

## Release

Versioning uses pnpm's built-in release management, driven in CI by [k35o/pnpm-release-action](https://github.com/k35o/pnpm-release-action). To author a change, run `pnpm change` and include the generated `.changeset/<name>.md` in the PR. Pushes to `main` either update the release PR (branch `pnpm-release/main`) or, when no intents are pending, publish to npm via OIDC trusted publishing. Config lives under the `versioning` key in `pnpm-workspace.yaml`.
