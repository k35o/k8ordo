import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページへのリンクは、ルート表のパターンから`href`でURLを作り、ふつうの`<a>`に渡します。ボタンを押したあとのように、コードからページを移るときは`navigateTo`を使います。',
  en: 'A link to a page is a plain `<a>` whose URL `href` builds from a pattern in the route table. To change pages from code, after a button press for instance, use `navigateTo`.',
});

export const hrefTitle = message({
  ja: '`href`でリンク先を作る',
  en: 'Build a link with `href`',
});

export const hrefDescription = message({
  ja: '`href`は、パターンとparamからリンク先のURLを作ります。paramの無いパターンには、2つ目の引数を渡しません。',
  en: '`href` builds the URL a link points at from a pattern and its params. A pattern without params takes no second argument.',
});

export const hrefValues = message({
  ja: 'paramの値には、文字列のほかに数値と`bigint`、真偽値も渡せます。どれもURLでの書き方が1通りに決まる値だからです。値は`encodeURIComponent`で符号化されるので、`/`を含む値も1つの区間に収まります。',
  en: 'Besides strings, a param takes numbers, `bigint`s and booleans: each has exactly one way to be written in a URL. Values are encoded with `encodeURIComponent`, so one containing `/` still fits in a single segment.',
});

export const hrefReturn = message({
  ja: '`href`が返すのは、`<a>`の`href`属性にそのまま渡せるURLの文字列です。アプリをサブパスの下で配信しているときは、その分も前に付きます。',
  en: 'What `href` returns is a URL string ready for an `<a>`’s `href` attribute. When the app is served below a base path, that comes in front too.',
});

export const hrefErrors = message({
  ja: '型の検査をすり抜けて呼んだときは、実行時に`TypeError`を投げます。`/*`を含むパターン、値の無いparam、オブジェクトのようにURLでの書き方が無い値の3つです。',
  en: 'Called around the type checks, it throws a `TypeError` at run time for three things: a pattern with `/*`, a param without a value, and a value with no URL spelling, such as an object.',
});

export const anchorTitle = message({
  ja: 'リンクは`<a>`のまま書く',
  en: 'Links stay plain `<a>` elements',
});

export const anchorDescription = message({
  ja: 'このルーターには`<Link>`コンポーネントがありません。`<a>`がクリックされるとブラウザがそれを`navigate`イベントで知らせ、ルーターはそのイベントを受け取ってページを切り替えるからです。',
  en: 'This router has no `<Link>` component. When an `<a>` is clicked, the browser announces it with a `navigate` event, and the router takes that event and changes the page.',
});

export const anchorWhy = message({
  ja: '`<a>`を包むコンポーネントを用意しても、同じことを書く方法が2つに増えるだけです。そのため、パターンの検査は`href`が受け持ち、リンクは`<a>`のまま書きます。',
  en: 'A component wrapping `<a>` would only add a second way to write the same thing, so `href` does the checking and links stay plain `<a>` elements.',
});

export const anchorOthers = message({
  ja: 'ほかのオリジンへのリンクや、ルート表に無いパスへのリンクは、ルーターが引き受けません。ブラウザのふつうのページの読み込みになります。',
  en: 'The router does not take a link to another origin or to a path the route table lacks; it is an ordinary page load.',
});

export const anchorCurrent = message({
  ja: 'いま開いているページへのリンクに印を付けるときも、リンクの属性ではなく`useMatch`に尋ねて決めます。書き方は「いまいる場所を調べる」で説明します。',
  en: 'Marking the link to the page you are on is also a question you ask `useMatch`, not an attribute of the link; see “Find where you are”.',
});

export const navigateTitle = message({
  ja: '`navigateTo`でページを移る',
  en: 'Change pages with `navigateTo`',
});

export const navigateDescription = message({
  ja: '`navigateTo`は、`href`と同じ引数でURLを作り、そのページへ移ります。履歴には新しいエントリが積まれるので、ブラウザの戻るで前のページに戻れます。',
  en: '`navigateTo` builds the URL from the same arguments as `href` and goes there. It adds a new history entry, so the browser’s back button returns to the previous page.',
});

export const navigateReplace = message({
  ja: "いまのエントリを置き換えたいときは、`{ history: 'replace' }`を渡します。paramの無いパターンでは、オプションが2つ目の引数になります。",
  en: "To replace the current entry instead, pass `{ history: 'replace' }`. For a pattern without params, the options are the second argument.",
});

export const navigatePush = message({
  ja: '既定が`push`なのは、ページを移ったことは戻るボタンで取り消せるべきだからです。一方で、`@k8ordo/state`の`update()`は`replace`が既定です。ページの中の絞り込みを変えるたびに履歴が増えると、戻るボタンで1つずつたどることになるからです。',
  en: 'The default is `push` because moving to a page is what the back button should undo. `@k8ordo/state`’s `update()` defaults to `replace` instead, since stepping back through every change to a filter on the same page is not what the back button is for.',
});

export const navigateSplit = message({
  ja: 'ページを変えるときは`navigateTo`を、ページの中の状態を変えるときは`@k8ordo/state`の`update()`を使ってください。',
  en: 'Change pages with `navigateTo`, and change the state within a page with `@k8ordo/state`’s `update()`.',
});

export const finishedTitle = message({
  ja: '移り終わるのを待つ',
  en: 'Wait until the page is on screen',
});

export const finishedDescription = message({
  ja: '`navigateTo`は、Navigation APIの`navigation.navigate()`と同じ`{ committed, finished }`を返します。`finished`が解決するのは、新しいページが画面に出たときです。',
  en: '`navigateTo` returns the same `{ committed, finished }` as the Navigation API’s `navigation.navigate()`. `finished` resolves once the new page is on screen.',
});

export const finishedAction = message({
  ja: '`useTransition`のアクションの中で`finished`を待つと、ページが画面に出るまでの間、`isPending`が`true`になります。ページの切り替えはアクションに加わらないので、待っていても止まることはありません。',
  en: 'Await `finished` inside a `useTransition` action, and `isPending` stays `true` until the page is on screen. The page change never joins the action, so awaiting it never stalls.',
});

export const finishedAbort = message({
  ja: '待っている間に別のナビゲーションが始まると、`finished`は`AbortError`という名前の`DOMException`でrejectします。上の例のように、中断だけを無視して、ほかのエラーは投げ直してください。',
  en: 'If another navigation starts while you wait, `finished` rejects with a `DOMException` named `AbortError`. As in the example, ignore the abort and rethrow anything else.',
});

export const downloadTitle = message({
  ja: 'ファイルへのリンクには`download`を付ける',
  en: 'Give a file link `download`',
});

export const downloadDescription = message({
  ja: 'ルート表の最後に`/*`を置くと、表はどのパスにも答えます。そのため、ホストが配るファイルへのリンクもルーターが引き受け、`/report.pdf`を開くとファイルではなく`/*`のページが描かれます。',
  en: 'With `/*` at the end of the route table, the table answers every path. A link to a file the host serves is then taken by the router too, and `/report.pdf` renders the `/*` page instead of the file.',
});

export const downloadFix = message({
  ja: '`download`属性を付けると、ブラウザはクリックの時点でダウンロードだと知らせます。ルーターはダウンロードを引き受けないので、ファイルがそのまま保存されます。',
  en: 'With the `download` attribute, the browser reports a download at the click. The router leaves downloads alone, so the file is saved as it is.',
});

export const downloadFramework = message({
  ja: '`@k8ordo/framework`の下では、同じオリジンのURLはいったんすべて引き受け、ページではないと分かった時点で読み込み直してファイルを開きます。`download`を付けておけば、この往復を省けます。',
  en: 'Under `@k8ordo/framework`, every same-origin URL is taken at first, and once it turns out not to be a page, the browser reloads into the file. `download` saves that round trip.',
});
