import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state`がどう動いているかを説明します。使い方を覚えるのに必要な内容ではありませんが、なぜそう書くのかが分かると、迷ったときに判断しやすくなります。',
  en: 'How `@k8ordo/state` works underneath. None of it is needed to use the package, but knowing why it is written this way makes the edge cases easier to reason about.',
});

export const shapeTitle = message({
  ja: '定義は純粋で、ストアはブラウザにある',
  en: 'Definitions are pure; stores live in the browser',
});

export const shapeDescription = message({
  ja: '定義は、スキーマと純粋な関数だけのデータです。メモリの状態なら、スキーマの代わりに初期値を持ちます。中にストアを持たないので、Server Componentがimportしても、サーバーに状態は生まれません。',
  en: 'A definition is plain data: schemas, or a memory state’s initial values, and pure functions. It holds no store, so a Server Component imports it without creating any state on the server.',
});

export const shapeStore = message({
  ja: 'ブラウザのストアは、最初に`useAppState`が呼ばれたときに作られ、定義の種類と文字列のキーで登録されます。HMRで定義のモジュールが評価し直されて新しいオブジェクトになっても、キーが同じなら同じ状態につながるのはそのためです。',
  en: 'The live store is created by the first `useAppState`, and registered by the definition’s kind and string key. That is why an HMR re-evaluation, which produces a new definition object, reconnects to the state it already had.',
});

export const shapeImport = message({
  ja: 'モジュールを読み込んだだけでは、`navigation`や`localStorage`、`document.cookie`には触れません。そのため定義は、サーバーでもテストでも、そのままimportできます。',
  en: 'Loading the module touches nothing: not `navigation`, not `localStorage`, not `document.cookie`. So a definition imports safely on the server and in tests.',
});

export const shapeDuplicate = message({
  ja: '同じ種類の定義が同じキーを使っても、実行時には知らせません。HMRで評価し直せば、同じキーがもう一度登録されるのが正しい動きだからです。そこで警告を出すと、編集するたびに誤った警告が出てしまいます。',
  en: 'Two definitions of one kind sharing a key are not reported at runtime. An HMR re-evaluation legitimately registers the same key again, so a warning would go off on every edit.',
});

export const providerTitle = message({
  ja: 'Providerが無い理由',
  en: 'Why there is no Provider',
});

export const providerDescription = message({
  ja: 'URLと履歴エントリ、Web Storage、Cookieは、どれもブラウザに1つずつしかありません。ストアはそれをそのまま映しているだけなので、Providerで範囲を区切る理由がありません。',
  en: 'The URL, the history entry, Web Storage and the cookie jar each exist once in the browser. The stores mirror them one to one, so there is nothing for a Provider to scope.',
});

export const providerTests = message({
  ja: 'その代わり、テストではストアがテストをまたいで残ります。テストのたびに`resetStateRegistry()`を呼ぶのは、そのためです。',
  en: 'The flip side is that in tests a store outlives each test, which is why every test calls `resetStateRegistry()`.',
});

export const routerTitle = message({
  ja: 'ルーターに求めること',
  en: 'What the router must do',
});

export const routerDescription = message({
  ja: 'ルーターの性質に左右される操作は2つだけで、ほかはどのルーターの下でも動きます。',
  en: 'Only two operations depend on the router; everything else works under any router.',
});

export const routerLinks = message({
  ja: '`href`と`search`で作ったリンク、GETフォーム：何も要りません。クリックや送信は、ルーターかブラウザが処理します。',
  en: 'Links from `href` and `search`, and GET forms: nothing. The router or the browser handles the click or the submission.',
});

export const routerNoNavigation = message({
  ja: 'URLを変えない`update()`：何も要りません。`entry`やWeb Storage、Cookie、メモリの書き込みは、遷移を伴わないからです。',
  en: 'An `update()` that leaves the URL alone: nothing. Writes to `entry`, Web Storage, a cookie or memory involve no navigation.',
});

export const routerUrlUpdate = message({
  ja: 'URLを変える`update()`：Navigation APIの遷移を受け止めるルーターが要ります。',
  en: 'An `update()` that changes the URL: a router that intercepts Navigation API navigations.',
});

export const routerServer = message({
  ja: 'サーバーで`url`を読むこと：ページにクエリを渡すルーターが要ります。`@k8ordo/framework`のserverモードなら、`search`のexportです。',
  en: 'Reading `url` on the server: a router that hands the page its query. In `@k8ordo/framework`’s server mode, that is the `search` export.',
});

export const routerStateChange = message({
  ja: 'URLを変える`update()`は`navigation.navigate()`を呼びます。`@k8ordo/router`の下では、`@k8ordo/framework`のページも含めて、pathnameが変わらない遷移はページの切り替えではなく状態の変更です。ルーターは何も読み込まずに受け止め、何も再マウントせず、スクロールもフォーカスも動かしません。`update()`がすでに新しい値を描いているので、`finished`はその遷移が落ち着いた時点で解決します。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. Under `@k8ordo/router`, pages rendered by `@k8ordo/framework` included, a navigation that keeps the pathname is a state change, not a page change: the router intercepts it without a load, nothing remounts, and scroll and focus stay put. `update()` has already rendered the new values, so `finished` settles once that navigation does.',
});

export const routerSearchPage = message({
  ja: 'ただし、`@k8ordo/framework`のserverモードで`search`をexportしたページのクエリが変わったときは、ページがその場で読み込み直されます。`finished`は、それが表示されるまで待ちます。pathnameはルーターが受け持ち、`?`から後ろはこのパッケージが受け持つという分け方です。',
  en: 'The exception is a page that exports `search` in `@k8ordo/framework`’s server mode: when its query moves, the page loads again in place, and `finished` waits until it is on screen. The pathname is the router’s, and everything from the `?` on is this package’s.',
});

export const routerOthers = message({
  ja: 'Navigation APIの遷移を受け止めないルーター、たとえば今のNext.jsでは、同じ呼び出しがドキュメント全体の読み込みになります。そこではリンクとGETフォームでURLを変えます。History APIで代わりに書く仕組みは、あえて持っていません。',
  en: 'Under a router that does not intercept Navigation API navigations, Next.js today for one, the same call is a full document load; change the URL with links and GET forms there. There is deliberately no History API fallback.',
});

export const salvageTitle = message({
  ja: '壊れた値は、そのフィールドだけを既定値に戻す',
  en: 'A broken value resets only its own field',
});

export const salvageDescription = message({
  ja: '境界を越えて戻ってきた値は、信頼できる状態ではなく入力として扱います。読むときは、次の順に進みます。',
  en: 'A value coming back across a boundary is input, not trusted state. It is read in these steps.',
});

export const salvageWhole = message({
  ja: 'スキーマ全体で読みます。通れば、それで終わりです。',
  en: 'Parse with the whole schema. If that passes, it is done.',
});

export const salvageFields = message({
  ja: '通らなければ、フィールドを1つずつスキーマに通し、通ったものだけを残します。',
  en: 'If not, run each field through its own schema, and keep the ones that pass.',
});

export const salvageAgain = message({
  ja: '残したフィールドで、もう一度スキーマ全体を通します。オブジェクト全体の`.refine()`は、ここで走ります。',
  en: 'Run what was kept through the whole schema again. An object-level `.refine()` runs here.',
});

export const salvageDefaults = message({
  ja: 'それでも通らなければ、すべてを既定値に戻します。すべてが既定値の状態は、定義のときに通ることを確かめてあります。',
  en: 'If that still fails, everything falls back to the defaults, which the definition already proved valid as a whole.',
});

export const salvageInput = message({
  ja: '2回目に全体を通すときに渡すのは、各フィールドの出力ではなく、届いたときの入力です。`z.stringbool()`のように、出力をもう一度入力にできないフィールドがあるからです。',
  en: 'The second whole parse is handed the fields as they arrived, not their outputs, because some fields, such as `z.stringbool()`, cannot take their own output as input.',
});

export const salvageRoad = message({
  ja: '`update()`で書いた`url`の値は、いったんクエリ文字列に書いてから読み直します。訪問者のURLと同じ道を通すことで、`z.stringbool()`のような一方向の綴りも正しく動きます。一方で`entry`とWeb Storage、Cookieは、型の付いた値をそのままスキーマに渡します。そのため、そこではスキーマが自分の出力を受け付けなければなりません。',
  en: 'A `url` value written by `update()` goes into a query string and is read back, the road a visitor’s URL takes, which is what lets a one-way spelling like `z.stringbool()` work. `entry`, Web Storage and cookies hand the typed values straight to the schema, which is why there the schema must accept its own output.',
});

export const changeTitle = message({
  ja: '変わったキーだけに知らせる',
  en: 'Only the keys that changed are told',
});

export const changeDescription = message({
  ja: '定義は、キーの集まりを決めています。スキーマのキーか、メモリなら初期値のキーです。そのため、何が変わったかをキーごとに正確に決められます。',
  en: 'A definition fixes its set of keys, the schema’s or a memory state’s initial values’, so change can be decided exactly, key by key.',
});

export const changeCompare = message({
  ja: '比べるのはフィールドごとで、配列とプレーンなオブジェクトは中身を、それ以外は`Object.is`で比べます。`Date`や`Map`、クラスのインスタンスは参照で比べるので、同じ時刻を指す新しい`Date`も変わったものとして扱います。',
  en: 'Each field is compared on its own: arrays and plain objects by content, everything else with `Object.is`. A `Date`, a `Map` or a class instance compares by reference, so a new `Date` for the same moment still counts as a change.',
});

export const changeIdentity = message({
  ja: '変わらなかったフィールドは、前と同じ参照を保ちます。キーを指定した購読には、指定したキーが変わったときだけ知らせます。',
  en: 'A field that did not change keeps its previous reference, and a subscription to some keys is told only when one of those keys changed.',
});

export const sharedTitle = message({
  ja: '分け合う場所は分け合ったまま',
  en: 'Shared ground stays shared',
});

export const sharedDescription = message({
  ja: 'URLとエントリの状態は、1つのページの状態だけのものではありません。ほかの定義やルーター、計測用のパラメータも同じ場所を使います。',
  en: 'The URL and the entry state do not belong to one page state. Other definitions, the router and tracking parameters use them too.',
});

export const sharedOwn = message({
  ja: 'ページの状態が書き換えるのは、自分のパラメータと、エントリの状態の中の自分の名前空間だけです。ほかのものは、書き込みのたびにそのまま運ばれます。',
  en: 'A page state rewrites only its own parameters, and only its own namespace in the entry state. Everything else travels untouched with every write.',
});

export const sharedLive = message({
  ja: '書き込む値は、描画に出した値ではなく、その時点のブラウザの値にバッチの変更を重ねて作ります。書き込む前にほかのタブやほかの定義が書いた値を、巻き戻さないためです。また、まだ書き込んでいないバッチがある間にほかの書き込みが届いても、バッチの変更はその上に重ねたまま残ります。',
  en: 'What is written is built from the browser’s values at that moment with the batch on top, not from what was rendered, so a write from another tab or definition in between is never rolled back. And when another write arrives while a batch is still pending, the batch stays on top of it.',
});

export const sharedCookie = message({
  ja: 'Cookieの書き込みは非同期なので、1つずつ順に行います。前の書き込みが入ってから次の書き込みが今の値を読むので、2つのバッチが互いの値を古い値で上書きすることはありません。',
  en: 'Cookie writes are asynchronous, so they run one at a time, each reading the cookie after the previous one has landed. Two batches never overwrite each other’s fields with stale values.',
});
