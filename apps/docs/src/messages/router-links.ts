import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルート表のパターンから`href`でリンクのURLを作り、ふつうの`<a>`に渡します。ボタンを押したあとなど、コードからページを移るときは`navigateTo`を使います。',
  en: 'Build a link’s URL with `href` from a pattern in the route table and hand it to a plain `<a>`. To change pages from code, after a button press for instance, use `navigateTo`.',
});

export const hrefTitle = message({
  ja: 'リンク先のURL',
  en: 'Link URLs',
});

export const hrefArguments = message({
  ja: '`href`は、パターンとparamからURLの文字列を作ります。paramの無いパターンには、2つ目の引数を渡しません。',
  en: '`href` builds a URL string from a pattern and its params. A pattern without params takes no second argument.',
});

export const hrefValues = message({
  ja: 'paramの値には、文字列のほかに数値と`bigint`と真偽値を渡せます。値は`encodeURIComponent`で符号化されるので、`/`を含む値もパスの1つの区間になります。',
  en: 'A param value is a string, a number, a `bigint` or a boolean. Values are encoded with `encodeURIComponent`, so one containing `/` still becomes a single path segment.',
});

export const hrefReturn = message({
  ja: '返り値は、`<a>`の`href`属性にそのまま渡せます。アプリをベースパスの下で配信しているときは、ベースパスが先頭に付きます。詳しくは',
  en: 'The result goes straight into an `<a>`’s `href` attribute. When the app is served under a base path, the base path comes first. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const hrefErrors = message({
  ja: '型エラーを無視して呼ぶと、次の3つの場合に実行時に`TypeError`になります。',
  en: 'If a call gets past the type checks, it throws a `TypeError` at run time in three cases:',
});

export const hrefErrorList = [
  message({
    ja: '`/*`を含むパターン：`is a wildcard — it has no href`',
    en: 'A pattern containing `/*`: `is a wildcard — it has no href`',
  }),
  message({
    ja: '値の無いparam：`needs a value for ":id"`',
    en: 'A param without a value: `needs a value for ":id"`',
  }),
  message({
    ja: 'オブジェクトなど、URLに書けない値：`has no URL spelling`',
    en: 'A value with no URL form, such as an object: `has no URL spelling`',
  }),
];

export const anchorTitle = message({
  ja: 'リンクの書き方',
  en: 'Writing a link',
});

export const anchorNoLink = message({
  ja: 'このルーターに`<Link>`コンポーネントはありません。`<a>`をクリックするとブラウザが`navigate`イベントを発火し、ルーターがそれを受け取ってページを切り替えます。パターンの検査は`href`が行うので、リンクは`<a>`のまま書きます。',
  en: 'This router has no `<Link>` component. Clicking an `<a>` fires the browser’s `navigate` event, and the router handles that event and changes the page. `href` checks the pattern, so links stay plain `<a>` elements.',
});

export const anchorOthers = message({
  ja: 'ほかのオリジンやルート表に無いパスへのリンクは、ブラウザがふつうに読み込みます（',
  en: 'A link to another origin, or to a path missing from the route table, is an ordinary page load (see ',
});

export const anchorOthersAfter = message({
  ja: '）。',
  en: ').',
});

export const anchorCurrent = message({
  ja: '今開いているページへのリンクに印を付けるには、`useMatch`を使います。書き方は',
  en: 'To mark the link to the page that is open, use `useMatch`. See ',
});

export const navigateTitle = message({
  ja: 'コードからの遷移',
  en: 'Navigation from code',
});

export const navigateArguments = message({
  ja: '`navigateTo`は、`href`と同じ引数でURLを作り、そのページへ移ります。既定では履歴に新しいエントリを追加するので、ブラウザの戻るボタンで前のページに戻れます。',
  en: '`navigateTo` builds the URL from the same arguments as `href` and goes to that page. By default it adds a new history entry, so the browser’s back button returns to the previous page.',
});

export const navigateReplace = message({
  ja: "今のエントリを置き換えるには、`{ history: 'replace' }`を渡します。paramの無いパターンでは、オプションが2つ目の引数になります。",
  en: "To replace the current entry instead, pass `{ history: 'replace' }`. For a pattern without params, the options are the second argument.",
});

export const navigateSplit = message({
  ja: 'ページの中の状態だけを変えるときは、`@k8ordo/state`の`update()`を使います。詳しくは',
  en: 'To change only the state within a page, use `@k8ordo/state`’s `update()`. See ',
});

export const finishedTitle = message({
  ja: '`finished`の待ち方',
  en: 'Awaiting `finished`',
});

export const finishedReturn = message({
  ja: '`navigateTo`は、Navigation APIの`navigation.navigate()`と同じ`{ committed, finished }`を返します。`finished`は、新しいページが画面に表示されたときに解決します。',
  en: '`navigateTo` returns the same `{ committed, finished }` as the Navigation API’s `navigation.navigate()`. `finished` resolves once the new page is on screen.',
});

export const finishedAction = message({
  ja: '`useTransition`のアクションの中で`finished`を待つと、ページが表示されるまで`isPending`が`true`になります。',
  en: 'Await `finished` inside a `useTransition` action, and `isPending` is `true` until the page is on screen.',
});

export const finishedAbort = message({
  ja: '待っている間に別のナビゲーションが始まると、`finished`は`AbortError`という名前の`DOMException`でrejectします。例のように中断だけを無視して、ほかのエラーは`throw`し直します。',
  en: 'If another navigation starts while you wait, `finished` rejects with a `DOMException` named `AbortError`. As in the example, ignore the abort and rethrow anything else.',
});

export const downloadTitle = message({
  ja: 'ファイルへのリンク',
  en: 'File links',
});

export const downloadProblem = message({
  ja: 'ルート表の最後に`/*`を置くと、表はどのパスにも一致します。ホストが配信するファイルへのリンクもルーターが扱うので、`/report.pdf`を開くとファイルでなく`/*`のページが描画されます。',
  en: 'With `/*` at the end of the route table, the table matches every path. The router then handles a link to a file the host serves too, so opening `/report.pdf` renders the `/*` page instead of the file.',
});

export const downloadFix = message({
  ja: '`download`属性を付けると、`navigate`イベントの`downloadRequest`が`null`でなくなります。ルーターはこのイベントを扱わないので、ファイルがそのまま保存されます。',
  en: 'With the `download` attribute, the `navigate` event’s `downloadRequest` is no longer `null`. The router does not handle that event, so the file is saved as is.',
});

export const downloadFramework = message({
  ja: '`@k8ordo/framework`の下でも、`download`を付けると読み込み直しの往復を省けます。詳しくは',
  en: 'Under `@k8ordo/framework`, `download` also saves a reload. See ',
});
