import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server の「仕組み」は、両モードで同じ内容を
// 載せる。2 つのモードの違いそのものを説明するページだから。

export const introduction = message({
  ja: '`@k8ordo/static`と`@k8ordo/server`がどう動いているかを説明します。使い方を覚えるのに必要な内容ではありませんが、ビルドがなぜそのファイルを断るのかが分かると、迷ったときに判断しやすくなります。',
  en: 'How `@k8ordo/static` and `@k8ordo/server` work underneath. None of it is needed to use them, but knowing why the build refuses something makes the edge cases easier to reason about.',
});

export const modeTitle = message({
  ja: 'モードは依存で決まる',
  en: 'The mode is the dependency',
});

export const modeDescription = message({
  ja: 'アプリをファイルに書き出すか、サーバーで動かすかは、設定の値ではなく、どちらのパッケージをインストールしたかで決まります。`@k8ordo/static`で作ったアプリからは、サーバーの仕組みにそもそも手が届きません。',
  en: 'Whether an application is written out as files or run on a server is not a setting: it is which package you installed. An application built with `@k8ordo/static` does not have the server’s machinery to reach for at all.',
});

export const modeWhy = message({
  ja: '1つのパッケージのオプションにしなかったのは、このためです。静的なアプリでリクエストを読まないことは、守るべき決まりではありません。読む先のリクエストが、そもそも無いからです。',
  en: 'That is why it is not an option on one package. Not reading the request in a static application is not a rule to keep: there is no request to read.',
});

export const modeSame = message({
  ja: 'それ以外は何も変わりません。ルートの書き方も、サーバーとブラウザの境界も、リクエストに答えるハンドラも同じです。プラグインの名前がどちらも`framework()`なのはそのためで、`vite.config.ts`はどちらのモードでも同じ形になります。',
  en: 'Nothing else changes: the route grammar, the boundary between server and browser, and the handler that answers a request are all the same. That is why both plugins are named `framework()`, and why `vite.config.ts` looks the same under either mode.',
});

export const handlerTitle = message({
  ja: '同じハンドラを、いつ呼ぶかだけが違う',
  en: 'One handler, called at different times',
});

export const handlerDescription = message({
  ja: 'どちらのモードでも、`vite build`は`dist/rsc/index.js`にリクエストハンドラを書き出します。`Request`を受け取って`Response`を返す、ただの関数です。2つのモードの違いは、このハンドラをいつ呼ぶかにあります。',
  en: 'Under either mode, `vite build` writes a request handler to `dist/rsc/index.js`: a plain function that takes a `Request` and returns a `Response`. What tells the two modes apart is when it is called.',
});

export const handlerStatic = message({
  ja: '`@k8ordo/static`は、ビルドの最後にページごとにハンドラを2回呼びます。HTMLの答えを`index.html`に、ペイロードの答えを`index.rsc`に書き、ファイルとして残します。',
  en: '`@k8ordo/static` calls the handler twice for each page at the end of the build, and keeps the answers as files: the HTML as `index.html`, the payload as `index.rsc`.',
});

export const handlerServer = message({
  ja: '`@k8ordo/server`は、リクエストが届くたびにハンドラを呼び、その答えをそのまま返します。',
  en: '`@k8ordo/server` calls it for every request that arrives, and sends back what it answers.',
});

export const handlerDev = message({
  ja: '`vite dev`は、どちらのモードでもリクエストのたびにハンドラを呼びます。そのため`@k8ordo/static`のアプリでは、開発中とビルドで振る舞いが違うところがあります。',
  en: '`vite dev` calls the handler per request under either mode, which is why a `@k8ordo/static` application behaves a little differently in development than in its build.',
});

export const payloadTitle = message({
  ja: 'ページはHTMLとペイロードの2つの形を持つ',
  en: 'A page has two forms: HTML and a payload',
});

export const payloadDescription = message({
  ja: 'どちらのモードでも、ページにはHTMLのほかに、RSCのペイロードという形があります。ペイロードはページのパスの後ろに`/index.rsc`を付けた場所にあり、クライアント側の遷移ではこれを取りに行きます。',
  en: 'Under either mode a page has a second form beside its HTML: an RSC payload. It lives at the page’s path with `/index.rsc` appended, and a client navigation fetches that.',
});

export const payloadPath = message({
  ja: 'ヘッダーやクエリではなくパスで分けているのは、静的ホスティングがそのどちらでも答えを変えないからです。パスなら、ファイルの集まりでも動いているサーバーでも、同じ決まりで答えられます。',
  en: 'It is told apart by its path rather than by a header or a query because a static host varies its answer on neither. A path works the same for a directory of files and for a running server.',
});

export const payloadEmbed = message({
  ja: '最初に開いたページでは、描画に使ったペイロードがHTMLに埋め込まれて届きます。hydrationはそれを読むので、同じページを2回取りに行くことはありません。',
  en: 'The first page opened arrives with the payload it was rendered from written into its HTML. Hydration reads that, so the page is never fetched twice.',
});

export const staticTitle = message({
  ja: '`@k8ordo/static`が断るもの',
  en: 'What `@k8ordo/static` refuses',
});

export const staticDescription = message({
  ja: 'ファイルを書き出すビルドには、リクエストがありません。そのため、リクエストを必要とするものはビルドが名指しで断ります。',
  en: 'A build that writes files has no request, so it refuses by name anything that needs one.',
});

export const staticList = [
  message({
    ja: "`'use server'`のモジュール：ファイルはフォームの送信を受け取れません。",
    en: "A `'use server'` module: a file cannot receive a form submission.",
  }),
  message({
    ja: '`guard.ts`：ファイルには、通すかどうかを決めるリクエストがありません。',
    en: 'A `guard.ts`: a file has no request to let through or to stop.',
  }),
  message({
    ja: '`GET`以外のメソッドをexportする`route.ts`：ファイルは`GET`にしか答えられません。',
    en: 'A `route.ts` exporting a method other than `GET`: a file answers nothing else.',
  }),
  message({
    ja: '`search`をexportするページ：ファイルの中身は、searchが何であっても同じです。',
    en: 'A page exporting `search`: a file reads the same whatever the search is.',
  }),
] as const;

export const staticDev = message({
  ja: '`vite dev`は動いているサーバーなので、本来ならこれらも受け付けられます。しかし、開発中は動くのに本番ではどこにも届かないフォームは、最初から動かないフォームよりも困ります。そこで`vite dev`も、そのファイルを読み込んだ時点で同じように断ります。',
  en: '`vite dev` is a running server and could accept all of these. But a form that works in development and posts into nothing in production is worse than one that never worked, so `vite dev` refuses them too, the moment the file is loaded.',
});

export const staticWants = message({
  ja: 'どの断り方も、`this application wants @k8ordo/server`という行で終わります。どれかが必要なら、`@k8ordo/server`に移ってください。ほかのコードはそのまま使えます。',
  en: 'Each refusal ends with the line `this application wants @k8ordo/server`. If you need any of these, move to `@k8ordo/server`; the rest of the code stays as it is.',
});

export const staticPaths = message({
  ja: 'パラメータを持つルートの値が分からないときも、ビルドは止まります。警告を出して飛ばすことはしません。ページが半分欠けたサイトを黙って公開するより、止まるほうが安全だからです。',
  en: 'The build also stops when it does not know the values of a route with parameters. It never warns and skips: a site quietly missing half its pages is worse than a build that stopped.',
});

export const serverTitle = message({
  ja: '`@k8ordo/server`が断るもの',
  en: 'What `@k8ordo/server` refuses',
});

export const serverDescription = message({
  ja: '動いているサーバーには、どこからでもリクエストが届きます。そのためハンドラは、アプリが答えるべきでないリクエストを、何も描かないうちに断ります。',
  en: 'A running server takes requests from anywhere, so the handler turns away the ones the application should not answer, before anything renders.',
});

export const serverList = [
  message({
    ja: '別のoriginからの`POST`：`route.ts`以外への`POST`で、`Origin`ヘッダーが無いか、そのホストが一致しないものには`403`で答えます。別のサイトのフォームに、訪問者のCookieを付けたままアクションを呼ばせないためです。',
    en: 'A `POST` from another origin: one to anything but a `route.ts` with no `Origin` header, or one naming another host, gets a `403`, so another site’s form cannot call your actions with your visitor’s cookies.',
  }),
  message({
    ja: '`GET`と`HEAD`、`POST`以外のメソッド：ページへのリクエストなら、その3つを`Allow`に並べた`405`で答えます。',
    en: 'A method other than `GET`, `HEAD` and `POST`: a page answers it with a `405` whose `Allow` names those three.',
  }),
  message({
    ja: 'Viteの`base`の外のURL：アプリのものではないので、`404`で答えます。',
    en: 'A URL outside Vite’s `base`: it is not the application’s, and gets a `404`.',
  }),
] as const;

export const bothTitle = message({
  ja: 'どちらのモードでも断るもの',
  en: 'What both modes refuse',
});

export const bothDescription = message({
  ja: 'フレームワークの規約は、覚えておく習慣ではなく、検査できる形にしてあります。URLがどこにあり、サーバーとブラウザの境界がどこにあるかを、読み手の記憶ではなくフレームワークが確かめるためです。次のものは、どちらのモードでもエラーになります。',
  en: 'The framework’s conventions are not habits to remember but shapes that can be checked, so that where the URLs live and where the server ends and the browser begins is verified by the framework rather than by anyone’s memory. These are errors under either mode:',
});

export const bothList = [
  message({
    ja: '`routes/`の決まりに合わないファイルやディレクトリと、決して描かれないルート',
    en: 'A file or directory that breaks the `routes/` grammar, and a route that can never render',
  }),
  message({
    ja: '非同期に検証する`paramsSchema`',
    en: 'A `paramsSchema` that validates asynchronously',
  }),
  message({
    ja: 'クライアントのバンドルに入りそうになった、`server-only`のモジュール',
    en: 'A `server-only` module on its way into the client bundle',
  }),
  message({
    ja: 'ルートから始まるパスではない、Viteの`base`',
    en: 'A Vite `base` that is not a path from the root',
  }),
] as const;

