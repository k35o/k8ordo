import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'k8ordo UIは、CSS変数ベースのデザイントークンシステムを使用しています。ライトモードとダークモードの両方に対応し、カスタマイズが容易です。',
  en: 'k8ordo UI uses a CSS variable-based design token system. It supports both light and dark modes and is easy to customize.',
});

export const colorPaletteTitle = message({
  ja: 'カラーパレット',
  en: 'Color Palette',
});

export const colorPaletteDescription = message({
  ja: '10色のベースカラーファミリーがあり、各色に50〜950の11段階のシェードが用意されています。',
  en: 'There are 10 base color families, each with 11 shades from 50 to 950.',
});

export const semanticColorsTitle = message({
  ja: 'セマンティックカラー',
  en: 'Semantic Colors',
});

export const semanticColorsDescription = message({
  ja: 'ベースカラーをもとにした用途別のカラートークンです。テーマ切り替え時に自動的に適切な値に変わります。',
  en: 'Purpose-specific color tokens derived from the base colors. They automatically adapt when switching themes.',
});

export const foregroundTitle = message({
  ja: '前景色（Foreground）',
  en: 'Foreground',
});

export const backgroundTitle = message({
  ja: '背景色（Background）',
  en: 'Background',
});

export const borderTitle = message({
  ja: 'ボーダー（Border）',
  en: 'Border',
});

export const brandColorsTitle = message({
  ja: 'ブランドカラー',
  en: 'Brand Colors',
});

export const brandColorsDescription = message({
  ja: 'PrimaryはTeal、SecondaryはCyanをベースとしたブランドカラーです。',
  en: 'Primary uses Teal and Secondary uses Cyan as their base brand colors.',
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

export const typographyTitle = message({
  ja: 'タイポグラフィ',
  en: 'Typography',
});

export const typographyDescription = message({
  ja: 'テキストサイズ、フォントウェイト、レタースペーシング、行の高さのデザイントークンです。',
  en: 'Design tokens for text sizes, font weights, letter spacing, and line heights.',
});

export const textSizesTitle = message({
  ja: 'テキストサイズ',
  en: 'Text Sizes',
});

export const fontWeightsTitle = message({
  ja: 'フォントウェイト',
  en: 'Font Weights',
});

export const letterSpacingTitle = message({
  ja: 'レタースペーシング',
  en: 'Letter Spacing',
});

export const lineHeightTitle = message({
  ja: '行の高さ',
  en: 'Line Height',
});

export const shadowTitle = message({
  ja: 'シャドウ',
  en: 'Shadow',
});

export const shadowDescription = message({
  ja: 'ボックスシャドウのデザイントークンです。',
  en: 'Design tokens for box shadows.',
});

export const borderRadiusTitle = message({
  ja: 'ボーダーラディウス',
  en: 'Border Radius',
});

export const borderRadiusDescription = message({
  ja: '角丸のデザイントークンです。',
  en: 'Design tokens for border radius values.',
});

export const darkModeTitle = message({
  ja: 'ダークモード',
  en: 'Dark Mode',
});

export const darkModeDescription = message({
  ja: 'ルート要素にdarkクラスを追加することで、ダークモードが有効になります。セマンティックカラートークンは自動的にダークモード用の値に切り替わり、CSSの`color-scheme`プロパティも`dark`になるので、スクロールバーやフォーム部品も暗く描かれます。k8ordoのアプリケーションでは、クラスの付け外しは`@k8ordo/color-scheme`が受け持ちます。',
  en: 'Add the dark class to the root element to enable dark mode. Semantic color tokens automatically switch to their dark mode values, and the CSS `color-scheme` property becomes `dark`, so scrollbars and form controls are drawn dark too. In a k8ordo application, `@k8ordo/color-scheme` adds and removes the class.',
});

export const highContrastTitle = message({
  ja: '高コントラストと強制カラー',
  en: 'High Contrast and Forced Colors',
});

export const highContrastDescription = message({
  ja: 'OSで選ぶコントラストの設定にも、スタイルシートが従います。`prefers-contrast: more`では文字と線のトークンが地の色から一段遠ざかり、影だけで縁取っていたカードやモーダルに線が付きます。`forced-colors: active`（Windowsのハイコントラストなど）では、境界線・フォーカスリング・選択状態をシステムカラーで描きます。どちらもOSの設定なので、アプリが切り替えたり保存したりするものはありません。',
  en: 'The stylesheet also follows the contrast settings a user makes in the OS. Under `prefers-contrast: more`, the text and border tokens move a step further from the ground, and cards and modals that were outlined only by a shadow gain a line. Under `forced-colors: active` (such as Windows high contrast), boundaries, focus rings, and selected states are drawn with system colors. Both are OS settings, so there is nothing for an application to toggle or store.',
});

export const highContrastOwnUiDescription = message({
  ja: '自前のUIでは`contrast-more:`と`forced-colors:`のバリアントを使います。強制カラーではシステムカラー以外は塗り替えられるので、状態は`Highlight`などで描きます。境界やフォーカスを`box-shadow`だけで描かず、`text-transparent`で隠さないでください（強制カラーで塗られて見えてしまうので、`invisible`を使います）。',
  en: 'In your own UI, use the `contrast-more:` and `forced-colors:` variants. Under forced colors every color except a system color is repainted, so draw state with one such as `Highlight`. Do not draw a boundary or a focus ring with `box-shadow` alone, and do not hide something with `text-transparent` (forced colors paints it, so use `invisible`).',
});

export const customizeTitle = message({
  ja: 'トークンを上書きする',
  en: 'Overriding Tokens',
});

export const customizeDescription = message({
  ja: 'すべてのトークンはCSS変数なので、k8ordo UIのスタイルシートより後に読み込むCSSで同名の変数を再定義すれば上書きできます。ベースカラーの変数（`--purple-200`など）も定義済みなので、参照を差し替えるだけでブランドカラーを丸ごと切り替えられます。ダークモードの値は`.dark`側で、高コントラストの値は`@media (prefers-contrast: more)`の中の`:root`と`.dark`で再定義します。',
  en: 'Every token is a CSS variable, so redefining the same variable in CSS loaded after the k8ordo UI stylesheet overrides it. The base color variables (such as `--purple-200`) are also defined, so swapping the references switches the whole brand color at once. Redefine the dark mode values under `.dark`, and the high-contrast values on `:root` and `.dark` inside `@media (prefers-contrast: more)`.',
});

export const customizeValueDescription = message({
  ja: 'シェードの参照ではなく、値そのものを直接指定することもできます。',
  en: 'You can also assign a raw value directly instead of referencing a shade.',
});

export const spacingTitle = message({
  ja: 'スペーシング',
  en: 'Spacing',
});

export const spacingDescription = message({
  ja: 'スペーシングスケールです。基本単位は0.25rem（4px）で、p-{n}やgap-{n}はn × 0.25remに計算されます。',
  en: 'The spacing scale. The base unit is 0.25rem (4px), and p-{n} or gap-{n} computes to n × 0.25rem.',
});

export const breakpointsTitle = message({
  ja: 'ブレイクポイント',
  en: 'Breakpoints',
});

export const breakpointsDescription = message({
  ja: 'レスポンシブブレイクポイントです。',
  en: 'Responsive breakpoints.',
});

export const zIndexTitle = message({
  ja: 'Z-Indexレイヤ',
  en: 'Z-Index Layers',
});

export const zIndexDescription = message({
  ja: 'オーバーレイ系コンポーネントに付く3層のz-indexスケールです。ただしtriggerに紐付く浮遊UI（Popover / DropdownMenu / ListBox / Tooltip）とModal / Drawerはブラウザのトップレイヤーに表示され、z-indexに関係なく開いた順に重なるため、overlayとmodalはトップレイヤーの中では効きません。toastが効くのは文書内でのToastの重なりだけで、Modalの中のToastはModal自身のToastProviderが`dialog`要素の中に表示します。',
  en: 'A three-tier z-index scale carried by the overlay components. Anchored floating UI (Popover / DropdownMenu / ListBox / Tooltip) and Modal / Drawer render in the browser top layer, where they stack in the order they opened regardless of z-index, so overlay and modal have no effect there. toast only orders Toast within the document; a Toast inside a Modal is shown within its `dialog` element by the Modal’s own ToastProvider.',
});
