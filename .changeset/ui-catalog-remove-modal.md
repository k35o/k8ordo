---
'@k8ordo/ui': major
---

生成UIのカタログから`Modal`をなくしました。`Modal`はもう公開のコンポーネントではなく、カタログの`Modal`は`side`で`Dialog`と`Drawer`を描き分けていただけでした。同じものを開く項目が3つあり、モデルがどれを選ぶかも定まりませんでした。

移行するときは、保存したspecやプロンプトの`Modal`を次のように書き換えます。`triggerLabel`と`title`はそのまま渡せて、OpenUI Langの位置引数（`triggerLabel`、`title`、`side`、子）の並びも同じです。

- `side`が無いか、`'center'`か`'bottom'`なら`Dialog`にする
- `side`が`'left'`か`'right'`なら`Drawer`にする
