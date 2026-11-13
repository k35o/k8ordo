# Agent guide — packages/framework-engine

`@k8ordo/framework-engine` — the machinery both of `@k8ordo/framework`'s
modes are built on. **Private**: it is never published. `@k8ordo/framework`
bundles it into its own entries at pack time (`deps.alwaysBundle` in its
`vite.config.ts`) and copies `dist/runtime/` — the three environment
entries, and `runtime/server.ts`, which its `./server` entry points at
rather than bundling, so an application's import and the handler are one
module — beside it, then tells the engine where they landed
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
- **One generation, three callers.** `buildStart`, `watchChange` and the
  plugin's `api.generate()` (`EngineApi`) all run `generate()` from
  `generate/write.ts` with the options `configResolved` read. `buildStart`
  awaits the api itself, so a build and `@k8ordo/framework`'s
  `k8ordo generate`, which resolves the config and calls the api without
  building, write the same files and refuse a broken `routes/` with the
  same message, every problem in it.
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
- **The browser loads `src/i18n.ts` before anything renders.** A locale set
  registers itself as it is evaluated, and `@k8ordo/i18n` reads no locale
  where none has (`packages/i18n/CLAUDE.md`), so `entry.browser.tsx`
  imports `virtual:k8ordo/locales`: the file when the root has one, an
  empty module when not. The server needs nothing of the kind: the route
  files that take a locale import the set.
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
  `EngineOptions.headers` reaches it the same way, as
  `import.meta.env.K8ORDO_HEADERS`: the handler's entry exports it as
  `headers`, for whatever serves the build's files, and under `'server'`
  adds each to an answer that has no header of that name (`withDeclared`).
- **React's plugin comes with the engine, and only `reactCompiler` reaches
  it.** `engine()` returns `@vitejs/plugin-react` beside the RSC plugin, so
  an application never adds one and Fast Refresh is wired either way.
  `EngineOptions.reactCompiler` turns on the plugin's `compiler` (React
  Compiler in Rust, `oxc-transform-react`), and none of the plugin's own
  options pass through: they are `@experimental`, typed `any` unless
  `oxc-transform-react` is installed, and would bring Vite's types into the
  `./server` declarations, which share `EngineOptions`'s chunk (`host.ts`).
  The plugin compiles only the environments whose consumer is the client,
  so Server Components and the HTML render of client components stay as
  written; `@k8ordo/framework`'s `refusals.test.ts` reads that from a
  build's source maps. `oxc-transform-react` is `@k8ordo/framework`'s
  optional peer, not this package's.
- **An `.mdx` module gets the RSC plugin's CSS wrapper too.** The RSC
  plugin wraps the exported components of a module that imports CSS so the
  page links it, and only for a file named `.js`, `.jsx`, `.ts` or `.tsx`;
  the test is in the plugin, with no option to widen it. An `.mdx` an
  application's plugin compiled is passed over, and its CSS reached a page
  only where every import of it carried `?vite-rsc-css-export=default`.
  `plugin/mdx-css.ts` runs the plugin's own `transformRscCssExport`
  (`@vitejs/plugin-rsc/plugin`) on a compiled `.md`/`.mdx` that imports CSS
  statically, under the plugin's own rule for which exports to wrap, and
  leaves an id carrying the query to the plugin. It sits before `rsc()` in
  the array: the wrapper calls `import.meta.viteRsc.loadCss()`, which a
  later transform of the plugin replaces. `runtime/mdx-css.test.ts` builds
  `fixtures/mdx-css/` with a stand-in compiler emitting what an MDX compiler
  does (a default `function MDXContent`, the file's imports kept).
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
- **A page rendered per request is used once, briefly, and never across an
  action; a page written into a file is kept.** `app-router.tsx` listens on
  the document (capture phase) for `pointerover`, `focusin` and
  `pointerdown` on a link `prefetchTargetOf` accepts — same origin and under
  the base, no `download`, no other `target`, not the page on screen, no
  `data-k8ordo-prefetch="false"` on it or the nearest element carrying the
  attribute — and reads that page's payload the way a navigation would
  (`fetchPage`, which waits for the client components it names, so those
  are loaded too). Every load goes through `createPageCache`, in one of two
  kinds chosen by `payloadsAreFiles()` (`K8ORDO_MODE === 'static'` and not
  `DEV`; read at each use, since a test switches it). **Renders** (server
  mode, and `vite dev` in either): a prefetch is handed to the next
  navigation of that page within `PREFETCH_LIFETIME` (30 s from the start)
  and forgotten, a navigation's own load is not held, and a Server Action's
  answer forgets everything. Keep it single-use: a page taken twice would
  show a server-mode page as it was when first hovered. **Files** (a static
  build): every load is held — a prefetch's, a navigation's own, and the
  document's page (`keep`, from what `AppRouter` arrived with) — with no
  lifetime, and handed to every navigation, going back and forward
  included, up to `KEPT_PAGES` (50), the least recently used given up first
  (never one a navigation waits for). In both, a failed load is forgotten at
  once; a load forgotten while still on its way and with nobody waiting is
  aborted; and a navigation that took a load on its way aborts it with its
  signal unless another navigation still waits for it, which is what keeps
  the router's "a superseded navigation's fetch is cancelled" true for a
  prefetched page. Among files a settled load is never aborted — its tree
  may be on screen. Under files and a coarse primary pointer
  (`(pointer: coarse)`, followed through `change`), `prefetchInView` also
  prefetches the links on screen: an `IntersectionObserver` over every
  `a[href]` (a `MutationObserver` observes the ones React adds and
  unobserves the ones it removes, which an observer would otherwise keep
  alive), one at a time in the order they came into view, a link that left
  before its turn passed over, at `priority: 'low'` (intents fetch at
  `'auto'`). A link waits its turn only once it has stayed on screen
  `IN_VIEW_DWELL` (1 s: a link scrolled past, or one just come into view,
  is rarely the one tapped next), and nothing is fetched before the
  document's `load` event — a page hydrated earlier would share the
  connection with its own fonts and images — nor, under files, before
  `readClientFiles` has read the list (`AppRouter`'s callback awaits it),
  which would leave a page's files waiting for its payload to name them.
  One at a time, so a tap shares the connection with one prefetch at most,
  and with none once the router names the page change: `AppRouter` hands
  `usePendingPathname()` to `InView.pending`, and while it names a pathname
  nothing more starts and a prefetch on its way to another pathname is
  called off — its signal makes `PageCache.prefetch` forget the load that
  call started, unless a navigation already waits for it — and its link
  is put first in line for when the page is on screen. No
  `requestIdleCallback` (not in Safari), no Speculation Rules (Chromium
  only), no Network Information (not Baseline), and no viewport prefetch
  under renders, where each link would be a server render.
  `prefetch.test.ts` holds both kinds and the called-off prefetch;
  `prefetch.browser.test.tsx` the watching, on fake `setTimeout` for the
  dwell; `app-router.browser.test.tsx` the wiring in either mode.
- **A static build's client files are linked as the payload is asked for.**
  The static build writes `CLIENT_FILES_PATH` (`/client-files.json`, under
  the base; `ClientFiles` in `payload.ts`) from the `CLIENT_DEPS_HEADER` and
  `SERVER_STYLESHEETS_HEADER` of every HTML it wrote
  (`packages/framework/CLAUDE.md`). Under files
  `AppRouter` reads it once (`readClientFiles`, `priority: 'low'`; a list
  that cannot be read leaves nothing behind), and `fetchPage` links the
  page's files before its request leaves (`preloadClientFiles`, looked up
  by the payload's path without its search): a script as
  `<link rel="modulepreload">`, a stylesheet as `<link rel="preload"
  as="style">` through react-dom's `preload`, each once per document and
  none the document links already
  (a stylesheet it applied, preloaded again, is a fetch nobody uses), with
  `crossOrigin=''` as Vite's preload helper asks, so its later request is
  served from the preload, and at the payload's priority (`fetchPriority`):
  left to the default, a prefetch's scripts go at High and its stylesheets
  at VeryHigh, beside the navigation they were meant to speed up (with
  `low`, Chromium fetches the scripts at Low and takes a stylesheet down
  one step only, to High). A
  prefetch's client stylesheets are used as it loads the page's client
  components. A Server Component's stylesheet is listed too: unlisted,
  React preloads it from the payload's hints as the payload is read (the
  Flight server emits one for every `<link rel="stylesheet">` it renders),
  at the default priority, a round trip after the request — and a page
  change commits only once its stylesheets with a precedence have loaded,
  so a navigation nothing was prefetched for waited on that round trip.
  React's `preload` and nothing else: React takes a
  `<link rel="preload" as="style">` it did not insert itself for one
  already loaded (`preloadStylesheet` in react-dom 19.3), and commits the
  page without waiting, its stylesheet still on its way; its own it marks
  pending until `load`, and waits on. Its key is the `href`, so the hint
  for one the list linked adds nothing. Those of a page fetched ahead stay
  unused until it is visited, which Chromium warns about once per file.
  `<link rel="prefetch">` would not warn, and is not in Safari.
  A stylesheet is preloaded, not applied: the list may come from a newer
  deploy than the document, and its CSS would restyle the page on screen.
  The client component's own import applies a client one, and React a
  Server Component's as the page commits, as without the list.
  `client-files.browser.test.tsx` holds the reading and linking, and
  `examples/static-basic`'s `build.test.ts` that the built site links a
  page's files while its payload is held back, and shows a page only once
  its Server Component's stylesheet, held back, has loaded.
- **A tree carries the pathname it is the page of.** `Applied` holds it
  beside the tree (normalized, in the URL's terms; `null` in the HTML
  render), and `AppRouter` provides the deferred one under the router's
  `TreePathname` context for a page state to read the values of its own
  page while the URL already names the next. Every road that applies a
  tree sets it: a navigation with the URL it loaded, a Server Action's
  answer with the URL it was posted to (`answerAction`'s `url`), `vite
  dev`'s reload with the URL it fetched, and a shell's not-found with the
  shell's. Not
  `Payload.pathname`, which is in the table's terms and, for a shell, the
  shell's. `app-router.browser.test.tsx` holds the navigation and the
  action.
- **A Server Action's answer is not applied once a navigation has been.**
  The answer is the page the action was posted from, re-rendered, and it
  waits for its client components and what the page awaits outside a
  `<Suspense>`; applied after a navigation it would put the page left
  behind under the URL gone to. `answerAction` compares how many trees
  navigations (and `vite dev`'s reload) have applied with the count taken
  as the action was sent, and only hands back the value when they differ.
  Answers do not count, so actions called in a row apply in turn.
  `runtime/streaming.test.ts` holds both.
- **A tree once applied keeps its request.** A payload is applied before a
  page under a `<Suspense>` (its `loading.tsx`) has sent what it awaits, and
  that arrives later, inside a tree already applied — kept off the screen
  while the boundary is already showing a page. Cancelled then, the request
  throws its abort inside that page, where `Recover` takes it for a failure
  and loads the document. So the signal a payload was fetched under — a
  navigation's, or a prefetch's — cancels it only until its tree is applied
  (`hold` unties it), and `AppRouter` cancels it once the tree is neither the
  one asked for nor the one on screen — except among files, where nothing
  cancels it after that: the page stays in the cache, and cut short it would
  come back broken. The router's "a superseded navigation's fetch is
  cancelled" still holds, one render later.
  `runtime/streaming.test.ts` overtakes such a navigation with a click, and
  overtakes one into a page awaiting its data outside any `<Suspense>`, which
  is not applied before it arrives, with a click, with Back and with a
  search.
- **A tree is rendered once the client components it names have loaded.**
  The Flight client hands a client component over as a lazy element type
  and starts importing it as the payload is read; a render that meets one
  still loading suspends there, and the nearest `<Suspense>` shows its
  fallback — over the server's HTML on a first render, as soon as a
  context above a dehydrated boundary changes, and as a new page's
  `<Suspense>` in a navigation. `whenClientReady` (`runtime/client-ready.ts`) walks a
  payload's trees — element types and props, arrays, plain objects, rows on
  their way — and settles once every lazy type has loaded and every row
  has arrived, except, for `rows: 'leave'`, a row still on its way inside a
  `<Suspense>`, whose fallback stands in for it as a transition leaves it.
  The first document waits for everything (`'wait'`); `fetchPage`
  (navigations, prefetches, `vite dev`'s reload) and `answerAction` wait with
  `'leave'` before the tree is applied. It reads React's shared shapes only
  (an element's `$$typeof`, `type` and `props`, a lazy's `$$typeof`,
  `_payload` and `_init`, which throws a thenable while it waits): a React
  that changed them would end the wait at once and bring the flicker back,
  which `runtime/chunks.test.ts` sees in every engine.
- **The client build puts what every page loads in two chunks.** The
  client environment's `codeSplitting` has two groups: `index`, what the
  entry loads statically (Rolldown's `$initial` tag, priority 2), which keeps
  the entry chunk's name; and `frame`, the RSC plugin's client-reference
  group modules of the RSC entry's own chunk (priority 1) — the client
  components of every layout, error and loading file, which the table
  imports, and the framework's boundaries. Every page loads both, so a
  module either shares with a page is put there rather than split into a
  file every page then loads as well (Rolldown splits a module reached from
  two different sets of entries into a chunk of its own). The frame group
  names only the group modules and lets Rolldown add what they import as it
  does once the tree is shaken: a closure walked over `importedIds` goes
  through a module that only lists exports and pulls in what pages alone
  use. Which group modules are the frame's is read in the client build's
  `buildEnd` (`frameGroupsOf`), off the RSC plugin's manager (experimental,
  as `server-actions.ts` says): the RSC bundle's entry chunk's module ids,
  and each reference's `groupChunkId`, which the client build sets as it
  loads the reference groups, before it splits anything. Vite merges an
  application's `codeSplitting` with this one, so an application's group
  wins only with a priority above 2, its `manualChunks` is ignored, and
  `false` is overridden — `references/routing.md` says so.
  `runtime/chunks.test.ts` holds that a module the frame shares with a page
  lands in the frame's file, and that a page's part of a module listing
  exports for both stays in the page's file; `examples/static-basic`'s
  `build.test.ts` that the entry imports no file of its own; and
  `runtime/ssr-deps.test.ts` splits React off at priority 3.
- **The browser entry has no top-level await.** A chunk of client components
  imports what it shares with the entry from the entry's chunk, and so waits
  for the entry to finish evaluating; an entry awaiting those components in
  its evaluation would never finish. `entry.browser.tsx` does its waiting in
  `start()`, called and not awaited.
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
  claims only same-origin URLs under the base, and `renderedHere`
  (`runtime/mount.tsx`) compares the payload's `pathname` with `location`
  minus the base. `entry.rsc` exports
  `base` (`import.meta.env.BASE_URL` as built) for `serve`, and the plugin
  refuses a base that is not a path from the root (`'./'`, another origin),
  under which no URL says which page it is.
- **Hydration reads the payload the HTML was rendered from.**
  `runtime/entry.ssr.tsx` injects the RSC stream into the HTML and
  `runtime/entry.browser.tsx` reads it back; nothing refetches on load, which
  is what lets a prerendered `404.html` come alive.
- **Both entries render the same root.** `useId` derives an id from where
  its component sits among its siblings all the way up, and hydration keeps
  the HTML's attributes, so a sibling of the application only one entry
  renders gives every id below it one value in the HTML and another in the
  browser: a reference by id the browser makes (an `anchor-name` set from
  a ref, a lookup by `getElementById`) then misses the element. So
  everything at the root besides the application is in `DocumentRoot`
  (`runtime/document-root.tsx`), which both entries render around it: the
  SSR entry's `Root` and the browser's `AppRouter` are its only child, and
  `PageShownContext`, which only the SSR entry provides, is a context, which
  `useId` does not count. The browser renders its `<style>` too, with no
  nonce: React finds the HTML's by its `href` and keeps it.
  `runtime/hydrate-id.test.ts` compares the ids of a layout's and a page's
  client component in the HTML and once hydrated, from a static build, a
  server build and `vite dev`.
- **The SSR graph holds no browser Flight client.** `@vitejs/plugin-rsc/browser`
  installs its own loader for client references the moment it is imported,
  and the SSR one it replaces is what puts a client component's stylesheet
  (`preinit`) and script (`modulepreload`) into the HTML. `app-router.tsx` is
  rendered by the SSR entry too, so it imports nothing from there: the
  browser entry imports `runtime/browser-payloads.ts`, which hands it how a
  payload is read (`setPayloadReader`) and registers the Server Action
  callback that ends in `answerAction`. Whether the browser's loader won
  depended on the order the bundle evaluated the two; an application whose
  SSR entry evaluated `app-router.tsx` last shipped HTML with no client
  stylesheet at all. `runtime/client-css.test.ts` builds such an application.
- **The HTML render reads the payload, and walks it before rendering.**
  `renderHtml` starts `createFromReadableStream` in the component it renders
  (`Root`), never before `renderToReadableStream`, and renders `AppRouter`
  once `whenClientReady` has walked the trees it read. A client reference's
  `preinit` (its CSS, a stylesheet with a precedence) and `modulepreload`
  (its JS) reach the HTML only from inside React's SSR request: synchronously
  as it renders, or through the `AsyncLocalStorage` it runs its work in (the
  RSC plugin sets `globalThis.AsyncLocalStorage` in the `ssr` environment,
  which the edge build of `react-dom/server` reads as it loads). The plugin
  calls the two when a reference's module first loads in the process (in a
  build only) and when the Flight client reads one of its exports once it
  has loaded. Read before the render, a reference whose module loaded as the
  payload was read — the first page in the process to name it, a not-found
  or a module a Server Component imported alike — left no `<link>`. Read
  inside it but not walked, an element only passed in a prop and never
  rendered is read by nothing on any page after that first one, while the
  browser's first render waits for its script all the same. Static mode
  walks with `rows: 'wait'`, every row before the tree renders, and does not
  leave the links to the walk: the RSC render hands the RSC plugin's
  `onClientReference` (`renderToReadableStream`'s third argument, which its
  README marks experimental) a callback that keeps, per reference (its id
  and export name), the export's name and the manifest's `deps`; the handler
  reads the payload to its end — a not-found's too, whose rows the HTML
  render would not wait for — before the HTML render starts, and hands it
  what was kept; and `Root` asks React for each one's files before it reads
  the payload (`linkClientDeps`), as the plugin asks: the client entry's
  scripts at the default priority — which ones, only the plugin's manifest
  module says, read under the type the plugin exports for it — the rest
  low, the stylesheets under its precedence. React writes a file as first
  asked for, so the head is the same whichever modules had loaded. The
  walk does not open a Map, a Set, a promise, an iterator, an async
  iterable or a stream a prop holds. An iterator, sync or async, is handed
  over to run once and a stream to one reader, so walking either would
  spend it before the component sees it; a Map, a Set, a promise and an
  async iterable could be walked, and are not. So a server, which links
  only what the walk and the render read, links an element only such a
  container holds where its module first loads in the process (`apps/docs`
  lists it as not guaranteed). A server walks with `'follow'`: it waits
  only for the client components named in what has arrived, and walks a
  row still on its way once it arrives, in a
  continuation that inherits the request and runs before React renders
  what waited for the row, so its links come first — a stylesheet as a
  preload, React adding none once the shell is out. Waiting for such a row
  held the shell back: the walk sees the payload, not what renders it, so a
  `<Suspense>` a client component renders (a page's own, or the one an
  `error.tsx` puts above it) and an element only passed in a prop look like
  rows outside every boundary. A row that arrives once React has finished
  leaves no link; the browser loads it from the payload. Awaiting the walk
  (`use(ready)`) matters under `vite dev`, where a reference's links come
  only from a read after its module has loaded, which the walk makes once
  its wait ends. Ahead of `Root`, `DocumentRoot` writes one `<style>` of
  its own, empty (`STYLESHEET_ORDER_HREF`), under the precedence the RSC
  plugin links a Server Component's stylesheets with
  (`SERVER_STYLESHEETS`), and that is what keeps every Server Component's
  stylesheet — the root layout's first — before every client component's,
  however the page was reached. React orders the precedences in `<head>` as
  each is first asked for, and a static render asks for every client
  reference's before it reads the payload, so without it a file's head
  would have the client components' first; everywhere else they come last — a client navigation
  (a prefetch included) appends what it loads to the head while React puts
  a Server Component's new stylesheet after the last of its precedence, a
  server's streamed part and `vite dev` add theirs at the end. Under a
  server React signs the style with the answer's nonce
  (`nonce: { script, style }`); under static mode it carries none, because
  React then writes no `<style precedence>` that lacks the nonce, and an
  application cannot sign one in a file — the framework's build names it by
  hash instead (`packages/framework/CLAUDE.md`). No order is kept among
  the client references' own: a static head has them in the order the RSC
  render named them, which a Server Component waiting for data can change
  from one build to the next, a server in the order it read them, and a
  navigation in the order it loads them; an override between two goes by
  specificity. Nor is a stylesheet ever taken out: once loaded, by a page
  or a prefetch, it applies to every page after it in the tab.
  `formState` is read apart: React takes it as the render starts, and the
  RSC environment's value holds client components as references the SSR
  cannot render, so when the payload carries one (`carriesFormState`, a
  form posted without JavaScript) another branch of the stream is read for
  it first. `runtime/ssr-deps.test.ts` builds pages naming client
  components each of those ways — and, in static mode, in each of those
  containers, and in a not-found's promise that settles late — with React
  in a chunk of its own, so the client entry loads more than itself, and
  renders each twice, cold and loaded — in production, since a test build
  tags every reference per render and loads it afresh, which hides the
  loss — holding the static heads of the last two the same both times, a
  static head's links the same as a server's (each file named without its
  hash, since the client entry reads the mode), where the plugin alone asks,
  on the pages a render reads whole, and a server's links of the contained
  ones only where they first load, and, on a page with both, the page's own
  stylesheets before its client components' in either mode, the ordering
  `<style>` unsigned in a file and signed by a server; and it serves them
  under `vite dev`
  with one component's transform slowed, which fails without `use(ready)`;
  `runtime/streaming.test.ts` holds that a server sends the shell before
  what a page waits for under a client component's `<Suspense>`, under an
  `error.tsx`, and in a prop never rendered; `runtime/form-state.test.ts`
  posts a form whose action returns a client component.
- **A script in `<head>` comes before the stylesheets.** React writes what
  it hoists into `<head>` — the stylesheets with a precedence, the
  framework's ordering `<style>` among them — ahead of the head's own
  children, so an inline script the root layout put there comes after
  them. A script after a stylesheet waits for it to load, and the browser
  may paint in between: on k8o.me a colour-scheme script so placed let 12
  of 32 dark loads paint light first. `renderHtml` pipes React's stream
  through `scriptsBeforeStylesheetsStream` (`runtime/head-scripts.ts`),
  which holds the bytes until `</head>` has arrived, moves each inline
  classic script of the head (no `src`, no `type`) ahead of the first
  `<link rel="stylesheet">` or `<style>` there, in order, and passes the
  rest on as it comes; a document that does not open with a `<head>` is
  passed on from its first bytes. It reads the head as HTML is parsed —
  what a `<script>`, `<style>`, `<noscript>`, `<template>`, `<title>` or
  `<textarea>` holds is text, never an element of the head — so a
  `</head>` in a script's text is not the end, and a stylesheet inside a
  `<noscript>` is not one. Hydration finds a moved script, since React
  hydrates `<head>` skipping what it does not expect; under static mode
  the policy's `<meta>`, which `@k8ordo/framework` puts right after
  `<head>` later, still comes first. `runtime/head-scripts.test.ts` holds
  the reading on strings and split streams, and builds
  `fixtures/head-scripts/`, whose layout's script runs in every engine
  while the stylesheet is held back, and hydrates with nothing reported.
- **A static page's HTML says which client modules its payload named, and
  which stylesheets its Server Components link.** What the RSC render kept
  for the HTML render to link (above), the HTML answer says in
  `CLIENT_DEPS_HEADER`, and the framework's build lists it in
  `CLIENT_FILES_PATH` (above): one entry per module, its `deps` as the
  manifest has them. A Server Component's stylesheet is the RSC plugin's
  `<link rel="stylesheet" precedence="vite-rsc/importer-resources">`
  (`SERVER_STYLESHEETS`), an element of the payload with nothing on the
  RSC side to report it, so the HTML render's walk does (`whenClientReady`'s
  `element`, handed every element it walks; `renderHtml`'s `linked`, given
  under static mode only, where the walk waits for every row), and the
  answer says them in `SERVER_STYLESHEETS_HEADER`. The last render's only —
  a page that said `notFound()` is rendered again — and only on HTML: a
  payload and a server say nothing. Both are made once the body is read:
  the HTML carries the payload whole, so every reference has been named and
  every element walked by then. Each value is URI-encoded JSON: a header is
  bytes, and a chunk two client components share is named after a module
  whose name need not be ASCII.
  `runtime/ssr-deps.test.ts` holds that the header says, cold and loaded,
  one entry for each module the Flight rows written into the HTML name,
  with its files in the manifest — two default exports, a
  component passed as a value, ones in a prop's containers, and one in a
  row a not-found receives late, included — and that a server says
  nothing; `runtime/payload.test.ts` carries a name that is not ASCII
  through a header.
- **HTML rendered for another pathname is hydrated as rendered, then
  rendered where the browser is.** That is `404.html`, rendered once under
  the build's sentinel, and a fallback.tsx's shell, rendered for
  `/ja/posts/!fallback` and served at `/ja/posts/3`. A component that reads
  the URL as it renders (`@k8ordo/i18n`'s messages) cannot agree with such
  HTML at the visitor's URL, and a failed hydration regenerates the page,
  reported as an error, with the server's `<title>` left behind in
  `<head>`; rendering it afresh instead (`createRoot`) replaces every
  element, so a page under
  `require-trusted-types-for 'script'` is refused the inline scripts and
  `src`s React writes again. So `renderedHere` (`runtime/mount.tsx`)
  compares the payload's `pathname` with `location` (normalized as
  `usePathname` normalizes), and HTML rendered elsewhere is hydrated as if
  the browser were there: `usePathname` reads `PathnameProvider` while
  hydrating, and a message, which is no hook, reads the pathname `hydrateAs`
  puts on `globalThis` under `Symbol.for('@k8ordo/i18n/hydrating-pathname')`
  (`runtime/hydrating-pathname.ts`; `@k8ordo/i18n`'s `browserPathname` reads
  the same name, a promise between the two changed in both in one release).
  Then the URL is handed back and the page rendered again in two
  transitions. React hydrates a Suspense boundary at its own pace, when the
  browser is idle, and says nowhere that it is done, so `AppRouter` first
  changes `Hydrating`, a context no component reads: a context changing
  above a boundary not yet hydrated makes React hydrate it before that
  transition commits, and the commit's layout effect hands the URL back —
  there and nowhere else. A navigation, a Server Action's answer and `vite
  dev`'s reload that arrive before that commit wait for it (`whenHydrated`)
  before applying their tree: applied earlier, the tree would render at the
  pathname the HTML was rendered for, and with the URL handed back earlier,
  a boundary whose hydration the applying update interrupted would be
  hydrated again at the URL, against HTML rendered for another.
  The second transition renders `reread`, the payload read again from a
  `tee()` of the HTML's stream: React does not render an element it was
  handed before again, so only a tree whose every element is new reaches
  every component below. It is applied only over the tree hydrated (or the
  not-found its shell swapped in): a navigation applied first keeps its
  page. `runtime/mount.browser.test.tsx` hydrates a 404 with nested
  boundaries and sees its nodes kept, no error, and the text and the router
  at the URL — and fails with the context change or that check taken out —
  and has a navigation and an action's answer arrive between two boundaries'
  hydration, which leaves the HTML hydrated as written and the new tree at
  the URL, and fails for the navigation without its wait (the answer's
  transition renders after the hydrating one in React 19.3's lane order
  either way); `examples/static-basic`'s `build.test.ts`
  opens a built `404.html`, a shell and pages behind a trailing slash and a
  redirect in every engine, with Trusted Types enforced.
- **A payload names the client it was rendered for.** `Payload.client` is
  the URL of the script the page's HTML loads (`getClientEntryUrl()`, which
  the RSC plugin exposes to the SSR environment only, so the RSC entry reads
  `clientEntry` from the SSR module for every payload, not only for HTML).
  The document runs the one its hydration payload names (`AppRouter`'s
  `arrived.client`), and `app-router.tsx` never renders a navigation
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
  It then waits for the client components the page renders (see above).
- **A `paramsSchema` export is found by parsing, run before render.**
  `generate/write.ts` reads each page/layout and asks Vite's parser
  (`parseSync`, oxc) for the module's exports — an import would evaluate
  the page before anything is compiled, and a regex over the text mistook a
  code sample for the export and missed a destructured one; `emit.ts`
  imports a layout's beside the layout, checks each against
  `ParamsSchemaFor<pattern>` (`Checked` in `SchemaChecks`, since a page's is
  a type off the module it reads), lists per page pattern the schemas along
  its stack in `paramSchemas` — a function of the page's module, which reads
  the page's own off it — and types the page by them (`ParamSchemas`). The
  handler's `find` walks `routes.matchAll`, every pattern that fits, and for
  each in turn reads the page (or `route.ts`) and runs the stack through
  `runtime/params.ts`, synchronously, so a refused value is a pattern that
  did not match and the catch-all answers under 404.
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
  `urlReader` in `searchReaders`, made from the page's module (the handler
  keeps one per module), types the page's `search` by what that returns
  (`SearchReads`), and the generated `Register` carries it for `PageProps` — which is
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
  `redirect()` throws a `Redirect`, and the handler answers 303 (no
  JavaScript) or a payload with `redirect`.
- **A guard answers or adds, never rewrites.** `guard.ts` is a slot of the
  grammar but not of the router's table: the generator lists, per pattern,
  the guards along its directories (`guards`, outer first; `/*` always
  carries the root's, for a URL nothing answers), and the handler runs them
  after the params schemas matched — inside the answering pattern's `enter`
  — and before the Server Action and the render (`runtime/guard.ts`). A
  `redirect.ts` is answered before them. The request in progress lives in
  an `AsyncLocalStorage` (`runtime/request-scope.ts`). Its phase
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
  before params, with the pages — and lists what imports the module whole in
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
  The table's own `import()` of a route file that something else imports
  statically warns the same way, and that one is kept: the file is back in
  every page.
- **The framework signs its own inline scripts, and decides no policy.**
  Every request's scope holds a fresh nonce (`withRequest`, 128 random bits);
  `renderHtml` hands it to React's SSR (`nonce`: the bootstrap module and
  React's inline scripts), to the SSR Flight client (its preloads), and to
  `rsc-html-stream` (the payload written into the HTML). `nonce()` reads it
  in every phase, the render included — signing a script is not writing the
  response — so a guard names it in the header it writes and a layout signs
  a script of its own (`<ColorSchemeScript nonce>`). Under
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
  with one: what reads the component, the params a shell may leave to the browser
  (`open`, those no layout above it receives — `fallbackShapes`, the one
  walk the grammar, the emitter and `@k8ordo/framework`'s `src/paths.ts` all
  read),
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
- **A `paths.ts` is a parameter's values, and only a build into files asks.**
  The grammar finds one as the `paths` slot and takes it only in a `[param]`
  directory — anywhere else is a problem, in both modes — and
  `pathsFiles(tree)` lists them, outermost first, each with its directory's
  pattern. Under `'static'` the generated table lists `paths`, keyed by the
  file, each a late `() => import()`, and checks every default export
  against `Paths<pattern>` in a `PathsChecks` type; under `'server'` it is
  `{}` and no paths.ts is compiled in. `entry.rsc` exports
  `pathValues(file, params)`, which loads the file through that table and
  calls its default export with the params above it, handing back whatever
  it returned: the static build calls it from the built bundle, so a
  paths.ts runs in the pages' module graph (the application's aliases,
  `server-only` modules, the instances the pages read through), and what
  counts as a value is the framework's to say (`suppliedFrom`). `vite dev`
  reads the same files through the RSC environment's runner, in
  `@k8ordo/framework`.
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
  emits `lazy(products_id_page) satisfies Page<'/products/:id'>` /
  `locale_layout satisfies Layout<'/:locale'>` per file, so a mistyped param
  name is a type error without any route file importing a helper — the
  layout's pattern is the prefix every route below it shares. What the table
  holds no value of (a page's `paramsSchema`, a `route.ts`, a
  `fallback.tsx`, a `paths.ts`) is checked as a type, `Checked<T, U>`. `tsc` reports it in
  the generated file; `vite build` does not type-check, so the build itself
  still passes.
- **The table reads a page when a request reaches it, and imports the frame.**
  `page.tsx`, `not-found.tsx`, `route.ts`, `fallback.tsx` and `paths.ts`
  are `() => import()` in `routes.gen.ts` (`isLate` in `emit.ts`); a page
  and a not-found stand in the table as `lazy()` over it, `pageModules`,
  `routeModules` and `fallbacks` list it per pattern, and `paths` per
  file. Imported with the
  table, a route file is in the RSC entry's chunk, and the RSC plugin
  groups client components, and attaches a server component's CSS, by the
  RSC chunk a module is in — so every page loaded every page's. Read late,
  each page's are its own. A `layout.tsx`, `error.tsx` and `loading.tsx`
  (the frame of every page below them) and a `guard.ts` and `redirect.ts`
  (answered before anything renders) are imported. The handler renders the
  module it read — the page through `watchPage`, a not-found in its stack's
  leaf (`withNotFound`), a shell's fallback.tsx — and never leaves the
  `lazy()` to the render, so a module that throws as it is read fails the
  request: a `500` under a server, and under static mode, where the handler
  logs what throws whole (its stack names the file) and answers it with
  `renderFailed`, a build that stops naming the URL
  (`runtime/page-throws.test.ts`). Top-level `await import()` in the table
  would spare the handler all this and deadlock: a page's chunk imports the
  RSC entry's chunk, which would be waiting for the page. `chunks.test.ts`
  holds that each page's HTML and payload load only its own client
  components and CSS, and that the Server Components' stylesheets stay
  before the client components' across a navigation.

## Layout

```
src/
  grammar/tree.ts            the routes/ grammar: parse + validate (Problem[])
  generate/emit.ts           buildTable (structure) + routes.gen / register.gen
  generate/write.ts          the filesystem edge: scan, generate, write
  plugin/core.ts             the Vite plugins: RSC pipeline, virtual routes
  plugin/mdx-css.ts          the RSC plugin's CSS wrapper, applied to a compiled .mdx
  plugin/server-actions.ts   which modules declared 'use server'
  runtime/entry.{rsc,ssr,browser}.tsx  the three environments
  runtime/app-router.tsx     the client half: navigation + payloads, and whether this document can render one
  runtime/browser-payloads.ts  the browser's Flight client, wired into app-router: payloads read, Server Actions called
  runtime/payload.ts         what a page is on the wire (tree, pathname, client, action result), and the headers a static build reads
  runtime/stylesheets.ts     the RSC plugin's two precedences, and the <style> that keeps the Server Components' first
  runtime/payload-path.ts    where a payload lives: /x → /x/index.rsc
  runtime/is-payload.ts      whether an answer is a payload or a document load
  runtime/prefetch.ts        which link to fetch ahead (on intent, and on screen), and how long a fetched page stays usable
  runtime/client-files.ts    a static build's list of the files each page loads beyond its payload, linked ahead of it
  runtime/revealed.ts        when every streamed boundary is on screen
  runtime/head-scripts.ts    the head's inline scripts, moved ahead of its stylesheets
  runtime/client-ready.ts    when the client components a payload's trees name have loaded, each element walked handed on
  runtime/recover.tsx        a failed client render falls back to a document load
  runtime/reload.ts          location.reload, the one seam a test can watch
  runtime/params.ts          runs the paramsSchema exports along a matched stack, and above a not-found
  runtime/mount.tsx          hydrate the HTML as rendered; renderedHere, whether it was rendered where the browser is
  runtime/hydrating-pathname.ts  the pathname @k8ordo/i18n reads while HTML rendered elsewhere is hydrated, and when it is
  runtime/pathname.ts        decodePathname, before a pathname may name a file
  runtime/redirect.ts        redirect(), what a Server Action throws; where a redirect.ts sends a pathname the table matched to it
  runtime/request.ts         the read-only request a page receives
  runtime/request-scope.ts   the request in progress: phases, cookies() / responseHeaders() / requestHeaders(), nonce(), answer()
  runtime/server.ts          the request API, which is @k8ordo/framework/server: the framework points that entry here
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
fixtures/
  build.ts                   builds an application below as the mode does —
                             'server' unless told, a static one into
                             dist-static/ — from this package's source, and
                             imports the handler it wrote; or serves it with
                             vite dev
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
                             loading.tsx (and one under a loading.tsx already
                             on screen, one calling a Server Action, and ones
                             awaiting it under a client component's
                             <Suspense>, under an error.tsx, and in a prop
                             never rendered), which runtime/streaming.test.ts
                             streams to each engine; state.ts stands in for
                             @k8ordo/state
  client-css/routes/         a layout rendering a client component that imports
                             CSS, whose HTML runtime/client-css.test.ts reads
  chunks/routes/             two pages and a not-found, each with a client
                             component and a CSS Module of its own, under a
                             provider that renders again as it hydrates, which
                             runtime/chunks.test.ts builds and opens in each
                             engine with the components' chunks held back
  page-throws/routes/        a page whose module throws as it is read, which
                             runtime/page-throws.test.ts builds in both modes
  ssr-deps/routes/           pages naming client components with a CSS Module
                             of their own — rendered by a page, a not-found, a
                             module a Server Component imports, a boundary
                             that resolves after the shell, or only passed in
                             a prop, in the shell or in such a boundary, as a
                             value, in a Map, Set, promise, iterator, async
                             iterable or stream — each of those in a chunk of
                             its own — or in a promise a not-found's prop
                             holds that settles after the HTML would be
                             rendered — two default exports, and
                             a page with a CSS Module beside one, which
                             runtime/ssr-deps.test.ts builds in both modes
                             and serves under vite dev
  form-state/routes/         a form whose Server Action returns a client
                             component, which runtime/form-state.test.ts
                             posts without JavaScript
  mdx-css/routes/            a page importing an .mdx and one reading another
                             through a glob, each .mdx importing CSS, which
                             runtime/mdx-css.test.ts builds with a stand-in
                             MDX compiler
  head-scripts/routes/       a layout writing an inline script in <head> and
                             importing CSS, which runtime/head-scripts.test.ts
                             opens in each engine with the CSS held back
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
