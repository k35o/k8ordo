# Agent guide — packages/framework

`@k8ordo/framework` — the framework an application installs, in one of two
modes it chooses with `framework({ mode })`: `'static'` builds every route
into files, `'server'` renders per request. Everything the modes share lives
in `@k8ordo/framework-engine`, a private workspace package this one bundles
at pack time (`deps.alwaysBundle` plus a copy of its `dist/runtime/` into
`dist/runtime/`, which `framework()` hands the engine as `runtimeDir`, with
the chosen `mode`); what is here is the part that differs between the modes
— prerendering into files, and serving per request — and the entries an
application imports. The repository-wide discipline is in the root
[`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is [`docs/GUIDE.md`](docs/GUIDE.md), the entry
point, with a reference per topic under [`docs/references/`](docs/references/)
— the topics of the docs site's `/framework/…` pages — all shipped inside the
npm package. A section that holds for one mode only says so ("Server mode
only", "Under `mode: 'static'`").

## Commands

```bash
pnpm test          # unit (node)
pnpm build         # vp pack (build the engine first)
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **Static mode refuses whatever needs a request, by name.** This replaces
  the old rule that the mode was the dependency — two packages, so a static
  application had no server machinery to reach for. One package means the
  machinery is installed either way, so the guarantee is the build's: under
  `mode: 'static'` every module that imports a value from
  `@k8ordo/framework/server`, declares `'use server'`, is a `guard.ts`, is a
  page exporting `search`, or is a `route.ts` exporting a method other than
  `GET` is refused, every offending file of a kind named at once and each refusal
  ending `this application wants mode: 'server'`. What the route files say
  (guards, `search`, a `route.ts`'s methods) is refused before anything is
  built (`buildApp`, `order: 'pre'`); the `/server` importers and the Server
  Actions only once the environments are built, since only compiling finds
  them. `vite dev` says the same
  the moment the module is compiled — `resolveId` for the `/server` import,
  `transform` for the rest — because code that works in development and does
  nothing in production is the worst of the two. `import type` is erased
  before it resolves and passes; `import { type X }` is kept as a bare import
  under `verbatimModuleSyntax` and is refused, as it should be, since it
  loads the module. A route.ts's methods and a page's `search` are read by
  name, so a route.ts or page with `export * from` is refused as well (the
  engine's `exportsOf` lists it as `REEXPORTS_ALL`). The build only compiles
  the application's own modules — a dependency left external imports
  `/server` unseen — so the handler compiled for `mode: 'static'` runs every
  answer inside `writingFile`, where `cookies()`, `requestHeaders()`,
  `responseHeaders()` and `nonce()` refuse with the same last line when
  called. The `request` prop is the same promise: the generated `Register`
  carries it only under `mode: 'server'`, and under `mode: 'static'` a page
  is handed `fileRequest`, whose getters refuse.
- **`'use server'` is refused through the registry, not the text.** The RSC
  pipeline compiles an action in either mode, so "static has no Server
  Actions" is only true because this package says no — at build time by name
  (`serverActionModules`) and in `vite dev` in `transform`
  (`isServerActionModule`). Both read the one registry `rsc:use-server`
  fills, which is why the dev hook is ordered `post` and never looks at the
  code it is handed: that transform prepends its runtime import, so the file
  has stopped beginning with the directive by the time anyone downstream sees
  it. A `guard.ts` is found through the engine's grammar (`slotOf`), never by
  the file name alone, since one under a `.`-prefixed directory is not one.
- **The handler is the engine's, not ours.** Prerendering calls
  `dist/rsc/index.js`, the engine's request handler compiled for
  `mode: 'static'` — once for each page's HTML and once for its payload —
  and `serve` loads the same handler compiled for `mode: 'server'`. If a page
  renders differently under the two modes, something has leaked.
- **`paths`, `site` and `csp` are static mode's options, in the type and
  when the config loads.** `FrameworkOptions` is
  `StaticOptions | ServerOptions`, discriminated by `mode`, which has no
  default. `framework()` checks the same at run time, because a
  `vite.config.js` is never type-checked and neither mistake fails on its
  own: a mode other than `'static'` would build no files, and a `csp` under
  `mode: 'server'` would be a policy nobody serves. `vite.test.ts` holds each
  case as both a `@ts-expect-error` and the error it throws.
- **The root re-exports the router by name.** `src/index.ts` lists what an
  application's code imports and never `export *`: the router also exports
  what only a hand-written table or the framework's own runtime uses.
  `index.test.ts` keeps `WITHHELD` beside it, so a new router export fails
  the test until it is put in one list or the other. `useParams` and
  `useRoute` are withheld because the framework never renders a `<Router>`.
  The router stays a peer and is never bundled, so a page and the framework
  share its one copy.
- **The generated files name only this package.** They import from
  `./generated` (`defineRoutes`, the shape types, `Register`), and
  `register.gen.ts` augments `Register` there; the re-export carries the
  merge to the router's. `Register` is not on the root because nothing an
  application writes by hand augments it.
- **Entries by where the code runs.** `./vite` is the plugin and loads Vite,
  which a deployed application does not have installed. `./server`
  (`src/server.ts`) is what code inside the handler imports — `redirect`,
  `cookies`, `responseHeaders`, `requestHeaders`, `nonce` and the types,
  `Guard` among them. `./serve` (`src/serve.ts`) is the Node server, and
  `./vercel` the Vercel plugin. The root and `./generated` are the router's
  names and nothing else. `examples/server-basic`'s handler test runs
  `./serve` with Vite unresolvable, as a server of your own would, to hold
  the split. The types are split too:
  every server-mode `register.gen.ts` imports `./server`, so its `.d.mts`
  reaches `@k8ordo/router` and nothing else — no Vite, whose types need
  `@types/node`. It re-exports the engine's `./server`, not its index, and
  `entry-types.test.ts` reads the built types for it.
- **The handler is the exit, and it runs wherever `AsyncLocalStorage`
  does.** Whatever `./server` imports is bundled into every handler that
  imports `redirect`, so it takes nothing from Node, and `serve`'s
  dependencies (CommonJS, `node:http`) stay behind `./serve`. The handler's
  only Node API is `node:async_hooks`. `examples/server-basic` reads the
  built handler's imports for that, and runs it under Deno from a copy of
  `dist/` with nothing installed (`deno` is in `mise.toml` for CI). Adding
  an import to an engine module that `./server` bundles can leave a
  side-effect import of it in `dist/server.mjs`; build and read its head.
- **A server mode `dist/` runs on its own.** `node dist/server.js` with
  nothing installed is the deploy, so `@k8ordo/framework` is a dev
  dependency in both modes. `serverMode` (`src/server-mode.ts`) builds the
  `rsc` and `ssr` environments with `resolve.noExternal: true`, leaving
  only Node's built-ins outside — an application's own `resolve.external`
  still wins, which is the way out for a dependency that cannot be bundled
  — and after every environment is built, bundles `server.js` from a
  virtual entry that hands `serve` the directory it sits in and reads
  `PORT` / `HOST`. That is a second `build()` of its own, not an input of
  the `rsc` environment: the handler's chunks have to stay free of
  `node:http`, and the launcher is the framework's code, not the
  application's, so it takes none of the application's config. A `dist/`
  copied out of the application has no `package.json` above it to say ESM;
  the engine's `dist/package.json` (the next invariant) says it. The
  launcher closes `serve` and exits with `0` on `SIGTERM` and `SIGINT`,
  since Node as a container's PID 1 ignores a signal nothing handles.
  `examples/server-basic`'s `deployed.test.ts` copies `dist/` alone into a
  temporary directory and asks the started server for a page, an action, a
  guard, a 404, a redirect and a compressed file, stops it with each
  signal, and builds the application once more under a `package.json` with
  no `type`. `vercel()` adds no bundling of its own; its function is this
  handler.
- **Either mode builds whatever the application's `package.json` says about
  `type`.** The RSC plugin names `../ssr/index.js` itself, and static
  mode's prerender, `serve` and `vercel()` name `rsc/index.js`, while Vite
  writes `.mjs` when the application's `package.json` does not say
  `type: module` — a static build would stop on `ERR_MODULE_NOT_FOUND`, and
  a server build would pass and the server die on start. So the engine pins
  the `rsc` and `ssr` entries to `[name].js` and writes `dist/package.json`
  (`type: module`) in its own `buildApp` hook, which runs before the modes'
  (it is `enforce: 'pre'`), so the file is there when static mode imports
  the handler. The file goes in the directory the `rsc` and `ssr` outputs
  share — `dist/` unless the application moves them — and the build stops
  rather than write it where that directory holds the application (an
  `outDir` of `build-rsc` makes it the root), since the `package.json`
  there is the application's own. `examples/static-basic`'s
  `build.test.ts` builds the application with and without `type` in one
  place and compares `dist/client/` (not against its own `dist/`: a client
  reference's name hashes its path from the root), and builds it once with
  its `rsc` output beside its `package.json` and checks the file is
  untouched; `examples/server-basic`'s `deployed.test.ts` starts the one
  built without `type`.
- **An uncovered parameterised route fails a static build** — unless its
  page has a `fallback.tsx`, whose shell answers the values the build did
  not write. Never warn, never skip: a site missing half its pages is worse
  than a build that stopped.
- **A shell stands where `paths` says, or at its bare pattern.** `planPaths`
  gives a supplied pathname that still holds `:name` segments to the first
  pattern in table order it fits; with a fallback.tsx it is a shell
  location (its open params only — those no layout above receives), without
  one it is refused naming the file. A fallback pattern given no location
  gets its bare pattern, unless a layout receives one of its params.
  Shell pathnames replace the left-open segments with `!fallback`, which a
  supplied pathname may not hold, escaped or not. `shadowedShells` refuses a
  shell whose host rule would answer URLs a pattern declared first is given
  (a shared parameter position, or one URL the build did not write).
  `planRefusals` words every refusal; `vite dev` logs the same words.
- **A shell is written only when its own pattern answered.** The build asks
  the handler for each shell pathname, HTML and payload, and writes them
  only on a 200 carrying `SHELL_HEADER` for that pattern; anything else
  stops the build naming the location (a params schema, a `notFound()`,
  another route). A shell is never in the sitemap. Its HTML
  outside scripts is searched for `!fallback`, which a layout writing its
  `pathname` leaves, and the build warns.
- **`_redirects` is how a static host reaches a shell.** Written to the
  client build only when there are shells, after every file is in place
  (`rewrites.ts`): the built URLs a shell rule would also catch, listed as
  themselves (Cloudflare applies rules before files), and the payload URL of
  a built `redirect.ts`/`route.ts` answered with the shell's HTML; then the
  application's own `public/_redirects` verbatim (read from `publicDir`,
  never from the output, which a build with `emptyOutDir: false` already
  merged); then the shells' document rules and payload rules, placeholders
  named by position. Targets are spelled as Cloudflare re-encodes them. The
  build warns about what a host would get wrong reading it: Cloudflare's
  static and dynamic limits, a built URL a rule cannot list, an own rule
  that hides a shell, a Vercel build without `vercel()`. A `k8ordo:vercel`
  plugin is handed `StaticOutput` through `api.writeStatic` once the files
  are written.
- **`vite dev` answers an unlisted value with the shell.** `k8ordo:static`'s
  `configureServer` (`pre`, so its middleware runs after Vite's own and
  before the RSC handler) rewrites a request a shell rule matches, for a
  value `paths` does not list, to the shell pathname. It reads the routes,
  and `paths` only for an application with a fallback.tsx, once per change
  (`watchChange`) — `paths` again only when the patterns handed to it
  changed — and a URL no fallback pattern could match never waits on it.
- **A supplied pathname the site then disowns fails the build.** A 404 for
  a pathname `paths` supplied is either a params schema refusing it or the
  page saying `notFound()`; the handler marks the second with
  `NOT_FOUND_HEADER`, and the build names each kind in its own message.
- **Under static mode a route.ts is a file.** The build calls its `GET` once
  per pathname (with `site`'s origin in the URL when given) and writes the
  body at the pathname — `answeredByRoute` asks the declared patterns, in the
  matcher's order, which of them answers. Anything but a `200` stops the
  build, as do a route at `/` and a route with written pathnames below it (a
  file cannot also be a directory). It is not a page: no `index.rsc`, not in
  the sitemap.
- **A file never carries a nonce; the policy names hashes.** The handler
  signs the framework's inline scripts with a nonce per render and says it in
  `NONCE_HEADER`; `write` takes it off every page (`asFile`) whether or not
  a `csp` was given — a nonce in a file everyone reads is worth nothing, and
  a random one would make every build differ. With `csp`, what that nonce
  signed is hashed into `script-src` of a `<meta>` placed first in `<head>`;
  nothing else is hashed, so an inline script that reached a page from
  content stays refused, and the application allows its own by hash in the
  policy (`colorSchemeScriptHash`). `nonce()` lives on `./server`, which
  static mode refuses, for the same reason. A policy the `<meta>` cannot
  carry (`frame-ancestors`, `report-uri`, `sandbox`) or one with
  `'strict-dynamic'` — under which the module script, allowed only by
  `'self'`, never loads — is refused when the plugin is created
  (`policyProblems`).
- **`site` is the only reason a sitemap exists.** Without the origin a
  sitemap would list relative URLs, which is not a sitemap; with it every
  page the build wrote is listed, redirects and the not-found excluded.
- **The pattern walk is the engine's.** `patternsOf` is
  `declaredPatterns(tree)` from the engine, in the matcher's order, so the
  build, the shadow check and the prerenderer never disagree; the trailing
  slash is the router's `normalizePathname`, and decoding a pathname for the
  filesystem is the engine's `decodePathname`, which `serve` uses too.
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
  joining. The refusals that need the compiled environments (the `/server`
  importers and Server Actions) are said there, before anything is written.
- **The request's URL is the `Host` header and the path, written, never
  resolved.** `urlOf` writes the request target after `http://<Host>`; resolved
  against it instead, `//evil.test/x` is a URL on evil.test, and the handler's
  Server Action same-origin check compares `Origin` with whatever host the URL
  names. So a target that is not a path (absolute-form, `*`) and a `Host` that
  is not a host are refused with `400` rather than given a URL.
- **A request may only name a file inside the client build.** `safeJoin` is
  the only way `serve` turns a pathname into a path, and it is tested against
  the spellings traversal takes; decoding is the engine's `decodePathname`.
- **The client build sits at the build's base.** `serve` reads `base`
  from `dist/rsc/index.js` — the value the handler was built with, so the
  two cannot disagree — and takes it off a request (`withoutBase`, the base
  passed in: Node has no `import.meta.env`) before looking for a file or
  deciding `immutable`. A URL outside the base never names a file; the
  handler answers it, or for a static build a plain 404.
- **`serve` hands back a handle.** `{ port, url, close }`, so a test can
  listen on port 0 and stop what it started (`serve.test.ts` runs it against
  a fixture `dist`, no real build needed).
- **Compression happens once where it can, and never holds a stream back.**
  Under `mode: 'server'` the client build is compressed at build time
  (`precompress`, from `serverMode`'s `buildApp` hook) and `serve` only
  picks a copy; a page is compressed per request, flushed after every chunk,
  because React writes it as it renders. `serve.test.ts` holds the second
  half of a streamed page back and reads the first through the compressor.
- **An `ETag` is the file's contents, never its time.** Servers built apart,
  and a deploy that changed nothing, have to agree on it for a revalidation
  to end in a `304`.
- **Vercel is the one host with an adapter.** `vercel()` exists because
  k8o, the family's real consumer, deploys there; another host gets the
  handler (`dist/rsc/index.js`) or `_redirects` and no adapter until
  something here runs on it. The adapter writes the Build Output API
  directory and nothing more — no launcher of its own (Vercel calls the
  handler as `fetch`) and no dependency tracing (server mode builds the
  handler with every dependency bundled in). It takes either mode, read in
  `configResolved`, where every plugin is listed whichever side of
  `framework()` it was put. Under `mode: 'server'` its own `buildApp` writes
  the client and the function. Under `mode: 'static'` its own `buildApp`
  does nothing — placed first it would copy the client before a page is
  written — and `k8ordo:static` calls its `api.writeStatic` once every file
  is in place: the client without `_redirects` (Vercel never reads it, and
  would serve it), no function, and the rewrites as routes after
  `handle: 'filesystem'` — the payload URL of a built non-page, the shells'
  documents (`…/index.html`, a trailing slash allowed) and payloads —
  case-sensitive, then `404.html` under 404 when it was written.
- **`serve` and `vite preview` serve a static build as a static host.**
  One resolver, `resolveStatic` (`static-host.ts`), in Netlify's order: the
  file, a directory's `index.html`, the first `200` rule of the build's
  `_redirects` (read by `parseRedirects`), then `404.html` under 404;
  anything but `GET`/`HEAD` is 405. Neither ever calls the handler for a
  static build — it wrote every file there is, and a render would carry a
  nonce the files do not. `serve` tells the builds apart by the entry's
  `mode` export and reads `_redirects` only for a static one: Vite copies
  `public/_redirects` into a server build too, and its `200` rules are not
  this server's to apply. Under either, `immutable` is decided by the file
  sent, never the URL, so a shell a rule answers at `/assets/x.js` is not
  cached for a year. The preview middleware is registered directly in
  `configurePreviewServer`, ahead of Vite's own, and hands Vite's static
  files the file's own URL (they resolve no directory index) or answers
  itself: the 404, and a file whose name holds `?` or `#`, which Vite's
  static files cannot be handed in any spelling (they undo only
  `decodeURI`'s escapes).

## Layout

```
src/
  index.ts          the root: the router's application-facing names, re-exported
  generated.ts      ./generated: what .k8ordo/ imports (defineRoutes, Register, …)
  vite.ts           ./vite: framework() — the engine, plus static mode or server mode
  static.ts         staticMode: the refusals (dev in resolveId / transform, the
                    build's in buildApp), prerendering into files, vite dev's
                    shells and vite preview's static host
  paths.ts          patternsOf / patternsNeedingPaths / planPaths /
                    catchAllPatterns / catchAllPath / dirFor / isConcrete /
                    answeredByRoute / shellPathname / shadowedShells /
                    planRefusals — pure functions (supplied pathnames
                    matched with URLPattern)
  rewrites.ts       the _redirects rules: shellRules / builtRules /
                    formatRedirects / cloudflareCounts, and parseRedirects /
                    rewriteFor, which apply them — pure functions
  static-host.ts    resolveStatic / readRules — what a static host serves for
                    a URL of a static build; serve and vite preview share it
  documents.ts      sitemap / redirectPage — the two files the build writes
                    itself rather than taking from the handler, escaped as
                    markup; asFile / policyProblems — a page as a file: its
                    nonce off, its Content-Security-Policy <meta> with the
                    framework's hashes
  server.ts         ./server: the engine's redirect, response API, nonce and types — no Vite, no Node
  static-file.ts    safeJoin — request pathname → path inside the build output (pure)
  encoding.ts       which content coding a request gets, what is worth compressing
  server-mode.ts    serverMode: the handler built with every dependency in it,
                    dist/server.js bundled from serve, and the client
                    precompressed
  precompress.ts    the client build's .br / .gz copies, written at build time
  serve.ts          ./serve: the node:http server (static files + handing off to
                    the handler; a static build as a static host)
  vercel-output.ts  the build as Vercel's Build Output API directory, either mode
  vercel.ts         ./vercel: the plugin that writes it
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
