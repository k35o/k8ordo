---
"@k8ordo/ui": patch
---

色が移り変わる部品のイージングを、ガイドが推奨する `transition-colors duration-150 ease-out` にそろえる。

これまでは AI チャットの部品と `SideNav`・`TableOfContents` だけが `ease-out`（`cubic-bezier(0, 0, 0.2, 1)`）で、`Button`・`IconButton`・`Checkbox`・`Radio`・`Switch`・`Tabs`・`Anchor`・`Breadcrumb`・`ListBox` などほかの 23 の部品は Tailwind の既定（`cubic-bezier(0.4, 0, 0.2, 1)`）で色を変えていた。長さは 150ms のままで、変わるのは加速の付き方だけ。

`docs/` のコード例（`interaction-design.md`・`color.md`・`GUIDE.md`）も、素の `transition-colors` から表と同じ形に直した。
