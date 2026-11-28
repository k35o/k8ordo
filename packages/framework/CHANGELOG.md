# @k8ordo/framework

## 4.0.0

### Major Changes

- `framework()`の`routesDir`をなくし、ルートのファイルは常に`src/routes/`に置くようにしました。`src/i18n.ts`の場所も、`src/components/`と`src/lib/`の置き場の決まりも`src/`の下で決め打ちで、`routesDir`だけを動かすと`src/i18n.ts`との位置関係が崩れていました。

  あわせて、`framework()`はそのモードが受け取らないキーを、受け取るキーを挙げて断るようにしました。`mode: 'static'`なら`mode`、`reactCompiler`、`headers`、`site`、`csp`、`mode: 'server'`なら`mode`、`reactCompiler`、`headers`です。型の検査を通らない`vite.config.js`では、`sites`や`reactcompiler`と書き違えたキーが黙って無視されていました。これまで3.0.0で消した`paths`だけを名指しで断っていましたが、その専用のエラーもこの規則にまとめました。

  移行: `routesDir`を渡しているアプリは、ルートのファイルを`src/routes/`に移してから`routesDir`を消してください。エラーは`framework() takes no routesDir — under mode: 'static' it takes mode, reactCompiler, headers, site, csp`の形です。

- `paths.ts`が返す値と受け取る上のパラメータを、リンクの`href()`と同じ型にしました。`Paths<'/products/:id'>`は、ページの`paramsSchema`が`id`を数値に変えるなら数値の配列を返す型になり、スキーマが無ければ文字列、数値、bigint、真偽値のどれでも返せます。ビルドは値を`href()`と同じく`String()`で綴ってからURLのためにエスケープします。上のディレクトリのパラメータは、上のディレクトリのレイアウトが読んだ形で渡ります。上の`paths.ts`が返した値をこの綴りにしてから、その`paths.ts`のディレクトリより上にあるレイアウトの`paramsSchema`で外側から順に読み直したもので、型もそのスキーマの出力どおりです。どのスキーマも読まないパラメータは文字列です。隣り合うルートグループの2つの`paths.ts`が同じパターンで上のレイアウトが違うときは、どちらが受け取るものも受けられる型になります。隣のページのスキーマと、同じディレクトリのレイアウトのスキーマは、まだ値の無いそのディレクトリのパラメータを読むことがあるので使いません。`[locale]/layout.tsx`のスキーマがロケールを読むなら`locale`はそのロケールで、`[year]`のレイアウトが`z.coerce.number()`で読むなら、`[year]`にページが無く上の`paths.ts`が`'2024'`を返しても、`year`は数値の`2024`で届きます。そのスキーマが上の値を拒んだときは、その値の下の`paths.ts`を呼ばず、ビルドは`the paths.ts files stand where a params schema refuses the values above them, so they were not asked: …`で止まります。

  これまでは値を空でない文字列に限り、上のパラメータも文字列で渡していました。同じidをリンクでは`product.id`、`paths.ts`では`String(product.id)`と2通りに書くことになり、ロケールを取る関数に`locale`を渡すにはキャストが要りました。

  移行: 数値のスキーマを持つページの`paths.ts`で`String(product.id)`のように文字列にしている箇所は、`product.id`のまま返してください。文字列を返したままだと型エラーになります。上のパラメータを`Number(year)`のように読み直している箇所は、上のレイアウトのスキーマが読んだ値がそのまま届くので要りません。ページのスキーマでだけ読んでいるパラメータを読んだ形で受け取りたいときは、そのスキーマを上のディレクトリの`layout.tsx`に移します。値の検査は「空でない文字列、数値、bigint、真偽値」に変わり、エラー文は`… has to return an array of the values of :id, each a non-empty string, a number, a bigint or a boolean`です。

- `redirect.ts`のdefault exportの型`RedirectTarget`を、`@k8ordo/framework/server`から`@k8ordo/framework`に移しました。`redirect.ts`はstaticモードでも使うファイルなのに、その型がstaticモードの断る`/server`から出ていて、`import type`で書いたときだけ通り、`import { type RedirectTarget }`と書くとビルドが止まっていました。同じくどちらのモードでも使う`paths.ts`の型`Paths`はルートから出ているので、置き場をそろえました。`/server`からは消えます。

  移行: `import type { RedirectTarget } from '@k8ordo/framework/server'`を`import type { RedirectTarget } from '@k8ordo/framework'`に書き換えてください。

- serverモードで、ページとレイアウトが受け取る`request.cookies`を、同じリクエストの中で`guard.ts`とServer Actionが`cookies()`で書いた後の値にしました。これまでは届いた`Cookie`ヘッダーから作っていたので、Server Actionの答えとして描き直したページは、actionが書く前の値を描いていました。JavaScriptの無いフォームで設定を変えると、その答えのページは古い設定のまま届き、`<html data-density>`のような属性も古いままでした。

  これまでの「actionのあとに描き直したページの`request.cookies`には、actionが書いた値は入らない」という説明は撤回します。届いたままのヘッダーは、今までどおり`request.headers.get('cookie')`で読めます。

  移行: actionが書く前の値を`request.cookies`から読んでいたページは、`request.headers.get('cookie')`を読むか、actionの戻り値で前の値を渡してください。

- `mode: 'static'`では`site`を必須にしました。`site`はサイトを配信するoriginで、パスを含めません（`https://example.com`）。ビルドはページと`route.ts`をすべてこのoriginで頼むので、`route.ts`が受け取る`request.url`のoriginも、ビルドが書く`sitemap.xml`のURLもこの値になります。値はURLとして読むので、`https://Example.com`や`https://example.com:443`、`https://例え.jp`もそのoriginとして受け取ります。無いとき、またはhttp:かhttps:のURLでない値や、パス・クエリ・フラグメント・ユーザー名を含む値のときは、設定を読んだ時点で`mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — …`のエラーになり、何が違うかを挙げます。

  これまで`site`が無いビルドは、`http://k8ordo.localhost`というフレームワークの番兵のoriginでページを頼んでいました。RSSやOG画像のように`new URL(request.url).origin`から絶対URLを組む`route.ts`には、この番兵が黙って書き込まれていました。また、リクエストは`new URL(site).origin`、`sitemap.xml`は`site`の文字列のままを使っていたので、パスを含む`site`を渡すと2つが食い違っていました。

  移行: staticモードの`framework()`に`site`を足してください。`sitemap.xml`を`route.ts`で書いているアプリも、ビルドはそちらを使うので出力は変わりません。

- `navigateTo`をなくしました。コードからページを移るときは、`href`で作ったURLをNavigation APIの`navigation.navigate()`に渡します。リンクの`<a href>`と同じURLなので、ルーターも同じように扱い、`{ committed, finished }`も同じものが返ります。型の検査とViteの`base`は`href`がすでに受け持っていて、`navigateTo`はそれを`navigation.navigate()`に渡すだけでした。それなのに、paramとオプションがどちらも素のオブジェクトなので、パターンの文字列で見分ける分岐を抱え、すべてのparamを束ねたパターンでは`navigateTo('/:locale', undefined, { history: 'replace' })`と`undefined`の席を書かせていました。

  `bindParams`は、束ねた`href`そのものを返すようになりました。`NavigateToOptions`と`BoundLinks`の型もなくなり、`@k8ordo/framework`からの再exportも消えました。

  移行するには、次のように書き換えます。

  - `navigateTo('/products/:id', { id })`は`navigation.navigate(href('/products/:id', { id }))`にします。
  - `navigateTo('/products', { history: 'replace' })`は`navigation.navigate(href('/products'), { history: 'replace' })`にします。
  - `export const { href, navigateTo } = bindParams(…)`は`export const href = bindParams(…)`にします。

  `navigateTo`は既定で`push`でしたが、`navigation.navigate()`の既定の`'auto'`は、別のURLなら`push`、今と同じURLなら`replace`です。リンクのクリックと同じ振る舞いで、今のページを選び直しても同じエントリが2つ積まれることはありません。

  この変更は、2026-09-03に決めた「ページを変えるのは`navigateTo`、状態を変えるのは`update`」を「ページを変えるのは`navigation.navigate(href(…))`、状態を変えるのは`update()`」に置き換えます。

- `definePageState`の`href`の第1引数を、ルーターが作ったURLにしました。`@k8ordo/router`（`@k8ordo/framework`）の`href()`が返したURL、Next.jsの`Route`、今のページを指す`''`のどれかを渡します。`href`はそのURLのクエリのうち、この定義の`url`のパラメーターだけを既定値を省いた形で書き直し、ほかのパラメーターは綴りを変えずに残します。`hash`を持つ定義はフラグメントを`values.hash`の値にし（既定値なら外します）、持たない定義は渡したURLのフラグメントを残します。`base`は足しません。

  これまでは、表のパスを受け取ってViteの`base`を足す`href(path)`と、`?`の無いクエリだけを返す`search()`の2通りがありました。`[locale]`のアプリでは、ロケールやidを手で綴るか、`search()`の結果を自分でつなぐことになり、`hash`を持つ定義にはフラグメントを組む手段がありませんでした。ルーターの`href()`が返したURLを渡すと`base`が2重に付くので、渡すなと案内するしかありませんでした。いまは`listState.href(href('/:locale/products'), { page: 2 })`、`productState.href(href('/:locale/products/:id', { id }), { hash: 'reviews' })`の1通りです。パターンの型検査はルーターの`href()`が受け持つので、`Register`、`RegisteredPath`、`search()`をなくしました。`@k8ordo/framework`が生成する`.k8ordo/register.gen.ts`も、`@k8ordo/state`の`Register`を拡張しなくなりました。

  移行するには、次のように書き換えます。

  - `listState.href('/products', values)`は`listState.href(href('/products'), values)`にします。`href`は`@k8ordo/router`か`@k8ordo/framework`から読みます。Viteの`base`はルーターの`href()`が付けます。Next.jsでは`Route`のパスをそのまま渡せます。
  - `listState.search(values)`は`listState.href('', values)`にします。返り値は`?`付きの`'?page=2'`（既定値だけなら`''`）です。
  - `` `${deckState.href(path, values)}#${fragment}` ``のようにフラグメントを手でつないでいた箇所は、`hash`の値を`values`に入れて`deckState.href(href(…), { …values, hash })`にします。
  - `declare module '@k8ordo/state' { interface Register { … } }`と`RegisteredPath`の利用は消します。

### Minor Changes

- ブラウザで動くJavaScriptとCSSを、Baseline newly availableの機能にすべて対応したブラウザ向けにビルドするようにしました。版は`baseline-browser-mapping`から、browserslistの`baseline newly available`と同じ方法で求めます。

  これまではViteの既定（Chrome 111、Safari 16.4など）のままで、Lightning CSSが`light-dark()`と`:dir()`を書き換えていました。`light-dark()`はカスタムプロパティを宣言した場所で解決される形になり、`<html>`より下に付けた`.dark`の中が暗くなりませんでした。`@k8ordo/ui`の色のトークンも`light-dark()`で書いているので、同じことが起きていました。`:dir(rtl)`は`:lang()`のセレクタになり、`dir`に従いませんでした。

  `build.target`と`build.cssTarget`と`css.lightningcss.targets`は、アプリが書いていればその値を使います。サーバーで動く`rsc`と`ssr`のコードは、Viteの既定のままです。

- `guard.ts`と`route.ts`で`redirect()`と`notFound()`を使えるようにしました。`redirect(url)`はそのURLへの`303`で応答し、それまでにguardやroute.tsが書いたcookieとヘッダーも応答に付きます。`notFound()`は、いちばん近い`not-found.tsx`を404で返します。guardの下のページも、POSTで届いたServer Actionも実行されません。

  これまで`redirect()`を受けるのはServer Actionだけで、guardやroute.tsで呼ぶと500の`internal error`になっていました。そのため認証のguardでよく書くログインへのリダイレクトは、`new Response(null, { status: 303, headers: { location: href('/login') } })`と手で組む必要があり、actionとは別の書き方を覚えることになっていました。guardの`notFound()`も500でした。

  ページの描画中に`redirect()`を呼ぶと、`redirect() ends what answers the request, and a page is a render — …`のエラーを投げるようにしました。これまでは`redirect to …`という名前の無いエラーとして`error.tsx`に出ていました。

  guardのリダイレクトは`redirect(href('/login'))`と書き、`Response`は`401`や`403`のようにリダイレクトでない応答に使います。ステータスが`303`なのは、guardがPOSTで届いたServer Actionより先に動き、JavaScriptの無いフォームの送信をGETでログインのページへ移すためです。

- `routes/`に`[...name]`のディレクトリを置けるようにしました。`files/[...path]/`は`/files`より下の区間を1つ以上すべて受け取り、パターンは`/files/:path+`です。これまでは区間の数が決まらないURLを受けるルートを書けず、`not-found.tsx`で受けるしかありませんでした。値は区間ごとにデコードした配列で、`page.tsx`、`layout.tsx`、`route.ts`、`guard.ts`の`params`に渡ります。`paramsSchema`にも配列が渡るので、配列のスキーマで検証できます。`redirect.ts`の行き先に`:path+`と書くと、受け取った区間をURLの綴りのまま移します。同じ階層では固定の区間、`[name]`、`[...name]`の順に試し、`not-found.tsx`はその後です。`[...name]`は必ず最後のディレクトリで、下にディレクトリ（グループも）を置くと、また同じ階層に2つ並べると、ビルドが名指しして止まります。`not-found.tsx`、`fallback.tsx`、`paths.ts`も置けません。区間が無くても当たる`[[...name]]`の形はありません。使えるのはserverモードだけです。staticモードは、区間の数がリクエストごとに違って書き出すパスを決められないので、ビルドの最初と`vite dev`のコンパイル時に、`[...name]`のディレクトリを名指しして`this application wants mode: 'server'`で止めます。

- サーバーでも、`src/i18n.ts`をどのルートのファイルより先に読むようにしました。Server Componentを描くRSCの環境と、Client ComponentをHTMLにするSSRの環境の両方で、レイアウトやページが評価される前に`src/i18n.ts`が評価されます。ブラウザでは、これまでも何かを描く前に読んでいました。

  これまでサーバーでは、ルートのファイルがどこかで`src/i18n.ts`をimportしたときにしか、ロケールの集合が登録されませんでした。`[locale]`の外の`route.ts`のように、集合をimportしないモジュールだけで文言を呼ぶと、集合を知らないまま文言が読まれていました。いまは、集合を定義した`src/i18n.ts`があれば、どのモジュールから呼んでも集合が登録されています。

- `vercel()`に`maxDuration`と`regions`を足しました。serverモードで書き出す関数の設定（`.vc-config.json`）にそのまま入ります。これまで関数の設定は固定で、実行時間の上限はプランの既定、リージョンはプロジェクトの設定に任せるしかなく、`route.ts`から長い応答をストリームで返すアプリは上限を伸ばせませんでした。`maxDuration`は秒数か`'max'`（プランの上限）です。関数は1つなので、どのルートにも同じ値が効きます。staticモードには関数が無いので、渡すとビルドが止まります。

- 応答を返したあとも続く処理のために、`@k8ordo/framework/server` に `waitUntil(promise)` を足しました。渡した promise が決着するまで、ホストはプロセスや関数を止めません。Vercel の関数は応答が終わると止められるので、利用者が切断したあとも生成を最後まで読んで保存する、といった処理には、ホストに「まだ終わっていない」と伝える手段が要ります。

  - `waitUntil()` は guard.ts・route.ts・Server Action のほか、ページの描画の中や、route.ts が返したストリームの中からも呼べます。渡した promise が reject しても未処理の rejection にはならず、ハンドラが `k8ordo: waitUntil() of <メソッド> <パス> failed` の形で 1 度だけログに出します。`mode: 'static'` では `/server` のほかの値と同じく断ります。
  - ビルドされたハンドラ（`dist/rsc/index.js`）は、第 2 引数でホストの `waitUntil` を受け取ります（型は `/server` の `HandlerContext`）。ハンドラを自分で呼ぶランタイムは `handler(request, ctx)` のように渡せます。渡さなければ、ハンドラが promise を持つだけです。
  - `serve()` の `close()` は、サーバーを閉じたあと、`waitUntil()` に渡された promise がすべて決着するまで解決しません。`node dist/server.js` は SIGTERM で止める前に処理を終えます。
  - `vercel()` は、アプリが `waitUntil` を import しているとき、アプリが入れた `@vercel/functions` の `waitUntil` を関数に束ねてハンドラに渡します。`@vercel/functions` は optional な peer で、入っていなければ import しているファイルを挙げてビルドを止めます。`waitUntil` を使わないアプリの出力は変わりません。

### Patch Changes

- CSPのリファレンスに、アプリ自身の「最初の描画の前に動くスクリプト」の書き方を足しました。`@k8ordo/state`の`inlineRead()`で値を読むスクリプトは、ルートレイアウトに`<script>`で直接書くと、本文がすべてのページのペイロードに入ります。serverモードでnonceのポリシーを敷くと拒まれ、staticモードではハッシュが要ります。`@k8ordo/color-scheme`の`ColorSchemeScript`と同じく、nonceをpropsで受け取る小さな`'use client'`のコンポーネントにし、serverモードでは`nonce()`を渡し、staticモードでは同じ本文のハッシュを`csp`に書く形を示しました。

  `@k8ordo/state`のガイドの「Reading before hydration」からは、この項へ1文で案内します。

- 同梱のドキュメントの食い違いを直しました。GUIDEのオプションの節に、両モードで使える`headers`を足しました。llms.txtの冒頭は「`mode`を変えて`site`と`csp`を外すだけで、ほかは何も変わらない」と書いていましたが、GUIDEと同じく、serverモードへ移るときとstaticモードへ移るときに何を外し何を足すかを書きました。ビルドしたハンドラ（`dist/rsc/index.js`）の型も、第2引数の`HandlerContext`を含めて書きました。GUIDEには、リクエストに答えるものをビルドしたハンドラか`serve({ port: 0 })`でテストする方法を書いた「Testing」の節を足しました。

- クライアント側の遷移でペイロードを取りに来たリクエストでも、`guard.ts`が受け取る`request.url`をページのURLにしました。これまでは届いたままのペイロードのURL（`/en/account/index.rsc`）を渡していたので、`new URL(request.url).pathname`で判断するguardや、ログインのあとの戻り先を組むguardが、文書の要求とクライアント側の遷移とで別のURLを見ていました。`base`とクエリはそのまま残ります。

- `@k8ordo/framework`のガイドに「Preferences」の節を足し、訪問者の設定をどこに置くかを3つの規則にまとめました。見た目だけを変える設定は`defineLocalState`に置き、`inlineRead()`のインラインスクリプトで描く前に当てます。サーバーが値で応答を変える設定は、serverモードで`defineCookieState`に置き、`parseCookies`で読み、`cookie(patch, current)`か`update()`で書きます。言語の選択は素のCookieに置き、`negotiateRequest`の`chosen`に渡します。`@k8ordo/state`の例で密度をCookieに置いているのは、JavaScriptの無いフォームで変え、それを受けるServer ActionがCookieにしか書けないからだと、2つ目の規則に書きました。

  これまでは、`@k8ordo/color-scheme`のガイドが表示の設定をlocalStorageに置くよう勧め、`@k8ordo/state`のガイドとexampleは密度をCookieに置いていて、どちらを選ぶかの基準がありませんでした。`@k8ordo/state`、`@k8ordo/color-scheme`、`@k8ordo/i18n`のガイドからは、この節へ1文で案内します。docsサイトでは、frameworkの`request`のページに同じ節を足し、stateのCookieとcolor-schemeの保存先のページから案内します。

  `request`を読む例（`references/guards.md`）は、素の`theme`のCookieから`data-theme`を、`Accept-Language`から`<html lang>`を書いていて、この規則と`getLocale()`で`lang`を書く決まりの両方に反していました。Cookieの状態を`parseCookies(request.cookies)`で読んで`initialCookie`に渡し、ヘッダーは`Sec-GPC`を読む例に書き換えました。

- ルート表の生成が、読めなかったものを空として扱わないようにしました。`src/routes/`が無いと、これまでは空の表のまま生成とビルドが通り、すべてのURLが404になるだけでした。今は`the route files live in src/routes/, and … does not exist`のエラーで止まります。読めないルートファイルを「何もexportしないファイル」として扱って`paramsSchema`や`search`を黙って抜かすこと、JSONとして読めない`package.json`を「依存に何も無い」として扱って`@k8ordo/i18n`の`Register`の生成や、`search`をexportするページの`@k8ordo/state`への依存の確認を黙って省くこともやめ、どちらもエラーにします。

- staticモードで、`fallback.tsx`の殻がリテラルのディレクトリに隠れるときのエラーを直しました。`ja/posts/[id]/page.tsx`が`[locale]/posts/[id]/`（`fallback.tsx`あり、`[locale]/paths.ts`が`ja`を返す）より先に宣言されると、これまでは「`fallback.tsx`の無いページ」というエラーになり、本当の原因を言っていませんでした。今は殻が先に宣言されたパターン（`ja/posts/[id]/page.tsx`）の答えるURLにも答えてしまうことを名指します。

- Updated dependencies:
  - @k8ordo/router@4.0.0

## 3.0.0

### Major Changes

- staticモードで、パラメータの値を`framework()`の`paths`オプションではなく、パラメータのディレクトリに置く`paths.ts`から読むようにしました。`src/routes/blog/[slug]/paths.ts`は、`slug`の値を配列かそのPromiseで返す関数をdefault exportします（型は`@k8ordo/framework`の`Paths<'/blog/:slug'>`）。これまでは`vite.config.ts`の中で値を並べていたので、アプリのエイリアスや`server-only`のモジュールを素直に読めず、URLの情報の一部が`routes/`の外にありました。`paths.ts`はページと同じモジュールグラフで実行されるので、ページと同じデータの読み方をそのまま使えます。値はそのディレクトリより下のすべてに使われ、`/blog/:slug/og.png`のような`route.ts`や`redirect.ts`のパターンを手で展開する必要はありません。関数は上のディレクトリのパラメータを引数として受け取り、上の値の組み合わせごとに1回呼ばれます。値はエスケープする前の文字列で返します。`fallback.tsx`のシェルの場所も、上の`paths.ts`が返す値ごとに自動で決まります（`[locale]/paths.ts`が`ja`と`en`を返せば`/ja/posts/:id`と`/en/posts/:id`）。`fallback.tsx`と同じディレクトリに`paths.ts`を置くと、返した値はページとして書き出され、残りの値にシェルが答えます。`vite dev`は、どの`paths.ts`も返さなかった値にビルドしたサイトと同じく答えるようになりました。`fallback.tsx`があればシェルで、無ければ404です。これまでは、どの値も`page.tsx`で描画していました。`@k8ordo/i18n`の`locales.paths`は削除しました。移行するには、`vite.config.ts`から`paths`を消し（残っていると設定を読んだ時点でエラーになります）、パラメータのディレクトリごとに`paths.ts`を置きます。`paths: locales.paths`を渡していたアプリは、`src/routes/[locale]/paths.ts`で`locales.all`を返します。

### Minor Changes

- `framework()`に`headers`を足しました。書いたヘッダーは、ページ、ビルドのファイル、404、リダイレクトのどの応答にも付きます。これまで全応答のヘッダーは`vercel()`のルートにしか書けず、当てるのはVercelだけだったので、`vite dev`や`vite preview`ではアプリが自分でプラグインを書いて同じ値を付けていました。今は1度書けば、`vite dev`、`vite preview`、`serve`が送り、`vercel()`がどちらのモードでもルートとして書き、staticモードのビルドがNetlifyとCloudflareの読む`dist/client/_headers`に書きます（`public/_headers`はその後ろに残ります）。serverモードではハンドラも自分の応答に足し、`guard.ts`や`route.ts`が同じ名前で書いたヘッダーはそのまま残します。扱うのは全応答に付く1組だけで、一部のパスだけのヘッダーは今までどおり`vercel()`のルートや`public/_headers`に書きます。HTTPで送れない名前や値は、設定を読んだ時点で断ります。

- `.mdx`のファイルがimportしたCSSが、そのファイルを描くページのHTMLに載るようにしました。RSCのプラグインは、CSSをimportするモジュールがexportした部品を包んでページにスタイルシートを載せますが、包むのはファイル名が`.js`・`.jsx`・`.ts`・`.tsx`のモジュールだけです。アプリのプラグインがコンパイルした`.mdx`は名前で外れるので、これまではimportのすべてに`?vite-rsc-css-export=default`を付ける必要があり、付け忘れるとスタイルの無いページが黙って書き出されていました。今は、CSSを静的にimportする`.mdx`（と`.md`）にframeworkが同じ変換を当てます。クエリは要りません。付けたままでも、これまでどおり動きます。MDXのコンパイラは、今までどおりアプリが`enforce: 'pre'`でViteのプラグインに足します。docsのRoutingにMDXの節を足しました。

- staticモードで、アプリが`sitemap.xml`を`route.ts`で書いているときは、`site`を渡していてもビルドが`sitemap.xml`を書かないようにしました。これまでは両方があるとビルドが止まり、更新日や並びを自分で決めたいアプリは`site`を外すしかありませんでした。`site`を外すと、`route.ts`が受け取る`request.url`からもサイトの配信元が消えます。今は`routes/`の`route.ts`がそのURLの答えになり、`site`は渡したままにできます。`404.html`や`client-files.json`のように、ビルドが自分で書くほかのファイルに`route.ts`を置いたときは、これまでどおりビルドが止まります。

### Patch Changes

- docsに、エラーの報告のしかたとページビューの数え方を足しました。エラーは`error.tsx`が受け取る`error`から報告します。ルートの`error.tsx`はルートレイアウト自身の部品の失敗を受けないので、その扱いと、レイアウトの中に自分のエラー境界を置く方法を書きました。ページビューは、ページの切り替えが終わったことを知らせる`navigatesuccess`で数えます。`usePathname()`はURLに従い、次のページが届く前に変わるので、そこで数えると前のページの`<title>`を送ります。

- タッチの端末で画面に入ったリンクを先読みする仕組みが、先読みの終わる前のタップを前より遅くしていたのを直しました。先読みの部品（`<link rel="modulepreload">`と`<link rel="preload" as="style">`）は、ペイロードと同じ低い優先度で取ります。ページの切り替えを読み込んでいるあいだは新しく先読みせず、ほかのページへの先読みは取り消して、次のページが表示されてから取り直します。先読みを始めるのは、文書の`load`イベントのあと、`client-files.json`を読み終えてからで、画面に1秒とどまったリンクだけを取ります。

- `reactCompiler: true`で使う任意のpeerの`oxc-transform-react`の範囲を、`^0.152.0`から`>=0.152.0 <0.157.0`に広げました。フレームワークが使う`@vitejs/plugin-react`を6.2.1に上げ、そのpeerの範囲に合わせています。0.152系を入れているアプリはそのまま動き、0.156系まで上げられます。

- staticモードのビルドが書く`client-files.json`に、ページごとのServer ComponentのCSSも並べるようにしました。先読みしていないページへ移るとき、これまではペイロードの最初の部分が届いてからServer ComponentのCSSを取り始め、ページの切り替えがその1往復を待っていました。今はペイロードと同時に、ペイロードと同じ優先度で取り始めます。ページはこれまでどおり、そのCSSが届いてから切り替わります。

- staticモードのビルドが、ページを1回の描画で書き出すようにしました。これまではページごとにハンドラを2回呼び、`index.html`と`index.rsc`を別々の描画から書いていました。Reactの`cache()`は描画をまたがないので、ページが読むデータベースやファイルはビルドの中で2回読まれ、2回の描画で違う値を読めば、HTMLとペイロードが食い違うこともありえました。今は、HTMLを描いたペイロードをそのまま`index.rsc`に書きます。書き出されるファイルは変わりません。ページのデータの読み込みは、ビルドごとに1回になります。

- Updated dependencies:
  - @k8ordo/router@3.0.0

## 2.3.1

### Patch Changes

- `@k8ordo/*`のパッケージを、すべて同じバージョンで出すようにしました。これまで`@k8ordo/ui`だけは別にバージョンを上げていたので、ほかのパッケージは2.0.0から2.3.1へ飛びます。このリリースに中身の変更はありません。

## 2.0.0

### Minor Changes

- ルートレイアウトが`<head>`に書いたインラインスクリプトを、どのスタイルシートよりも前に出すようにしました。Reactは持ち上げたスタイルシートを`<head>`の中でレイアウトの子より前に書くので、`<head>`に書いたスクリプトもスタイルシートの後ろになり、その読み込みを待っていました。その間にブラウザが描くと、スクリプトが`<html>`に付けるはずのクラスが無い画面が出ます。いまは、最初の描画の前に動かしたいスクリプトを`<head>`に書けば、スタイルシートを待たずに動きます。

  - 移すのは`src`も`type`も無いスクリプトだけで、書いた順は変えません。`<noscript>`や`<template>`の中のものと、`<body>`のものは動かしません。
  - どちらのモードでも、`vite dev`でも同じです。staticモードの`csp`の`<meta>`は、移したスクリプトより前に残ります。

- staticモードのビルドで、タッチの画面でもサイトの中の遷移を速くしました。

  - 主なポインターが粗い端末（`(pointer: coarse)`）では、画面に入ったリンクのページを、入った順に1つずつ低い優先度で先読みします。タップでは押し始めとクリックがほぼ同時に来るので、これまでは先に取る時間がありませんでした。番が来る前に画面から出たリンクは飛ばします。
  - 取得したページを持ち続けます。先読みしたページ、遷移で取得したページ、最初に開いたページは、戻るや進むも含めてそのページへのどの遷移でも使い、ホストから取り直しません。持つのは最近使った50ページまでです。これまでは先読みしたページを30秒以内に1回だけ使い、戻るたびに取り直していました。届いている途中で離れたページも、最後まで受け取ります。
  - ビルドが`client-files.json`を書きます。ページごとに、Client Componentが読み込むスクリプトとスタイルシートを並べたものです。遷移と先読みは、ペイロードを頼むと同時にそのページのファイルを取り始めます。これまではペイロードの最初の塊が届いてから取り始めていました。
  - `client-files.json`を書く`route.ts`は、ビルドを止めます。

  serverモードと`vite dev`は、これまでどおりです。

### Patch Changes

- ブラウザの入口が、何かを描く前にアプリの`src/i18n.ts`を読むようにしました。どのclientコンポーネントもロケールの集合をimportしていないアプリでも、ブラウザの文言と`currentLocale()`が集合を知った状態で読まれます。`src/i18n.ts`の無いアプリでは何も読みません。

- staticモードで`csp`を渡したとき、`<meta http-equiv="Content-Security-Policy">`を`<head>`の先頭の`<meta charSet>`のすぐ後ろに書くようにしました。

  これまでは`<head>`の先頭に書いていたので、ハッシュの多いページでは`<meta charSet>`が文書の最初の1024バイトより後ろに押し出されていました。ブラウザは文字コードの宣言を最初の1024バイトの中でしか探しません。そのため`charset`を付けずに`text/html`を返すホストでは、ページがUTF-8として読まれず、ハッシュの合わなくなったインラインスクリプトが拒まれることがありました。

  `<head>`が`<meta charSet>`で始まらないページでは、これまでどおり`<head>`の先頭に書きます。ポリシーは、それより前にあるスクリプトや読み込みには効かないからです。

- 確かめようのない推測にもとづく検査をやめました。

  - staticモードのビルドは、`route.ts`のファイルとビルドが自分で書くファイルを、大文字と小文字を区別して比べます。
  - `vite dev`は、`route.ts`のファイルがビルドの書くファイルと重なることを前もって警告しません。止まるのはこれまでどおりビルドです。
  - `vercel()`は、`beforeFiles`と`beforeNotFound`の`has`のヘッダーの`key`が小文字かどうかを確かめません。

- `404.html`や`fallback.tsx`の殻のように、別のpathnameのために描いたHTMLで、hydrateを終える前に遷移すると、残りのSuspenseの境界がhydrateで食い違うのを直しました。Reactはその境界をクライアントで描き直し、回復できるエラーとして報告していました。遷移、Server Actionの答え、`vite dev`の読み直しは、HTMLのhydrateが終わるのを待ってから木を当てます。

- staticモードのビルドが、書き出したHTMLがClient ComponentのCSSとJSを`<head>`でlinkしているかを確かめる検査をやめました。linkはフレームワークがReactに書かせていて、その書き出しはフレームワーク自身のテストで保証しています。この検査が止めるのはk8ordoかReactの不具合だけで、アプリケーションの側で直せることはありませんでした。

- staticモードのビルドが、ページとシェルのペイロード（`index.rsc`）を描けなかったときにも止まるようにしました。これまではHTMLを描けたページのペイロードが`500`を返しても、ペイロードの無いままビルドが通っていました。

- `@k8ordo/framework/server`の入口を、ハンドラが読むモジュールと同じファイルにしました。これまでは入口が別にバンドルされていたので、サーバーモードのアプリのバンドルには`cookies()`などのリクエストのAPIと`redirect()`が2つずつ入っていました。今は1つずつです。

- `serve()`が返す`url`と起動時のログを、実際に待ち受けている番地で書くようにしました。既定の`host: 'localhost'`では、Nodeは`localhost`が指す番地のうち1つ（`::1`のことが多い）でだけ待ち受けます。それでも`url`は`http://localhost:3000`のままだったので、`localhost`を`127.0.0.1`に解決する側からはつながらないことがありました。今は`http://[::1]:3000`のように、つながる番地を返します。

- staticモードで、`public/_redirects`があるのに読めないときはビルドを止めるようにしました。これまでは読めなかった理由を問わず無いものとして扱い、アプリ自身の規則が抜けた`_redirects`を黙って書いていました。ファイルが無いときは、これまでどおり何もしません。

- staticモードで`vercel()`を使うビルドが、`_redirects`をCloudflareがどう読むかの警告（静的と動的のルールの上限、書けないURL、シェルを隠す`public/_redirects`のルール）を出さないようにしました。Vercelは`_redirects`を読みません。`_redirects`は`serve`と`vite preview`のためにこれまでどおり書きます。

  あわせて、Vercelに書き出すルートが`public/_redirects`に左右されなくなりました。ページでないURL（`redirect.ts`や`route.ts`のファイル）のペイロードをシェルのHTMLで答えるルートを、`public/_redirects`に同じ`from`があるときや、URLに`:`と英字が並ぶときにも書きます。

  Vercelの上で`vercel()`を使わずにシェルを書き出したときの警告はなくしました。

- 別のURLのために描いた文書も、HTMLの要素のままハイドレーションするようにしました。

  静的なビルドの`404.html`と`fallback.tsx`の殻は、訪問者のURLとは別のpathnameのために描かれます。これまでブラウザはそれらをハイドレーションせず、`createRoot`で描き直していたので、HTMLの要素はすべて別の要素に置き換わっていました。インラインスクリプトの中身や`src`も書き直すため、`require-trusted-types-for 'script'`を強制した文書では、その書き込みが拒まれていました。

  - ハイドレーションの間は、`usePathname()`と`@k8ordo/i18n`の文言が、文書を描いたときのpathnameを読みます。HTMLと食い違わないので、要素はそのまま残ります。
  - ハイドレーションを終えると、同じページを訪問者のURLで描き直します。Client Componentの文言は、これまでどおり訪問者のロケールになります。
  - `usePathname()`を読むeffectは、最初のコミットで描いたときのpathnameを受け取り、そのあと訪問者のURLを受け取ります。

- Updated dependencies:
  - @k8ordo/router@2.0.0

## 1.4.4

### Patch Changes

- staticモードで`site`を渡し、`sitemap.xml`を答える`route.ts`も置いたアプリで、ビルドが`route.ts`の書いた`sitemap.xml`をフレームワークのもので上書きしないようにしました。これまでは警告も出さずに上書きし、`vercel()`では中身がフレームワークのsitemap、型が`route.ts`の`GET`の返した`Content-Type`になっていました。いまはビルドを止め、その`route.ts`と`site`を名指して、どちらかを外すよう伝えます。

  - `not-found.tsx`があるときに`paths`で`/404.html`を渡した`route.ts`の`404.html`、シェルがあるときの`_redirects`の`route.ts`も、同じく黙って上書きされていました。ページやリダイレクトの`index.html`と同じ場所に書く`route.ts`は、どちらが残るかが決まっていませんでした。これらと、ページの`index.rsc`の場所に置いた`route.ts`もビルドを止めます。`paths`で値をもらう`route.ts`なら、`paths`からその値を外すよう伝えます。
  - 大文字と小文字だけが違う名前（`Sitemap.xml/route.ts`と`site`の`sitemap.xml`など）は、macOSとWindowsでは同じファイルになり、黙ってどちらかが消えていました。どのOSでも同じくビルドを止めます。
  - `vite dev`は止まりません。パラメータの無い`route.ts`なら、ビルドが止まることを警告します。

## 1.4.3

### Patch Changes

- 文書として開いたページで、ハイドレーションしたあとのクライアントコンポーネントの`useId`が、HTMLに書いたidと違う値を返さないようにしました。1.3.0から、static・serverのどちらのモードでも、`vite dev`でも、ブラウザのReactはHTMLと違うidを持っていました。ハイドレーションは属性をHTMLのまま残すので、ブラウザがidで結ぶ関係が切れていました。

  - `@k8ordo/ui`の`Tooltip`や`Popover`は、トリガーの`anchor-name`とコンテンツの`position-anchor`が合わず、Chromiumでは画面の左上に出ていました。WebKitではトリガーに重なって、クリックがトリガーに届かないことがありました。
  - ハイドレーションのあとに描いた要素の`aria-labelledby`や`aria-describedby`が、HTMLにある要素をidで指すときは、指す先の要素がありませんでした。
  - `404.html`と`fallback.tsx`の殻は、ハイドレーションせずに描き直すので当たりませんでした。

## 1.4.2

### Patch Changes

- ガイドのルートレイアウトの例に`<meta charSet="utf-8" />`を足しました。

  - `Content-Type`にcharsetを付けない静的ホストでは、ブラウザがUTF-8以外で読み、ASCII以外の文字が化けます。
  - `csp`オプションを指定したページでは、ペイロードのスクリプトがハッシュと合わなくなって拒否され、ハイドレーションされません。

## 1.4.1

## 1.4.0

## 1.3.0

### Minor Changes

- クライアントのビルドが、どのページも読むものを2つのファイルにまとめるようになりました。入口（React、ルーター、フレームワーク）と、すべての`layout.tsx`、`error.tsx`、`loading.tsx`のクライアントコンポーネントとフレームワークの境界、そしてそれらがimportするものです。これまでは、入口やレイアウトとページが分け合うモジュールが増えるたびに、どのページも読む小さなファイルが増えていました。ページどうしだけが分け合うものは、これまでどおり別のファイルで、それを描くページだけが読みます。

  - そのために、クライアントの環境の`build.rolldownOptions.output.codeSplitting`をフレームワークが決めます。アプリケーションがクライアントの環境に書いた`manualChunks`は効かなくなり、`codeSplitting: false`も上書きされます。アプリケーションの`codeSplitting`の`groups`は、`priority`を`2`より大きくしたときだけ、入口とレイアウトの分のモジュールを取れます。
  - `vite`のpeerを`>=8.1.0`に上げました。Rolldownの`codeSplitting`のタグ（`$initial`）を使うためです。

### Patch Changes

- `<head>`のCSSの順を、Server ComponentのCSSが先、クライアントコンポーネントのCSSが後に戻し、開き方によらずこの順にしました。1.2.1から、staticモードで文書として開いたページだけ、クライアントコンポーネントのCSSがServer ComponentのCSS（ルートの`layout.tsx`がimportするCSSも）より前に並んでいました。ページ遷移で移ったとき、serverモードでシェルのあとに流れる部分、`vite dev`ではもとから後ろに並ぶので、同じページでも開き方で同じ詳細度の規則の勝ち負けが入れ替わり、ルートのCSSで宣言したカスケードレイヤーの順が効かないことがありました。

  - Server ComponentのCSSの先頭は、ルートの`layout.tsx`のCSSです。そこで`@layer`の順を宣言すれば、どのファイルにも効きます。
  - staticモードで文書として開いたページで、同じ詳細度でクライアントコンポーネントの規則を上書きしていたServer ComponentのCSSは、遷移で移ったときと同じく負けるようになります。
  - 順を決めるため、`<head>`に中身の無い`<style>`を1つ書きます。staticモードで`csp`を渡したときは、ポリシーがその`<style>`を止めるときだけ、ハッシュ（`'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='`）を足します。足す先は`style-src-elem`か`style-src`で、`default-src`しか無ければ`style-src`を作ります。`'unsafe-inline'`で許しているポリシーには足しません。
  - serverモードでは、その`<style>`に応答のnonceを付けます。そのためにReactにスタイルのnonceを渡すので、`href`と`precedence`を持つ`<style>`は、同じnonceを付けたものだけがHTMLに書かれるようになります。Server Componentで描くものには`nonce={nonce()}`を渡してください。スタイルを制限するポリシーでは、`style-src`にもnonceを書きます。
  - 一度読んだCSSは外さないことと、リンクの先読みでも移る先のクライアントコンポーネントのCSSを読むことを、ドキュメントに書きました。

- staticモードで書き出すHTMLの`<head>`に、ペイロードが名指すクライアントコンポーネントのCSSとJSを、描くかどうかや、そのモジュールをどのページが先に読んだかによらず、すべて書くようにしました。1.2.1でpropsとして渡すだけで描かない要素の分も書くようにしましたが、propsの`Map`、`Set`、Promise、イテレーター、非同期イテラブル、`ReadableStream`に入れただけの要素の分は、ビルドでそのモジュールを最初に読んだページにしか書かれていませんでした。`not-found.tsx`がpropsで渡すPromiseが`404.html`を描き終えたあとで解けるときは、その中の要素の分が書かれませんでした。どちらも、HTMLがその要素のJSとCSSを先読みしていなかったため、ブラウザはエントリーのスクリプトがペイロードを読んでから、それらを取りに行っていました。

  - serverモードは変わりません。propsの`Map`などに入れただけで描かない要素のCSSとJSは、これまでどおり、そのプロセスで最初にそのモジュールを読んだ要求のHTMLにしか書かれません。
  - staticモードの`<head>`に並ぶクライアントコンポーネントのCSSとJSの順が、描く木の順から、RSCがペイロードに書いた順に変わります。データを待つServer Componentが兄弟に並ぶと、ビルドごとに入れ替わることがあります。ページ遷移で読んだときの順とはもともと合わないので、クライアントコンポーネントのCSS同士の順は保証しません。同じ要素に別のクライアントコンポーネントのCSSを重ねるときは、同じプロパティを書かないか、詳細度で勝つ側を決めるか、ルートの`layout.tsx`がimportするCSSの先頭でカスケードレイヤーの順を宣言してください。

- staticモードのビルドが、書き出すすべてのHTML（ページ、`404.html`、`fallback.tsx`の殻）について、ペイロードが名指すクライアントコンポーネントのCSSが`<head>`の`<link rel="stylesheet">`に、JSが`<link rel="modulepreload">`か`<script>`の`src`にあるかを確かめるようになりました。1つでも抜けていれば、すべてのファイルを書いたあとでビルドを止めます。エラー文は、抜けたHTMLとファイルとコンポーネントの数、報告先と版に続けて、抜けたファイルごとに、抜けたページの数と例、そのファイルが要るコンポーネントを挙げます。これまでは、抜けのあるHTMLをそのまま書き出していました。

  - 抜けは`@k8ordo/framework`か、HTMLを書いたReactの不具合で、アプリケーションの側では直せません。止まったら、エラー文を添えて https://github.com/k35o/k8ordo/issues に報告してください。上げた直後に止まるようになったなら、直るまでは、上げたもの（`@k8ordo/framework`、または`react`と`react-dom`）を前の版に戻します。
  - serverモードと`vite dev`では確かめません。クライアントコンポーネントが動的に読むもの（`React.lazy`）のCSSと、Server ComponentのCSSも確かめません。

- クライアントのランタイムが、画面に出した木ごとに、その木を当てたpathnameを`@k8ordo/state`に知らせるようにしました。次のページの読み込み中に画面に残るページのページの状態が、次のページのURLの値で描かれなくなります。Server Actionの答えと`vite dev`での読み込み直しで当てた木も、それぞれ送ったURLと読み込んだURLのpathnameを持ちます。

## 1.2.1

### Patch Changes

- SSRで描いたHTMLの`<head>`に、ペイロードが名指すクライアントコンポーネントのCSS（`<link rel="stylesheet">`）とJS（`<link rel="modulepreload">`）を書き漏らさないようにしました。staticモードではページのすべてを、serverモードではシェルを送るまでに届いたものを書きます。これまでは、そのプロセスで初めて読むクライアントコンポーネントや、propsとして渡すだけで描かないものの分が落ちることがありました。たとえば`not-found.tsx`が描くものや、Server Componentが`await import()`で読んだものです。そのため`404.html`などはJSが動くまでスタイルが当たらず、ハイドレーションも1往復遅れていました。

  - propsとして渡すだけで描かないクライアントコンポーネントのCSSも`<head>`のstylesheetになるので、最初の描画はそのCSSの読み込みも待ちます。
  - staticモードの`<head>`では、クライアントコンポーネントのCSSがServer ComponentのCSSより前に並ぶようになりました。serverモードでは、ページがデータを待つ部分のクライアントコンポーネントのCSSが後ろに並ぶことがあり、ページ遷移で初めて読むクライアントコンポーネントのCSSは`<head>`の末尾に足されます。そのため、Server ComponentのCSSから同じ詳細度のセレクターでクライアントコンポーネントの見た目を上書きしていると、モードや、そのページを最初に開いたか遷移で来たかによって当たる方が変わります。上書きは詳細度を上げるか、`@layer`で順序を明示して書いてください。
  - serverモードでシェルを送ったあとに流れるSuspense境界の中のクライアントコンポーネントには、これまでどおり、境界の前に`<link rel="preload">`と`<link rel="modulepreload">`を書きます。propsとして渡すだけのものにも書くようになりました。

## 1.2.0

### Minor Changes

- `k8ordo generate` コマンドを足しました。アプリのディレクトリで実行すると、Vite の設定を `vite build` と同じように読み、`.k8ordo/`（ルート表と `Register`）を `vite build` の開始時と同じ中身で書いて終わります。環境のビルドもページの描画もしないので、`paths` を呼ばず、ページが読むデータにも触れません。DB や secrets の無い CI のジョブでも、`tsc` の前に型を用意できます。

  ```yaml
  - run: pnpm exec k8ordo generate
  - run: pnpm exec tsc --noEmit
  ```

  - `routes/` に問題があると、ビルドと同じエラー（`routes/ is not a valid pathname space:` に続けて問題をすべて）を出して終了コード 1 で終わり、何も書きません。
  - `framework()` を使っていない Vite の設定では、生成するものが無いと言って終了コード 1 で終わります。

- ページごとに、そのページが描くクライアントコンポーネントとCSSだけを読むようにしました。`page.tsx`・`not-found.tsx`・`route.ts`・`fallback.tsx`は、リクエストがそのファイルに届いたときに読みます。これまでは生成するルート表がすべてを静的にimportしていたので、どのページもすべてのページのクライアントコンポーネントとCSS（Server ComponentのCSS Modulesも）を読んでいました。

  - 最初に開いたページは、描くクライアントコンポーネントを読み終えてからハイドレーションします。`404.html`と`fallback.tsx`の殻も読み終えてから描き直すので、本文と`<title>`は一度も消えません。クライアント側の遷移と先読みも、行き先のクライアントコンポーネントを読み終えてから画面を替えます。
  - `layout.tsx`・`error.tsx`・`loading.tsx`がimportしたものは、これまでどおりその下のどのページも読みます。
  - `page.tsx`・`not-found.tsx`・`route.ts`・`fallback.tsx`でimportしたCSSや、importしたときに動くコードは、そのファイルを描くページを開くまで読まれません。読まれたあとは、ブラウザではそのタブに、サーバーではそのプロセスに残り、ほかのページにも効くことがあります。ページの中だけに当てたいCSSはCSS Modulesにし、すべてのページに要るものはルートの`layout.tsx`でimportしてください。
  - ルートのファイルをほかのモジュール（レイアウトなど）から静的にimportすると、そのファイルはまたすべてのページが読みます。ビルドがそのファイルを警告で名指します。
  - ページのモジュールを評価するときに投げたエラーは、サーバーの起動時ではなく、そのページへの最初のリクエストで出ます。staticモードのビルドは、そのURLを名指し、エラーをスタックごと出して止まります。
  - Server Actionを呼んでから答えが画面に当たるまでのあいだにほかのページへ移ったときは、その答えを当てず、移った先のページを残します。呼び出し側には値を返します。
  - 生成する`.k8ordo/routes.gen.ts`の形が変わります。`PageProps`・`LayoutProps`・`href()`などの型は変わりません。

## 1.1.0

### Minor Changes

- `framework()` が `reactCompiler` を受け取るようになりました。`true` にすると、クライアントコンポーネントを React Compiler（Rust 版。`@vitejs/plugin-react` の `compiler`）で変換します。`mode: 'static'` と `mode: 'server'` のどちらでも、`vite dev` とビルドの両方で効きます。

  - アプリに `oxc-transform-react`（`^0.152.0`）を入れてください。`@k8ordo/framework` の任意の peer です。入っていないと、`vite dev` も `vite build` も設定を読んだ時点で、React のプラグインのエラー（`React Compiler requires the optional …`）で止まります。
  - Server Component と、クライアントコンポーネントをサーバーで描く HTML には掛かりません。
  - 既定は `false` で、これまでと変わりません。

- `mode: 'static'` の `vercel()` が、`route.ts` から書いたファイルを、その `GET` が返した `Content-Type` で配るようにしました。`.vercel/output/config.json` の `overrides` に、ファイルごとの型として書きます。

  - 拡張子の無いファイル（`blog/feed` など）にも型が付き、`vite dev` と同じ型になります。
  - 拡張子と同じ型でも書くので、Vercel が拡張子に付ける型には頼りません。型を返さなかった `GET`（型の無いバイト列の本文など）のファイルだけは、これまでどおり拡張子で決まります。
  - 文字列の本文の `Response` には、型を書かなくても `text/plain;charset=UTF-8` が付き、Vercel でもその型で配られます。`route.ts` では型を書いてください。
  - `vite preview` と `serve` は、これまでどおり拡張子で型を決めます。

- `vercel()` が `beforeFiles` と `beforeNotFound` を受け取るようになりました。`mode: 'static'` のビルドで、Vercel の Build Output API のルート（`src`・`dest`・`status`・`headers`・`continue`・`check`・`caseSensitive`・`has`）を、`.vercel/output/config.json` の2か所に渡したまま書きます。全ページのヘッダー、末尾のスラッシュのリダイレクト、`Accept` での出し分け、外のオリジンへの中継を、ビルドの出力に書けます。

  - `beforeFiles` はどのファイルよりも前に、`beforeNotFound` はシェルの書き換えの後、`404.html` の前に置きます。全パスに当たるルートを `beforeNotFound` に置いても、シェルを隠しません。
  - ルートを当てるのは Vercel だけです。`vite dev`・`vite preview`・`serve` には当てません。
  - Vercel は `src` をパスの全体に当てます。`^/posts/` は `/posts/first` に当たらないので、`^/posts/.+$` のように書いてください。
  - `mode: 'server'` で渡すと、ビルドを止めます。ファイルの無い URL にはハンドラが答えるためです。
  - `has` のヘッダーの `key` が小文字でないと、`vercel()` を呼んだ時点で止めます。Vercel は小文字で比べるので、そのままでは当たらないおそれがあるためです。ほかは検査しません。
  - 型 `VercelOptions` と `VercelRoute` を `@k8ordo/framework/vercel` から export します。
  - 引数なしの `vercel()` が書くものは変わりません。

### Patch Changes

- staticモードの`csp`に`report-to`があると、`framework()`を呼んだ時点でエラーにするようにしました。`report-to`が名指す送り先は`Reporting-Endpoints`レスポンスヘッダーでしか決まらないので、`<meta>`に書いたポリシーの違反のレポートは届いていませんでした。レポートを受け取るポリシーは、ホスティングのヘッダーで設定してください。ヘッダーのポリシーには、ビルドがページごとに足すハッシュが入りません。ヘッダーの`script-src`の書き方は`docs/references/csp.md`にあります。

- `vercel()`が書く`config.json`で、`assets/`の下のハッシュ付きのファイルに`Cache-Control: public, max-age=31536000, immutable`が付くようにしました。Vercelはrouteの`src`をパスの全体に当てるので、これまでの`assets/`で終わる`src`はどのファイルにも当たらず、`assets/`の下のファイルも`public, max-age=0, must-revalidate`で配られていました。staticモードとserverモードのどちらの出力も直ります。

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるものはない。

  この版で足した主なもの: `@k8ordo/i18n` の `Register` の生成。

### Minor Changes

- `@k8ordo/i18n` の `Register` を生成するようにしました。アプリの `package.json` が `@k8ordo/i18n` を `dependencies` か `devDependencies` に挙げていて（ルートから解決できることも見ます）、`src/i18n.ts` がロケールの集合を `locales` として export しているとき、`.k8ordo/register.gen.ts` に `declare module '@k8ordo/i18n' { interface Register { locale: LocaleOf<typeof locales> } }` を書きます。アプリはもう `Register` を手で書かなくてよく、ロケールが欠けた文言はこれまでどおり型エラーになります。

  - `locales` の export は、ルートのファイルと同じくファイルを実行せず構文から読みます。`export const locales = defineLocales(…)` と `export { locales } from './locales'` は数え、型だけの export と `export *` は数えません。
  - `src/i18n.ts` があるのに `locales` の export が読めないときは、何も生成せず警告を出します。黙っているとロケールの欠けた文言がそのままコンパイルできてしまうためです。
  - `@k8ordo/ui` の peer として hoist されただけの `@k8ordo/i18n` では生成しません。
  - `vite dev` では `routes/` に加えて `src/i18n.ts` の変更でも生成し直すので、ファイルの追加・削除や `locales` の export の有無がすぐ反映されます。
  - 手で書いた augmentation を残していても、同じ型の宣言なのでそのままコンパイルできます。消して構いません。
  - フレームワークの外（Next.js など）では、これまでどおりアプリが手で書きます。

### Patch Changes

- client コンポーネントが import した CSS が、SSR の HTML に `<link rel="stylesheet">` されないことがあるのを直しました。その JS の `<link rel="modulepreload">` も同じく出ないことがありました。ブラウザでの遷移を受け持つ部品は SSR でも描かれ、そのモジュールが読み込む `@vitejs/plugin-rsc/browser` が、client 参照の読み込み口をブラウザ用のものに差し替えていたためです。ブラウザ用の読み込み口はこの 2 つを出しません。どちらの読み込み口が残るかはバンドルの中の評価順で決まり、ブラウザ用が残ったアプリでは、CSS が当たるのは JS が読み込まれた後で、JS を切った訪問者には当たりませんでした。

- Updated dependencies:
  - @k8ordo/router@1.0.0
