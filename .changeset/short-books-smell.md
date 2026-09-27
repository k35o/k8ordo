---
"@k8ordo/ui": patch
---

`Button` / `IconButton` をキーボードで押すと、`onAction` の保留中にフォーカスが `body` へ落ち、終わっても戻らなかったのを直しました。保留中はネイティブの `disabled` ではなく `aria-disabled`（と `aria-busy`）で押せなくするので、押したボタンは待っている間も終わったあともフォーカスを持ったままです。`type="submit"` の `Button` が属する form の送信中、`IconButton` が属する form の送信中も同じです。

- 保留中の押下は、これまでどおり受け付けません。`type="submit"` の `Button` では、送信中にテキスト欄で Enter を押しても二度目は送られません（暗黙の送信は既定のボタンへの click として届き、それをボタンが断ります）。
- `renderItem` に渡す束の `disabled` は、呼び出し側が渡した `disabled` だけになりました。保留中は `aria-disabled` と `aria-busy` だけが立ちます。束を `<button>` に展開していれば、既定の要素と同じくフォーカスが残ります。
- 呼び出し側が渡す `disabled` は、これまでどおりネイティブの `disabled` です。
