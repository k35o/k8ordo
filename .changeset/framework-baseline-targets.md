---
'@k8ordo/framework': minor
---

ブラウザで動くJavaScriptとCSSを、Baseline newly availableの機能にすべて対応したブラウザ向けにビルドするようにしました。版は`baseline-browser-mapping`から、browserslistの`baseline newly available`と同じ方法で求めます。

これまではViteの既定（Chrome 111、Safari 16.4など）のままで、Lightning CSSが`light-dark()`と`:dir()`を書き換えていました。`light-dark()`はカスタムプロパティを宣言した場所で解決される形になり、`<html>`より下に付けた`.dark`の中が暗くなりませんでした。`@k8ordo/ui`の色のトークンも`light-dark()`で書いているので、同じことが起きていました。`:dir(rtl)`は`:lang()`のセレクタになり、`dir`に従いませんでした。

`build.target`と`build.cssTarget`と`css.lightningcss.targets`は、アプリが書いていればその値を使います。サーバーで動く`rsc`と`ssr`のコードは、Viteの既定のままです。
