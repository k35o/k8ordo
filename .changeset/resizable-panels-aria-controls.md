---
"@k8ordo/ui": patch
---

`ResizablePanels`の仕切りの`aria-controls`は、1枚目のパネルが描かれた後に付くようになりました。サーバーのHTMLには含まれませんが、仕切りはhydrateするまで動かないので操作には影響しません。
