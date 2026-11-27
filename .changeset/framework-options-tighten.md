---
'@k8ordo/framework': major
---

`framework()`の`routesDir`をなくし、ルートのファイルは常に`src/routes/`に置くようにしました。`src/i18n.ts`の場所も、`src/components/`と`src/lib/`の置き場の決まりも`src/`の下で決め打ちで、`routesDir`だけを動かすと`src/i18n.ts`との位置関係が崩れていました。

あわせて、`framework()`はそのモードが受け取らないキーを、受け取るキーを挙げて断るようにしました。`mode: 'static'`なら`mode`、`reactCompiler`、`headers`、`site`、`csp`、`mode: 'server'`なら`mode`、`reactCompiler`、`headers`です。型の検査を通らない`vite.config.js`では、`sites`や`reactcompiler`と書き違えたキーが黙って無視されていました。これまで3.0.0で消した`paths`だけを名指しで断っていましたが、その専用のエラーもこの規則にまとめました。

移行: `routesDir`を渡しているアプリは、ルートのファイルを`src/routes/`に移してから`routesDir`を消してください。エラーは`framework() takes no routesDir — under mode: 'static' it takes mode, reactCompiler, headers, site, csp`の形です。
