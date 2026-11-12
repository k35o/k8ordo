---
'@k8ordo/state': minor
---

テスト用の入口`@k8ordo/state/testing`と、その`mountPageUrl()`を足しました。URLやフラグメントを書く`update()`は、どのリスナーも横取りしなければ文書の読み込みになり、テストを動かしているページごと移動します。`mountPageUrl()`は`@k8ordo/router`と同じ条件でルーターの代わりに横取りし、`{ search, hash }`でテストを始めるURLを決めます。返す関数は後始末で、`resetStateRegistry()`を呼んで待っている書き込みごとストアを消し、URLと履歴エントリの状態を元に戻します。Vitestの`beforeEach`にもStorybookの`beforeEach`にも、そのまま返せます。これまでは、横取りするリスナーと後始末をテストごとに手で書く必要がありました。
