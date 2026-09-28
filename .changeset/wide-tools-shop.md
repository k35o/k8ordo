---
"@k8ordo/ui": patch
---

`FileField.Dropzone` がファイルを運ぶドラッグにだけ反応するようにする。これまではページ内の文字の選択範囲やリンクをドラッグしても枠が光り（`data-dragging`）、コピーのカーソルを出していたが、落としても何も起きなかった。`PromptInput` と同じく、ファイルを運ばないドラッグは `dragenter` / `dragleave` / `dragover` / `drop` とも素通しにする。無効のときも、ファイルのドラッグは従来どおり既定の動作を止め、ブラウザがファイルを開いてページを離れないようにする。

あわせて、ドラッグ中に枠と地の色が移り変わる動きを `PromptInput` と同じ `transition-colors duration-150 ease-out` に揃えた（長さは 150ms のままで、加速の付き方だけが変わる）。
