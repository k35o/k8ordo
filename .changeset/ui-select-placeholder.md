---
'@k8ordo/ui': minor
---

`Select`に`placeholder`を足しました。渡すと、値が空文字（`''`）の選択肢を先頭に置き、その表示名にします。空の選択肢が無い`<select>`はいつもどれかが選ばれているので、`required`を効かせるには、これまで`options`の先頭に`{ value: '', label: '…' }`を手で書く必要がありました。`Radio`や`RadioCard`には要らない、`Select`だけの書き方でした。この選択肢は選べるので、任意の欄は未選択に戻せます。`@k8ordo/form`の`parseForm`は`''`を未選択として読むので、必須のenumではエラーになり、任意のenumでは`undefined`になります。

```tsx
// これまで
<Select options={[{ value: '', label: '選んでください' }, ...plans]} required />
// これから
<Select options={plans} placeholder="選んでください" required />
```
