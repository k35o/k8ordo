---
"@k8ordo/ui": major
---

`ScrollLinked` を削除しました。

スクロール進捗バーは CSS のスクロール駆動アニメーション（`animation-timeline: scroll()`）で描いていましたが、これは Baseline に入っておらず（Firefox が未対応）、未対応ブラウザ向けに scroll リスナーと `ResizeObserver` で同じ見た目を再現する分岐を持っていました。Baseline に入っていない機能を、対応ブラウザでだけ効く磨きとしても使わず、機能判定で分岐するコードも置かない、という方針に合わせて部品ごと外します。

`ScrollLinked` の export、json-render のカタログと OpenUI のライブラリの `ScrollLinked` 項目、スタイルシートの `.ao-scroll-progress` を削除しました。生成 UI のシステムプロンプトからもこの部品が消えます。
