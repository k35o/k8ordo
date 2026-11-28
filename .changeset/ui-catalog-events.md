---
'@k8ordo/ui': major
---

生成UIのカタログに、利用者の操作をアプリに伝える`events`を足しました。`Button`、`IconButton`、`Card`、`DropdownMenuItem`が`press`を持ちます。形式のつなぎは、各形式の操作の書き方（A2UIの`action`、json-renderの`on`、OpenUIのaction）を`press`に結び、結んだものを描画側に`on`として渡します。描画側は`on.press`をボタンやカードの`action`にします。結ばれていない`Card`は押せる形にならず、押せそうに見えて何も起きないカードは描かれません。型は`CatalogEventOf<N>`です。

カタログのいくつかの部品の書き方が変わります。

- `DropdownMenu`は`items`を持たず、子を並べる入れ物になりました。項目は新しい部品`DropdownMenuItem`（`label`）で、選ばれると`press`を出します。これまでの項目は選んでも何も起きませんでした。
- `Card`は`interactive`を持たなくなり、`href`（安全なURLだけ）を持ちます。`href`があるとカード全体がリンクに、`press`が結ばれていると1つのボタンになり、押せる見た目もそこから決まります。OpenUI Langの位置引数では、`size`の次が`href`になります。
- `Form`は`action`を持たなくなりました。生成したフォームは何も送信せず、入力欄でEnterを押してもページを読み直しません。送信は中の`Button`の`press`で伝えます。モデルが書いたフォームが、任意のURLへ送れなくなります。
- `href`を持つ`Button`はリンクのままで、`press`を出しません。
