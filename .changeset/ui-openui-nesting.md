---
'@k8ordo/ui': minor
---

OpenUI のコンテナを、互いに自由に入れ子にできるようにしました。

これまで `Stack` / `Grid` の子には `Stack` / `Grid` / `Card` を置けず、`Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover` は `Stack` / `Grid` を子に持てても、どのコンポーネントの子にも挙がっていませんでした。プロンプトは `root = Stack(...)` を求めるので、この 6 つは LLM から使う場所がありませんでした。しかも `Stack` の説明は「入れ子のレイアウトは Card の中に Stack / Grid を置く」と、置けない Card を使うよう指示しており、プロンプト自身と矛盾していました。

- 8 つのコンテナ（`Stack` / `Grid` / `Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover`）の `children` に、葉のコンポーネントと 8 つのコンテナをすべて並べました。json-render と同じく、どの組み合わせでも入れ子にできます。
- `prompt()` が生成するシグネチャが変わります。`Stack` / `Grid` の「直下に Stack/Grid/Card は置けない」という説明と、`Card` の「Stack や Grid も入れられる」という説明は消しました。
- パーサは `children` に入るコンポーネントを検査しないので、描画の挙動は変わりません。
