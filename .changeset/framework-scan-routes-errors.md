---
'@k8ordo/framework': patch
---

ルート表の生成が、読めなかったものを空として扱わないようにしました。`src/routes/`が無いと、これまでは空の表のまま生成とビルドが通り、すべてのURLが404になるだけでした。今は`the route files live in src/routes/, and … does not exist`のエラーで止まります。読めないルートファイルを「何もexportしないファイル」として扱って`paramsSchema`や`search`を黙って抜かすこと、JSONとして読めない`package.json`を「依存に何も無い」として扱って`@k8ordo/state`や`@k8ordo/i18n`の`Register`の生成を黙って省くこともやめ、どちらもエラーにします。
