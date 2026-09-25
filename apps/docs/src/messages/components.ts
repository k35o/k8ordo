import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'k8ordo UIが提供するUIコンポーネントの一覧です。',
  en: 'A catalog of UI components provided by k8ordo UI.',
});

export const categoryButtons = message({
  ja: 'Buttons',
  en: 'Buttons',
});

export const categoryNavigation = message({
  ja: 'Navigation',
  en: 'Navigation',
});

export const categoryForms = message({
  ja: 'Forms',
  en: 'Forms',
});

export const categoryDataDisplay = message({
  ja: 'Data Display',
  en: 'Data Display',
});

export const categoryFeedback = message({
  ja: 'Feedback',
  en: 'Feedback',
});

export const categoryOverlays = message({
  ja: 'Overlays',
  en: 'Overlays',
});

export const categoryLayout = message({
  ja: 'Layout',
  en: 'Layout',
});

export const categoryObservers = message({
  ja: 'Observers',
  en: 'Observers',
});

export const categoryMedia = message({
  ja: 'Media',
  en: 'Media',
});

export const common = {
  storybookLink: message({
    ja: 'Storybookで確認',
    en: 'View in Storybook',
  }),
  importTitle: message({
    ja: 'インポート',
    en: 'Import',
  }),
  usageTitle: message({
    ja: '使い方',
    en: 'Usage',
  }),
  propsTitle: message({
    ja: 'Props',
    en: 'Props',
  }),
  inheritsLabel: message({
    ja: '型ベース（内部で固定する一部attrsは除外）:',
    en: 'Type base (some attrs are managed internally):',
  }),
  messagesNote: message({
    ja: 'このコンポーネントが描画する文言（ラベルやプレースホルダーなど）は、propsで指定しないとき文言辞書から解決されます。差し替え方は次を参照してください:',
    en: 'Wording this component renders (labels, placeholders, and the like) comes from the message dictionary when no prop sets it. To change it, see:',
  }),
  basicUsageTitle: message({
    ja: '基本的な使い方',
    en: 'Basic Usage',
  }),
};

export const button = {
  description: message({
    ja: 'ユーザー操作を受け付けるボタン',
    en: 'A button component that triggers user actions.',
  }),
  variantsTitle: message({
    ja: 'バリアント',
    en: 'Variants',
  }),
  colorsTitle: message({
    ja: 'カラー',
    en: 'Colors',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  iconsTitle: message({
    ja: 'アイコン付き',
    en: 'With Icons',
  }),
  fullWidthTitle: message({
    ja: 'Full Width',
    en: 'Full Width',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  renderItemTitle: message({
    ja: 'リンクとしてレンダリング',
    en: 'Render as Link',
  }),
};

export const iconButton = {
  description: message({
    ja: 'アイコンのみのボタン',
    en: 'An icon-only button component.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  backgroundsTitle: message({
    ja: '背景',
    en: 'Backgrounds',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  renderItemTitle: message({
    ja: 'リンクとしてレンダリング',
    en: 'Render as Link',
  }),
};

export const copyButton = {
  description: message({
    ja: 'テキストをクリップボードにコピーし、コピーしたことを伝えるボタン',
    en: 'A button that copies text to the clipboard and shows that it did.',
  }),
  feedbackDescription: message({
    ja: '押すとアイコンが2秒間チェックに変わり（失敗したらエラーのアイコン）、隣のライブリージョンが「コピーしました」を読み上げます。ボタンの名前は変わりません。',
    en: 'When pressed, its icon turns into a check for two seconds (an error icon if the write fails), and a live region beside it announces “Copied”. The button keeps its name.',
  }),
  iconOnlyTitle: message({
    ja: 'アイコンだけ',
    en: 'Icon Only',
  }),
  iconOnlyDescription: message({
    ja: '`iconOnly`を付けると透明なIconButtonになり、`label`はツールチップとアクセシブルネームになります。',
    en: 'With `iconOnly` it becomes a transparent IconButton, and `label` becomes its tooltip and accessible name.',
  }),
  lazyValueTitle: message({
    ja: '押したときに中身を作る',
    en: 'Building the Text on Click',
  }),
  lazyValueDescription: message({
    ja: '`value`には関数も渡せ、Promiseを返してもかまいません。関数は押したときに呼ばれ、PromiseはそのままClipboardItemに渡るので、中身が後から届いても書き込みはクリックの中で始まります（Safariは`await`の後に始めた書き込みを拒みます）。',
    en: '`value` can also be a function, and it may return a Promise. It is called on the click, and the promise goes to a ClipboardItem as it is, so the write starts inside the click even when the text arrives later (Safari refuses a write that begins after an `await`).',
  }),
};

export const anchor = {
  description: message({
    ja: 'テキストリンク',
    en: 'A text link component.',
  }),
  openInNewTabTitle: message({
    ja: '新しいタブで開く',
    en: 'Open in New Tab',
  }),
  renderAnchorTitle: message({
    ja: 'render propで要素差し替え',
    en: 'Swap element via render prop',
  }),
  renderAnchorDescription: message({
    ja: 'Next.jsのLinkなど、フレームワーク固有のanchorコンポーネントに差し替えるにはrenderAnchorを渡してください。受け取ったpropsはすべて差し替え後の要素にスプレッドしてください。',
    en: 'Pass renderAnchor to swap the element to a framework-specific anchor (e.g. Next.js Link). Spread all received props onto the replacement element.',
  }),
};

export const textField = {
  description: message({
    ja: 'テキスト入力フィールド',
    en: 'A text input field.',
  }),
  placeholderTitle: message({
    ja: 'プレースホルダー',
    en: 'Placeholder',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
};

export const textarea = {
  description: message({
    ja: '複数行のテキスト入力フィールド',
    en: 'A multi-line text input field.',
  }),
  rowsTitle: message({
    ja: '行数',
    en: 'Rows',
  }),
  autoResizeTitle: message({
    ja: '自動リサイズ',
    en: 'Auto Resize',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
};

export const numberField = {
  description: message({
    ja: '数値入力フィールド',
    en: 'A number input field.',
  }),
  stepPrecisionTitle: message({
    ja: 'ステップと小数点以下の桁数',
    en: 'Step & Precision',
  }),
  minMaxTitle: message({
    ja: '最小値 / 最大値',
    en: 'Min / Max',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
};

export const select = {
  description: message({
    ja: '選択肢から値を選ぶセレクトボックス',
    en: 'A select box to choose from options.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
  requiredTitle: message({
    ja: '必須',
    en: 'Required',
  }),
  defaultValueTitle: message({
    ja: 'デフォルト値',
    en: 'Default Value',
  }),
};

export const checkbox = {
  description: message({
    ja: 'チェックボックス',
    en: 'A checkbox component.',
  }),
  defaultCheckedTitle: message({
    ja: 'デフォルトチェック',
    en: 'Default Checked',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
};

export const checkboxCard = {
  description: message({
    ja: '選択肢をカードで見せる複数選択',
    en: 'A multi-select card group that makes each option a larger click target.',
  }),
  defaultValueTitle: message({
    ja: 'デフォルト値',
    en: 'Default Value',
  }),
};

export const checkboxGroup = {
  description: message({
    ja: '複数のチェックボックスをひとつの値として扱うグループ',
    en: 'A group that manages multiple checkboxes as a single array value.',
  }),
  defaultValueTitle: message({
    ja: 'デフォルト値',
    en: 'Default Value',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

// `switch` は予約語なので、この 1 つだけ Input を付ける
export const switchInput = {
  description: message({
    ja: 'オン・オフを切り替えるスイッチ',
    en: 'A switch component for binary on/off state.',
  }),
  defaultCheckedTitle: message({
    ja: 'デフォルトチェック',
    en: 'Default Checked',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
};

export const passwordInput = {
  description: message({
    ja: '表示切り替え付きのパスワード入力フィールド',
    en: 'A password field with a built-in visibility toggle.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const radio = {
  description: message({
    ja: 'ラジオボタングループ',
    en: 'A radio button group.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
};

export const radioCard = {
  description: message({
    ja: '選択肢をカードで見せる単一選択',
    en: 'A single-select card group for larger, more descriptive choices.',
  }),
  defaultValueTitle: message({
    ja: 'デフォルト値',
    en: 'Default Value',
  }),
  formTitle: message({
    ja: 'フォーム連携',
    en: 'Form Integration',
  }),
  formDescription: message({
    ja: '中身は本物のinput[type=radio] なので、nameを渡せばブラウザが同じ名前のラジオをグループにまとめ、選択値はFormDataからそのまま取り出せます。',
    en: 'The cards are backed by real input[type=radio] elements, so passing name lets the browser group them and the selected value comes straight out of FormData.',
  }),
};

export const autocomplete = {
  description: message({
    ja: '入力補完付きの選択フィールド',
    en: 'A selection component with autocomplete.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
  requiredTitle: message({
    ja: '必須',
    en: 'Required',
  }),
  multipleSelectionTitle: message({
    ja: '複数選択',
    en: 'Multiple Selection',
  }),
};

export const dateField = {
  description: message({
    ja: 'ブラウザの日付入力（`type="date"`）をそのまま使う入力欄。値は `YYYY-MM-DD`',
    en: 'A field on the browser’s own date input (`type="date"`). The value is `YYYY-MM-DD`.',
  }),
  minMaxTitle: message({
    ja: '最小値 / 最大値',
    en: 'Min / Max',
  }),
  minMaxDescription: message({
    ja: '範囲の判定はブラウザが持ちます。範囲の外の日付は `rangeUnderflow` / `rangeOverflow` になります。',
    en: 'The browser checks the range itself: a date outside it reports `rangeUnderflow` / `rangeOverflow`.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
  formTitle: message({
    ja: '@k8ordo/form と使う',
    en: 'With @k8ordo/form',
  }),
  formDescription: message({
    ja: '`z.iso.date()` から導いた `input` をそのまま spread できます。`type` を取り除く必要はありません。',
    en: 'Spread the `input` derived from `z.iso.date()` as is. There is no need to take `type` out.',
  }),
};

export const datePicker = {
  description: message({
    ja: '日付入力と、ポップオーバーで開くカレンダーを組み合わせた入力欄',
    en: 'A date input paired with a calendar that opens in a popover.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  controlledDescription: message({
    ja: "`onChange` は値（`YYYY-MM-DD`、空なら `''`）を受け取ります。カレンダーで選んだときも、打ち込んだときも同じです。",
    en: "`onChange` receives the value (`YYYY-MM-DD`, `''` when empty), whether the date was typed or picked from the calendar.",
  }),
  minMaxTitle: message({
    ja: '最小値 / 最大値',
    en: 'Min / Max',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  formTitle: message({
    ja: '@k8ordo/form と使う',
    en: 'With @k8ordo/form',
  }),
  formDescription: message({
    ja: 'カレンダーで選んだ日付は入力欄に書き込まれ、`input` イベントで知らされます。フォームには打ち込んだときと同じように伝わります（変更の有無、ルール、エラーの解除）。',
    en: 'A date picked from the calendar is written into the input and announced with an `input` event, so the form hears it just as if it had been typed (dirty state, rules, clearing an error).',
  }),
  firefoxNote: message({
    ja: 'Firefox は日付入力の中に自前のカレンダーボタンを描き、それを消す方法がありません。そのため Firefox ではカレンダーのボタンが 2 つ並びます。',
    en: 'Firefox draws its own calendar button inside every date input and offers no way to hide it, so there the field shows two calendar buttons.',
  }),
};

export const calendar = {
  description: message({
    ja: '月の表から日付を 1 つ選ぶカレンダー。値は `YYYY-MM-DD`',
    en: 'A month grid for picking one day. The value is `YYYY-MM-DD`.',
  }),
  keyboardTitle: message({
    ja: 'キーボード操作',
    en: 'Keyboard',
  }),
  keyboardDescription: message({
    ja: '矢印キーで日と週を、`Home` / `End` で週の端を、`PageUp` / `PageDown` で月を（`Shift` と一緒なら年を）移り、`Enter` / `Space` で選びます。',
    en: 'Arrow keys move by day and week, `Home` / `End` to the ends of the week, `PageUp` / `PageDown` by month (by year with `Shift`), and `Enter` / `Space` select.',
  }),
  minMaxTitle: message({
    ja: '最小値 / 最大値',
    en: 'Min / Max',
  }),
  localeTitle: message({
    ja: '言語と「今日」',
    en: 'Language and today',
  }),
  localeDescription: message({
    ja: '月名・曜日名・週の始まりはページの言語（`<html lang>`）に従います。今日は閲覧者のタイムゾーンでしか決まらないので、カレンダーはブラウザでだけ描かれ、サーバーは同じ寸法の空の箱を書きます。',
    en: 'Month and weekday names, and the first day of the week, follow the page language (`<html lang>`). Today depends on the visitor’s time zone, so the calendar renders in the browser alone; the server writes an empty box of the same size.',
  }),
};

export const slider = {
  description: message({
    ja: '単一ノブのスライダー入力',
    en: 'A single-thumb slider input with a styled track and handle.',
  }),
  minMaxStepTitle: message({
    ja: '最小値 / 最大値 / ステップ',
    en: 'Min / Max / Step',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const fileField = {
  description: message({
    ja: 'ファイルアップロードフィールド',
    en: 'A file upload field.',
  }),
  dropzoneTitle: message({
    ja: 'ドロップで追加する',
    en: 'Adding files by dropping them',
  }),
  dropzoneDescription: message({
    ja: '`FileField.Dropzone` にドロップしたファイルは、選んだときと同じく一覧と送信に加わり、`input` イベントでフォームに知らされます。中身を渡さないと、組み込みの案内と「ファイルを選択」のボタンが入るので、キーボードでも選べます。フォルダーはドロップでは受けず、`accept` もドロップでは確かめません。',
    en: 'Files dropped on `FileField.Dropzone` join the list and the submission just as picked ones do, and an `input` event tells the form. Left empty, it holds the built-in hint and a choose-files button, so it works by keyboard too. Folders are skipped on drop, and `accept` is not checked there.',
  }),
  acceptTypesTitle: message({
    ja: '受け入れタイプ',
    en: 'Accept Types',
  }),
  multipleFilesTitle: message({
    ja: '複数ファイル',
    en: 'Multiple Files',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  invalidTitle: message({
    ja: 'エラー',
    en: 'Invalid',
  }),
};

export const formControl = {
  description: message({
    ja: 'ラベルやエラー表示を付けるフォームラッパー',
    en: 'A form control wrapper providing labels and error display.',
  }),
  helpTextTitle: message({
    ja: 'ヘルプテキスト',
    en: 'Help Text',
  }),
  errorTextTitle: message({
    ja: 'エラーテキスト',
    en: 'Error Text',
  }),
  requiredTitle: message({
    ja: '必須',
    en: 'Required',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const form = {
  description: message({
    ja: 'form actionパターンで送信を扱うフォームラッパー',
    en: 'A form wrapper that accepts an action prop and handles submission via the Async React form action pattern.',
  }),
  actionStateTitle: message({
    ja: 'useActionStateと組み合わせる',
    en: 'With useActionState',
  }),
};

export const accordion = {
  description: message({
    ja: '折りたたみできるコンテンツパネル',
    en: 'A collapsible content panel.',
  }),
  defaultOpenTitle: message({
    ja: 'デフォルトで開く',
    en: 'Default Open',
  }),
  multipleDefaultOpenTitle: message({
    ja: '複数デフォルトで開く',
    en: 'Multiple Default Open',
  }),
};

export const avatar = {
  description: message({
    ja: 'フォールバック付きのプロフィール画像',
    en: 'A profile image component with fallback.',
  }),
  withImageTitle: message({
    ja: '画像付き',
    en: 'With Image',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
};

export const badge = {
  description: message({
    ja: 'ステータスやカテゴリを示すコンパクトなラベル',
    en: 'A compact status or category label.',
  }),
  tonesTitle: message({
    ja: 'トーン',
    en: 'Tones',
  }),
  variantsTitle: message({
    ja: 'バリアント',
    en: 'Variants',
  }),
  interactiveTitle: message({
    ja: 'インタラクティブ',
    en: 'Interactive',
  }),
};

export const card = {
  description: message({
    ja: 'コンテンツをまとめるカード',
    en: 'A card for grouping content.',
  }),
  widthTitle: message({
    ja: 'Width',
    en: 'Width',
  }),
  interactiveDescription: message({
    ja: 'interactiveを付けるとホバー・アクティブ時にスケールする。カード全体をリンクやボタンにする際に使う。',
    en: 'With the interactive prop, the card scales on hover and active. Use it to make the whole card a link or button.',
  }),
};

export const code = {
  description: message({
    ja: 'インラインのコード表示',
    en: 'An inline code display component.',
  }),
  colorDetectionTitle: message({
    ja: 'カラー検出',
    en: 'Color Detection',
  }),
};

export const codeBlock = {
  description: message({
    ja: 'サーバーでハイライトし、コピーボタンを添えたコードブロック',
    en: 'A code block highlighted on the server, with a copy button.',
  }),
  importDescription: message({
    ja: 'ハイライトはサーバーで済ませ、shiki はブラウザに送らない。`server-only` を import しているので、Client Component から読み込むとビルドが止まる。そのためルートとは別の入口にある。',
    en: 'Highlighting happens on the server, and shiki never reaches the browser. It imports `server-only`, so importing it from a Client Component fails the build, which is why it has an entry of its own.',
  }),
  titleTitle: message({
    ja: 'ファイル名',
    en: 'File Name',
  }),
  titleDescription: message({
    ja: '`title` を渡すと、見出しの行に言語の代わりに表示する（figure の figcaption になる）。',
    en: 'With `title`, the header shows it in place of the language, as the figure’s figcaption.',
  }),
  marksTitle: message({
    ja: '行の印',
    en: 'Line Marks',
  }),
  marksDescription: message({
    ja: '`marks` は 1 始まりの行番号ごとに `highlight`・`add`・`remove` を付ける。追加と削除は色だけでなく `+` と `−` でも示す。',
    en: '`marks` marks lines by their 1-based number with `highlight`, `add`, or `remove`. Additions and removals are shown with `+` and `−`, not by color alone.',
  }),
  calloutsTitle: message({
    ja: '注記',
    en: 'Callouts',
  }),
  calloutsDescription: message({
    ja: '`callouts` は行の直後に、その行の字下げに揃えて注記を置く（配列なら書いた順に重ねる）。コピーされるのは `code` そのもので、印や注記は含まれない。',
    en: '`callouts` puts a note right under a line, indented like the line (an array puts several, in order). The copy button copies `code` exactly, without the marks or the notes.',
  }),
  colorsTitle: message({
    ja: '色とダークモード',
    en: 'Colors and Dark Mode',
  }),
  colorsDescription: message({
    ja: 'shiki の css-variables テーマを使い、`--shiki-token-*` を ui のトークンに結びつけている。トークンが `.dark` で切り替わるので、ダーク用のテーマは持たない。知らない言語名は色を付けずに描く。',
    en: 'It uses shiki’s css-variables theme, with each `--shiki-token-*` mapped to a design token. The tokens switch under `.dark`, so there is no second theme. A language name shiki does not know renders as plain text.',
  }),
};

export const kbd = {
  description: message({
    ja: 'キーボードのキーを、キーキャップとして示す',
    en: 'A keyboard key, drawn as a key cap.',
  }),
  combinationTitle: message({
    ja: 'キーの組み合わせ',
    en: 'Key Combinations',
  }),
  combinationDescription: message({
    ja: '同時に押すキーは、1 キーずつ `Kbd` を並べる。',
    en: 'For keys pressed together, place one `Kbd` per key side by side.',
  }),
  labelTitle: message({
    ja: '記号のキー',
    en: 'Symbol Keys',
  }),
  labelDescription: message({
    ja: '`⌘` や `⇧` のような記号は、読み上げると意味が通らない。`label` を渡すと、見た目は記号のまま、読み上げには `label` が使われる。',
    en: 'A symbol such as `⌘` or `⇧` makes no sense read aloud. Pass `label`: the symbol stays on screen, and the label is what a screen reader says.',
  }),
};

export const carousel = {
  description: message({
    ja: 'スクロールスナップで 1 枚ずつ止まるスライドと、前後のボタン',
    en: 'Slides that snap one at a time as they scroll, with previous and next buttons.',
  }),
  basicDescription: message({
    ja: 'トラックはスクロール領域そのもの。ボタンのほかに、トラックパッドやスワイプ、トラックにフォーカスを置いた矢印キーでも送れる。1 枚ずつ見せるときは「2 / 4」のように位置を示す。',
    en: 'The track is itself a scroll container, so besides the buttons it moves with a trackpad, a swipe, or the arrow keys once the track has focus. When one slide shows at a time, the position is shown as "2 / 4".',
  }),
  slideSizeTitle: message({
    ja: 'スライドの幅',
    en: 'Slide Size',
  }),
  slideSizeDescription: message({
    ja: '`slideSize` は 1 枚がトラックに占める幅。`full`（1 枚）、`lg`（次の 1 枚がのぞく）、`md`（2 枚）、`sm`（3 枚）。複数枚並べるときは「今の 1 枚」が決まらないので、位置は出さない。',
    en: '`slideSize` is how much of the track one slide takes: `full` (one), `lg` (the next one peeks in), `md` (two), `sm` (three). With several in view there is no single current slide, so no position is shown.',
  }),
};

export const prose = {
  description: message({
    ja: 'Markdown や MDX が描いた本文に、組版を戻す入れ物',
    en: 'A container that puts typesetting back into rendered Markdown or MDX.',
  }),
  basicDescription: message({
    ja: 'ベースのスタイルは見出し・リスト・余白・強調をリセットする。`Prose` の中だけ本文の組版を戻す。行間は広め（`leading-loose`）、見出しは詰め組み（`palt`）、日本語の `em` は傍点にする。',
    en: 'The base styles reset headings, lists, margins, and emphasis. Inside `Prose`, the typesetting of body text comes back: loose leading (`leading-loose`), proportional kana in headings (`palt`), and emphasis dots for Japanese `em`.',
  }),
  componentsTitle: message({
    ja: '部品を置く',
    en: 'Components Inside',
  }),
  componentsDescription: message({
    ja: '組版を効かせるのは、クラスの無い素の要素だけ。部品（どれもクラスを持つ）は自分の見た目のまま、前後の間だけが本文と同じに空く。MDX で要素を部品に対応づければ部品の見た目に、素のままなら本文の見た目になる。',
    en: 'Only bare elements, without a class, are typeset. A component (every one has a class) keeps its own look, and only the space around it follows the text. Map an MDX element to a component to make it look like the component, or leave it bare to make it look like text.',
  }),
  verticalTitle: message({
    ja: '縦書き',
    en: 'Vertical Writing',
  }),
  verticalDescription: message({
    ja: '`.writing-v` の中では、段落の頭を 1 字下げる（本の組み方）。',
    en: 'Under `.writing-v`, each paragraph’s first line is indented one character, as a book is set.',
  }),
};

export const table = {
  description: message({
    ja: '意味論を保ちつつ横スクロールにも対応するテーブル',
    en: 'A semantic table component with horizontal overflow support.',
  }),
  emptyStateTitle: message({
    ja: '空状態',
    en: 'Empty State',
  }),
  emptyStateDescription: message({
    ja: '行が無いときは `Table.Body` に `Table.EmptyState` を置く。`colSpan` 列をまたぐ行に `EmptyState` を描く。',
    en: 'When there are no rows, put `Table.EmptyState` in `Table.Body`. It draws an `EmptyState` in a row spanning `colSpan` columns.',
  }),
};

export const listBox = {
  description: message({
    ja: 'ドロップダウン形式のリスト選択',
    en: 'A dropdown list selection component.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  iconTriggerTitle: message({
    ja: 'アイコントリガー',
    en: 'With Icon Trigger',
  }),
};

export const progress = {
  description: message({
    ja: '進捗バー',
    en: 'A progress bar component.',
  }),
  differentValuesTitle: message({
    ja: '異なる値',
    en: 'Different Values',
  }),
  withLabelTitle: message({
    ja: 'ラベル付き',
    en: 'With Label',
  }),
};

export const heading = {
  description: message({
    ja: '見出し',
    en: 'A heading component.',
  }),
  typesTitle: message({
    ja: 'タイプ',
    en: 'Types',
  }),
  lineClampTitle: message({
    ja: '行数制限',
    en: 'Line Clamp',
  }),
};

export const emptyState = {
  description: message({
    ja: 'リストや表、検索の結果が空のときに、その旨と次の一手を示す',
    en: 'What a list, a table, or a search shows when there is nothing in it, and what to do next.',
  }),
  withActionTitle: message({
    ja: 'アイコンと操作',
    en: 'Icon and Action',
  }),
  inTableDescription: message({
    ja: '表の中では `Table.EmptyState` を使う。列をまたぐ行の中に、同じ内容を描く。',
    en: 'Inside a table, use `Table.EmptyState`: it draws the same content in a row that spans the columns.',
  }),
};

export const alert = {
  description: message({
    ja: 'ステータスに応じたメッセージを示すアラート',
    en: 'An alert that displays status-based messages.',
  }),
  statusesTitle: message({
    ja: 'ステータス',
    en: 'Statuses',
  }),
  dismissibleTitle: message({
    ja: '閉じられるアラート',
    en: 'Dismissible',
  }),
  actionTitle: message({
    ja: 'アクション（テキストリンク）',
    en: 'Action (Text Link)',
  }),
  multipleMessagesTitle: message({
    ja: '複数メッセージ',
    en: 'Multiple Messages',
  }),
};

export const skeleton = {
  description: message({
    ja: '読み込み前のプレースホルダー',
    en: 'A loading placeholder for content that has not arrived yet.',
  }),
  shapesTitle: message({
    ja: '形状',
    en: 'Shapes',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  animationTitle: message({
    ja: 'アニメーション',
    en: 'Animation',
  }),
};

export const spinner = {
  description: message({
    ja: 'ローディングスピナー',
    en: 'A loading spinner.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
};

export const toast = {
  description: message({
    ja: '一時的な通知メッセージのトースト',
    en: 'A toast for temporary notification messages.',
  }),
  useToastTitle: message({
    ja: 'useToastフック',
    en: 'useToast Hook',
  }),
  closeAllTitle: message({
    ja: 'すべて閉じる',
    en: 'Close All',
  }),
};

export const tooltip = {
  description: message({
    ja: 'ホバーで補足情報を出すツールチップ',
    en: 'A tooltip that shows supplementary info on hover.',
  }),
  placementTitle: message({
    ja: '配置',
    en: 'Placement',
  }),
};

export const dialog = {
  description: message({
    ja: 'ダイアログ',
    en: 'A dialog component.',
  }),
  alertDialogTitle: message({
    ja: 'アラートダイアログ',
    en: 'Alert Dialog',
  }),
};

export const drawer = {
  description: message({
    ja: '画面端からスライドインするドロワー',
    en: 'A drawer that slides in from the screen edge.',
  }),
  customContentTitle: message({
    ja: 'カスタムコンテンツ',
    en: 'With Custom Content',
  }),
};

export const modal = {
  description: message({
    ja: 'モーダルダイアログ',
    en: 'A modal dialog component.',
  }),
  sideTitle: message({
    ja: '配置',
    en: 'Side',
  }),
  defaultOpenTitle: message({
    ja: 'デフォルトで開く',
    en: 'Default Open',
  }),
  portalRootTitle: message({
    ja: 'トップレイヤーとPortal',
    en: 'Top Layer & Portals',
  }),
  portalRootDescription: message({
    ja: 'Modalはブラウザのトップレイヤー（`dialog`要素）に表示されるため、`document.body`へポータルした要素はModalの背面に隠れます。Modalは自身の`dialog`要素をPortalのルートとしてコンテキストで提供しており、`usePortalRoot`で取得してポータル先にすれば、Modalの中でも浮遊UIが正しく前面に表示されます。Modal内の`useToast`は自動的にこの仕組みで表示されるので、対応が必要なのは自前でポータルを使う場合だけです。',
    en: 'Modal renders in the browser top layer (a `dialog` element), so anything portaled to `document.body` ends up hidden behind it. Modal provides its own `dialog` element as a portal root via context — read it with `usePortalRoot` and portal there so floating UI stays on top inside a Modal. `useToast` inside a Modal already uses this mechanism automatically; you only need it for your own portals.',
  }),
};

export const popover = {
  description: message({
    ja: '要素に紐づくフローティングコンテンツ',
    en: 'Floating content anchored to an element.',
  }),
  placementTitle: message({
    ja: '配置',
    en: 'Placement',
  }),
};

export const dropdownMenu = {
  description: message({
    ja: 'ドロップダウンメニュー',
    en: 'A dropdown menu component.',
  }),
  iconTriggerTitle: message({
    ja: 'アイコントリガー',
    en: 'With Icon Trigger',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  placementTitle: message({
    ja: '配置',
    en: 'Placement',
  }),
};

export const separator = {
  description: message({
    ja: '区切り線',
    en: 'A separator / divider component.',
  }),
  orientationsTitle: message({
    ja: '方向',
    en: 'Orientations',
  }),
  colorsTitle: message({
    ja: 'カラー',
    en: 'Colors',
  }),
};

export const stack = {
  description: message({
    ja: '子要素を縦または横に等間隔で並べるレイアウトプリミティブ',
    en: 'Layout primitive that arranges children in a row or column with consistent gaps.',
  }),
  directionTitle: message({
    ja: '方向',
    en: 'Direction',
  }),
  gapTitle: message({
    ja: '間隔',
    en: 'Gap',
  }),
  alignTitle: message({
    ja: '整列と分配',
    en: 'Align & justify',
  }),
};

export const grid = {
  description: message({
    ja: 'CSSグリッドで子要素を並べるレイアウトプリミティブ。列数固定、auto-fill / auto-fitに対応',
    en: 'Layout primitive that arranges children on a CSS grid, with a fixed column count or auto-fill / auto-fit.',
  }),
  colsTitle: message({
    ja: '列数指定',
    en: 'Fixed columns',
  }),
  autoFillTitle: message({
    ja: 'Auto-fill',
    en: 'Auto-fill',
  }),
  autoFillDescription: message({
    ja: 'cols="auto-fill" / "auto-fit" のとき、minItemSizeで各セルの最小幅を指定するとグリッドがレスポンシブにリフローする。',
    en: 'With cols="auto-fill" or "auto-fit", minItemSize controls the minimum width of each cell so the grid reflows responsively.',
  }),
};

export const tabs = {
  description: message({
    ja: 'タブ切り替え',
    en: 'A tab switching component.',
  }),
  defaultSelectedTitle: message({
    ja: 'デフォルト選択',
    en: 'Default Selected',
  }),
};

export const breadcrumb = {
  description: message({
    ja: 'ナビゲーションのパンくずリスト',
    en: 'A breadcrumb navigation component.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  currentPageTitle: message({
    ja: '現在のページ',
    en: 'Current Page',
  }),
};

export const pagination = {
  description: message({
    ja: '前後移動と現在位置を示すページネーション',
    en: 'A minimal pagination component with prev/next controls and current position indicator.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const inView = {
  description: message({
    ja: '子要素が画面やスクロール領域に入っているかを知らせるコンポーネント',
    en: 'Reports whether its children are inside the viewport or a scroll container.',
  }),
  onceTitle: message({
    ja: '一度だけ',
    en: 'Once',
  }),
  onceDescription: message({
    ja: '`once`を付けると、最初に見えた時点で観測をやめ、その後に外れても`false`を知らせません。',
    en: 'With `once`, observation stops the first time the children are in view, and leaving afterwards reports nothing.',
  }),
  multipleTitle: message({
    ja: '子要素が複数あるとき',
    en: 'Multiple Children',
  }),
  multipleDescription: message({
    ja: '要素が複数あるときは、どれか1つでも見えていれば`true`になります。後から増えたり外れたりした要素にも追従し、見えていた要素が外れて見えているものが無くなれば`false`を知らせます。観測する要素がまだ1つも無い間は`onChange`を呼びません。',
    en: 'With several elements, it is `true` while any of them is in view, and it follows elements that mount or unmount later: when a visible element unmounts and nothing else is in view, it reports `false`. Until there is an element to observe, `onChange` is not called.',
  }),
};

export const resize = {
  description: message({
    ja: '子要素の大きさが変わったときに知らせるコンポーネント',
    en: 'Calls back when the size of its children changes.',
  }),
  initialNotice: message({
    ja: '`onChange`は観測を始めた時点でも1回呼ばれます。引数は無いので、必要な値はハンドラの中でDOMから読んでください。',
    en: '`onChange` is also called once when observation starts. It takes no argument; read what you need from the DOM in the handler.',
  }),
};

export const icons = {
  description: message({
    ja: 'k8ordo UIが提供するアイコン一覧',
    en: 'A catalog of icon components provided by k8ordo UI.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  propsDescription: message({
    ja: 'アイコンは共通で`size`を受け取ります。向きを持つ`ChevronIcon`と、ステータスを表す`AlertIcon`だけは追加のpropsがあります。`Logo`だけは`size`を持たないSVG本体で、大きさは`className`で決めます。`size`で揃えるときは`LogoIcon`を使ってください。',
    en: 'Icons share a `size` prop. Only `ChevronIcon` (direction) and `AlertIcon` (status) take additional props. `Logo` alone is the bare SVG without `size`, sized through `className`; use `LogoIcon` to size it like the other icons.',
  }),
};
