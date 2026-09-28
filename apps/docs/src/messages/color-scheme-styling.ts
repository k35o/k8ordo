import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'このパッケージが画面に出すのは、`<html>` の `dark` クラス 1 つだけです。そのクラスの下で何がどう変わるかは CSS が決めます。@k8ordo/ui と使うとき、Tailwind CSS だけのとき、素の CSS のときの当て方と、CSS の `color-scheme` プロパティ、OS のコントラストの設定との関係を説明します。',
  en: 'What this package puts on screen is one class, `dark` on `<html>`, and nothing else. What changes under it is decided by CSS. This page covers styling with @k8ordo/ui, with Tailwind CSS alone and with plain CSS, and how the class relates to the CSS `color-scheme` property and to the contrast settings of the OS.',
});

export const classSection = {
  title: message({
    ja: '`<html>` の `dark` クラス',
    en: 'The `dark` class on `<html>`',
  }),
  description: message({
    ja: 'クラスの名前も付け先も変えられず、結果がダークのときだけ `<html>` に `dark` が付きます。ライトのときは何も付かず、`light` というクラスはありません。最初の描画の前にインラインスクリプトが付け、そのあとは Provider の effect が付け外しします。どのスタイルシートも、このクラスを読めば訪問者の選択に従います。',
    en: 'Neither the name nor where it goes can change: `<html>` carries `dark` when the result is dark, and nothing when it is light — there is no `light` class. The inline script puts it on before the first paint, and the provider’s effect toggles it afterwards. Any stylesheet that reads the class follows the visitor’s choice.',
  }),
};

export const ui = {
  title: message({
    ja: '@k8ordo/ui と使う',
    en: 'With @k8ordo/ui',
  }),
  description: message({
    ja: '@k8ordo/ui のセマンティックトークンは、`:root` にライトの値を、`.dark` にダークの値を持ちます。`styles.css` でも `tailwind.css` でも同じなので、コンポーネントも `bg-bg-base` のようなユーティリティも、追加の設定なしでクラスに従います。@k8ordo/ui が自分でクラスを付けることはなく、付けるのはこのパッケージです。',
    en: '@k8ordo/ui’s semantic tokens hold the light values on `:root` and the dark ones on `.dark`, in `styles.css` and `tailwind.css` alike, so the components and utilities such as `bg-bg-base` follow the class with nothing else to set up. @k8ordo/ui never adds the class itself; this package does.',
  }),
  variants: message({
    ja: '`tailwind.css` は `dark:` と `light:` のバリアントもクラスを読むように宣言しています。`dark:` は `.dark` の下で、`light:` はそれ以外で効くので、自前のマークアップでもそのまま使えます。',
    en: '`tailwind.css` also declares the `dark:` and `light:` variants to read the class — `dark:` applies under `.dark` and `light:` everywhere else — so they work in your own markup as they are.',
  }),
};

export const property = {
  title: message({
    ja: 'CSS の `color-scheme` プロパティ',
    en: 'The CSS `color-scheme` property',
  }),
  description: message({
    ja: '`color-scheme` プロパティは、スクロールバー、フォーム部品、`<dialog>` の既定の色のような、ブラウザ自身が描くものをライトとダークのどちらで描くかを決めます。このパッケージはこれを設定しません。@k8ordo/ui のベースレイヤーが、トークンと並べて宣言しています。',
    en: 'The `color-scheme` property decides whether the browser draws what it draws itself — scrollbars, form controls, a `<dialog>`’s default colours — light or dark. This package does not set it; @k8ordo/ui’s base layer declares it next to its tokens.',
  }),
  why: message({
    ja: '`color-scheme: light dark` と書かないのは、そう書くとブラウザが OS の `prefers-color-scheme` で選び、訪問者がこのサイトで選んだものとずれるからです。OS がダークでも訪問者がライトを選んでいれば、スクロールバーもライトのままでなければなりません。プロパティもトークンと同じクラスに従わせます。',
    en: 'Not `color-scheme: light dark`, because then the browser picks by the OS’s `prefers-color-scheme` and disagrees with what the visitor chose here: with the OS dark and the visitor on light, the scrollbars have to stay light too. The property follows the same class as the tokens.',
  }),
};

export const contrast = {
  title: message({
    ja: '高コントラストは OS の設定に従う',
    en: 'High contrast follows the OS',
  }),
  description: message({
    ja: 'コントラストは、このパッケージが持つ軸ではありません。`prefers-contrast: more` と `forced-colors: active` は訪問者が OS で決める設定で、アプリが保存したり切り替えたりするものではないので、`useColorScheme()` にも保存行にも出てきません。',
    en: 'Contrast is not an axis this package owns. `prefers-contrast: more` and `forced-colors: active` are settings a visitor makes in the OS, not something an application stores or toggles, so neither appears in `useColorScheme()` or in the stored row.',
  }),
  ui: message({
    ja: '@k8ordo/ui のスタイルシートは、この 2 つに自分で従います。`prefers-contrast: more` ではテキストと境界のトークンを地の色から遠ざけ、それを `:root` と `.dark` の両方に用意しているので、訪問者がライトを選んでいてもダークを選んでいても効きます。`forced-colors: active` ではブラウザが色を訪問者のパレットで塗り直し、部品は境界、フォーカスリング、選択状態をシステムカラーで保ちます。',
    en: '@k8ordo/ui’s stylesheet follows both on its own. Under `prefers-contrast: more` it moves the text and border tokens further from the ground, on `:root` and on `.dark` alike, so it applies whichever scheme the visitor chose. Under `forced-colors: active` the browser repaints every colour from the visitor’s palette, and the components keep their boundaries, focus rings and selected states in system colours.',
  }),
  combined: message({
    ja: '2 つの軸は組み合わさります。ダークを選んだ訪問者が OS で高コントラストを求めていれば、ダークの高コントラストの値で描かれます。',
    en: 'The two axes combine: a visitor who chose dark and asks the OS for more contrast gets the dark high-contrast values.',
  }),
  link: message({
    ja: '@k8ordo/ui のテーマ: 高コントラストと強制カラー、自前の UI での書き方',
    en: '@k8ordo/ui theming: high contrast, forced colours, and your own UI under them',
  }),
};

export const tailwind = {
  title: message({
    ja: 'Tailwind CSS だけで使う',
    en: 'With Tailwind CSS alone',
  }),
  description: message({
    ja: 'Tailwind CSS 4 の `dark:` バリアントは、既定では `prefers-color-scheme` を読みます。そのままでは OS の設定に従い、訪問者の選択を無視します。クラスを読むように宣言し直します。@k8ordo/ui の `tailwind.css` がしている宣言と同じものです。',
    en: 'Tailwind CSS 4’s `dark:` variant reads `prefers-color-scheme` by default, so on its own it follows the OS and ignores the visitor’s choice. Redeclare it to read the class — the same declaration @k8ordo/ui’s `tailwind.css` makes.',
  }),
};

export const plain = {
  title: message({
    ja: '素の CSS で使う',
    en: 'With plain CSS',
  }),
  description: message({
    ja: '色をクラスに結びつけます。@k8ordo/ui を使わないなら `color-scheme` プロパティを宣言するものは無いので、フォーム部品やスクロールバーのようなブラウザ自身の描画も合わせたいなら、色と一緒に宣言します。',
    en: 'Tie the colours to the class. Without @k8ordo/ui nothing declares the `color-scheme` property, so declare it next to the colours if the browser’s own rendering, such as form controls and scrollbars, should follow too.',
  }),
};
