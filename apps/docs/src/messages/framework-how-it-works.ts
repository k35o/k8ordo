import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'staticモードとserverモードの主な違いは、同じリクエストハンドラをビルドのときに呼ぶか、リクエストのたびに呼ぶかです。モードごとにエラーになるものも、この違いで変わります。',
  en: 'Static mode calls the request handler at build time, and server mode calls it per request. That is the chief difference between them, and it changes what each mode rejects.',
});

export const modeTitle = message({
  ja: 'モードの指定',
  en: 'Setting the mode',
});

export const modeDependency = message({
  ja: 'モードは`framework()`の`mode`で決まります。どちらのモードでも、インストールするのは同じ`@k8ordo/framework`です。',
  en: "`framework()`'s `mode` option picks the mode. Either way, the package installed is the same `@k8ordo/framework`.",
});

export const modeSame = message({
  ja: "`routes/`の書き方と`'use client'`の境界は、どちらのモードでも同じです。",
  en: "The `routes/` conventions and the `'use client'` boundary are the same in both modes.",
});

export const handlerTitle = message({
  ja: 'ハンドラの呼ばれ方',
  en: 'Handler calls',
});

export const handlerBuild = message({
  ja: 'どちらのモードでも、`vite build`は`dist/rsc/index.js`にリクエストハンドラを書き出します。`Request`を受け取って`Response`を返す関数です。',
  en: 'Under either mode, `vite build` writes a request handler to `dist/rsc/index.js`: a function that takes a `Request` and returns a `Response`.',
});

export const handlerModes = message({
  ja: 'staticモードでは、ビルドの最後にページごとにHTMLとペイロードのためにハンドラを2回呼び、返った`Response`を`index.html`と`index.rsc`に書き出します。リダイレクトするページは`index.html`だけ、`route.ts`は`GET`の`Response`を1つのファイルに書き出します。serverモードでは、リクエストのたびにハンドラを呼び、その`Response`を返します。',
  en: 'Under static mode the build calls the handler twice per page at its end, once for the HTML and once for the payload, and writes the responses to `index.html` and `index.rsc`. A page that redirects gets only `index.html`, and a `route.ts` is written as the one file its `GET` answers. Under server mode the handler is called for every request, and its response is returned.',
});

export const handlerDev = message({
  ja: '`vite dev`は、どちらのモードでもリクエストのたびにハンドラを呼びます。そのためstaticモードでも、`paths`に無い値のページが開発中は表示されます。`fallback.tsx`のあるページでは、その値にシェルが答えます。開発中とビルドのほかの違いは',
  en: '`vite dev` calls the handler for every request under either mode. So under static mode too, a page for a value `paths` does not list still renders in development, or its shell does, for a page with a `fallback.tsx`. For the other ways development differs from the build, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const payloadTitle = message({
  ja: 'HTMLとペイロード',
  en: 'HTML and the payload',
});

export const payloadPath = message({
  ja: 'どちらのモードでも、ページにはHTMLとRSCペイロードの2つの形があります。ペイロードは、ページのパスに`/index.rsc`を付けたURLにあります。クライアント側の遷移では、このペイロードを取得します。',
  en: 'Under either mode a page has two forms: HTML and an RSC payload. The payload’s URL is the page’s path with `/index.rsc` appended. A client navigation fetches that payload.',
});

export const payloadEmbed = message({
  ja: '最初に開いたページでは、描画に使ったペイロードがHTMLに埋め込まれています。ハイドレーションはそれを読むので、同じページを2回取得しません。',
  en: 'The first page opened carries the payload it was rendered from inside its HTML. Hydration reads that, so the same page is never fetched twice.',
});

export const staticTitle = message({
  ja: 'staticモードでの拒否',
  en: 'Refusals under static mode',
});

export const staticNoRequest = message({
  ja: 'staticモードでも、`@k8ordo/framework`にはサーバー用の機能が含まれています。staticモードでそれを使うと、ビルドがエラーになります。',
  en: 'A static mode application still has the server features installed. Using one under static mode fails the build.',
});

export const staticWhen = message({
  ja: "`guard.ts`と`search`をexportするページ、`GET`以外をexportする`route.ts`は、ビルドを始める前にエラーになります。`@k8ordo/framework/server`のimportと`'use server'`は、各環境をコンパイルしたあとにエラーになります。どちらも、ページを1つも書き出す前にエラーになります。",
  en: "A `guard.ts`, a page that exports `search` and a `route.ts` that exports anything but `GET` fail before the build starts. An import of `@k8ordo/framework/server` or `'use server'` fails once the environments are compiled. Both stop the build before any page is written.",
});

export const staticWants = message({
  ja: '`vite dev`でも、これらを使うモジュールをコンパイルした時点で同じエラーになります。開発中だけ動いて本番で何もしないコードは残りません。拒まれるものの一覧と理由は',
  en: '`vite dev` reports the same error the moment it compiles the module, so no code works in development and does nothing in production. What is refused, and why, is listed on ',
});

export const serverTitle = message({
  ja: 'serverモードでの拒否',
  en: 'Refusals under server mode',
});

export const serverAnywhere = message({
  ja: '動いているサーバーは、どこからでもリクエストを受け取ります。ハンドラは、アプリが応答すべきでないリクエストを描画の前に拒みます。',
  en: 'A running server takes requests from anywhere. The handler turns away the ones the application should not answer before anything renders.',
});

export const serverList = [
  message({
    ja: '別のオリジンからの`POST`：ページとServer Actionへの`POST`は、`Origin`が無いか別のホストを指すと`403`になります。別のサイトのフォームから、訪問者のCookie付きでServer Actionを呼ばせないためです。',
    en: 'A `POST` from another origin: a `POST` to a page or a Server Action gets a `403` when it has no `Origin` header, or when that header names a host other than the request’s. This keeps another site’s form from calling a Server Action with the visitor’s cookies.',
  }),
  message({
    ja: '`GET`と`HEAD`と`POST`以外のメソッド：ページへのリクエストなら、その3つを`Allow`に並べた`405`になります。',
    en: 'A method other than `GET`, `HEAD` and `POST`: a request to a page gets a `405` whose `Allow` lists those three.',
  }),
  message({
    ja: 'Viteの`base`の外のURL：アプリのURLには含まれないので、`404`になります。',
    en: 'A URL outside Vite’s `base`: it is not one of the application’s, and gets a `404`.',
  }),
] as const;

export const bothTitle = message({
  ja: '共通のエラー',
  en: 'Errors in both modes',
});

export const bothIntro = message({
  ja: '次のものは、どちらのモードでもエラーになります。',
  en: 'These are errors under either mode.',
});

export const bothList = [
  message({
    ja: '`routes/`の決まりに合わないファイルやディレクトリと、どのURLにも答えないルート',
    en: 'A file or directory that breaks the `routes/` conventions, and a route that answers no URL',
  }),
  message({
    ja: '非同期に検証する`paramsSchema`（`a params schema must validate synchronously`）',
    en: 'A `paramsSchema` that validates asynchronously (`a params schema must validate synchronously`)',
  }),
  message({
    ja: 'Client Componentから読み込まれた`server-only`のモジュール',
    en: 'A `server-only` module imported from a Client Component',
  }),
  message({
    ja: 'ルートから始まらないViteの`base`（`./`など）',
    en: 'A Vite `base` that does not start from the root (`./`, for example)',
  }),
] as const;
