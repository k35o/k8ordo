import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/ui`をインストールして、最初のコンポーネントを表示します。',
  en: 'Install `@k8ordo/ui` and put a first component on screen.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installAiBefore = message({
  ja: '生成UIとAIチャットのパッケージは、その機能を使うときだけ入れます。入れ方は、',
  en: 'The packages for generative UI and AI chat are needed only for those features. Each feature’s page, linked from ',
});

export const installAiAfter = message({
  ja: 'からたどれるそれぞれのページにあります。',
  en: ', says how to add them.',
});

export const stylesTitle = message({
  ja: 'スタイルシート',
  en: 'Stylesheet',
});

export const stylesEntry = message({
  ja: 'アプリのエントリーポイントで、ビルド済みのスタイルシートを1回だけ読み込みます。Tailwind CSSを使っていないプロジェクトでも、これだけで動きます。',
  en: 'Import the prebuilt stylesheet once, at the application’s entry point. It works on its own, with no Tailwind CSS setup.',
});

export const stylesTailwind = message({
  ja: (version: string) =>
    `Tailwind CSS ${version}以上のプロジェクトでは、代わりに\`tailwind.css\`を読み込みます。デザイントークンが\`bg-bg-base\`のようなTailwindのクラスになり、自分のマークアップでも使えます。`,
  en: (version) =>
    `A project on Tailwind CSS ${version} or later imports \`tailwind.css\` instead. The design tokens then become Tailwind classes such as \`bg-bg-base\`, usable in your own markup too.`,
});

export const stylesDarkBefore = message({
  ja: 'ダークモードの切り替えは、',
  en: 'See the dark mode section of ',
});

export const stylesDarkAfter = message({
  ja: 'の「ダークモード」の節を見てください。',
  en: ' for switching to dark mode.',
});

export const stylesBase = message({
  ja: 'どちらのスタイルシートも、ページ全体に基本のスタイルを当てます。見出しやリストの余白を消し、`b`と`strong`の太字も外します。既存のアプリに足すと、ライブラリ以外の見た目も変わります。',
  en: 'Either stylesheet applies base styles to the whole document. It resets the margins of headings and lists and unsets bold on `b` and `strong`. Adding it to an existing app restyles more than the library’s components.',
});

export const stylesProseBefore = message({
  ja: 'Markdownから作った文章は、',
  en: 'Wrap rendered Markdown in ',
});

export const stylesProseAfter = message({
  ja: 'で囲むと見出しや太字のスタイルが戻ります。',
  en: ' to restore its heading and bold styles.',
});

export const providerTitle = message({
  ja: 'プロバイダ',
  en: 'Provider',
});

export const providerRoot = message({
  ja: 'アプリのルートを`UIProvider`で1回だけ囲みます。トーストを表示するには、このプロバイダが必要です。',
  en: 'Wrap the application root in `UIProvider`, once. Toasts need it in order to show.',
});

export const providerWordingBefore = message({
  ja: 'コンポーネントに組み込まれた「閉じる」などの文言は、`@k8ordo/i18n`の現在のロケールに従います。言語の選択は',
  en: 'Built-in wording such as “Close” follows the current locale of `@k8ordo/i18n`. ',
});

export const providerWordingAfter = message({
  ja: 'で説明しています。',
  en: ' covers how the locale is chosen.',
});

export const componentTitle = message({
  ja: 'コンポーネント',
  en: 'Components',
});

export const componentImport = message({
  ja: '使いたいコンポーネントをimportして置きます。',
  en: 'Import the components you need and place them.',
});

export const componentProps = message({
  ja: '`Logo`を除いて、どのコンポーネントも`className`と`style`を受け取りません。見た目は`variant`や`size`などのpropsで選びます。それでも足りないときは、`Button`の`renderItem`のようなrender propで要素を差し替えます。',
  en: 'Apart from `Logo`, no component takes `className` or `style`. Choose the look with props such as `variant` and `size`. When that is not enough, replace the element through a render prop such as `Button`’s `renderItem`.',
});

export const packageManagerLabel = message({
  ja: 'パッケージマネージャー',
  en: 'Package manager',
});
