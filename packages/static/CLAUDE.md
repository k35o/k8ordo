# Agent guide — packages/static

`@k8ordo/static` — one of the two modes an application chooses between by
installing it. Everything shared with `@k8ordo/server` lives in
`@k8ordo/framework-engine`; what is here is only the part that makes a build
into files. The repository-wide discipline is in the root
[`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (node)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **The mode is the dependency.** Nothing request-shaped may be exported from
  here, ever — the point of two packages instead of one option is that a
  static application does not have the server's machinery to reach for.
- **The handler is the engine's, not ours.** Prerendering calls the same
  `dist/rsc/index.js` request handler `@k8ordo/server` runs per request. If a
  page renders differently under the two modes, something has leaked.
- **An uncovered parameterised route fails the build.** Never warn, never
  skip: a site missing half its pages is worse than a build that stopped.
- **Prerender runs after every environment is built** — `buildApp` with
  `order: 'post'` — and writes into the client build's own output directory,
  which Vite may hand over as an absolute path, so resolve it rather than
  joining.

## Layout

```
src/
  paths.ts   patternsOf / planPaths — 純関数(URLPattern で供給パスを照合)
  index.ts   k8ordoStatic: engine + prerender(buildApp)
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
