---
'@k8ordo/ui': minor
---

`@openuidev/lang-core`と`@openuidev/react-lang`のpeerの範囲を、0.3系から1系（`^1.0.0`）に移しました。OpenUI Lang 1.0は1つのアクションを`Action([...])`で包まずに書くなど、プロンプトと描画の両方が0.x系と食い違うので、2つのパッケージを一緒に1系へ上げ、プロンプトを生成するサーバー側もそろえてください。`@k8ordo/ui/openui`と`@k8ordo/ui/openui/prompt`の使い方は変わりません。
