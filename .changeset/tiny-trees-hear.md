---
"@k8ordo/ui": minor
---

`Toolbar` と `ContextMenu` を追加しました。`Toolbar` は WAI-ARIA の toolbar で、Tab で入れるのは 1 つだけ、中は矢印キー（縦書きでは見た目の向きに合わせた対）と `Home` / `End` で移り、無効な項目は飛ばします。各項目は `Toolbar.Item` の `renderItem` が渡す `ref` / `tabIndex` / `onFocus` を `Button` や `IconButton` に広げて作り、`aria-pressed` の項目は地を濃くして見せます。`ContextMenu` は右クリック（または Shift+F10・コンテキストメニューキー）した位置に開くメニューで、中身は `DropdownMenu` と同じ `Content` / `Item` / `SubMenu` を使います。閉じると開く前にいた要素へフォーカスを戻します。`Toolbar` は json-render と OpenUI のカタログに載せ、`ContextMenu` は右クリックという見えない操作で開くので理由付きで除外しました。
