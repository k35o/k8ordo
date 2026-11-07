---
'@k8ordo/framework': patch
---

staticモードのビルドが書く`client-files.json`に、ページごとのServer ComponentのCSSも並べるようにしました。先読みしていないページへ移るとき、これまではペイロードの最初の部分が届いてからServer ComponentのCSSを取り始め、ページの切り替えがその1往復を待っていました。今はペイロードと同時に、ペイロードと同じ優先度で取り始めます。ページはこれまでどおり、そのCSSが届いてから切り替わります。
