import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '商品一覧の絞り込みをURLに置きながら、`@k8ordo/state`の使い方を最初から最後までたどります。状態を1つ定義し、コンポーネントで読み書きして、サーバーでも読み、最後にリンクを作ります。',
  en: 'Put a product list’s filters in the URL, and follow `@k8ordo/state` from start to finish: define the state once, read and update it in a component, read it on the server, and build links to it.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/state`と、スキーマを書くためのzodをインストールします。',
  en: 'Install `@k8ordo/state`, and zod to write the schemas with.',
});

export const peersDescription = message({
  ja: 'このほかに、次のパッケージをpeer dependenciesとして使います。',
  en: 'It also relies on these peer dependencies.',
});

export const peerReact = message({
  ja: '`useAppState`',
  en: '`useAppState`',
});

export const peerZod = message({
  ja: 'スキーマの記述。`zod`と`zod/mini`のどちらでも書けます',
  en: 'The schemas, written with either `zod` or `zod/mini`',
});

export const peerRouter = message({
  ja: '`href`に渡すパスを、ルート表で型付けするとき。型だけを読むので、実行時には読み込みません',
  en: 'Checking the paths `href` takes against the route table. Only its types are read, so it never loads at runtime',
});

export const peerTypes = message({
  ja: '同梱している型定義',
  en: 'The type declarations it ships',
});

export const navigationApi = message({
  ja: 'ブラウザでは、URLの書き換えにNavigation APIを使います。2026年1月にBaselineに入った機能なので、polyfillもフォールバックもありません。',
  en: 'In the browser it rewrites the URL through the Navigation API. That reached Baseline in January 2026, so there is no polyfill and no fallback.',
});

export const zodMini = message({
  ja: 'このページの例は、読みやすさを優先して`zod`で書いています。ただし`@k8ordo/state`はブラウザでもスキーマで値を読み書きするので、スキーマはバンドルに入ります。アプリがほかで`zod`を使っていなければ、`zod/mini`を選んでください。定義のモジュールをgzipした大きさが、`zod`のおよそ3分の1で済みます。',
  en: 'The examples on this page use `zod` for readability. `@k8ordo/state` reads and writes values with the schema in the browser too, though, so the schema ends up in the bundle. Unless the app already uses `zod` elsewhere, pick `zod/mini`: a typical definition module comes to about a third of the gzipped size.',
});

export const defineTitle = message({
  ja: '状態を定義する',
  en: 'Define the state',
});

export const defineDescription = message({
  ja: 'まず、絞り込みをどこに置くかを決めます。リンクを共有したときにも同じ一覧が開いてほしいので、URLに置きます。URLに置く状態は、`definePageState`の`url`にスキーマで書きます。',
  en: 'First, decide where the filters live. A shared link should open the same list, so they go in the URL: the `url` slot of `definePageState`, described with a schema.',
});

export const defineFields = message({
  ja: 'URLのパラメータはいつでも欠けうるので、どのフィールドにも`.default()`を付けます。また、URLが運ぶのは文字列だけです。そのため、数は`z.coerce.number()`で、真偽値は`z.stringbool()`で受けます。',
  en: 'A URL parameter can always be missing, so every field gets a `.default()`. A URL also carries only strings, which is why the number is read with `z.coerce.number()` and the boolean with `z.stringbool()`.',
});

export const defineModule = message({
  ja: "定義は`'use client'`の無いモジュールに書きます。Server Componentとクライアントの両方からimportするためです。`'use client'`のファイルからexportすると、Server Componentには定義ではなくclient referenceが届き、`href`などを呼べません。",
  en: "Write the definition in a module without `'use client'`, since Server Components and client code both import it. Exported from a `'use client'` file, it would reach a Server Component as a client reference rather than the definition, and `href` and the rest could not be called.",
});

export const defineKey = message({
  ja: "1つ目の引数の`'product-list'`は、この状態の名前です。同じ種類の定義が同じ名前を使うと、1つの状態を黙って共有します。アプリの中で重ならない名前を付けてください。",
  en: "The first argument, `'product-list'`, names this state. Two definitions of the same kind under one name silently share one state, so pick a name nothing else in the app uses.",
});

export const componentTitle = message({
  ja: 'コンポーネントで読み書きする',
  en: 'Read and update it in a component',
});

export const componentDescription = message({
  ja: '次に、クライアントコンポーネントで`useAppState`に定義を渡します。今の値と、値を変える`update`が返ってきます。',
  en: 'Next, hand the definition to `useAppState` in a client component. It returns the current values and `update`, which changes them.',
});

export const componentReplaceCallout = message({
  ja: '今の履歴エントリを書き換える',
  en: 'Rewrites the current history entry',
});

export const componentPushCallout = message({
  ja: '新しい履歴エントリを積む',
  en: 'Adds a history entry',
});

export const componentSync = message({
  ja: '`update()`に渡した値は、次の描画にすぐ出ます。URLへの書き込みはそのあとで行われ、同じハンドラの中で続けて呼んだ分は1回の書き込みにまとまります。',
  en: 'What you pass to `update()` shows in the very next render. The URL is written after that, and calls made one after another in the same handler go out as one write.',
});

export const componentHistory = message({
  ja: "絞り込みを変える更新は、今の履歴エントリを書き換えます。一方でページ送りには`{ history: 'push' }`を付けているので、ブラウザの戻るで1つ前のページに戻れます。",
  en: "Changing the filter rewrites the current history entry. Paging passes `{ history: 'push' }`, so the browser’s back button returns to the previous page.",
});

export const serverTitle = message({
  ja: 'サーバーで読む',
  en: 'Read it on the server',
});

export const serverDescription = message({
  ja: '`@k8ordo/server`のページは、`url`のスキーマを`search`という名前でexportできます。すると、URLから読んだ値を`search`として受け取ります。',
  en: 'A page under `@k8ordo/server` can export the url schema under the name `search`. It then receives what was read from the URL, as `search`.',
});

export const serverParsed = message({
  ja: '`search`には、欠けていたパラメータの既定値がすでに入っています。スキーマに合わない値があれば、そのフィールドだけが既定値に戻ります。そのため、ページはそのまま商品の取得に使えます。',
  en: '`search` already has the defaults filled in for missing parameters, and a value the schema rejects falls back to that field’s default, so the page can fetch the products with it as it is.',
});

export const serverReload = message({
  ja: '絞り込みを変えてクエリが変わると、ページはその値でもう一度読み込まれます。ただし再マウントもスクロールも起きないので、画面の上ではほかの状態の変化と同じに見えます。',
  en: 'When a change to the filters moves the query, the page loads again with the new values. Nothing remounts and nothing scrolls, so on screen it looks like any other state change.',
});

export const serverSeed = message({
  ja: '受け取った値は、`initialUrl`として`useAppState`にも渡します。サーバーの描画とハイドレーションの描画が、既定値ではなくURLの値で行われるので、絞り込みの表示がちらつきません。',
  en: 'Pass the same values on to `useAppState` as `initialUrl`. The server render and the hydration render then show the URL’s values rather than the defaults, so the filters never flicker.',
});

export const serverStatic = message({
  ja: '`@k8ordo/static`は、`search`をexportしたページを見つけるとビルドを止めます。ファイルの中身はクエリによって変えられないからです。そこではサーバーの描画は既定値で行われ、ハイドレーションのあとにURLの値へ切り替わります。',
  en: '`@k8ordo/static` stops the build when a page exports `search`, because a file cannot change with the query. There the server render shows the defaults, and the URL’s values take over after hydration.',
});

export const linksTitle = message({
  ja: 'リンクを作る',
  en: 'Build links',
});

export const linksDescription = message({
  ja: '最後に、絞り込んだ一覧へのリンクを定義の`href`で作ります。指定しなかったフィールドは、既定値として扱われます。',
  en: 'Finally, build links to a filtered list with the definition’s `href`. A field you leave out means its default.',
});

export const linksCanonical = message({
  ja: '既定値と同じフィールドはクエリに書かれないので、同じ状態からはいつも同じ、いちばん短いURLができます。`href`は純粋な関数なので、Server Componentの中でもそのまま呼べます。',
  en: 'A field at its default is left out of the query, so the same state always gives the same, shortest URL. `href` is a pure function, so it works inside a Server Component as it is.',
});

export const tryTitle = message({
  ja: '動かしてみる',
  en: 'Try it',
});

export const tryDescription = message({
  ja: 'このページのURLを実際に書き換える、本物の`definePageState`です。このサイトは`@k8ordo/static`で動いていてサーバーが`search`を受け取れないので、一覧の絞り込みはブラウザで行っています。',
  en: 'A real `definePageState` that rewrites this page’s URL. This site runs on `@k8ordo/static`, where the server cannot receive `search`, so the list is filtered in the browser.',
});

export const trySteps = [
  message({
    ja: '「在庫があるものだけ」にチェックを入れると、クエリが`?inStock=true`になり、在庫のある商品だけが並びます。',
    en: 'Check “In stock only”. The query becomes `?inStock=true`, and only the products in stock are listed.',
  }),
  message({
    ja: '「次のページ」を押すと、クエリに`page=2`が足されます。そのあとブラウザの戻るを押すと、1ページ目に戻ります。',
    en: 'Press “Next page”. `page=2` is added to the query. Then press the browser’s back button, and the list returns to page 1.',
  }),
  message({
    ja: 'チェックを外すと、クエリから`inStock`が消えます。`false`は既定値なので、URLには書かれないからです。',
    en: 'Uncheck the box. `inStock` disappears from the query, because `false` is its default and defaults are not written to the URL.',
  }),
] as const;

export const tryInStock = message({
  ja: '在庫があるものだけ',
  en: 'In stock only',
});

export const tryAvailable = message({
  ja: '在庫あり',
  en: 'In stock',
});

export const trySoldOut = message({
  ja: '売り切れ',
  en: 'Sold out',
});

export const tryPrevious = message({
  ja: '前のページ',
  en: 'Previous page',
});

export const tryNext = message({
  ja: '次のページ',
  en: 'Next page',
});

export const tryQuery = message({
  ja: 'クエリ',
  en: 'Query',
});

export const tryQueryEmpty = message({
  ja: 'クエリなし（すべて既定値）',
  en: 'no query (all defaults)',
});

export const tryProductLamp = message({
  ja: 'デスクライト',
  en: 'Desk lamp',
});

export const tryProductChair = message({
  ja: '木の椅子',
  en: 'Wooden chair',
});

export const tryProductShelf = message({
  ja: '本棚',
  en: 'Bookshelf',
});

export const tryProductRug = message({
  ja: 'ラグ',
  en: 'Rug',
});

export const tryProductPlant = message({
  ja: '鉢植え',
  en: 'Potted plant',
});

export const tryProductClock = message({
  ja: '掛け時計',
  en: 'Wall clock',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextPlaces = message({
  ja: '状態を置ける6つの場所と、それぞれの残り方を知る。',
  en: 'See the six places state can live, and how long each lasts.',
});

export const nextUpdates = message({
  ja: '`update()`がいつ書き込み、呼び出しをどうまとめるかを知る。',
  en: 'Learn when `update()` writes, and how it batches calls.',
});

export const nextReading = message({
  ja: 'ほかのフレームワークで`parseUrl`を使う。リンクのパスを型で確かめる。',
  en: 'Use `parseUrl` under other frameworks, and check link paths with types.',
});
