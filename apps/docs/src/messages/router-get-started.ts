import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/router` は URL の pathname を扱うルーターです。ルート表を 1 つ書けば、マッチング・型付きリンク・ナビゲーションがそこから決まります。このページでは小さなアプリを、表を書く・ブラウザでマウントする・リンクを表と型で照合する、の順に最後まで通して作ります。',
  en: '`@k8ordo/router` is a router for the pathname of the URL. You write one route table, and the matching, the typed links and the navigation all follow from it. This page builds a small application end to end: the table, mounting it in the browser, and checking links against it in the type system.',
});

export const scopeTitle = message({
  ja: '担当する範囲',
  en: 'What it owns',
});

export const scopeDescription = message({
  ja: 'このパッケージが持つのは URL のうち pathname だけです。search params と履歴エントリの状態は `@k8ordo/state` が持ち、境界は URL の `?` と一致します。',
  en: 'This package owns one part of the URL: the pathname. Search params and history-entry state belong to `@k8ordo/state`, and the boundary between the two is the URL’s own `?`.',
});

export const scopeTable = {
  part: message({ ja: 'URL の部分', en: 'Part of the URL' }),
  example: message({ ja: '例', en: 'Example' }),
  owner: message({ ja: '担当', en: 'Owned by' }),
  pathname: message({ ja: 'pathname', en: 'Pathname' }),
  search: message({ ja: 'search', en: 'Search' }),
  entryState: message({ ja: '履歴エントリの状態', en: 'History-entry state' }),
  entryStateExample: message({
    ja: '（URL に現れない）',
    en: '(not in the URL)',
  }),
  fragment: message({ ja: 'fragment', en: 'Fragment' }),
  fragmentOwner: message({
    ja: 'ブラウザ（ページが変わるときはルーターがその位置へスクロール）',
    en: 'The browser (on a page change, the router scrolls to it)',
  }),
};

export const scopeNoSearch = message({
  ja: '`useSearchParams` はありません。search の生の文字列も渡しません。search の 1 項目だけを読むコンポーネントは、その項目が変わったときだけ再描画されるべきで、それはキー単位で購読する状態管理の仕事だからです。',
  en: 'There is no `useSearchParams`, and the raw search string is never handed out. A component that reads one field of the search should re-render when that field changes and not otherwise, which is a job for keyed subscriptions, not for a router.',
});

export const scopeNoFetch = message({
  ja: 'データの取得もしません。loader もルート単位のデータ API もキャッシュもありません。データは必要とするコンポーネントのもので、クライアントアプリなら `use()` と `<Suspense>`、フレームワークの下ならサーバーがその答えです。ルーターが取得まで持つと、React がすでに答えている問いに 2 つ目の答えを作ることになります。',
  en: 'It does not fetch either. There is no loader, no route-level data API and no cache. Data belongs to the component that needs it — `use()` and `<Suspense>` in a client application, the server under the framework — and a router that owned fetching would be a second answer to a question React already answers.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Installation',
});

export const installDescription = message({
  ja: 'ブラウザで描画するアプリでは、React と React DOM と一緒に入れます。`@k8ordo/static` や `@k8ordo/server` を使うアプリも、このパッケージを直接の依存に持ちます。',
  en: 'In an application that renders in the browser, install it alongside React and React DOM. An application on `@k8ordo/static` or `@k8ordo/server` depends on this package directly as well.',
});

export const requirementsDescription = message({
  ja: 'peer dependencies は次のとおりです。ランタイムの依存はありません。',
  en: 'The peer dependencies are below. There are no runtime dependencies.',
});

export const requirementReact = message({
  ja: '`react` >= 19.3.0',
  en: '`react` >= 19.3.0',
});

export const requirementTypes = message({
  ja: '`typescript` >= 7.0.2 と `@types/react` >= 19.3.0（どちらも任意。同梱の型定義を使うときに必要）',
  en: '`typescript` >= 7.0.2 and `@types/react` >= 19.3.0 (both optional; needed for the shipped type declarations)',
});

export const requirementPlatform = message({
  ja: 'Navigation API と URLPattern はプラットフォームのものを使います。どちらも Baseline の newly available に達しており、polyfill もフォールバックも同梱しません。',
  en: 'The Navigation API and URLPattern are the platform’s. Both have reached Baseline newly available, and no polyfill or fallback ships with the package.',
});

export const requirementEsm = message({
  ja: 'ESM のみで配布されます。',
  en: 'It ships as ESM only.',
});

export const buildTitle = message({
  ja: '最小のアプリを作る',
  en: 'Build a minimal application',
});

export const buildDescription = message({
  ja: '表を書く、マウントする、ページからリンクする、表と型で照合する、の 4 段階です。',
  en: 'Four steps: write the table, mount it, link from the pages, and check the links against the table.',
});

export const stepTableTitle = message({
  ja: '1. ルート表',
  en: '1. The route table',
});

export const stepTableDescription = message({
  ja: '`defineRoutes` に pathname パターンをキーとした表を渡します。`/` に置いた branch は URL に何も足さず、`layout` がすべてのページを包みます。照合は書いた順で最初に合ったものが勝つので、何にでも合う `/*` は最後に置きます。',
  en: 'Pass `defineRoutes` a table keyed by pathname patterns. A branch under `/` adds nothing to the URL, and its `layout` wraps every page. Matching takes the first pattern that fits in the order written, so `/*`, which fits anything, goes last.',
});

export const stepMountTitle = message({
  ja: '2. マウントする',
  en: '2. Mount it',
});

export const stepMountDescription = message({
  ja: '`<Router routes>` をアプリの根に 1 度だけ置きます。レイアウトは自分が包む中身を `<Outlet />` で描きます。`<Router>` はマウントした時点でブラウザの現在地を読むので、ブラウザで描画するアプリのためのものです。サーバーやビルド時に描画するなら `@k8ordo/static` か `@k8ordo/server` を使います。',
  en: 'Put `<Router routes>` at the root of the application, once. A layout renders what it wraps through `<Outlet />`. `<Router>` reads where the browser is when it mounts, so it is for an application that renders in the browser; to render on a server or at build time, use `@k8ordo/static` or `@k8ordo/server`.',
});

export const stepPagesTitle = message({
  ja: '3. ページからリンクする',
  en: '3. Link from the pages',
});

export const stepPagesDescription = message({
  ja: 'ページは表を import しません。`href` にも `navigateTo` にも `useParams` にも、パターンの文字列を渡すだけです。表を持つのは `<Router>` だけなので、「表がページを import し、ページが表を import する」循環は構造的に生まれません。',
  en: 'Pages never import the table. `href`, `navigateTo` and `useParams` all take the pattern as a string. Only `<Router>` holds the table’s value, so the cycle of a table importing pages that import the table cannot form.',
});

export const stepPagesPlainAnchor = message({
  ja: 'リンクは素の `<a>` です。Navigation API の下ではブラウザが送る navigate イベントをルーターが受け取るので、`<a>` がそのままクライアント遷移になります。`useParams` の戻り値の型はパターン文字列から推論され、`id` は `string` です。',
  en: 'A link is a plain `<a>`. Under the Navigation API the router receives the navigate event the browser sends anyway, so the anchor is already a client navigation. The type `useParams` returns is inferred from the pattern string, so `id` is a `string`.',
});

export const stepRegisterTitle = message({
  ja: '4. 表と型で照合する',
  en: '4. Check links against the table',
});

export const stepRegisterDescription = message({
  ja: 'ここまででも params はパターン文字列から推論されるので、`:id` を渡し忘れればコンパイルで落ちます。パターンそのものを実際の表と照合するには、`Register` を 1 度だけ augment します。',
  en: 'Params are already inferred from the pattern string, so forgetting `:id` fails to compile. To check the pattern itself against the real table, augment `Register` once.',
});

export const stepRegisterInclude = message({
  ja: '宣言ファイルは `tsconfig.json` の `include` に入れます。',
  en: 'Add the declaration file to `include` in `tsconfig.json`.',
});

export const stepRegisterResult = message({
  ja: 'これで表に無いパターンも型エラーになります。augment の前は `/` で始まる任意の文字列が通ります。augment はアプリでだけ行います。ライブラリが行うと、その表をすべての利用者に押し付けることになります。',
  en: 'Now a pattern the table does not have is a type error too. Before the augmentation any string starting with `/` passes. Augment only in an application: a library that did it would impose its table on every consumer.',
});

export const nextTitle = message({
  ja: '次に読む',
  en: 'Next steps',
});

export const nextRoutes = message({
  ja: 'ルート表の文法（params・ワイルドカード・グループ・順序・エラー境界）',
  en: 'The table’s grammar: params, wildcards, groups, order and error boundaries',
});

export const nextLinks = message({
  ja: 'リンク・`navigateTo`・現在地を読むフック',
  en: 'Links, `navigateTo`, and the hooks that read the location',
});

export const nextNavigation = message({
  ja: 'ナビゲーションの保証、ページ遷移のアニメーション、テスト',
  en: 'What navigation guarantees, animating page changes, and testing',
});

export const nextFramework = message({
  ja: '`@k8ordo/static` / `@k8ordo/server` の下でのルーター',
  en: 'The router under `@k8ordo/static` and `@k8ordo/server`',
});

export const nextStatic = message({
  ja: 'ビルド時にすべてのページを描く `@k8ordo/static`',
  en: '`@k8ordo/static`, which renders every page at build time',
});

export const nextServer = message({
  ja: 'リクエストごとに描く `@k8ordo/server`',
  en: '`@k8ordo/server`, which renders per request',
});
