---
"@k8ordo/ui": minor
---

OS で選ぶ `prefers-contrast: more` と `forced-colors: active` に、トークンと部品が従うようにしました。どちらも OS の設定なので、アプリが切り替えたり保存したりするものはありません（`@k8ordo/color-scheme` は変わりません）。

- **高コントラスト（`prefers-contrast: more`）**: 文字と線のトークンを、ライトでもダークでも地の色から一段遠ざけます。ページ・カード・各ステータスの地の上の文字は AAA に、線は 3:1 以上になります。ダークでは `bg-emphasize` と `primary-bg*` / `secondary-bg*` も一段暗くします。値の一覧は `docs/references/color.md` にあります。
- **影だけで縁取っていた面に線**: `Card`（`shadow`）・`Modal` / `Drawer`・`Dialog`・`Alert` / `Toast`・ユーザーの `Message`、`Switch` の軌道とつまみ、`Slider` と `Progress` の軌道に、高コントラストと強制カラーのときだけ内側の線（`border-base`）を引きます。寸法は変わりません。
- **強制カラーで崩れていた部品を直しました**: `Switch`・`Slider`・`Progress`・`Separator`・`Skeleton` は消え、`Tabs` の選択中の印、`Radio` / `RadioCard` の点、`Autocomplete` の選択中の候補は見えず、`Code` の色見本は空になっていました。選択状態は `Highlight` / `CanvasText` で描き、色見本は実際の色のまま残します。
- **未選択の `CheckboxCard` が、強制カラーでは選択済みに見えていたのを直しました**: チェックを透明色で隠していたため、強制カラーで塗られていました。
- `DropdownMenu` と `ListBox` の項目、`Autocomplete` のハイライト中の候補は、高コントラストでは地の色に加えて 2px の線でフォーカスを示します。

トークンを上書きしている場合、高コントラストの値は `@media (prefers-contrast: more)` の中の `:root` と `.dark` で再定義してください。ライブラリの高コントラストの規則は `:root` と同じ詳細度なので、あとから読み込む `:root` の上書きがこれまでどおり勝ちます。
