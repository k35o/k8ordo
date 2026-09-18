# Agent guide — packages/server

`@k8ordo/server` — one of the two modes an application chooses between by
installing it. Everything shared with `@k8ordo/static` lives in
`@k8ordo/framework-engine`, a private workspace package this one bundles at
pack time (`deps.alwaysBundle` plus a copy of its `dist/runtime/` into
`dist/runtime/`, which `framework()` hands the engine as `runtimeDir`); what
is here is only the part that makes an
application run. The repository-wide discipline is in the root
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

- **The mode is the dependency.** The reason there are two packages instead of
  one option is that a static application must not have this machinery
  available at all. Keep anything request-shaped here.
- **The handler is the engine's, not ours.** `serve` loads
  `dist/rsc/index.js`, the engine's handler — the one `@k8ordo/static` also
  builds and calls at build time, compiled there for that mode. If a page
  renders differently under the two modes, something has leaked.
- **The plugin is `framework()`, the same name `@k8ordo/static` exports.**
  The mode is the import and nothing else, which is what makes a
  `vite.config.ts` identical under either package.
- **The root entry is the plugin; `./runtime` is everything else.** The root
  loads Vite, which a deployed application does not have installed, so
  anything the application's own code imports — `serve`, `redirect`, their
  types — goes in `src/runtime.ts`. `examples/server-basic`'s handler test
  runs the build with Vite unresolvable to hold that.
- **A request may only name a file inside the client build.** `safeJoin` is
  the only way `serve` turns a pathname into a path, and it is tested against
  the spellings traversal takes; decoding is the engine's `decodePathname`,
  shared with `@k8ordo/static`.
- **`serve` hands back a handle.** `{ port, url, close }`, so a test can
  listen on port 0 and stop what it started (`serve.test.ts` runs it against
  a fixture `dist`, no real build needed).

## Layout

```
src/
  static-file.ts  safeJoin — request pathname → path inside the build output (pure)
  serve.ts        the node:http server (static files + handing off to the handler)
  runtime.ts      ./runtime: serve, and the engine's redirect and types — no Vite
  index.ts        framework (the engine as is)
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
