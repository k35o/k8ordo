---
'@k8ordo/ui': patch
---

docsのコンポーネントカタログに、制御された欄がhydrateの前の入力を`onChange`で受け取らないことを書きました。サーバーが描いたHTMLの欄はReactが付く前から打てますが、Reactは打たれた値を欄に残すだけで`onChange`を呼ばないので、`value`の元の状態は次のキー入力まで古いままです。`ref`で欄と状態を比べて拾う書き方を載せています。コンポーネントの動きは変えていません。Reactが同じ直し（hydrate時のchangeの送り直し）をexperimentalで持っていて、ここで別に直すと、それが入った版で`onChange`が2回呼ばれるためです。
