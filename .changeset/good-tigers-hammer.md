---
"@k8ordo/state": patch
---

url の真偽値を、そのフィールドのスキーマ自身の綴りで書くようになりました。これまでは常に `"true"` / `"false"` と書いていたため、`z.stringbool({ truthy: ['yes'], falsy: ['no'] })` のように綴りを指定したフィールドは、`update()` や `href` で書いた値を読み返せず既定値に落ちていました。`@k8ordo/form` が同じフィールドから導くチェックボックスの `value` とも一致します。
