---
'@k8ordo/ui': major
---

`Button`と`IconButton`に`href`を足し、`renderItem`をなくしました。`href`を渡すと、同じ見た目の`<a>`を描きます。`target`や`rel`、`download`、`data-*`などの属性は`<a>`に渡り、`type`と`action`は受け取りません。`disabled`のリンクは`aria-disabled`を付け、押しても遷移しません。Next.jsの`Link`のようなリンク部品は`renderAnchor`で描きます。受け取るpropsは`Anchor`の`renderAnchor`と同じ形で、`href`の型もそのまま渡るので、型付きのルートは型付きのまま使えます。これまではリンクにするたびに関数の`renderItem`を書いていて、Server Componentからは渡せませんでした。`ButtonRenderItemProps`、`IconButtonRenderItemProps`、`IconButtonTriggerProps`も公開をやめました。

```tsx
// これまで
<Button renderItem={({ disabled: _d, type: _t, ...props }) => <a href="/settings" {...props} />}>設定</Button>
// これから
<Button href="/settings">設定</Button>
<Button href="/settings" renderAnchor={(props) => <Link {...props} />}>設定</Button>
```

`Button`の`type`は、`'button'`と`'submit'`に加えて`'reset'`も受け取るようになりました。`renderItem`で描いていた`<button type="reset">`の代わりです。

移行するときは、次のように書き換えます。

- `renderItem`で`<a>`を描いていたところは`href`に、リンク部品を描いていたところは`href`と`renderAnchor`にする
- `renderItem`で`type="reset"`の`<button>`を描いていたところは`<Button type="reset">`にする
