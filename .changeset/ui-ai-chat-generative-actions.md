---
'@k8ordo/ui': patch
---

AIチャットの参照の「Combining with generative UI」を書き直しました。モデルがツールで画面を出し、チャットがそのツールのパートを描く書き方と、画面で押した操作を`data`のパートで次の発言として送り、サーバーで`convertDataPart`を使ってモデルが読む文に変える書き方です。あわせて、AI SDKとつなぐ例から、`data-ui`のパートでjson-renderの画面を描く部分を外しました。
