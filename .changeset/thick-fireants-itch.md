---
"@k8ordo/ui": minor
---

`CopyButton` を追加しました。テキストをクリップボードにコピーし、コピーしたことを見た目と読み上げの両方で伝えるボタンです。削除した `useClipboard` で組み立てていたコピーのボタンは、これに置き換えられます。

```tsx
<CopyButton value={css} label="CSS をコピー" size="sm" />
<CopyButton value={code} label="コードをコピー" iconOnly size="sm" />
<CopyButton
  label="Markdown をコピー"
  value={async () => (await fetch(`/blog/${slug}.md`)).text()}
/>
```

- 既定は outline の `Button` に `label` を文字で出します。`iconOnly` を付けると透明な `IconButton` になり、`label` はツールチップとアクセシブルネームになります。`label` を省くと辞書の `copy`（「コピー」/「Copy」）です。
- 押すとアイコンが 2 秒間チェックに変わり（失敗したらエラーのアイコン）、隣のライブリージョン（`role="status"`）が `copied` / `copyFailed` を読み上げます。ボタンの名前は変えません。結果を見せている間に押し直しても、読み上げ直します。
- `value` には関数も渡せ、`Promise` を返してもかまいません。押したときに呼び、`Promise` はそのまま `ClipboardItem` に渡すので、中身が後から届いても書き込みはクリックの中で始まります（Safari は `await` の後に始めた書き込みを拒みます）。
- 辞書に `copy` / `copied` / `copyFailed` を足しました。独自の辞書を丸ごと渡している場合は、この 3 つを足してください。
- json-render のカタログと OpenUI のライブラリにも `CopyButton` を載せました（`value` / `label` / `iconOnly` / `size`）。
