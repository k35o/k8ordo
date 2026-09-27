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

export const routeServer = message({
  ja: '実行中のサーバーでは、7 つのメソッドのどれを export してもよく、それぞれは自分のメソッドにだけ答えます。自分の `HEAD` が無ければ、`GET` の答えから本文を外したものが `HEAD` の答えです。export していないメソッドには、export したものを `Allow` に並べた `405` を返します。上の guard が先に走ります。`route.ts` への `POST` は Server Action と違い、同じ origin からであることを求めません。送ってくるもの（webhook）はこのサイトのフォームではないので、要ることは `route.ts` が自分で確かめます。guard と同じく応答に答える側なので、`cookies()`・`responseHeaders()`・`requestHeaders()` が使えます。',
  en: 'Any of the seven methods may be exported, and each answers only its own; a `HEAD` with no export of its own is its `GET` with the body left off, and a method it does not export gets a `405` whose `Allow` names the ones it does. The guards above it run first. A `POST` to a `route.ts` is not held to the same-origin rule a Server Action is — what posts to one, a webhook, is not a form on this site — so it checks what it needs itself. It answers the request as much as a guard does: `cookies()`, `responseHeaders()` and `requestHeaders()` work inside it.',
});
