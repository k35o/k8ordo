---
"@k8ordo/ui": patch
---

ダークモードで、`primary-fg` / `secondary-fg` を `*-bg-emphasize` の上に置いたときのコントラストが 3.7:1 しかなく、大きい文字の AA しか満たしていなかったのを直しました。solid の `Button` と `IconButton`（primary / secondary）の hover と active がこの組み合わせです。

ダークの `primary-bg` / `secondary-bg` を 900、`primary-bg-emphasize` / `secondary-bg-emphasize` を 800 にし、それぞれ 1 段暗くしました（`*-bg-mute` と `*-bg` は同じ 900 になります）。文字の色は変えていません。これで `docs/references/color.md` のコントラストの表にある組み合わせは、ライトでもダークでも通常の文字で AA 以上になります。ダークの primary / secondary の solid ボタンや、チェック済みの `Checkbox`・`Switch` の地は少し暗く見えます。
