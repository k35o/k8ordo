---
'@k8ordo/ui': minor
---

`FormControl`と`Form`から`'use client'`を外しました。どちらもServer Componentとして描け、`renderInput`は`FormControl`を描いたところで動きます。`useForm`を使わず、Server Actionに送る非制御の入力欄だけのフォームなら、Server Componentに書けます。

これまでは`FormControl`がClient Componentだったので、Server Componentから`renderInput`を渡すと、関数はClient Componentに渡せないというエラーになっていました。`FormControl`が使うhookは`useId`だけで、`Form`はhookを使いません。呼び出し側で変えることはありません。
