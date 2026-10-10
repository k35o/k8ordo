import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '商品一覧の絞り込みをURLに置く例で、`@k8ordo/state`の使い方をたどります。状態を1つ定義して、コンポーネントで読み書きするところまで進みます。',
  en: 'A walk through `@k8ordo/state` with a product list whose filters live in the URL: define one state, then read and update it in a component.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const navigationApi = message({
  ja: 'ブラウザでは、URLの書き換えにNavigation APIを使います。polyfillもフォールバックもありません。',
  en: 'In the browser, the URL is rewritten through the Navigation API. There is no polyfill and no fallback.',
});

export const zodMiniBefore = message({
  ja: 'このページの例は`zod`で書いていますが、`zod/mini`でも動きます。選び方は',
  en: 'The examples on this page use `zod`, and `zod/mini` works the same. See the zod/mini section of ',
});

export const zodMiniAfter = message({
  ja: 'の「zod/mini」の節を見てください。',
  en: ' to choose between them.',
});

export const defineTitle = message({
  ja: '状態の定義',
  en: 'Defining the state',
});

export const defineKeyCallout = message({
  ja: 'この状態の名前。アプリの中で重ならないものを付ける',
  en: 'The state’s name. Pick one nothing else in the app uses',
});

export const definePlace = message({
  ja: 'リンクを共有したときに同じ一覧が開くように、絞り込みはURLに置きます。URLに置く状態は、`definePageState`の`url`にスキーマで書きます。',
  en: 'A shared link should open the same list, so the filters go in the URL. State kept in the URL is described with a schema in the `url` slot of `definePageState`.',
});

export const defineFields = message({
  ja: 'URLのパラメータは欠けることがあるので、どのフィールドにも`.default()`を付けます。パラメータの値は文字列です。数値は`z.coerce.number()`で、真偽値は`z.stringbool()`で受けます。',
  en: 'A URL parameter can be missing, so every field gets a `.default()`. A URL carries only strings: read the number with `z.coerce.number()` and the boolean with `z.stringbool()`.',
});

export const defineModule = message({
  ja: "定義は`'use client'`の無いモジュールに書き、Server ComponentとClient Componentの両方からimportします。`'use client'`のファイルからexportすると、Server Componentにはclient referenceが渡り、`href`を呼べません。",
  en: "Write the definition in a module without `'use client'`, and import it from Server Components and Client Components alike. Exported from a `'use client'` file, it reaches a Server Component as a client reference, and `href` cannot be called on it.",
});

export const componentTitle = message({
  ja: 'フックでの読み書き',
  en: 'Reading and updating in a component',
});

export const componentReplaceCallout = message({
  ja: '今の履歴エントリを書き換える',
  en: 'Rewrites the current history entry',
});

export const componentPushCallout = message({
  ja: '新しい履歴エントリを追加する',
  en: 'Adds a new history entry',
});

export const componentHook = message({
  ja: 'Client Componentで`useAppState`に定義を渡すと、現在の値と`update`が返ります。`update`は値を変える関数です。',
  en: 'Hand the definition to `useAppState` in a Client Component. It returns the current values and `update`, which changes them.',
});

export const componentSync = message({
  ja: '`update()`に渡した値は次の描画に反映され、URLへの書き込みはそのあとに行われます。書き込みのまとめ方や待ち方は',
  en: 'A value passed to `update()` shows in the next render, and the URL is written after that. How writes are batched and awaited is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const componentHistory = message({
  ja: "`update()`は既定では今の履歴エントリを書き換えます。ページ送りには`{ history: 'push' }`を付けているので、ブラウザの戻るボタンで前のページに戻れます。",
  en: "By default `update()` rewrites the current history entry. Paging passes `{ history: 'push' }`, so the browser’s back button returns to the previous page.",
});

export const tryTitle = message({
  ja: '絞り込みのデモ',
  en: 'Filter demo',
});

export const tryDescription = message({
  ja: 'このページのURLを実際に書き換える`definePageState`です。',
  en: 'A `definePageState` that rewrites this page’s URL for real.',
});

export const trySteps = [
  message({
    ja: '「在庫があるものだけ」にチェックを入れると、クエリが`?inStock=true`になり、在庫のある商品だけが並びます。',
    en: 'Check “In stock only”. The query becomes `?inStock=true`, and only the products in stock are listed.',
  }),
  message({
    ja: '「次のページ」を押すと、クエリに`page=2`が足されます。そのあとブラウザの戻るボタンを押すと、1ページ目に戻ります。',
    en: 'Press “Next page”. `page=2` is added to the query. Then press the browser’s back button, and the list returns to page 1.',
  }),
  message({
    ja: 'チェックを外すと、クエリから`inStock`が消えます。`false`は既定値なので、URLには書かれません。',
    en: 'Uncheck the box. `inStock` disappears from the query: `false` is its default, and defaults are not written to the URL.',
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
