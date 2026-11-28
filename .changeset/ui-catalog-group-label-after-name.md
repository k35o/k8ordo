---
'@k8ordo/ui': major
---

生成UIのカタログの`CheckboxGroup`と`CheckboxCard`で、`label`を`name`の直後に移しました。ほかの入力欄はどれも`label`を`name`の直後に持ち、この2つだけが末尾に置いていました。`label`を書く位置が項目ごとに違うと、OpenUI Langの位置引数でモデルが書き間違えます。

OpenUI Langの位置引数は次の並びになります。名前で書く形式（json-render、A2UI）には影響しません。

- `CheckboxGroup(name, label, options, defaultValue, helpText)`
- `CheckboxCard(name, label, options, defaultValue, invalid, disabled, helpText)`

移行するときは、保存したOpenUI Langの文字列やプロンプトで、この2つの`label`を2番目の引数に移します。`CheckboxGroup("topics", [...], ["css"], "話題")`は、`CheckboxGroup("topics", "話題", [...], ["css"])`にします。
