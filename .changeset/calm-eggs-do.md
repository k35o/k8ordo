---
"@k8ordo/ui": none
---

`Modal` の内部で、閉じたときに制御モードでだけ使わない state を書いていた逆の分岐を消しました。非制御の開閉は `MutationObserver` が `<dialog>` の `open` から合わせているので、挙動は変わりません。
