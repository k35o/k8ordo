---
"@k8ordo/ui": minor
---

`Tree` を追加しました。枝を開閉できる階層（ファイルとフォルダー、目次の木など）で、WAI-ARIA の tree のキーボード操作に従います。

- 項目は `{ id, label, icon?, children? }` の木で渡します。開いている枝（`expandedIds` / `defaultExpandedIds` / `onExpandedChange`）と選択（`selectedId` / `defaultSelectedId` / `onChange`）は、制御でも非制御でも使えます。
- 上下で見えている項目を移り、右で枝を開いて最初の子へ、左で枝を閉じて親へ戻ります。Home / End、Enter / Space での選択、先頭の文字での移動もできます。Tab で入るのは 1 つだけ（roving tabindex）です。
- 縦書きでは項目が右から左へ並ぶので、左右で項目を移り、上下で開閉します。
- 生成 UI のカタログ（json-render と OpenUI）に、平らな一覧（親は `parentId` で指す）で受ける `Tree` を加えました。
