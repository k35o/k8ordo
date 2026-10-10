import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルート表の`error`と`loading`で、ページの描画中に例外が起きたときの表示と、ページの準備ができるまでの表示を出せるようになります。`React.lazy`で分けたページの待ち方も扱います。',
  en: 'With `error` and `loading` in the route table, you can show an error view when a page throws while rendering, and a loading view until it is ready. Pages split out with `React.lazy` are covered too.',
});

export const errorTitle = message({
  ja: 'エラーの表示',
  en: 'Error display',
});

export const errorPropsCallout = message({
  ja: '`error`は起きた例外、`reset`は再描画する関数',
  en: '`error` is what was thrown, `reset` renders again',
});

export const errorBoundary = message({
  ja: '`children`を持つオブジェクトには`error`を書けます。その下のページの描画中に例外が起きると、ページの代わりに`error`のコンポーネントを表示します。表示する位置はレイアウトの`<Outlet />`で、レイアウトはそのまま残ります。',
  en: 'An object with `children` can have an `error`. When a page below it throws while rendering, the `error` component shows in its place. It renders where the layout puts `<Outlet />`, and the layout stays on screen.',
});

export const errorProps = message({
  ja: '`error`の型は`unknown`です。`reset()`を呼ぶと、その場で下のページを再描画します。また例外が起きれば、`error`のコンポーネントに戻ります。',
  en: '`error` is typed `unknown`. Calling `reset()` renders the page below again, in place. If it throws again, the `error` component comes back.',
});

export const errorLeave = message({
  ja: 'エラーの表示は、別のページに移って次のページが画面に出たときに消えます。このオブジェクトの下にあるレイアウトも作り直されず、状態を保ちます。クエリだけを変える状態の更新はページの切り替えではないので、エラーの表示は残ります。',
  en: 'The error goes away when you move to another page, at the moment that page is on screen. Layouts below the object are not recreated either, and keep their state. An update that changes only the query is not a page change, so the error stays.',
});

export const errorLayout = message({
  ja: 'レイアウト自身で例外が起きたときは、同じオブジェクトの`error`は表示されません。`error`のコンポーネントはレイアウトの内側に表示するためです。その例外は外側のオブジェクトの`error`が表示し、どこにも無ければ`<Router>`の外まで伝わります。',
  en: 'A layout that throws is not caught by its own object’s `error`, because the `error` component renders inside the layout. The error is caught by the `error` of an object further out, and propagates out of `<Router>` when there is none.',
});

export const loadingTitle = message({
  ja: '読み込み中の表示',
  en: 'Loading display',
});

export const loadingComponent = message({
  ja: '`loading`には、その下のページがサスペンドしている間に出すコンポーネントを書きます。propsは受け取りません。',
  en: '`loading` names the component to show while a page below it suspends. It receives no props.',
});

export const loadingSuspense = message({
  ja: '`loading`を書いた位置に`<Suspense>`が置かれ、`loading`のコンポーネントがその`fallback`になります。`error`も書いたときは、この`<Suspense>`は`error`のエラーバウンダリの内側に置かれます。',
  en: 'A `<Suspense>` goes where `loading` is written, with the `loading` component as its `fallback`. With an `error` beside it, this `<Suspense>` sits inside the `error` boundary.',
});

export const loadingWhen = message({
  ja: '`fallback`が出るのは、ページを最初に開いたときと、ほかのページからこのオブジェクトの下へ移ってきたときです。すでにこのオブジェクトの下にいて別のページへ移るときは、次のページの準備ができるまで前のページを出したままにします。その間に読み込み中を表示したいときは、`usePendingPathname`を使います。使い方は',
  en: 'The `fallback` shows when the page is first opened, and when you arrive from a page outside this object. Moving between pages already inside the object keeps the previous page on screen until the next one is ready. To show a loading state during that time, use `usePendingPathname`, covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const lazyTitle = message({
  ja: 'ページのコード分割',
  en: 'Code splitting a page',
});

export const lazyTable = message({
  ja: 'ページのコンポーネントは、`React.lazy`で包んでルート表に書けます。そのページを初めて描画するときにコードが読み込まれます。',
  en: 'A page component can be wrapped in `React.lazy` and written into the route table. Its code loads the first time the page renders.',
});

export const lazyFallback = message({
  ja: '読み込みの間は、上にある`<Suspense>`の`fallback`が出ます。`loading`を書くか、レイアウトで`<Outlet />`を`<Suspense>`で包んで、`fallback`を出す場所を用意してください。',
  en: 'While the code loads, the `fallback` of the nearest `<Suspense>` above shows. Write a `loading`, or wrap `<Outlet />` in a `<Suspense>` inside a layout, so there is somewhere to fall back to.',
});

export const lazyWhen = message({
  ja: '`fallback`が出る場面は`loading`と同じです。上の例では`/`のオブジェクトがすべてのページを包んでいます。`/settings`を直接開いたときは`fallback`が出て、ホームから`/settings`へ移ったときはコードが読み込まれるまでホームが出たままです。',
  en: 'The `fallback` shows at the same moments as `loading`. In the example, the `/` object wraps every page. Opening `/settings` directly shows the `fallback`, while moving there from the home page keeps the home page on screen until the code has loaded.',
});

export const lazyPitfall = message({
  ja: '`error`を書いたオブジェクトは、下のページを`fallback`が`null`の`<Suspense>`でも包みます。その下で`React.lazy`のページがサスペンドしても、上のレイアウトの`<Suspense>`までは伝わらず、何も表示されません。`fallback`を出したいときは、同じオブジェクトに`loading`を書くか、それより下に`<Suspense>`を置いてください。',
  en: 'An object with an `error` also wraps what is below in a `<Suspense>` whose `fallback` is `null`. A `React.lazy` page that suspends below it never reaches a layout’s `<Suspense>` above, and nothing shows. To show a `fallback`, give the same object a `loading`, or put a `<Suspense>` further down.',
});
