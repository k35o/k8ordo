---
'@k8ordo/framework': patch
---

クライアントのランタイムが、画面に出した木ごとに、その木を当てたpathnameを`@k8ordo/state`に知らせるようにしました。次のページの読み込み中に画面に残るページのページの状態が、次のページのURLの値で描かれなくなります。Server Actionの答えと`vite dev`での読み込み直しで当てた木も、それぞれ送ったURLと読み込んだURLのpathnameを持ちます。
