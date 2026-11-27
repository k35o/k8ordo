---
'@k8ordo/form': patch
---

`formFields`、`parseForm`、`useForm`が投げる例外、`console.warn`の文、`dropped[].reason`の文を英語にしました。例外と`console.warn`の文の頭には、呼び出したAPIの名前を付けました（`formFields: 'n': form values arrive as strings, …`）。これまではformだけが日本語で、`[@k8ordo/form]`を頭に付けていました。ほかの`@k8ordo/*`パッケージは英語で書いており、英語のドキュメントを読むエージェントや日本語を読まない利用者は、エラーと`dropped`の理由だけを別の言葉で受け取っていました。

型は変わりません。例外の文や`dropped[].reason`の文字列と比べているテストや表示は、新しい文に合わせてください。
