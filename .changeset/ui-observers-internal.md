---
'@k8ordo/ui': major
---

`InView`と`Resize`の公開をやめました。子要素を観測するだけで何も描かない部品で、ライブラリの中で使うのは`Conversation`だけでした。UIの部品としての理由を持たない汎用の道具なので、`cn`や`mergeRefs`の公開をやめたときと同じ基準で外しました。

移行するときは、React 19のrefのコールバックと後始末で`IntersectionObserver`や`ResizeObserver`を自分で張るか、観測のためのライブラリを使ってください。
