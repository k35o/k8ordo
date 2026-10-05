import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/ui`をインストールして、最初のコンポーネントを表示するまでの手順です。スタイルシートを1行読み込み、プロバイダを1つ置けば、あとはコンポーネントをimportして使えます。',
  en: 'Install `@k8ordo/ui` and put a first component on screen. Load one stylesheet, place one provider, and import components from there.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/ui`と、コンポーネントの文言の言語を決める`@k8ordo/i18n`をインストールします。',
  en: 'Install `@k8ordo/ui`, and `@k8ordo/i18n`, which decides the language of the components’ own wording.',
});

export const peersDescription = message({
  ja: 'このほかに、次のパッケージをpeer dependenciesとして使います。生成UIやAIのチャットに使うパッケージは、その機能を使うときだけ入れます。',
  en: 'It also relies on these peer dependencies. The ones for generative UI and AI chat are needed only when you use those features.',
});

export const peers = {
  react: message({
    ja: 'コンポーネントとフック',
    en: 'The components and hooks',
  }),
  reactDom: message({
    ja: 'ポータルと`useFormStatus`',
    en: 'Portals and `useFormStatus`',
  }),
  i18n: message({
    ja: 'コンポーネントが自分で描く文言のロケール',
    en: 'The locale the components’ own wording is read in',
  }),
  types: message({
    ja: '同梱している型定義',
    en: 'The type declarations it ships',
  }),
  tailwindcss: message({
    ja: '`tailwind.css`の読み込み',
    en: 'The `tailwind.css` entry',
  }),
  zod: message({
    ja: '生成UIのスキーマ',
    en: 'Generative-UI schemas',
  }),
  jsonRender: message({
    ja: '`@k8ordo/ui/json-render`',
    en: '`@k8ordo/ui/json-render`',
  }),
  openuiLangCore: message({
    ja: '`@k8ordo/ui/openui`と`@k8ordo/ui/openui/prompt`',
    en: '`@k8ordo/ui/openui` and `@k8ordo/ui/openui/prompt`',
  }),
  openuiReactLang: message({
    ja: '`@k8ordo/ui/openui`',
    en: '`@k8ordo/ui/openui`',
  }),
  ai: message({
    ja: '`@k8ordo/ui/ai-sdk`',
    en: '`@k8ordo/ui/ai-sdk`',
  }),
  streamdown: message({
    ja: '`@k8ordo/ui/ai/response`',
    en: '`@k8ordo/ui/ai/response`',
  }),
};

export const stylesTitle = message({
  ja: 'スタイルシートを読み込む',
  en: 'Load the stylesheet',
});

export const stylesDescription = message({
  ja: 'アプリのエントリーポイントで、ビルド済みのスタイルシートを1回だけ読み込みます。Tailwind CSSを使っていないプロジェクトでも、これだけで動きます。',
  en: 'Import the prebuilt stylesheet once, at the application’s entry point. It works on its own, with no Tailwind CSS setup.',
});

export const stylesTailwind = message({
  ja: 'Tailwind CSS 4を使っているプロジェクトでは、代わりに`tailwind.css`を読み込みます。デザイントークンが`bg-bg-base`のようなTailwindのクラスになり、自分のマークアップでも使えるようになります。',
  en: 'A project on Tailwind CSS 4 imports `tailwind.css` instead. The design tokens then become Tailwind classes such as `bg-bg-base`, usable in your own markup too.',
});

export const stylesBase = message({
  ja: 'どちらのスタイルシートも、ページ全体に基本のスタイルを当てます。見出しやリストの余白を消すリセットに加えて、`b`や`strong`の太字も外すので、既存のアプリに足すとライブラリ以外の見た目も変わります。Markdownから作った本文は、`Prose`で囲むと本文らしい組版に戻ります。',
  en: 'Either stylesheet applies base styles to the whole document. Besides resetting the margins of headings and lists, it unsets bold on `b` and `strong`, so adding it to an existing app restyles more than the library’s components. Wrap rendered Markdown in `Prose` to get the typesetting of body text back.',
});

export const providerTitle = message({
  ja: 'プロバイダを置く',
  en: 'Place the provider',
});

export const providerDescription = message({
  ja: 'アプリのルートを`UIProvider`で1回だけ囲みます。トーストを表示する仕組みは、このプロバイダに入っています。',
  en: 'Wrap the application root in `UIProvider`, once. It holds what toasts need to show.',
});

export const providerWording = message({
  ja: 'コンポーネントの文言の言語は、プロバイダでは決めません。`@k8ordo/i18n`のいまのロケールに従います。',
  en: 'The provider does not decide the language of the components’ wording; `@k8ordo/i18n`’s current locale does.',
});

export const componentTitle = message({
  ja: 'コンポーネントを置く',
  en: 'Place a component',
});

export const componentDescription = message({
  ja: 'あとは、使いたいコンポーネントをimportして置くだけです。',
  en: 'From here, import the components you need and place them.',
});

export const componentProps = message({
  ja: 'どのコンポーネントも、`className`と`style`を受け取りません。見た目は`variant`や`size`などのpropsで選び、それでも足りないときは`renderItem`で要素ごと差し替えます。',
  en: 'No component takes `className` or `style`. Choose the look with props such as `variant` and `size`, and when that is not enough, replace the element with `renderItem`.',
});

export const darkTitle = message({
  ja: 'ダークモードに対応する',
  en: 'Support dark mode',
});

export const darkDescription = message({
  ja: 'デザイントークンは、`<html>`に`dark`クラスが付くとダークの値に切り替わります。ただし、ライブラリ自身はこのクラスを付けません。',
  en: 'The design tokens switch to their dark values under a `dark` class on `<html>`. The library never adds the class itself.',
});

export const darkColorScheme = message({
  ja: 'k8ordoのアプリなら、`@k8ordo/color-scheme`が訪問者の設定とOSの設定を見て、最初の描画の前に`dark`クラスを付けます。',
  en: 'In a k8ordo application, `@k8ordo/color-scheme` adds the class from the visitor’s choice and the system setting, before the first paint.',
});

export const wordingTitle = message({
  ja: 'コンポーネントの文言の言語を決める',
  en: 'Choose the language of the wording',
});

export const wordingDescription = message({
  ja: '「閉じる」や「読み込み中」のように、コンポーネントが自分で描く文言は、`@k8ordo/i18n`のいまのロケールで表示されます。ロケールの一覧を定義していないアプリでは、英語になります。',
  en: 'The wording the components draw themselves, such as “Close” or “Loading”, follows `@k8ordo/i18n`’s current locale. An application that defines no locale set gets English.',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextComponents = message({
  ja: 'すべてのコンポーネントを、動く例とpropsの表で探せます。',
  en: 'Every component, with live examples and its props.',
});

export const nextTheming = message({
  ja: '色や余白、文字のデザイントークンを確かめ、上書きします。',
  en: 'Look up the colour, spacing and type tokens, and override them.',
});

export const nextI18n = message({
  ja: 'コンポーネントの文言の言語を決め、文言を差し替えます。',
  en: 'Choose the language of the components’ wording, and replace it.',
});

export const nextStorybook = message({
  ja: 'Storybookで、各コンポーネントのストーリーを動かして確かめます。',
  en: 'Try each component’s stories in Storybook.',
});

export const packageManagerLabel = message({
  ja: 'パッケージマネージャー',
  en: 'Package manager',
});
