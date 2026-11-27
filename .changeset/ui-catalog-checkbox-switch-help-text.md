---
'@k8ordo/ui': minor
---

生成UIのカタログの`Checkbox`と`Switch`に、任意の`helpText`を足しました。`Checkbox`と`Switch`のコンポーネントが自分で欄の下に描き、入力の説明として読み上げられます。ほかの入力欄の`helpText`と同じ扱いです。どちらもスキーマの末尾に足したので、OpenUI Langの位置引数では、`Checkbox`は`disabled`の次、`Switch`は`required`の次が`helpText`です。
