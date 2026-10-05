---
"@k8ordo/ui": minor
---

`CodeBlock` を `@k8ordo/ui/code-block` に追加しました。サーバーで shiki を使ってハイライトし、コピーボタンを添えて描く async の Server Component です。

- `server-only` を import しているので、shiki はブラウザに届かず、Client Component から読み込むとビルドが止まります。コピーボタンだけがクライアントのモジュールです。
- 見た目は k8o のブログのコードブロックと同じです。面は `bg-surface` の 1 枚で外枠の線は無く、言語名（`title` があればファイル名）を面の上に小さなラベルで出し、コピーボタンを右上に重ねます。構文の色はライトが shiki の `one-light`、ダークが `plastic` をそのまま使い、`light-dark()` で書くので `.dark` が切り替える `color-scheme` に追従します。コメントなど、面に対して 4.5:1 に届かない色もブログと同じです。
- `lang` は shiki が同梱する言語名で、知らない名前は色を付けずに描きます（Markdown のフェンスの言語名をそのまま渡せます）。`title` を渡すとラベルに表示します（figure の figcaption）。
- `marks` で行に `highlight` / `add`（`＋`）/ `remove`（`－`）の印（状態のトークンの帯と地）を、`callouts` で行の直後に注記（配列なら複数、その行の字下げに揃う）を付けます。注記はブログと同じく、指す行を上向きの三角で指す `fg-info` の吹き出しで、指された行には info の帯が付きます。コピーされるのは `code` そのものです。
- `shiki` と `server-only` を `dependencies` に加えました（shiki のオブジェクトはパッケージの外に出ないので、peer にはしていません）。
- 文言辞書に `codeBlockCopy` を加えました（コピーの結果の読み上げは `CopyButton` と同じ `copied` / `copyFailed`）。
