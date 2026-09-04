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
- **`finished` means committed.** The intercept handler resolves in an effect
  after React puts the new tree on screen. `@k8ordo/state`'s
  `update().finished` inherits this, so it is a cross-package contract.
- **A state change is not a page change.** Same pathname as the tree ON
  SCREEN ⇒ intercept with `scroll: 'manual'`, `focusReset: 'manual'`, no
  load, no apply. Not `location.pathname`: interception commits the URL
  before the tree arrives, so comparing against the address bar makes a
  state update during a pending load abort that load and strand the old page
  under the new URL (regression test in `router.browser.test.tsx`).
- **Unmatched pathnames are not intercepted.** A real 404 is the server's.
- **Reload, POST, download and hash are not ours.** `isOurs` says no before
  the table is consulted; a GET form (no `formData`) still comes through.
- **Declaration order decides.** No specificity ranking, ever — the table
  reads top to bottom like the code it is.
- **The type mirrors the runtime walk.** `Below` resets a branch that landed
  on the root, exactly as `walk` does; without it every route under a root
  layout types as `//products`. Any change to one has to change the other.

## Layout

```
src/
  paths.ts          型導出(ParamsOf/PathFor/Join)+ 文字列操作
  define-routes.ts  defineRoutes / match / RouteOf
  links.ts          href / navigateTo(表を必要としない側)
  register.ts       Register(module augmentation)
  navigation.ts     useInterceptedNavigation(intercept と commit 契約)
  location.tsx      usePathname / PathnameProvider(表を引かない現在地)
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
