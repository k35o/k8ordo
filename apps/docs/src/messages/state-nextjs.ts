import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Next.jsのApp Routerで`@k8ordo/state`を使えるようになります。サーバーで読んだ値の渡し方と、Next.jsで変わる点をたどります。',
  en: 'Use `@k8ordo/state` under the Next.js App Router: hand the server-read values to the client, and know what changes under Next.js.',
});

export const worksTitle = message({
  ja: '動くもの',
  en: 'What works as is',
});

export const worksSame = message({
  ja: '定義と`useAppState`は、Next.jsでもそのまま使えます。`entry`とlocalStorage、sessionStorageの状態も同じです。Cookieとメモリの状態も変わりません。',
  en: 'Definitions and `useAppState` work under Next.js as they are. So do `entry`, localStorage, sessionStorage, cookie and memory state.',
});

export const worksDiffers = message({
  ja: 'Next.jsで違うのは、サーバーでの読み取りとパスの型検査、URLを変える`update()`の3つです。',
  en: 'Three things differ under Next.js: reading on the server, typed paths, and an `update()` that changes the URL.',
});

export const serverTitle = message({
  ja: 'サーバーでの読み取り',
  en: 'Reading on the server',
});

export const serverParse = message({
  ja: 'App Routerのページは`searchParams`を受け取ります。`parseUrl`に渡すと、`url`のスキーマで読んだ値が返ります。欠けたパラメータには既定値が入り、スキーマに合わない値はそのフィールドだけが既定値に戻ります。',
  en: 'An App Router page receives `searchParams`. Hand it to `parseUrl` to get the values read with the `url` schema: a missing parameter takes its default, and a value the schema rejects sends only that field back to its default.',
});

export const serverInput = message({
  ja: '`parseUrl`が受け取る型は`UrlInput`です。`URLSearchParams`か、`Record<string, string | string[] | undefined>`の形のオブジェクトです。読むときにエラーにはなりません。',
  en: '`parseUrl` takes a `UrlInput`: a `URLSearchParams`, or an object of the shape `Record<string, string | string[] | undefined>`. Reading never throws.',
});

export const serverHref = message({
  ja: '`href`は純粋な関数なので、Server Componentの中でもそのまま使えます。',
  en: '`href` is a pure function, so it runs inside a Server Component as well.',
});

export const serverInitial = message({
  ja: '読んだ値は、`initialUrl`としてClient Componentに渡します。サーバーの描画とハイドレーションの描画が、既定値でなくURLの値で行われます。',
  en: 'Pass the values read to the Client Component as `initialUrl`. The server render and the hydration render then show the URL’s values, not the defaults.',
});

export const typedTitle = message({
  ja: 'パスの型検査',
  en: 'Typed paths',
});

export const typedRegister = message({
  ja: 'Next.jsにはルート表が無いので、`next`の`Route`を`path`に登録します。アプリの中のすべての`href`が、Next.jsの知らないパスを型エラーにします。',
  en: 'Next.js has no route table to hand over, so register `Route` from `next` under `path`. Every `href` in the application then turns a path Next.js does not know into a type error.',
});

export const typedRoute = message({
  ja: '`typedRoutes`を有効にすると、`Route`はアプリのパスのunionになります。`href`の返り値の型はパスをリテラルのまま残すので、Next.jsの`<Link>`の型検査も通ります。',
  en: 'With `typedRoutes` enabled, `Route` is the union of the application’s paths. The return type of `href` keeps the path as a literal, so it passes the typed check of Next.js’s `<Link>` too.',
});

export const typedApplication = message({
  ja: '`Register`の拡張はアプリの中でだけ行ってください。共有のライブラリで拡張すると、その制約が使う側のすべてに及びます。',
  en: 'Augment `Register` only in an application. A shared library that augments it imposes the constraint on every consumer.',
});

export const updateTitle = message({
  ja: 'URLを変える`update()`',
  en: '`update()` that changes the URL',
});

export const updateNavigate = message({
  ja: 'Next.jsのルーターは、`navigate`イベントを`intercept()`しません。そのため、URLを変える`update()`が呼ぶ`navigation.navigate()`は、ページ全体の読み込みになります。',
  en: 'The Next.js router does not call `intercept()` on the `navigate` event, so the `navigation.navigate()` an `update()` makes to change the URL is a full page load.',
});

export const updateLinksBefore = message({
  ja: 'URLの変更は、リンクとGETフォームで行ってください。リンクの作り方は',
  en: 'Change the URL with links and GET forms. How to build a link is on ',
});

export const updateLinksAfter = message({
  ja: 'を見てください。History APIで代わりに書く仕組みはありません。',
  en: '. There is no History API fallback.',
});

export const updateOthers = message({
  ja: 'URLを変えない`update()`は影響を受けません。',
  en: 'An `update()` that leaves the URL alone is unaffected.',
});
