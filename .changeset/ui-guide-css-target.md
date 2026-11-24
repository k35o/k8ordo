---
'@k8ordo/ui': patch
---

ガイドに、CSSのtargetの設定を書きました。ViteとNext.jsの既定のtargetでは、Lightning CSSが`light-dark()`と`:dir()`と`@scope`の中の`&`を書き換えます。`light-dark()`はトークンを宣言した場所で解決される形になり、`<html>`より下に付けた`.dark`の中が暗くなりません。

Viteでは、`build.cssTarget`をChrome 146、Edge 146、Firefox 151、Safari 26以上にします。`css.transformer`が`'lightningcss'`なら、`css.lightningcss.targets`も同じ版にします。Next.jsでは、`package.json`の`browserslist`に同じ版を書きます。`@k8ordo/framework`のアプリは、何も書かなくて構いません。
