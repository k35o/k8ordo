---
"@k8ordo/ui": minor
---

コマンドパレット `CommandPalette` を追加しました。`Modal` の中に検索欄とコマンドの一覧を置き、打った文字で `label` と `keywords` を大文字小文字を区別せずに絞り込みます。`↓` / `↑` で移り（端で反対側へ回る）、`Enter` かクリックでパレットを閉じてから項目の `onSelect` を呼びます。フォーカスは検索欄に置いたまま `aria-activedescendant` で項目を指します。同じ `group` の項目は見出し付きの group にまとめ、`shortcut` のキーは `Kbd` で添えます。開くたびに空の検索から始まり、開閉は `Modal` と同じく `isOpen` / `defaultOpen` / `onClose` です（⌘K などのキーはアプリが配線します）。辞書に `commandPalette` / `commandPaletteSearch` / `commandPaletteEmpty` を足しました。項目が関数を持つため、生成 UI のカタログには載せていません。
