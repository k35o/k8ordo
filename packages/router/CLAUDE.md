# Agent guide — packages/router

`@k8ordo/router` — the URL's pathname axis. One `defineRoutes` table yields
the types, the matching, the links and the navigation, over the Navigation API
and URLPattern. The shared discipline (React 19 / RSC assumed, Baseline newly
available only, no polyfills) and how a new package joins are in the
repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped
inside the npm package.

## Commands

```bash
pnpm test          # unit (node; back and forward in a top-level page via Playwright) + browser (chromium, firefox, webkit)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **Pathname only.** No search API, and the raw search is never distributed —
  a search change must re-render `@k8ordo/state`'s key subscribers and nobody
  here. The URL is split at the `?`. A host that renders pages for a search
  (the framework, for a page that exports `search`) says so through the
  handler's `refresh(url)`, and the hook loads in place for it — the router
  itself still reads nothing of the search.
- **Pages never import the table.** `href` / `navigateTo` / `useParams` work
  from the pattern string; `Register` supplies the check. Only `<Router>`
  holds the table's value, which is why the routes-module → pages →
  routes-module cycle cannot form. Keep it that way.
- **`finished` means committed.** The intercept handler resolves in a
  _layout_ effect, once React has committed the new tree and before it is
  painted. Layout, not passive: with a `<ViewTransition>` in the tree React
  holds the new snapshot until the platform's pending navigation has
  finished and runs passive effects only after the animation, so a passive
  resolver would wait on itself. A same-pathname push or replace
  (`@k8ordo/state`'s url `update()`) is intercepted without a handler, so
  its `finished` settles as soon as the navigation commits, with no render
  behind it — state's GUIDE promises that, so keep the shortcut
  handler-free (`traversal.test.ts` holds it). A same-pathname traversal is
  the one with a handler, below.
- **A page change never joins an async action.** `apply` is an urgent
  update and the host renders it through `useDeferredValue`; the hook's own
  `generation` is deferred beside it, so `finished` resolves in the deferred
  commit. Never move `apply` back inside `startTransition`: while any async
  action is pending React gives every transition the action's lane and holds
  it until the action ends, so an action awaiting `finished` deadlocks and a
  page change started beside an unrelated action waits for it (regression
  tests in `router.browser.test.tsx`, and the JS-enabled Server Action
  redirect in `examples/server-basic/src/browser.test.ts`).
- **A page change is tagged.** `addTransitionType('navigation')` and
  `navigation-<kind>` for the platform's `push` / `replace` / `traverse`, so
  an application's `<ViewTransition>` can animate page changes and no other
  transition (`transitionTypesFor` in `navigation.ts`). The types cannot ride
  the update (that would be a transition again): they are said in a
  `startTransition` of their own from the urgent commit's layout effect,
  because React keeps types only while a transition-class render — the
  deferred one — is pending on the root. The ViewTransition test fails if a
  React upgrade changes that.
- **A state change is not a page change.** Same pathname as the tree ON
  SCREEN ⇒ intercept with `scroll: 'manual'`, `focusReset: 'manual'`, no
  load, no apply — unless the host's `refresh(url)` says the page showing
  reads what moved, when it loads and applies with the same manual focus,
  no scroll plan and no transition types. Not `location.pathname`: interception commits the URL
  before the tree arrives, so comparing against the address bar makes a
  state update during a pending load abort that load and strand the old page
  under the new URL (regression test in `router.browser.test.tsx`). Going
  back or forward is the exception, below — unless it goes back to the
  entry whose page is on screen while a page change loads
  (`onScreenEntry`): that calls the change off, and keeps the position.
- **A tree knows the pathname it was applied for.** `<Router>` applies the
  match together with the pathname it was loaded for, so the deferred value
  that puts a tree on screen moves both in one commit, and provides that
  pathname (normalized, in the URL's terms) under `TreePathname`
  (`tree-pathname.ts`). The context is not exported: `@k8ordo/state` reads
  it to keep a page state's values with the tree on screen while the URL
  already names the next page, and `@k8ordo/framework`'s runtime provides
  it as `<Router>` does. All three reach it through
  `Symbol.for('@k8ordo/router/tree-pathname')` on `globalThis` — state
  never loads the router, and the framework cannot import a module the
  router does not export — so the name is a promise between them, changed
  in all three in one release. `router.browser.test.tsx` holds that a tree
  being left names its own pathname until the next one is on screen.
- **A new page starts where a document load would; back and forward go
  where the entry was left.** The commit effect that resolves `finished`
  also places the viewport: top for push/replace, the fragment's element
  when the URL names one, and for a traversal the position the router
  recorded when that entry was left (`leftAt`), put there with
  `behavior: 'instant'`. Every intercept with a handler passes
  `scroll: 'manual'`, so the platform and the hook never both act. A
  traversal is never left to the browser: Chromium commits an intercepted
  traversal before its handler runs, makes the destination's history item
  the current one, and writes every change of the root's scroll offset
  into it — a layout clamping the previous page's offset to what the new
  page can scroll included — then restores that value. A page that forces
  layout in its commit (a component measuring itself, `getComputedStyle`
  inside a size container) came back at its bottom. The `navigate`
  listener records `scrollX` / `scrollY` for the entry being left before
  anything else — `onScreenEntry` while a page change loads, because the
  URL's entry is not on screen yet and a second navigation leaves the page
  that is — keyed by the entry's `key`, kept to 100, and mirrored into
  `sessionStorage`: a reload keeps the earlier entries in the same document,
  so going back to them is still intercepted, and an in-memory record would
  be gone. Never prune the record to `navigation.entries()` while it fits:
  it lists only the same-origin run of entries around the current one, so a
  document the visitor came back in on from another site would drop the
  entries from before that site, and going back to them through a document
  read again landed at the top. A key never comes back once its entry is
  gone, so the cap is only about size; no engine keeps more than 100 entries
  in a tab's history. Over the cap it drops the least recently left key that
  `entries()` does not list, and only then the least recently left of the
  rest: moving on and coming back piles up the keys of truncated entries and
  of fragment moves (every `navigate` records one, hash included), and age
  alone would push out an entry left once and still there to go back to. An
  entry with no record (a page change called off before it arrived) starts
  like a new page. The visitor scrolling the old page during the load does not stop
  the restore — what they moved was the page being left. The one traversal
  left to the browser (`scroll: 'after-transition'`, no scroll plan) is one
  whose destination has an empty `key`: WebKit, in a document it read again
  on going back, lists none of the earlier entries it still treats as the
  same document, and a traversal to one comes keyless, with nothing to look
  up. WebKit also leaves `currentEntry` where it was after one and dispatches
  no `currententrychange`, so until the next navigation `currentEntry` does
  not name what is on screen. `onScreenEntry` holds the empty key for that
  stretch: leaving records nothing (the browser keeps that entry's position
  itself), and a traversal to the stale `currentEntry` is a real one that
  restores what was recorded when that entry was left. A keyed traversal or a
  push puts `currentEntry` right again. `popstate` is the only news of a
  keyless traversal, so `usePathname` subscribes to it beside
  `currententrychange`, and `@k8ordo/state`'s page store does the same.
  A traversal has a handler whether it changes the page, loads one in
  place, or only moves the search or the entry state: in the last case
  nothing is applied, but the page renders the entry it arrived at,
  through `useDeferredValue` one commit after the urgent one, and placed
  before that commit the position would land on the previous entry's
  layout. So that traversal is intercepted with a handler that settles in
  the commit of `traversed`, deferred beside the page's own values. Both
  the `pending` entry and `setTraversed` are made in the `navigate`
  listener, not in the handler: it runs before `currententrychange`, so
  the page's own update (Sync or Default, as `@k8ordo/state`'s url field
  gives it) and the router's render together and share one deferred lane,
  whatever the engine's order of handler and `currententrychange`, and
  the handler returns the promise made there (Firefox may call it twice).
  Firefox restores a traversal's position as it commits, at `popstate`,
  waiting for no handler and reading no `scroll` option; the commit effect
  places the recorded position after that, so it does not matter — except
  for a traversal back to the page on screen, which keeps the position and
  has no commit effect: Firefox restores it all the same before the task
  that dispatched `popstate` ends, so the router puts the position the
  visitor had back in the next task (`keepPosition`, a `setTimeout` — a
  frame callback never runs in a hidden tab), unless another navigation
  moved the entry on. The other engines leave it, so there it is already
  where it was. WebKit, on bringing a document back from the back/forward
  cache, dispatches a traversal to the current entry before it restores the
  position, with `scrollY` still 0. That is no departure and nothing loads, so
  outside a page change it is intercepted before anything is recorded and
  moves nothing: `keepPosition` is only for a change being called off, or it
  would hold the 0 and put the page back there after WebKit restored it.
  `traversal.test.ts` holds that `finished` sees the entry's own render and
  the position comes back onto it, for a page change, a traversal in place
  and one that loads again — each also from further down a longer page,
  onto pages that measure themselves — after a reload, past an entry still
  loading, past another origin (and one the visitor came back in from and
  moved on, and going forward again from there, with and without following a
  link first, within a page too), after leaving more than 100 entries that are
  gone, and when the
  visitor scrolls during the load; that an entry called off starts at the top;
  that a traversal back to the page on screen keeps where the visitor
  scrolled it; and that WebKit's traversal on coming back from the
  back/forward cache leaves the position alone. Playwright's WebKit does not
  use that cache, so that test replays the event, and the real one is checked
  by hand in a `WKWebView` (the repro lands at 0 only on a page heavy enough
  for WebKit to restore before the timer: the fixtures land right anyway, with
  a `scrollTo(0, 0)` that the fix removes). It also holds that going back past
  another site shows the page the URL names and links still work; a
  client-rendered fixture has no position to assert after that document load.
- **A history step the platform does not announce reloads the document.**
  WebKit, in a document it read again on coming back from another _site_,
  dispatches no `navigate` for a traversal to an earlier entry: only
  `popstate`, with `currentEntry` now null. The URL has moved and the page has
  not, and in that document `navigation.navigate()` rejects with an
  `AbortError`, so no link works and nothing can be rendered in place. A
  `popstate` that finds `currentEntry` null reloads, which is what going back
  to that entry would have been in a document load: the browser restores a
  server-rendered page's position, and the entry after it is reachable the
  same way. From another _origin_ of the same site the same traversal is
  announced, keyless (above).
- **`useMatch` reads the platform, never the table.** It is `matchPath` over
  `usePathname`, which is why it works under the framework where `useRoute`
  cannot; `/*` on a table pattern is the one extension of the grammar it
  accepts, meaning "and everything below".
- **Unmatched pathnames are not intercepted.** A real 404 is the server's.
- **Reload, POST, download and hash are not ours.** `isOurs` says no before
  the table is consulted — and to anything the platform reports it cannot
  intercept (`canIntercept`); a GET form (no `formData`) still comes through.
- **Schemas are typed here, run elsewhere.** `ParamsSchemaFor` /
  `ParsedParams` / `RegisteredParams` describe what a Standard Schema produces
  so `href` can take it; the framework runs the schema and hands `match` an
  `accept` that declines a refused param, which makes the walk go on to the
  next pattern. Nothing in this package validates anything.
- **An `error` boundary is an element of the stack, cleared by generation.**
  `boundaryFor` puts it after the layout; `RouteErrorBoundary` clears its
  class boundary's failure when `NavigationGeneration` — the id of the
  navigation that applied the tree — changes, never when the pathname does,
  which commits before the tree arrives and would clear it onto the old,
  still-failing tree. It never keys the boundary: a key remounts everything
  below on every page change, and a root `error.tsx` would take every layout
  with it (regression tests for both in `router.browser.test.tsx`). It sits
  under a Suspense boundary so a server render leaves a throwing subtree to
  the browser.
- **A branch's `loading` is a plain `<Suspense>` in the stack**, after the
  layout and the `error` boundary (`loadingFor`), never keyed: a page change
  under one already showing keeps the current page, as every page change
  does. `usePendingPathname()` is a module-level store the navigation hook
  sets at interception (in the table's terms, base removed) and clears in the
  commit that puts that navigation's tree on screen, or when it is aborted or
  its load fails — only for the latest navigation, since a newer one already
  names its own. A same-pathname navigation sets it only when `refresh(url)`
  made it load.
- **Declaration order decides.** No specificity ranking, ever — the table
  reads top to bottom like the code it is.
- **A bound param is a param, not a concept.** `bindParams` knows a name and
  a source function; that the name is `locale` and the source is
  `@k8ordo/i18n` is the application's `links.ts`. Nothing locale-shaped
  belongs here.
- **`PageProps` reads `Register`, never the mode.** `request` appears only
  because the generator wrote it into `Register` in server mode; the type
  has no idea which mode did.
- **A new export is also a decision for `@k8ordo/framework`.** Its `.` entry
  re-exports the application half of this package by name, so an application
  on the framework never names this one; `packages/framework/src/index.test.ts`
  fails until a new export here is either re-exported there or listed in its
  `WITHHELD`, with the reason.
- **The table is written from the root; Vite's `base` lives at the edges.**
  `withBase` (in `href` / `navigateTo` / `bindParams`) puts
  `import.meta.env.BASE_URL` in front of what leaves for the browser, and
  `withoutBase` (in `usePathname`, `<Router>`'s match and claim) takes it off
  what comes back; nothing between ever sees it. `href` returns `string`
  because its result is a URL: typed as a table path it could be handed to
  something that adds the base itself (`@k8ordo/state`'s `href`) and carry
  it twice. Code Node loads without Vite (static mode's build, `serve`)
  has no `import.meta.env` and passes the base explicitly.
- **The type mirrors the runtime walk.** `Below` resets a branch that landed
  on the root, exactly as `walk` does; without it every route under a root
  layout types as `//products`. Any change to one has to change the other.
- **A typed path is checked, never enumerated.** `NavigablePath` matches the
  path it is handed against the table's patterns segment by segment
  (`PathMatching` in `paths.ts`, a `:param` reading as URLPattern reads it:
  one non-empty segment). Never go back to a union of `PathFor` each
  pattern: a `/:locale` page puts `/${string}` in it, and that one member
  takes every path there is.

## Layout

```
src/
  paths.ts          type derivation (ParamsOf / PathFor / Join) + string operations
  base.ts           withBase / withoutBase (Vite's base at the edges)
  define-routes.ts  defineRoutes / match / NavigablePath
  links.ts          href / navigateTo / bindParams (the side that needs no table)
  register.ts       Register (module augmentation) + PageProps / LayoutProps / RouteContext
  navigation.ts     useInterceptedNavigation (intercept and the commit contract), usePendingPathname
  location.tsx      usePathname / PathnameProvider / BrowserPathname (where you are, without the table)
  match.ts          matchPath / useMatch ("which section am I in", without the table)
  boundary.tsx      RouteErrorBoundary (the boundary that renders the table's error)
  router.tsx        Router / Outlet / useRoute / useParams
  tree-pathname.ts  TreePathname, the pathname each tree was applied for (not exported)
  not-found.ts      notFound / isNotFound (the framework answers it; branded, not a class)
  traversal.test.ts serves fixtures/traversal with Vite and opens it top-level
fixtures/
  traversal/        a page on <Router>, for going back and forward
```

## Conventions

- `type`, not `interface` — except `Register`, which must merge.
- `RouteComponent` is `ComponentType<never>` on purpose: the same table is
  rendered by the client renderer (no props) and by the framework (params and
  children). Each renderer states what it passes, at its own cast.
- Browser tests play the router themselves where they need one — an
  unintercepted `navigation.navigate()` in the test iframe is a cross-document
  load and kills the runner.
- Going back and forward is asserted in `traversal.test.ts`, never in the
  browser tests: inside Vitest's iframe, Firefox and WebKit do not restore the
  scroll position, and Firefox runs a traversal's handler twice.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
