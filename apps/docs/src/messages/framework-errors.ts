import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページの例外と、どのルートにも一致しないURL、移したURLを扱えるようになります。',
  en: 'Handle a page that throws, a URL nothing matches, and a URL that has moved.',
});

export const errorTitle = message({
  ja: '`error.tsx`',
  en: '`error.tsx`',
});

export const errorClientCallout = message({
  ja: '描画中の例外を捕捉できるのはブラウザだけ',
  en: 'Only the browser can catch an error thrown while rendering',
});

export const errorResetCallout = message({
  ja: '失敗した部分をその場で再描画する',
  en: 'Renders the failed part again in place',
});

export const errorPlace = message({
  ja: 'レイアウトやページの横に`error.tsx`を置くと、その下で例外が起きたときに代わりに描画されます。ヘッダーのようなレイアウトの部分は残ります。',
  en: 'An `error.tsx` beside a layout or a page renders in place of what is below it when that throws. Parts of the layout such as the header stay.',
});

export const errorProps = message({
  ja: '`error.tsx`はClient Componentにします。propsは、例外の値の`error`と、その部分を再描画する`reset`の2つです。`params`は受け取りません。',
  en: '`error.tsx` is a Client Component. Its props are `error`, the thrown value, and `reset`, which renders that part again. It receives no `params`.',
});

export const errorAway = message({
  ja: '別のページへ移ると、`error.tsx`の表示は`reset`を呼ばなくても消えます。',
  en: 'Navigating to another page clears what `error.tsx` shows, without calling `reset`.',
});

export const scopeTitle = message({
  ja: '捕捉の範囲',
  en: 'Scope',
});

export const scopeNearest = message({
  ja: '例外を捕捉するのは、起きた場所から見ていちばん近い上の`error.tsx`です。この構成では、`shop/page.tsx`と`shop/[id]/page.tsx`の例外を`shop/error.tsx`が捕捉します。',
  en: 'The nearest `error.tsx` above the throw catches it. In this layout, `shop/error.tsx` catches an error in `shop/page.tsx` or `shop/[id]/page.tsx`.',
});

export const scopeLayout = message({
  ja: '`error.tsx`は同じディレクトリの`layout.tsx`の内側に置かれます。そのため`shop/layout.tsx`自身の例外は、ルートの`error.tsx`が捕捉します。',
  en: 'An `error.tsx` sits inside the `layout.tsx` of its own directory, so an error in `shop/layout.tsx` itself is caught by the root `error.tsx`.',
});

export const scopeNone = message({
  ja: '捕捉する`error.tsx`が無いときは、クライアント側の遷移で描画に失敗したページを、ブラウザが同じURLの文書として読み込み直します。staticモードではホストにあるそのページのファイルが、serverモードでは`serve()`の応答が返ります。',
  en: 'With no `error.tsx` to catch it, the browser loads a page that failed after a client navigation again, as a document at the same URL. Under static mode that load gets the page’s file from the host, and under server mode `serve()` answers it.',
});

export const demoTitle = message({
  ja: '例外のデモ',
  en: 'Error demo',
});

export const demoDescription = message({
  ja: 'このサイトの`src/routes/[locale]/error.tsx`が、描画中に例外を起こすClient Componentを捕捉します。',
  en: 'This site’s own `src/routes/[locale]/error.tsx` catches a Client Component that throws while rendering.',
});

export const demoButton = message({
  ja: '描画中にエラーを起こす',
  en: 'Throw while rendering',
});

export const demoSteps = [
  message({
    ja: '「描画中にエラーを起こす」を押すと、このページの本文が「問題が発生しました」に置き換わります。ヘッダーとサイドバーは残ります。',
    en: 'Press “Throw while rendering”. This page’s content is replaced by “Something went wrong”, while the header and the sidebar stay.',
  }),
  message({
    ja: '「再読み込み」を押すと`reset`が呼ばれ、このページがその場で再描画されます。',
    en: 'Press “Retry”. `reset` is called, and this page renders again in place.',
  }),
] as const;

export const buildTitle = message({
  ja: 'staticモードのビルド',
  en: 'Static builds',
});

export const buildServer = message({
  ja: 'staticモードでは、ビルド中にServer Componentで例外が起きたページはファイルに書かれません。エラーのメッセージがページのURLと一緒にログに出ます。ビルドは失敗したページをすべて挙げた`static build could not render /broken — see the error above`で終わります。上に`error.tsx`があっても同じです。',
  en: 'Under static mode, a page whose Server Component throws during the build is not written. The error is logged beside the page’s URL, and the build ends with `static build could not render /broken — see the error above`, naming every page that failed. An `error.tsx` above it changes nothing.',
});

export const buildClient = message({
  ja: 'Client Componentは扱いが違います。上にSuspenseの境界があれば、その部分を空けたままファイルが書き出されます。ブラウザで描画したときに例外が起き、`error.tsx`が表示されます。`error.tsx`もSuspenseの境界の1つです。上に境界が無ければ、Server Componentと同じくビルドできません。',
  en: 'A Client Component is different. With a Suspense boundary above it, the file is written with that part left empty. The error happens when the browser renders it, and `error.tsx` shows. An `error.tsx` is itself a Suspense boundary. With no boundary above it, the build stops as it does for a Server Component.',
});

export const renderTitle = message({
  ja: 'serverモードの描画',
  en: 'Server rendering',
});

export const renderBoundary = message({
  ja: 'serverモードでは、サーバーでの描画の例外を`error.tsx`で捕捉できません。Suspenseの境界の中で例外が起きた部分は、描画をブラウザに任せます。HTMLはレイアウトを含み、ページの部分を空けたまま送られます。',
  en: 'Under server mode, a server render cannot catch an error with `error.tsx`. A part that throws inside a Suspense boundary is left for the browser to render. The HTML is sent with the layouts and without the page.',
});

export const renderBrowser = message({
  ja: 'ブラウザで同じコンポーネントがもう一度例外になり、ハイドレーションの後に`error.tsx`が表示されます。応答のステータスは`200`のままです。本番では、ブラウザに渡るエラーのメッセージはReactの汎用の文言に置き換わります。元のメッセージは、サーバーのログに`k8ordo: rendering /broken failed`として出ます。',
  en: 'The same component throws again in the browser, and `error.tsx` shows after hydration. The status stays `200`. In production the error the browser receives carries React’s generic message. The original goes to the server’s log as `k8ordo: rendering /broken failed`.',
});

export const renderNoBoundary = message({
  ja: '上にSuspenseの境界が1つも無い場所で例外が起きると、HTMLを作れません。`serve()`はそのリクエストに`500`で答えます。',
  en: 'An error with no Suspense boundary above it leaves no HTML to send, and `serve()` answers that request with a `500`.',
});

export const notFoundTitle = message({
  ja: '`not-found.tsx`',
  en: '`not-found.tsx`',
});

export const notFoundAnswers = message({
  ja: '`not-found.tsx`は、そのディレクトリより下でどのルートにも一致しなかったURLに応答します。ルート表ではそのディレクトリの最後に置かれ、宣言したルートが先に試されます。`params`と`pathname`を受け取り、自分の`<title>`を描画します。`params`は文字列のままです。',
  en: 'A `not-found.tsx` answers any URL below its directory that no route matched. It comes last for its directory in the route table, so every declared route is tried first. It receives `params` and `pathname` and renders its own `<title>`. Its `params` stay strings.',
});

export const notFoundStatic = message({
  ja: 'staticモードでは、`not-found.tsx`は`404.html`という1つのファイルに書き出されます。静的ホスティングは、存在しないURLすべてに1つのファイルを返します。そのため置ける`not-found.tsx`は1つだけです。ロケールの区間の下に置いても構いません。2つ以上置くと、`a static host answers every unknown URL from one file`で始まるエラーになり、ビルドできません。1つも置かなければ`404.html`は書かれず、存在しないURLに何を返すかは静的ホスティング次第です。`404.html`がブラウザでどう描画されるかは',
  en: 'Under static mode, `not-found.tsx` is written as one file, `404.html`. A static host returns one file for every URL that does not exist, so there can be only one `not-found.tsx`. Under a locale segment is fine. Two or more stop the build with an error that begins `a static host answers every unknown URL from one file`. With none, no `404.html` is written, and the static host decides what a URL that does not exist gets. How `404.html` renders in the browser is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const notFoundServer = message({
  ja: 'serverモードでは、`not-found.tsx`は404のステータスで答えます。ディレクトリごとに置けるので、`docs/not-found.tsx`は`/docs`の下の存在しないURLに、`docs/layout.tsx`の内側で答えます。1つも置かなければ、`404`という見出しと1行の説明だけの最小のページが、ルートレイアウトの内側に404で描画されます。`<html lang>`とスタイルシートも残ります。',
  en: 'Under server mode, a `not-found.tsx` answers under a 404 status. Each directory may have its own, so `docs/not-found.tsx` answers a URL under `/docs` that does not exist, inside `docs/layout.tsx`. With none at all, a minimal page of the framework’s own, a `404` heading and one line, renders inside the root layout under a 404. The `<html lang>` and the stylesheets stay.',
});

export const pageNotFoundTitle = message({
  ja: '`notFound()`',
  en: '`notFound()`',
});

export const pageNotFoundCallout = message({
  ja: 'ここで例外になり、次の行は実行されない',
  en: 'Throws here, so the next line never runs',
});

export const pageNotFoundSchema = message({
  ja: 'スキーマが決めるのはパラメータの形までです。そのデータがあるかどうかはページだけが知っているので、無いときは`notFound()`を呼びます。ページの代わりに、いちばん近い上の`not-found.tsx`が404として描画されます。描画される場所は、それより上のレイアウトの内側です。',
  en: 'A schema decides only the shape of a parameter. Only the page knows whether the data exists, so when it does not, the page calls `notFound()`. In place of the page, the nearest `not-found.tsx` above renders under a 404, inside the layouts above it.',
});

export const pageNotFoundStatic = message({
  ja: 'staticモードでは、ページのどこで`notFound()`を呼んでも404になります。ただし`paths`で渡したURLのページが`notFound()`を呼ぶと、そのURLを挙げたエラーになり、ビルドできません。サイトにあるはずのURLに、404のページを書くことになるからです。',
  en: 'Under static mode, `notFound()` gives a 404 from anywhere in the page. A URL passed through `paths` whose page calls it stops the build, naming the URL: it would write a 404 page at a URL the site claims to have.',
});

export const pageNotFoundShell = message({
  ja: '`fallback.tsx`のシェルの中でブラウザが`notFound()`を呼んだときは、404になりません。いちばん近い`not-found.tsx`がその場に描かれ、ステータスは`200`のままです。詳しくは',
  en: 'In a `fallback.tsx` shell, a `notFound()` called in the browser gives no 404: the nearest `not-found.tsx` renders in place, and the status stays `200`. More on this in ',
});

export const pageNotFoundServer = message({
  ja: 'serverモードでは、ページ自身のコンポーネントが返るまで文書を送りません。ステータスは本文より先に送るため、`notFound()`が呼ばれるかを待ちます。クライアント側の遷移では、ページが返るのを待たずにストリーミングを始めます。そのページが`notFound()`を呼ぶと、ブラウザが同じURLを文書として読み込み直し、サーバーが`404`を返します。',
  en: 'Under server mode, a document is not sent until the page’s own component has returned: the status goes out before the body, so it waits for a possible `notFound()`. A client navigation streams from the start without waiting for the page. When the page calls `notFound()` there, the browser loads the same URL again as a document, and the server answers it with the `404`.',
});

export const pageNotFoundDeep = message({
  ja: 'serverモードで、ページが返って応答が始まった後に`<Suspense>`の下から`notFound()`を呼んでも、404にはなりません。ほかの例外と同じく、いちばん近い`error.tsx`が捕捉します。',
  en: 'Under server mode, once the page has returned and the response has started, calling `notFound()` from under a `<Suspense>` no longer gives a 404. The nearest `error.tsx` catches it like any other error.',
});

export const redirectTitle = message({
  ja: '`redirect.ts`',
  en: '`redirect.ts`',
});

export const redirectFile = message({
  ja: 'URLを移したときは、古いディレクトリに`page.tsx`の代わりに`redirect.ts`を置きます。default exportは、行き先の文字列か`{ to, permanent }`です。同じディレクトリに`page.tsx`と`redirect.ts`を両方置くと、`"old" cannot both render page.tsx and redirect — keep one`というエラーになり、ビルドできません。',
  en: 'When a URL moves, its old directory holds a `redirect.ts` instead of a `page.tsx`. The default export is the target: a string, or `{ to, permanent }`. A directory holding both `page.tsx` and `redirect.ts` stops the build with `"old" cannot both render page.tsx and redirect — keep one`.',
});

export const redirectPatternCallout = message({
  ja: '行き先はルートのパターン。`:locale`は一致したURLの値で埋まる',
  en: 'The target is a route pattern, and `:locale` is filled from the matched URL',
});

export const redirectStatic = message({
  ja: 'staticモードでは、リダイレクトは訪問者を行き先へ送るページとして書き出されます。中身は`<meta http-equiv="refresh">`とリンクを持つHTMLで、`permanent`を付けても変わりません。隣に`index.rsc`は書かれません。クライアント側の遷移では、ブラウザがそのページを読み込んでから行き先へ移ります。',
  en: 'Under static mode, a redirect is written as a page that sends the visitor on: HTML with a `<meta http-equiv="refresh">` and a link, the same whether or not it is `permanent`. No `index.rsc` is written beside it. On a client navigation, the browser loads that page and then moves on to the target.',
});

export const redirectServer = message({
  ja: 'serverモードでは、`GET`と`HEAD`に`307`を返し、`permanent`なら`308`を返します。ほかのメソッドには`405`を返します。クライアント側の遷移の行き先がリダイレクトなら、ブラウザが文書として読み込み直して行き先へ移ります。Server Actionの最後に訪問者を別のページへ送るには、`redirect()`を使います。使い方は',
  en: 'Under server mode, a `GET` or `HEAD` gets a `307`, or a `308` when `permanent`, and any other method a `405`. A client navigation that meets a redirect has the browser load it as a document and follow it. To send the visitor elsewhere at the end of a Server Action, use `redirect()`, covered in ',
});

export const redirectType = message({
  ja: "default exportの型は、`@k8ordo/framework/server`の`RedirectTarget`です。`export default '/products' satisfies RedirectTarget`と書くと、その場で形を検査できます。`import type`で読み込めば、`@k8ordo/framework/server`を使えないstaticモードでもビルドは通ります。",
  en: "The default export’s type is `RedirectTarget` from `@k8ordo/framework/server`. Write `export default '/products' satisfies RedirectTarget` to check the shape where it is written. Static mode refuses `@k8ordo/framework/server`, but an `import type` of it passes a static build.",
});
