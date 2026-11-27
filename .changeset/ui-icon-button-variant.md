---
'@k8ordo/ui': major
---

`IconButton`の`color="transparent"`をなくし、`variant`を足しました。`variant`は`'skeleton'`（既定）と`'solid'`で、`color`は`'primary'`、`'secondary'`、`'base'`から`solid`の地の色を選びます。これまでは地の有無を`color`で選んでいて、`Button`の`variant`と同じ見た目の指定が食い違っていました。既定の見た目は変わりません。`color="transparent"`は消し、`color="base"`などで塗っていたところは`variant="solid"`を足してください。

生成UIのカタログの`IconButton`も、地を`variant`で選びます。`color`は`solid`のときだけ効き、`transparent`はなくなりました。

`IconButton`の内蔵のツールチップを、`aria-describedby`で結ばないようにしました。中身は`label`と同じ文なので、スクリーンリーダーが名前の直後に同じ文を説明として読んでいました。利用者が渡した`aria-describedby`はそのまま付きます。

アイコンの`<svg>`に`focusable="false"`を付けるのをやめ、`IconRenderProps`からも`focusable`を消しました。読んでいたのはIEと旧Edgeだけで、`tabindex`の無い`<svg>`はもともとフォーカスを受けません。`BaseIcon`の`renderItem`で`focusable`を読んでいたら消してください。
