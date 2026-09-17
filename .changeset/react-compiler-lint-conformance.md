---
'@k8ordo/ui': minor
---

`Textarea` の `autoResize` と `PromptInput.Textarea` の高さ追従を、JS の実測から CSS の `field-sizing: content` に置き換えました。

`scrollHeight` を測って `style.height` を書いていたのは、中身に合わせて伸びるフォームコントロールを CSS が持っていなかった頃の代用です。Baseline に入った今はブラウザの仕事なので、`value` の変化を待つエフェクトも、内部 ref と利用者の ref の合成も要らなくなりました。

**`autoResize` を付けたときだけ `rows` が効かなくなります。** `field-sizing: content` の下で `rows` は無視されるので、空の `<Textarea autoResize />` はこれまでの 2 行ではなく 1 行の高さから始まり、入力に応じて伸びます。`autoResize` を付けない `Textarea` の `rows` はこれまでどおりです。`PromptInput.Textarea` は元から `rows={1}` と `min-h` で高さを決めていたため見た目は変わりません。

あわせて内部の作りを React Compiler の規則に合わせました。振る舞いは変わりません。
