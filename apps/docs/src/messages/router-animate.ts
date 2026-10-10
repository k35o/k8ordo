import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Reactの`<ViewTransition>`で、ページの切り替えにクロスフェードやスライドを付けます。ルーターがページの切り替えに付けるトランジションの種類で絞ると、切り替えのときだけアニメーションします。',
  en: 'Add a cross-fade or a slide to page changes with React’s `<ViewTransition>`. Filter on the transition types the router adds to page changes, and only page changes animate.',
});

export const fadeTitle = message({
  ja: 'クロスフェード',
  en: 'Cross-fade',
});

export const fadeUpdateCallout = message({
  ja: '`<ViewTransition>`自体はマウントされたままで中身だけが変わるので、`update`に書く',
  en: 'The `<ViewTransition>` stays mounted and only its content changes, so this goes in `update`',
});

export const fadeWrap = message({
  ja: 'ページを描画する`<Outlet />`を`<ViewTransition>`で包みます。`auto`はブラウザ標準のクロスフェードです。',
  en: 'Wrap `<Outlet />`, where pages render, in a `<ViewTransition>`. `auto` is the browser’s own cross-fade.',
});

export const fadeSite = message({
  ja: 'このサイトもページを同じ`<ViewTransition>`で包んでいます。サイドバーから別のページを開くと、本文がクロスフェードします。',
  en: 'This site wraps its pages in the same `<ViewTransition>`. Open another page from the sidebar, and the content cross-fades.',
});

export const fadeFramework = message({
  ja: '`@k8ordo/framework`では、レイアウトの`children`を同じ`<ViewTransition>`で包みます。レイアウトの書き方は`@k8ordo/framework`の',
  en: 'Under `@k8ordo/framework`, wrap a layout’s `children` in the same `<ViewTransition>`. Layouts are covered in ',
});

export const fadeFrameworkAfter = message({
  ja: 'を見てください。',
  en: ' for `@k8ordo/framework`.',
});

export const typesTitle = message({
  ja: 'トランジションの種類',
  en: 'Transition types',
});

export const typesNavigation = message({
  ja: 'ルーターは、ページを切り替える描画に`navigation`というトランジションの種類を付けます。`update`に`navigation`のキーを書き、propの`default`と`update`の`default`を`none`にすると、この種類の描画だけがアニメーションします。',
  en: 'The router gives every render that changes the page the transition type `navigation`. Key `update` on `navigation` and set both the `default` prop and `update`’s `default` to `none`, and only renders of that type animate.',
});

export const typesOther = message({
  ja: 'ページの切り替えのほかに、トランジションも`<ViewTransition>`を動かします。`startTransition`で包んだ更新や、`@k8ordo/ui`の`Button`が実行するアクションも対象です。種類で絞らないと、ボタンを押すたびにページ全体がクロスフェードします。',
  en: 'Transitions run a `<ViewTransition>` too, not just page changes. That includes any update wrapped in `startTransition`, such as the action `@k8ordo/ui`’s `Button` runs. Without the filter, every press cross-fades the whole page.',
});

export const typesState = message({
  ja: 'クエリだけを変える状態の更新は、ページを切り替えないのでアニメーションしません。',
  en: 'A state update that changes only the query does not change the page, so it does not animate.',
});

export const directionTitle = message({
  ja: '戻るときのスライド',
  en: 'Slide on back',
});

export const directionKinds = message({
  ja: "ルーターは`navigation`に加えて`navigation-push`、`navigation-replace`、`navigation-traverse`のどれかも付けます。リンクのクリックと`navigateTo`は`push`です。`navigateTo`に`{ history: 'replace' }`を渡すと`replace`になります。ブラウザの戻る、進むは`traverse`です。",
  en: "Besides `navigation`, the router adds one of `navigation-push`, `navigation-replace` and `navigation-traverse`. A link click and `navigateTo` are `push`. Passing `{ history: 'replace' }` to `navigateTo` makes it `replace`. The browser’s back and forward are `traverse`.",
});

export const directionCss = message({
  ja: '`update`の値はview transitionのクラス名になります。クラスごとの動きは、`::view-transition-old()`と`::view-transition-new()`で書きます。',
  en: 'Each value in `update` becomes a view transition class. Style each class through `::view-transition-old()` and `::view-transition-new()`.',
});

export const motionTitle = message({
  ja: '動きを減らす設定',
  en: 'Reduced motion',
});

export const motionRule = message({
  ja: '`prefers-reduced-motion`が`reduce`のとき、view transitionのアニメーションを止めます。`@k8ordo/ui`のスタイルシートにはこの規則が入っているので、書くのは`@k8ordo/ui`を使わないアプリだけです。',
  en: 'This turns view transition animations off when `prefers-reduced-motion` is `reduce`. `@k8ordo/ui`’s stylesheet already includes it, so only an app without `@k8ordo/ui` needs this rule.',
});
