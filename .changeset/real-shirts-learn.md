---
"@k8ordo/form": minor
---

チェックボックスで `z.stringbool()` を受け付けるようになりました。

- チェックされていれば送られた文字列をそのままスキーマに渡し、されていなければ何も渡しません（`undefined`）。`z.boolean()` はこれまでどおり真偽値で読みます。
- `field().input.value` に、スキーマ自身が `true` を encode した綴り（既定は `"true"`、`truthy` を指定すればその先頭）が入ります。`@k8ordo/state` が url の真偽値を書く文字列と同じなので、`formFields(listState.url)` から導いた GET フォームは、state が書くのと同じ URL を送ります。これまでは url に真偽値を持つ state のスキーマを渡すと必ず例外になっていました。
- 未チェックを `true` と読むスキーマ（`z.stringbool().default(true)` など）は、`false` を送る手段が無いため、`formFields` / `parseForm` が理由付きで例外を投げます。
