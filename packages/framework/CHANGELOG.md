# @k8ordo/framework

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
