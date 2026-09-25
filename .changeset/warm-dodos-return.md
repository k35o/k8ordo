---
"@k8ordo/ui": patch
---

部品の hover / active を、不透明度修飾子（`/80` など）ではなくセマンティックトークンで塗る。ビルド済みの `styles.css` から、Tailwind が不透明度修飾子のために出していた `@supports (color: color-mix(in lab, red, red))` の分岐が 16 個なくなる。

- `Button` / `IconButton` の solid の primary・secondary は、hover も active も `*-bg-emphasize` にした（これまで hover は `*-bg-emphasize` の 80%）。
- `Button` の solid の base は、hover を `bg-mute`、active を `bg-emphasize` にした（これまで hover は `bg-mute` の 80%、active は `bg-mute`）。
- interactive な `Badge` の solid のステータス色（info・success・warning・error）は、hover も active も地を `bg-base` にした（これまで地の色の 80%・60%）。outline は hover も active も `bg-{tone}` にした（これまで active は 80%）。
- 無効な `PasswordInput` の表示切り替えボタンは、アイコンを `fg-subtle` にした（これまで `fg-mute` の 70%）。
- `docs/references/color.md` のコントラストの表に、`fg-base` on `bg-mute`（AAA）と `fg-base` on `bg-emphasize`（AA）を足した。
