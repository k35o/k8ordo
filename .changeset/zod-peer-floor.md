---
'@k8ordo/color-scheme': patch
'@k8ordo/form': patch
'@k8ordo/state': patch
'@k8ordo/ui': patch
---

peerの`zod`の下限を`^4.4.3`から`^4.6.6`に上げました。4.6.5以前の`zod`は、大きな配列を渡されると要素ごとの検証エラーをすべて積み上げ、メモリを使い果たすおそれがあります（[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)）。フォームの送信やURLのように外から来た値をスキーマで検証するので、修正の入った4.6.6を下限にしました。
