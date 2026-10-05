import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'このパッケージが画面に出すのは、`<html>`に付ける`dark`クラスだけです。そのクラスの下で何がどう変わるかは、スタイルシートが決めます。このページでは、@k8ordo/uiやTailwind CSS、素のCSSでの書き方を紹介します。あわせて、CSSの`color-scheme`プロパティとOSのコントラストの設定との関係も説明します。',
  en: 'All this package puts on screen is the `dark` class on `<html>`; what changes under it is the stylesheet’s business. This page covers writing it with @k8ordo/ui, with Tailwind CSS and with plain CSS, then how the class relates to the CSS `color-scheme` property and to the OS’s contrast settings.',
});

export const classTitle = message({
  ja: 'クラスが付く場所',
  en: 'Where the class goes',
});

export const classDescription = message({
  ja: '配色がダークに決まったときだけ、`<html>`に`dark`クラスが付きます。ライトのときは何も付かず、`light`というクラスはありません。クラスの名前も、付ける要素も変えられません。',
  en: 'When the scheme resolves to dark, `<html>` carries the `dark` class; when it is light, it carries nothing. There is no `light` class, and neither the name nor the element can be changed.',
});

export const classTiming = message({
  ja: '最初の描画の前にインラインスクリプトがクラスを付け、そのあとはプロバイダのeffectが付け外しします。スタイルシートはこのクラスを読むだけで、訪問者の選択に従います。',
  en: 'The inline script puts the class on before the first paint, and the provider’s effect adds and removes it from then on. A stylesheet that reads the class follows the visitor’s choice with nothing else to do.',
});

export const uiTitle = message({
  ja: '@k8ordo/uiと使う',
  en: 'With @k8ordo/ui',
});

export const uiDescription = message({
  ja: '@k8ordo/uiのトークンは、`:root`にライトの値を、`.dark`にダークの値を持っています。そのため、スタイルシートを読み込むだけで、部品も`bg-bg-base`のようなユーティリティもクラスに従います。',
  en: '@k8ordo/ui’s tokens hold the light values on `:root` and the dark ones on `.dark`. Load the stylesheet, and the components and utilities such as `bg-bg-base` follow the class.',
});

export const uiBoth = message({
  ja: '`styles.css`と`tailwind.css`のどちらを読み込んでも同じです。@k8ordo/uiが自分でクラスを付けることはなく、付けるのはこのパッケージです。',
  en: '`styles.css` and `tailwind.css` behave the same. @k8ordo/ui never adds the class itself; this package does.',
});

export const uiVariants = message({
  ja: '`tailwind.css`を読み込んでいれば、自分のマークアップでも`dark:`と`light:`のバリアントが使えます。`dark:`は`.dark`の下で、`light:`はそれ以外で効きます。',
  en: 'With `tailwind.css`, your own markup gets the `dark:` and `light:` variants: `dark:` applies under `.dark`, and `light:` everywhere else.',
});

export const tailwindTitle = message({
  ja: 'Tailwind CSSだけで使う',
  en: 'With Tailwind CSS alone',
});

export const tailwindDescription = message({
  ja: 'Tailwind CSS 4の`dark:`は、既定では`prefers-color-scheme`を読みます。そのままではOSの設定に従い、訪問者の選択を無視するので、クラスを読むように宣言し直します。',
  en: 'Tailwind CSS 4’s `dark:` reads `prefers-color-scheme` by default, which follows the OS and ignores the visitor’s choice. Redeclare it to read the class.',
});

export const tailwindSame = message({
  ja: 'これは、@k8ordo/uiの`tailwind.css`がしている宣言と同じものです。Tailwind CSSだけで使うときは、あとで説明する`color-scheme`プロパティも自分で宣言します。',
  en: 'It is the same declaration @k8ordo/ui’s `tailwind.css` makes. With Tailwind CSS alone, also declare the `color-scheme` property described below.',
});

export const plainTitle = message({
  ja: '素のCSSで使う',
  en: 'With plain CSS',
});

export const plainDescription = message({
  ja: '素のCSSでは、色をカスタムプロパティに置き、`:root.dark`で値を切り替えます。',
  en: 'In plain CSS, keep the colours in custom properties and switch their values under `:root.dark`.',
});

export const plainSelector = message({
  ja: '`.dark`ではなく`:root.dark`と書くと、詳細度が`:root`より高くなります。そのため、ライトの値をどこに書いても、ダークのときはダークの値が使われます。',
  en: 'Written as `:root.dark` rather than `.dark`, the selector is more specific than `:root`, so the dark values win in dark wherever the light ones are written.',
});

export const propertyTitle = message({
  ja: 'CSSの`color-scheme`プロパティ',
  en: 'The CSS `color-scheme` property',
});

export const propertyDescription = message({
  ja: '`color-scheme`プロパティは、スクロールバーやフォーム部品、`<dialog>`の既定の色のような、ブラウザが自分で描くものの配色を決めます。このパッケージは、このプロパティを設定しません。',
  en: 'The `color-scheme` property decides the scheme of what the browser draws itself: scrollbars, form controls, a `<dialog>`’s default colours. This package does not set it.',
});

export const propertyUi = message({
  ja: '@k8ordo/uiは、ベースのレイヤーでトークンと並べて宣言しています。@k8ordo/uiを使わないなら、色と一緒に自分で宣言します。',
  en: '@k8ordo/ui declares it in its base layer, next to its tokens. Without @k8ordo/ui, declare it yourself, next to your colours.',
});

export const propertyWhy = message({
  ja: '`color-scheme: light dark`と書かないのは、そう書くとブラウザがOSの`prefers-color-scheme`で配色を選ぶからです。OSがダークでも訪問者がライトを選んでいれば、スクロールバーもライトのままでなければなりません。そのため、プロパティも色と同じクラスに従わせます。',
  en: 'Not `color-scheme: light dark`, because then the browser picks by the OS’s `prefers-color-scheme`. With the OS dark and the visitor on light, the scrollbars have to stay light too, so the property follows the same class as the colours.',
});

export const propertyLightDark = message({
  ja: '`color-scheme`がクラスに従っていれば、CSSの`light-dark()`関数もクラスに従います。`color: light-dark(#1f1f1f, #f5f5f5)`のように、1つの宣言でライトとダークの値を書き分けられます。',
  en: 'Once `color-scheme` follows the class, so does the CSS `light-dark()` function, which gives the light and dark values in one declaration, as in `color: light-dark(#1f1f1f, #f5f5f5)`.',
});

export const contrastTitle = message({
  ja: 'OSのコントラストの設定',
  en: 'The OS’s contrast settings',
});

export const contrastDescription = message({
  ja: 'コントラストは、このパッケージが受け持つものではありません。`prefers-contrast: more`と`forced-colors: active`は訪問者がOSで決める設定で、アプリが保存したり切り替えたりするものではないからです。',
  en: 'Contrast is not something this package owns: `prefers-contrast: more` and `forced-colors: active` are settings the visitor makes in the OS, not something an application stores or toggles.',
});

export const contrastUi = message({
  ja: '@k8ordo/uiのスタイルシートは、この2つに自分で従います。高コントラストの値を`:root`と`.dark`の両方に用意しているので、ライトとダークのどちらを選んでいても効きます。ダークを選んだ訪問者がOSで高コントラストを求めていれば、ダークの高コントラストの値で描かれます。',
  en: '@k8ordo/ui’s stylesheet follows both on its own. Its high-contrast values exist for `:root` and for `.dark`, so they apply whichever scheme the visitor chose: a visitor on dark who asks the OS for more contrast gets the dark high-contrast values.',
});

export const contrastOwn = message({
  ja: '自分のCSSで高コントラストに対応するときも、ライトとダークの両方に値を用意します。',
  en: 'In CSS of your own, give the high-contrast values for both schemes as well.',
});

export const contrastLink = message({
  ja: '@k8ordo/uiの高コントラストと強制カラー',
  en: '@k8ordo/ui under high contrast and forced colours',
});
