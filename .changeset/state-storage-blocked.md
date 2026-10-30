---
'@k8ordo/state': patch
'@k8ordo/color-scheme': patch
---

サイトのデータの保存を止めたブラウザで、`defineLocalState`と`defineSessionState`を使うページがエラーになるのを直しました。

- このブラウザでは、`localStorage`と`sessionStorage`を読むと`SecurityError`になります。このエラーでページの描画が止まり、`@k8ordo/color-scheme`の`ColorSchemeProvider`を置いたアプリでは、どのページもエラー画面になっていました。
- これからは既定値で描画します。`update()`で変えた値は次に読み込むまでメモリに残り、ハンドルはそのエラーでrejectします。
- `getItem`がエラーになったときも、描画は既定値で続きます。`storage`イベントでは表示中の値を保ちます。`update()`は何も書かずにrejectするので、読めなかったフィールドは消えません。
