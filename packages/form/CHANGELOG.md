# @k8ordo/form

## 0.2.0

### Minor Changes

- フォームが実際に送信する値と、スキーマが受け取れる値を突き合わせるようにした。

  - どんな入力でも失敗するスキーマは `formFields` / `parseForm` が derive 時に
    投げる。送信値は必ず文字列なので `z.number()` や `z.literal(1)`、`z.date()`、
    `z.bigint()` は満たしようがない（数値は `z.coerce.number()` を使う）。
  - 空の数値入力とファイル未選択を「入力なし」として扱う。`z.coerce.number()` は
    `''` を 0 と読むため、空欄が誰も入力していない 0 になり `required` も落ちて
    いた。属性を決めるプローブと `parseForm` が渡す値を一本化した。
  - `z.file()` を `type="file"` として導出し、`.mime()` を `accept` に落とす。
    バイト数の上下限は対応する属性がないので `dropped` で報告する。
  - `.transform()` や `z.custom()` のように制約を読み取れないリーフを、黙って
    `type="text"` にせず `dropped` に載せる。

### Patch Changes

- `z.iso.datetime({ local: true })` と `z.iso.time()` が `type="text"` に落ちていたのを直しました。

  zod 4.5 から、JSON Schema の `format` は標準の書式と値の集合が一致するときにしか出力されなくなり、この 2 つは pattern だけになりました。結果として `datetime-local` / `time` のピッカーが消え、スキーマが求めていたコントロールが失われていました。JSON に `format` が無いときはチェック自身から読み直すようにしています。

  `HiddenValue` の `data-initial`（dirty 判定の基準値）は、レンダー中の ref 参照をやめ、input がマウントされた時点の値から書くようになりました。サーバが返す HTML にはこの属性が乗らなくなります。

## 0.1.1

### Patch Changes

- `formFields` が `dropped`（HTML の制約属性に落ちず、ブラウザでは検査されない
  チェック）を返すとき、production 以外ではスキーマごとに一度 `console.warn`
  でも同じ一覧を出す。戻り値を読まなくても気づけるようにするため。あわせて
  `DroppedCheck` 型をクライアント側エントリ `@k8ordo/form` からも export する
  （`FormFields` の一部としてクライアントの props に現れる型のため）。
