---
"@k8ordo/ui": minor
---

`SideNav` と `TableOfContents` を追加しました。

- `SideNav.Root` / `SideNav.Group` / `SideNav.Link`: 見出しごとにまとめたリンクで、今のページ（`current`）を傍線と `aria-current="page"` で示すサイドナビです。ルーターのリンクへは `renderAnchor` で要素ごと差し替えます（束には `href`・`className`・`children`・`aria-current` と渡した属性がすべて入ります）。Server Component から描けます。
- `TableOfContents`: `{ id, label, children? }` の木で渡した見出しの目次で、今読んでいる見出しを `aria-current="location"` で示します。見出しの `scroll-margin-block-start` を読み取り位置にするので、目次から飛んだ見出しがそのまま今の見出しになり、文書の終わりでは最後の見出しになります。縦書きの文書では右から左へ読む向きで決めます。
- 生成 UI のカタログ（json-render と OpenUI）に `SideNav` を加えました。`TableOfContents` は spec の見出しが id を持たないので載せていません。
- 文言辞書に `tableOfContents` を加えました。
