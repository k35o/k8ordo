# Agent guide — k8ordo

k8ordo is a monorepo for `@k8ordo/ui` (React UI library) and its docs site. Vite+ (`vp`) is the unified toolchain — dev, build, test, lint/format (Oxlint/Oxfmt) — with Tailwind CSS 4 driven by semantic design tokens.

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
