---
"@k8ordo/server": patch
---

`cookies().set` の `secure` の既定を、素の HTTP でこの機械（`localhost`・`127.0.0.1`・`[::1]`）に届いたリクエストでは `false` にする。Safari はそこで `Secure` の Cookie を捨てるので、Safari で開発している間は Server Action や guard が書いた Cookie が 1 つも残らなかった（Chromium と Firefox は保つ）。HTTPS と、それ以外のホストへの HTTP では従来どおり `Secure` を付ける。`sameSite: 'none'` はどこでも `Secure` のまま。
