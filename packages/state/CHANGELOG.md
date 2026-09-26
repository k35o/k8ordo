# @k8ordo/state

## 0.3.0

### Minor Changes

- `@k8ordo/state` の `href` が、ルート表に `/:locale` のような先頭の param があると、どんなパスでも受け付けていたのを直す。

  - `@k8ordo/router` の `RouteOf<typeof routes>`（表のリンク可能な pathname の union）を削除し、`NavigablePath<typeof routes, Path>` を追加。渡したパスを表のリンク可能なパターンと区間ごとに照合し、合えば `Path`、合わなければ `never` を返す。`:param` は空でない 1 区間（テンプレートリテラルの `${string}` を含む）を受ける。union では `/:locale` が `/${string}` になり、それがすべてのパスを吸収していた。
  - `@k8ordo/state` の `href` は渡されたパスを推論し、`Register` の `routes` の表とこの型で照合する。`'/ja/nowhere'` は `/:locale` の表でも型エラーになる。`RegisteredPath` は `RegisteredPath<Path>`（受け付けるなら `Path`、拒むなら `never`）になった。

- `defineSessionState(key, schema)` を追加。sessionStorage に置く状態で、`defineLocalState` と同じ作りです。

  - 値は sessionStorage の `k8ordo-state:<key>`（定義の `storageKey`）の 1 行に置きます。そのタブのリロードでは残り、タブを閉じると消え、ほかのタブとは共有されません。
  - サルベージ・書き込みのまとめ方・ハンドル・`inlineRead()` は local と同じです。`inlineRead()` は sessionStorage を読みます。
  - 種類が違えば、同じキーでも別の状態です。`defineLocalState` と `defineSessionState` に同じキーを付けても、行も値も共有しません。
  - `SessionState` 型を export しました。

- Vite の `base` の下（`base: '/docs/'` など、オリジンのサブパス）にアプリを置いても動くようにした。ルート表はアプリの根から書いたままで、URL との境目で base を付け外しする。

  - `@k8ordo/router`: `href` / `navigateTo` / `bindParams` がリンクの前に `import.meta.env.BASE_URL` を付ける。`href` の戻り値はリンク先の URL なので、型を表のパスの形（`PathFor<P>`）から `string` に変えた。`usePathname` と `<Router>` の照合は base を外した pathname で行い、base の外の URL は `<Router>` が引き受けない。付け外しの手順として `withBase(pathname, base?)` / `withoutBase(pathname, base?)`（base の外は `null`）を公開する。
  - `@k8ordo/state`: `href(path, values)` の返すリンクの前に base を付ける。パスは表と同じく根から書く。Vite の外（Next.js など）では何も付けない。
  - `@k8ordo/static` / `@k8ordo/server`: ハンドラは base を外した pathname でページ・ペイロード・redirect を解き、base の外には `404` を返す。`redirect.ts` の行き先（表のパターン）には base を付けて送る。Server Action の `redirect(to)` は URL をそのまま送るので、`href()` で作る。クライアントは base の下の同じオリジンの URL だけを引き受け、hydrate するかどうかも base を外して比べる。`base` が根からのパスでない（`./` や別オリジン）ときはビルドを止める。
  - `@k8ordo/static`: 事前描画はハンドラに base を付けた URL で頼み、ファイルは `dist/client/` の中の表の pathname に書く。`sitemap.xml` の `<loc>` にも base を含める。`paths` オプションは base を付けない pathname を受ける。
  - `@k8ordo/server`: `serve` はビルドの base を `dist/rsc/index.js` の `base` から読み、クライアントのビルドのファイルをその下で配る（`immutable` の判定も base の下の `assets/` で行う）。

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
  - サーバーでは `parseCookies(request.cookies)` がフィールドごとにサルベージした値を返し、それを `useAppState(def, { initialCookie })` に渡すと、サーバーの描画とハイドレーションの描画が実際の値になり、既定値がちらつきません。`@k8ordo/static` ではリクエストが無いので、local と同じく既定値で描いて hydration で置き換えます。
  - ブラウザは Cookie Store API で `Path=/`・`SameSite=Lax`・`Max-Age` 400 日で書き、`change` イベントでほかのタブ（とサーバーの応答が設定した Cookie）を取り込みます。`Lax` にするのは、ほかのサイトのリンクから来た最初のリクエストにも Cookie を付けるためです。読み取りは `useSyncExternalStore` が同期のスナップショットを要るので `document.cookie` で行います。
  - Cookie Store API の書き込みは非同期なので、書き込みを 1 本ずつ流し、前の書き込みが Cookie に入ってから次の書き込みの値を組み立てます。`await` を挟んだ 2 つのバッチで、後のバッチが前のバッチのフィールドを古い値で上書きすることがありません。自分の書き込みが終わる前に届いた `change` では読み直さず、最後の書き込みが終わってから読むので、echo が一瞬前の値に戻ることもありません。
  - 4 KB を超えるなど Cookie Store API が拒んだ書き込みは、ハンドルを reject し、描画された値は残します（local と同じ）。
  - `cookieValue(values)` は、サーバーが同じ Cookie を書くときの値を返します。ブラウザが書く Cookie なので `HttpOnly` にはできず、秘密を置く場所ではないことを GUIDE に書きました。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `defineMemoryState` はスキーマを取らない型付きの箱で、スキーマを持つのは url / entry / local だけ、とどの面でもそろえました。
  - 更新のハンドルは、ナビゲーションを伴わない種類でも書き込みが済んでから settle し、local は保存に失敗すると reject します。
  - スキーマが自分の出力を入力として受け付けない欄（`z.stringbool()` など）があると、1 つの欄が弾かれただけで全体が default に戻る、という今の版の制約を書きました。

- `z.stringbool()` や型を変える変換を含む定義で、1 つのフィールドが弾かれると、ほかのフィールドまで既定値に戻っていたのを直しました。

  サルベージの最後の確認が、サルベージした後の値（スキーマの出力）をもう一度スキーマに通していたため、自分の出力を入力として受け付けないフィールドがあると、`refine` が無くても確認に失敗していました。

  - url: `{ q, page: >= 1, inStock: z.stringbool() }` で `?q=shoes&page=0&inStock=true` が `{ q: '', page: 1, inStock: false }` と読まれていました。`update({ q: 'boots', page: 0 })` も q の書き込みごと消えていました。
  - entry / localStorage: 既定値を持つ `z.stringbool()` があると、書き込みのたびに同じスロットのほかのフィールドも既定値に戻っていました（`z.stringbool()` 自身が戻るのは、型付きの値をそのままスキーマに戻すスロットの性質で、これまでどおりです）。

  確認は、弾かれなかったフィールドを届いたままの値でスキーマ全体に通し直す形に変えました。オブジェクト全体の `refine` が禁じる組み合わせは、これまでどおり全体が既定値に戻ります。

  あわせて、URL に書けない値を渡したときのエラー文を `holds a value of type object` に直しました（`holds a object` になっていました）。

- 公開する tarball に `LICENSE`（MIT の本文）を同梱しました。これまでは `package.json` の `license` フィールドだけで、ライセンス本文が入っていませんでした。

- url の真偽値を、そのフィールドのスキーマ自身の綴りで書くようになりました。これまでは常に `"true"` / `"false"` と書いていたため、`z.stringbool({ truthy: ['yes'], falsy: ['no'] })` のように綴りを指定したフィールドは、`update()` や `href` で書いた値を読み返せず既定値に落ちていました。`@k8ordo/form` が同じフィールドから導くチェックボックスの `value` とも一致します。

- ガイドの「Updates」を `@k8ordo/router` の修正に合わせて直しました。非同期アクション（`startTransition(async …)`・`useTransition`・`Button` の `onAction`）の中でも `update().finished` を待てます。別ページの読み込み中の url 更新もページの切り替えになりますが、ページの切り替えはアクションに加わらないので止まりません。

- Updated dependencies:
  - @k8ordo/router@0.2.0

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
