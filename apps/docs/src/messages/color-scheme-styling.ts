import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`<html>`に付く`dark`クラスをスタイルシートで読み、ダークの色に切り替えます。Tailwind CSSでも素のCSSでも書けます。',
  en: 'Read the `dark` class on `<html>` in your stylesheet to switch to the dark colors. It works with Tailwind CSS or plain CSS.',
});

export const classTitle = message({
  ja: 'クラスが付く場所',
  en: 'Where the class goes',
});

export const classWhen = message({
  ja: '配色がダークに決まったときだけ、`<html>`に`dark`クラスが付きます。ライトのときは何も付かず、`light`というクラスはありません。クラスの名前も付ける要素も変えられません。',
  en: 'The `dark` class goes on `<html>` only when the scheme resolves to dark. Light adds nothing, and there is no `light` class. Neither the name nor the element can be changed.',
});

export const classTiming = message({
  ja: '最初の描画の前にインラインスクリプトがクラスを付けます。そのあとは`ColorSchemeProvider`が付け外しします。スタイルシートはこのクラスを読むだけで、訪問者の選択に従います。',
  en: 'An inline script adds the class before the first paint, and `ColorSchemeProvider` adds and removes it after that. A stylesheet only has to read the class to follow the visitor’s choice.',
});

export const classUi = message({
  ja: '`@k8ordo/ui`のトークンと、`tailwind.css`の`dark:`と`light:`のバリアントはこのクラスを読みます。詳しくは',
  en: '`@k8ordo/ui`’s tokens and the `dark:` and `light:` variants of its `tailwind.css` read this class. See ',
});

export const classUiAfter = message({
  ja: 'の「ダークモード」を見てください。',
  en: ' under “Dark mode”.',
});

export const tailwindTitle = message({
  ja: 'Tailwind CSSのみ',
  en: 'With Tailwind CSS alone',
});

export const tailwindCallout = message({
  ja: '`dark:`がクラスを読むように宣言し直す',
  en: 'Redeclares `dark:` to read the class',
});

export const tailwindVariant = message({
  ja: 'Tailwind CSS 4の`dark:`は、既定では`prefers-color-scheme`を読みます。そのままではOSの設定に従い、訪問者の選択を無視します。',
  en: 'Tailwind CSS 4’s `dark:` reads `prefers-color-scheme` by default, so it follows the OS and ignores the visitor’s choice.',
});

export const plainTitle = message({
  ja: '素のCSS',
  en: 'With plain CSS',
});

export const plainCallout = message({
  ja: '`:root`より詳細度が高い',
  en: 'More specific than `:root`',
});

export const plainSelector = message({
  ja: '色をカスタムプロパティに置き、`:root.dark`で値を切り替えます。`.dark`だけだと`:root`と詳細度が同じで、後に書いたほうが優先されます。`:root.dark`なら、ライトの値を後に書いてもダークの値が優先されます。',
  en: 'Keep the colors in custom properties and switch them under `:root.dark`. A bare `.dark` is as specific as `:root`, so whichever comes later wins. With `:root.dark`, the dark values take precedence even when the light ones come later.',
});

export const propertyTitle = message({
  ja: '`color-scheme`プロパティ',
  en: 'The `color-scheme` property',
});

export const propertyWhat = message({
  ja: '`color-scheme`プロパティは、スクロールバーやフォーム部品など、ブラウザが自分で描くものの配色を決めます。このパッケージは設定しません。`@k8ordo/ui`を使わないなら、色と一緒に自分で宣言します。',
  en: 'The `color-scheme` property sets the scheme of what the browser draws itself, such as scrollbars and form controls. This package does not set it. Without `@k8ordo/ui`, declare it yourself next to your colors.',
});

export const propertyWhy = message({
  ja: '`light dark`と書くと、ブラウザが`prefers-color-scheme`で配色を選びます。OSがダークで訪問者がライトを選んでいると、スクロールバーやフォーム部品がダークで描かれ、選んだ配色とずれます。そのため、色と同じクラスで切り替えます。',
  en: 'With `light dark`, the browser picks the scheme from `prefers-color-scheme`. With the OS on dark and the visitor on light, scrollbars and form controls are drawn dark, against the visitor’s choice. Switch it with the same class as the colors.',
});

export const propertyLightDark = message({
  ja: '`color-scheme`がクラスに従っていれば、`light-dark()`関数もクラスに従います。`color: light-dark(#1f1f1f, #f5f5f5)`のように、1つの宣言にライトとダークの値を書けます。',
  en: 'Once `color-scheme` follows the class, the `light-dark()` function does too. It takes the light and dark values in one declaration, as in `color: light-dark(#1f1f1f, #f5f5f5)`.',
});

export const contrastTitle = message({
  ja: 'OSのコントラストの設定',
  en: 'OS contrast settings',
});

export const contrastOwn = message({
  ja: '`prefers-contrast: more`と`forced-colors: active`はOSの設定で、このパッケージは保存も切り替えもしません。自分のCSSで対応するときは、ライトとダークの両方に値を用意します。',
  en: '`prefers-contrast: more` and `forced-colors: active` are OS settings; this package neither stores nor toggles them. When your own CSS supports them, give values for both light and dark.',
});

export const contrastUi = message({
  ja: '`@k8ordo/ui`のスタイルシートは、`:root`と`.dark`の両方にハイコントラストの値を持っているので、どちらを選んでいても効きます。詳しくは',
  en: '`@k8ordo/ui`’s stylesheet holds high-contrast values for both `:root` and `.dark`, so they apply in either scheme. See ',
});

export const contrastAfter = message({
  ja: 'の「ハイコントラスト」を見てください。',
  en: ' under “High contrast”.',
});

export const uiThemingLink = message({
  ja: '@k8ordo/uiのテーマ',
  en: 'Theming in @k8ordo/ui',
});
