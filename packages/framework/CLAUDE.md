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
  loads the module. `src/refusals.test.ts` builds and serves an application
  under `fixtures/` for each refusal, one root apiece, and also holds that a
  page or a not-found that fails to render stops the build naming it. A
  route.ts's methods and a page's `search` are read by name, so a route.ts
  or page with `export * from` is refused as well (the
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
  `mode: 'static'` — once for each page, whose HTML and the payload it was
  rendered from (the engine's `payloadOf`) are both written, so a page reads
  its data once per build and its two files are one render —
  and `serve` loads the same handler compiled for `mode: 'server'`. If a page
  renders differently under the two modes, something has leaked.
- **`site` and `csp` are static mode's options, in the type and when the
  config loads.** `FrameworkOptions` is
  `StaticOptions | ServerOptions`, discriminated by `mode`, which has no
  default. `framework()` checks the same at run time, because a
  `vite.config.js` is never type-checked and neither mistake fails on its
  own: a mode other than `'static'` would build no files, and a `csp` under
  `mode: 'server'` would be a policy nobody serves. A `paths` passed in
  either mode throws too, naming the `paths.ts` that replaced the option: a
  config left over from it would otherwise build with its values ignored.
  `vite.test.ts` holds each case as both a `@ts-expect-error` and the error
  it throws.
- **A parameter's values come from its own directory.** Under
  `mode: 'static'` a `paths.ts` in a `[param]` directory default-exports a
  function (`Paths<Pattern>`, `src/paths-type.ts`) that returns the values
  that parameter takes, given the params of the directories above it.
  `suppliedFrom` walks the tree and asks each file once per combination of
  the values above, and the values multiply down to every page, `route.ts`
  and `redirect.ts` below. A value is the segment as a visitor reads it;
  `segmentOf` escapes it. A file that returns anything but non-empty
  strings, or that sits below a parameter left open, is a problem the build
  names with the plan's refusals. The values are data of the application,
  so the file runs where the pages do: the build asks through
  `pathValues`, exported by the built `dist/rsc/index.js`, and `vite dev`
  through the RSC environment's module runner — never from the config,
  where the application's aliases and `server-only` modules do not load.
  `mode: 'server'` reads no paths.ts and compiles none in.
- **React's plugin is the framework's, and `reactCompiler` is all of it an
  application sets.** The engine returns `@vitejs/plugin-react`, and
  `reactCompiler: true`, in either mode, turns on its `compiler` (see the
  engine's `CLAUDE.md`). That loads `oxc-transform-react` from the
  application, so it is an optional peer here, in the range the plugin's
  own optional peer asks; `vite.test.ts` fails when the two drift, as when
  the plugin is bumped. Without it the plugin fails while Vite resolves the
  config, with its own error, which names `react({ compiler: true })`; the
  framework does not restate it, and the guide quotes it.
- **The root re-exports the router by name, plus one type of its own.**
  `src/index.ts` lists what an application's code imports and never
  `export *`: the router also exports what only a hand-written table or the
  framework's own runtime uses. `index.test.ts` keeps `WITHHELD` beside it,
  so a new router export fails the test until it is put in one list or the
  other. The one name that is not the router's is `Paths`, the type a
  `paths.ts` is written against, and the same test holds that it is the
  only one. `useParams` and
  `useRoute` are withheld because the framework never renders a `<Router>`.
  The router stays a peer and is never bundled, so a page and the framework
  share its one copy.
- **The generated files name this package, never the router.** They import
  from `./generated` (`defineRoutes`, the shape types, `Register`), and
  `register.gen.ts` augments `Register` there; the re-export carries the
  merge to the router's. `Register` is not on the root because nothing an
  application writes by hand augments it. `register.gen.ts` also augments
  `@k8ordo/state`'s `Register` (the table) and `@k8ordo/i18n`'s (the
  `locales` that `src/i18n.ts` exports) by those packages' own names, when
  the application has them: they are the application's dependencies, not
  this package's, and the application would otherwise write both by hand.
- **`k8ordo generate` is the build's first step and nothing after it.** The
  package's one `bin` (`src/cli.ts`) resolves the Vite config in the working
  directory as `vite build` does (`resolveConfig`, `'build'`,
  `'production'`), finds the engine's plugin by name and calls its
  `api.generate()` — the same function its `buildStart` awaits — because
  `routesDir` and the mode exist only in the application's `framework()`
  call, and reading them again from flags would be a second place for them
  to disagree. No environment is built, so no `paths.ts` is read and the
  data a page reads is never touched: a CI job with no database writes `.k8ordo/` for
  `tsc`. A config without `framework()` and a `routes/` with the problems
  the build names under `routes/ is not a valid pathname space:` both exit
  with `1`, the second with the build's message and nothing written. What
  `mode: 'static'` refuses on top of those — `k8ordo:static-refuses`
  (`guard.ts`, a `route.ts` answering more than `GET`, a page reading
  `search`, `export *`), Server Actions, whatever a `paths.ts` returns — it
  does
  not check, so its success is not the build's. `cli.test.ts` runs the
  built `dist/cli.mjs` in temporary applications with this package linked
  into their `node_modules`.
- **Entries by where the code runs.** `./vite` is the plugin and loads Vite,
  which a deployed application does not have installed. `./server` is what
  code inside the handler imports — `redirect`, `cookies`,
  `responseHeaders`, `requestHeaders`, `nonce` and the types, `Guard` among
  them — and it is not built here: it points at the engine's
  `runtime/server.ts` in the copied `dist/runtime/`, the directory the
  handler is built from, so an application's import of it and the handler
  are one module, with one request in progress and one `Redirect` class.
  Bundling it here would give an application's handler a second copy of
  both. `request-api.test.ts` holds that in `vite dev`, where Vite resolves
  both imports; the built handler is `examples/server-basic`'s to hold. A
  dependency that `vite dev` or a static build leaves external is loaded by
  Node instead, with a copy of its own that no request reaches.
  `./serve` (`src/serve.ts`) is the Node server, and
  `./vercel` the Vercel plugin. The root and `./generated` are the router's
  names and the `Paths` type, nothing else. `examples/server-basic`'s handler test runs
  `./serve` with Vite unresolvable, as a server of your own would, to hold
  the split. The types are split too:
  every server-mode `register.gen.ts` imports `./server`, so its `.d.mts`
  reaches `@k8ordo/router` and nothing else — no Vite, whose types need
  `@types/node`. `entry-types.test.ts` reads the built types for it.
- **The handler is the exit, and it runs wherever `AsyncLocalStorage`
  does.** Whatever `./server` imports is bundled into every handler that
  imports `redirect`, so it takes nothing from Node, and `serve`'s
  dependencies (CommonJS, `node:http`) stay behind `./serve`. The handler's
  only Node API is `node:async_hooks`. `examples/server-basic` reads the
  built handler's imports for that, and runs it under Deno from a copy of
  `dist/` with nothing installed (`deno` is in `mise.toml` for CI).
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
- **An uncovered parameterised route fails a static build** — a parameter
  whose directory has no `paths.ts`, unless the page has a `fallback.tsx`,
  whose shell answers the values the build did not write. Never warn, never
  skip: a site missing half its pages is worse than a build that stopped.
- **A shell stands below the values the `paths.ts` files above it return.**
  A parameter with no paths.ts stays open (`:name`), and `suppliedFrom`
  offers an open location only where a `fallback.tsx` stands beside the
  page: with `[locale]/paths.ts` and a fallback.tsx under `[id]`, the
  shells stand at `/ja/posts/:id` and `/en/posts/:id`, and with no
  parameter above, at the bare pattern. A directory with both a paths.ts
  and a fallback.tsx writes its values as pages and keeps the shell for the
  rest. `planPaths` takes those locations as it took the option's: a
  location goes to the first pattern in table order it fits, and may leave
  open only the params no layout above the fallback.tsx receives — one a
  layout receives means that parameter's directory needs a paths.ts.
  Shell pathnames replace the left-open segments with `!fallback`, which a
  returned value may not be, escaped or not. `shadowedShells` refuses a
  shell whose host rule would answer URLs a pattern declared first is given
  (a shared parameter position, or one URL the build did not write).
  `planRefusals` words every refusal; `vite dev` logs the same words.
- **A shell is written only when its own pattern answered.** The build asks
  the handler for each shell pathname, HTML and payload, and writes the
  HTML only on a 200 carrying `SHELL_HEADER` for that pattern, and the
  payload only on a 200 after it; anything else stops the build naming the
  location (a params schema, a `notFound()`,
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
  build warns about what Cloudflare would get wrong reading it: its static
  and dynamic limits, a built URL a rule cannot list, an own rule that hides
  a shell. A host adapter — a plugin whose `api` has `writeStatic`, found by
  that and not by name, so this package's static mode knows no host — is
  handed `StaticOutput` once the files are written: the rewrites a host
  applies after its files (`rewritesAfterFiles`, the built URLs' own rules
  aside, and not the application's `public/_redirects`, which such a host
  never reads), whether `404.html` was written, and the route.ts types. With
  one, `_redirects` is still written, for `serve` and `vite preview`, and
  none of the warnings is said.
- **`vite dev` answers a value as the build's host will.** `k8ordo:static`'s
  `configureServer` (`pre`, so its middleware runs after Vite's own and
  before the RSC handler) leaves a value a paths.ts returns to its page
  and answers any other as a static host would (`answerUnbuilt`): a
  request a shell rule matches is rewritten to the shell pathname; with no
  shell, a document is rewritten to the pathname `404.html` is rendered
  from, and a payload — a file the host would not have — is a plain 404,
  as is everything in an application with no not-found.tsx. It says which
  once per pattern or fallback.tsx. `devPlan` keeps what the paths.ts
  files said until a file under `routes/` changes (`watchChange`), and
  asks them again when a request names a value it does not hold, since the
  data behind them changes with no file changing. A URL no parameterised
  pattern could match never waits on them. A paths.ts that throws is
  logged once and leaves every value to its page; what the build would
  refuse is logged as a warning in the build's words.
- **A returned value the site then disowns fails the build.** A 404 for
  a pathname a paths.ts gave is either a params schema refusing it or the
  page saying `notFound()`; the handler marks the second with
  `NOT_FOUND_HEADER`, and the build names each kind in its own message.
- **Under static mode a route.ts is a file.** The build calls its `GET` once
  per pathname (with `site`'s origin in the URL when given) and writes the
  body at the pathname — `answersOf` asks the declared patterns once, in the
  matcher's order, which of them answers each pathname. Anything but a
  `200` stops the build. It is not a page: no `index.rsc`, not in the
  sitemap. Before anything renders, `routeFileRefusals` names in one error
  each route.ts that cannot be its file: one at `/`, one with written
  pathnames below it (a file cannot also be a directory), and one at a file
  the build writes itself — a page's or a redirect's `index.html`, a page's
  `index.rsc`, `404.html`, `_redirects` with
  shells, `client-files.json`: those are written after the routes' files (a
  page's beside them), so one would replace the other unseen. A file keeps
  no type, so the `Content-Type` its
  `GET` answered is kept beside it — `StaticOutput.types`, by the file's path
  inside the client build — for the one adapter that can name a file's
  type; `serve`, `vite preview` and every other host go by the extension.
- **A file never carries a nonce; the policy names hashes.** The handler
  signs the framework's inline scripts with a nonce per render and says it in
  `NONCE_HEADER`; `writeHtml` takes it off every page (`asFile`) whether or
  not a `csp` was given — a nonce in a file everyone reads is worth nothing,
  and a random one would make every build differ. With `csp`, what that nonce
  signed is hashed into `script-src` of a `<meta>` placed first in `<head>`
  after the `<meta charSet>` React writes there (a browser looks for the
  encoding only in the first 1024 bytes, which a policy naming many hashes
  outgrows; only a charset that opens `<head>` is passed over, since a
  policy does not govern what comes before it), and so is the engine's one
  `<style>` (`STYLESHEET_ORDER_HREF`, empty, which keeps the Server
  Components' stylesheets first; the engine leaves it unsigned under static
  mode) wherever a style element is decided —
  `style-src-elem`, `style-src`, or `style-src` made from `default-src` —
  and only where the policy would refuse it: beside an `'unsafe-inline'`
  that lets it in, a hash would turn that off for every `style` attribute
  too. Nothing else is hashed, so an inline script that reached a page from
  content stays refused, and the application allows its own by hash in the
  policy (`colorSchemeScriptHash`). `nonce()` lives on `./server`, which
  static mode refuses, for the same reason. A policy the `<meta>` cannot
  carry (`frame-ancestors`, `report-uri`, `sandbox`, which it ignores, and
  `report-to`, whose endpoint only a `Reporting-Endpoints` response header
  defines) or one with `'strict-dynamic'` — under which the module script,
  allowed only by `'self'`, never loads — is refused when the plugin is
  created (`policyProblems`).
- **A static build lists each page's client files beside the pages.**
  `client-files.json` (the engine's `CLIENT_FILES_PATH` and `ClientFiles`)
  is what a client navigation links ahead of a payload
  (`packages/framework-engine/CLAUDE.md`). `writeHtml` hands back the files
  each HTML answer says (`files`): the `js` and `css` of the modules its
  `CLIENT_DEPS_HEADER` names, and the stylesheets its
  `SERVER_STYLESHEETS_HEADER` names. `clientFiles` (`documents.ts`) keeps,
  per page with a payload, those files less the ones every HTML document
  written links — pages,
  `404.html` and shells alike, since the visitor may have arrived on any of
  them — keyed by the payload's path as `new URL` spells it, so a pathname
  that is not ASCII is the key a browser looks up. Each file is listed once
  and named by its index; pages and files are sorted, so a build writes the
  same bytes whatever order its pages rendered in. A shell is not listed (a
  browser asks for it at a value's URL). Written always, before
  `_redirects`, whose built rules then list it among the files a shell
  rule would catch; it is a file the build writes itself, so a `route.ts`
  there is refused (`routeFileRefusals`). `src/documents.test.ts` holds the
  computation, `src/static.test.ts` the wiring and the refusal, and
  `examples/static-basic`'s `build.test.ts` the built list and the site
  that reads it.
- **`site` is the only reason the build writes a sitemap, and a `route.ts`
  at `sitemap.xml` is the reason it does not.** Without the origin a
  sitemap would list relative URLs, which is not a sitemap; with it every
  page the build wrote is listed, redirects and the not-found excluded.
  Where a `route.ts` answers `/sitemap.xml` (`SITEMAP_PATHNAME`, asked of
  `answersOf`, so one a `[file]/route.ts` writes counts too) the file is the
  application's — its own `lastmod`, its own order — and the build writes
  none over it. It is the one file of the build's a `route.ts` may take;
  the others are refused (`routeFileRefusals`).
- **The pattern walk is the engine's.** `patternsOf` is
  `declaredPatterns(tree)` from the engine, in the matcher's order, so the
  build, the shadow check and the prerenderer never disagree; the trailing
  slash is the router's `normalizePathname`, and decoding a pathname for the
  filesystem is the engine's `decodePathname`, which `serve` uses too.
- **Pages are counted in the table's terms and asked for under the base.**
  `Render.urlFor` puts `builder.config.base` in front of every pathname the
  handler is asked for (HTML, payload, `404.html`) and of every sitemap
  `<loc>`, while files go to `dirFor(pathname)` inside the client build —
  the directory a host serves at the base. What the paths.ts files return
  are values, which hold no base. Node runs this without Vite, so the router's
  `withBase` gets the base passed in.
- **Prerender runs after every environment is built** — `buildApp` with
  `order: 'post'` — and writes into the client build's own output directory,
  which Vite may hand over as an absolute path, so resolve it rather than
  joining. The refusals that need the compiled environments (the `/server`
  importers and Server Actions) are said there, before anything is written,
  in one error with what the plan and the route files refuse.
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
  is in place, which writes from the plugin's own resolved config (`root`,
  the client's `outDir`, `base`): the client without `_redirects` and `_headers` (Vercel reads neither, and
  would serve them), no function, and the rewrites as routes after
  `handle: 'filesystem'` — the payload URL of a built non-page, the shells'
  documents (`…/index.html`, a trailing slash allowed) and payloads —
  case-sensitive, then `404.html` under 404 when it was written — and each
  file a route.ts wrote under `overrides` with the type its `GET` answered,
  even where the extension says the same, so no file is left to the types
  Vercel gives extensions (sorted, since the files are written in
  parallel). The application's own routes go around them as given:
  `beforeFiles` ahead of `handle: 'filesystem'`, `beforeNotFound` between
  the shells' rewrites and `404.html`, so a catch-all of the application's
  never hides a shell. Only static mode takes them — `configResolved`
  refuses them under server mode, where the handler answers every URL no
  file names — and nothing in them is checked: their patterns are Vercel's
  (PCRE), which a check with JavaScript's `RegExp` would misjudge.
  `vite dev`, `vite preview` and `serve` never apply them; an imitation of
  Vercel's routing nothing here can check against Vercel would be worse
  than none.
- **`headers` is declared once and sent by whatever answers.**
  `framework({ headers })`, in either mode (the engine's `EngineOptions`),
  is one set for every response and nothing finer: a header for some paths
  stays with the host's own means (`vercel()`'s routes, `public/_headers`),
  because a path grammar would have to mean the same on every host.
  `headersRefusal` (`headers.ts`) refuses a name or value HTTP could not
  send when the config loads — a line break would start a rule of its own
  in `_headers`. `k8ordo:headers`, first among the plugins, sets them in
  `vite dev` and `vite preview` before anything answers, and its `api` is
  where `vercel()` reads them (`declaredHeaders`), writing one
  `continue` route ahead of every other in either mode. The engine compiles
  them into the handler (`K8ORDO_HEADERS`), which exports them as `headers`
  — `serve` sets them from there before anything answers, files included —
  and under `mode: 'server'` adds them to its own answers where the answer
  has no header of that name, so a guard's `Content-Security-Policy` stays
  and a runtime calling the handler itself sends them. A static build
  writes `dist/client/_headers` (`formatHeaders`): a `/*` rule, then the
  application's `public/_headers` verbatim, read from `publicDir` as
  `_redirects` is; `vercel()` leaves that file out of what it ships.
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
  index.ts          the root: the router's application-facing names, re-exported,
                    and the Paths type
  generated.ts      ./generated: what .k8ordo/ imports (defineRoutes, Register, …)
  vite.ts           ./vite: framework() — the engine, plus static mode or server mode
  static.ts         staticMode: the refusals (dev in resolveId / transform, the
                    build's in buildApp), prerendering into files, vite dev
                    answering as the build's host will (devPlan,
                    answerUnbuilt) and vite preview's static host
  paths.ts          patternsOf / patternsNeedingPaths / suppliedFrom (what
                    the paths.ts files say the site holds) / planPaths /
                    catchAllPatterns / catchAllPath / dirFor / isConcrete /
                    fileAt / answersOf / shellPathname / shadowedShells /
                    planRefusals / routeFileRefusals — pure functions
                    (pathnames matched with URLPattern)
  paths-type.ts     Paths<Pattern>: what a paths.ts exports by default, on
                    the root and ./generated
  rewrites.ts       the _redirects rules: shellRules / builtRules /
                    formatRedirects / cloudflareCounts, and parseRedirects /
                    rewriteFor, which apply them — pure functions
  headers.ts        the headers option: headersRefusal, formatHeaders (the
                    _headers file), headersPlugin (vite dev and preview, and
                    the api a host adapter reads) / declaredHeaders
  static-host.ts    resolveStatic / readRules — what a static host serves for
                    a URL of a static build; serve and vite preview share it
  documents.ts      sitemap / redirectPage — the two files the build writes
                    itself rather than taking from the handler, escaped as
                    markup; clientFiles — the list a navigation links ahead
                    of a payload; asFile / policyProblems — a page as a file: its
                    nonce off, its Content-Security-Policy <meta> with the
                    framework's hashes; writtenOutsideScripts — what a
                    layout wrote into a shell, outside its scripts
  static-file.ts    safeJoin — request pathname → path inside the build output
                    (pure); isFile
  encoding.ts       which content coding a request gets, what is worth compressing
  server-mode.ts    serverMode: the handler built with every dependency in it,
                    dist/server.js bundled from serve, and the client
                    precompressed
  precompress.ts    the client build's .br / .gz copies, written at build time
  serve.ts          ./serve: the node:http server (static files + handing off to
                    the handler; a static build as a static host)
  vercel-output.ts  the build as Vercel's Build Output API directory, either mode
  vercel.ts         ./vercel: the plugin that writes it
  cli.ts            bin k8ordo: `k8ordo generate`, .k8ordo/ from the resolved
                    config through the engine plugin's api, building nothing
fixtures/
  build.ts          failedBuild / compiledBuild / devServer — a fixture built or
                    served with the built dist/vite.mjs, in this process
  <name>/           one application each, src/routes/ and what it imports
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
