# @k8ordo/state

## 0.3.0

### Minor Changes

- peer を `react` / `@types/react` とも `>=19.3.0` にしました。k8ordo のパッケージはすべて React 19.3 を前提にそろえます。

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
