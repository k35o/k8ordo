# docs

## 0.0.10

### Patch Changes

- ロケールの定義に `timeZone` と `dir` を必須で持たせる（破壊的変更）。

  - `defineLocales` はタグの配列ではなく、タグをキーにしたオブジェクトを受け取るようになった。各ロケールは、日付を表示する IANA のタイムゾーン（`timeZone`）と文字の向き（`dir`: `'ltr' | 'rtl'`）を必ず書く。実行環境のタイムゾーンはサーバーと訪問者のブラウザで違うので、それに任せて書いた日付は HTML と hydrate で食い違う。`Intl.Locale#getTextInfo` はまだ全ブラウザに無いので、向きも宣言する。
  - 集合に `definitions` を足した（`locales.definitions[locale].dir` を `<html dir>` に書く）。型 `LocaleDefinition` を公開した。
  - 空の集合、実行環境が知らないタイムゾーン、欠けたタイムゾーン、`ltr` / `rtl` 以外の `dir` は `defineLocales` で `TypeError` を投げる。キーは重複できないので「タグが 2 回ある」検査は無くなった。
  - `default` を省いたとき、`locales.default` の型は先頭のタグではなく一覧の和集合になる（オブジェクトのキーの順は型に残らないため）。実行時の既定値は従来どおり先頭に書いたタグ。

  移行: `defineLocales(['ja', 'en'])` を `defineLocales({ ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' }, en: { timeZone: 'UTC', dir: 'ltr' } })` のように書き換える。

  サイトは `src/i18n.ts` を新しい形にし（`ja` は `Asia/Tokyo`、`en` は `UTC`）、ルートレイアウトが `<html dir>` を書くようにした。`/i18n/locales` に `timeZone` と `dir` の節を足した。

- serve の配信を整える。ビルドがクライアントの資産ごとに Brotli と gzip のコピー（`.br` / `.gz`）を作り、serve が `Accept-Encoding` で選んで `Vary: Accept-Encoding` 付きで返す。ファイルには中身から作った `ETag` を付けて条件付きリクエストに `304` で答え、1 つの範囲の `Range` には `206`（Safari の `<video>` 再生に要る）で答える。ページとペイロードはストリームのまま `node:zlib` で圧縮し、React が書いた部分ごとに押し出すので、シェルは遅い境界を待たずに届く。

- Props の表（型の区切りの `|` と、狭い画面の `Type:` / `Default:`）と `/ui/i18n` の文言キー一覧（狭い画面の列名）のラベルを、`fg-mute` の 60% ではなく `fg-subtle` で塗る。不透明度修飾子のために Tailwind が出していた `@supports (color: color-mix(in lab, red, red))` の分岐がサイトの CSS からなくなり、ライトで 2.9:1 だったラベルのコントラストが AA（5.1:1）に上がる。

- コードの表示を `@k8ordo/ui/code-block` の `CodeBlock` に置き換え、サイトが持っていた shiki の設定と、プレビューの背景をコードブロックに合わせる `--preview-bg` を消した。すべてのコードにコピーボタンが付く。`/ui/components/code-block` のページを足した。

- テーマの実装（context・保存・hydrate 前スクリプト）を `@k8ordo/color-scheme` に置き換え、`/color-scheme` のランディングとデモを足した。

- `/ui/components/data-table` のページを足した。並べ替えとページを `@k8ordo/state` の url スロットに持つ例を、実際に URL が変わるプレビューで示す。

- サイトの i18n 層を `@k8ordo/i18n` に載せ替えた。手書きの辞書・`MESSAGE_KEYS`・`useTranslation` / `<T k>` を消し、ロケール集合は `src/i18n.ts` の `defineLocales`（`Register` に登録）、文言は `src/messages/<area>.ts` に `message({ ja, en })` を 1 export ずつ置いて `m.nav.home()` のように呼ぶ。Server Component と Client Component で呼び方は同じで、Provider は無い。`[locale]` の `paramsSchema`、ルートレイアウトの `lang`、`vite.config.ts` のパス展開、`/` の振り分けは全部同じ `locales` を読む。`/i18n` のランディングを足し、`/ui/i18n` の文言は `uiI18n` 名前空間に、`PageTitle` / `PackageLanding` は Server Component からも使える共有コンポーネントにした。クライアントバンドルには client component が名前で参照した文言だけが残る。

- `/ui/components/kbd`・`/empty-state`・`/carousel` のページとカタログのプレビューを足し、Table のページの空状態の例を `Table.EmptyState` の新しい props に合わせた。

- - 全リンクを `src/links.ts`（router の `bindParams` にロケールを束ねた `href` / `navigateTo`）に載せ替えた。行き先は `/:locale/…` のパターンで、無いページは型で落ちる。`LocaleAnchor` と nav データもその型（`SitePath`）で受ける。
  - `vite.config.ts` の `paths` は `locales.paths`、`UIProvider` の辞書は `dictionaries[locale]`、`[locale]/layout.tsx` の `paramsSchema` は分割代入で export、i18n のコード例はページに戻した。

- 404 がどのロケールで描かれるかの説明を実装に合わせた。

  - GUIDE は「`404.html` の Client Component は hydration の後に訪問者のロケールで描き直される」と書いていたが、実際には hydration の最中に URL を読んで失敗していた。`404.html` は hydrate されずに訪問者の URL で描き直されること、`/en/…` の 404 はサーバーでも `en` で描かれること、`getLocale()` と `delocalize` が 404 でも一致することに直した。
  - ドキュメントサイトの framework・i18n・router の各ページと、同じ思い込みで書かれていたコメントも直した。

- - UI 以外の 7 パッケージに、Get Started から始まる話題別のガイドを足しました（form 4・state 5・router 5・static 6・server 7・i18n 5・color-scheme 2 ページ）。router の `matchPath`、i18n のロケールの交渉などは、その場で試せるデモ付きです。static と server で同じ話題は、文言と部品を 1 つにしてモードごとの差分だけを書き分けています。
  - パッケージとそのセクションの一覧を `src/data/packages.ts` の 1 か所にまとめました。ヘッダーの 2 段目、フッターの列、トップページ、ランディングのセクション一覧、ガイドの前後ナビがそこを読みます。ランディングからは Get Started と `GUIDE.md` へ進めます。
  - 既存の UI ページも実装に追従させました。Storybook へのリンクの id、動作要件の React のバージョン、`dictionaries` の案内、Toast / Textarea / Popover の例などです。

- `/ui/components/prose` のページとカタログのプレビューを足した。

- サイドナビを `@k8ordo/ui` の `SideNav` で組み直し、`nav` にカタログの名前（Components / AI）を付けた。`/ui/components/side-nav` と `/ui/components/table-of-contents` のページを足し、目次のページには自分の見出しを指す `TableOfContents` を右に置いた。

- `/` の振り分けの説明を、`@k8ordo/server` では `guard.ts` が `307` で答える書き方に改めた。

  - GUIDE の「The `/` page」は、ページは応答を書けず `serve` にもフックが無いので、サーバーでの redirect はアプリケーションの外（`serve` の前のプロキシか、ハンドラを包む自前のホスト）で行う、と書いていた。`guard.ts` が入ったので、`(home)/guard.ts` が `locales.negotiateRequest(request, { cookie: 'locale' })` で選び、`withBase(locales.localize('/', locale))` へ `307` を返す形にした。guard を `/` だけに効かせるためにルートグループに入れること、`null` を返すページが要ること、`308` にしない理由も書いた。`guard.ts` を拒む `@k8ordo/static` では、これまでどおり effect で移る。
  - llms.txt の GUIDE の要約に、`/` の振り分けがモードで違うことを足した。
  - ドキュメントサイトの `/i18n/integrations` の `@k8ordo/server` の節（コード例をページ＋クライアントの `RedirectTo` から guard＋`null` のページに）と、`/i18n/routing` の `/` の節も同じ内容に直した。

- 組み込みの文言を `@k8ordo/i18n` の今のロケールから読むようにした（破壊的変更）。

  - `@k8ordo/i18n` を peer dependency にした。コンポーネントは `currentLocale()` を読み、アプリが `defineLocales` で集合を定義していれば文言と同じロケール（URL が名指すもの、無ければ集合の既定）で描く。集合が無いアプリでは **英語** で描く（これまでの既定は日本語）。URL が `/ja/…` で始まっていても変わらないので、サーバーとブラウザで食い違わない。
  - `ja` と `en` の辞書はライブラリが持つ。それ以外のロケールや差し替えは、`@k8ordo/ui/i18n` の `registerMessages(locale, messages)` で登録する。登録した辞書は組み込みより優先され、`en-US` のような地域つきのタグは言語（`en`）の辞書を読む。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げる。
  - `UIProvider` の `messages`、`MessagesProvider`、`useMessages`、`dictionaries`、ルートからの `Messages` 型の export を削除した。`UIProvider` は Toast のために残る。`useMessages()` の代わりに、hook ではない `getMessages()` を `@k8ordo/ui/i18n` から使う。
  - 文言のためだけに Client Component だった `Spinner`・`Breadcrumb`・`Code`・`Alert`・`Reasoning`・`ToolInvocation` から `'use client'` を外し、Server Component から描けるようにした。

  移行: `UIProvider` から `messages` を外す。日本語で描いていたアプリは `@k8ordo/i18n` でロケール集合（日本語だけなら `ja` 1 つ）を定義し、そのモジュールをサーバーの描画とブラウザの両方で読み込まれる場所から import する。`messages` に渡していた辞書や差し替えは `registerMessages` で登録し、`useMessages()` は `getMessages()` に置き換える。

  サイトの `LocaleShell` は `UIProvider` に辞書を渡さなくなった（文言はサイトのロケールに自分で従う）。`/ui/i18n` と `/i18n/integrations` を新しい仕組みで書き直し、3.x からの移行手順を足した。

- ロケール集合に、今のロケールで `Intl` を引く補助を足した: `dateTimeFormat` / `numberFormat` / `relativeTimeFormat` / `pluralRules` / `listFormat`。

  - どれも `Intl` のオブジェクトそのものを返す（`format`・`formatToParts`・`select` などは `Intl` のまま）。独自の書式の記法は無い。
  - ロケールとオプションの組ごとに 1 つ作ってキャッシュし、次からは同じものを返す。
  - `dateTimeFormat` は、そのロケールの `timeZone` でしか日付を書かない。オプションの型は `timeZone` を受け付けず（`LocaleDateTimeFormatOptions`）、`as` で押し通してもロケールのものが勝つ。サーバーとブラウザでタイムゾーンがずれて hydrate が食い違う失敗を、型で起きなくするため。
  - hook ではないので、Server Component・Client Component・文言の関数の中のどこでも呼べる。型 `IntlFormats` と `LocaleDateTimeFormatOptions` を公開した。

  サイトに `/i18n/formatting`（日付と数値）のページを足し、`/i18n/messages` と `/i18n/routing` のコード例を補助を使う形に直した。

- サイトの CSS に Tailwind のプリフライト（`@layer base` のリセット）が 2 回出力されていたのを直す。`@k8ordo/ui` の Tailwind 入口（`src/styles/index.css`、配布物の `tailwind.css`）が中で `@import 'tailwindcss'` しているのに、`globals.css` でも先に同じものを読み込んでいた。テーマの変数とユーティリティは 1 つにまとまっていたので、重なっていたのはプリフライトだけで、見た目は変わらない。

- リクエストハンドラ（`dist/rsc/index.js` の `(request: Request) => Promise<Response>`）をビルドの正式な出口にする。ハンドラが実行環境から借りるのは `node:async_hooks` の `AsyncLocalStorage` だけで、Node.js・Bun・Deno・`nodejs_compat` の Cloudflare Workers でそのまま動く。そのために `serve` を `@k8ordo/server/runtime` から新しい入口 `@k8ordo/server/serve` に移した（`import { serve } from '@k8ordo/server/serve'` に書き換える）。`./runtime` に `serve` が同居していると、Server Action の `redirect()` を import しただけで `serve` の CommonJS 依存（`node:module` の `createRequire` を使う）がハンドラの bundle に入り、Node 以外で動かなくなっていた。`@k8ordo/server/runtime` は `redirect()` と `RedirectTarget`・`RouteRequest` の型だけになる。

- `FileField` のページに `FileField.Dropzone` の例を足した。

- Vercel のアダプタ `@k8ordo/server/vercel` を追加。`plugins: [framework(), vercel()]` とすると、`vite build` が Vercel の Build Output API（v3）の形で `.vercel/output/` も書き、`vercel build` / `vercel deploy --prebuilt` がそのままデプロイする。クライアントのビルドは CDN の静的ファイル（`assets/` はファイルが答えたときだけ immutable）、それ以外はリクエストハンドラを `fetch` として渡すストリーミングの Node.js 関数 1 つになる。Vite の `base` を指定したビルドでは、静的ファイルをその下に置く。関数は自分のディレクトリしか持てないので、`vercel()` の下ではハンドラをすべての依存ごと bundle する（ネイティブのバイナリを持つ依存は動かない）。

- `RangeSlider` のページを追加し、`Progress` のページに値のない表示の例を足した。

- AI チャットのページに、ツールの承認・添付・添付ファイルと出典・メッセージの操作の節を足し、デモでツールの実行を許可したりファイルを添えたりできるようにしました。

- React 19.3 に上げました。ページの差し替えを `<ViewTransition>` でクロスフェードし（ルーターが transition に付ける `navigation` の型で選ぶ）、`useClient` のページを消し、フォームのデモは `useForm(fields)` と書くようにしました。

- `DateField`・`DatePicker`・`Calendar` のページを追加した。

- ページを遷移するたびに、表の `error` 境界より下がすべてマウントし直されていたのを直しました。

  - `RouteErrorBoundary` は、失敗したページを離れたときに失敗を消すため、境界に `NavigationGeneration` を key として付けていました。この番号はページが替わるたびに変わるので、失敗していないときも境界の下のレイアウトと DOM が毎回作り直されていました。ルートに `error.tsx` を置いたアプリではヘッダーやフッターまで作り直され、クライアント遷移がページの再読み込みのように見えていました（docs サイトがそうでした）。
  - key をやめ、`NavigationGeneration` が変わったときに失敗の状態だけを消すようにしました。失敗したページを離れると失敗が消えること、search だけの更新では失敗が残ることは変わりません。

- `/state` の各ページに `defineSessionState` を足した（置き場所の表・選び方・デモの行・節、更新のまとめ方とハンドル、ハイドレーション前の読み取り）。

- `guard.ts` が返す `Response` の `location` には Vite の `base` が自動では付かないことをガイドに書く。

  - `base` の節で、`redirect.ts`（base を前に付けて送られる）と、アプリが自分で作るリダイレクト（Server Action の `redirect()` と、guard が返す `Response` の `location`。書いたまま送られるので `href()` で作る。ほかの方法で作った pathname には `withBase()` で base を付ける）を分け、後者を `@k8ordo/server` のものとして書く。
  - `@k8ordo/server` の Guards の例を `href('/login')` で作り、`location` が書いたまま送られることを書く。
  - サイトの `/server/guards` と `/server/deploy` も合わせ、`/static/deploy` からは Server Action の `redirect()` の記述を外す。

- `/state/places` に「保存した形が変わったとき」（`version` と `migrate`）の節と `Versioning` 型を、`/state/reading` のハイドレーション前の読み取りに版の違う行が `null` になることを足した。

- Server Action の `redirect()` の例で、行き先を `href()` で作るようにした（`@k8ordo/server` の GUIDE の `signIn` と README、`@k8ordo/form` の GUIDE と README、サイトの `/server/actions`）。`redirect(to)` は URL を書いたまま送り、Vite の `base` を付けない。素の pathname を渡す例は、base の下に置いたアプリで訪問者を base の外へ送ってしまい、「`href()` で作る」というガイド自身の説明とも食い違っていた。

- `/state` の各ページに `defineCookieState` を足した（置き場所の表・選び方・デモの行、`parseCookies` と `initialCookie`、サーバーから書く Cookie との関係、書き込みのまとめ方とハンドル）。「4 つの置き場所」という数え方をやめた。

- ロケール集合に `negotiateRequest(request, { cookie? })` を足した。Request から、定義したロケールのどれかを選ぶ。

  - `cookie` で名前を渡すと、その Cookie（訪問者が前に選んだロケール）を先に、次に `Accept-Language` を希望の順に試す。どちらも `negotiate` と同じ規則（完全一致 → 同じ言語 → 既定値）を通るので、集合にもう無いロケールが Cookie に残っていてもヘッダーに落ちる。
  - Cookie の名前はアプリケーションが決める。`cookie` を省くとヘッダーだけを読む。
  - ページより前に走り redirect を返せるファイルから、`/` をロケールへ振り分けるのに使う。型 `NegotiateRequestOptions` を公開した。

  サイトの `/i18n/locales` に `negotiateRequest` を足し、サーバーで `/` を振り分ける例（`/i18n/integrations`）をこれに書き換えた。

- Updated dependencies:
  - @k8ordo/color-scheme@0.2.0
  - @k8ordo/form@0.2.0
  - @k8ordo/i18n@1.0.0
  - @k8ordo/router@0.2.0
  - @k8ordo/state@0.3.0
  - @k8ordo/ui@3.0.0

## 0.0.10

### Patch Changes

- Updated dependencies:
  - @k8ordo/state@0.2.0
  - @k8ordo/ui@2.0.0
