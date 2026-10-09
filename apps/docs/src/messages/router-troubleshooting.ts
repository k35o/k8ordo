import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。',
  en: 'Common symptoms, what causes them, and how to fix them.',
});

export const reloadTitle = message({
  ja: 'リンクを押すと、ページ全体が読み込み直される',
  en: 'Clicking a link reloads the whole page',
});

export const reloadCause = message({
  ja: 'リンク先のパスに、ルート表のどのパターンも合っていません。ルーターは表が答えるパスへのナビゲーションだけを引き受け、それ以外はブラウザのふつうのページの読み込みに任せます。アプリをサブパスの下で配信しているときは、サブパスの外のパスも引き受けません。',
  en: 'No pattern in the route table fits the link’s path. The router takes only navigations to paths the table answers, and leaves the rest to the browser as an ordinary page load. When the app is served below a base path, it does not take paths outside that either.',
});

export const reloadFix = message({
  ja: 'リンク先のパターンをルート表に足します。リンクを`href`で作り、`Register`に表を登録しておけば、表に無いパターンは型エラーとして見つかります。',
  en: 'Add the pattern to the route table. Build links with `href` and register the table on `Register`, and a pattern the table lacks shows up as a type error.',
});

export const fileTitle = message({
  ja: 'ファイルへのリンクを押すと、ファイルではなく`/*`のページが出る',
  en: 'A link to a file shows the `/*` page instead of the file',
});

export const fileCause = message({
  ja: 'ルート表の最後にある`/*`は、どのパスにも合います。そのため、ホストが配るファイルへのリンクも、ルーターが引き受けてしまいます。',
  en: 'The `/*` at the end of the route table fits every path, so the router takes a link to a file the host serves as well.',
});

export const fileFix = message({
  ja: 'ファイルへのリンクに`download`属性を付けます。ブラウザがダウンロードだと知らせるので、ルーターは引き受けません。',
  en: 'Give the link the `download` attribute. The browser then reports a download, and the router leaves it alone.',
});

export const orderTitle = message({
  ja: '`/products/new`を開くと、`/products/:id`のページが出る',
  en: '`/products/new` renders the `/products/:id` page',
});

export const orderCause = message({
  ja: '照合はルート表を上から順にたどり、最初に合ったパターンを選びます。`/products/:id`が先に書かれていると、`new`も`:id`に合ってしまいます。',
  en: 'Matching walks the route table from the top and takes the first pattern that fits. With `/products/:id` written first, `new` fits `:id`.',
});

export const orderFix = message({
  ja: '`/products/new`のような決まった区間のパターンを、`:id`のパターンより前に書きます。',
  en: 'Write a literal pattern such as `/products/new` before the `:id` pattern.',
});

export const paramsTitle = message({
  ja: '`useParams`が「rendered under」という例外を投げる',
  en: '`useParams` throws “rendered under”',
});

export const paramsCause = message({
  ja: '`useParams`に渡したパターンと、そのコンポーネントがいま描かれているページのパターンが違います。いくつものページで使うコンポーネントや、レイアウトの中で呼んだときに起きます。',
  en: 'The pattern given to `useParams` is not the pattern of the page the component is rendering under. It happens in a component shared by several pages, or in a layout.',
});

export const paramsFix = message({
  ja: 'ページのコンポーネントの中で、そのページのパターンを渡して呼びます。いくつものページで使うなら、`useRoute`で型の無いparamsを読むか、`useMatch`で開いているページを調べます。',
  en: 'Call it in the page component, with that page’s pattern. In a component shared by several pages, read untyped params with `useRoute`, or check the open page with `useMatch`.',
});

export const frameworkTitle = message({
  ja: 'フレームワークの下で、`useRoute`や`useParams`が例外を投げる',
  en: '`useRoute` or `useParams` throws under the framework',
});

export const frameworkCause = message({
  ja: '`@k8ordo/framework`では、ブラウザにルート表も照合の結果もありません。2つのフックは`<Router>`が持つ照合の結果を読むので、読むものが無く例外を投げます。',
  en: 'Under `@k8ordo/framework`, the browser has neither the route table nor a match. Both hooks read the match `<Router>` holds, so they find nothing and throw.',
});

export const frameworkFix = message({
  ja: 'ページは`params`をpropsで受け取ります。Client Componentでいまいる場所を知りたいときは、`usePathname`か`useMatch`を使います。',
  en: 'A page receives `params` as a prop. To know where you are in a Client Component, use `usePathname` or `useMatch`.',
});

export const pathnameTitle = message({
  ja: '`usePathname`が「needs <Router> above it」という例外を投げる',
  en: '`usePathname` throws “needs <Router> above it”',
});

export const pathnameCause = message({
  ja: 'サーバーでの描画やハイドレーションの間は、ブラウザのURLを読めません。そのとき`usePathname`は、`<Router>`かフレームワークのランタイムが渡すパスを読みますが、どちらも上にありません。',
  en: 'During a server render or hydration, the browser’s URL cannot be read. `usePathname` then reads the path `<Router>` or the framework’s runtime provides, and neither is above it.',
});

export const pathnameFix = message({
  ja: '`<Router>`の下か、フレームワークが描くページの中で使います。`useInterceptedNavigation`で自分の仕組みを作っているときは、`<PathnameProvider>`で描画しているパスを渡します。',
  en: 'Use it under `<Router>` or in a page the framework renders. In a host of your own built on `useInterceptedNavigation`, provide the path being rendered through `<PathnameProvider>`.',
});

export const optionsTitle = message({
  ja: '`bindParams`の`navigateTo`で、`history`のオプションが効かない',
  en: 'The `history` option has no effect on a bound `navigateTo`',
});

export const optionsCause = message({
  ja: 'パターンにparamがあると、2つ目の引数はいつもparamsとして読まれます。すべてのparamを束ねていても同じなので、2つ目に渡したオプションはparamsになり、`history`は無視されます。',
  en: 'When the pattern names a param, the second argument is always read as params, even with every param bound. Options passed second become params, and `history` is ignored.',
});

export const optionsFix = message({
  ja: '2つ目に`undefined`を渡し、オプションは3つ目に渡します。型の検査を通していれば、2つ目に書いたオプションは型エラーになります。',
  en: 'Pass `undefined` second and the options third. With the type check in place, options in second place are a type error.',
});

export const earlyTitle = message({
  ja: '遅いナビゲーションで、リンクの印が先に移る',
  en: 'On a slow navigation, the current link changes too early',
});

export const earlyCause = message({
  ja: 'ナビゲーションではURLが先に書き換わり、新しいページは準備ができてから画面に出ます。`usePathname`と`useMatch`はURLを読むので、前のページが出ている間に新しいパスを返します。ブラウザのアドレスバーと同じ順序です。',
  en: 'A navigation changes the URL first, and the new page appears once it is ready. `usePathname` and `useMatch` read the URL, so they return the new path while the previous page is still showing, in the same order as the address bar.',
});

export const earlyFix = message({
  ja: '読み込み中であることを見せたいときは、`usePendingPathname`で読み込み中のパスを調べます。自分で始めたナビゲーションなら、`navigateTo`の`finished`を待ちます。',
  en: 'To show that a page is loading, check `usePendingPathname`. For a navigation you started, await `navigateTo`’s `finished`.',
});

export const lazyTitle = message({
  ja: '`React.lazy`のページを読み込む間、何も表示されない',
  en: 'Nothing shows while a `React.lazy` page loads',
});

export const lazyCause = message({
  ja: '`error`を書いたオブジェクトは、下のページを`fallback`が`null`の`<Suspense>`で包みます。その下で`React.lazy`のページがサスペンドすると、上のレイアウトの`<Suspense>`まで届かず、何も出ません。',
  en: 'An object with an `error` wraps the pages below in a `<Suspense>` whose `fallback` is `null`. A `React.lazy` page that suspends there never reaches a layout’s `<Suspense>` above, and nothing shows.',
});

export const lazyFix = message({
  ja: '同じオブジェクトに`loading`を書くか、それより下に`<Suspense>`を置きます。',
  en: 'Give the same object a `loading`, or put a `<Suspense>` further down.',
});

export const abortTitle = message({
  ja: '`finished`が`AbortError`でrejectする',
  en: '`finished` rejects with an `AbortError`',
});

export const abortCause = message({
  ja: 'そのナビゲーションが終わる前に、別のナビゲーションが始まりました。追い越されたナビゲーションは中断され、`finished`は中断の理由でrejectします。',
  en: 'Another navigation started before this one finished. The overtaken navigation is abandoned, and its `finished` rejects with the abort reason.',
});

export const abortFix = message({
  ja: '追い越されうる場所で`finished`を待つときは、名前が`AbortError`の`DOMException`だけを無視し、ほかのエラーは投げ直します。',
  en: 'Where `finished` can be overtaken, ignore a `DOMException` named `AbortError` and rethrow anything else.',
});

export const fadeTitle = message({
  ja: 'ボタンを押すたびに、ページ全体がクロスフェードする',
  en: 'Every button press cross-fades the whole page',
});

export const fadeCause = message({
  ja: '`<ViewTransition>`が、ページの切り替え以外のtransitionでも動いています。`@k8ordo/ui`の`Button`のアクションの実行中も、transitionです。',
  en: 'The `<ViewTransition>` runs for transitions other than page changes. A pending action of `@k8ordo/ui`’s `Button` is a transition too.',
});

export const fadeFix = message({
  ja: "`<ViewTransition>`の`default`を`none`にし、`update`に`{ navigation: 'auto', default: 'none' }`を渡します。ルーターが付ける`navigation`の種類のときだけ動くようになります。",
  en: "Set the `<ViewTransition>`’s `default` to `none` and pass `{ navigation: 'auto', default: 'none' }` to `update`. It then runs only for the `navigation` type the router adds.",
});

export const errorTitle = message({
  ja: '検索の条件を変えても、エラーの表示が消えない',
  en: 'Changing a search does not clear the error',
});

export const errorCause = message({
  ja: 'ルート表の`error`の表示は、別のページに移ったときに消えます。クエリ文字列だけを変える状態の更新はページの切り替えではないので、表示は残ります。',
  en: 'The route table’s `error` clears when you move to another page. An update that changes only the query string is not a page change, so the error stays.',
});

export const errorFix = message({
  ja: '`error`のコンポーネントが受け取る`reset`を呼ぶと、その場でページを描き直します。',
  en: 'Call the `reset` the `error` component receives, and the page renders again in place.',
});

export const registerTitle = message({
  ja: '`Register`に登録したのに、表に無いパターンが型エラーにならない',
  en: 'A pattern the table lacks passes despite `Register`',
});

export const registerCause = message({
  ja: '登録を書いたファイルが、TypeScriptの検査の対象に入っていません。フレームワークの下では、`.k8ordo`がドットで始まるため、`tsconfig.json`の`include`にディレクトリの名前だけを書くと読み飛ばされます。',
  en: 'The file holding the registration is not part of what TypeScript checks. Under the framework, `.k8ordo` starts with a dot, so naming just the directory in `tsconfig.json`’s `include` skips it.',
});

export const registerFix = message({
  ja: '登録を書いたファイルを`include`の範囲に置きます。フレームワークの下では、`include`に`.k8ordo/**/*.ts`のグロブを書きます。',
  en: 'Put the file inside what `include` covers. Under the framework, list the glob `.k8ordo/**/*.ts` in `include`.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
