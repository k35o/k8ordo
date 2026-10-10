import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`で、ライトとダークを切り替えるボタンを1つ作ります。',
  en: 'Build one button that switches between light and dark with `@k8ordo/color-scheme`.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installStateBefore = message({
  ja: 'プロバイダは、選んだ配色を`@k8ordo/state`のローカル状態としてlocalStorageに保存します。`@k8ordo/state`とzodはそのために必要です。保存の形は',
  en: 'The provider stores the chosen scheme in localStorage as an `@k8ordo/state` local state, which is why `@k8ordo/state` and zod are needed. What is stored is described in ',
});

export const installStateAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const providerTitle = message({
  ja: 'プロバイダの配置',
  en: 'Placing the provider',
});

export const providerSuppressCallout = message({
  ja: 'スクリプトが付けるクラスについての警告を止める',
  en: 'Silences the warning about the class the script adds',
});

export const providerWrapCallout = message({
  ja: 'ページ全体を包む',
  en: 'Wraps the whole page',
});

export const providerPlace = message({
  ja: 'ルートレイアウトの`<body>`の中に`<ColorSchemeProvider>`を置き、ページ全体を包みます。プロバイダはClient Componentですが、ルートレイアウトはServer Componentのままで構いません。',
  en: 'Put `<ColorSchemeProvider>` inside `<body>` in the root layout, around the whole page. The provider is a Client Component, but the root layout can stay a Server Component.',
});

export const providerScript = message({
  ja: 'プロバイダは、ページの中身より先にインラインの`<script>`を出力します。このスクリプトは保存した選択を読みます。選択が無ければOSの設定に従い、ダークなら最初の描画の前に`<html>`へ`dark`クラスを付けます。`<head>`に置くものはありません。',
  en: 'The provider renders an inline `<script>` ahead of the page’s content. The script reads the stored choice, or follows the OS setting when nothing is stored. When that is dark, it puts the `dark` class on `<html>` before the first paint. Nothing goes in `<head>`.',
});

export const providerSuppress = message({
  ja: 'このクラスはサーバーのHTMLにはありません。`<html>`に`suppressHydrationWarning`を付けないと、開発時のReactがハイドレーションの食い違いとして報告します。',
  en: 'The class is not in the server’s HTML. Without `suppressHydrationWarning` on `<html>`, React reports a hydration mismatch in development.',
});

export const colorTitle = message({
  ja: '`dark`クラスの色',
  en: 'Colors for the `dark` class',
});

export const colorDarkCallout = message({
  ja: '`dark`クラスが付いたときの色',
  en: 'The colors while the `dark` class is on',
});

export const colorClass = message({
  ja: 'このパッケージが変えるのは、`<html>`の`dark`クラスだけです。何色にするかは、スタイルシートで決めます。',
  en: 'All this package changes is the `dark` class on `<html>`. The stylesheet decides the colors.',
});

export const colorProperty = message({
  ja: '`color-scheme`も一緒に切り替えると、スクロールバーやフォーム部品のようにブラウザが描く部品も、選んだ配色になります。',
  en: 'Switch `color-scheme` along with the colors, and what the browser draws itself, such as scrollbars and form controls, follows the chosen scheme too.',
});

export const colorUiBefore = message({
  ja: '`@k8ordo/ui`のスタイルシートを読み込んでいれば、トークンも`color-scheme`もすでにこのクラスで切り替わります。Tailwind CSSの`dark:`と合わせる書き方は',
  en: 'With `@k8ordo/ui`’s stylesheet loaded, its tokens and `color-scheme` already switch on this class. Using it with Tailwind CSS’s `dark:` is covered in ',
});

export const colorUiAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const switchTitle = message({
  ja: 'フックでの切り替え',
  en: 'Switching with the hook',
});

export const switchSchemeCallout = message({
  ja: '`scheme`は表示中の配色',
  en: '`scheme` is what is on screen',
});

export const switchSetCallout = message({
  ja: '選んだ配色を保存する',
  en: 'Stores the chosen scheme',
});

export const switchHook = message({
  ja: 'Client Componentで`useColorScheme()`を呼び、返る値のうち`scheme`と`setPreference`を使います。`setPreference`に渡した配色はlocalStorageに保存され、プロバイダが`<html>`のクラスを付け替えます。',
  en: 'Call `useColorScheme()` in a Client Component to get `scheme` and `setPreference`. A scheme passed to `setPreference` is stored in localStorage, and the provider swaps the class on `<html>`.',
});

export const switchGuessBefore = message({
  ja: 'ボタンの文言は`scheme`から決めています。ハイドレーションが終わるまでは、サーバーで描画した既定の配色に合わせた文言になります。これを避ける方法は',
  en: 'The label comes from `scheme`. Until hydration, it matches the default scheme of the server render. How to avoid that is covered in ',
});

export const switchGuessAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const tryTitle = message({
  ja: '切り替えのデモ',
  en: 'Switch demo',
});

export const tryDescription = message({
  ja: 'ここまでで作ったボタンを、このサイトのプロバイダにつないでいます。',
  en: 'The button built on this page, wired to this site’s provider.',
});

export const trySteps = [
  message({
    ja: 'ボタンを押すと、このサイト全体の配色が切り替わります。ボタンの文言も反対の配色に変わります。',
    en: 'Press the button. The whole site switches, and the label flips to the other scheme.',
  }),
  message({
    ja: 'ヘッダーの配色の切り替えボタンを押すと、こちらのボタンの文言も一緒に変わります。どちらのボタンも同じプロバイダを読んでいます。',
    en: 'Press the color scheme switch in the header. This button’s label changes with it: both read the same provider.',
  }),
  message({
    ja: 'ダークにした状態でページを再読み込みすると、白い画面を挟まずに最初からダークで表示されます。',
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
