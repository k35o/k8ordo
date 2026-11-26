---
'@k8ordo/ui': patch
---

生成UIのカタログの`FormControl`に`value`（`defaultValue`）を足し、入力した値を形式の状態に結べるようにしました。これまでは値を部品の中だけで持っていたので、json-renderの`$bindState`、OpenUIのフォームの状態、A2UIのデータモデルのどれにも入らず、操作と一緒にアプリへ返せませんでした。描画側の`FormControl`も、`TextField`と同じく`value`と`setValue`を受け取ります。
