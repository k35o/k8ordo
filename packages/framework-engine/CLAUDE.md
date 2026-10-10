# Agent guide — packages/framework-engine

`@k8ordo/framework-engine` — the machinery both of `@k8ordo/framework`'s
modes are built on. **Private**: it is never published. `@k8ordo/framework`
bundles it into its own entries at pack time (`deps.alwaysBundle` in its
`vite.config.ts`) and copies `dist/runtime/` — the three environment
entries — beside it, then tells the engine where they landed
(`EngineHost.runtimeDir`) and which mode the application chose
(`EngineHost.mode`). Nothing outside this repository can resolve the name.

The framework's job is to make the application's structure a checkable form:
`routes/` is the pathname space and holds nothing else, execution boundaries
are declared with React's own `'use client'` and enforced, and the type wiring
between the app and `@k8ordo/router` / `@k8ordo/state` / `@k8ordo/i18n` is
generated rather than hand-written. The shared discipline (React 19 / RSC assumed, Baseline
newly available only) is in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

## Commands

```bash
pnpm test          # unit (node) + browser (Chromium, Firefox and WebKit via Playwright)
pnpm build         # vp pack (@k8ordo/framework bundles the result)
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **The filesystem stays at the edge.** `parseRouteTree` is a pure function
  over a list of paths, so the grammar's rules are what get tested, never the
  disk. Anything that reads directories is a thin wrapper around it.
- **`routes/` has no private names.** Every directory is a URL segment, a
  `_`-prefixed one included, and every file is a route file or an error;
  components, data and helpers live outside `routes/`. Only `.`-prefixed
  names are skipped, because the system and editors leave them behind
  (`.DS_Store`, swap files) and a build must not fail over one.
- **Every problem is reported, not just the first.** Parsing collects
  `Problem[]` and returns them with a best-effort tree; the plugin decides how
  to present them. A build that fails should name everything wrong at once.
- **One structure, two consumers.** `buildTable` builds the route table
  generically over what a route file resolves to — identifiers when emitting
  source, real components when a test hands the result to the router's own
  `defineRoutes`. That is why the integration test can prove the emitted table
  matches correctly without evaluating generated text.
- **The generated table is ordinary source.** It uses the router's public API
  — through `@k8ordo/framework/generated`, so the generated files never name
  the router — and would be identical to what someone wrote by hand from the
  same directories — reviewable in a diff, with no private hooks into the
  router. `register.gen.ts` augments `Register` on that entry; the
  re-export carries the merge through to the router's own `Register`.
  `fixtures/build.ts` aliases `@k8ordo/framework/generated` to
  `@k8ordo/router`, since this package cannot depend on the one that
  bundles it.
- **The locale set's `Register` is generated from `src/i18n.ts`.**
  `localeSetOf` (`generate/write.ts`) looks for it only in an application
  whose `package.json` lists `@k8ordo/i18n` and from whose root the package
  resolves: the manifest, because `@k8ordo/ui` makes it a peer that npm
  hoists into applications that never use it — whose own `locales` would
  then make every locale `never`; the resolution, because the augmentation
  names the package and TypeScript refuses one it cannot find. When
  `src/i18n.ts` exports `locales`, read with `exportsOf` as a route file's
  exports are (nothing is imported; a type-only export and `export *` do
  not count; the file is parsed as `.ts`, not TSX), `register.gen.ts`
  imports `locales` type-only from it, extensionless like the table's
  imports, and augments `@k8ordo/i18n`'s `Register` with
  `locale: LocaleOf<typeof locales>`. When the file is there without that
  export, nothing is generated for i18n and `generate` returns a warning
  the plugin logs once, since every message would otherwise compile
  unchecked without a word. An application with no `src/i18n.ts` gets
  neither and writes the augmentation by hand, as one outside the framework
  does. `watchChange` regenerates on every change to `<root>/src/i18n.ts`
  (Vite already watches the root) and leaves the route table's modules
  alone then, since only the type-only `register.gen.ts` can change. A
  hand-written augmentation left in an application still compiles:
  TypeScript accepts a property declared twice with one type.
- **Declaration order is load-bearing.** `not-found.tsx` is emitted last in
  its branch because the router matches in declaration order; every route the
  app actually declared has to out-rank the catch-all. Literal directories are
  emitted before parameters for the same reason — a directory tree has no
  order of its own, and the alphabet would put `[slug]` before `about`.
- **Shadowing is checked only on a grammatical tree.** `unreachableRoutes`
  builds URLPatterns from directory names, and a name the grammar rejected is
  not a pattern — running it on a broken tree throws instead of reporting. So
  a build with grammar problems names all of those at once, and shadowing on
  the next run.
- **The host is named once.** `FRAMEWORK` (`src/host.ts`) is the package
  the application installed — the only name resolvable from the project root
  once the engine is bundled — so the generated files' banner and
  `.gitignore`, the optimizer's `include` entries, and any message that tells
  a person what to install say `@k8ordo/framework`, never this package.
  `EngineHost.mode` (`'static' | 'server'`) is what differs between the two
  modes, and reaches the runtime as `import.meta.env.K8ORDO_MODE`.
- **The browser holds no route table.** `runtime/app-router.tsx` claims every
  same-origin URL and learns from the answer; anything that is not a payload
  (`runtime/is-payload.ts`) becomes a document load, which is also the
  recovery path when a render fails. The client router's "unmatched pathnames
  are not intercepted" does not apply here.
- **A server edit under `vite dev` reloads the payload, not the document.**
  The RSC plugin tells the browser `rsc:update` and leaves the rest to the
  framework: `app-router.tsx` loads the current URL's payload again, drops
  what it prefetched, and renders the new tree in a transition, so client
  state survives the way Fast Refresh keeps it. `import.meta.hot` is spelled
  out at every use there — Vite gives a module its HMR context only where the
  source says it, and a destructured `hot` (what a lint autofix suggests)
  silently turns the listener off. `examples/static-basic`'s `dev.test.ts`
  edits a page under a running dev server to hold this. The route table is
  regenerated in `watchChange`, which Vite awaits before moving a change
  through the module graph, and hard-invalidated after: the update only
  soft-invalidates it, and the old table would import a deleted page.
- **A prefetched page is used once, briefly, and never across an action.**
  `app-router.tsx` listens on the document (capture phase) for `pointerover`,
  `focusin` and `pointerdown` on a link `prefetchTargetOf` accepts — same
  origin and under the base, no `download`, no other `target`, not the page on
  screen, no `data-k8ordo-prefetch="false"` on it or the nearest element
  carrying the attribute — and reads that page's payload the way a navigation
  would (`fetchPage`, the parse included, so the client components it names
  are imported too). `createPrefetchCache` hands each load to the next
  navigation of that page within `PREFETCH_LIFETIME` (30 s from the start) and
  forgets it; a failed load is forgotten at once, and a Server Action's answer
  forgets everything. A load forgotten untaken is aborted, and a taken one is
  aborted by the taking navigation's signal, which is what keeps the router's
  "a superseded navigation's fetch is cancelled" true for a prefetched page.
  Keep it single-use: a page taken from the cache twice would show a
  server-mode page as it was when first hovered. No Speculation Rules —
  Chromium only.
- **A tree once applied keeps its request.** A payload resolves once its top
  arrives; a page that awaits its data arrives later, inside a tree already
  applied. Cancelled then, the request throws its abort inside that page,
  where `Recover` takes it for a failure and loads the document. So the
  signal a payload was fetched under — a navigation's, or a prefetch's —
  cancels it only until its tree is applied (`hold` unties it), and
  `AppRouter` cancels it once the tree is neither the one asked for nor the
  one on screen. The router's "a superseded navigation's fetch is cancelled"
  still holds, one render later. `runtime/streaming.test.ts` overtakes such a
  navigation with a click, with Back and with a search.
- **The `rsc` and `ssr` entries are `.js` ES modules in either mode.** They
  are pinned to `[name].js`, and `buildApp` writes `package.json`
  (`type: module`) in the directory the two outputs share, refusing one
  that holds the application, for the names the framework imports them by
  whatever the application's `type`; why, and what tests it, is in
  `packages/framework/CLAUDE.md`.
- **Everything inside is in the table's terms; Vite's `base` is at the
  edges.** The handler takes the base off the request (`withoutBase` from
  the router; a URL outside it is a plain `404`) before anything else reads
  the pathname, so payload paths, redirects, the match and `pathname` never
  see it; a `redirect.ts` target gets it back in front (`locationOf`), while
  a Server Action's `redirect(to)` is a URL and is sent as given. The client
  claims only same-origin URLs under the base, and `mount` compares the
  payload's `pathname` with `location` minus the base. `entry.rsc` exports
  `base` (`import.meta.env.BASE_URL` as built) for `serve`, and the plugin
  refuses a base that is not a path from the root (`'./'`, another origin),
  under which no URL says which page it is.
- **Hydration reads the payload the HTML was rendered from.**
  `runtime/entry.ssr.tsx` injects the RSC stream into the HTML and
  `runtime/entry.browser.tsx` reads it back; nothing refetches on load, which
  is what lets a prerendered `404.html` come alive.
- **Only HTML rendered for the browser's pathname is hydrated.**
  `runtime/mount.ts` compares the payload's `pathname` with `location`
  (normalized as `usePathname` normalizes) and renders anything else afresh
  with `createRoot`. That is `404.html`, rendered once under the build's
  sentinel, and a fallback.tsx's shell, rendered for `/ja/posts/!fallback`
  and served at `/ja/posts/3`: a component that reads the URL as it renders
  (`@k8ordo/i18n`'s messages) cannot agree with it at the visitor's URL, and
  a failed hydration regenerates the page anyway, reported as an error and
  with the server's `<title>` left behind in `<head>`.
- **A payload names the client it was rendered for.** `Payload.client` is
  the URL of the script the page's HTML loads (`getClientEntryUrl()`, which
  the RSC plugin exposes to the SSR environment only, so the RSC entry reads
  `clientEntry` from the SSR module for every payload, not only for HTML).
  `entry.browser.tsx` records the hydration payload's as the document's
  (`setDocumentClient`), and `app-router.tsx` never renders a navigation
  payload or a Server Action's answer that names another: that comes from a
  deploy the tab predates, its tree may hold client references the running
  script has no entry for, and rendering them fails inside the page's
  `error.tsx`, where `Recover` never sees it. The document is loaded again
  instead. The URL rather than an id minted per build: its content hash
  leaves open tabs alone across a deploy that changed nothing in the browser,
  and the build output stays reproducible.
- **Hydration starts once the stream is on screen.** `entry.browser.tsx`
  waits for `whenRevealed()` (`runtime/revealed.ts`): no Suspense boundary
  still marked `$?` or `$~` in the document. A boundary hydration meets
  before React has moved it in is one React renders again on the client as
  soon as a context above it changes, and the server's copy of what it
  hoisted (a `<title>`) stays behind. The cost is the page responding later
  than its shell paints, and a background tab hydrating when it is shown.
- **A `paramsSchema` export is found by parsing, run before render.**
  `generate/write.ts` reads each page/layout and asks Vite's parser
  (`parseSync`, oxc) for the module's exports — an import would evaluate
  the page before anything is compiled, and a regex over the text mistook a
  code sample for the export and missed a destructured one; `emit.ts`
  imports it beside the component, checks it with `satisfies
ParamsSchemaFor<pattern>`, lists per page pattern the schemas along its
  stack in `paramSchemas`, and types the page by them. `runtime/params.ts`
  runs them synchronously inside `routes.match`'s `accept`, so a refused
  value is a pattern that did not match and the catch-all answers under 404.
  A catch-all is never refused: the schemas of the layouts above its
  not-found (`catchAllSchemas`, apart from `paramSchemas` because the router
  types pages and links by those) run through `parseCatchAllParams` for what
  they write, and the not-found renders in their context when all accept, in
  none when one refuses. It and every layout receive strings.
  Each pattern's schemas run in an async context of their own, and the
  guards, the Server Action a `POST` carries and the render all run inside
  the answering pattern's (`enter`): a schema may write there
  (`@k8ordo/i18n` records the accepted locale, so an action posted from
  `/ja/…` builds its messages in `ja`), and neither a refused pattern's write
  nor any other reaches the handler's caller, which under static mode
  is one context for every page.
- **Only a page that declared it reads the search.** A page exporting
  `search` (a `@k8ordo/state` url schema) is found by parsing, like
  `paramsSchema`; the generated table reads it through state's
  `urlReader` in `searchReaders`, types the page's `search` by what that
  returns, and the generated `Register` carries it for `PageProps` — which is
  why the generator refuses the export in an application that does not
  depend on `@k8ordo/state`. The handler hands the leaf what it read from
  the request's own search (a payload is asked for with the page's search on
  its URL) and puts the search it was rendered with on the payload
  (`Payload.search`, absent for every other page); `app-router.tsx` keeps the
  one on screen and answers the router's `refresh` with whether a
  same-pathname navigation moved it, so such a page loads again in place and
  every other page keeps the router's no-load shortcut. Static mode
  refuses the export (a file is the same whatever the search holds).
- **`loading.tsx` is the router's `loading`.** The generator puts it on its
  branch (a page with one becomes a branch of its own, and a root one makes
  the root a branch); the router makes it a `<Suspense>` in the stack, after
  the layout and the `error` boundary. Nothing keys it: a page change under
  one already showing keeps the page, as every page change does, and the
  router's `usePendingPathname()` is what says one is under way.
- **`error.tsx` is the router's `error`; `redirect.ts` holds its place in
  the table.** The generator puts an error file on its branch (a page with an
  error becomes a branch of its own), and a redirect in the table the way it
  puts a `route.ts` — `answered` holds its place, so it matches in
  declaration order, literals before params — with its target in
  `redirects`, keyed by pattern. The handler, having matched a redirect's
  pattern, answers a `GET` or `HEAD` with it, before the guards, and anything
  else with a `405`; it reads the params again from the pathname
  (`resolveRedirects`), because the router hands them decoded and a target
  moves a segment as the URL spelled it. A Server Action's
  `redirect()` throws a `Symbol.for`-branded `Redirect` — never checked by
  `instanceof`, because `@k8ordo/framework` holds two copies of this module —
  and the handler answers 303 (no JavaScript) or a payload with `redirect`.
- **A guard answers or adds, never rewrites.** `guard.ts` is a slot of the
  grammar but not of the router's table: the generator lists, per pattern,
  the guards along its directories (`guards`, outer first; `/*` always
  carries the root's, for a URL nothing answers), and the handler runs them
  after the params schemas matched — inside the answering pattern's `enter`
  — and before the Server Action and the render (`runtime/guard.ts`). A
  `redirect.ts` is answered before them. The request in progress lives in
  an `AsyncLocalStorage` on `globalThis` under
  `Symbol.for('k8ordo.request')` (`runtime/request-scope.ts`), because
  `@k8ordo/framework` holds two copies of this module — the runtime the handler is
  built from and the `./server` entry the application imports
  `responseHeaders()` from — and both must see the one request. Its phase
  says what is running — `guard`, `action`, or the `render` — and the
  response API (`cookies()`, `responseHeaders()`, `requestHeaders()`) throws
  in the render and outside a request, because a page is a render. What a
  guard or an action adds goes onto whatever the handler answers
  (`answer()`, a new `Response`, since a redirect's headers cannot be
  written); the cookie jar (`runtime/cookies.ts`) is one per request, so a
  guard's write is what an action after it reads, and each write is one
  `Set-Cookie` line, the last one per name, path and domain. Static mode refuses
  `guard.ts` (by name at build, per module in `vite dev`), reading the slot
  through `slotOf`.
- **A `route.ts` holds its place in the table and answers outside it.**
  It is a slot of the grammar that answers its directory's URL, so it
  conflicts with a `page.tsx` or a `redirect.ts` there and counts as a
  declared URL. The generated table puts a component that renders nothing
  (`answered`) in its place — so it matches in declaration order, literals
  before params, with the pages — and lists the module, imported whole, in
  `routeModules`. The handler, having matched, answers it from there
  (`runtime/route.ts`): a payload request gets a plain `404` (a route has no
  payload), a method it does not export a `405` with `Allow`, `HEAD` falls
  back to `GET` without the body, the guards run first, and the handler runs
  in the `route` phase, so it writes cookies. No same-origin check: what
  posts to a route.ts is not a form on this site. The generator reads its
  exports (`readExports`, oxc) and refuses one that exports no method.
  Static mode writes each as the file its `GET` answered and refuses
  any other method export, by name at build and per module in `vite dev`.
- **A page's `notFound()` is its answer, and a document waits for it.**
  `notFound()` lives in `@k8ordo/router` (re-exported by
  `@k8ordo/framework`) and is recognised by its `Symbol.for` brand. The handler
  renders a page through `watchPage` (`runtime/page-watch.ts`): the page's
  own function is called from inside the RSC render's call, so `use`,
  `cache` and suspensions behave as for the page itself, and what it
  returned settles `settled` (with the rejection's reason — the render's
  `onError` hears of an async rejection only later). A document and a
  `HEAD` wait for that, for a `notFound()` reaching `onError`, or for the
  stream to end (a layout that never renders its children) — under
  static mode for the whole stream — before sending anything; a
  `notFound()` then aborts that render and renders what the table answers
  for the pathname plus `NOT_FOUND_SEGMENT` (only a catch-all may answer,
  and `/:locale/*` does not match `/en` itself), under a 404. A payload
  does not wait: `onError` turns `notFound()` into the digest
  `NOT_FOUND_DIGEST`, and `PageBoundary` (`runtime/page-boundary.tsx`, a
  client boundary around every page, inside any `error.tsx`) answers it
  with a document load when the tree came from a navigation, and hands it
  on to `error.tsx` otherwise — loading the server's document again would
  only bring the same page back. Under static mode the 404 carries
  `NOT_FOUND_HEADER`, so the build tells a page's `notFound()` from a
  refused param. The root's `onCaughtError` (`reportCaught`) reports what
  React would, except a `notFound()` `PageBoundary` sends back, so an error
  monitor reading the console does not count every 404 a link reached.
- **A document's page is in place in its HTML.** `watchPage` renders
  `PageShown` behind what the page returned, in the page's own row of the
  payload (a navigation's payload too, so its tree has the document's
  shape), and under `'server'` `renderHtml` lets the HTML be read only once
  `PageShown` has rendered there. The handler waiting for `settled` is not
  enough: the page's row reaches the SSR render a tick later, and a
  `loading.tsx` boundary still pending when the shell is read is outlined —
  its fallback is all a visitor without JavaScript, or a crawler, sees.
  `progressiveChunkSize` is infinite in both modes, so a boundary complete by
  then is never outlined for its size. What the page put under a
  `<Suspense>` of its own still streams; a component inside the page that
  awaits data outside one keeps the `loading.tsx` boundary pending, and its
  fallback shows.
- **A reader giving up is not a failure.** A render whose stream is cancelled
  — a visitor who left, a navigation overtaken — reports everything still
  pending to its `onError`, with whatever reason the host gave (Node's
  `Premature close`, Bun's "aborted without a reason", Deno's "resource
  closed"). `noticeCancel` (`runtime/cancel.ts`) wraps the payload and the
  HTML so the cancel is told first: the RSC render's controller is aborted,
  which its `onError` already ignores, and the SSR render's `onError` stays
  quiet. A render that failed while its reader was still there is reported
  as before.
- **The RSC plugin's own warning is dropped.** It imports every
  `'use server'` module dynamically (`virtual:vite-rsc/server-references`),
  so a Server Component importing an action warns
  `INEFFECTIVE_DYNAMIC_IMPORT` on every build. The rsc environment's `onLog`
  drops that warning when the plugin's module is the only dynamic importer.
- **The framework signs its own inline scripts, and decides no policy.**
  Every request's scope holds a fresh nonce (`withRequest`, 128 random bits);
  `renderHtml` hands it to React's SSR (`nonce`: the bootstrap module and
  React's inline scripts), to the SSR Flight client (its preloads), and to
  `rsc-html-stream` (the payload written into the HTML). `nonce()` reads it
  in every phase, the render included — signing a script is not writing the
  response — so a guard names it in the header it writes and a layout signs
  a script of its own (`<ColorSchemeProvider nonce>`). Under
  static mode the HTML also says it in `NONCE_HEADER`, and the build
  takes it off the file and names what it signed by hash; static mode refuses
  `@k8ordo/framework/server` and with it `nonce()`, since what an application signed with it would land
  in the payload and make every build differ. The handler signs with
  `signingNonce()`, which works in both modes: under `'static'` it runs every
  answer inside `writingFile`, where the public `nonce()` and the response
  API refuse — that is what catches a dependency's call, which the build
  never compiles and so cannot name.
- **The request reaches a page only under a server.** `K8ORDO_MODE` is
  defined by the host; the handler attaches `request` (headers, cookies) only
  under `'server'`, and the generator emits the field only there; under
  `'static'` a page gets `fileRequest`, whose non-enumerable getters refuse,
  so a page read past the types names the mode. Under
  `'static'` the handler also buffers the HTML and answers 500 with the
  thrown message when a page failed to render, so the build stops naming the
  page instead of writing it. A throw inside a Suspense boundary leaves the
  HTML render standing and is known only from the RSC render's `onError`; a
  throw with no boundary above it rejects the HTML render itself, with the
  SSR copy of the error — React's generic production message — so the
  handler catches that and answers with what `onError` recorded, falling back
  to the rejection's own error only when nothing was recorded (a client
  component threw). `renderHtml`
  also writes every Suspense boundary in place — it waits for `allReady` and
  outlines nothing — so a file never carries a hidden segment for a script to
  move in after hydration has started.
- **The handler owns the methods.** A page answers `GET`, `HEAD` and `POST`,
  and anything else with a `405` and `Allow` (a `route.ts` answers what it
  exports, a `redirect.ts` `GET` and `HEAD`) — here, not in `@k8ordo/framework`'s
  `serve`, because a host that calls the built handler directly has no
  `serve` in front of it. `HEAD` gets a `null` body: a not-found is answered
  before anything renders, and a page runs only as far as its own component,
  which may say `notFound()`; its render is aborted, not streamed. Static mode only ever
  sends `GET`.
- **A `fallback.tsx` is a shell, and only a build into files has one.**
  Under `'static'` the generated table lists `fallbacks`, per page pattern
  with one: the component, the params a shell may leave to the browser
  (`open`, those no layout above it receives — `fallbackShapes`, the one
  walk the grammar, the emitter and the framework's `paths.ts` all read),
  and the layouts' schemas. Under `'server'` it is `{}` and nothing of a
  fallback.tsx is imported. A request is a shell request when its pattern
  has an entry and only open params hold `FALLBACK_SEGMENT` (`!fallback`):
  the URL is the shell pathname itself, so the build, `vite dev` (after the
  framework's rewrite) and a host reach it the same way
  (`runtime/shell.ts`). The page's schema never runs for it — there is no
  value — and the layouts' run over the params it fills, a refusal walking
  on as for a page. Layouts receive those params and the shell pathname;
  the fallback.tsx receives nothing and renders inside `FallbackBoundary`,
  under the router's `BrowserPathname`, so a URL read below it waits for the
  browser and the layouts stay HTML. Under static mode the answer says
  `SHELL_HEADER` (the pattern that rendered it), which the build compares
  with the one it asked for; a `notFound()` while it renders is a page's
  404 (`NOT_FOUND_HEADER`), which the build refuses.
- **A shell carries its not-found, and shows it in place.** The nearest
  not-found is rendered into `Payload.notFound`, in the shell's render and
  context — the nearest that takes none of the params the shell leaves
  open, since one that does would render `!fallback` as the value. A client `notFound()` under `FallbackBoundary` calls the
  `ShowNotFound` that `AppRouter` provides, which puts that tree on screen
  in the shell's place, URL and history untouched — not while a navigation
  is loading (the URL commits before the next tree, and the shell reads the
  URL it is being left for; `AppRouter` counts its loads, since
  `usePendingPathname` clears after the boundary's `componentDidCatch`), and
  never over a tree applied since. The boundary clears on a new
  `NavigationGeneration`, as the router's does, so the same shell for the
  next value renders again; the request it came on is kept while either of
  its trees is on screen; `reportCaught` stays quiet about a not-found it
  answered. `app-router.browser.test.tsx` holds each of these.
- **One pattern walk.** `declaredPatterns(tree)` is the order the matcher
  tries patterns — pages and redirects, literals before params, the
  catch-all last in its branch — and everything that asks "which URLs does
  this site have" reads it: the shadow check here, `patternsOf` in
  `@k8ordo/framework`'s static mode. `decodePathname` is likewise the one
  decoding both modes use before a pathname may name a file.
- **A route file's props are checked in the generated table.** `routes.gen.ts`
  emits `satisfies Page<'/products/:id'>` / `satisfies Layout<'/:locale'>`
  per file, so a mistyped param name is a type error without any route file
  importing a helper — the layout's pattern is the prefix every route below
  it shares. `tsc` reports it in the generated file; `vite build` does not
  type-check, so the build itself still passes.

## Layout

```
src/
  grammar/tree.ts            the routes/ grammar: parse + validate (Problem[])
  generate/emit.ts           buildTable (structure) + routes.gen / register.gen
  generate/write.ts          the filesystem edge: scan, generate, write
  plugin/core.ts             the Vite plugins: RSC pipeline, virtual routes
  plugin/server-actions.ts   which modules declared 'use server'
  runtime/entry.{rsc,ssr,browser}.tsx  the three environments
  runtime/app-router.tsx     the client half: navigation + payloads, and whether this document can render one
  runtime/payload.ts         what a page is on the wire (tree, pathname, client, action result)
  runtime/payload-path.ts    where a payload lives: /x → /x/index.rsc
  runtime/is-payload.ts      whether an answer is a payload or a document load
  runtime/prefetch.ts        which link to fetch ahead, and how long a fetched page stays usable
  runtime/revealed.ts        when every streamed boundary is on screen
  runtime/recover.tsx        a failed client render falls back to a document load
  runtime/reload.ts          location.reload, the one seam a test can watch
  runtime/params.ts          runs the paramsSchema exports along a matched stack, and above a not-found
  runtime/mount.ts           hydrate what was rendered for this pathname, render anything else afresh
  runtime/pathname.ts        decodePathname, before a pathname may name a file
  runtime/redirect.ts        redirect(), what a Server Action throws — bundled into the ./server entry
  runtime/redirect-file.ts   where a redirect.ts sends a pathname the table matched to it
  runtime/request.ts         the read-only request a page receives
  runtime/request-scope.ts   the request in progress: phases, cookies() / responseHeaders() / requestHeaders(), nonce(), answer()
  runtime/cookies.ts         the per-request cookie jar and its Set-Cookie lines
  runtime/guard.ts           Guard / GuardContext, runGuards (outer first, first Response ends it)
  runtime/route.ts           ROUTE_METHODS, which export answers a method, 405, running it in the route phase
  runtime/render.tsx         the matched stack, nested through children; the framework's own not-found, inside the root layout
  runtime/page-watch.ts      a page called as the render calls it, its answer watched
  runtime/page-boundary.tsx  a navigation's late notFound() → a document load; anything else on to error.tsx
  runtime/fallback-boundary.tsx  around a fallback.tsx: the URL read in the browser, its notFound() shown in place
  runtime/says-not-found.ts  whether a caught error is notFound(), thrown or as its digest
  runtime/shell.ts           whether a matched request is a shell, and the params it fills
  runtime/page-shown.tsx     rendered behind the page's own content: tells the HTML render the page is in place
  runtime/cancel.ts          a stream whose reader giving up is told first, before the render behind it hears
  runtime/virtual.d.ts       types of virtual:k8ordo/routes and K8ORDO_MODE
  host.ts                    Mode, EngineOptions and FRAMEWORK, the package the engine is bundled into
  index.ts
  server.ts                  the request API @k8ordo/framework/server re-exports, kept off index.ts,
                             whose types reach vite and React
fixtures/
  build.ts                   builds an application below as the mode does —
                             'server' unless told, a static one into
                             dist-static/ — from this package's source, and
                             imports the handler it wrote
  bare-not-found/routes/     an application with no not-found.tsx, which
                             runtime/not-found.test.ts opens in each engine
  redirect-beside-literal/routes/  a [slug]/redirect.ts beside about/page.tsx,
                             whose handler runtime/redirect-order.test.ts calls
  fallback/routes/           pages with a fallback.tsx (a server one, one that
                             says notFound(), a 'use client' one, one with a
                             not-found.tsx beside it) under a layout whose
                             schema refuses a value, which
                             runtime/fallback.test.ts builds in both modes
  streaming/routes/          pages that await their data, with and without a
                             loading.tsx, which runtime/streaming.test.ts streams
                             to each engine; state.ts stands in for @k8ordo/state
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
