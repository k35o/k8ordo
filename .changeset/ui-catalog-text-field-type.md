---
'@k8ordo/ui': minor
---

生成UIのカタログの`TextField`に`type`を足しました。`TextField`コンポーネントが1行の欄として描く種類（`text`、`email`、`tel`、`url`、`search`、`date`、`time`、`datetime-local`、`month`、`week`）だけを受け取り、省くと`text`です。パスワードは`PasswordInput`、数は`NumberField`の項目が描くので、`password`と`number`は受け取りません。これまでカタログの`TextField`はいつも`type="text"`で、メールアドレスやURLの欄でも、その種類のキーボードや入力の補助が出ませんでした。OpenUI Langの位置引数では、`readOnly`の次が`type`です。

日付や時刻の`type`では、`defaultValue`がその種類の入力欄の書式に合うかを確かめます。`date`は暦にある日の`YYYY-MM-DD`、`time`は`HH:MM`か`HH:MM:SS`、`datetime-local`は秒を省ける`YYYY-MM-DDTHH:MM`、`month`は`YYYY-MM`、`week`は`YYYY-Www`です。`catalogPropIssues`は、合わない値を`TextField.defaultValue: Expected YYYY-MM-DD for type "date", received "2026/11/27"`の形で、ほかのpropの誤りと一緒に返します。`DatePicker`と同じく、書式の違う日付は描く前に弾きます。

`catalog.TextField.props`は、この検査を持つzodのスキーマになりました。`.omit()`、`.pick()`、`.partial()`と、すでにあるキーを置き換える`.extend()`はエラーになります。このスキーマから別のスキーマを作るときは、`.safeExtend()`で作ります。この検査はJSON Schemaには出ません。
