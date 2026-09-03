# Agent guide — packages/server

`@k8ordo/server` — one of the two modes an application chooses between by
installing it. Everything shared with `@k8ordo/static` lives in
`@k8ordo/framework-engine`; what is here is only the part that makes an
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
- **The handler is the engine's, not ours.** `serve` loads the same
  `dist/rsc/index.js` that `@k8ordo/static` calls at build time. If a page
  renders differently under the two modes, something has leaked.
- **A request may only name a file inside the client build.** `safeJoin` is
  the only way `serve` turns a pathname into a path, and it is tested against
  the spellings traversal takes.

## Layout

```
src/
  static-file.ts  safeJoin — リクエストパス → ビルド出力内のパス(純関数)
  serve.ts        node:http のサーバー(静的配信 + ハンドラ委譲)
  index.ts        k8ordoServer: engine そのまま
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
