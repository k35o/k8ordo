---
'@k8ordo/ui': major
---

生成UIのカタログで、`href`に`/`を2つ続けた値と`/\`で始まる値を受け付けないようにしました。`//evil.example`や`/\evil.example`はスキームを省いた別のサイトのURLですが、`/`で始まるのでパスとして通り、`Anchor`は内部のリンクとして描いていました。ブラウザはURLの途中のタブと改行を読み飛ばすので、`/<タブ>/evil.example`も`//evil.example`と同じURLになります。そのため、タブ、CR、LFを含む`href`は、どこに含んでいても受け付けません。`https://`で始まるURLも同じです。`Button`、`Card`、`Anchor`、`Breadcrumb`、`SideNav`の`href`が対象です。`catalogRules`の文も「a path starting with a single /」に直しました。`examples/ui-integrations`のつなぎは、こうした`href`を持つ要素を描きません。

移行するときは、保存したspecやプロンプトの`href`のうち`//`や`/\`で始まるものを、`https://`から始まるURLに書き換えます。同じサイトのページなら、`/`を1つにしたパスにします。タブや改行を含む`href`は、それを取り除きます。
