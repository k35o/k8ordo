---
"@k8ordo/state": patch
---

cookie の置き場所の文書を直す。Cookie Store API は必ず `Secure` を付け、Safari は `http://localhost` でもそれを捨てるので、「HTTPS か localhost で動かす」は Safari では成り立たなかった。Safari で永続化を確かめるなら開発中も HTTPS で配る、と書く。
