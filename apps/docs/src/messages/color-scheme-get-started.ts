import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ライトとダークを切り替えるボタンを1つ作りながら、`@k8ordo/color-scheme`の使い方を最初から最後までたどります。プロバイダをルートレイアウトに1つ置くだけで、ダークを選んだ訪問者のページは最初の描画からダークになり、何も選んでいない訪問者のページはOSの設定に従います。',
  en: 'Build one switch between light and dark, and follow `@k8ordo/color-scheme` from start to finish. With one provider in the root layout, a visitor who chose dark gets a page that is dark from the first paint, and one who chose nothing follows the OS setting.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/color-scheme`と一緒に、設定の保存に使う`@k8ordo/state`とzodをインストールします。',
  en: 'Install `@k8ordo/color-scheme`, along with `@k8ordo/state` and zod, which store the preference.',
});

export const installState = message({
  ja: 'プロバイダは、訪問者の選択を`@k8ordo/state`のローカル状態としてlocalStorageに保存します。そのスキーマがzodで書かれているので、この2つも必要です。',
  en: 'The provider keeps the visitor’s choice in localStorage as an `@k8ordo/state` local state, whose schema is written in zod. That is why both are needed.',
});

export const providerTitle = message({
  ja: 'プロバイダを置く',
  en: 'Place the provider',
});

export const providerDescription = message({
  ja: 'ルートレイアウトの`<body>`の中に`<ColorSchemeProvider>`を置き、ページ全体を包みます。',
  en: 'Put `<ColorSchemeProvider>` in the root layout, inside `<body>`, around the whole page.',
});

export const providerFirst = message({
  ja: 'プロバイダは、ページの中身より先にインラインの`<script>`を描きます。ブラウザはHTMLを読み進める途中でこのスクリプトを実行するので、ページの中身が描かれる前に`<html>`へ`dark`クラスが付きます。そのため、`<head>`に置くものはありません。',
  en: 'The provider renders an inline `<script>` ahead of the page’s content. The browser runs it the moment it reads it, so `dark` is on `<html>` before anything is painted. Nothing goes in `<head>`.',
});

export const providerSuppress = message({
  ja: '`<html>`の`suppressHydrationWarning`は、スクリプトが付けたクラスについての警告を止めるためのものです。このクラスはサーバーのHTMLには無いので、付けないと開発時のReactが食い違いとして報告します。',
  en: '`suppressHydrationWarning` on `<html>` silences the warning about the class the script adds. The class is not in the server’s HTML, so without it React reports a mismatch in development.',
});

export const providerServer = message({
  ja: 'プロバイダはClient Componentですが、ルートレイアウトはServer Componentのままで構いません。',
  en: 'The provider is a Client Component, but the root layout can stay a Server Component.',
});

export const colorTitle = message({
  ja: '`dark`クラスで色を変える',
  en: 'Colour the page with the `dark` class',
});

export const colorDescription = message({
  ja: 'このパッケージが画面に出すのは、`<html>`の`dark`クラスだけです。何色にするかは、スタイルシートで決めます。',
  en: 'All this package puts on screen is the `dark` class on `<html>`. The stylesheet decides the colours.',
});

export const colorProperty = message({
  ja: '`color-scheme`も一緒に切り替えておくと、スクロールバーやフォーム部品のようにブラウザが自分で描く部品も、選んだ配色で描かれます。',
  en: 'Switching `color-scheme` along with the colours makes what the browser draws itself, such as scrollbars and form controls, follow the chosen scheme too.',
});

export const colorUi = message({
  ja: '@k8ordo/uiのスタイルシートを読み込んでいれば、トークンも`color-scheme`もすでにこのクラスで切り替わります。自分で書く必要はありません。',
  en: 'With @k8ordo/ui’s stylesheet loaded, its tokens and `color-scheme` already switch on this class, and there is nothing to write.',
});

export const switchTitle = message({
  ja: '切り替えのボタンを作る',
  en: 'Build the switch',
});

export const switchDescription = message({
  ja: '最後に、`useColorScheme()`を使うClient Componentで、配色を切り替えるボタンを作ります。',
  en: 'Finally, build the button in a Client Component with `useColorScheme()`.',
});

export const switchExplain = message({
  ja: '`scheme`は画面に出ている配色で、`setPreference`は選んだ配色を保存する関数です。ボタンを押すとlocalStorageに選択が保存され、プロバイダが`<html>`のクラスを付け替えます。',
  en: '`scheme` is what is on screen, and `setPreference` stores a choice. Pressing the button stores it in localStorage, and the provider swaps the class on `<html>`.',
});

export const switchReload = message({
  ja: '保存した選択は、次にページを開いたときにインラインスクリプトが読みます。そのため再読み込みしても、ページは最初の描画から選んだ配色で表示されます。',
  en: 'The next time a page opens, the inline script reads the stored choice, so even a reload paints in the chosen scheme from the start.',
});

export const switchGuess = message({
  ja: 'ボタンの文言は`scheme`から決めているので、ハイドレーションが終わるまではサーバーが推測した配色に合わせて描かれます。これを避ける方法は「切り替えのボタンを作る」で説明しています。',
  en: 'The label is chosen from `scheme`, so until hydration it follows the scheme the server guessed. “Build a switch” shows how to avoid that.',
});

export const tryTitle = message({
  ja: '動かしてみる',
  en: 'Try it',
});

export const tryDescription = message({
  ja: 'ここまでで作ったボタンを、このサイトのプロバイダにつないでいます。押すと、このサイト全体の配色が切り替わります。',
  en: 'The button you just built, wired to this site’s provider. Pressing it switches the colour scheme of the whole site.',
});

export const trySteps = [
  message({
    ja: 'ボタンを押すと、このサイト全体の配色が切り替わり、ボタンの文言も反対の配色に変わります。',
    en: 'Press the button. The whole site switches, and the label flips to the other scheme.',
  }),
  message({
    ja: 'ヘッダーにある配色の切り替えボタンを押すと、こちらのボタンの文言も一緒に変わります。どちらのボタンも、同じプロバイダを読んでいるからです。',
    en: 'Press the colour scheme switch in the header. This button’s label changes with it, because both read the same provider.',
  }),
  message({
    ja: 'ダークにした状態でページを再読み込みすると、白く光ることなく、最初から暗いまま表示されます。',
    en: 'With the site dark, reload the page. It comes back dark from the start, with no white flash.',
  }),
] as const;

export const tryToDark = message({
  ja: 'ダークにする',
  en: 'Switch to dark',
});

export const tryToLight = message({
  ja: 'ライトにする',
  en: 'Switch to light',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextStyling = message({
  ja: '`@k8ordo/ui`やTailwind CSSと組み合わせて、`dark`クラスに色を当てる。',
  en: 'Colour the `dark` class with `@k8ordo/ui` or Tailwind CSS.',
});

export const nextSwitcher = message({
  ja: '「システム」を含む3択を作り、ハイドレーションの前の表示を整える。',
  en: 'Offer the system as a third choice, and get the display right before hydration.',
});

export const nextCsp = message({
  ja: 'CSPの下で、インラインスクリプトをnonceかハッシュで許可する。',
  en: 'Allow the inline script by nonce or by hash under a CSP.',
});
