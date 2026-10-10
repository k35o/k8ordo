import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`parseUrl`や`href`のテストをNodeで、`useAppState`を使うコンポーネントのテストをブラウザで書けるようになります。テストごとにストアと保存した値を消す手順もわかります。',
  en: 'You will be able to test `parseUrl` and `href` under Node, test components that use `useAppState` in a browser, and clear stores and stored values between tests.',
});

export const pureTitle = message({
  ja: '純粋な関数',
  en: 'Pure functions',
});

export const pureRuns = message({
  ja: '`parseUrl`、`href`、`search`はブラウザのAPIを使いません。Cookieの`parseCookies`と`cookieValue`も同じです。Nodeで動くふつうのテストで確かめられます。',
  en: '`parseUrl`, `href`, `search`, and a cookie state’s `parseCookies` and `cookieValue` use no browser API. An ordinary test under Node checks them.',
});

export const pureInput = message({
  ja: '`parseUrl`には`URLSearchParams`か、フレームワークがページに渡す形のオブジェクトを渡します。`parseCookies`には`Map`で作ったCookieを渡します。',
  en: '`parseUrl` takes a `URLSearchParams` or a plain object shaped like what a framework hands a page. `parseCookies` takes cookies built as a `Map`.',
});

export const browserTitle = message({
  ja: 'ブラウザでのテスト',
  en: 'Tests in a browser',
});

export const browserApis = message({
  ja: '`useAppState`を使うコンポーネントは、本物のNavigation APIとWeb Storage、Cookie Store APIの上で動きます。ブラウザの中でテストします。このパッケージ自身はVitestのブラウザモードでテストしています。',
  en: 'A component that uses `useAppState` runs on the real Navigation API, Web Storage and Cookie Store API, so test it in a browser. This package tests itself with Vitest’s browser mode.',
});

export const browserHttps = message({
  ja: 'Cookieの状態を確かめるテストは、HTTPSで配信します。Cookie Store APIが付ける`Secure`の扱いは',
  en: 'Serve tests that touch a cookie state over HTTPS. The `Secure` attribute the Cookie Store API sets is covered in ',
});

export const browserHttpsSee = message({
  ja: 'を参照してください。',
  en: '.',
});

export const resetTitle = message({
  ja: 'テスト間の後始末',
  en: 'Cleanup between tests',
});

export const resetRegistry = message({
  ja: 'ストアはProviderの下にはなく、モジュールの中の登録表に残ります。`resetStateRegistry()`で登録表を空にしないと、前のテストの状態が次のテストに持ち越されます。',
  en: 'Stores live in a registry inside the module, not under a Provider. Unless `resetStateRegistry()` empties it, one test’s state carries into the next.',
});

export const resetStored = message({
  ja: '登録表を空にしても、ブラウザに保存した値は残ります。localStorageとsessionStorageの値は定義の`storageKey`で、Cookieは`cookieName`で消します。',
  en: 'Emptying the registry leaves the values stored in the browser. Remove them by the definition’s `storageKey` in its storage area, and a cookie by its `cookieName`.',
});

export const resetUnmount = message({
  ja: '`resetStateRegistry()`の前に、コンポーネントをアンマウントします。マウントされたままのフックは、クロージャを通して古いストアを持ち続けます。',
  en: 'Unmount components before calling `resetStateRegistry()`. A hook that is still mounted keeps its old store through closures.',
});

export const routerTitle = message({
  ja: 'ルーターの代わり',
  en: 'A router stand-in',
});

export const routerIntercept = message({
  ja: 'URLを変える`update()`は`navigation.navigate()`を呼びます。どのリスナーも`intercept()`を呼ばなければ、別のドキュメントの読み込みになります。テストを動かしているページごと移動してしまいます。そこで、ルーターの代わりにテスト自身が`navigate`イベントを`intercept()`します。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. Without an `intercept()`, that is a cross-document load, and the page running the tests navigates away. So the test intercepts the `navigate` event itself, as a router would.',
});

export const routerHome = message({
  ja: 'テストが書き換えたURLは、次のテストの前に元に戻します。戻す`navigate()`にも`intercept()`が要るので、リスナーはURLを戻したあとに外します。',
  en: 'Put back the URL a test rewrote before the next one runs. The `navigate()` that restores it needs an `intercept()` too, so remove the listener only after the URL is back.',
});

export const tabsTitle = message({
  ja: 'ほかのタブの再現',
  en: 'Another tab’s write',
});

export const tabsStorage = message({
  ja: '`storage`イベントは、書き込んだドキュメント自身では発火しません。`setItem`で値を書いてから、`StorageEvent`を自分で発火させると、ほかのタブからの書き込みの代わりになります。',
  en: 'The `storage` event does not fire in the document that wrote. Write the value with `setItem` and dispatch the `StorageEvent` yourself, and it stands in for another tab’s write.',
});

export const tabsCookie = message({
  ja: 'Cookie Store APIの`change`イベントは、同じタブでも発火します。テストが自分で`cookieStore.set()`を呼べば、それがほかのタブからの書き込みの代わりになります。値は`update()`が書くときと同じく、パーセントエンコードして書きます。',
  en: 'The Cookie Store API’s `change` event fires in the same tab too, so a test’s own `cookieStore.set()` stands in for another tab’s write. Percent-encode the value, as `update()` does when it writes.',
});
