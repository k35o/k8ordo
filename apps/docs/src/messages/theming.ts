import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/ui`の色、余白、文字を決めるデザイントークンの一覧です。トークンはCSS変数なので、定義し直せばアプリの色に合わせられます。',
  en: 'The design tokens behind the colors, spacing and type of `@k8ordo/ui`. Each token is a CSS variable, so redefining it fits the library to your application.',
});

export const semanticColorsTitle = message({
  ja: '用途別の色',
  en: 'Colors by purpose',
});

export const semanticColorsIntro = message({
  ja: '文字と背景と線のように、用途で名前を付けた色です。ライトとダークで別の値を持ち、`dark`クラスで切り替わります。',
  en: 'Colors named for their purpose: text, backgrounds and borders. Each has a light and a dark value, and the `dark` class switches between them.',
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
  en: 'Brand colors',
});

export const brandColorsIntro = message({
  ja: '`primary`はティール、`secondary`はシアンです。`group`の4色は、グラフの系列のように複数のデータを描き分けるときに使います。',
  en: '`primary` is teal and `secondary` is cyan. The four `group` colors tell data series apart, as in a chart.',
});

export const token = {
  'fg-base': message({
    ja: '本文の文字',
    en: 'Body text',
  }),
  'fg-subtle': message({
    ja: 'プレースホルダーなど、最も薄い文字',
    en: 'The faintest text, such as placeholders',
  }),
  'fg-mute': message({
    ja: '説明やキャプションなど、補足の文字',
    en: 'Supporting text, such as descriptions and captions',
  }),
  'fg-inverse': message({
    ja: 'bg-inverseの上に置く文字',
    en: 'Text on bg-inverse',
  }),
  'fg-info': message({
    ja: '情報メッセージの文字',
    en: 'Informational message text',
  }),
  'fg-success': message({
    ja: '成功メッセージの文字',
    en: 'Success message text',
  }),
  'fg-warning': message({
    ja: '警告メッセージの文字',
    en: 'Warning message text',
  }),
  'fg-error': message({
    ja: 'エラーメッセージの文字',
    en: 'Error message text',
  }),
  'bg-base': message({
    ja: 'カードの背景',
    en: 'Card background',
  }),
  'bg-raised': message({
    ja: 'モーダルやメニューなど、重ねて開く要素の背景',
    en: 'Background of overlays such as modals and menus',
  }),
  'bg-surface': message({
    ja: '最も外側の背景。ライトではbg-subtleより明るく、ダークでは暗い',
    en: 'The outermost background: lighter than bg-subtle in light mode, darker in dark mode',
  }),
  'bg-subtle': message({
    ja: 'ページの背景',
    en: 'Page background',
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
    ja: '反転した背景。fg-inverseと組み合わせる',
    en: 'Inverted background, paired with fg-inverse',
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
    ja: '入力欄など、標準の線',
    en: 'Standard borders, such as form fields',
  }),
  'border-subtle': message({
    ja: '最も薄い線',
    en: 'The faintest borders',
  }),
  'border-mute': message({
    ja: '区切りなど、控えめな線',
    en: 'Restrained borders, such as separators',
  }),
  'border-emphasize': message({
    ja: 'ホバー時など、強調する線',
    en: 'Emphasized borders, as on hover',
  }),
  'border-inverse': message({
    ja: 'bg-inverseの上に引く線',
    en: 'Borders on bg-inverse',
  }),
  'border-info': message({
    ja: '情報の線。フォーカスリングにも使う',
    en: 'Information borders, also the focus ring',
  }),
  'border-success': message({
    ja: '成功状態の線',
    en: 'Success-state borders',
  }),
  'border-warning': message({
    ja: '警告状態の線',
    en: 'Warning-state borders',
  }),
  'border-error': message({
    ja: 'エラー状態の線',
    en: 'Error-state borders',
  }),
  'primary-fg': message({
    ja: 'primaryの文字とアイコン',
    en: 'Primary text and icons',
  }),
  'primary-bg': message({
    ja: 'primaryの塗り。solidのボタンなど',
    en: 'Primary fill, as in a solid button',
  }),
  'primary-bg-subtle': message({
    ja: '最も薄いprimaryの背景。選択状態など',
    en: 'The faintest primary background, as in a selected state',
  }),
  'primary-bg-mute': message({
    ja: '控えめなprimaryの背景',
    en: 'Restrained primary background',
  }),
  'primary-bg-emphasize': message({
    ja: 'ホバー時など、強いprimaryの背景',
    en: 'Emphasized primary background, as on hover',
  }),
  'primary-border': message({
    ja: 'primaryの線',
    en: 'Primary borders',
  }),
  'secondary-fg': message({
    ja: 'secondaryの文字とアイコン',
    en: 'Secondary text and icons',
  }),
  'secondary-bg': message({
    ja: 'secondaryの塗り',
    en: 'Secondary fill',
  }),
  'secondary-bg-subtle': message({
    ja: '最も薄いsecondaryの背景',
    en: 'The faintest secondary background',
  }),
  'secondary-bg-mute': message({
    ja: '控えめなsecondaryの背景',
    en: 'Restrained secondary background',
  }),
  'secondary-bg-emphasize': message({
    ja: 'ホバー時など、強いsecondaryの背景',
    en: 'Emphasized secondary background, as on hover',
  }),
  'secondary-border': message({
    ja: 'secondaryの線',
    en: 'Secondary borders',
  }),
  'group-primary': message({
    ja: '1つ目の系列',
    en: 'First data series',
  }),
  'group-secondary': message({
    ja: '2つ目の系列',
    en: 'Second data series',
  }),
  'group-tertiary': message({
    ja: '3つ目の系列',
    en: 'Third data series',
  }),
  'group-quaternary': message({
    ja: '4つ目の系列',
    en: 'Fourth data series',
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

export const colorPaletteTitle = message({
  ja: '基本の色',
  en: 'Base palette',
});

export const colorPaletteShades = message({
  ja: '10の色相に、50から950まで11段階の明るさがあります。グレー以外の色相は明るさの段階をそろえているので、段階が同じならコントラストもほぼ同じです。',
  en: 'Ten hues, each in eleven shades from 50 to 950. The hues other than gray share one lightness scale, so the same shade gives close to the same contrast.',
});

export const colorPaletteUsage = message({
  ja: 'コンポーネントはこの色を直接使いません。上の用途別の色を通して使います。',
  en: 'Components never use these colors directly. They go through the colors by purpose above.',
});

export const customizeTitle = message({
  ja: 'トークンの上書き',
  en: 'Overriding tokens',
});

export const customizeHow = message({
  ja: 'トークンは`:root`と`.dark`に、レイヤーの外で定義されています。`@k8ordo/ui`のスタイルシートより後に読み込むCSSで同じ名前を定義すると、上書きできます。',
  en: 'Tokens are declared on `:root` and `.dark`, outside any layer. Redefine a name in CSS loaded after the `@k8ordo/ui` stylesheet to override it.',
});

export const customizePalette = message({
  ja: '基本の色も`--purple-200`のような変数で定義されています。参照先を差し替えると、ブランドの色がまとめて変わります。参照の代わりに値をそのまま書いても構いません。',
  en: 'The base palette is defined as variables too, such as `--purple-200`. Point the tokens at another hue and the brand color changes as a whole. A literal value works as well as a reference.',
});

export const customizeContrast = message({
  ja: 'ハイコントラストの値は、`@media (prefers-contrast: more)`の中の`:root`と`.dark`で定義し直します。',
  en: 'High-contrast values are redefined on `:root` and `.dark` inside `@media (prefers-contrast: more)`.',
});

export const typographyTitle = message({
  ja: '文字',
  en: 'Typography',
});

export const textSizesTitle = message({
  ja: '文字の大きさ',
  en: 'Text sizes',
});

export const fontWeightsTitle = message({
  ja: '文字の太さ',
  en: 'Font weights',
});

export const fontWeightsNote = message({
  ja: 'テーマが定義する太さは`font-medium`と`font-bold`の2つです。`font-medium`は450で、一般的な500より細くしています。',
  en: 'The theme defines two weights, `font-medium` and `font-bold`. `font-medium` is 450, lighter than the usual 500.',
});

export const letterSpacingTitle = message({
  ja: '字間',
  en: 'Letter spacing',
});

export const lineHeightTitle = message({
  ja: '行の高さ',
  en: 'Line height',
});

export const borderRadiusTitle = message({
  ja: '角丸',
  en: 'Corner radius',
});

export const borderRadiusRoles = message({
  ja: '角丸は要素の役割で変えます。ボタンは`rounded-full`、入力欄とカードは`rounded-xl`、チェックボックスは`rounded-md`です。',
  en: 'The radius follows the element’s role: `rounded-full` for buttons, `rounded-xl` for inputs and cards, `rounded-md` for checkboxes.',
});

export const shadowTitle = message({
  ja: '影',
  en: 'Shadows',
});

export const shadowUsage = message({
  ja: 'カードやポップオーバーに付ける影です。カードは`shadow-sm`、モーダルとメニューは`shadow-md`を使います。`shadow-xl`以上の強い影は使いません。',
  en: 'Shadows for cards and popovers. Cards use `shadow-sm`, and modals and menus use `shadow-md`. `shadow-xl` and anything heavier are never used.',
});

export const spacingTitle = message({
  ja: '余白',
  en: 'Spacing',
});

export const spacingUnit = message({
  ja: '余白の単位は0.25rem（4px）です。`p-4`や`gap-6`のようなクラスは、数字×0.25remの大きさになります。',
  en: 'The spacing unit is 0.25rem (4px). A class such as `p-4` or `gap-6` is that number times 0.25rem.',
});

export const breakpointsTitle = message({
  ja: 'ブレイクポイント',
  en: 'Breakpoints',
});

export const breakpointsUsage = message({
  ja: '画面の幅でレイアウトを切り替える境目です。`sm:`のようなバリアントで、その幅以上に当てるスタイルを書きます。',
  en: 'The widths at which a layout changes. A variant such as `sm:` applies a style from that width up.',
});

export const zIndexTitle = message({
  ja: '重なり順',
  en: 'Stacking order',
});

export const zIndexTopLayer = message({
  ja: '表の`overlay`と`modal`の行のコンポーネントは、どれもブラウザのtop layerに開きます。top layerの中では開いた順に重なるので、この2つの値は効きません。',
  en: 'Every component in the `overlay` and `modal` rows of the table opens in the browser’s top layer. There, elements stack in the order they opened, so those two values have no effect.',
});

export const zIndexToast = message({
  ja: '`toast`が決めるのは、ページの中でのトーストの重なり順だけです。',
  en: '`toast` only orders toasts within the page.',
});

export const darkModeTitle = message({
  ja: 'ダークモード',
  en: 'Dark mode',
});

export const darkModeClass = message({
  ja: '`<html>`に`dark`クラスを付けると、ページ全体がダークの値に切り替わります。',
  en: 'Add the `dark` class to `<html>` to switch the whole page to the dark values.',
});

export const darkModeColorScheme = message({
  ja: 'CSSの`color-scheme`プロパティも`.dark`の下で`dark`になり、スクロールバーやフォームのコントロールも暗く描かれます。`tailwind.css`では、`dark:`バリアントが`.dark`の下で効きます。',
  en: 'The CSS `color-scheme` property becomes `dark` under `.dark` too, so scrollbars and form controls are drawn dark. With `tailwind.css`, the `dark:` variant applies under `.dark`.',
});

export const darkModeLibraryBefore = message({
  ja: 'このクラスは`@k8ordo/ui`自身は付けません。k8ordoのアプリでは',
  en: '`@k8ordo/ui` never adds the class itself. In a k8ordo application, ',
});

export const darkModeLibraryAfter = message({
  ja: 'が最初の描画の前に付けます。',
  en: ' adds it before the first paint.',
});

export const highContrastTitle = message({
  ja: 'ハイコントラスト',
  en: 'High contrast',
});

export const highContrastOwnUi = message({
  ja: '自分で作るUIでは、`contrast-more:`と`forced-colors:`のバリアントを使います。強制カラーではシステムカラーだけが残るので、選択状態は`Highlight`のようなシステムカラーで塗ります。',
  en: 'In your own UI, use the `contrast-more:` and `forced-colors:` variants. Under forced colors only system colors apply, so paint a selected state with one such as `Highlight`.',
});

export const highContrastStylesheet = message({
  ja: 'コンポーネントのスタイルシートはOSの設定に従います。`prefers-contrast: more`では、文字と線の色の背景とのコントラストが上がります。影だけで区切っていたカードやモーダルには線が付きます。`forced-colors: active`では、境界線とフォーカスリングと選択状態をシステムカラーで描きます。',
  en: 'The component stylesheet follows the OS settings. Under `prefers-contrast: more`, text and border colors gain contrast against their background, and cards and modals that relied on a shadow gain a border. Under `forced-colors: active`, borders, focus rings and selected states use system colors.',
});

export const highContrastAvoid = message({
  ja: '境界やフォーカスリングを`box-shadow`だけで描かないでください。強制カラーでは影が消えます。要素を隠すときは`invisible`を使い、`text-transparent`は使わないでください。強制カラーでは透明の色も塗られて見えます。',
  en: 'Do not draw a border or a focus ring with `box-shadow` alone, since forced colors remove shadows. To hide an element, use `invisible`, not `text-transparent`. Under forced colors, a transparent color is painted too and shows.',
});
