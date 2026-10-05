import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページを移るときに、前のページから次のページへクロスフェードさせたり、戻るときだけ逆向きにスライドさせたりできます。使うのは、Reactの`<ViewTransition>`と、ルーターがページの切り替えに付ける種類です。',
  en: 'You can cross-fade from one page to the next, or slide the other way only when going back. It takes React’s `<ViewTransition>` and the types the router gives every page change.',
});

export const fadeTitle = message({
  ja: 'ページをクロスフェードする',
  en: 'Cross-fade between pages',
});

export const fadeDescription = message({
  ja: 'ページが描かれる`<Outlet />`を、`<ViewTransition>`で包みます。',
  en: 'Wrap the `<Outlet />` the pages render into in a `<ViewTransition>`.',
});

export const fadeUpdate = message({
  ja: '`update`に書くのは、`<ViewTransition>`そのものは残り、中身だけが入れ替わるからです。`auto`は、ブラウザ標準のクロスフェードです。',
  en: 'It goes in `update` because the `<ViewTransition>` itself stays and only its content changes. `auto` is the browser’s own cross-fade.',
});

export const fadeSite = message({
  ja: 'このサイトも、ページをこれと同じ`<ViewTransition>`で包んでいます。サイドバーから別のページを開くと、本文がクロスフェードします。',
  en: 'This site wraps its pages in this same `<ViewTransition>`. Open another page from the sidebar, and the content cross-fades.',
});

export const typesTitle = message({
  ja: 'ページの切り替えのときだけ動かす',
  en: 'Animate page changes and nothing else',
});

export const typesDescription = message({
  ja: 'ルーターは、ページを切り替える描画に`navigation`という種類を付けます。`update`のキーに`navigation`を書き、`default`を`none`にすると、この種類の描画のときだけアニメーションします。',
  en: 'The router gives every render that changes the page the type `navigation`. With `navigation` as a key of `update` and `default` set to `none`, only renders of that type animate.',
});

export const typesWhy = message({
  ja: '種類で絞るのは、ページの切り替えのほかにも`<ViewTransition>`を動かす更新があるからです。たとえば`@k8ordo/ui`の`Button`は、アクションの実行中をtransitionで表します。絞らないと、ボタンを押すたびにページ全体がクロスフェードしてしまいます。',
  en: 'The filter matters because page changes are not the only updates a `<ViewTransition>` animates. `@k8ordo/ui`’s `Button`, for one, runs its pending action as a transition, and without the filter every press would cross-fade the whole page.',
});

export const typesState = message({
  ja: 'クエリ文字列だけを変える状態の更新は、ページを切り替えないので、アニメーションしません。',
  en: 'An update that changes only the query string does not change the page, so it never animates.',
});

export const directionTitle = message({
  ja: '戻るときは逆向きにスライドする',
  en: 'Slide the other way on back',
});

export const directionDescription = message({
  ja: 'ルーターは`navigation`に加えて、ナビゲーションの種類を表す`navigation-push`、`navigation-replace`、`navigation-traverse`のどれかも付けます。',
  en: 'Besides `navigation`, the router adds one of `navigation-push`, `navigation-replace` and `navigation-traverse`, the kind of navigation it was.',
});

export const directionKinds = message({
  ja: "リンクのクリックと`navigateTo`は`push`です。`{ history: 'replace' }`を渡したときは`replace`で、ブラウザの戻ると進むは`traverse`です。",
  en: "A link click and `navigateTo` are `push`; with `{ history: 'replace' }` it is `replace`, and the browser’s back and forward are `traverse`.",
});

export const directionCss = message({
  ja: '`update`の値は、view transitionのクラス名になります。クラスごとの動きは、`::view-transition-old()`と`::view-transition-new()`で書きます。',
  en: 'Each value in `update` becomes a view transition class. Style each class through `::view-transition-old()` and `::view-transition-new()`.',
});

export const motionTitle = message({
  ja: '動きを減らす設定に従う',
  en: 'Respect reduced motion',
});

export const motionDescription = message({
  ja: '`@k8ordo/ui`のスタイルシートは、`prefers-reduced-motion`が`reduce`のとき、view transitionのアニメーションを止めます。`@k8ordo/ui`を使っていないアプリでは、同じ規則を自分で書きます。',
  en: '`@k8ordo/ui`’s stylesheet turns view-transition animations off when `prefers-reduced-motion` is `reduce`. An app without `@k8ordo/ui` adds the same rule itself.',
});

export const frameworkTitle = message({
  ja: 'フレームワークの下でアニメーションする',
  en: 'Animate under the framework',
});

export const frameworkDescription = message({
  ja: '`@k8ordo/static`や`@k8ordo/server`では、レイアウトの`children`を同じように`<ViewTransition>`で包みます。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server`, wrap a layout’s `children` in the same `<ViewTransition>`.',
});

export const frameworkServer = message({
  ja: '`<ViewTransition>`はServer Componentのレイアウトの中にそのまま書けます。ページの切り替えに付く種類は、フレームワークの下でも同じです。',
  en: 'A Server Component layout can render the `<ViewTransition>` as it is, and page changes carry the same types under the framework.',
});
