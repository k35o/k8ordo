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
pnpm test          # unit (node) + browser (chromium)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The invariants

- **Pathname only.** No search API, and the raw search is never distributed —
  a search change must re-render `@k8ordo/state`'s key subscribers and nobody
  here. The URL is split at the `?`.
- **Pages never import the table.** `href` / `navigateTo` / `useParams` work
  from the pattern string; `Register` supplies the check. Only `<Router>`
  holds the table's value, which is why the routes-module → pages →
  routes-module cycle cannot form. Keep it that way.
- **`finished` means committed.** The intercept handler resolves in a
  _layout_ effect, once React has committed the new tree and before it is
  painted. Layout, not passive: with a `<ViewTransition>` in the tree React
  holds the new snapshot until the platform's pending navigation has
  finished and runs passive effects only after the animation, so a passive
  resolver would wait on itself. A same-pathname navigation (`@k8ordo/state`'s
  url `update()`) is intercepted without a handler, so its `finished`
  settles as soon as the navigation commits, with no render behind it —
  state's GUIDE promises that, so keep the shortcut handler-free.
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
  load, no apply. Not `location.pathname`: interception commits the URL
  before the tree arrives, so comparing against the address bar makes a
  state update during a pending load abort that load and strand the old page
  under the new URL (regression test in `router.browser.test.tsx`).
- **A new page starts where a document load would.** The commit effect that
  resolves `finished` also places the viewport: top for push/replace, the
  fragment's element when the URL names one, nothing for a traversal (the
  browser restores). `scroll: 'manual'` is passed for exactly the cases this
  hook scrolls itself, so the platform and the hook never both act.
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
- **Declaration order decides.** No specificity ranking, ever — the table
  reads top to bottom like the code it is.
- **A bound param is a param, not a concept.** `bindParams` knows a name and
  a source function; that the name is `locale` and the source is
  `@k8ordo/i18n` is the application's `links.ts`. Nothing locale-shaped
  belongs here.
- **`PageProps` reads `Register`, never the mode.** `request` appears only
  because the generator wrote it into `Register` under `@k8ordo/server`; the
  type has no idea which package did.
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
  define-routes.ts  defineRoutes / match / NavigablePath
  links.ts          href / navigateTo / bindParams (the side that needs no table)
  register.ts       Register (module augmentation) + PageProps / LayoutProps
  navigation.ts     useInterceptedNavigation (intercept and the commit contract)
  location.tsx      usePathname / PathnameProvider (where you are, without the table)
  match.ts          matchPath / useMatch ("which section am I in", without the table)
  boundary.tsx      RouteErrorBoundary (the boundary that renders the table's error)
  router.tsx        Router / Outlet / useRoute / useParams
```

## Conventions

- `type`, not `interface` — except `Register`, which must merge.
- `RouteComponent` is `ComponentType<never>` on purpose: the same table is
  rendered by the client renderer (no props) and by the framework (params and
  children). Each renderer states what it passes, at its own cast.
- Browser tests play the router themselves where they need one — an
  unintercepted `navigation.navigate()` in the test iframe is a cross-document
  load and kills the runner.
- Tests state a guarantee in their name, English; comments and commits are
  Japanese except docs/ and this file.
