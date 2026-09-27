---
"@k8ordo/ui": patch
---

`Button` / `IconButton` の `onAction` が保留中のあいだ、押したボタンからフォーカスを外さないようにする。

これまでは保留中にネイティブの `disabled` を付けていたので、フォーカスを持ったボタンが無効になり、Chromium は描画の更新でフォーカスを `body` へ落としていた。キーボードで押した人は、処理が 1 フレームでも描画をまたぐと居場所を見失っていた。`type="submit"` の `Button` がフォームのアクションを待つあいだも同じだった。

- 保留中（`onAction` が返した Promise と、`type="submit"` のときのフォームのアクション）は `aria-busy` と `aria-disabled` を立て、押されてもクリックのハンドラが何もしない。ネイティブの `disabled` は付けないので、フォーカスはボタンに残る。入力欄の Enter による暗黙の送信も、既定のボタンへの click をハンドラが止めるので二重に送らない。
- 利用者が渡した `disabled` は、これまでどおりネイティブの `disabled` にする。
- `renderItem` の束（`ButtonRenderItemProps` / `IconButtonRenderItemProps`）の `disabled` は、利用者が渡した `disabled` だけを表すようになった。保留中も `false` のままで、保留は `aria-disabled` と `aria-busy` で表す。束を `<button>` にそのまま展開していれば同じ振る舞いになる。保留中の見た目を `disabled` から作っていたなら、`aria-disabled` を見るように変える。
