export type Messages = {
  /** Alert / Dialog / Drawer の閉じるボタン */
  close: string;
  /** FormControl の必須バッジ */
  required: string;
  /** Spinner の読み込み中ラベル */
  loading: string;
  /** Avatar の名前が無いときの代替名 */
  avatar: string;
  /** Code の色見本ラベル。実際の色文字列と `: ` で連結される */
  color: string;

  /** Alert のステータスを読み上げ専用テキストで補う */
  alertSuccess: string;
  alertInfo: string;
  alertWarning: string;
  alertError: string;

  /** Toast のビューポート（region ランドマーク）名 */
  toastRegion: string;

  /** CopyButton の既定のラベル */
  copy: string;
  /** CopyButton が押した結果として読み上げる文言 */
  copied: string;
  copyFailed: string;

  autocompletePlaceholder: string;
  /** 選択済みタグ 1 件の解除 */
  autocompleteRemoveTag: string;
  /** 選択済みタグの一括解除 */
  autocompleteClear: string;
  /** 絞り込み結果が空のときの表示 */
  autocompleteEmpty: string;

  fileFieldRemove: string;
  fileFieldTrigger: string;
  /** FileField.Dropzone の既定の案内 */
  fileFieldDrop: string;

  numberFieldIncrement: string;
  numberFieldDecrement: string;

  calendarPreviousMonth: string;
  calendarNextMonth: string;
  /** DatePicker のカレンダーを開くボタン */
  datePickerOpen: string;
  /** DatePicker が開くポップオーバー（dialog）の名前 */
  datePickerDialog: string;

  passwordShow: string;
  passwordHide: string;

  /** ListBox の未選択時に Trigger が示す値 */
  listBoxPlaceholder: string;

  /** Breadcrumb の nav ランドマーク名 */
  breadcrumb: string;
  tabList: string;

  /** Pagination の nav ランドマーク名 */
  paginationLabel: string;
  paginationPrevious: string;
  paginationNext: string;

  /** CodeBlock のコピーボタン */
  codeBlockCopy: string;
  /** Carousel の aria-roledescription（region と各スライド） */
  carousel: string;
  carouselSlide: string;
  carouselPrevious: string;
  carouselNext: string;
  /** TableOfContents の見出し（nav の名前にもなる） */
  tableOfContents: string;

  /** Conversation.Messages の log ランドマーク名 */
  chat: string;
  scrollToLatest: string;
  reasoning: string;
  reasoningStreaming: string;
  /** Suggestion.List の group 名 */
  suggestions: string;
  send: string;
  stop: string;
  toolInput: string;
  toolOutput: string;
  toolError: string;
  toolDenied: string;

  /**
   * Response が描画する Markdown のコントロール文言。
   * 書式名（Markdown / CSV / TSV / SVG / PNG / MMD）は翻訳対象にしない
   */
  responseCopied: string;
  responseCopyCode: string;
  responseCopyLink: string;
  responseCopyTable: string;
  responseCopyTableAsCsv: string;
  responseCopyTableAsMarkdown: string;
  responseCopyTableAsTsv: string;
  responseDownloadDiagram: string;
  responseDownloadDiagramAsMmd: string;
  responseDownloadDiagramAsPng: string;
  responseDownloadDiagramAsSvg: string;
  responseDownloadFile: string;
  responseDownloadImage: string;
  responseDownloadTable: string;
  responseDownloadTableAsCsv: string;
  responseDownloadTableAsMarkdown: string;
  responseExitFullscreen: string;
  responseViewFullscreen: string;
  responseImageNotAvailable: string;
  /** linkSafety を有効にしたときだけ出る外部リンク確認の文言 */
  responseOpenExternalLink: string;
  responseExternalLinkWarning: string;
  responseOpenLink: string;
};
