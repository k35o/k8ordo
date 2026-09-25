import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/state` がルーターに求めることと、k8ordo のほかのパッケージやテストとの組み合わせ方です。',
  en: 'What `@k8ordo/state` needs from a router, and how it fits with the other k8ordo packages and with tests.',
});

export const routersTitle = message({
  ja: 'ルーター',
  en: 'Routers',
});

export const routersDescription = message({
  ja: 'ルーターの性質に左右される操作は 2 つです。URL を変える `update()` と、サーバーでの `parseUrl` です。それ以外はどのルーターでも動きます。',
  en: 'Two operations depend on the router: an `update()` that changes the URL, and `parseUrl` on the server. Everything else works under any router.',
});

export const routersTable = {
  operation: message({ ja: '操作', en: 'Operation' }),
  needs: message({ ja: '必要なもの', en: 'Needs' }),
  links: message({
    ja: '`href`・`search` のリンク、GET フォーム',
    en: '`href` / `search` links, GET forms',
  }),
  linksNeeds: message({
    ja: '何も要らない（クリックや送信はルーターが処理する）',
    en: 'Nothing — the router handles the click or the submission',
  }),
  quiet: message({
    ja: '`entry`・local・cookie・memory の値だけを変える `update()`',
    en: 'Updates that change only `entry`, local, cookie or memory values',
  }),
  quietNeeds: message({
    ja: '何も要らない（遷移を伴わない）',
    en: 'Nothing — no navigation is involved',
  }),
  url: message({
    ja: 'URL を変える `update()`',
    en: 'An `update()` that changes the URL',
  }),
  urlNeeds: message({
    ja: 'Navigation API を intercept するルーター',
    en: 'A router that intercepts the Navigation API',
  }),
  server: message({
    ja: 'サーバーでの `parseUrl`',
    en: '`parseUrl` on the server',
  }),
  serverNeeds: message({
    ja: 'ページに search を渡すルーター',
    en: 'A router that hands the page its search',
  }),
};

export const routersNavigate = message({
  ja: 'URL を変える `update()` は `navigation.navigate()` を呼びます。ルーターがその `navigate` イベントを `event.intercept()` で受け止めなければ、それは別のドキュメントの読み込みになります。History API へのフォールバックは、意図して持っていません。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. Unless a router takes that `navigate` event with `event.intercept()`, it is a cross-document load. There is deliberately no History API fallback.',
});

export const kRouterTitle = message({
  ja: '`@k8ordo/router`',
  en: '`@k8ordo/router`',
});

export const kRouterDescription = message({
  ja: '`@k8ordo/router` の下では、pathname が変わらない遷移はページの切り替えではなく状態の変更です。ルーターは何も読み込まずに intercept し、ルート木に触れず、何も再マウントせず、スクロールもフォーカスも動かしません。フィルタを変えてもページの先頭に戻されないのはこのためです。',
  en: 'Under `@k8ordo/router` a navigation that keeps the pathname is a state change, not a page change: the router intercepts it without loading anything, leaves the route tree alone, remounts nothing, and moves neither scroll nor focus. That is why changing a filter never sends the reader back to the top.',
});

export const kRouterSplit = message({
  ja: '`@k8ordo/router` は search params を扱いません。`useSearchParams` は無く、search の文字列も渡しません。境界は URL の `?` で、pathname はルーター、その後ろは `@k8ordo/state` の担当です。',
  en: '`@k8ordo/router` does not deal in search params: there is no `useSearchParams`, and it never hands out the search string. The boundary is the URL’s `?` — the pathname is the router’s, everything after it belongs to `@k8ordo/state`.',
});

export const kRouterRegister = message({
  ja: '`href` のパスの型付けには、ルーターの拡張と同じ `Register` の 1 行を使います。',
  en: 'Typed `href` paths take the same `Register` line as the router’s augmentation.',
});

export const kRouterRegisterLink = message({
  ja: '型付きルート',
  en: 'Typed routes',
});

export const kRouterLink = message({
  ja: '@k8ordo/router のナビゲーション',
  en: 'Navigation in @k8ordo/router',
});

export const frameworkTitle = message({
  ja: '`@k8ordo/static` と `@k8ordo/server`',
  en: '`@k8ordo/static` and `@k8ordo/server`',
});

export const frameworkDescription = message({
  ja: 'このフレームワークのページは `@k8ordo/router` の上で動くので、上の性質はそのまま成り立ちます。違いは 2 つです。ページが search を受け取らないので `url` はブラウザで読まれること、そして `Register` が `.k8ordo/register.gen.ts` に生成されることです。`@k8ordo/server` のページとレイアウトは `request` を受け取るので、`defineCookieState` の値は `parseCookies(request.cookies)` でサーバーから読めます。',
  en: 'Pages under the framework run on `@k8ordo/router`, so everything above holds. Two things differ: a page never receives the search, so `url` is read in the browser, and `Register` is generated into `.k8ordo/register.gen.ts`. Pages and layouts under `@k8ordo/server` do receive `request`, so a `defineCookieState` is read on the server with `parseCookies(request.cookies)`.',
});

export const frameworkLink = message({
  ja: 'フレームワークのページでの読み取り',
  en: 'Reading under the framework',
});

export const otherTitle = message({
  ja: 'Navigation API を intercept しないルーター',
  en: 'Routers that do not intercept the Navigation API',
});

export const otherDescription = message({
  ja: '今の Next.js のように Navigation API を intercept しないルーターでは、URL を変える `update()` はドキュメント全体の読み込みになります。URL の変更はリンクと GET フォームで行い、ページで `parseUrl` して `initialUrl` を渡してください。もともとこのパッケージが勧める粒度です。`entry` のフィールド・localStorage・Cookie・メモリだけを変える `update()` は遷移を伴わないので、そのまま使えます。',
  en: 'On a router that does not intercept the Navigation API — Next.js today — an `update()` that changes the URL is a full document load. Change the URL through links and GET forms, read it on the page with `parseUrl`, and pass `initialUrl` down: the grain this package prefers anyway. Updates that change only entry fields, localStorage, a cookie or memory involve no navigation and work as they are.',
});

export const formTitle = message({
  ja: '`@k8ordo/form` と GET フォーム',
  en: 'GET forms with `@k8ordo/form`',
});

export const formDescription = message({
  ja: '検索や絞り込みのフォームは GET フォームで、その制約と URL の状態は同じスキーマです。`formFields` に `url` スロットのスキーマをそのまま渡します。',
  en: 'A search or filter form is a GET form, and its constraints and its URL state are the same schema: hand the `url` slot’s schema straight to `formFields`.',
});

export const formFlow = message({
  ja: '`formFields` は Server Component で実行され、結果は JSON として props で渡るので、`@k8ordo/form` の側から zod がブラウザに届くことはありません（`useAppState` が使うスキーマは、それとは別に届きます）。フォームは `method="get"` で送信されます。`@k8ordo/router` は GET フォームを intercept するので、送信はクライアント遷移として URL を書き換え、`useAppState` がその値を読み返します。Server Action が無いので、`useForm(fields)` に状態は渡しません。',
  en: '`formFields` runs in the Server Component and its result crosses to the client as JSON props, so `@k8ordo/form` sends no zod to the browser (the schema `useAppState` uses ships regardless). The form submits with `method="get"`; `@k8ordo/router` intercepts GET forms, so the submission rewrites the URL as a client navigation and `useAppState` reads the values back. With no Server Action behind it, `useForm(fields)` takes no state.',
});

export const formNoJs = message({
  ja: 'JavaScript が読み込まれる前でも、送信は URL を正しく書き換えます。ページに search を渡すルーターなら、`parseUrl` でそのまま描画できます。`@k8ordo/static`・`@k8ordo/server` ではサーバーの描画が既定値なので、送信した値が画面に出るのはハイドレーションの後です。',
  en: 'Before JavaScript loads, the submission still writes the URL correctly, and under a router that hands the page its search, `parseUrl` renders from it directly. Under `@k8ordo/static` and `@k8ordo/server` the server render shows the defaults, so the submitted values appear once the page hydrates.',
});

export const formCanonical = message({
  ja: 'GET フォームは名前の付いたすべての入力を送るので、送信直後の URL には既定値のフィールドも残ります（`?q=&min=0`）。読み取りの結果は変わらず、`href` で作ったリンクや、`url` の値を変える次の `update()` で正規の形に戻ります。',
  en: 'A GET form submits every named control, so right after a submission the URL carries fields at their defaults too (`?q=&min=0`). The values read the same, and a link built with `href`, or the next `update()` that changes a `url` value, writes the canonical form again.',
});

export const formDemo = message({
  ja: 'この組み合わせの実物は、このサイトの @k8ordo/form のページにあるデモです。',
  en: 'This exact combination runs as the demo on this site’s @k8ordo/form page.',
});

export const formDemoLink = message({
  ja: '@k8ordo/form のデモ',
  en: 'The @k8ordo/form demo',
});

export const colorTitle = message({
  ja: '`@k8ordo/color-scheme`',
  en: '`@k8ordo/color-scheme`',
});

export const colorDescription = message({
  ja: "`@k8ordo/color-scheme` の保存先は、それ自体が `defineLocalState` です。export されている `colorSchemeState` は `k8ordo-state:color-scheme` の行で、`preference` は `'light'`・`'dark'`・未設定のいずれかです。未設定は何も選ばれていない状態で、provider の `defaultPreference`（指定しなければ `'system'`）が使われます。",
  en: "`@k8ordo/color-scheme` stores its preference through a `defineLocalState` of its own. The exported `colorSchemeState` is the `k8ordo-state:color-scheme` row, whose `preference` is `'light'`, `'dark'`, or absent — nothing chosen, so the provider’s `defaultPreference` applies (`'system'` unless set).",
});

export const colorScript = message({
  ja: '最初の描画の前に `<html>` にクラスを付けるインラインスクリプトは、`colorSchemeState.inlineRead()` から組み立てられています。保存キーも、行を JSON として読む処理も color-scheme には手書きされておらず、タブ間の同期も古い行のサルベージも `@k8ordo/state` が担います。',
  en: 'The inline script that puts the class on `<html>` before the first paint is built from `colorSchemeState.inlineRead()`: neither the storage key nor the code that parses the row is written by hand in color-scheme, and cross-tab sync and the salvage of an old row are `@k8ordo/state`’s.',
});

export const colorRead = message({
  ja: "保存された値は、ほかの localStorage の状態と同じように `useAppState` で読めます。変更は `useColorScheme()` の `setPreference` を通してください。`'system'` を未設定に置き換え、画面のクラスを決めているのは provider だからです。",
  en: "The stored value reads like any other local state, through `useAppState`. Change it through `setPreference` from `useColorScheme()`: it turns `'system'` into an absent value, and the provider is where the class on screen is decided.",
});

export const colorKey = message({
  ja: 'キー `color-scheme` はこのパッケージが使っているので、アプリの `defineLocalState` に同じキーを付けないでください。',
  en: 'The key `color-scheme` is taken by that package; do not give one of your own `defineLocalState` definitions the same key.',
});

export const colorLink = message({
  ja: '@k8ordo/color-scheme の仕組み',
  en: 'How @k8ordo/color-scheme works',
});

export const testingTitle = message({
  ja: 'テスト',
  en: 'Testing',
});

export const testingDescription = message({
  ja: '`parseUrl`・`href`・`search` は純粋な関数なので、ブラウザ無しでそのまま確かめられます。',
  en: '`parseUrl`, `href` and `search` are pure functions and can be asserted directly, with no browser.',
});

export const testingBrowser = message({
  ja: '`useAppState` を使うコンポーネントは本物の Navigation API・localStorage・Cookie Store API の上で動くので、ブラウザ環境でテストします（このパッケージ自身は Vitest のブラウザモードを使っています）。',
  en: 'Components that use `useAppState` run on the real Navigation API, localStorage and Cookie Store API, so test them in a browser environment — this package’s own suite uses Vitest browser mode.',
});

export const testingReset = message({
  ja: '`resetStateRegistry()` は、Provider を持たないストアの登録表をテストの間で空にします。呼ばないと、前のテストの状態が次のテストに持ち越されます。',
  en: '`resetStateRegistry()` clears the provider-less store registry between tests; without it, one test’s state carries into the next.',
});

export const testingUnmount = message({
  ja: '先にコンポーネントをアンマウントしてください。マウントされたままのフックは、クロージャ越しに古いストアを持ち続けます。',
  en: 'Unmount components first: a mounted hook keeps its old store through closures.',
});

export const testingIntercept = message({
  ja: 'URL を書き換える更新をテストするときは、ルーターの代わりにテスト自身が `navigate` イベントを intercept します。intercept されない `navigation.navigate()` はドキュメントの読み込みになり、テストランナーごと移動してしまいます。',
  en: 'When testing URL updates, intercept the `navigate` event in the test itself, as a router would. An unintercepted `navigation.navigate()` is a cross-document load that takes the test runner with it.',
});

export const testingStorage = message({
  ja: 'localStorage の行は定義の `storageKey` で、Cookie は `cookieName`（`await cookieStore.delete(def.cookieName)`）で消せます。Cookie Store API の `change` イベントは同じタブにも届くので、テスト自身が `cookieStore.set()` で書けば、ほかのタブの書き込みの代わりになります。',
  en: 'Clear localStorage rows by the definition’s `storageKey`, and cookies by its `cookieName` (`await cookieStore.delete(def.cookieName)`). The Cookie Store API’s `change` event reaches the same tab too, so a test that writes with `cookieStore.set()` itself stands in for another tab.',
});
