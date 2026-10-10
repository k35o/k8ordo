import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '`@k8ordo/ui`のすべてのコンポーネントです。カードを選ぶと、動く例とpropsの一覧が見られます。',
  en: 'Every component in `@k8ordo/ui`. Pick a card to see it working, with its props.',
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

export const categoryIcons = message({
  ja: 'Icons',
  en: 'Icons',
});

export const common = {
  storybookLink: message({
    ja: 'Storybookで見る',
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
    ja: '継承する属性（内部で固定するものを除く）：',
    en: 'Inherited attributes (except the ones set internally):',
  }),
  messagesNote: message({
    ja: 'ラベルやプレースホルダーなど、このコンポーネントが描く文言は、propsで指定しないと文言辞書から読まれます。差し替え方は次を見てください：',
    en: 'The wording this component draws (labels, placeholders, and so on) comes from the message dictionary unless a prop sets it. To replace it, see:',
  }),
  basicUsageTitle: message({
    ja: '基本的な使い方',
    en: 'Basic usage',
  }),
};

export const button = {
  description: message({
    ja: 'クリックで操作を実行するボタンです。`color`と`variant`で見た目を選びます。',
    en: 'A button that runs an action on click. `color` and `variant` set its look.',
  }),
  variantsTitle: message({
    ja: 'バリアント',
    en: 'Variants',
  }),
  colorsTitle: message({
    ja: '色',
    en: 'Colors',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  iconsTitle: message({
    ja: 'アイコン付き',
    en: 'With icons',
  }),
  fullWidthTitle: message({
    ja: '全幅',
    en: 'Full width',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  renderItemTitle: message({
    ja: 'リンクへの差し替え',
    en: 'Rendering as a link',
  }),
};

export const iconButton = {
  description: message({
    ja: 'アイコンだけのボタンです。`label`が必須で、ツールチップと読み上げの名前になります。',
    en: 'A button that shows only an icon. `label` is required, and becomes its tooltip and accessible name.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  backgroundsTitle: message({
    ja: '色',
    en: 'Colors',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  renderItemTitle: message({
    ja: 'リンクへの差し替え',
    en: 'Rendering as a link',
  }),
};

export const copyButton = {
  description: message({
    ja: 'テキストをクリップボードにコピーし、コピーしたことを示すボタンです。',
    en: 'A button that copies text to the clipboard and shows that it did.',
  }),
  feedbackDescription: message({
    ja: '押すとアイコンが2秒間チェックに変わります。隣のライブリージョンを通じて、スクリーンリーダーが「コピーしました」と読み上げます。書き込みに失敗したときはエラーのアイコンになります。ボタンの名前は変わりません。',
    en: 'When pressed, its icon turns into a check for two seconds, and a screen reader announces “Copied” through a live region beside it. If the write fails, the icon becomes an error icon. The button keeps its name.',
  }),
  iconOnlyTitle: message({
    ja: 'アイコンだけ',
    en: 'Icon only',
  }),
  iconOnlyDescription: message({
    ja: '`iconOnly`を付けると透明な`IconButton`になります。`label`はツールチップと読み上げの名前になります。',
    en: 'With `iconOnly` it becomes a transparent `IconButton`. `label` becomes its tooltip and accessible name.',
  }),
  lazyValueTitle: message({
    ja: '押したときに作るテキスト',
    en: 'Text built on click',
  }),
  lazyValueDescription: message({
    ja: '`value`には関数も渡せ、Promiseを返してもかまいません。関数は押したときに呼ばれ、返したPromiseはそのまま`ClipboardItem`に渡ります。テキストが後から決まっても書き込みはクリックの中で始まるので、`await`のあとの書き込みを拒むSafariでも動きます。',
    en: '`value` can also be a function, and it may return a Promise. It is called on the click, and the promise goes to a `ClipboardItem` as it is. The write starts inside the click even when the text comes later, so it works in Safari, which refuses a write that begins after an `await`.',
  }),
};

export const anchor = {
  description: message({
    ja: 'テキストのリンクです。外部のリンクには新しいタブのアイコンが付きます。',
    en: 'A text link. An external link gets a new-tab icon.',
  }),
  openInNewTabTitle: message({
    ja: '新しいタブで開くリンク',
    en: 'Opening in a new tab',
  }),
  renderAnchorTitle: message({
    ja: '要素の差し替え',
    en: 'Replacing the element',
  }),
  renderAnchorDescription: message({
    ja: 'Next.jsの`Link`のように、フレームワークのリンクに差し替えるときは`renderAnchor`を渡します。受け取ったpropsは、`kind`を外してから差し替えた要素に展開します。`kind`は外部か内部かを示す値で、属性ではありません。',
    en: 'To swap in a framework link such as Next.js’s `Link`, pass `renderAnchor`. Spread the props it receives onto the replacement element, after taking out `kind`. It says whether the link is internal or external, and it is not an attribute.',
  }),
};

export const textField = {
  description: message({
    ja: '1行のテキストの入力欄です。`type`を渡すと、メールアドレスや日付などブラウザの入力欄になります。',
    en: 'A single-line text field. Pass `type` to get the browser’s own input for an email address, a date, and so on.',
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
    ja: '複数行のテキストの入力欄です。`autoResize`を付けると、高さが入力に合わせて変わります。',
    en: 'A multi-line text field. With `autoResize`, its height follows the text.',
  }),
  rowsTitle: message({
    ja: '行数',
    en: 'Rows',
  }),
  autoResizeTitle: message({
    ja: '高さの自動調整',
    en: 'Auto resize',
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
    ja: '数値の入力欄です。矢印キーと増減のボタンで`step`ずつ変わり、空のときの値は`null`です。',
    en: 'A number field. Arrow keys and the stepper buttons change it by `step`, and an empty field is `null`.',
  }),
  stepPrecisionTitle: message({
    ja: 'ステップと小数の桁数',
    en: 'Step and precision',
  }),
  minMaxTitle: message({
    ja: '最小値と最大値',
    en: 'Min and max',
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
    ja: '選択肢から1つを選ぶ`<select>`です。選択肢は`options`に`{ value, label }`で渡します。',
    en: 'A `<select>` for choosing one option. Pass the options to `options` as `{ value, label }`.',
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
    ja: '既定値',
    en: 'Default value',
  }),
};

export const checkbox = {
  description: message({
    ja: 'チェックボックスです。ラベルは`label`で渡し、`onChange`は`checked`を受け取ります。',
    en: 'A checkbox. The label goes in `label`, and `onChange` receives `checked`.',
  }),
  defaultCheckedTitle: message({
    ja: '既定でチェック',
    en: 'Checked by default',
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
    ja: '選択肢をカードで見せる複数選択です。説明や図を添えて、選択肢を大きく見せたいときに使います。',
    en: 'A multi-select whose options are cards. Use it when each option carries a description or a visual.',
  }),
  defaultValueTitle: message({
    ja: '既定値',
    en: 'Default value',
  }),
};

export const checkboxGroup = {
  description: message({
    ja: '複数のチェックボックスを、1つの配列の値として扱うグループです。',
    en: 'A group of checkboxes whose selection is one array value.',
  }),
  defaultValueTitle: message({
    ja: '既定値',
    en: 'Default value',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

// `switch` は予約語なので、この 1 つだけ Input を付ける
export const switchInput = {
  description: message({
    ja: 'オンとオフを切り替えるスイッチです。設定の切り替えのように、すぐに反映される項目に使います。',
    en: 'A switch between on and off. Use it for a setting that takes effect right away.',
  }),
  defaultCheckedTitle: message({
    ja: '既定でオン',
    en: 'On by default',
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
    ja: '表示と非表示を切り替えるボタンの付いた、パスワードの入力欄です。',
    en: 'A password field with a show/hide toggle.',
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
    ja: 'ラジオボタンのグループです。選択肢は`options`に渡し、`onChange`は選んだ`value`を受け取ります。',
    en: 'A group of radio buttons. Pass the options to `options`; `onChange` receives the chosen `value`.',
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
    ja: '選択肢をカードで見せる単一選択です。説明や図を添えて、選択肢を大きく見せたいときに使います。',
    en: 'A single-select whose options are cards. Use it when each option carries a description or a visual.',
  }),
  defaultValueTitle: message({
    ja: '既定値',
    en: 'Default value',
  }),
  formTitle: message({
    ja: 'フォームでの送信',
    en: 'In a form',
  }),
  formDescription: message({
    ja: '中身は本物の`input[type=radio]`です。`name`を渡すと、ブラウザが同じ名前のラジオを1つのグループにします。選んだ値は`FormData`からそのまま取り出せます。',
    en: 'The cards are real `input[type=radio]` elements. With `name`, the browser groups the radios that share it, and the chosen value comes straight out of `FormData`.',
  }),
};

export const combobox = {
  description: message({
    ja: '候補から1つを選ぶ入力欄です。入力した文字で候補を絞り込むか、`search`でサーバーに問い合わせます。',
    en: 'A field for picking one option. Typing filters the options, or `search` asks a server for them.',
  }),
  usageDescription: message({
    ja: '入力すると一覧が開きます。値が変わるのは、クリックか`Enter`で候補を選んだときだけです。入力の途中でフォーカスを外すと、選んだ候補の表示名に戻ります。空にしてフォーカスを外すと、選択が外れます。`↓`と`↑`で一覧を開いて移動し、`Alt+↓`は開くだけです。`Escape`で閉じ、もう一度押すと入力した文字が消えます。複数を選ぶなら`Autocomplete`を使います。',
    en: 'Typing opens the list. The value changes only when an option is picked with a click or `Enter`. Blurring in the middle of typing puts the chosen label back. Blurring an empty field clears the choice. `↓` and `↑` open the list and move through it; `Alt+↓` only opens it. `Escape` closes it, and pressed again drops what was typed. To pick several, use `Autocomplete`.',
  }),
  asyncTitle: message({
    ja: 'サーバーへの問い合わせ',
    en: 'Searching a server',
  }),
  asyncDescription: message({
    ja: '`search`を渡すと、入力するたびに呼ばれて候補を受け取ります。入力し直すと前の呼び出しの`signal`が中断されるので、`fetch`に渡してください。検索している間は、一覧に`aria-busy`が付きます。失敗と0件は一覧に表示し、読み上げでも知らせます。`options`は入力する前に見せる候補になります。',
    en: 'With `search`, each keystroke calls it for the options. Typing again aborts the previous call’s `signal`, so pass it on to `fetch`. While a search runs, the list has `aria-busy`. A failure and an empty result are shown in the list and announced. `options` becomes what is shown before anything is typed.',
  }),
  formTitle: message({
    ja: '`@k8ordo/form`との組み合わせ',
    en: 'With `@k8ordo/form`',
  }),
  formDescription: message({
    ja: '`z.enum()`から作った`input`をそのまま展開できます。選んだ値は見えない`<select>`で送られるので、`required`やルールがそのまま効きます。フォームのリセットと、送信に失敗したときのフォーカスの移動も働きます。',
    en: 'Spread the `input` derived from `z.enum()` as it is. The choice submits through a hidden `<select>`, so `required` and the rules apply to it. A form’s reset, and moving focus after a failed submission, work too.',
  }),
};

export const autocomplete = {
  description: message({
    ja: '決まった候補から複数を選ぶ入力欄です。選んだものはタグで並び、1つずつ外せます。',
    en: 'A field for picking several options from a fixed list. The choices show as tags that can be removed one by one.',
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
    en: 'Multiple selection',
  }),
};

export const toolbar = {
  description: message({
    ja: '矢印キーで移動するボタンのまとまりです。エディタの書式のボタンのように、関連する操作を1か所に並べるときに使います。',
    en: 'A group of buttons that the arrow keys move between. Use it for a row of related actions, such as an editor’s formatting buttons.',
  }),
  keyboardDescription: message({
    ja: '`Tab`キーで止まるのは、ツールバーの中の1か所だけです。中は矢印キーで移動します。`Home`と`End`で端へ移り、無効な項目は飛ばします。外に出てから戻ると、最後にフォーカスのあった項目に戻ります。各項目は`Toolbar.Item`の`renderItem`で作ります。受け取った`ref`と`tabIndex`、`onFocus`を`Button`や`IconButton`に展開します。',
    en: 'It takes one Tab stop, and the arrow keys move inside it. `Home` and `End` jump to the ends, skipping disabled items. Returning focuses the item that was focused last. Each item is built in `Toolbar.Item`’s `renderItem`: spread the `ref`, `tabIndex` and `onFocus` it receives onto a `Button` or an `IconButton`.',
  }),
  toggleTitle: message({
    ja: 'トグル',
    en: 'Toggles',
  }),
  toggleDescription: message({
    ja: '押した状態は`aria-pressed`で渡します。押された項目は背景色が濃くなります。',
    en: 'Pass the pressed state as `aria-pressed`. A pressed item gets a darker background.',
  }),
  verticalTitle: message({
    ja: '縦並び',
    en: 'Vertical',
  }),
};

export const contextMenu = {
  description: message({
    ja: '右クリックした位置に開くメニューです。ファイルの行のように、要素ごとの操作を出すときに使います。',
    en: 'A menu that opens where the user right-clicks. Use it for actions on one item, such as a file row.',
  }),
  usageDescription: message({
    ja: '中身は`DropdownMenu`と同じ`Content`、`Item`、`SubMenu`です。違うのは開き方と出る位置だけです。キーボードでは、フォーカスのある領域で`Shift+F10`かコンテキストメニューキーで開きます。項目を選ぶか`Escape`で閉じると、開く前にフォーカスのあった要素に戻ります。',
    en: 'The inside is `DropdownMenu`’s: `Content`, `Item` and `SubMenu`. Only how it opens and where it appears differ. From the keyboard, press `Shift+F10` or the context-menu key on the focused area. When it closes from inside, with an item or `Escape`, focus returns to the element that had it before.',
  }),
};

export const rangeSlider = {
  description: message({
    ja: '2つのつまみで範囲を選ぶスライダーです。価格の下限と上限のように、1組の値を選ぶときに使います。',
    en: 'A slider with two thumbs for picking a range. Use it for a pair of values, such as a minimum and a maximum price.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  formTitle: message({
    ja: 'フォームでの送信',
    en: 'In a form',
  }),
  formDescription: message({
    ja: 'つまみはそれぞれ本物の`<input type="range">`です。`name`に渡した2つの名前で、2つの値として送られます。非制御のときは、フォームのリセットと`isDirty`がほかの`<input>`と同じように働きます。',
    en: 'Each thumb is a real `<input type="range">`. They submit as two values, under the two names passed to `name`. Uncontrolled, a form’s reset and `isDirty` work on them as on any other input.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const dateField = {
  description: message({
    ja: 'ブラウザの日付の入力欄（`type="date"`）です。値は`YYYY-MM-DD`の文字列です。',
    en: 'The browser’s own date input (`type="date"`). The value is a `YYYY-MM-DD` string.',
  }),
  minMaxTitle: message({
    ja: '最小値と最大値',
    en: 'Min and max',
  }),
  minMaxDescription: message({
    ja: '範囲はブラウザが検証します。範囲の外の日付は`rangeUnderflow`か`rangeOverflow`になります。',
    en: 'The browser checks the range. A date outside it reports `rangeUnderflow` or `rangeOverflow`.',
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
    ja: '`@k8ordo/form`との組み合わせ',
    en: 'With `@k8ordo/form`',
  }),
  formDescription: message({
    ja: '`z.iso.date()`から作った`input`をそのまま展開できます。`type`を取り除く必要はありません。',
    en: 'Spread the `input` derived from `z.iso.date()` as it is. There is no need to take `type` out.',
  }),
};

export const colorPicker = {
  description: message({
    ja: '色を`#rrggbb`で選ぶ入力欄です。色相と彩度、明度のつまみと、見本から選べます。',
    en: 'A field for picking a color as `#rrggbb`, with hue, saturation and lightness sliders and swatches.',
  }),
  usageDescription: message({
    ja: '`name`はテキストの入力欄に付きます。つまみや見本で選んだ色はこの入力欄に書き込まれ、`input`イベントが発火します。入力欄の横の色を押すと、ブラウザの色の選択が開きます。そこで選んだ色も同じように入力欄に入ります。入力している間は、6桁そろうまで色として扱いません。フォーカスを外したときと`Enter`で、小文字の`#rrggbb`にそろえます。3桁の`#f80`もそこで6桁に広げます。',
    en: '`name` goes on a text input. A color picked with the sliders or a swatch is written into it, and an `input` event fires. Pressing the color chip beside the input opens the browser’s own color picker, and a color chosen there goes into the input the same way. While typing, the text counts as a color only once it has six digits. On blur and on `Enter` it is tidied to lowercase `#rrggbb`, and a three-digit `#f80` is expanded.',
  }),
  swatchesTitle: message({
    ja: '見本',
    en: 'Swatches',
  }),
  swatchesDescription: message({
    ja: '見本はそれぞれ`label`を名前に持つトグルボタンです。今の色と同じ見本が押された状態になります。',
    en: 'Each swatch is a toggle button named by its `label`. The one matching the current color is pressed.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  controlledDescription: message({
    ja: "`onChange`は`#rrggbb`を受け取ります。入力欄を空にしたときは`''`です。",
    en: "`onChange` receives `#rrggbb`, or `''` when the field is emptied.",
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  formTitle: message({
    ja: '`@k8ordo/form`との組み合わせ',
    en: 'With `@k8ordo/form`',
  }),
  formDescription: message({
    ja: '`formFields`が作った`input`をそのまま展開できます。スキーマの`.regex()`は`pattern`として渡り、組み込みの`#[0-9a-fA-F]{6}`を置き換えます。変更の有無とルール、エラーの解除、リセットもそのまま働きます。',
    en: 'Spread the `input` that `formFields` derives as it is. A `.regex()` in the schema arrives as `pattern` and replaces the built-in `#[0-9a-fA-F]{6}`. Dirty state, rules, clearing an error and reset all work as they are.',
  }),
};

export const datePicker = {
  description: message({
    ja: '日付の入力欄と、ポップオーバーで開くカレンダーの組み合わせです。',
    en: 'A date input with a calendar that opens in a popover.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  controlledDescription: message({
    ja: "`onChange`は値を受け取ります。`YYYY-MM-DD`で、空なら`''`です。カレンダーで選んだときも、入力したときも同じです。",
    en: "`onChange` receives the value: `YYYY-MM-DD`, or `''` when empty. It is the same whether the date was picked from the calendar or typed.",
  }),
  minMaxTitle: message({
    ja: '最小値と最大値',
    en: 'Min and max',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
  formTitle: message({
    ja: '`@k8ordo/form`との組み合わせ',
    en: 'With `@k8ordo/form`',
  }),
  formDescription: message({
    ja: 'カレンダーで選んだ日付は入力欄に書き込まれ、`input`イベントが発火します。フォームには入力したときと同じように伝わり、変更の有無やルール、エラーの解除がそのまま効きます。',
    en: 'A date picked from the calendar is written into the input, and an `input` event fires. The form sees it just as if it had been typed, so dirty state, rules and clearing an error all work.',
  }),
  firefoxNote: message({
    ja: 'Firefoxは日付の入力欄の中に自前のカレンダーのボタンを描き、それを消す方法がありません。そのためFirefoxでは、カレンダーのボタンが2つ並びます。',
    en: 'Firefox draws its own calendar button inside every date input and offers no way to hide it. So in Firefox the field shows two calendar buttons.',
  }),
};

export const calendar = {
  description: message({
    ja: '月の表から日付を1つ選ぶカレンダーです。値は`YYYY-MM-DD`で、フォームには何も送りません。',
    en: 'A month grid for picking one day. The value is `YYYY-MM-DD`, and it submits nothing to a form.',
  }),
  keyboardTitle: message({
    ja: 'キーボード操作',
    en: 'Keyboard',
  }),
  keyboardDescription: message({
    ja: '矢印キーで日と週を移動します。`Home`と`End`は週の端へ移ります。`PageUp`と`PageDown`は前後の月へ、`Shift`と一緒なら前後の年へ移ります。`Enter`か`Space`で選びます。',
    en: 'Arrow keys move by day and week. `Home` and `End` go to the ends of the week. `PageUp` and `PageDown` go to the previous and next month, or year with `Shift`. `Enter` or `Space` selects.',
  }),
  minMaxTitle: message({
    ja: '最小値と最大値',
    en: 'Min and max',
  }),
  localeTitle: message({
    ja: '言語と今日',
    en: 'Language and today',
  }),
  localeDescription: message({
    ja: '月名と曜日名、週の始まりは、組み込みの文言と同じ`@k8ordo/i18n`のロケールに従います。今日の日付は閲覧者のタイムゾーンで決まります。そのためカレンダーはブラウザでだけ描き、サーバーは同じ大きさの空の要素を出します。',
    en: 'Month and weekday names, and the first day of the week, follow the same `@k8ordo/i18n` locale as the built-in wording. Today depends on the visitor’s time zone, so the calendar renders in the browser alone, and the server writes an empty box of the same size.',
  }),
};

export const stepper = {
  description: message({
    ja: '手順のステップを順に並べ、完了したステップと現在のステップを示します。複数の画面に分かれたフォームの進み具合に使います。',
    en: 'The steps of a process in order, marking the completed ones and the current one. Use it to show progress through a multi-step form.',
  }),
  usageDescription: message({
    ja: '`value`は現在のステップの位置で、0から数えます。完了したステップにはチェックが付き、読み上げでは「完了」と添えます。現在のステップは`aria-current="step"`で伝えます。',
    en: '`value` is the index of the current step, counted from 0. Completed steps show a check and are read as completed. The current step carries `aria-current="step"`.',
  }),
  interactiveTitle: message({
    ja: '完了したステップへの移動',
    en: 'Going back to a completed step',
  }),
  interactiveDescription: message({
    ja: '`interactive`を付けると、完了したステップがボタンになります。押すと`onChange`がその位置を受け取ります。先のステップへは飛べません。',
    en: 'With `interactive`, completed steps become buttons. Pressing one hands its index to `onChange`. Steps ahead cannot be jumped to.',
  }),
  verticalTitle: message({
    ja: '縦並び',
    en: 'Vertical',
  }),
};

export const slider = {
  description: message({
    ja: 'つまみが1つのスライダーです。音量のように、範囲の中の1つの値を選ぶときに使います。',
    en: 'A single-thumb slider. Use it for one value within a range, such as a volume.',
  }),
  minMaxStepTitle: message({
    ja: '最小値、最大値、ステップ',
    en: 'Min, max and step',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const fileField = {
  description: message({
    ja: 'ファイルを選ぶ入力欄です。選ぶボタンとドロップ領域、選んだファイルの一覧を組み合わせて作ります。',
    en: 'A file field, composed from a trigger, a dropzone and the list of chosen files.',
  }),
  dropzoneTitle: message({
    ja: 'ドロップでの追加',
    en: 'Adding files by drop',
  }),
  dropzoneDescription: message({
    ja: '`FileField.Dropzone`にドロップしたファイルは、選んだときと同じように一覧と送信に加わります。フォームには`input`イベントで伝わります。中身を渡さないと、組み込みの案内と「ファイルを選択」のボタンが入るので、キーボードでも選べます。フォルダーのドロップは受け付けません。ブラウザが`accept`で確かめるのは、選択ダイアログで選んだファイルだけです。ドロップしたファイルは`FileField`が同じ規則で確かめ、合わないものは加えません。',
    en: 'Files dropped on `FileField.Dropzone` join the list and the submission just as picked ones do, and an `input` event tells the form. Left empty, it holds the built-in hint and a choose-files button, so it works by keyboard too. A dropped folder is not accepted. The browser checks `accept` only for files chosen in the picker, so `FileField` checks dropped files by the same rules and leaves out any that do not match.',
  }),
  acceptTypesTitle: message({
    ja: '受け入れる種類',
    en: 'Accepted types',
  }),
  multipleFilesTitle: message({
    ja: '複数ファイル',
    en: 'Multiple files',
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
    ja: '入力欄にラベルとヘルプ、エラーの表示を付けるラッパーです。入力欄は`renderInput`で描きます。',
    en: 'A wrapper that gives a field its label, help text and error text. The field itself is drawn in `renderInput`.',
  }),
  helpTextTitle: message({
    ja: 'ヘルプテキスト',
    en: 'Help text',
  }),
  errorTextTitle: message({
    ja: 'エラーテキスト',
    en: 'Error text',
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
    ja: '`<form>`のラッパーです。`action`にServer ActionかURLを渡して送信します。',
    en: 'A wrapper for `<form>`. `action` takes a Server Action or a URL.',
  }),
  actionStateTitle: message({
    ja: '`useActionState`との組み合わせ',
    en: 'With `useActionState`',
  }),
};

export const accordion = {
  description: message({
    ja: '開閉できる節です。見出しを押すと本文が開きます。',
    en: 'A collapsible section. Pressing its heading opens the body.',
  }),
  defaultOpenTitle: message({
    ja: '既定で開く',
    en: 'Open by default',
  }),
  multipleDefaultOpenTitle: message({
    ja: '複数を既定で開く',
    en: 'Several open by default',
  }),
};

export const avatar = {
  description: message({
    ja: 'ユーザーの画像です。画像が無いときは、`fallback`の文字かアイコンを出します。',
    en: 'A user’s picture. Without an image it shows the `fallback` text or an icon.',
  }),
  withImageTitle: message({
    ja: '画像あり',
    en: 'With an image',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
};

export const badge = {
  description: message({
    ja: '状態や分類を示す小さなラベルです。`tone`で状態の色が決まります。',
    en: 'A small label for a status or a category. `tone` picks the status color.',
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
    ja: '内容をまとめるカードです。既定は影の付いた見た目で、`bg-subtle`のページに置くことを想定しています。',
    en: 'A card that groups content. By default it has a shadow, meant for a `bg-subtle` page.',
  }),
  widthTitle: message({
    ja: '幅',
    en: 'Width',
  }),
  interactiveDescription: message({
    ja: '`interactive`を付けると、ホバーで少し大きく、押すと少し小さくなります。カード全体をリンクやボタンにするときに使います。',
    en: 'With `interactive`, the card grows a little on hover and shrinks a little when pressed. Use it to make the whole card a link or a button.',
  }),
};

export const code = {
  description: message({
    ja: 'インラインのコードです。文中のAPI名やファイル名に使います。',
    en: 'Inline code. Use it for an API name or a file name in a sentence.',
  }),
  colorDetectionTitle: message({
    ja: '色の値の見本',
    en: 'Color values',
  }),
};

export const codeBlock = {
  description: message({
    ja: 'サーバーでハイライトし、コピーのボタンを添えたコードブロックです。入口は`@k8ordo/ui/code-block`です。',
    en: 'A code block highlighted on the server, with a copy button. Its entry is `@k8ordo/ui/code-block`.',
  }),
  importDescription: message({
    ja: 'ハイライトはサーバーで済ませるので、shikiはブラウザに送られません。`server-only`をimportしているので、Client Componentから読み込むとビルドがエラーになります。',
    en: 'Highlighting happens on the server, so shiki never reaches the browser. It imports `server-only`, so importing it from a Client Component fails the build.',
  }),
  titleTitle: message({
    ja: 'ファイル名',
    en: 'File name',
  }),
  titleDescription: message({
    ja: '`title`を渡すと、見出しの行に言語名の代わりに表示します。見出しは`figure`の`figcaption`になります。',
    en: 'With `title`, the header shows it in place of the language. The header becomes the figure’s `figcaption`.',
  }),
  marksTitle: message({
    ja: '行の印',
    en: 'Line marks',
  }),
  marksDescription: message({
    ja: '`marks`は、1から数える行番号に`highlight`か`add`、`remove`を付けます。追加と削除は、色のほかに`+`と`−`でも示します。',
    en: '`marks` marks lines by their 1-based number with `highlight`, `add` or `remove`. Additions and removals are shown with `+` and `−` as well as color.',
  }),
  calloutsTitle: message({
    ja: '注記',
    en: 'Callouts',
  }),
  calloutsDescription: message({
    ja: '`callouts`は、行の直後にその行の字下げにそろえて注記を置きます。配列を渡すと、書いた順に並びます。コピーされるのは`code`そのもので、印や注記は含まれません。',
    en: '`callouts` puts a note right under a line, indented like the line. An array puts several, in order. The copy button copies `code` exactly, without the marks or the notes.',
  }),
  colorsTitle: message({
    ja: '色とダークモード',
    en: 'Colors and dark mode',
  }),
  colorsDescription: message({
    ja: '色はk8oのブログと同じ固定の値で、デザイントークンは使いません。ライトはshikiの`one-light`、ダークは`plastic`です。色は`light-dark()`で書いているので、`.dark`が切り替える`color-scheme`に従います。外枠の線は無く、言語名かファイル名は同じ背景の上に小さなラベルとして置きます。shikiが知らない言語名のコードは、色を付けずに描きます。',
    en: 'The colors are fixed values matching k8o’s blog, not design tokens: shiki’s `one-light` in light and `plastic` in dark. They are written as `light-dark()`, so they follow the `color-scheme` that `.dark` switches. There is no outer border, and the language or the file name sits as a small label at the top of the same background. A language shiki does not know renders as plain text.',
  }),
};

export const kbd = {
  description: message({
    ja: 'キーボードのキーを1つ、キーキャップとして描きます。ショートカットの説明に使います。',
    en: 'One keyboard key, drawn as a key cap. Use it when describing a shortcut.',
  }),
  combinationTitle: message({
    ja: 'キーの組み合わせ',
    en: 'Key combinations',
  }),
  combinationDescription: message({
    ja: '同時に押すキーは、1キーずつ`Kbd`を並べます。',
    en: 'For keys pressed together, place one `Kbd` per key side by side.',
  }),
  labelTitle: message({
    ja: '記号のキー',
    en: 'Symbol keys',
  }),
  labelDescription: message({
    ja: '`⌘`や`⇧`のような記号は、そのまま読み上げても意味が通りません。`label`を渡すと、見た目は記号のまま、読み上げには`label`を使います。',
    en: 'A symbol such as `⌘` or `⇧` makes no sense read aloud. Pass `label`: the symbol stays on screen, and the label is what a screen reader says.',
  }),
};

export const carousel = {
  description: message({
    ja: 'スクロールスナップで1枚ずつ止まるスライドと、前後のボタンです。自動再生はありません。',
    en: 'Slides that snap one at a time as they scroll, with previous and next buttons. There is no autoplay.',
  }),
  basicDescription: message({
    ja: 'トラックはスクロール領域です。ボタンのほかに、トラックパッドやスワイプでも送れます。トラックにフォーカスを置けば、矢印キーでも送れます。1枚ずつ見せるときは、「2 / 4」のように位置を示します。',
    en: 'The track is a scroll container. Besides the buttons, a trackpad or a swipe moves it, and so do the arrow keys once the track has focus. When one slide shows at a time, the position is shown as “2 / 4”.',
  }),
  slideSizeTitle: message({
    ja: 'スライドの幅',
    en: 'Slide size',
  }),
  slideSizeDescription: message({
    ja: '`slideSize`は、1枚がトラックに占める幅です。`full`は1枚で、`lg`は次の1枚が少しのぞく幅です。`md`は2枚、`sm`は3枚です。複数枚が見えているときは「今の1枚」が決まらないので、位置は出しません。',
    en: '`slideSize` is how much of the track one slide takes: `full` is one, `lg` lets the next one peek in, `md` is two and `sm` is three. With several in view there is no single current slide, so no position is shown.',
  }),
};

export const prose = {
  description: message({
    ja: 'MarkdownやMDXから描いたHTMLに、本文の組版を戻すコンテナです。記事の本文を包みます。',
    en: 'A container that puts the typesetting of body text back into HTML rendered from Markdown or MDX. Wrap an article’s body in it.',
  }),
  basicDescription: message({
    ja: 'ベースのスタイルは見出しとリスト、余白、強調をリセットします。`Prose`の中でだけ、本文の組版が戻ります。行間は広め（`leading-loose`）で、見出しは詰め組み（`palt`）です。日本語の`em`は傍点で示します。',
    en: 'The base styles reset headings, lists, margins and emphasis. Inside `Prose`, the typesetting of body text comes back: loose leading (`leading-loose`), proportional kana in headings (`palt`), and emphasis dots for Japanese `em`.',
  }),
  componentsTitle: message({
    ja: 'コンポーネントの配置',
    en: 'Components inside',
  }),
  componentsDescription: message({
    ja: '組版が効くのは、クラスの無い素の要素だけです。コンポーネントはどれもクラスを持つので、自分の見た目のままです。前後の間隔だけが本文と同じになります。MDXで要素をコンポーネントに対応づければその見た目に、素のままなら本文の見た目になります。',
    en: 'Only bare elements, without a class, are typeset. Every component has a class, so it keeps its own look, and only the space around it follows the text. Map an MDX element to a component to give it the component’s look, or leave it bare to give it the text’s.',
  }),
  verticalTitle: message({
    ja: '縦書き',
    en: 'Vertical writing',
  }),
  verticalDescription: message({
    ja: '`.writing-v`の中では、本の組み方にならって段落の頭を1字下げます。',
    en: 'Under `.writing-v`, each paragraph’s first line is indented one character, as a book is set.',
  }),
};

export const dataTable = {
  description: message({
    ja: '並べ替えと行の選択、列の表示切り替えができる表です。状態はすべて呼び出し側が持ちます。',
    en: 'A table with sorting, row selection and column visibility. Every piece of state is yours.',
  }),
  basicDescription: message({
    ja: '`DataTable`は並べ替えの状態を受け取っても自分では並べ替えず、`rows`を渡された順に描きます。そのため、サーバーで並べ替えるときも同じコンポーネントで済みます。機能はそれぞれ、その変化を受け取る関数を渡したときだけ現れます。',
    en: '`DataTable` takes the sort state but does not sort: it draws `rows` in the order given, so the same component works when the server sorts. Each feature appears only when you pass the handler that receives its changes.',
  }),
  urlTitle: message({
    ja: 'URLに置く並べ替えとページ',
    en: 'Sort and page in the URL',
  }),
  urlDescription: message({
    ja: '`@k8ordo/state`の`url`に、並べ替えとページを置いた例です。リンクを渡した相手にも同じ並びの同じページが見え、戻るボタンで前の並びに戻れます。',
    en: 'This example keeps the sort and the page in `@k8ordo/state`’s `url`. Whoever receives the link sees the same order on the same page, and the back button returns to the previous order.',
  }),
  emptyTitle: message({
    ja: '空の表',
    en: 'Empty table',
  }),
  emptyDescription: message({
    ja: '`rows`が空のときは、`emptyState`に渡したものを、すべての列をまたぐ1行に描きます。`EmptyState`を渡します。',
    en: 'When `rows` is empty, `emptyState` is drawn in a row spanning the columns. Pass an `EmptyState`.',
  }),
};

export const tree = {
  description: message({
    ja: '枝を開閉できる階層の一覧です。ファイルツリーやアウトラインに使い、キーボード操作はWAI-ARIAのtreeに従います。',
    en: 'A hierarchy whose branches open and close, for a file tree or an outline. The keyboard follows the WAI-ARIA tree pattern.',
  }),
  basicDescription: message({
    ja: '項目は`{ id, label, icon?, children? }`の木で渡します。上下の矢印で、見えている項目を移動します。右の矢印は閉じた枝を開き、開いた枝では最初の子へ移ります。左の矢印は開いた枝を閉じ、それ以外では親へ戻ります。`Home`と`End`で先頭と末尾へ移り、`Enter`か`Space`で選びます。文字を入力すると、その文字で始まる項目へ移ります。',
    en: 'Pass the nodes as a tree of `{ id, label, icon?, children? }`. Up and Down move between the visible nodes. Right opens a closed branch, and on an open one moves to its first child. Left closes an open branch, or moves to the parent. `Home` and `End` go to the first and last node, and `Enter` or `Space` selects. Typing a character moves to the next node starting with it.',
  }),
  controlledTitle: message({
    ja: '開閉と選択の制御',
    en: 'Controlled expansion and selection',
  }),
  controlledDescription: message({
    ja: '開いている枝（`expandedIds`）と選択（`selectedId`）は、外から渡せます。`onChange`は選んだ項目の`id`を受け取ります。',
    en: 'The open branches (`expandedIds`) and the selection (`selectedId`) can be passed in. `onChange` receives the `id` of the node picked.',
  }),
};

export const table = {
  description: message({
    ja: '`<table>`の意味を保ったまま、横にはみ出す幅をスクロールできる表です。',
    en: 'A table that keeps `<table>` semantics and scrolls sideways when it overflows.',
  }),
  emptyStateTitle: message({
    ja: '空の表',
    en: 'Empty table',
  }),
  emptyStateDescription: message({
    ja: 'データが無いときは、`Table.Body`に`Table.EmptyState`を置きます。`colSpan`に列の数を渡すと、すべての列をまたぐ1行に`EmptyState`を描きます。',
    en: 'When there is no data, put `Table.EmptyState` in `Table.Body`. Pass the number of columns as `colSpan`, and it draws an `EmptyState` in a row spanning them all.',
  }),
};

export const listBox = {
  description: message({
    ja: 'ボタンを押すと開く一覧から1つを選びます。1ページの件数のように、フォームの外で設定を選ぶときに使います。',
    en: 'A list that opens from a button, for picking one option. Use it for a setting outside a form, such as items per page.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  iconTriggerTitle: message({
    ja: 'アイコンのトリガー',
    en: 'Icon trigger',
  }),
};

export const progress = {
  description: message({
    ja: '進み具合を示すバーです。`value`を省くと、進み具合が分からない表示になります。',
    en: 'A progress bar. Leave `value` out when how far along it is cannot be known.',
  }),
  differentValuesTitle: message({
    ja: '値',
    en: 'Values',
  }),
  withLabelTitle: message({
    ja: 'ラベル付き',
    en: 'With a label',
  }),
  indeterminateTitle: message({
    ja: '不定の進み具合',
    en: 'Unknown progress',
  }),
  indeterminateDescription: message({
    ja: 'バーがトラックの中を往復します。読み上げでは値を持たず、名前は`label`です。`label`を省くと、組み込みの「読み込み中」になります。動きを減らす設定では、往復をやめて明滅だけにします。',
    en: 'The bar moves back and forth along the track. It carries no value for assistive technology and is named by `label`, or by the built-in “loading” wording without one. With reduced motion it stops moving and only pulses.',
  }),
};

export const heading = {
  description: message({
    ja: '見出しです。`level`で`h1`から`h6`の要素を選びます。',
    en: 'A heading. `level` picks the element, `h1` to `h6`.',
  }),
  typesTitle: message({
    ja: 'レベル',
    en: 'Levels',
  }),
  lineClampTitle: message({
    ja: '行数の制限',
    en: 'Line clamp',
  }),
};

export const emptyState = {
  description: message({
    ja: 'リストや表、検索の結果が空のときの表示です。その旨と、次にできる操作を示します。',
    en: 'What a list, a table or a search shows when it has nothing. It says so and offers the next action.',
  }),
  withActionTitle: message({
    ja: 'アイコンと操作',
    en: 'Icon and action',
  }),
  inTableDescription: message({
    ja: '表の中では`Table.EmptyState`を使います。列をまたぐ行の中に、同じ内容を描きます。',
    en: 'Inside a table, use `Table.EmptyState`. It draws the same content in a row spanning the columns.',
  }),
};

export const alert = {
  description: message({
    ja: '操作の結果やアプリの状態を知らせます。表示されるとスクリーンリーダーが読み上げます。',
    en: 'Reports the result of an action or the state of the application. A screen reader announces it when it appears.',
  }),
  statusesTitle: message({
    ja: 'トーン',
    en: 'Tones',
  }),
  dismissibleTitle: message({
    ja: '閉じられるアラート',
    en: 'Dismissible',
  }),
  actionTitle: message({
    ja: '操作のリンク',
    en: 'Action link',
  }),
  multipleMessagesTitle: message({
    ja: '複数のメッセージ',
    en: 'Multiple messages',
  }),
};

export const callout = {
  description: message({
    ja: '本文の中に置く注記です。補足や落とし穴を、段落やコードを含めて書けます。',
    en: 'A note inside the content. It holds a tip or a pitfall, with paragraphs and code.',
  }),
  tonesTitle: message({
    ja: 'トーン',
    en: 'Tones',
  }),
  richTitle: message({
    ja: '本文のコードとリンク',
    en: 'Code and links in the body',
  }),
  richDescription: message({
    ja: '本文は`children`なので、段落を重ねたり`Code`や`Anchor`を入れたりできます。`label`を省くと、アイコンと本文だけになります。',
    en: 'The body is `children`, so it can hold several paragraphs, `Code` and `Anchor`. Leave out `label` and only the icon and the body remain.',
  }),
  versusAlertTitle: message({
    ja: '`Alert`との使い分け',
    en: '`Callout` or `Alert`',
  }),
  versusAlertDescription: message({
    ja: '`Alert`は操作の結果やアプリの状態を知らせ、表示されるとスクリーンリーダーが読み上げます。記事やガイドの本文に置く補足には`Callout`を使います。`role="note"`なので、ページの読み込みやクライアントでの遷移で差し込まれても読み上げられません。',
    en: '`Alert` reports the result of an action or the state of the application, and a screen reader announces it when it appears. For a note in an article or a guide, use `Callout`. It has `role="note"`, so it is not announced when the page loads or a client navigation brings it in.',
  }),
};

export const skeleton = {
  description: message({
    ja: '読み込み中の内容の代わりに置くプレースホルダーです。',
    en: 'A placeholder for content that has not loaded yet.',
  }),
  shapesTitle: message({
    ja: '形',
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
    ja: '読み込み中を示すスピナーです。',
    en: 'A spinner that shows something is loading.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
};

export const toast = {
  description: message({
    ja: '画面の下に一時的に出る通知です。`useToast`の`open`で表示します。',
    en: 'A notification that appears briefly at the bottom of the screen. Show one with `open` from `useToast`.',
  }),
  useToastTitle: message({
    ja: '`useToast`',
    en: '`useToast`',
  }),
  closeAllTitle: message({
    ja: '`closeAll`',
    en: '`closeAll`',
  }),
};

export const tooltip = {
  description: message({
    ja: 'ホバーとフォーカスで補足を出すツールチップです。',
    en: 'A tooltip that shows a hint on hover and focus.',
  }),
  placementTitle: message({
    ja: '配置',
    en: 'Placement',
  }),
};

export const dialog = {
  description: message({
    ja: '`Modal`の中に置く見出しと本文、閉じるボタンの組です。',
    en: 'A heading, a body and a close button, placed inside `Modal`.',
  }),
  alertDialogTitle: message({
    ja: 'アラートダイアログ',
    en: 'Alert dialog',
  }),
};

export const drawer = {
  description: message({
    ja: '画面の端から出るパネルです。ナビゲーションや補助の操作を、ページを離れずに出すときに使います。',
    en: 'A panel that slides in from the edge of the screen. Use it for navigation or secondary actions without leaving the page.',
  }),
  customContentTitle: message({
    ja: '独自の中身',
    en: 'Custom content',
  }),
};

export const commandPalette = {
  description: message({
    ja: '入力した文字でコマンドを絞り込み、キーボードだけで実行するパレットです。',
    en: 'A palette that filters commands as you type and runs them from the keyboard.',
  }),
  usageDescription: message({
    ja: '`label`と`keywords`を、大文字と小文字を区別せずに絞り込みます。`↓`と`↑`で移動し、端では反対側へ回ります。`Enter`かクリックでパレットを閉じてから`onSelect`を呼びます。フォーカスは検索欄に置いたままです。同じ`group`の項目は見出しの下にまとまり、`shortcut`のキーは`Kbd`で添えます。',
    en: 'It filters on `label` and `keywords`, ignoring case. `↓` and `↑` move through the matches and wrap around. `Enter` or a click closes the palette and then calls `onSelect`. Focus stays in the search field. Items that share a `group` gather under its heading, and `shortcut` keys are drawn with `Kbd`.',
  }),
  shortcutTitle: message({
    ja: 'キーでの開閉',
    en: 'Opening and closing from a key',
  }),
  shortcutDescription: message({
    ja: '開閉は`Modal`と同じく`isOpen`と`onClose`で行います。⌘KやCtrl+Kのようなキーは、アプリ側で割り当てます。閉じるとフォーカスは開く前の場所へ戻り、次に開いたときは空の検索から始まります。',
    en: 'Open and close it like `Modal`, with `isOpen` and `onClose`. A key such as ⌘K or Ctrl+K is the application’s to wire. Closing returns focus to where it was, and the next opening starts from an empty search.',
  }),
};

export const modal = {
  description: message({
    ja: '`<dialog>`で画面の前面に開くオーバーレイです。`Dialog`と`Drawer`の土台で、中身を自由に置くときは直接使います。',
    en: 'An overlay opened in a `<dialog>`. `Dialog` and `Drawer` build on it; use it directly for content of your own.',
  }),
  sideTitle: message({
    ja: '出る位置',
    en: 'Side',
  }),
  defaultOpenTitle: message({
    ja: '既定で開く',
    en: 'Open by default',
  }),
  portalRootTitle: message({
    ja: 'トップレイヤーとポータル',
    en: 'Top layer and portals',
  }),
  portalRootDescription: message({
    ja: '`Modal`はブラウザのトップレイヤーの`<dialog>`に表示されます。そのため、`document.body`にポータルした要素は`Modal`の後ろに隠れます。`Modal`は自分の`<dialog>`をポータルのルートとしてコンテキストで渡しています。`usePortalRoot`で取り出してポータル先にすれば、`Modal`の中でも前面に出ます。`Modal`の中の`useToast`はこの仕組みを使うので、対応が要るのは自前のポータルだけです。',
    en: '`Modal` renders in a `<dialog>` in the browser’s top layer, so anything portaled to `document.body` ends up behind it. `Modal` provides its own `<dialog>` as the portal root through context. Read it with `usePortalRoot` and portal there, and floating UI stays on top inside the `Modal`. `useToast` inside a `Modal` already uses this, so only portals of your own need it.',
  }),
};

export const popover = {
  description: message({
    ja: 'トリガーの要素の近くに開くポップオーバーです。位置はCSS Anchor Positioningで決めます。',
    en: 'A popover that opens next to its trigger. CSS Anchor Positioning places it.',
  }),
  placementTitle: message({
    ja: '配置',
    en: 'Placement',
  }),
};

export const dropdownMenu = {
  description: message({
    ja: 'ボタンから開くメニューです。項目は`label`と`onAction`で作り、`SubMenu`で入れ子にできます。',
    en: 'A menu that opens from a button. Each item has a `label` and an `onAction`, and `SubMenu` nests one.',
  }),
  iconTriggerTitle: message({
    ja: 'アイコンのトリガー',
    en: 'Icon trigger',
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
    ja: '区切りの線です。節の間や、横に並んだ要素の間に置きます。',
    en: 'A dividing rule. Put it between sections, or between items in a row.',
  }),
  orientationsTitle: message({
    ja: '方向',
    en: 'Orientation',
  }),
  colorsTitle: message({
    ja: '色',
    en: 'Colors',
  }),
};

export const stack = {
  description: message({
    ja: '子要素を縦か横に、同じ間隔で並べます。`gap`は間隔のトークンから選びます。',
    en: 'Lays children out in a row or a column with equal gaps. `gap` comes from the spacing tokens.',
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
    ja: '整列と配分',
    en: 'Align and justify',
  }),
};

export const grid = {
  description: message({
    ja: 'CSSグリッドで子要素を並べます。列数を固定するか、`auto-fill`と`auto-fit`で幅に合わせます。',
    en: 'Lays children out on a CSS grid, with a fixed column count or `auto-fill` / `auto-fit`.',
  }),
  colsTitle: message({
    ja: '列数の指定',
    en: 'Fixed columns',
  }),
  autoFillTitle: message({
    ja: 'Auto-fill',
    en: 'Auto-fill',
  }),
  autoFillDescription: message({
    ja: '`cols`が`"auto-fill"`か`"auto-fit"`のときは、`minItemSize`でセルの最小の幅を決めます。列の数は幅に合わせて変わります。',
    en: 'With `cols="auto-fill"` or `"auto-fit"`, `minItemSize` sets the minimum width of a cell. The number of columns then follows the width.',
  }),
};

export const resizablePanels = {
  description: message({
    ja: '仕切りをドラッグするか矢印キーで動かして、2枚のパネルの大きさを分けます。',
    en: 'Two panes split by a divider that the user drags or moves with the arrow keys.',
  }),
  usageDescription: message({
    ja: '`value`は1枚目が占める割合（%）で、2枚目は残りを取ります。ルートの要素は親いっぱいに広がるので、親に大きさを与えてください。縦に分けるなら高さが要ります。仕切りはフォーカスでき、矢印キーは画面上の向きのとおりに動かします。`Home`と`End`で`min`と`max`の端へ移ります。右から左の言語では1枚目が右に付くので、`ArrowLeft`で広がります。並びは文字の行に沿うので、縦書きの中では`orientation="horizontal"`が上下に並びます。',
    en: '`value` is the first pane’s share in percent; the second pane takes the rest. The root fills its parent, so give the parent a size: a vertical split needs a height. The divider takes focus, and the arrow keys move it the way they point on screen. `Home` and `End` jump to `min` and `max`. In a right-to-left page the first pane sits on the right, so `ArrowLeft` widens it. The panes follow the line of text, so in vertical writing mode `orientation="horizontal"` stacks them.',
  }),
  verticalTitle: message({
    ja: '上下の分割',
    en: 'Vertical',
  }),
  verticalDescription: message({
    ja: '`orientation="vertical"`は2枚を上下に並べます。仕切りは上下の矢印キーで動き、値は上のパネルが高さに占める割合です。',
    en: '`orientation="vertical"` stacks the two panes. The divider moves with the up and down arrow keys, and its value is the top pane’s share of the height.',
  }),
  labelTitle: message({
    ja: '仕切りの名前',
    en: 'Naming the divider',
  }),
  labelDescription: message({
    ja: '仕切りの値は1枚目の大きさなので、名前も1枚目に合わせます。1枚目に見出しがあれば`aria-labelledby`で指します。指さなければ、辞書の`resizablePanelsHandle`を使います。',
    en: 'The divider’s value is the first pane’s size, so name it after the first pane. Point `aria-labelledby` at its heading when it has one. Without one it falls back to `resizablePanelsHandle` from the dictionary.',
  }),
  controlledTitle: message({
    ja: '制御モード',
    en: 'Controlled',
  }),
  controlledDescription: message({
    ja: '`onChange`はドラッグの間も割合を受け取ります。キーボードでは`step`ずつ動きます。',
    en: '`onChange` receives the share while dragging, too. From the keyboard it moves by `step`.',
  }),
};

export const tabs = {
  description: message({
    ja: 'タブで内容を切り替えます。パネルはクロスフェードで切り替わり、キーボード操作はWAI-ARIAのtabsに従います。',
    en: 'Switches content with tabs. Panels cross-fade, and the keyboard follows the WAI-ARIA tabs pattern.',
  }),
  defaultSelectedTitle: message({
    ja: '既定の選択',
    en: 'Default selection',
  }),
};

export const breadcrumb = {
  description: message({
    ja: '今のページまでの階層を示すパンくずリストです。',
    en: 'A breadcrumb trail showing the path to the current page.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  currentPageTitle: message({
    ja: '現在のページ',
    en: 'Current page',
  }),
};

export const pagination = {
  description: message({
    ja: '前後のボタンと現在の位置だけのページ送りです。ページ番号の一覧はありません。',
    en: 'Paging with previous and next buttons and the current position. There is no list of page numbers.',
  }),
  disabledTitle: message({
    ja: '無効',
    en: 'Disabled',
  }),
};

export const sideNav = {
  description: message({
    ja: '見出しごとにまとめたリンクのサイドナビです。今のページは傍線で示します。',
    en: 'Side navigation with links grouped under titles. The current page is marked with a bar.',
  }),
  basicDescription: message({
    ja: '`@k8ordo/ui`はルーターを持たないので、どのリンクが今のページかは`current`で渡します。そのリンクには`aria-current="page"`が付き、傍線で示されます。',
    en: '`@k8ordo/ui` has no router, so you say which link is current with `current`. That link gets `aria-current="page"` and the bar.',
  }),
  renderAnchorTitle: message({
    ja: 'ルーターのリンクへの差し替え',
    en: 'Using your router’s link',
  }),
  renderAnchorDescription: message({
    ja: '`renderAnchor`は、リンクの要素そのものを差し替えます。受け取るpropsには`href`と`className`、`children`、`aria-current`が入っています。ドロワーを閉じる`onClick`のように、渡した属性もすべて入っています。',
    en: '`renderAnchor` replaces the link element itself. The props it receives hold `href`, `className`, `children` and `aria-current`, plus every attribute you passed, such as an `onClick` that closes a drawer.',
  }),
};

export const tableOfContents = {
  description: message({
    ja: 'ページの目次です。今読んでいる見出しを示します。',
    en: 'The table of contents of a page. It marks the heading being read.',
  }),
  basicDescription: message({
    ja: '見出しは`{ id, label, children? }`の木で渡します。下の目次はこのページ自身の見出しを指しているので、スクロールすると現在の見出しが動きます。',
    en: 'Pass the headings as a tree of `{ id, label, children? }`. The contents below point at this page’s own headings, so the current one moves as you scroll.',
  }),
  activeTitle: message({
    ja: '現在の見出しの決め方',
    en: 'How the current heading is chosen',
  }),
  activeDescription: message({
    ja: '見出しの`scroll-margin-block-start`の位置を基準に、そこを最後に越えた見出しを現在の見出しとします。固定ヘッダーの高さを見出しの`scroll-margin`に指定しておけば、目次から飛んだ見出しがそのまま選ばれます。文書の終わりまで来たときは、最後の節が短くても最後の見出しを選びます。縦書きの文書では読む向きで決めます。`vertical-rl`なら右から左、`vertical-lr`なら左から右です。',
    en: 'The current heading is the last one whose `scroll-margin-block-start` position has scrolled past the top. Give the headings the scroll margin your sticky header needs, and a heading reached from the contents becomes current. At the end of the document the last heading is current even if its section is short. A vertical document is read in its own direction: right to left for `vertical-rl`, left to right for `vertical-lr`.',
  }),
};

export const inView = {
  description: message({
    ja: '子要素が画面やスクロール領域に入っているかを知らせます。遅延読み込みや、スクロールに合わせた表示に使います。',
    en: 'Reports whether its children are in the viewport or a scroll container. Use it for lazy loading or scroll-triggered reveals.',
  }),
  onceTitle: message({
    ja: '`once`',
    en: '`once`',
  }),
  onceDescription: message({
    ja: '`once`を付けると、最初に見えた時点で観測をやめます。その後に外れても`false`を知らせません。',
    en: 'With `once`, observation stops the first time the children are in view. Leaving afterwards reports nothing.',
  }),
  multipleTitle: message({
    ja: '複数の子要素',
    en: 'Multiple children',
  }),
  multipleDescription: message({
    ja: '要素が複数あるときは、どれか1つでも見えていれば`true`になります。後から増えたり外れたりした要素にも追従します。見えていた要素が外れて見えているものが無くなれば、`false`を知らせます。観測する要素がまだ1つも無い間は`onChange`を呼びません。',
    en: 'With several elements, it is `true` while any of them is in view. It follows elements that mount or unmount later: when a visible element unmounts and nothing else is in view, it reports `false`. Until there is an element to observe, `onChange` is not called.',
  }),
};

export const resize = {
  description: message({
    ja: '子要素の大きさが変わったときに`onChange`を呼びます。',
    en: 'Calls `onChange` when the size of its children changes.',
  }),
  initialNotice: message({
    ja: '`onChange`は観測を始めた時点でも1回呼ばれます。引数は無いので、必要な値はハンドラの中でDOMから読んでください。',
    en: '`onChange` is also called once when observation starts. It takes no argument; read what you need from the DOM in the handler.',
  }),
};

export const icons = {
  description: message({
    ja: '`@k8ordo/ui`のアイコンの一覧です。`Logo`を除き、どれも`aria-hidden`の`<svg>`で、名前は周りのボタンなどが持ちます。',
    en: 'The icons in `@k8ordo/ui`. Except for `Logo`, each is an `aria-hidden` `<svg>`, and the control around it carries the name.',
  }),
  sizesTitle: message({
    ja: 'サイズ',
    en: 'Sizes',
  }),
  propsDescription: message({
    ja: 'アイコンは共通で`size`を受け取ります。向きを持つ`ChevronIcon`と、ステータスを表す`AlertIcon`には追加のpropsがあります。`Logo`は`size`を持たないSVG本体で、大きさは`className`で決めます。`size`でそろえるときは`LogoIcon`を使います。',
    en: 'Icons share a `size` prop. `ChevronIcon` (direction) and `AlertIcon` (status) take additional props. `Logo` is the bare SVG without `size`, sized through `className`; use `LogoIcon` to size it like the other icons.',
  }),
};
