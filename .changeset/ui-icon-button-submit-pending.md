---
'@k8ordo/ui': minor
---

`IconButton`が`type`（`'button'`、`'submit'`、`'reset'`）を受け取るようになりました。既定は`'button'`です。属するフォームの送信中に保留になるのは、`type="submit"`のときだけにしました。これまでの`IconButton`は、送信中のフォームの中にあると、送信ボタンでなくても`aria-busy`と`aria-disabled`が付き、押しても何もしませんでした。
