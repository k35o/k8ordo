# @k8ordo/state

## 4.0.0

### Major Changes

- `defineCookieState`の`cookieValue`をなくし、サーバーから同じCookieを書く`cookie(patch, current)`にしました。返り値は名前と値と属性の組で、`@k8ordo/framework`では`cookies().set(...density.cookie({ density: 'compact' }, cookies()))`と展開して書きます。`patch`は、`current`から`parseCookies`と同じ読み方で読んだ今の値に重ねてからスキーマに通すので、渡さなかったフィールドは訪問者が保存した値のままです。ブラウザの`update()`と同じ書き込みです。属性は、ブラウザのストアと同じ定数から作った`{ path: '/', sameSite: 'lax', maxAge: 34_560_000, httpOnly: false }`です。`migrate`が読めなかったCookieは上書きせず、`migrate`のエラーを`cause`にしたエラーになります。

  これまでの`cookieValue(values)`は、渡さなかったフィールドを既定値で埋めていました。フィールドが2つ以上ある定義では、1つだけを変えるServer Actionが、ほかのフィールドに保存された値を黙って既定値に戻していました。属性は返さなかったので、`{ httpOnly: false, maxAge: 34_560_000 }`を手で写す必要もありました。frameworkの`cookies().set`は既定で`HttpOnly`を付けるので、写し忘れるとブラウザのストアからCookieが見えなくなり、型でも実行時にも何も起きませんでした。

  移行するには、次のように書き換えます。

  - `cookies().set(density.cookieName, density.cookieValue(values), { httpOnly: false, maxAge: 34_560_000 })`は、`cookies().set(...density.cookie(values, cookies()))`にします。
  - Next.jsでは、`const store = await cookies()`のあとで`store.set(...density.cookie(values, { get: (name) => store.get(name)?.value }))`と書きます。
  - すべてのフィールドを既定値に戻すために`cookieValue()`や`cookieValue({})`を書いていた箇所は、`cookies().delete(density.cookieName)`でCookieを消します。
  - テストで値だけが要る箇所は、`density.cookie(values, new Map())[1]`にします。空の`Map`は何も保存していない訪問者です。

- `definePageState`の`href`の第1引数を、ルーターが作ったURLにしました。`@k8ordo/router`（`@k8ordo/framework`）の`href()`が返したURL、Next.jsの`Route`、今のページを指す`''`のどれかを渡します。`href`はそのURLのクエリのうち、この定義の`url`のパラメーターだけを既定値を省いた形で書き直し、ほかのパラメーターは綴りを変えずに残します。`hash`を持つ定義はフラグメントを`values.hash`の値にし（既定値なら外します）、持たない定義は渡したURLのフラグメントを残します。`base`は足しません。

  これまでは、表のパスを受け取ってViteの`base`を足す`href(path)`と、`?`の無いクエリだけを返す`search()`の2通りがありました。`[locale]`のアプリでは、ロケールやidを手で綴るか、`search()`の結果を自分でつなぐことになり、`hash`を持つ定義にはフラグメントを組む手段がありませんでした。ルーターの`href()`が返したURLを渡すと`base`が2重に付くので、渡すなと案内するしかありませんでした。いまは`listState.href(href('/:locale/products'), { page: 2 })`、`productState.href(href('/:locale/products/:id', { id }), { hash: 'reviews' })`の1通りです。パターンの型検査はルーターの`href()`が受け持つので、`Register`、`RegisteredPath`、`search()`をなくしました。`@k8ordo/framework`が生成する`.k8ordo/register.gen.ts`も、`@k8ordo/state`の`Register`を拡張しなくなりました。

  移行するには、次のように書き換えます。

  - `listState.href('/products', values)`は`listState.href(href('/products'), values)`にします。`href`は`@k8ordo/router`か`@k8ordo/framework`から読みます。Viteの`base`はルーターの`href()`が付けます。Next.jsでは`Route`のパスをそのまま渡せます。
  - `listState.search(values)`は`listState.href('', values)`にします。返り値は`?`付きの`'?page=2'`（既定値だけなら`''`）です。
  - `` `${deckState.href(path, values)}#${fragment}` ``のようにフラグメントを手でつないでいた箇所は、`hash`の値を`values`に入れて`deckState.href(href(…), { …values, hash })`にします。
  - `declare module '@k8ordo/state' { interface Register { … } }`と`RegisteredPath`の利用は消します。

- `resetStateRegistry`を、本体の`@k8ordo/state`からテスト用の入り口`@k8ordo/state/testing`に移しました。テストでしか使わない関数が、アプリがimportする本体から出ていて、同じテスト用の`mountPageUrl`とは別の入り口に分かれていました。`mountPageUrl`の後始末も`resetStateRegistry`を呼ぶので、2つを同じ入り口にそろえました。

  移行するには、`import { resetStateRegistry } from '@k8ordo/state'`を`import { resetStateRegistry } from '@k8ordo/state/testing'`に書き換えます。Storybookの`preview`で呼んでいる場合も同じです。

### Minor Changes

- `defineCookieState`の`parseCookies`が、`ReadonlyMap`に限らず、Cookieの名前からパーセントデコードした値を返す`get`を持つものを受け取るようにしました。`@k8ordo/framework`のserverモードでは、ページの`request.cookies`に加えて、`guard.ts`と`route.ts`とServer Actionの`cookies()`をそのまま渡せます。Next.jsの`cookies()`は`get`が`{ name, value }`を返すので、`parseCookies({ get: (name) => store.get(name)?.value })`と書きます。

  これまでは`ReadonlyMap`しか受け取らず、guardやServer Actionで同じCookieの状態を読むには、`cookies()`から`Map`を自分で作る必要がありました。

### Patch Changes

- ガイドとREADMEの例で、`formFields`を呼ぶ場所を、ページのServer Componentの描画の中の1通りにしました。これまでの最初の例はモジュールのトップレベルで呼び、「1回だけ導く」と書いていました。文言は`formFields`を呼んだときに決まるので、トップレベルで呼ぶと、どのリクエストにも最初に読み込んだときのロケールの文言が出ます。二言語のアプリでは間違った言語のまま、エラーにもなりませんでした。

  `@k8ordo/state`のガイドのGETフォームの例と、`@k8ordo/i18n`のガイドの`@k8ordo/form`の項も同じ書き方にそろえました。モジュールのトップレベルで呼んでいるアプリは、ページの描画の中で`fields={formFields(schema)}`のように呼んでください。

- CSPのリファレンスに、アプリ自身の「最初の描画の前に動くスクリプト」の書き方を足しました。`@k8ordo/state`の`inlineRead()`で値を読むスクリプトは、ルートレイアウトに`<script>`で直接書くと、本文がすべてのページのペイロードに入ります。serverモードでnonceのポリシーを敷くと拒まれ、staticモードではハッシュが要ります。`@k8ordo/color-scheme`の`ColorSchemeScript`と同じく、nonceをpropsで受け取る小さな`'use client'`のコンポーネントにし、serverモードでは`nonce()`を渡し、staticモードでは同じ本文のハッシュを`csp`に書く形を示しました。

  `@k8ordo/state`のガイドの「Reading before hydration」からは、この項へ1文で案内します。

- `@k8ordo/framework`のガイドに「Preferences」の節を足し、訪問者の設定をどこに置くかを3つの規則にまとめました。見た目だけを変える設定は`defineLocalState`に置き、`inlineRead()`のインラインスクリプトで描く前に当てます。サーバーが値で応答を変える設定は、serverモードで`defineCookieState`に置き、`parseCookies`で読み、`cookie(patch, current)`か`update()`で書きます。言語の選択は素のCookieに置き、`negotiateRequest`の`chosen`に渡します。`@k8ordo/state`の例で密度をCookieに置いているのは、JavaScriptの無いフォームで変え、それを受けるServer ActionがCookieにしか書けないからだと、2つ目の規則に書きました。

  これまでは、`@k8ordo/color-scheme`のガイドが表示の設定をlocalStorageに置くよう勧め、`@k8ordo/state`のガイドとexampleは密度をCookieに置いていて、どちらを選ぶかの基準がありませんでした。`@k8ordo/state`、`@k8ordo/color-scheme`、`@k8ordo/i18n`のガイドからは、この節へ1文で案内します。docsサイトでは、frameworkの`request`のページに同じ節を足し、stateのCookieとcolor-schemeの保存先のページから案内します。

  `request`を読む例（`references/guards.md`）は、素の`theme`のCookieから`data-theme`を、`Accept-Language`から`<html lang>`を書いていて、この規則と`getLocale()`で`lang`を書く決まりの両方に反していました。Cookieの状態を`parseCookies(request.cookies)`で読んで`initialCookie`に渡し、ヘッダーは`Sec-GPC`を読む例に書き換えました。

- `useAppState`の`initialUrl`と`initialCookie`に`undefined`を渡せるようにしました。`undefined`は渡さなかったときと同じで、サーバーとブラウザで共用する部品が受け取ったpropsをそのまま渡せます。

  これまでは型が`undefined`を受けず、`exactOptionalPropertyTypes`を有効にしたプロジェクトでは、値が無いときにオプションごと三項演算子で分ける必要がありました。実行時の扱いは変わりません。

- `defineLocalState`と`defineCookieState`の`migrate`が例外を投げたとき、その例外を知らせ、保存した値を`update()`で上書きしないようにしました。

  これまでは例外をどこにも出さずに既定値で読んでいたので、`migrate`に誤りがあると、全員の設定が既定値に戻ったように見えるだけでした。いまはブラウザのストアが同じ値につき1度`reportError`に渡すので、`window`の`error`イベントやエラー監視に届きます。サーバーの`parseCookies`は、キーを添えて`console.error`に出します。

  また、`migrate`が読めなかった行も、最初の`update()`が「既定値＋変えた値」で上書きしていました。ガイドの「行はそのまま残り、直した`migrate`がやり直せる」という約束に反していました。いまはその行を読んだ書き込みは何も書かず、`update()`のハンドルを同じ例外でrejectします。変えた値は、別のタブからの知らせでその行を読み直しても既定値に戻らず、次の読み込みまでメモリに残ります。localStorageとCookieのどちらも同じです。

- Updated dependencies:
  - @k8ordo/router@4.0.0

## 3.0.0

### Minor Changes

- `definePageState`に`hash`を足しました。URLのフラグメントを、ページの状態の3つ目の置き場所として読み書きできます。フラグメントは1本の文字列なので、`hash`にはフィールドのオブジェクトではなく値1つ分のスキーマを渡し、値は状態の`hash`というフィールドになります。`update({ hash: 4 })`は`#4`を書き、既定値を書くとフラグメントが消え、`href()`にも`hash`を渡せます。スキーマが受け付けないフラグメント（`#main`のようなページ内リンク）はこの状態の値として扱わず、既定値で読んでURLに残します。これまでは、フラグメントに置く値を`history.replaceState`で自分で書くしかなく、そうすると同じ履歴エントリの`entry`の状態が消えていました。

- テスト用の入口`@k8ordo/state/testing`と、その`mountPageUrl()`を足しました。URLやフラグメントを書く`update()`は、どのリスナーも横取りしなければ文書の読み込みになり、テストを動かしているページごと移動します。`mountPageUrl()`は`@k8ordo/router`と同じ条件でルーターの代わりに横取りし、`{ search, hash }`でテストを始めるURLを決めます。返す関数は後始末で、`resetStateRegistry()`を呼んで待っている書き込みごとストアを消し、URLと履歴エントリの状態を元に戻します。Vitestの`beforeEach`にもStorybookの`beforeEach`にも、そのまま返せます。これまでは、横取りするリスナーと後始末をテストごとに手で書く必要がありました。

### Patch Changes

- URLの値を続けて書いても、WebKitのnavigateの上限に届かないようにしました。WebKitは同じ文書へのnavigateを10秒に200回までしか通さず、超えた分を`QuotaExceededError`で断ります。スライダーのように入力ごとに`update()`する部品は数秒でそこに届き、以降の書き込みがURLに載りませんでした。今は、URLの値を変える`replace`の書き込みが前の書き込みから100msたっていなければ、残りの時間を待ち、そのあいだの`update()`を1回のnavigateにまとめます。画面の値はこれまでどおり`update()`のたびにすぐ変わります。`history: 'push'`の書き込みは待たせません。待っているあいだにページを離れた書き込みは書かれず、そのハンドルは`AbortError`で断られます。これまでは、`update()`の直後に同じハンドラで別のページへ移ると、その値が移った先のURLに書かれていました。

- Updated dependencies:
  - @k8ordo/router@3.0.0

## 2.3.1

### Patch Changes

- `@k8ordo/*`のパッケージを、すべて同じバージョンで出すようにしました。これまで`@k8ordo/ui`だけは別にバージョンを上げていたので、ほかのパッケージは2.0.0から2.3.1へ飛びます。このリリースに中身の変更はありません。

## 2.0.0

### Patch Changes

- Updated dependencies:
  - @k8ordo/router@2.0.0

## 1.4.4

## 1.4.3

## 1.4.2

### Patch Changes

- WebKitで、同じサイトの別のオリジンを挟んで戻ったあと、それより前の履歴エントリへ戻ると、`usePathname`と`definePageState`のURLの値が古いまま残っていたのを直しました。検索欄が空のまま一覧も絞られず、ナビゲーションの現在地も前のページのままになっていました。WebKitはこの戻るで`currententrychange`を出さないので、`popstate`でも読み直します。

- サイトのデータの保存を止めたブラウザで、`defineLocalState`と`defineSessionState`を使うページがエラーになるのを直しました。

  - このブラウザでは、`localStorage`と`sessionStorage`を読むと`SecurityError`になります。このエラーでページの描画が止まり、`@k8ordo/color-scheme`の`ColorSchemeProvider`を置いたアプリでは、どのページもエラー画面になっていました。
  - これからは既定値で描画します。`update()`で変えた値は次に読み込むまでメモリに残り、ハンドルはそのエラーでrejectします。
  - `getItem`がエラーになったときも、描画は既定値で続きます。`storage`イベントでは表示中の値を保ちます。`update()`は何も書かずにrejectするので、読めなかったフィールドは消えません。

## 1.4.1

## 1.4.0

## 1.3.0

### Patch Changes

- ページの状態（`definePageState`）が、それを描くページのURLの値を読むようにしました。`@k8ordo/router`と`@k8ordo/framework`はURLを先に確定させ、次のページが届くまで前のページを画面に残します。これまでは、そのあいだ画面に残るページも次のページのURLの値で描かれ、絞り込んだ一覧が全件に戻るなど、離れる前と違う表示になっていました。

  - 次のページは、これまでどおり最初の描画から自分のURLの値で描かれます。pathnameが同じ遷移（`update()`、戻る・進む、GETフォーム）には、これまでどおりすぐに従います。
  - 読み込み中にURLが画面のページへ戻ったときは、そのURLの値に戻ります。
  - 読み込み中に、離れていくページで呼んだ`update()`は何も書かず、`finished`はすぐに解決します。これまでは次のページのURLに書き、次のページを読み込み直していました。
  - 画面のページを知らせないルーター（Next.jsや、`useInterceptedNavigation`で作った自前のホスト）の下では、これまでどおりURLに従います。
  - `@k8ordo/router`と`@k8ordo/framework`もこの版に上げてください。どの木がどのpathnameのものかは、その2つが知らせます。

- `useAppState`が、種類ごとのストアをすべてimportしないようにしました。定義（`definePageState`、`defineLocalState`など）が自分の種類のストアを結び、`useAppState`はそれを引くだけです。これまでは、たとえば`defineLocalState`だけを使うモジュールにも、ページとCookieのストア、`definePageState`、URLのコーデックが一緒に載っていました。公開のAPIは変わりません。

## 1.2.1

## 1.2.0

## 1.1.0

### Patch Changes

- peerの`zod`の下限を`^4.4.3`から`^4.6.6`に上げました。4.6.5以前の`zod`は、大きな配列を渡されると要素ごとの検証エラーをすべて積み上げ、メモリを使い果たすおそれがあります（[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)）。フォームの送信やURLのように外から来た値をスキーマで検証するので、修正の入った4.6.6を下限にしました。

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。`@k8ordo/*` のうち form・state・router・i18n・color-scheme・framework の 6 つはそろって 1.0.0 になり、以後も同じ版で出す。どれか 1 つが版を上げれば、変更のないものも同じ版で出る（`@k8ordo/ui` は別の版で続く）。互いの peer は `^1.0.0` で結ぶ。

  0.2.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

  - peer の `react` / `@types/react` を `>=19.3.0` に、optional peer の `@k8ordo/router` を `^0.1.0` から `^1.0.0` にした（型が router の `NavigablePath` を読む）。
  - `RegisteredPath` を `RegisteredPath<Path>`（受け付けるパスなら `Path`、拒むなら受け付けるパスの和集合）にした。`routes` を登録していれば、拒んだパスの型エラーに表のリンクできるパターンが並ぶ。
  - url に置く真偽値の配列は、要素を `z.stringbool()` で書く。`z.array(z.coerce.boolean())` / `z.array(z.boolean())` は定義のときに `TypeError` を投げる。
  - `AnyState` に `SessionState` と `CookieState` が加わった。`def.kind` で網羅的に分けているコードは、この 2 つを足す。

  この版で足した主なもの: `defineSessionState`、サーバーでも読める `defineCookieState`、保存する行の `version` / `migrate`、Vite の `base` を付けた `href`。

- url の配列の要素の真偽値を、トップレベルの欄と同じ規則で読み書きするようにした（破壊的変更）。

  - `z.array(z.coerce.boolean())` や `z.array(z.boolean())` の url 欄は、定義時に `TypeError` を投げる。これまでは受け付けて、`"false"` を `true` と読んでいた。
  - `z.array(z.stringbool(...))` の要素は、要素のスキーマ自身の綴りで書く。これまでは `String()` で `"true"` / `"false"` と書いていたので、`z.stringbool({ truthy: ['yes'] })` の配列は `update()` のたびに既定値（`[]`）に落ちていた。

  移行: 真偽値の配列を url に置いているなら、要素を `z.stringbool()` にする。

### Minor Changes

- `@k8ordo/state` の `href` が、ルート表に `/:locale` のような先頭の param があると、どんなパスでも受け付けていたのを直す。

  - `@k8ordo/router` の `RouteOf<typeof routes>`（表のリンク可能な pathname の union）を削除し、`NavigablePath<typeof routes, Path>` を追加。渡したパスを表のリンク可能なパターンと区間ごとに照合し、合えば `Path`、合わなければ `never` を返す。`:param` は空でない 1 区間（テンプレートリテラルの `${string}` を含む）を受ける。union では `/:locale` が `/${string}` になり、それがすべてのパスを吸収していた。
  - `@k8ordo/state` の `href` は渡されたパスを推論し、`Register` の `routes` の表とこの型で照合する。`'/ja/nowhere'` は `/:locale` の表でも型エラーになる。`RegisteredPath` は `RegisteredPath<Path>`（受け付けるなら `Path`、拒むなら表のリンクできるパターンの和集合）になった。型エラーには `never` でなく、そのパターンが並ぶ。

- `urlReader(schema)` を足した。url スキーマを受け取り、`parseUrl` と同じ入力（`URLSearchParams` か、値の record）から同じ読み方で値を返す関数を返す。codec は 1 度だけ作る。フレームワークが `search` を宣言したページの search を読むのに使う。

- `defineSessionState(key, schema)` を追加。sessionStorage に置く状態で、`defineLocalState` と同じ作りですが、`version` / `migrate` は取りません。

  - 値は sessionStorage の `k8ordo-state:<key>`（定義の `storageKey`）の 1 行に置きます。そのタブのリロードでは残り、タブを閉じると消え、ほかのタブとは共有されません。
  - サルベージ・書き込みのまとめ方・ハンドル・`inlineRead()` は local と同じです。`inlineRead()` は sessionStorage を読みます。
  - 種類が違えば、同じキーでも別の状態です。`defineLocalState` と `defineSessionState` に同じキーを付けても、行も値も共有しません。
  - `SessionState` 型を export しました。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。

- peer を `react` / `@types/react` とも `>=19.3.0` にしました。k8ordo のパッケージはすべて React 19.3 を前提にそろえます。

- `defineLocalState` と `defineCookieState` に、3 つ目の引数 `{ version, migrate(old, fromVersion) }`（型は `Versioning`）を足しました。

  - 版を渡した定義は、行を `[version, values]` の形で保存します。版の無い行（版を宣言する前に書かれた行）は版 `0` として読みます。
  - `version` より古い行は `migrate` を通してからスキーマでフィールドごとにサルベージし、ブラウザのストアが今の版で書き戻します。サーバーの `parseCookies` も移行して読みますが、書き戻しはしません。
  - `migrate` が返すキーはスキーマのキーに限られ（ほかのキーは型エラー）、値は古い値をそのまま渡せます。
  - 新しい版が書いた行は移行せずにサルベージし、書き戻しません。`migrate` が throw した行は何も保存されていないものとして読み、行には触りません。
  - 版を持つ local の `inlineRead()` は、今の版の行だけを返し、ほかの版の行では `null` になります。
  - 渡さなければ今までどおり、行は値のオブジェクトそのもので、古い行はフィールドごとにサルベージします。

- `defineCookieState(key, schema)` を追加。サーバーが読める好みの置き場所です。

  - 値は `k8ordo-state.<key>`（定義の `cookieName`）という 1 つの Cookie に、宣言したフィールドの JSON をパーセントエンコードして置きます。キーが HTTP の token にならない文字を含むと定義時に throw します。
  - サーバーでは `parseCookies(request.cookies)` がフィールドごとにサルベージした値を返し、それを `useAppState(def, { initialCookie })` に渡すと、サーバーの描画とハイドレーションの描画が実際の値になり、既定値がちらつきません。`@k8ordo/framework` の static モードではリクエストが無いので、local と同じく既定値で描いて hydration で置き換えます。
  - ブラウザは Cookie Store API で `Path=/`・`SameSite=Lax`・`Max-Age` 400 日で書き（Cookie Store API は必ず `Secure` を付けるので、ページは HTTPS で配ります。Chromium と Firefox は `http://localhost` でも保ちますが、Safari はそこで `Secure` の Cookie を捨てるので、Safari で確かめるなら開発中も HTTPS で配ってください）、`change` イベントでほかのタブ（とサーバーの応答が設定した Cookie）を取り込みます。`Lax` にするのは、ほかのサイトのリンクから来た最初のリクエストにも Cookie を付けるためです。読み取りは `useSyncExternalStore` が同期のスナップショットを要るので `document.cookie` で行います。
  - Cookie Store API の書き込みは非同期なので、書き込みを 1 本ずつ流し、前の書き込みが Cookie に入ってから次の書き込みの値を組み立てます。`await` を挟んだ 2 つのバッチで、後のバッチが前のバッチのフィールドを古い値で上書きすることがありません。自分の書き込みが終わる前に届いた `change` では読み直さず、最後の書き込みが終わってから読むので、echo が一瞬前の値に戻ることもありません。
  - 4 KB を超えるなど Cookie Store API が拒んだ書き込みは、ハンドルを reject し、描画された値は残します（local と同じ）。
  - `cookieValue(values)` は、サーバーが同じ Cookie を書くときの値を、エンコードしていない JSON で返します（`@k8ordo/framework/server` の `cookies()` や Next.js の `cookies().set` がパーセントエンコードして書きます。`Set-Cookie` ヘッダーを自分で組み立てるなら `encodeURIComponent` してください）。ブラウザが書く Cookie なので `HttpOnly` にはできず、秘密を置く場所ではないことを GUIDE に書きました。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `defineMemoryState` はスキーマを取らない型付きの箱で、スキーマを持つのは境界をまたぐ置き場所（url・entry・localStorage・sessionStorage・Cookie）だけ、とどの面でもそろえました。
  - 更新のハンドルは、ナビゲーションを伴わない種類でも書き込みが済んでから settle し、local は保存に失敗すると reject します。

- `z.stringbool()` や型を変える変換を含む定義で、1 つのフィールドが弾かれると、ほかのフィールドまで既定値に戻っていたのを直しました。

  サルベージの最後の確認が、サルベージした後の値（スキーマの出力）をもう一度スキーマに通していたため、自分の出力を入力として受け付けないフィールドがあると、`refine` が無くても確認に失敗していました。

  - url: `{ q, page: >= 1, inStock: z.stringbool() }` で `?q=shoes&page=0&inStock=true` が `{ q: '', page: 1, inStock: false }` と読まれていました。`update({ q: 'boots', page: 0 })` も q の書き込みごと消えていました。
  - entry / localStorage: 既定値を持つ `z.stringbool()` があると、書き込みのたびに同じスロットのほかのフィールドも既定値に戻っていました（`z.stringbool()` 自身が戻るのは、型付きの値をそのままスキーマに戻すスロットの性質で、これまでどおりです）。

  確認は、弾かれなかったフィールドを届いたままの値でスキーマ全体に通し直す形に変えました。オブジェクト全体の `refine` が禁じる組み合わせは、これまでどおり全体が既定値に戻ります。

  あわせて、URL に書けない値を渡したときのエラー文を `holds a value of type object` に直しました（`holds a object` になっていました）。

- url の真偽値を、そのフィールドのスキーマ自身の綴りで書くようになりました。これまでは常に `"true"` / `"false"` と書いていたため、`z.stringbool({ truthy: ['yes'], falsy: ['no'] })` のように綴りを指定したフィールドは、`update()` や `href` で書いた値を読み返せず既定値に落ちていました。`@k8ordo/form` が同じフィールドから導くチェックボックスの `value` とも一致します。

- ガイドの「Updates」に、`@k8ordo/router` の下では、別ページの読み込み中に出した url 更新もページの切り替えになり、アクションに加わらないので `finished` はそのページが出たところで決着する、と書き足しました。

- README の `parseUrl` の説明を今の挙動に合わせました。`@k8ordo/framework` の server モードでは `export const search = listState.url` を export したページが、読み取った url の値を `search` として受け取ります（そのまま `initialUrl` に渡せます）。static モードはこの export をビルド時に断り、そこと `search` を export しないページでは `useAppState` がブラウザで url を読みます。

- localStorage・sessionStorage の状態で、書き込む値でスキーマが例外を投げたとき（自分の出力を読み直すと zod の issue ではなく素の `Error` を投げる `.transform()` など）、`update()` のハンドルがその例外で reject するようにした。これまでは書き込みのマイクロタスクの中で捕まらない例外になり、ハンドルは決着せず、書き込みも失われていた。Cookie の状態はもともとそうしていた。描画された値は残る。

- 任意の peer の `typescript` の下限を `>=7.0.2` から `>=7.0.0` にする。TypeScript 7 の正式版は 7.0.2 が最初なので、受け付ける版は変わらない。ドキュメントで「TypeScript 7以上」と書けるようにするため。

- Updated dependencies:
  - @k8ordo/router@1.0.0

## 0.2.0

### Minor Changes

- `Register` の形を `@k8ordo/router` と揃える。アプリは router と同じ
  `interface Register { routes: typeof routes }` を一行書くだけでよく、path の
  union は `RouteOf`（型のみの import。`@k8ordo/router` は optional peer で、
  実行時には読み込まれない）から導く。従来の `{ path: P }` 形（next の `Route`
  など、表を持たないルーター向け）も引き続き受け付け、両方あれば `routes` が
  優先される。

  あわせて `defineLocalState` の定義に `storageKey`（localStorage の実キー
  `k8ordo-state:<key>`）と `inlineRead()` を追加する。後者はハイドレーション前の
  インライン `<script>` で評価すると保存されたオブジェクト（失敗時は `null`）に
  なる JavaScript 式を返す。`<html>` のテーマクラスのように最初の描画より前に
  必要な値を、キーと JSON 封筒をアプリが文字列に手書きせずに読めるようにする。
  スキーマはそこでは走らないので、結果は未検証として扱い、必要なフィールドだけ
  をフォールバック付きで読むこと。

### Patch Changes

- url スロットの値を「戻ってくる道」で正規化する。`update()` の echo が
  typed な値をそのままスキーマに渡していたため、`string → boolean` のような
  一方向の綴りは自分の出力を読めず、既定値に落ちていた。あわせて、URL に
  書けない綴りを定義時に拒む（配列の既定値は `[]` のみ、boolean は
  `z.stringbool()` のみ）。
