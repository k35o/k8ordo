---
'@k8ordo/ui': patch
---

`Radio`で`name`を省いたときの名前を、`aria-labelledby`のidから`useId`で作る名前に変えました。これまでは見出しのidをそのまま`name`にしていたので、`FormControl`の`labelAs="group"`で包むと見出しのidが送信のキーになりました。同じ見出しを指す`Radio`が2つあると、ブラウザが2つを1つのグループとして扱い、別々のグループの選択が互いに外れていました。`RadioCard`はすでに`useId`で名前を作っていて、これにそろえました。フォームで値を送るときは、これまでどおり`name`を渡してください。
