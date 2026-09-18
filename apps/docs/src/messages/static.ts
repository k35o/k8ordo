import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリをファイルに焼きます。すべてのルートを事前に描画し、出力は静的ホスティングに置けるディレクトリだけ。実行時にサーバーはいりません。',
  en: 'Builds an application into files. Every route is rendered ahead of time, and what ships is a directory a static host can serve — no server at run time.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureRoutes = message({
  ja: 'routes/ が URL 空間',
  en: 'routes/ is the URL space',
});

export const featureRoutesDescription = message({
  ja: 'ディレクトリ木がそのまま pathname 空間です。page/layout/not-found/error/redirect・`[param]`・`(group)`・`_` の私物だけを認め、規約から外れたものはビルドを落とします。',
  en: 'The directory tree is the pathname space: page/layout/not-found/error/redirect, `[param]`, `(group)`, and `_`-prefixed privates. Anything outside the grammar fails the build.',
});

export const featureGenerated = message({
  ja: '配線は書かない',
  en: 'The wiring is not yours to write',
});

export const featureGeneratedDescription = message({
  ja: 'ルート表と、router / state への型の配線は生成されます。生成物はルーターの公開 API を使ったただのソースで、diff で読めます。',
  en: 'The route table and the typed-path wiring into router and state are generated — as ordinary source using the public API, readable in a diff.',
});

export const featureBoundary = message({
  ja: '境界は検査される',
  en: 'Boundaries are checked',
});

export const featureBoundaryDescription = message({
  ja: "実行環境は React 自身の `'use client'` で宣言します。`server-only` を import したモジュールがクライアントに届いた時点でビルドが落ちるので、秘密は間に何段挟まっても渡りません。",
  en: "Execution is declared with React's own `'use client'`. The build fails the moment a `server-only` module reaches the client, so secrets cannot cross however many imports sit in between.",
});

export const featureFiles = message({
  ja: 'モードは依存で決まる',
  en: 'The mode is the dependency',
});

export const featureFilesDescription = message({
  ja: 'このパッケージを入れることが「静的である」ことです。リクエスト依存は、守るべき規則ではなく存在しない API です。RSC のパイプラインがそれでもコンパイルする Server Action は、ビルドと `vite dev` が名指しで拒否します。パラメータ付きルートは列挙必須で、欠けたままビルドは通りません。`site` を渡せば sitemap.xml も書きます。',
  en: 'Installing this package is what makes the application static: request-time data is not a rule to remember but an API that does not exist, and a Server Action, which the RSC pipeline still compiles, is refused by name in the build and in `vite dev`. Parameterised routes must be enumerated, or the build stops. Pass `site` and the build writes sitemap.xml too.',
});

export const featureRouteFiles = message({
  ja: 'error.tsx と redirect.ts',
  en: 'error.tsx and redirect.ts',
});

export const featureRouteFilesDescription = message({
  ja: 'ページが throw したら `error.tsx` が layout の内側に描かれ、枠は残ります。ビルド中に throw した Server Component はビルドを止めます。移転したディレクトリには `redirect.ts` を 1 行置くだけです。',
  en: 'When a page throws, `error.tsx` renders inside the layout and the frame survives; a Server Component that throws during the build stops it. A directory that moved keeps a one-line `redirect.ts`.',
});

export const featureParams = message({
  ja: 'パラメータにスキーマ',
  en: 'Parameters take a schema',
});

export const featureParamsDescription = message({
  ja: '`page.tsx` や `layout.tsx` が `paramsSchema` を export すると、合わない値はそのパターンが答えず、not-found に落ちます。リンクはスキーマの出力型で書けます。',
  en: 'A `page.tsx` or `layout.tsx` that exports `paramsSchema` makes a refused value a pathname the pattern does not answer, so it falls through to not-found. Links take what the page receives, typed by the schema.',
});

export const exampleTitle = message({
  ja: 'ディレクトリが URL',
  en: 'Directories are the URL',
});

export const exampleDescription = message({
  ja: 'routes/ の木がそのまま pathname 空間になり、表と型の配線は生成されます。',
  en: 'The routes/ tree is the pathname space; the table and the type wiring are generated from it.',
});

export const docsTitle = message({
  ja: 'ドキュメント',
  en: 'Documentation',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/static/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/static/docs/`.',
});

export const navRouting = message({
  ja: 'routes/',
  en: 'routes/',
});

export const navParams = message({
  ja: 'パラメータ',
  en: 'Parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクト',
  en: 'Errors & redirects',
});

export const navBoundaries = message({
  ja: '実行境界',
  en: 'Boundaries',
});

export const navDeploy = message({
  ja: 'ビルドと配信',
  en: 'Build & deploy',
});
