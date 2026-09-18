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

export const refusesThrow = message({
  ja: 'ビルド中に throw したコンポーネント（Server Component はいつでも、クライアントコンポーネントは上に Suspense の境界が無いとき）',
  en: 'A component that throws while the build renders it — a Server Component always, a client component when no Suspense boundary sits above it',
});
