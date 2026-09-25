# Agent guide — packages/framework-engine

`@k8ordo/framework-engine` — the machinery `@k8ordo/static` and
`@k8ordo/server` are both built on. **Private**: it is never published. Each
mode package bundles it into its own entries at pack time
(`deps.alwaysBundle` in the mode's `vite.config.ts`) and copies
`dist/runtime/` — the three environment entries — beside it, then tells the
engine where they landed (`EngineHost.runtimeDir`). Nothing outside this
repository can resolve the name.

The framework's job is to make the application's structure a checkable form:
`routes/` is the pathname space and holds nothing else, execution boundaries
are declared with React's own `'use client'` and enforced, and the type wiring
between the app and `@k8ordo/router` / `@k8ordo/state` is generated rather
than hand-written. The shared discipline (React 19 / RSC assumed, Baseline
newly available only) is in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

## Commands

```bash
pnpm test          # unit (node) + browser (Chromium via Playwright)
pnpm build         # vp pack (the mode packages bundle the result)
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **The filesystem stays at the edge.** `parseRouteTree` is a pure function
  over a list of paths, so the grammar's rules are what get tested, never the
  disk. Anything that reads directories is a thin wrapper around it.
- **Every problem is reported, not just the first.** Parsing collects
  `Problem[]` and returns them with a best-effort tree; the plugin decides how
  to present them. A build that fails should name everything wrong at once.
- **One structure, two consumers.** `buildTable` builds the route table
  generically over what a route file resolves to — identifiers when emitting
  source, real components when a test hands the result to the router's own
  `defineRoutes`. That is why the integration test can prove the emitted table
  matches correctly without evaluating generated text.
- **The generated table is ordinary source.** It uses the router's public API
  and would be identical to what someone wrote by hand from the same
  directories — reviewable in a diff, with no private hooks into the router.
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
- **The host names itself.** `EngineHost.via` is the mode package the
  application installed — the only name resolvable from the project root once
  the engine is bundled — so the generated files' banner, the optimizer's
  `include` entries, and any message that tells a person what to install all
  say `@k8ordo/static` or `@k8ordo/server`, never this package.
- **The browser holds no route table.** `runtime/app-router.tsx` claims every
  same-origin URL and learns from the answer; anything that is not a payload
  (`runtime/is-payload.ts`) becomes a document load, which is also the
  recovery path when a render fails. The client router's "unmatched pathnames
  are not intercepted" does not apply here.
- **Hydration reads the payload the HTML was rendered from.**
  `runtime/entry.ssr.tsx` injects the RSC stream into the HTML and
  `runtime/entry.browser.tsx` reads it back; nothing refetches on load, which
  is what lets a prerendered `404.html` come alive.
- **Only HTML rendered for the browser's pathname is hydrated.**
  `runtime/mount.ts` compares the payload's `pathname` with `location`
  (normalized as `usePathname` normalizes) and renders anything else afresh
  with `createRoot`. That is `404.html`, rendered once under the build's
  sentinel: a component that reads the URL as it renders (`@k8ordo/i18n`'s
  messages) cannot agree with it at the visitor's URL, and a failed
  hydration regenerates the page anyway, reported as an error and with the
  server's `<title>` left behind in `<head>`.
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
  render starts inside the answering pattern's (`enter`): a schema may write
  there (`@k8ordo/i18n` records the accepted locale), and neither a refused
  pattern's write nor any other reaches the handler's caller, which under
  `@k8ordo/static` is one context for every page.
- **`error.tsx` is the router's `error`; `redirect.ts` is answered before the
  table.** The generator puts an error file on its branch (a page with an
  error becomes a branch of its own) and lists redirects in `redirects`,
  keyed by pattern, which the handler matches first. A Server Action's
  `redirect()` throws a `Symbol.for`-branded `Redirect` — never checked by
  `instanceof`, because the mode package holds two copies of this module —
  and the handler answers 303 (no JavaScript) or a payload with `redirect`.
- **A guard answers or adds, never rewrites.** `guard.ts` is a slot of the
  grammar but not of the router's table: the generator lists, per pattern,
  the guards along its directories (`guards`, outer first; `/*` always
  carries the root's, for a URL nothing answers), and the handler runs them
  after the params schemas matched — inside the answering pattern's `enter`
  — and before the Server Action and the render (`runtime/guard.ts`). A
  `redirect.ts` is answered before them. The request in progress lives in
  an `AsyncLocalStorage` on `globalThis` under
  `Symbol.for('k8ordo.request')` (`runtime/request-scope.ts`), because the
  mode package holds two copies of this module — the runtime the handler is
  built from and the `./runtime` entry the application imports
  `responseHeaders()` from — and both must see the one request. Its phase
  says what is running — `guard`, `action`, or the `render` — and the
  response API (`cookies()`, `responseHeaders()`, `requestHeaders()`) throws
  in the render and outside a request, because a page is a render. What a
  guard or an action adds goes onto whatever the handler answers
  (`answer()`, a new `Response`, since a redirect's headers cannot be
  written); the cookie jar (`runtime/cookies.ts`) is one per request, so a
  guard's write is what an action after it reads, and each write is one
  `Set-Cookie` line, the last one per name, path and domain. `@k8ordo/static` refuses
  `guard.ts` (by name at build, per module in `vite dev`), reading the slot
  through `slotOf`.
- **A page's `notFound()` is its answer, and a document waits for it.**
  `notFound()` lives in `@k8ordo/router` (so a page reads the same under
  either mode) and is recognised by its `Symbol.for` brand. The handler
  renders a page through `watchPage` (`runtime/page-watch.ts`): the page's
  own function is called from inside the RSC render's call, so `use`,
  `cache` and suspensions behave as for the page itself, and what it
  returned settles `settled` (with the rejection's reason — the render's
  `onError` hears of an async rejection only later). A document and a
  `HEAD` wait for that, for a `notFound()` reaching `onError`, or for the
  stream to end (a layout that never renders its children) — under
  `@k8ordo/static` for the whole stream — before sending anything; a
  `notFound()` then aborts that render and renders what the table answers
  for the pathname plus `NOT_FOUND_SEGMENT` (only a catch-all may answer,
  and `/:locale/*` does not match `/en` itself), under a 404. A payload
  does not wait: `onError` turns `notFound()` into the digest
  `NOT_FOUND_DIGEST`, and `PageBoundary` (`runtime/page-boundary.tsx`, a
  client boundary around every page, inside any `error.tsx`) answers it
  with a document load when the tree came from a navigation, and hands it
  on to `error.tsx` otherwise — loading the server's document again would
  only bring the same page back. Under `@k8ordo/static` the 404 carries
  `NOT_FOUND_HEADER`, so the build tells a page's `notFound()` from a
  refused param.
- **The request reaches a page only under a server.** `K8ORDO_MODE` is
  defined by the host; the handler attaches `request` (headers, cookies) only
  under `@k8ordo/server`, and the generator emits the field only there. Under
  `@k8ordo/static` the handler also buffers the HTML and answers 500 with the
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
- **The handler owns the methods.** It answers `GET`, `HEAD` and `POST`, and
  anything else with a `405` and `Allow` — here, not in `@k8ordo/server`'s
  `serve`, because a host that calls the built handler directly has no
  `serve` in front of it. `HEAD` gets a `null` body: a not-found is answered
  before anything renders, and a page runs only as far as its own component,
  which may say `notFound()`; its render is aborted, not streamed. `@k8ordo/static` only ever
  sends `GET`.
- **One pattern walk.** `declaredPatterns(tree)` is the order the matcher
  tries patterns — pages and redirects, literals before params, the
  catch-all last in its branch — and everything that asks "which URLs does
  this site have" reads it: the shadow check here, `patternsOf` in
  `@k8ordo/static`. `decodePathname` is likewise the one decoding both mode
  packages use before a pathname may name a file.
- **The two GUIDEs share their common sections from one source.**
  `docs/shared/<name>.md` is written into both `packages/static/docs/GUIDE.md`
  and `packages/server/docs/GUIDE.md` between `<!-- shared:<name> -->`
  markers by `scripts/sync-guides.ts`; `pnpm check` fails on drift and
  `pnpm check:write` re-syncs. Edit the fragment, never the copy.
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
  runtime/revealed.ts        when every streamed boundary is on screen
  runtime/recover.tsx        a failed client render falls back to a document load
  runtime/reload.ts          location.reload, the one seam a test can watch
  runtime/params.ts          runs the paramsSchema exports along a matched stack, and above a not-found
  runtime/mount.ts           hydrate what was rendered for this pathname, render anything else afresh
  runtime/pathname.ts        decodePathname, before a pathname may name a file
  runtime/redirect.ts        redirect() / redirect.ts targets
  runtime/request.ts         the read-only request a page receives
  runtime/request-scope.ts   the request in progress: phases, cookies() / responseHeaders() / requestHeaders(), answer()
  runtime/cookies.ts         the per-request cookie jar and its Set-Cookie lines
  runtime/guard.ts           Guard / GuardContext, runGuards (outer first, first Response ends it)
  runtime/render.tsx         the matched stack, nested through children
  runtime/page-watch.ts      a page called as the render calls it, its answer watched
  runtime/page-boundary.tsx  a navigation's late notFound() → a document load; anything else on to error.tsx
  runtime/virtual.d.ts       types of virtual:k8ordo/routes and K8ORDO_MODE
  index.ts
fixtures/
  bare-not-found/routes/     an application with no not-found.tsx, which
                             runtime/not-found.test.ts builds from this
                             package's source and opens in Chromium
```

## Conventions

- `type`, not `interface`; comments explain why the straightforward version
  was not used.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
