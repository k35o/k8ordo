---
'@k8ordo/form': major
---

`FormFields`と`UseFormReturn`の型引数を、スキーマか`defineForm`の定義の1つにしました。Client Componentのpropsは`fields: FormFields<typeof talkSchema>`と書きます。`formFields(talkSchema)`が返す型と同じで、`form.field()`に渡せるパスと各欄の`input`の型はスキーマから決まります。スキーマは`import type`で読めば、zodはバンドルに入りません。定義を渡したときも`FormFields<typeof signup>`と書けます。

これまでは`FormFields<'title' | 'eventUrl', never>`のように、パスの集まりを位置引数で手書きしていました。スキーマの写しなので欄を足すたびに直す必要があり、3つ目の型引数（`z.stringbool()`の欄）を書き忘れると`input.value`が型から消え、2つ目を省くと`array()`のパスの誤りが通っていました。

移行するときは、手書きの型引数をスキーマか定義の型に置き換えます。

- `FormFields<'title' | 'eventUrl', never>` → `FormFields<typeof talkSchema>`
- `UseFormReturn<'title', never>` → `UseFormReturn<typeof talkSchema>`
- 1つの欄だけを描く子のコンポーネントは、`form.field('title')`が返す`FieldView`を受け取ります。
- フォームを包む汎用のコードは、`<Source extends ObjectSchema | FormDefinition>`を型引数にして`FormFields<Source>`と`UseFormReturn<Source>`を使います。`ObjectSchema`と`FormDefinition`は、`@k8ordo/form`と`@k8ordo/form/server`のどちらからも型をimportできます。
