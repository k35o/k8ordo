# @k8ordo/state

## 0.2.1

### Patch Changes

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
