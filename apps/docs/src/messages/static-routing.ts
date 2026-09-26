import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`src/routes/` のディレクトリ木が、そのままアプリの URL です。このページは、ファイル名とディレクトリ名の文法、照合の順序、ビルドが拒むもの、生成されるファイル、ページがタイトルを描く方法を説明します。',
  en: "The directory tree under `src/routes/` is the application's URL space. This page covers the grammar of file and directory names, the order patterns are tried in, what the build refuses, the generated files, and how a page renders its title.",
});

export const filesNote = message({
  ja: 'このモードでは、ルートファイルに `request` は渡りません。ファイルを書き出すビルドには、読むべきリクエストが無いからです。`not-found.tsx` は `404.html` という 1 枚のファイルに描かれるので、宣言できるのは 1 つだけです。',
  en: 'In this mode a route file receives no `request`: a build that writes files has no request to read. `not-found.tsx` is rendered into one file, `404.html`, so only one can be declared.',
});

export const refusesNote = message({
  ja: 'このモードのビルドは、ルートの形のほかにも次の理由で止まります。',
  en: 'A build in this mode also stops for these reasons:',
});

export const refusesPaths = message({
  ja: 'パラメータ付きルートの pathname が足りない、または `paths` が返した値が使えない',
  en: 'A parameterised route with no pathnames, or a value returned by `paths` that cannot be used',
});

export const refusesNotFound = message({
  ja: '`not-found.tsx` が 2 つ以上ある',
  en: 'More than one `not-found.tsx`',
});

export const refusesActions = message({
  ja: "`'use server'` を宣言したモジュールがある",
  en: "A module that declares `'use server'`",
});

export const refusesGuards = message({
  ja: '`guard.ts` がある',
  en: 'A `guard.ts`',
});

export const refusesRouteMethods = message({
  ja: '`GET` 以外のメソッドを export する `route.ts` がある',
  en: 'A `route.ts` that exports a method other than `GET`',
});

export const refusesThrow = message({
  ja: 'ビルド中に throw したコンポーネント（Server Component はいつでも、クライアントコンポーネントは上に Suspense の境界が無いとき）',
  en: 'A component that throws while the build renders it — a Server Component always, a client component when no Suspense boundary sits above it',
});

export const routeStatic = message({
  ja: 'ビルドは、サイトが持つ pathname ごとに `GET` を 1 度呼び（パラメータのあるパターンにはページと同じく `paths` が要ります）、答えをその pathname のファイルとして書きます（`dist/client/feed.xml`）。`site` を渡すと、リクエストの origin はサイトの配信元になるので、RSS のリンクを絶対 URL で書けます。`GET` は `200` で答える必要があり、それ以外なら pathname を挙げてビルドが止まります。ファイルは `GET` 以外に答えられないので、ほかのメソッドを export した `route.ts` は、ビルドでも `vite dev` でも名指しで拒みます。`/` の `route.ts` と、下にページを書く `route.ts` はファイルにできません。ページではないので `sitemap.xml` には載りません。',
  en: 'The build calls its `GET` once for each pathname the site has — a pattern with params needs `paths`, as a page’s does — and writes what it answered as the file at that pathname: `dist/client/feed.xml`. With `site`, the request’s origin is where the site is served, so an RSS feed’s links can be absolute. The `GET` has to answer `200`; anything else stops the build naming the pathname. A file answers nothing but `GET`, so a `route.ts` exporting another method is refused by name, in the build and in `vite dev`. A `route.ts` at `/`, or one with pages written below it, cannot be a file, and what it writes is not a page, so `sitemap.xml` leaves it out.',
});

export const loadingStatic = message({
  ja: 'ファイルは丸ごと書かれるので、HTML に `loading.tsx` が出ることはありません。出るのは、クライアント遷移で次のページのペイロードが届くまでの間です。',
  en: 'A file is written whole, so the HTML never shows a `loading.tsx`; a client navigation does, while the next page’s payload arrives.',
});
