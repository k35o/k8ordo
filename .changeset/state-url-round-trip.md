---
'@k8ordo/state': patch
---

url スロットの値を「戻ってくる道」で正規化する。`update()` の echo が
typed な値をそのままスキーマに渡していたため、`string → boolean` のような
一方向の綴りは自分の出力を読めず、既定値に落ちていた。あわせて、URL に
書けない綴りを定義時に拒む（配列の既定値は `[]` のみ、boolean は
`z.stringbool()` のみ）。
