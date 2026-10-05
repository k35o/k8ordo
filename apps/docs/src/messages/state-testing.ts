import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '定義は純粋なので、`parseUrl`や`href`はそのまま確かめられます。一方で`useAppState`はブラウザのAPIの上で動き、ストアはテストをまたいで残ります。このページでは、テストの側で用意しておくことを説明します。',
  en: 'Definitions are pure, so `parseUrl` and `href` can be checked as they are. `useAppState`, on the other hand, runs on browser APIs, and its stores outlive a single test. This page covers what a test has to set up.',
});

export const pureTitle = message({
  ja: '純粋な関数を確かめる',
  en: 'Check the pure functions',
});

export const pureDescription = message({
  ja: '`parseUrl`と`href`、`search`のほか、Cookieの`parseCookies`と`cookieValue`も、ブラウザ無しで呼べます。Nodeで動くふつうのテストで確かめられます。',
  en: '`parseUrl`, `href` and `search`, and a cookie state’s `parseCookies` and `cookieValue`, all run without a browser, so an ordinary test under Node checks them.',
});

export const pureInput = message({
  ja: '`parseUrl`には、`URLSearchParams`のほかに、フレームワークがページに渡すのと同じ形のオブジェクトも渡せます。`parseCookies`には、`Map`で作ったCookieをそのまま渡せます。',
  en: '`parseUrl` takes a plain object shaped like what a framework hands a page, as well as a `URLSearchParams`, and `parseCookies` takes cookies built as a `Map`.',
});

export const browserTitle = message({
  ja: 'コンポーネントはブラウザで動かす',
  en: 'Run components in a browser',
});

export const browserDescription = message({
  ja: '`useAppState`を使うコンポーネントは、本物のNavigation APIとWeb Storage、Cookie Store APIの上で動きます。そのため、ブラウザの中でテストします。このパッケージ自身は、Vitestのブラウザモードでテストしています。',
  en: 'A component on `useAppState` runs on the real Navigation API, Web Storage and Cookie Store API, so test it in a browser. This package tests itself with Vitest’s browser mode.',
});

export const browserHttps = message({
  ja: 'Cookieの状態を確かめるテストは、HTTPSで配信します。Cookie Store APIは`Secure`を必ず付け、WebKitは`http://localhost`でもそのCookieを捨てるからです。',
  en: 'Serve tests that touch a cookie state over HTTPS: the Cookie Store API always sets `Secure`, and WebKit drops such a cookie even on `http://localhost`.',
});

export const resetTitle = message({
  ja: 'テストのたびに状態を消す',
  en: 'Clear state between tests',
});

export const resetDescription = message({
  ja: 'ストアはProviderの中ではなく、モジュールの中の登録表に残ります。そのため、`resetStateRegistry()`で登録表を空にしないと、前のテストの状態が次のテストに持ち越されます。',
  en: 'Stores live in a registry inside the module, not under a Provider. Unless `resetStateRegistry()` empties it, one test’s state carries into the next.',
});

export const resetRows = message({
  ja: '登録表を空にしても、ブラウザに保存した行は残ります。localStorageとsessionStorageの行は定義の`storageKey`で、Cookieは`cookieName`で消します。',
  en: 'Emptying the registry leaves the stored rows in the browser. Delete them by the definition’s `storageKey` in its storage area, and a cookie by its `cookieName`.',
});

export const resetUnmount = message({
  ja: '`resetStateRegistry()`の前に、コンポーネントをアンマウントしてください。マウントされたままのフックは、クロージャを通して古いストアを持ち続けます。',
  en: 'Unmount components before calling `resetStateRegistry()`. A hook that is still mounted keeps its old store through closures.',
});

export const routerTitle = message({
  ja: 'テストがルーターの代わりをする',
  en: 'Let the test play the router',
});

export const routerDescription = message({
  ja: 'URLを変える`update()`は、`navigation.navigate()`を呼びます。誰も受け止めなければ、それは別のドキュメントの読み込みになり、テストを動かしているページごと移動してしまいます。そこで、ルーターの代わりにテスト自身が`navigate`イベントを受け止めます。',
  en: 'An `update()` that changes the URL calls `navigation.navigate()`. If nothing intercepts it, that is a cross-document load, and the page running the tests navigates away. So the test intercepts the `navigate` event itself, as a router would.',
});

export const routerHome = message({
  ja: 'テストが書き換えたURLは、次のテストの前に元に戻しておきます。戻すときも受け止める必要があるので、イベントの登録はURLを戻したあとに外します。',
  en: 'Put back the URL a test rewrote before the next one runs. Putting it back needs intercepting too, so remove the listener only after the URL is restored.',
});

export const tabsTitle = message({
  ja: 'ほかのタブの書き込みを再現する',
  en: 'Stand in for another tab',
});

export const tabsDescription = message({
  ja: 'タブをまたぐ同期も、1つのページの中で確かめられます。',
  en: 'Syncing across tabs can be checked from a single page.',
});

export const tabsStorage = message({
  ja: '`storage`イベントは、書き込んだのとは別のタブにしか届きません。そのため、`setItem`で行を書いてから、`StorageEvent`を自分で出します。',
  en: 'The `storage` event only reaches tabs other than the one that wrote, so write the row with `setItem` and dispatch the `StorageEvent` yourself.',
});

export const tabsCookie = message({
  ja: '一方でCookie Store APIの`change`イベントは、同じタブにも届きます。テストが自分で`cookieStore.set()`を呼べば、それがほかのタブからの書き込みの代わりになります。値は、ブラウザのストアと同じくパーセントエンコードして書きます。',
  en: 'The Cookie Store API’s `change` event, by contrast, reaches the same tab too, so a test’s own `cookieStore.set()` stands in for another tab’s write. Encode the value as the browser store does, with percent-encoding.',
});
