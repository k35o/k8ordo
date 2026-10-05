import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/ui`の色や余白、文字の大きさは、すべてCSS変数のデザイントークンで決まっています。このページでは、どんなトークンがあり、どう使い分けるかと、トークンを上書きしてアプリの色に合わせる方法を紹介します。',
  en: '`@k8ordo/ui`’s colours, spacing and type sizes all come from design tokens defined as CSS variables. This page lists the tokens, how to choose between them, and how to override them to fit your application.',
});

export const colorPaletteTitle = message({
  ja: '基本の色',
  en: 'The base palette',
});

export const colorPaletteDescription = message({
  ja: '10の色相それぞれに、50から950まで11段階の明るさがあります。コンポーネントはこの色を直接使わず、次に紹介する用途別のトークンを通して使います。',
  en: 'Ten hues, each with eleven shades from 50 to 950. Components never use them directly; they go through the purpose-named tokens below.',
});

export const semanticColorsTitle = message({
  ja: '用途別の色',
  en: 'Colours by purpose',
});

export const semanticColorsDescription = message({
  ja: '文字、背景、線のように、用途ごとに名前を付けた色のトークンです。ライトとダークで別の値を持ち、テーマが切り替わると自動で値が変わるので、コンポーネントの側でダークモードを意識する必要はありません。',
  en: 'Colour tokens named for what they are used for: text, backgrounds, borders. Each has a light and a dark value and switches with the theme, so a component never has to think about dark mode.',
});

export const foregroundTitle = message({
  ja: '文字の色',
  en: 'Text',
});

export const backgroundTitle = message({
  ja: '背景の色',
  en: 'Backgrounds',
});

export const borderTitle = message({
  ja: '線の色',
  en: 'Borders',
});

export const brandColorsTitle = message({
  ja: 'ブランドの色',
  en: 'Brand colours',
});

export const brandColorsDescription = message({
  ja: '`primary`はティール、`secondary`はシアンをもとにしたブランドの色です。`group`の4色は、グラフのようにいくつかの系列を描き分けるのに使います。',
  en: '`primary` is built on teal and `secondary` on cyan. The four `group` colours tell several series apart, as in a chart.',
});

export const token = {
  'fg-base': message({
    ja: '基本のテキスト',
    en: 'Default text',
  }),
  'fg-subtle': message({
    ja: 'プレースホルダーなど最も弱いテキスト',
    en: 'Faintest text such as placeholders',
  }),
  'fg-mute': message({
    ja: '説明文やキャプションなどの補足テキスト',
    en: 'Supporting text such as descriptions and captions',
  }),
  'fg-inverse': message({
    ja: '反転背景（bg-inverse）の上に置くテキスト',
    en: 'Text placed on inverse backgrounds (bg-inverse)',
  }),
  'fg-info': message({
    ja: '情報メッセージのテキスト',
    en: 'Informational message text',
  }),
  'fg-success': message({
    ja: '成功メッセージのテキスト',
    en: 'Success message text',
  }),
  'fg-warning': message({
    ja: '警告メッセージのテキスト',
    en: 'Warning message text',
  }),
  'fg-error': message({
    ja: 'エラーメッセージのテキスト',
    en: 'Error message text',
  }),
  'bg-base': message({
    ja: 'カードなど主要な面の背景',
    en: 'Primary surfaces such as cards',
  }),
  'bg-raised': message({
    ja: 'メニューやポップオーバーなど浮き上がる面',
    en: 'Elevated surfaces such as menus and popovers',
  }),
  'bg-surface': message({
    ja: 'ページ全体の背景',
    en: 'The page background',
  }),
  'bg-subtle': message({
    ja: 'セクションの地など一段沈んだ背景',
    en: 'Recessed areas such as section backgrounds',
  }),
  'bg-mute': message({
    ja: 'ホバー状態の背景',
    en: 'Hover-state background',
  }),
  'bg-emphasize': message({
    ja: 'アクティブ状態の背景',
    en: 'Active-state background',
  }),
  'bg-inverse': message({
    ja: '反転背景。fg-inverseと組み合わせる',
    en: 'Inverse background, paired with fg-inverse',
  }),
  'bg-info': message({
    ja: '情報メッセージの背景',
    en: 'Informational message background',
  }),
  'bg-success': message({
    ja: '成功メッセージの背景',
    en: 'Success message background',
  }),
  'bg-warning': message({
    ja: '警告メッセージの背景',
    en: 'Warning message background',
  }),
  'bg-error': message({
    ja: 'エラーメッセージの背景',
    en: 'Error message background',
  }),
  'border-base': message({
    ja: '入力欄など標準のボーダー',
    en: 'Default borders such as form fields',
  }),
  'border-subtle': message({
    ja: 'ごく薄い罫線',
    en: 'Faintest hairline borders',
  }),
  'border-mute': message({
    ja: '区切り線などの控えめな罫線',
    en: 'Subdued borders and separators',
  }),
  'border-emphasize': message({
    ja: 'ホバー時などの強調ボーダー',
    en: 'Emphasized borders, e.g. on hover',
  }),
  'border-inverse': message({
    ja: '反転面の上に引くボーダー',
    en: 'Borders on inverse surfaces',
  }),
  'border-info': message({
    ja: '情報ボーダー。フォーカスリングにも使用',
    en: 'Info borders, also used for focus rings',
  }),
  'border-success': message({
    ja: '成功状態のボーダー',
    en: 'Success-state borders',
  }),
  'border-warning': message({
    ja: '警告状態のボーダー',
    en: 'Warning-state borders',
  }),
  'border-error': message({
    ja: 'エラー状態のボーダー',
    en: 'Error-state borders',
  }),
  'primary-fg': message({
    ja: 'Primaryのテキストとアイコン',
    en: 'Primary text and icons',
  }),
  'primary-bg': message({
    ja: 'Primaryの塗り。ソリッドボタンなどに',
    en: 'Primary fill, e.g. solid buttons',
  }),
  'primary-bg-subtle': message({
    ja: '最も薄いPrimary背景。選択状態の地に',
    en: 'Faintest primary background, e.g. selected states',
  }),
  'primary-bg-mute': message({
    ja: '控えめなPrimary背景',
    en: 'Muted primary background',
  }),
  'primary-bg-emphasize': message({
    ja: 'ホバー時などの強いPrimary背景',
    en: 'Emphasized primary background, e.g. on hover',
  }),
  'primary-border': message({
    ja: 'Primaryのボーダーとアクセント線',
    en: 'Primary borders and accent lines',
  }),
  'secondary-fg': message({
    ja: 'Secondaryのテキストとアイコン',
    en: 'Secondary text and icons',
  }),
  'secondary-bg': message({
    ja: 'Secondaryの塗り',
    en: 'Secondary fill',
  }),
  'secondary-bg-subtle': message({
    ja: '最も薄いSecondary背景',
    en: 'Faintest secondary background',
  }),
  'secondary-bg-mute': message({
    ja: '控えめなSecondary背景',
    en: 'Muted secondary background',
  }),
  'secondary-bg-emphasize': message({
    ja: 'ホバー時などの強いSecondary背景',
    en: 'Emphasized secondary background, e.g. on hover',
  }),
  'secondary-border': message({
    ja: 'Secondaryのボーダー',
    en: 'Secondary borders',
  }),
  'group-primary': message({
    ja: 'データ可視化の系列色1',
    en: 'Chart series color 1',
  }),
  'group-secondary': message({
    ja: 'データ可視化の系列色2',
    en: 'Chart series color 2',
  }),
  'group-tertiary': message({
    ja: 'データ可視化の系列色3',
    en: 'Chart series color 3',
  }),
  'group-quaternary': message({
    ja: 'データ可視化の系列色4',
    en: 'Chart series color 4',
  }),
};

export const primaryTitle = message({
  ja: '`primary`',
  en: '`primary`',
});

export const secondaryTitle = message({
  ja: '`secondary`',
  en: '`secondary`',
});

export const groupTitle = message({
  ja: '`group`',
  en: '`group`',
});

export const typographyTitle = message({
  ja: '文字',
  en: 'Typography',
});

export const typographyDescription = message({
  ja: '文字の大きさ、太さ、字間、行の高さのトークンです。',
  en: 'Tokens for text size, weight, letter spacing and line height.',
});

export const textSizesTitle = message({
  ja: '文字の大きさ',
  en: 'Text sizes',
});

export const fontWeightsTitle = message({
  ja: '文字の太さ',
  en: 'Font weights',
});

export const letterSpacingTitle = message({
  ja: '字間',
  en: 'Letter spacing',
});

export const lineHeightTitle = message({
  ja: '行の高さ',
  en: 'Line height',
});

export const shadowTitle = message({
  ja: '影',
  en: 'Shadows',
});

export const shadowDescription = message({
  ja: 'カードやポップオーバーのように、面を浮かせて見せるための影です。',
  en: 'Shadows that lift a surface, such as a card or a popover.',
});

export const borderRadiusTitle = message({
  ja: '角丸',
  en: 'Corner radius',
});

export const borderRadiusDescription = message({
  ja: '触れる要素ほど大きく、読む要素ほど小さな角丸を使います。',
  en: 'Larger radii for what you touch, smaller ones for what you read.',
});

export const darkModeTitle = message({
  ja: 'ダークモード',
  en: 'Dark mode',
});

export const darkModeDescription = message({
  ja: '`<html>`に`dark`クラスが付くと、用途別の色のトークンがダークの値に切り替わります。CSSの`color-scheme`プロパティも`dark`になるので、スクロールバーやフォームの部品も暗く描かれます。',
  en: 'A `dark` class on `<html>` switches the purpose-named colour tokens to their dark values. The CSS `color-scheme` property becomes `dark` too, so scrollbars and form controls are drawn dark as well.',
});

export const darkModeColorScheme = message({
  ja: 'k8ordoのアプリでは、このクラスの付け外しを`@k8ordo/color-scheme`が受け持ちます。',
  en: 'In a k8ordo application, `@k8ordo/color-scheme` adds and removes the class.',
});

export const highContrastTitle = message({
  ja: 'ハイコントラストと強制カラー',
  en: 'High contrast and forced colours',
});

export const highContrastDescription = message({
  ja: 'スタイルシートは、OSのコントラストの設定にも従います。`prefers-contrast: more`では文字と線の色が背景から一段離れ、影だけで縁取っていたカードやモーダルに線が付きます。`forced-colors: active`（Windowsのハイコントラストなど）では、境界線やフォーカスの輪、選択状態をシステムカラーで描きます。',
  en: 'The stylesheet follows the OS contrast settings too. Under `prefers-contrast: more`, text and border colours move one step further from the background, and cards and modals outlined only by a shadow gain a border. Under `forced-colors: active` (Windows High Contrast, for one), borders, focus rings and selected states are drawn in system colours.',
});

export const highContrastOwnUiDescription = message({
  ja: '自分で作るUIでは、`contrast-more:`と`forced-colors:`のバリアントを使います。強制カラーではシステムカラー以外の色が塗り替えられるので、選択状態は`Highlight`のようなシステムカラーで描いてください。',
  en: 'In your own UI, use the `contrast-more:` and `forced-colors:` variants. Forced colours repaint everything but system colours, so draw a selected state with one such as `Highlight`.',
});

export const highContrastAvoid = message({
  ja: '境界やフォーカスを`box-shadow`だけで描かないでください。強制カラーでは影が消えます。要素を隠すときも`text-transparent`ではなく`invisible`を使います。透明の色は塗り替えられて見えてしまうからです。',
  en: 'Never draw a boundary or focus with `box-shadow` alone: forced colours drop shadows. Hide with `invisible`, not `text-transparent`, since a transparent colour is repainted and shows.',
});

export const customizeTitle = message({
  ja: 'トークンを上書きする',
  en: 'Override the tokens',
});

export const customizeDescription = message({
  ja: 'トークンはどれもCSS変数なので、`@k8ordo/ui`のスタイルシートより後に読み込むCSSで同じ名前の変数を定義し直せば上書きできます。基本の色の変数（`--purple-200`など）も定義済みなので、参照先を差し替えるだけでブランドの色をまとめて変えられます。',
  en: 'Every token is a CSS variable, so redefining the same name in CSS loaded after `@k8ordo/ui`’s stylesheet overrides it. The base palette (`--purple-200` and so on) is defined too, so swapping the references changes the whole brand colour at once.',
});

export const customizeValueDescription = message({
  ja: '色の段階を参照する代わりに、値そのものを書くこともできます。ダークモードの値は`.dark`の中で、ハイコントラストの値は`@media (prefers-contrast: more)`の中の`:root`と`.dark`で定義し直します。',
  en: 'You can also write a value instead of referring to a shade. Redefine dark values under `.dark`, and high-contrast values on `:root` and `.dark` inside `@media (prefers-contrast: more)`.',
});

export const spacingTitle = message({
  ja: '余白',
  en: 'Spacing',
});

export const spacingDescription = message({
  ja: '余白の基本の単位は0.25rem（4px）です。`p-4`や`gap-6`のようなクラスは、数字×0.25remの大きさになります。',
  en: 'The base unit of spacing is 0.25rem (4px): a class such as `p-4` or `gap-6` is the number times 0.25rem.',
});

export const breakpointsTitle = message({
  ja: 'ブレイクポイント',
  en: 'Breakpoints',
});

export const breakpointsDescription = message({
  ja: '画面の幅でレイアウトを切り替えるときの境目です。',
  en: 'The widths at which layouts change.',
});

export const zIndexTitle = message({
  ja: '重なり順',
  en: 'Stacking order',
});

export const zIndexDescription = message({
  ja: '重なり順のトークンは3つあります。ただし、ポップオーバーとツールチップ、モーダルとドロワーはブラウザの最前面の層（top layer）に開きます。この層の中では開いた順に重なるので、`overlay`と`modal`は効きません。`toast`が効くのは、ページの中でのトーストの重なりだけです。',
  en: 'There are three stacking tokens. Popovers, tooltips, modals and drawers, though, open in the browser’s top layer, where they stack in the order they opened, so `overlay` and `modal` have no effect there. `toast` only orders toasts within the page.',
});
