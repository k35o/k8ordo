---
'@k8ordo/ui': major
---

`CheckboxGroup`を、`options`を受け取る1つのコンポーネントにしました。`CheckboxGroup.Root`と`CheckboxGroup.Item`はなくなり、`<CheckboxGroup aria-labelledby name options value defaultValue onChange invalid disabled />`と書きます。`options`は`Radio`と同じ`{ value, label }`の配列です。これまでは選択肢の部品のうち`CheckboxGroup`だけが子要素で選択肢を並べ、`Checkbox`はグループの中にいるかどうかで`checked`や`name`の扱いを変え、`itemValue`が無ければエラーになっていました。呼び出し側はどこも配列を`CheckboxGroup.Item`に写しているだけでした。

```tsx
// これまで
<CheckboxGroup.Root aria-labelledby={id} name="tags" onChange={setTags} value={tags}>
  {TAGS.map((tag) => (
    <CheckboxGroup.Item itemValue={tag.value} key={tag.value} label={tag.label} />
  ))}
</CheckboxGroup.Root>
// これから
<CheckboxGroup aria-labelledby={id} name="tags" onChange={setTags} options={TAGS} value={tags} />
```

`name`は省けるようになり、省いたときは何も補いません。`name`の無いボックスは送信されないので、画面を切り替えるだけのグループはフォームの中に置いても値を送りません。`DataTable`の列メニューは`name`を渡さなくなり、フォームの中に置いても列の`id`を送らなくなりました。`value`と`defaultValue`は`readonly string[]`も受け取り、`onChange`には選択肢の順に並べた新しい`string[]`を渡します。選択はこれまでどおり各ボックスの`checked`から読むので、フォームをリセットしても取り残されません。`CheckboxCard`も同じ読み方をします。

移行するときは、次のように書き換えます。

- `<CheckboxGroup.Root>`の中の`<CheckboxGroup.Item itemValue label />`や`<Checkbox itemValue label />`を、`options`の`{ value, label }`にする
- `CheckboxGroup.Root`のpropsは、そのまま`CheckboxGroup`に渡す。送信するグループには、これまでどおり`name`を渡す
- 項目ごとの`disabled`、`indeterminate`、`labelHidden`は渡せなくなった。グループ全体の`disabled`を使う
- `ComponentProps<typeof CheckboxGroup.Root>`のような型は`ComponentProps<typeof CheckboxGroup>`にする
