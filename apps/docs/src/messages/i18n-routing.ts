import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ブラウザではURLの先頭の区間が、サーバーでは`locales.run`か`paramsSchema`が設定したロケールが、今のロケールになります。`getLocale()`でそのタグを読み、`<html lang>`に書けるようになります。',
  en: 'In the browser the first segment of the URL is the current locale; on the server it is the one `locales.run` or `paramsSchema` set. You will be able to read its tag with `getLocale()` and write it into `<html lang>`.',
});

export const browserTitle = message({
  ja: 'ブラウザのロケール',
  en: 'Locale in the browser',
});

export const browserUrl = message({
  ja: 'ブラウザでは、`location.pathname`の先頭の区間がロケールです。文言は呼ぶたびにURLを読みます。先頭の区間が集合のロケールでないときは、既定のロケールを使います。',
  en: 'In the browser, the first segment of `location.pathname` is the locale. Messages read the URL each time they are called. When the first segment is not a locale of the set, the default locale is used.',
});

export const browserRun = message({
  ja: 'ロケールを持つ状態が無いので、ブラウザでは`locales.run`を使えません。呼ぶと、`locales.run: in the browser the URL is the locale — navigate instead`というエラーになります。',
  en: 'With no state to hold a locale, `locales.run` has no use in the browser. Calling it there fails with `locales.run: in the browser the URL is the locale — navigate instead`.',
});

export const browserSwitch = message({
  ja: 'ロケールを変えるには、同じpathnameのまま別のロケールの区間へ移動します。移動すればページが再描画され、文言は新しいURLのロケールで読まれます。書き方は',
  en: 'To change the locale, navigate to the same pathname under another locale’s segment. The page renders again, and its messages read the new URL’s locale. How to write it is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const serverTitle = message({
  ja: 'サーバーのロケール',
  en: 'Locale on the server',
});

export const serverRun = message({
  ja: 'サーバーの文言は、今の非同期コンテキストに設定されたロケールを読みます。メールの件名やバッチ処理で文言を呼ぶときは、`locales.run(locale, fn)`で囲みます。`fn`とそこから始まる処理がそのロケールで動き、`fn`がasyncでも`await`をまたいでロケールが保たれます。`run`は`fn`の戻り値をそのまま返します。',
  en: 'On the server, a message reads the locale set for the current async context. To call messages for an email subject or a batch job, wrap the call in `locales.run(locale, fn)`. `fn`, and everything it starts, runs in that locale, and the locale is kept across awaits when `fn` is async. `run` returns what `fn` returns.',
});

export const serverSchema = message({
  ja: '`locales.paramsSchema`は、`{ locale }`を検証するStandard Schemaです。ロケールを受け付けると、検証を呼んだ非同期コンテキストの残りにそのロケールを設定します。`@k8ordo/framework`では、`[locale]`のレイアウトからexportすると、ページの描画とそのページから送ったServer Actionにロケールが設定されます。詳しくは`@k8ordo/framework`の',
  en: '`locales.paramsSchema` is a Standard Schema that validates `{ locale }`. When it accepts a locale, it sets that locale for the rest of the async context that called it. In `@k8ordo/framework`, exporting it from the `[locale]` layout sets the locale for the page’s render and for the Server Actions posted from that page. See `@k8ordo/framework`’s ',
});

export const serverDefault = message({
  ja: 'どちらもロケールを設定していないときは、既定のロケールを使います。文言がリクエストのURLやヘッダーを読むことはありません。ページをサーバーで描画するときは、リクエストのURLの先頭の区間と同じロケールを設定します。違うと、Client Componentがサーバーで書いた文と、ハイドレーションでブラウザが描画する文が食い違います。',
  en: 'When neither has set a locale, the default locale is used; a message never reads the request’s URL or headers. When a page renders on the server, set the locale named by the first segment of the request’s URL. Otherwise the text a Client Component writes on the server disagrees with what the browser renders when it hydrates.',
});

export const serverRuntime = message({
  ja: '`AsyncLocalStorage`の無いランタイムでは、`run`と`paramsSchema`がエラーになります。エラー文は`locales.run: this runtime has no AsyncLocalStorage to scope a locale to`のように、呼んだ関数の名前で始まります。既定のロケールで描画を続けることはありません。',
  en: 'On a runtime without `AsyncLocalStorage`, `run` and `paramsSchema` throw, with a message that starts with the caller’s name, such as `locales.run: this runtime has no AsyncLocalStorage to scope a locale to`. Neither goes on in the default locale.',
});

export const getLocaleTitle = message({
  ja: 'ロケールのタグ',
  en: 'The locale tag',
});

export const getLocaleCall = message({
  ja: 'ロケールのタグそのものが要るときは、`locales.getLocale()`を呼びます。ブラウザではURLの先頭の区間を、サーバーでは`run`か`paramsSchema`が設定したロケールを返します。フックではないので、どこからでも呼べます。',
  en: 'When you need the locale tag itself, call `locales.getLocale()`. In the browser it returns the first segment of the URL; on the server, the locale `run` or `paramsSchema` set. It is not a hook, so it can be called anywhere.',
});

export const getLocaleDestructure = message({
  ja: '`getLocale`は、`export const { getLocale } = locales`のように取り出してexportできます。',
  en: '`getLocale` can be destructured and exported: `export const { getLocale } = locales`.',
});

export const getLocaleNoSubscribe = message({
  ja: '`getLocale()`はURLの変化を購読しません。Client Componentでは、呼んだ時点のURLを読むだけです。URLの変化に合わせて再描画したいコンポーネントは、`@k8ordo/router`の`usePathname()`を使います。詳しくは`@k8ordo/router`の',
  en: '`getLocale()` does not subscribe to the URL. In a Client Component it reads the URL at the moment it is called. A component that must re-render when the URL changes uses `usePathname()` from `@k8ordo/router`. See `@k8ordo/router`’s ',
});

export const htmlTitle = message({
  ja: '`<html lang>`と`dir`',
  en: '`<html lang>` and `dir`',
});

export const htmlServer = message({
  ja: '`lang`と`dir`は、サーバーが書いたHTMLの時点で正しくなければなりません。クローラーやスクリーンリーダーは、ハイドレーションを待たずに読むからです。',
  en: '`lang` and `dir` have to be right in the HTML the server writes, because crawlers and screen readers read it without waiting for hydration.',
});

export const htmlNull = message({
  ja: 'ロケールが設定されていない描画で使うときは、`locales.delocalize(pathname).locale ?? locales.default`でpathnameから読みます。`delocalize`は先頭の区間がロケールでないときに`null`を返すので、既定のロケールは呼ぶ側で補います。',
  en: 'In a render where no locale is set, read it from the pathname instead: `locales.delocalize(pathname).locale ?? locales.default`. `delocalize` returns `null` when the first segment is not a locale, so the caller supplies the default.',
});

export const baseTitle = message({
  ja: 'Viteの`base`',
  en: 'Vite’s `base`',
});

export const baseSegment = message({
  ja: 'アプリを`/docs/`のようなサブパスに置くときも、ロケールは`base`より下の最初の区間です。`/docs/en/ui`のロケールは`en`です。',
  en: 'When the app is served under a path such as `/docs/`, the locale is still the first segment below the `base`. `/docs/en/ui` is in `en`.',
});

export const baseTerms = message({
  ja: '`localize`と`delocalize`が扱うのは、`base`を除いたpathnameです。移動する前に、`base`を付け直します。',
  en: '`localize` and `delocalize` take and return pathnames without the `base`. Put the `base` back before navigating.',
});

export const baseLinks = message({
  ja: '`@k8ordo/router`の`usePathname()`は`base`を除いたpathnameを返し、`withBase`が`base`を付け直します。詳しくは`@k8ordo/router`の',
  en: '`usePathname()` from `@k8ordo/router` returns the pathname without the `base`, and its `withBase` adds the `base` back. See `@k8ordo/router`’s ',
});
