import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`src/routes/` のディレクトリ木が、そのままアプリの URL です。このページは、ファイル名とディレクトリ名の文法、照合の順序、ビルドが拒むもの、生成されるファイル、ページがタイトルを描く方法を説明します。',
  en: "The directory tree under `src/routes/` is the application's URL space. This page covers the grammar of file and directory names, the order patterns are tried in, what the build refuses, the generated files, and how a page renders its title.",
});

export const filesNote = message({
  ja: 'このモードでは、`page.tsx`・`layout.tsx`・`not-found.tsx` がリクエストのヘッダーと cookie も `request` として受け取ります。`not-found.tsx` はディレクトリごとに置けて、その答えは本物の 404 です。',
  en: "In this mode `page.tsx`, `layout.tsx` and `not-found.tsx` also receive the request's headers and cookies as `request`. Each directory may declare its own `not-found.tsx`, and its answer is a real 404.",
});

export const refusesNote = message({
  ja: 'このモードでは、`routes/` の形についてビルドが止まる理由は上の表と隠されたルートだけです。パラメータの値はリクエストと一緒に届くので、列挙を求められることはありません。',
  en: 'In this mode the table above and shadowed routes are the only reasons the shape of `routes/` stops the build: parameter values arrive with the request, so nothing asks for them to be listed.',
});
