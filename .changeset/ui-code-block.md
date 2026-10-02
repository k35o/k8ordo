---
"@k8ordo/ui": minor
---

`CodeBlock` を `@k8ordo/ui/code-block` に追加しました。サーバーで shiki を使ってハイライトし、コピーボタンを添えて描く async の Server Component です。

- `server-only` を import しているので、shiki はブラウザに届かず、Client Component から読み込むとビルドが止まります。コピーボタンだけがクライアントのモジュールです。
- 色はトークンではなく固定の値で、k8o のブログのコードブロックに合わせています。ライトは shiki の `one-light`、ダークは `plastic` をそのまま使います。コメントなど、地に対して 4.5:1 に届かない色もブログと同じです。色は `light-dark()` で書くので、`.dark` が切り替える `color-scheme` に追従します。外枠の線は無く、見出しの行（言語名かファイル名とコピーボタン）は線ではなく地の段差でコードと分けます。
- `lang` は shiki が同梱する言語名で、知らない名前は色を付けずに描きます（Markdown のフェンスの言語名をそのまま渡せます）。`title` を渡すと見出しの行に表示します（figure の figcaption）。
- `marks` で行に `highlight` / `add`（`+`）/ `remove`（`−`）の印を、`callouts` で行の直後に注記（配列なら複数、その行の字下げに揃う）を付けます。コピーされるのは `code` そのものです。
- `shiki` と `server-only` を `dependencies` に加えました（shiki のオブジェクトはパッケージの外に出ないので、peer にはしていません）。
- 文言辞書に `codeBlockCopy` を加えました（コピーの結果の読み上げは `CopyButton` と同じ `copied` / `copyFailed`）。
