---
'@k8ordo/ui': major
---

`@k8ordo/ui/i18n`から`messageUsage`をなくしました。組み込みの文言のキーごとに、どの部品が描くかの表を実行時の値として公開していましたが、読んでいたのはドキュメントサイトの1ページだけでした。同じ表は、`@k8ordo/ui/props.json`の`messages`（`{ key, usedBy }`の配列）と、同梱の`docs/references/components.md`のキーの一覧にあります。`messageUsage`を読んでいたら、`@k8ordo/ui/props.json`の`messages`を読むように書き換えてください。
