---
'@k8ordo/ui': minor
---

生成UIのカタログの`Dialog`に`side`を足しました。`'center'`（既定）か`'bottom'`で、`Dialog`コンポーネントの`side`と同じです。これまでカタログの`Dialog`はいつも中央に開き、下端から出すには`Modal`の`side`を使うしかありませんでした。OpenUI Langの位置引数では、`title`の次が`side`です。

`Dialog`と`Drawer`の説明も、今のコンポーネントに合わせて書き直しました。`Dialog`は中央か下端に開くこと、`Drawer`は左右の端に開くこと、どちらも`title`の見出しと閉じるボタンを持つことを書いています。
