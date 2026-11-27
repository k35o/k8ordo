---
'@k8ordo/ui': major
---

生成UIのカタログから`DateField`をなくしました。`DateField`コンポーネントはなくなり、カタログの`DateField`は`TextField`を`type="date"`で描いていただけでした。日付の欄を書く項目が2つあり、カレンダーを開ける`DatePicker`と、propsも並びも同じでした。

移行するときは、保存したspecやプロンプトの`DateField`を`DatePicker`に書き換えます。props（`name`、`label`、`defaultValue`、`min`、`max`、`invalid`、`disabled`、`required`）もOpenUI Langの位置引数の並びも同じなので、名前を替えるだけで移れます。カレンダーの要らない欄は、`TextField`に`type: 'date'`を書いても描けます。こちらは`min`、`max`、`required`を持ちません。
