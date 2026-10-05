import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページが描画中に例外を投げたときの表示と、ページの準備ができるまでの表示は、ルート表のオブジェクトに書きます。このページでは、`error`と`loading`の書き方と、`React.lazy`で分けたページの待ち方を説明します。',
  en: 'What to show when a page throws while rendering, and what to show until a page is ready, are written into the route table’s objects. This page covers `error` and `loading`, and how to wait for pages split out with `React.lazy`.',
});

export const errorTitle = message({
  ja: 'エラーを表示する',
  en: 'Show an error',
});

export const errorDescription = message({
  ja: '`children`を持つオブジェクトに`error`を書くと、その下のページが描画中に例外を投げたとき、ページの代わりに`error`のコンポーネントが描かれます。描かれる場所はレイアウトの`<Outlet />`の位置なので、レイアウトはそのまま残ります。',
  en: 'Give an object with `children` an `error`, and when a page below it throws while rendering, the `error` component renders in its place. It renders where the layout puts `<Outlet />`, so the layout itself stays on screen.',
});

export const errorProps = message({
  ja: '`error`のコンポーネントは、投げられた値を`error`で、描き直すための関数を`reset`で受け取ります。`error`は何が投げられてもよいように`unknown`型です。',
  en: 'The `error` component receives what was thrown as `error`, and a function to render again as `reset`. Anything can be thrown, so `error` is typed `unknown`.',
});

export const errorReset = message({
  ja: '`reset()`を呼ぶと、その場で下のページをもう一度描きます。また例外を投げれば、`error`のコンポーネントに戻ります。',
  en: 'Calling `reset()` renders the page below again, in place. If it throws again, the `error` component comes back.',
});

export const errorLeave = message({
  ja: 'エラーの表示は、別のページに移ると消えます。消えるのは次のページが画面に出たときで、オブジェクトの下にあるレイアウトは作り直されず、状態を保ったままです。',
  en: 'The error goes away once you move to another page, at the moment that page is on screen. The layouts inside the object are not recreated, and keep their state.',
});

export const errorStateChange = message({
  ja: 'ただし、クエリ文字列だけを変える状態の更新はページの切り替えではないので、エラーの表示は残ります。',
  en: 'An update that changes only the query string is not a page change, though, so the error stays.',
});

export const errorLayout = message({
  ja: 'レイアウト自身が投げた例外は、同じオブジェクトの`error`では受け止められません。`error`のコンポーネントはレイアウトの内側に描かれるからです。その例外は外側のオブジェクトの`error`に届き、どこにも無ければ`<Router>`の外まで伝わります。',
  en: 'A layout that throws is not caught by its own object’s `error`, which renders inside the layout. The error reaches the `error` of an object further out, and leaves `<Router>` when there is none.',
});

export const loadingTitle = message({
  ja: '読み込み中の表示を出す',
  en: 'Show a loading state',
});

export const loadingDescription = message({
  ja: '`loading`には、その下のページがサスペンドしている間に出すコンポーネントを書きます。このコンポーネントはpropsを受け取りません。',
  en: '`loading` names the component to show while a page below suspends. It receives no props.',
});

export const loadingSuspense = message({
  ja: '`loading`を書いた位置には`<Suspense>`が置かれ、`loading`のコンポーネントがそのfallbackになります。`error`も書いたときは、この`<Suspense>`はエラーを受け止める位置より内側に入ります。',
  en: 'A `<Suspense>` goes where `loading` is written, with the `loading` component as its fallback. With an `error` beside it, the `<Suspense>` sits inside where errors are caught.',
});

export const loadingWhen = message({
  ja: 'fallbackが出るのは、ページを最初に開いたときと、ほかのページからこのオブジェクトの下へ移ってきたときです。',
  en: 'The fallback shows when the app is first opened here, and when you arrive from a page outside this object.',
});

export const loadingKeep = message({
  ja: 'すでにこのオブジェクトの下にいて、別のページへ移るときはfallbackを出しません。次のページの準備ができるまで、前のページを出したままにします。その間の待ちを見せたいときは、「いまいる場所を調べる」で説明する`usePendingPathname`を使います。',
  en: 'Moving between pages already inside the object shows no fallback: the previous page stays until the next one is ready. To show that wait, use `usePendingPathname`, covered in “Find where you are”.',
});

export const lazyTitle = message({
  ja: 'ページのコードを分けて読み込む',
  en: 'Load a page’s code on demand',
});

export const lazyDescription = message({
  ja: 'ページのコンポーネントは、`React.lazy`で包んでからルート表に書いてもかまいません。そのページを初めて描くときに、コードが読み込まれます。',
  en: 'A page component can be wrapped in `React.lazy` before it goes in the route table. Its code then loads the first time the page renders.',
});

export const lazyFallback = message({
  ja: 'コードが届くまでの間は、上にある`<Suspense>`のfallbackが出ます。`loading`を書くか、レイアウトの中で`<Outlet />`を`<Suspense>`で包んで、fallbackを出す場所を用意してください。',
  en: 'Until the code arrives, the fallback of the nearest `<Suspense>` above shows. Write a `loading`, or wrap `<Outlet />` in a `<Suspense>` inside a layout, so there is somewhere to fall back to.',
});

export const lazyWhen = message({
  ja: 'fallbackが出る場面は`loading`と同じです。上の例では`/`のオブジェクトがすべてのページを包んでいるので、`/settings`を直接開いたときはfallbackが出ます。一方で、ホームから`/settings`へ移ったときは、コードが届くまでホームが出たままです。',
  en: 'The fallback shows at the same moments as `loading`. In the example, the `/` object wraps every page, so opening `/settings` directly shows the fallback, while moving there from the home page keeps the home page on screen until the code arrives.',
});

export const lazyPitfall = message({
  ja: '`error`を書いたオブジェクトは、下のページを`fallback`が`null`の`<Suspense>`でも包みます。サーバーでの描画で例外を投げた部分を、ブラウザに任せるためです。そのため、その下で`React.lazy`のページがサスペンドしても、上のレイアウトの`<Suspense>`までは届かず、何も表示されません。fallbackを出したいときは、同じオブジェクトに`loading`を書くか、それより下に`<Suspense>`を置いてください。',
  en: 'An object with an `error` also wraps what is below in a `<Suspense>` whose `fallback` is `null`, so that a part that throws during a server render is left for the browser. A `React.lazy` page that suspends below it therefore never reaches a layout’s `<Suspense>` above, and nothing shows. To show a fallback, give the same object a `loading`, or put a `<Suspense>` further down.',
});
