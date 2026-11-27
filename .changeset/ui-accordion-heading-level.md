---
'@k8ordo/ui': major
---

`Accordion.Button`に必須の`level`（`'h2'`から`'h6'`、`Heading`と同じ語）を足し、その見出しの要素の中にボタンを描くようにしました。WAI-ARIAのアコーディオンは見出しの中にボタンを置く形ですが、これまでは見出しを呼び出し側が書いていて、同梱のドキュメントの例や生成UIのカタログが作るアコーディオンには見出しがありませんでした。見出しで移動する支援技術の利用者は、その項目にたどり着けませんでした。

```tsx
// これまで
<h3>
  <Accordion.Button>配送について</Accordion.Button>
</h3>
// これから
<Accordion.Button level="h3">配送について</Accordion.Button>
```

移行するときは、`Accordion.Button`を包んでいた見出しを外し、その階層を`level`に渡します。包んだまま`level`を足すと、見出しの中に見出しができてしまいます。
