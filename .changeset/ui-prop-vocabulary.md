---
'@k8ordo/ui': major
---

名前が語彙表から外れていたpropsを、ほかの部品と同じ名前にそろえました。

- `CommandPalette`と`Pagination`の`aria-label`を`label`にしました。省くと、これまでどおり組み込みの文言が名前になります。名前を表すpropは、ほかの部品と同じく`label`です
- `CommandPaletteItem`の`onSelect`を`onAction`にしました。`DropdownMenu.Item`と`ContextMenu.Item`の`onAction`と同じく、項目を選んだときに引数なしで呼びます
- `Tree`の`onExpandedChange`を`onExpandedIdsChange`にし、渡す配列を`readonly string[]`から新しい`string[]`にしました。主の状態の知らせは`onChange`、ほかの状態は`expandedIds`なら`onExpandedIdsChange`のようにpropの名前から付けます。受け取る配列は`readonly`、知らせる配列は新しい`string[]`なので、`useState<string[]>`のsetterをそのまま渡せます

移行するときは、`aria-label`を`label`に、`onSelect`を`onAction`に、`onExpandedChange`を`onExpandedIdsChange`に書き換えます。
