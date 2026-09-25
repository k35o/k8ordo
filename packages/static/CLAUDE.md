# Agent guide — packages/static

`@k8ordo/static` — one of the two modes an application chooses between by
installing it. Everything shared with `@k8ordo/server` lives in
`@k8ordo/framework-engine`, a private workspace package this one bundles at
pack time (`deps.alwaysBundle` plus a copy of its `dist/runtime/` into
`dist/runtime/`, which `framework()` hands the engine as `runtimeDir`); what
is here is only the part that makes a build
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
- **The handler is the engine's, not ours.** Prerendering calls
  `dist/rsc/index.js`, the engine's request handler compiled for this mode —
  the one `@k8ordo/server` runs per request — once for each page's HTML and
  once for its payload. If a page renders differently under the two modes,
  something has leaked.
- **An uncovered parameterised route fails the build.** Never warn, never
  skip: a site missing half its pages is worse than a build that stopped. A
  `'use server'` module fails it for the same reason: the RSC pipeline
  compiles an action in either mode, so "static has no Server Actions" is
  only true because this package says no — at build time by name
  (`serverActionModules`, every offending module at once) and in `vite dev`
  in `transform`, the moment the module is compiled
  (`isServerActionModule`). Both read the one registry `rsc:use-server`
  fills, which is why the dev hook is ordered `post` and never looks at the
  code it is handed: that transform prepends its runtime import, so the
  file has stopped beginning with the directive by the time anyone downstream
  sees it. A `guard.ts` fails it the same way — every one named before
  anything is built (`buildApp`, `order: 'pre'`), and in `vite dev` the
  moment the module is compiled — found through the engine's grammar
  (`slotOf`), never by the file name alone, since a `_private/guard.ts` is
  not one.
- **A supplied pathname the site then disowns fails the build.** A 404 for
  a pathname `paths` supplied is either a params schema refusing it or the
  page saying `notFound()`; the handler marks the second with
  `NOT_FOUND_HEADER`, and the build names each kind in its own message.
- **`site` is the only reason a sitemap exists.** Without the origin a
  sitemap would list relative URLs, which is not a sitemap; with it every
  page the build wrote is listed, redirects and the not-found excluded.
- **The pattern walk is the engine's.** `patternsOf` is
  `declaredPatterns(tree)` from the engine, in the matcher's order, so the
  build, the shadow check and the prerenderer never disagree; the trailing
  slash is the router's `normalizePathname`, and decoding a pathname for the
  filesystem is the engine's `decodePathname`, shared with `@k8ordo/server`.
- **The plugin is `framework()`, the same name `@k8ordo/server` exports.**
  The mode is the import and nothing else, which is what makes a
  `vite.config.ts` identical under either package.
- **Pages are counted in the table's terms and asked for under the base.**
  `urlFor` puts `builder.config.base` in front of every pathname the
  handler is asked for (HTML, payload, `404.html`) and of every sitemap
  `<loc>`, while files go to `dirFor(pathname)` inside the client build —
  the directory a host serves at the base. The `paths` option is in the
  table's terms too. Node runs this without Vite, so the router's
  `withBase` gets the base passed in.
- **Prerender runs after every environment is built** — `buildApp` with
  `order: 'post'` — and writes into the client build's own output directory,
  which Vite may hand over as an absolute path, so resolve it rather than
  joining.

## Layout

```
src/
  paths.ts      patternsOf / patternsNeedingPaths / planPaths /
                catchAllPatterns / catchAllPath / dirFor / isConcrete — pure
                functions (supplied pathnames matched with URLPattern)
  documents.ts  sitemap / redirectPage — the two files the build writes
                itself rather than taking from the handler, escaped as markup
  index.ts      framework: engine + refusals (guard.ts before the build) +
                prerender (the dev refusals in transform, the files in buildApp)
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
