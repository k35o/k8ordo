---
"@k8ordo/form": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・i18n・color-scheme）はそろって 1.0.0 になり、`@k8ordo/static` と `@k8ordo/server` をまとめた `@k8ordo/framework` も 1.0.0 で始まる。互いの peer は `^1.0.0` で結ぶ。

0.1.1 から上げるときに手を入れるもの（詳しくは下の各項目）:

- peer の `react` / `react-dom` / `@types/react` を `>=19.3.0` にした。
- 送信のときにブラウザ側で全欄と `defineForm` のルールを検証し、失敗すれば送信を止める。`<form>` に自分の `onSubmit` を書くなら、その中で `form.props.onSubmit(event)` を呼ぶ。
- どんな入力でも失敗するスキーマ（`z.number()`・`z.literal(1)`・`z.date()`・`z.bigint()` など）は、`formFields` / `parseForm` が導くときに投げる。数値の欄は `z.coerce.number()` で書く。
- 空の数値欄と、ファイルを選んでいない欄は、入力なし（`undefined`）としてスキーマに渡る。何も選ばれていない選択肢（enum）も `''` ではなく `undefined` になる。
- チェックボックス群の値は、チェックが 1 つでも配列（`['a']`）になる。

この版で足した主なもの: `z.stringbool()` のチェックボックス、`z.file()` の欄、ルールの文言に渡す関数、`form.formError`、フォームの reset への追従。
