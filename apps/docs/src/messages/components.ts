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

export const toolbar = {
  description: message({
    ja: '矢印キーで行き来するボタンのまとまり',
    en: 'A group of buttons that arrow keys move between.',
  }),
  keyboardDescription: message({
    ja: 'Tab で入れるのは 1 つだけで、中は矢印キーで移ります（`Home` / `End` で端へ、無効な項目は飛ばす）。出て戻ると、最後にいた項目へ戻ります。各項目は `Toolbar.Item` の `renderItem` が渡す `ref` / `tabIndex` / `onFocus` を、`Button` や `IconButton` に広げて作ります。',
    en: 'It takes one Tab stop; arrow keys move inside (`Home` / `End` to the ends, skipping disabled items), and coming back lands on the item last focused. Each item spreads the `ref` / `tabIndex` / `onFocus` that `Toolbar.Item`’s `renderItem` passes onto a `Button` or an `IconButton`.',
  }),
  toggleTitle: message({
    ja: 'トグル',
    en: 'Toggles',
  }),
  toggleDescription: message({
    ja: '押した状態は `aria-pressed` で渡します。ツールバーは押した項目の地を濃くします。',
    en: 'Pass the pressed state as `aria-pressed`; the toolbar shades a pressed item.',
  }),
  verticalTitle: message({
    ja: '縦に並べる',
    en: 'Vertical',
  }),
};

export const contextMenu = {
  description: message({
    ja: '右クリックした位置に開くメニュー',
    en: 'A menu that opens where you right-click.',
  }),
  usageDescription: message({
    ja: '中身は `DropdownMenu` と同じ（`Content` / `Item` / `SubMenu`）で、違うのは開き方と出す位置だけです。キーボードからは、フォーカスのある領域で Shift+F10 やコンテキストメニューキーで開きます。閉じると、開く前にいた要素へフォーカスが戻ります。',
    en: 'The inside is `DropdownMenu`’s (`Content` / `Item` / `SubMenu`); only how it opens and where differ. From the keyboard, press Shift+F10 or the context-menu key on the focused area. When it closes, focus returns to where it was before it opened.',
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

export const table = {
  description: message({
    ja: '意味論を保ちつつ横スクロールにも対応するテーブル',
    en: 'A semantic table component with horizontal overflow support.',
  }),
  emptyStateTitle: message({
    ja: '空状態',
    en: 'Empty State',
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

export const scrollLinked = {
  description: message({
    ja: 'スクロール位置に連動するプログレスバー',
    en: 'A progress bar linked to scroll position.',
  }),
  windowScrollTitle: message({
    ja: 'ウィンドウスクロール',
    en: 'Window Scroll',
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
