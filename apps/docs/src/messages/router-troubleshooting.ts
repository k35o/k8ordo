import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const reloadTitle = message({
  ja: 'リンクで起きる再読み込み',
  en: 'Full page reload on a link click',
});

export const reloadCause = message({
  ja: 'リンク先のパスが、ルート表のどのパターンにも合っていません。ルーターが処理するのは、表に合うパスへのナビゲーションだけです。それ以外は、ブラウザの通常のページの読み込みになります。アプリを`base`の下で配信しているときは、`base`の外のパスも同じです。',
  en: 'No pattern in the route table matches the link’s path. The router handles only navigations to paths the table matches. Everything else is an ordinary page load by the browser. When the app is served under a `base`, a path outside the `base` is left to the browser as well.',
});

export const reloadFix = message({
  ja: 'リンク先のパターンをルート表に足します。リンクを`href`で作り、`Register`に表を登録しておくと、表に無いパターンは型エラーになります。',
  en: 'Add the pattern to the route table. If you build links with `href` and register the table on `Register`, a pattern missing from the table is a type error.',
});

export const fileTitle = message({
  ja: 'ファイルへのリンクで出る`/*`のページ',
  en: 'The `/*` page on a link to a file',
});

export const fileCause = message({
  ja: 'ルート表の最後の`/*`は、どのパスにも合います。ホストが配信するファイルへのリンクも、ルーターが処理してしまいます。',
  en: 'The `/*` at the end of the route table matches every path, so the router handles a link to a file the host serves as well.',
});

export const fileFix = message({
  ja: 'ファイルへのリンクに`download`属性を付けます。ブラウザがダウンロードとして扱うので、ルーターは処理しません。',
  en: 'Give the link the `download` attribute. The browser treats the click as a download, and the router leaves it alone.',
});

export const orderTitle = message({
  ja: '`/products/new`で出る`/products/:id`のページ',
  en: 'The `/products/:id` page at `/products/new`',
});

export const orderCause = message({
  ja: '照合はルート表を上から順にたどり、最初に合ったパターンを選びます。`/products/:id`が先に書かれていると、`new`も`:id`に合います。',
  en: 'The router checks the route table from the top and takes the first pattern that matches. With `/products/:id` written first, `new` matches `:id`.',
});

export const orderFix = message({
  ja: '`/products/new`のような固定のパターンを、`:id`のパターンより前に書きます。',
  en: 'Write a literal pattern such as `/products/new` before the `:id` pattern.',
});

export const paramsTitle = message({
  ja: '`useParams(…) rendered under …`',
  en: '`useParams(…) rendered under …`',
});

export const paramsCause = message({
  ja: '`useParams`に渡したパターンと、そのコンポーネントを描画しているページのパターンが違います。複数のページで使うコンポーネントや、レイアウトの中で呼ぶと起きます。',
  en: 'The pattern given to `useParams` is not the pattern of the page the component renders under. It happens in a component shared by several pages, or in a layout.',
});

export const paramsFix = message({
  ja: 'ページのコンポーネントの中で、そのページのパターンを渡して呼びます。複数のページで使うコンポーネントでは、`useRoute`で型の無い`params`を読むか、`useMatch`で開いているページを調べます。',
  en: 'Call it in the page component, with that page’s pattern. In a component shared by several pages, read untyped `params` with `useRoute`, or check which page is open with `useMatch`.',
});

export const frameworkTitle = message({
  ja: '`useRoute must render inside a matched <Router>`',
  en: '`useRoute must render inside a matched <Router>`',
});

export const frameworkCause = message({
  ja: '`useRoute`と`useParams`は、`<Router>`の照合の結果を読みます。`<Router>`の外や、`<Router>`の無い`@k8ordo/framework`の下で呼ぶと、このエラーになります。',
  en: '`useRoute` and `useParams` read the match held by `<Router>`. Called outside `<Router>`, or under `@k8ordo/framework`, which has no `<Router>`, they throw this error.',
});

export const frameworkFix = message({
  ja: '自分で`<Router>`を置くアプリでは、その下で呼びます。フレームワークの下では、Client Componentで今の場所を知るのに`usePathname`か`useMatch`を使います。ページが`params`を受け取る方法は、',
  en: 'In an app that mounts `<Router>` itself, call them under it. Under the framework, use `usePathname` or `useMatch` to know where you are in a Client Component. For how a page receives `params`, see ',
});

export const frameworkFixAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const pathnameTitle = message({
  ja: '`usePathname needs <Router> above it`',
  en: '`usePathname needs <Router> above it`',
});

export const pathnameCause = message({
  ja: 'サーバーでの描画中とハイドレーション中は、ブラウザのURLを読めません。そのとき`usePathname`は、`<Router>`かフレームワークのランタイムが渡すパスを読みます。どちらも上に無いと、このエラーになります。',
  en: 'During a server render and hydration, the browser’s URL cannot be read. `usePathname` then reads the pathname provided by `<Router>` or by the framework’s runtime. With neither above it, this error is thrown.',
});

export const pathnameFix = message({
  ja: '`<Router>`の下か、フレームワークが描画するページの中で使います。`useInterceptedNavigation`で自前のホストを作っているときは、`<PathnameProvider>`で描画中のパスを渡します。',
  en: 'Use it under `<Router>` or in a page the framework renders. In a host of your own built on `useInterceptedNavigation`, provide the pathname being rendered through `<PathnameProvider>`.',
});

export const optionsTitle = message({
  ja: '`bindParams`の`navigateTo`で効かない`history`',
  en: '`history` ignored on a bound `navigateTo`',
});

export const optionsCause = message({
  ja: 'パターンにparamがあると、2つ目の引数はいつも`params`として読まれます。`bindParams`がすべてのparamを渡していても同じなので、2つ目に渡した`history`は無視されます。',
  en: 'When the pattern has a parameter, the second argument is always read as `params`. This holds even when `bindParams` supplies every parameter, so a `history` passed second is ignored.',
});

export const optionsFix = message({
  ja: '2つ目に`undefined`を渡し、オプションは3つ目に渡します。TypeScriptでは、2つ目に書いたオプションは型エラーになります。',
  en: 'Pass `undefined` second and the options third. In TypeScript, options in second place are a type error.',
});

export const earlyTitle = message({
  ja: 'ページより先に変わるアクティブなリンク',
  en: 'Active link that changes before the page',
});

export const earlyCause = message({
  ja: 'ナビゲーションではURLが先に変わり、新しいページは準備ができてから画面に出ます。`usePathname`と`useMatch`はURLを読むので、前のページが出ている間に新しいパスを返します。ブラウザのアドレスバーと同じ順序です。',
  en: 'A navigation changes the URL first, and the new page appears once it is ready. `usePathname` and `useMatch` read the URL, so they return the new pathname while the previous page is still on screen. This is the same order the browser’s address bar follows.',
});

export const earlyFix = message({
  ja: '読み込み中を見せたいときは、`usePendingPathname`で読み込み中のパスを読みます。自分で始めたナビゲーションなら、`navigateTo`の`finished`を待ちます。',
  en: 'To show that a page is loading, read the pending pathname with `usePendingPathname`. For a navigation you started, await `navigateTo`’s `finished`.',
});

export const lazyTitle = message({
  ja: '読み込み中に何も出ない`React.lazy`のページ',
  en: 'A `React.lazy` page that shows nothing while loading',
});

export const lazyCause = message({
  ja: '`error`を書いたオブジェクトは、その下のページを`fallback`が`null`の`<Suspense>`で包みます。その下で`React.lazy`のページがサスペンドすると、この`<Suspense>`が`null`を出します。上のレイアウトの`<Suspense>`の`fallback`は使われません。',
  en: 'An object with an `error` wraps the pages below it in a `<Suspense>` whose `fallback` is `null`. When a `React.lazy` page suspends under it, that `<Suspense>` renders `null`, and the `fallback` of a layout’s `<Suspense>` above is never used.',
});

export const lazyFix = message({
  ja: '同じオブジェクトに`loading`を書くか、`error`より下に`<Suspense>`を置きます。',
  en: 'Give the same object a `loading`, or put a `<Suspense>` below the `error`.',
});

export const abortTitle = message({
  ja: '`AbortError`でrejectする`finished`',
  en: '`finished` rejecting with `AbortError`',
});

export const abortCause = message({
  ja: 'そのナビゲーションが終わる前に、別のナビゲーションが始まりました。追い越されたナビゲーションは中断され、`finished`は中断の理由でrejectします。',
  en: 'Another navigation started before this one finished. The overtaken navigation is aborted, and its `finished` rejects with the abort reason.',
});

export const abortFix = message({
  ja: '追い越されうる場所で`finished`を待つときは、名前が`AbortError`の`DOMException`だけを無視します。ほかのエラーはそのまま`throw`し直します。',
  en: 'Where `finished` can be overtaken, ignore only a `DOMException` named `AbortError`, and rethrow anything else.',
});

export const fadeTitle = message({
  ja: 'ボタンで起きるクロスフェード',
  en: 'Page cross-fade on every button press',
});

export const fadeCause = message({
  ja: '`<ViewTransition>`が、ページの切り替え以外のトランジションでも動いています。`@k8ordo/ui`の`Button`のアクションの実行中もトランジションです。',
  en: 'The `<ViewTransition>` runs for transitions other than page changes. A pending action of `@k8ordo/ui`’s `Button` is a transition too.',
});

export const fadeFix = message({
  ja: "`<ViewTransition>`の`default`を`none`にし、`update`に`{ navigation: 'auto', default: 'none' }`を渡します。ルーターが付ける`navigation`の種類のときだけ動くようになります。",
  en: "Set the `<ViewTransition>`’s `default` to `none` and pass `{ navigation: 'auto', default: 'none' }` to `update`. It then runs only for the `navigation` transition type the router adds.",
});

export const errorTitle = message({
  ja: 'クエリの変更で消えないエラー',
  en: 'Error that stays after a query change',
});

export const errorCause = message({
  ja: 'ルート表の`error`の表示は、別のページに移ったときに消えます。クエリだけを変える状態の更新は、ページの切り替えに当たりません。表示はそのまま残ります。',
  en: 'The route table’s `error` display clears when you move to another page. A state update that changes only the query is not a page change, so the display stays.',
});

export const errorFix = message({
  ja: '`error`のコンポーネントが受け取る`reset`を呼びます。その場でページが描画し直されます。',
  en: 'Call the `reset` the `error` component receives. The page renders again in place.',
});

export const registerTitle = message({
  ja: '表に無いパターンでも出ない型エラー',
  en: 'No type error for a pattern missing from the table',
});

export const registerCause = message({
  ja: '`Register`のファイルが、TypeScriptの検査の対象に入っていません。フレームワークの下では、`Register`を`.k8ordo`に生成します。ドットで始まるディレクトリは、`include`に親のディレクトリを書いても読み飛ばされます。',
  en: 'The file holding the `Register` augmentation is outside what TypeScript checks. Under the framework, `Register` is generated into `.k8ordo`. A directory whose name starts with a dot is skipped when `include` names only its parent directory.',
});

export const registerFix = message({
  ja: '`Register`のファイルを`include`の範囲に入れます。フレームワークの下では、`include`に`.k8ordo/**/*.ts`のグロブを書きます。',
  en: 'Put the file inside what `include` covers. Under the framework, add the glob `.k8ordo/**/*.ts` to `include`.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
