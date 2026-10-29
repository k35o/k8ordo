import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/framework`がページの描画とリクエストへの応答をいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/framework` renders pages and answers requests, and what it does and does not guarantee.',
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
  ja: '`vite dev`は、どちらのモードでもリクエストのたびにハンドラを呼び、ファイルを書きません。開発中とビルドの違いは',
  en: '`vite dev` calls the handler for every request under either mode, and writes no files. For how development differs from the build, see ',
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
  ja: 'どちらのモードでも、ページにはHTMLとRSCペイロードの2つの形があります。ペイロードは、ページのパスに`/index.rsc`を付けたURLにあります。ヘッダーやクエリでなくパスに置くのは、静的ホスティングがそのどちらでも応答を変えないためです。',
  en: 'Under either mode a page has two forms: HTML and an RSC payload. The payload’s URL is the page’s path with `/index.rsc` appended. It sits at a path rather than behind a header or a query because a static host varies its answer on neither.',
});

export const payloadEmbed = message({
  ja: 'クライアント側の遷移では、このペイロードを取得します。最初に開いたページでは、描画に使ったペイロードがHTMLに埋め込まれています。ハイドレーションはそれを読むので、同じページを2回取得しません。',
  en: 'A client navigation fetches that payload. The first page opened carries the payload it was rendered from inside its HTML. Hydration reads that, so the same page is never fetched twice.',
});

export const payloadSplit = message({
  ja: '`page.tsx`・`not-found.tsx`・`route.ts`・`fallback.tsx`は、リクエストがそのファイルに届いたときに読みます。そのファイルが描くクライアントコンポーネントと、importしたCSS（Server ComponentのCSS Modulesも）は、そのファイルを描くページだけが読みます。`layout.tsx`・`error.tsx`・`loading.tsx`がimportしたものは、その下のどのページも読みます。',
  en: '`page.tsx`, `not-found.tsx`, `route.ts` and `fallback.tsx` are read when a request reaches them. The client components such a file renders and the CSS it imports, its Server Components’ CSS Modules included, go only to the pages that render it. What a `layout.tsx`, `error.tsx` or `loading.tsx` imports, every page below it loads.',
});

export const payloadReady = message({
  ja: '最初に開いたページは、描くクライアントコンポーネントを読み終えてからハイドレーションします。`404.html`のように描き直すページも同じで、サーバーのHTMLは1回で入れ替わります。遷移も、行き先のクライアントコンポーネントを読み終えてから画面を替えます。',
  en: 'The first page opened hydrates once the client components it renders have loaded. A page rendered afresh, as `404.html` is, waits the same way, and the server’s HTML is replaced in one go. A client navigation, too, changes the screen once the next page’s client components have loaded.',
});

export const staticTitle = message({
  ja: 'staticモードでの拒否',
  en: 'Refusals under static mode',
});

export const staticNoRequest = message({
  ja: 'staticモードでも、`@k8ordo/framework`にはサーバー用の機能が含まれています。ビルドで書くファイルにはリクエストが無いので、staticモードでそれを使うとビルドがエラーになります。',
  en: 'A static mode application still has the server features installed. A file the build writes has no request behind it, so using one under static mode fails the build.',
});

export const staticDev = message({
  ja: '`vite dev`はリクエストを受け取るサーバーで、`guard.ts`もServer Actionも動かせます。それでもビルドと同じエラーにするのは、開発中だけ動いて本番で何もしないコードを残さないためです。',
  en: '`vite dev` is a server that receives requests, and could run a `guard.ts` or a Server Action. It reports the same error as the build anyway, so that no code works in development and does nothing in production.',
});

export const staticList = message({
  ja: '拒まれるものの一覧と、エラーになる時点は',
  en: 'What is refused, and when the build reports it, is listed on ',
});

export const serverTitle = message({
  ja: 'serverモードでの拒否',
  en: 'Refusals under server mode',
});

export const serverAnywhere = message({
  ja: 'serverモードのサーバーは、どこからでもリクエストを受け取ります。ハンドラは、アプリが応答すべきでないリクエストを`guard.ts`より前に拒みます。拒んだリクエストでは、guardもServer Actionも実行されません。',
  en: 'Under server mode, the server takes requests from anywhere. The handler turns away the ones the application should not answer before any `guard.ts` runs, so neither a guard nor a Server Action runs for them.',
});

export const serverOrigin = message({
  ja: 'Server Actionは、`POST`を送れるなら別のサイトのフォームからも呼べます。`Origin`が別のホストを指す`POST`を拒むのは、訪問者のCookie付きでアクションを呼ばせないためです。',
  en: 'A Server Action can be called by anything that can send a `POST`, another site’s form included. A `POST` whose `Origin` names another host is turned away so that no such form calls an action with the visitor’s cookies.',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guaranteesList = [
  message({
    ja: "どちらのモードでも、同じハンドラが同じ`routes/`を描画します。`routes/`の書き方と`'use client'`の境界は、モードを切り替えても変わりません。",
    en: "Under either mode the same handler renders the same `routes/`. The `routes/` conventions and the `'use client'` boundary do not change with the mode.",
  }),
  message({
    ja: 'ペイロードが今のタブのスクリプトと合わないときは描画せず、そのURLを文書として読み込み直します。',
    en: 'A payload that does not match the script the tab is running is not rendered: the URL is loaded again as a document.',
  }),
  message({
    ja: "staticモードのビルドは、ページを1つも書き出す前に`guard.ts`と`'use server'`を拒みます。アプリ自身のモジュールにある`@k8ordo/framework/server`のimportも同じです。",
    en: "Under static mode, the build refuses a `guard.ts`, a `'use server'` module and an import of `@k8ordo/framework/server` in the application’s own modules before any page is written.",
  }),
  message({
    ja: 'staticモードでは、Server Componentがエラーになったページを書き出さず、そのURLを挙げてビルドを止めます。',
    en: 'Under static mode, a page whose Server Component throws is not written, and the build stops, naming its URL.',
  }),
  message({
    ja: 'serverモードでは、ページのURLへの`POST`のうち、`Origin`が無いものと別のホストを指すものは`403`になります。',
    en: 'Under server mode, a `POST` to a page’s URL gets a `403` when it has no `Origin` header, or when that header names another host.',
  }),
  message({
    ja: 'serverモードでは、ページへの`GET`と`HEAD`と`POST`以外のメソッドは、その3つを`Allow`に並べた`405`になります。Viteの`base`の外のURLは`404`になります。',
    en: 'Under server mode, a method other than `GET`, `HEAD` and `POST` gets a `405` whose `Allow` lists those three. A URL outside Vite’s `base` gets a `404`.',
  }),
  message({
    ja: '`src/routes/[locale]/layout.tsx`が`@k8ordo/i18n`の`paramsSchema`をexportし、`not-found.tsx`も`[locale]`の下にあれば、同じURLのページはサーバーでもブラウザでも同じロケールで描画されます。',
    en: 'With `@k8ordo/i18n`’s `paramsSchema` exported from `src/routes/[locale]/layout.tsx`, and `not-found.tsx` placed under `[locale]` too, a URL renders in the same locale on the server and in the browser.',
  }),
  message({
    ja: '描画に設定するロケールは、そのURLから`paramsSchema`が受け付けたものだけです。拒まれたパターンで受け付けたロケールも、同じビルドで先に描画したページのロケールも引き継ぎません。',
    en: 'The only locale a render is given is the one `paramsSchema` accepted from its URL. A locale accepted for a pattern that was then refused does not carry over, and neither does the locale of a page the same build rendered earlier.',
  }),
] as const;

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonGuaranteesList = [
  message({
    ja: 'staticモードでも、`vite dev`の結果はビルドと同じではありません。`fallback.tsx`の無いページは`paths`に無い値でも描画し、Server Componentのエラーには`500`を返します。',
    en: 'Under static mode too, `vite dev` does not give what the build gives. A page without a `fallback.tsx` renders for a value `paths` does not list, and a Server Component that throws gets a `500`.',
  }),
  message({
    ja: '`node_modules`の依存が`@k8ordo/framework/server`をimportしていても、staticモードのビルドはその名前を挙げません。依存が`cookies()`などを呼んだ時点でエラーになります。',
    en: 'A dependency in `node_modules` that imports `@k8ordo/framework/server` is not named by a static build. It fails once the dependency calls `cookies()` or the like.',
  }),
  message({
    ja: 'staticモードのビルドは、応答のステータスを書けません。`404.html`に404を付けるかはホスティングの設定で決まり、`redirect.ts`は行き先へ送るページになります。',
    en: 'A static build cannot write a status. Whether `404.html` is served with a 404 is the host’s setting, and a `redirect.ts` becomes a page that sends the visitor on.',
  }),
  message({
    ja: '`route.ts`への`POST`は、`Origin`を確かめません。必要な確認は`route.ts`の中で行います。',
    en: 'A `POST` to a `route.ts` has its `Origin` unchecked. Whatever it needs checked, the `route.ts` checks itself.',
  }),
  message({
    ja: 'ハンドラは、`X-Forwarded-Host`のような転送用のヘッダーを読みません。`Origin`と比べるのは、受け取った`Request`のURLのホストです。',
    en: 'The handler reads no forwarding header such as `X-Forwarded-Host`. It compares `Origin` with the host of the URL of the `Request` it is handed.',
  }),
  message({
    ja: 'staticモードの`404.html`は、`not-found.tsx`を`[locale]`の下に置いても既定のロケールで書かれます。JavaScriptが動かない訪問者には、URLのロケールに関係なくその文言が出ます。',
    en: 'Under static mode, `404.html` is written in the default locale even when `not-found.tsx` sits under `[locale]`. A visitor without JavaScript sees that text whatever locale the URL names.',
  }),
  message({
    ja: 'serverモードでは、propsの`Map`・`Set`・Promise・イテレーター・非同期イテラブル・`ReadableStream`に入れただけで描かないクライアントコンポーネントのCSSとJSは、そのプロセスで最初にそのモジュールを読んだ要求のHTMLにしか書かれません。',
    en: 'Under server mode, the CSS and JS of a client component that is only held in a prop’s `Map`, `Set`, promise, iterator, async iterable or `ReadableStream`, and never rendered, are written only into the HTML of the request that first loads its module in the process.',
  }),
] as const;
