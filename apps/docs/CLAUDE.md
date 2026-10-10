# Agent guide — apps/docs

Documentation site for the `@k8ordo/*` packages (`ui`, `form`, `state`,
`router`, `framework`, `i18n`, `color-scheme`), built with
`@k8ordo/framework` in `mode: 'static'` — the site runs on the family's own
framework, so a change to it is felt here first. The `framework-engine` is
internal and has no page: an application installs `@k8ordo/framework`, never
the engine. The site also dogfoods
`@k8ordo/state`, `@k8ordo/form`, `@k8ordo/i18n`, and `@k8ordo/color-scheme`:
the writing-mode preference is a `defineLocalState` (`src/theme/state.ts`),
the colour scheme is `@k8ordo/color-scheme`'s (`<ColorSchemeProvider>` in
the root layout's `<body>`, `useColorScheme()` in the header's switcher),
`/state`'s live demo is a real `definePageState` on the page's own URL,
`/form`'s live demo is a GET filter form whose constraints and URL state come
from one schema (`src/demos/form/`), and every word on the
site is a `message()` under `src/messages/` — the locale set in `src/i18n.ts`
is what the `[locale]` layout's `paramsSchema`, the root layout's `<html
lang>`, `vite.config.ts`'s path expansion, the `/` redirect, and every
message's type all read.

## Commands

```bash
pnpm dev               # Start dev server
pnpm build             # Production build
pnpm typecheck         # Type check
pnpm check             # Oxlint/Oxfmt lint/format check
pnpm check:write       # Oxlint/Oxfmt lint/format auto-fix
```

## Architecture

- **Routing**: file-based. `src/routes/` _is_ the URL space (`@k8ordo/framework`),
  and `.k8ordo/` holds the generated route table and type wiring — generated,
  git-ignored, and readable. Everything sits under `[locale]`, so every pattern
  needs pathnames at build time; `vite.config.ts` passes `paths: locales.paths`,
  which expands every `/:locale` pattern the build hands it once per locale
  rather than listing pages twice.
- **Nothing here works around the framework.** Scroll-to-top after a
  navigation, the error boundary around a page, and "which package's pages
  are showing" are all the router's and the framework's job now
  (`matchPath` on `usePathname()`, `error.tsx`, the router's own scroll
  handling). When the
  site needs something the packages do not give it, the fix belongs in the
  package, and the site is where the pressure is felt first.
- **Navigation mirrors the URL layout**: the header lists the packages and nothing else (`src/components/navigation.tsx`). Inside a package (`/<package>/*`, but not its landing) the shell in `src/components/locale-shell.tsx` adds a left sidebar, `src/components/package-sidebar.tsx`, which lists that package's pages under its groups; below `lg` the same sidebar opens in a `Drawer`. The header, the sidebar, the home page's package list and every guide page's breadcrumb, title and prev/next pager read one list, `PACKAGES` in `src/data/packages.ts` — a package's `groups` and their `sections` are in reading order, so adding a page to a package's guide is one line there plus the route. A landing keeps no list of pages of its own: its hero links to `get-started`, and the sidebar is where the rest of the guide is found. A section with a catalog (`/ui/components`, `/ui/ai`) becomes a group of its own in the sidebar, its categories levels that open and close; the shell's `catalogs` maps the section to its categories. The footer lists no packages or sections: it is the site's name, its tagline and the GitHub and npm links. Never promote one package's pages to a site-wide row: with a single package it reads as convenience, with six it makes that package look like the site's spine.
- **URL layout**: package-first. Everything a package documents lives under `/<package>/…` — `@k8ordo/ui` owns `/ui/get-started`, `/ui/components/*`, `/ui/ai/*`, and so on. `/<package>` itself is that package's landing page (`src/routes/[locale]/ui/page.tsx`): what it is, what it gives you, where to start. Only `/` is shared — it introduces k8ordo, lists the packages, and states what they all commit to. Add a new package by adding its own `/<package>` landing plus a `/<package>/…` subtree starting at `/<package>/get-started`, and an entry in `PACKAGES` (`src/data/packages.ts`) — its shipped docs are found from its `package.json` (see Markdown for agents below), and the build fails while `PACKAGES` lacks it; never put a package's sections at the top level, where they would sit at the same depth as package names.
- **Unmatched routes**: `src/routes/[locale]/not-found.tsx` is rendered into a
  single `404.html`, which a static host serves for anything it does not have.
  One file for every locale, so the `:locale` it was rendered with is the build's
  sentinel, not a language — and the schema above `not-found.tsx` refuses it
  (a catch-all still answers; it only renders in no locale). Every message in
  the file therefore renders in `locales.default`, so it is Japanese as
  served, whichever `/en/…` pages the build rendered alongside it. The browser
  does not hydrate it — the framework renders a document drawn for another
  URL afresh — so client components read the visitor's URL from their first
  render: the messages, and the shell, which takes the locale from `usePathname`
  when its param is the sentinel, falling back to `locales.default` only when
  the URL has none either. The file becomes English the moment it renders on
  an `/en/…` URL. A visitor with JavaScript off keeps the Japanese one; one
  file cannot be both. Under the dev server (and `mode: 'server'`) a 404 is
  rendered at the visitor's URL, where the schema accepts `en`, so it is
  English from the server's HTML on.
- **An unknown locale is a 404.** `src/routes/[locale]/layout.tsx` exports
  `const { paramsSchema } = locales` — the generator parses the file for the
  export, so any spelling of it counts — so `/fr/ui` is a
  pathname the `/:locale/…` patterns do not answer: the walk falls through to
  `not-found.tsx` under a real 404, under `mode: 'server'` as much as on the
  static host (where `404.html` was already what got served). The layout
  still receives `params.locale` as a string — a layout's params are never
  typed by its schema, because `not-found.tsx` renders under it whether or not
  the schema accepted —
  and `locales.paths` only ever expands the listed locales, so the build never asks
  for a pathname the schema would refuse. The schema lives in a Server
  Component on purpose: a value exported from a `'use client'` module reaches
  the RSC side as a client reference, not a schema, which is why the layout
  is split into `layout.tsx` (schema, Server Component) and
  `src/components/locale-shell.tsx` (providers, header, hooks — the client
  part).
  Accepting the locale there is also what makes it the locale of that
  render for every message, on the server side.
- **Errors**: `src/routes/[locale]/error.tsx` renders `ErrorFallback` in the
  layout's hole when a page throws, and `src/routes/error.tsx` is the
  full-screen last resort when the locale shell itself does. Both are client
  components receiving `{ error, reset }` and no params; their messages read
  the locale from the URL themselves. There is no
  `react-error-boundary` and no `<ErrorBoundary>` in the layout.
- **Titles**: every `page.tsx` renders its own `<title>` through
  `src/components/page-title.tsx` (`<PageTitle name="Button" />` or
  `<PageTitle title={m.nav.theming} />` → `Button · k8ordo`); `LandingHero` does it
  for the landings and `DocPage` for guide pages (`Links and navigation — @k8ordo/router · k8ordo`), `not-found.tsx` renders its own, and the home page and the
  `/` redirect page write a bare `<title>k8ordo</title>`. The root layout
  renders none — React 19 hoists a `<title>` from anywhere, and two on screen
  is two, not a fallback. A new page without one is a regression:
  `grep -L "<PageTitle\|<LandingHero\|<DocPage\|<title" src/routes/**/page.tsx` should
  print nothing (the built HTML is the proof: every `index.html` under
  `dist/client/` carries exactly one `<title>`).
- **Markdown for agents**: nothing here lists packages for it, and nothing
  generated is committed. Which packages ship docs is `shipsDocs` in
  `src/data/shipped-docs.ts` — not `private`, `docs` in `files`, read off
  `packages/*/package.json` — and where the site serves them is `docsPathOf`
  there: `/<name>/docs/`, except `@k8ordo/ui`'s `/docs/`.
  `scripts/copy-reference-docs.ts` (run by `dev` and `build`) copies each
  such package's `docs/**/*.md` into `public/` as the markdown twins,
  git-ignored by the one `apps/docs/public/**/docs/` line.
  `/llms.txt` and `/design.md` are `route.ts` files the build writes as the
  file their `GET` answers. `src/routes/llms.txt/route.ts` joins every
  shipped `docs/llms.txt` in `PACKAGES` order, swaps each one's
  `When installed via npm, …` line for the site's, and points its
  package-relative links at the twins under the request's origin — `site` in
  the build, the dev server's own under `vp dev` — and it throws, failing the
  build, when `PACKAGES` and the shipped `docs/llms.txt` files disagree,
  when an index links to anything but the markdown the twins hold, or when
  it names `GUIDE.md` outside a link in words other than
  `Start with GUIDE.md,` (the one phrasing it rewords for the site). `src/routes/design.md/route.ts`
  builds `@k8ordo/ui`'s design spec from `src/theme/design-tokens.ts`, the
  same token view `/ui/theming` renders, plus the design rationale CSS does
  not hold.
- **Sitemap**: `framework({ mode: 'static', site: 'https://ordo.k8o.me' })` in
  `vite.config.ts` makes the build write `dist/client/sitemap.xml` listing
  every page it rendered. Nothing here maintains a page list by hand.
- **The colour scheme is `@k8ordo/color-scheme`'s.** The root layout wraps
  everything inside `<body>` in `<ColorSchemeProvider>`, which renders the
  pre-paint inline script itself, and `src/components/theme-switcher.tsx`
  calls `useColorScheme()`; there is no theme context and no hand-written
  inline script here. The writing-mode
  preference stays the site's own `defineLocalState` in `src/theme/state.ts`
  (`writing-mode`, `mode?: 'horizontal' | 'vertical'`), a directive-free
  module so a Server Component could read it. The `@k8ordo/ui` storage hooks
  (`useLocalStorage`, `useSessionStorage`, `useHash`) no longer exist, so
  neither do their pages.
- **i18n**: `@k8ordo/i18n`. `src/i18n.ts` is `defineLocales({ ja: …, en: … })`
  — the one place the list is spelled, with each locale's `timeZone`
  (`Asia/Tokyo`, `UTC`) and `dir` — exported as `locales`, from which the
  framework generates the `Register` augmentation that types every message
  against it (`.k8ordo/register.gen.ts`; never write one here), and
  `getLocale`. Messages live in
  `src/messages/<area>.ts`, one `message({ ja, en })` per export (a 3-level
  key became a group object: `m.components.button.description`), re-exported
  as namespaces from `src/messages/index.ts` so a call site reads
  `m.nav.home()`. The same call works in a Server Component and in a
  `'use client'` component; there is no provider, no hook, no `t`, and no
  key type — a prop that carries text carries a `Message` (a function) and
  the consumer calls it (`item.label()`), or, where a Server Component hands
  text to a Client Component, the string (`title={m.x.y()}`): a function
  does not cross that boundary, which is why `PageTitle`,
  `DocPage` and the landing components are shared components without a
  directive. `<Rich>` takes
  the text as children and renders its backtick spans as `<Code>`. The
  bundler keeps only the messages a client module names — measure it with
  `grep -c "ja:" dist/client/assets/*.js` after a build; a Server Component's
  text never reaches the client. Every link is `href` / `navigateTo` from
  `src/links.ts` — the router's `bindParams` with the locale supplied by
  `locales.getLocale()` — so a path is a `/:locale/…` pattern of the
  generated table (`SitePath` for the ones navigation data may name) and a
  typo fails to compile. `locales.localize` remains only for the language
  switcher, which takes the pathname in hand to another locale;
  `delocalize` also reads the locale off the URL where no accepted param
  is in hand — the root layout's `<html lang>` and the 404 shell. The `/` page negotiates with
  `locales.negotiate(navigator.languages)` and `navigateTo('/:locale', …)`; `switch` is a reserved word, so
  that one component's group is `switchInput`.
- **Styling**: Tailwind CSS 4, uses `@k8ordo/ui` design tokens
- **Root provider**: `UIProvider` wraps each locale subtree in
  `src/components/locale-shell.tsx`, for toasts. Component
  built-in strings follow the site locale on their own: `@k8ordo/ui` reads
  `@k8ordo/i18n`'s current locale, and the shell importing `locales` is what
  defines the set in the browser
- **Where the browser is**: `usePathname()` from `@k8ordo/framework`. Under the
  framework the browser holds no route table, so `useRoute` / `useParams` have
  no match to read — a page receives `params` as a prop, and anything else asks
  the platform.

### Directory Structure

```
src/
  routes/              # the URL space, and nothing else: only route files
    layout.tsx         # <html>/<head>/<body> — the document itself, no <title>
    error.tsx          # the shell itself threw: full-screen ErrorFallback
    page.tsx           # / — detects the locale and redirects
    llms.txt/route.ts  # /llms.txt — every shipped docs/llms.txt, one file at build
    design.md/route.ts # /design.md — @k8ordo/ui's design spec, from the tokens
    [locale]/
      layout.tsx       # paramsSchema (locale) — a Server Component
      error.tsx        # a page threw: ErrorFallback inside the shell
      page.tsx         # /:locale
      not-found.tsx    # /:locale/* — becomes 404.html
      <package>/<section>/page.tsx  # a guide page: <DocPage> + <DocSection>s
      ui/components/<name>/page.tsx
  constants.ts         # Shared constants (e.g. STORYBOOK_URL)
  components/          # Shared doc components (ComponentPreview, PropsTable, etc.)
    locale-shell.tsx   # the [locale] layout's client part: providers, header, sidebar, footer
  demos/               # live demos and previews, at the URL path they appear on, minus [locale]
    form/              # the /form GET-form demo: state definition + form
    <package>/<section>/  # that page's live demo, if it has one
    ui/components/     # the catalog's interactive previews, <name>-previews.tsx
  data/                # PACKAGES (packages.ts), which packages ship docs (shipped-docs), the sidebars (components-nav, ai-nav), generated props (component-props)
  i18n.ts              # defineLocales — the locale set (its Register is generated)
  links.ts             # href / navigateTo with the locale bound; SitePath
  messages/            # message() per export, one file per area, index.ts re-exports namespaces
  styles/              # CSS entry
  theme/               # state.ts (writing-mode defineLocalState) + its context, design-tokens.ts (/ui/theming and /design.md)
scripts/
  copy-reference-docs.ts  # the markdown twins, into public/ (git-ignored)
```

## Page Patterns

### Component Documentation Page

Each component is a directory under `src/routes/[locale]/ui/components/`
whose `page.tsx` default-exports the page, following this structure:

1. **Title**: `<PageTitle name="Button" />` as the first child (see Titles above)
2. **Header**: `Heading` + description via `<Rich>{m.components.x.description()}</Rich>` + Storybook link
3. **Import section**: `CodeBlock` (from `@k8ordo/ui/code-block`) showing the import statement
4. **Usage section**: Multiple `ComponentPreview` blocks demonstrating variants, sizes, states, etc.
5. **Props table**: `<PropsTable items={propsOf('Button')} inherits={inheritsOf('Button')} />` — read from the generated `@k8ordo/ui/props.json` through `src/data/component-props.ts`, never written by hand

```tsx
export default function ButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Button" />
      {/* Header */}
      {/* Import */}
      {/* Usage examples with ComponentPreview */}
      {/* Props table */}
    </div>
  );
}
```

### Package Guide Page

Every package documents itself as a guide: a `get-started` page, then topic
pages, each a directory under `src/routes/[locale]/<package>/` listed in one
of that package's `groups` in `PACKAGES`. `@k8ordo/ui`'s guide is
`get-started`, `theming`, `i18n` and `form`; its catalog pages keep their own
layout (below). The page is a Server Component:

```tsx
export default function RouterLinksPage() {
  return (
    <DocPage
      introduction={m.routerLinks.introduction}
      path="/:locale/router/links"
    >
      <DocSection id="href" title={m.routerLinks.hrefTitle}>
        <CodeBlock code={HREF_EXAMPLE} lang="tsx" />
        <p>
          <Rich>{m.routerLinks.hrefArguments()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
```

- `DocPage` takes its title from the section's label in `PACKAGES`, so the
  sidebar, breadcrumb, pager and `<title>` cannot disagree; it renders the
  prev/next pager itself, and the contents on the right from its own
  `DocSection`, `DocSubsection`, `Playground` and `ApiEntry` children.
- A package's guide documents that package alone. What it does together with
  another package of the family — `@k8ordo/framework` handing a page its
  `search` or `request.cookies`, say — belongs in that other package's guide,
  not here; a page here may name it in one sentence. A framework outside the
  family has no guide here to host it, so wiring the package into one gets a
  page of the package's own (`/state/nextjs`). A `get-started` page is
  the introduction and nothing more: install, define, read and update in a
  component, and the demo.
- A `how-it-works` page (仕組み) has one job in every package: the premises
  of the package's behaviour — when and where it does what — and what it
  guarantees and does not. It is what a reader opens when something behaves
  unexpectedly or to learn why a constraint exists, so it holds no usage (that
  is the guide's), no API listing and no fixes (troubleshooting's); where one
  of those touches it, one sentence and a link. Its `introduction` is one
  sentence, 「`@k8ordo/<name>`が〈主題〉をいつ、どこで行うかと、保証することとしないことが分かります。」,
  and it ends with the sections 保証すること (`guarantees`) and 保証しないこと
  (`non-guarantees`), each a list of facts the package's source backs.
- The shape of a page (`@k8ordo/state`'s pages are the model): `introduction`
  is one or two sentences saying what the page lets the reader do, never an
  announcement of what the page explains. A section leads with its code and
  explains after it, in one to three paragraphs that point at the code's lines
  (`marks`, `callouts`); a section with no code is its paragraphs alone. At
  most one `Note` or `Pitfall` per section. A page
  ends with its last section — no 次のステップ list, since the pager and the
  sidebar already give the order.
- Titles are short noun phrases naming the subject, never a claim: a page's
  label in `PACKAGES` (置き場所, URL, 履歴エントリ, Cookie, 更新, テスト,
  API, トラブルシューティング) is at most about eight characters, a
  `DocSection` heading about twelve (6つの置き場所, 既定値, 拒まれる書き方).
  An `ApiEntry` is headed by its export's name; a troubleshooting entry by the
  error text alone when there is one. No title is a sentence — not the
  landing's tagline or claims, not a `Playground`'s, not a troubleshooting
  entry's: `戻るボタンのデモ`, not `戻るボタンで元に戻す`;
  `再読み込みで既定値に戻る日付`, not `日付が再読み込みで既定値に戻る`. A
  reader skims titles to decide what to read, and a sentence gives no gist.
- A landing is `LandingHero` (name, tagline, install, the point in code and
  the `get-started` button) and two or three `LandingClaim`s, one of which
  may hold the `Playground`: what the package alone promises its user, never
  what it does with another package of the family. It has no 次に読む list
  and no link to the agent guide.
- Its words live in `src/messages/<package>-<section>.ts` (namespace
  `m.<package><Section>`), with `introduction` as the page's lead.
- Code samples carry no natural-language comments — both locales see the same
  sample — and the explanation belongs in the messages around them. A file
  name goes in the `CodeBlock`'s `title`; point at lines with `marks`, and
  with `callouts` when a line needs a localized note. Keep lines short enough
  not to scroll in the 46rem column (about 70 characters).
- A sample that shows a framework application's files places them as
  `examples/static-basic` and `examples/server-basic` do: route files in
  `src/routes/`, components in `src/components/`, and every other module —
  Server Actions, schemas, state definitions, data, helpers — in `src/lib/`,
  both flat. Two files that would collide in one sample are named by their
  feature (`talk-actions.ts`). What a package's docs give a place of its own
  keeps it: `src/i18n.ts` and `src/state.ts` at the root, and messages in
  `src/messages/`, a file per area behind an `index.ts` barrel. A title
  names a file by its path from the project root (`src/routes/page.tsx`,
  `src/i18n.ts`, `vite.config.ts`); a bare name (`talk-form.tsx`) is for a
  file whose place the sample does not depend on. The site's own `src/` —
  `demos/`, `components/`, `data/`, `messages/` and the rest — is its
  implementation, not a sample, and keeps its own layout.
- Asides are `Note` and `Pitfall` (`src/components/callout.tsx`), which render
  `@k8ordo/ui`'s `Callout`.
- A live demo is a `'use client'` component under `src/demos/` at the page's
  URL path without the locale (`/form/get-started` →
  `src/demos/form/get-started/`), shown in a `Playground` with `steps` the
  reader can follow, and only where
  touching it teaches something the prose cannot. The site is static, so a
  demo simulates the server in the browser and says so. A demo that prints
  a value prints it as source would spell it, with `jsLiteral`
  (`src/components/js-literal.ts`): `{ page: 1 }`, not `JSON.stringify`'s
  `{"page":1}`.
- An API reference page is a run of `ApiEntry`s (name, entry point,
  signature, params, returns, fields).
- A `get-started` page installs the package with `PackageInstall`
  (`src/components/install.tsx`): the command adds the package's required
  peers apart from what an application already has (React, Vite), and below
  it `Requirements` lists what it runs with (React, Vite, Node.js,
  TypeScript), and one sentence says where the agent guide ships
  (`node_modules/@k8ordo/<name>/docs/GUIDE.md`) so an AGENTS.md can point at
  it — a path to copy, not a link. The site shows no table of peers — no library's
  documentation does — and never mentions the `@types/*` peers, which go
  with TypeScript. An optional peer that a feature needs is installed on that
  feature's page (`InstallCommand`). The versions are read from the package
  README's generated `<!-- peers -->` table and its `engines`
  (`src/data/peers.ts`), never written on the site; a range that is not a
  bare lower bound fails the build, since the list can only say "or later".
  These stay Server Components: the READMEs they read must not reach the
  client bundle.
- `@k8ordo/framework` documents both of its modes in one guide, and
  `/framework/modes` is where a reader chooses between them. A section that
  holds for one mode only says so in its first sentence
  (「serverモードだけで使えます。」); where the modes differ inside a section,
  each mode gets its own paragraph beginning 「staticモードでは」 or
  「serverモードでは」, or, on a page that is two halves
  (`/framework/csp`, `/framework/deploy`), its own `DocSection` with the topics
  as `DocSubsection`s. Code samples import as an application does: the
  router's names from `@k8ordo/framework`, the plugin from
  `@k8ordo/framework/vite`, the request API from `@k8ordo/framework/server` —
  never from `@k8ordo/router`.

### Preview Components

Complex interactive previews live in
`src/demos/ui/components/<name>-previews.tsx` and are imported by the page.
`routes/` holds only route files (any other file there fails the build), so
previews and live demos sit under `src/demos/`, at the path of the page that
shows them.

## Writing the Japanese copy

The site's Japanese reads like k8o's blog (`k35o/k8o`,
`apps/main/src/app/blog/(articles)/*/page.mdx`); read two or three articles
there before writing a page, and read two or three of `@k8ordo/state`'s pages,
which were rewritten to this standard. Concretely:

- です/ます. One fact per sentence: at most two 読点 and about seventy
  characters; split a sentence rather than joining three things with 、. Do
  not stack short assertions either — a sentence says one thing in full.
- Say it with the API's names and the ordinary technical words, never a
  metaphor or a paraphrase: not 型の付いた箱 but スキーマを持たない状態, not
  受け持つ but 扱う (or what it does), not 残り方 but いつまで残るか, not
  〜がそこから決まる but a sentence with its subject (〜から作る), not
  隠れた面／2つの面 but `url`と`entry`, not 境界を越える but
  URLやストレージから読み戻す, not 黙って共有 but 同じストアを共有, not 拾う
  but 読めたフィールドだけを残す, not 行 (a storage row) but 保存した値.
  置き場所 is the package's own concept and stays.
- Give a reason (〜からです, 〜ためです, 〜のです) only where the reader
  cannot use the feature correctly without it: at most once per message, and
  never as a paragraph's closing flourish.
- No translationese: 投げる is エラーになる with the error text quoted, 描画に出る
  is 次の描画に反映される, 履歴エントリを積む is 追加する, 言語の交渉 is
  言語の選択, and 届く only where nothing more precise (受け取る, 発火する)
  fits. Prefer the words a Japanese developer would say: 展開する (spread),
  作る (derive), 入力欄 (a form field), 検証する／確かめる (validate, check).
- The same word for the same thing on every page: 既定値 (never デフォルト;
  初期値 only for memory state's `initial`), スキーマに合わない値,
  フィールドごとに既定値に戻る, 履歴エントリ, 購読する／再描画,
  クエリ／パラメータ, Server Component／Client Component.
- No space between Japanese and Latin letters, digits, or inline code:
  `zodのスキーマ1つで`, `` `useForm`が返す ``. Keep the spaces inside code.
- List words with 、 or と, never 中黒 (・). Define a term with a full-width
  colon (`用語：説明`), never a dash. No bold, tables or dashes in prose; no
  runs of seven or more kanji; none of the stock phrases (重要なのは、
  シームレス、強力な、することができる、このページでは〜を説明します).
- Say a fact once per page. Where another page explains it, one sentence and
  a `LocaleAnchor` to that page.

The English copy says the same things in natural English — the same
structure, short sentences, the API's names, no metaphors; it is not a word
for word translation of the Japanese, nor the other way round.

## Shared Doc Components

| Component          | Purpose                              |
| ------------------ | ------------------------------------ |
| `PageTitle`        | The page's `<title>` (`… · k8ordo`)  |
| `LandingHero`      | A package landing's opening          |
| `LandingClaim`     | A landing's claim with its example   |
| `DocPage`          | A package guide page, with its pager |
| `DocSection`       | A guide page's h2 section            |
| `DocSubsection`    | An h3 inside a `DocSection`          |
| `Playground`       | A live demo with steps to follow     |
| `ApiEntry`         | One export on an API reference page  |
| `Note` / `Pitfall` | An aside, as `@k8ordo/ui`'s Callout  |
| `ComponentPreview` | Live preview + code block combo      |
| `PropsTable`       | Props documentation table            |
| `PackageInstall`   | Install command and requirements     |
| `Rich`             | Text with backtick spans as `<Code>` |
| `InstallTabs`      | Package manager install command tabs |
| `TokenCard`        | Design token display card            |

Code samples are `@k8ordo/ui`'s own `CodeBlock` (`@k8ordo/ui/code-block`),
highlighted on the server; the site keeps no highlighter of its own.

## The framework it runs on

`@k8ordo/framework` and `@k8ordo/router` live in this repository
([packages/framework](../../packages/framework), [packages/router](../../packages/router)),
as do `@k8ordo/state`, `@k8ordo/form`, `@k8ordo/i18n` and
`@k8ordo/color-scheme`, which the site's demos, its words and its own
preferences run on. Their guides are `docs/GUIDE.md` in each package. Being the framework's own
first application is the point: what the site needs is the pressure the
framework is designed against.

## Key Dependencies

- **@k8ordo/framework** + **@k8ordo/router** (workspace) for the framework itself
- **@k8ordo/ui** (workspace) for UI components
- **@k8ordo/state** + **@k8ordo/form** (workspace) for the preferences and the live demos
- **@k8ordo/i18n** + **@k8ordo/color-scheme** (workspace) for every message and the colour scheme
