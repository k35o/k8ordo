import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ロケールは、URLの先頭の区間に置きます。サーバーもブラウザもURLからロケールを読むので、ロケールを状態として持ち、同期させる必要がありません。このページでは、両側がどこからロケールを読むかと、`<html lang>`の書き方、Viteの`base`の下に置くときの扱いを説明します。',
  en: 'The locale lives in the first segment of the URL. The server and the browser both read it from there, so no state holds the locale and nothing has to keep it in sync. This page covers where each side reads it, writing `<html lang>`, and serving the app under Vite’s `base`.',
});

export const serverTitle = message({
  ja: 'サーバーでは受け付けたロケールを読む',
  en: 'The server reads the accepted locale',
});

export const serverDescription = message({
  ja: '`[locale]`のレイアウトがexportした`paramsSchema`がロケールを受け付けると、それがそのページの描画のロケールになります。Server Componentも、HTMLを作るためにサーバーで動くClient Componentも、このロケールで文言を読みます。',
  en: 'When the `paramsSchema` the `[locale]` layout exports accepts a locale, it becomes the locale of that page’s render. Server Components, and the Client Components that run on the server to make the HTML, read their messages in it.',
});

export const serverScope = message({
  ja: '受け付けたロケールは、そのページの描画にだけ届きます。同時に描いているほかのリクエストにも、そのあとに描く404にも届きません。',
  en: 'The accepted locale reaches that page’s render and nothing else: not other requests rendering at the same time, and not a 404 rendered after it.',
});

export const serverRefused = message({
  ja: '`/en/blog/nope`のように、`[locale]`より後ろのスキーマが拒んだときは、ロケールの受け付けもそのパターンと一緒に捨てられます。代わりに答える404は、自分の上にあるスキーマを走らせ直すので、URLが名指す`en`で描かれます。一覧に無い`/fr/nothing`の404は、既定のロケールです。',
  en: 'When a schema after `[locale]` refuses, as on `/en/blog/nope`, the acceptance is dropped along with that pattern. The 404 that answers instead runs the schemas above it again, so it renders in the `en` its URL names. A 404 on `/fr/nothing`, outside the list, is in the default locale.',
});

export const serverParams = message({
  ja: 'レイアウトが受け取る`params.locale`は、スキーマをexportしていても`string`型のままです。`not-found.tsx`はスキーマが拒んだURLでもレイアウトの下に描かれるので、届く値が検証済みとは限らないからです。',
  en: 'The layout still receives `params.locale` as a `string`, schema or not: `not-found.tsx` renders under the layout even where the schema refused, so the value is not always a checked one.',
});

export const serverRuntime = message({
  ja: '`AsyncLocalStorage`を取り出せないランタイムでは、`paramsSchema`がロケールを受け付けた時点でエラーを投げます。受け付けたのに既定のロケールで描いてしまうことを、黙って見過ごさないためです。',
  en: 'On a runtime with no `AsyncLocalStorage` to offer, `paramsSchema` throws as it accepts a locale, rather than silently accept one and render the page in the default.',
});

export const runTitle = message({
  ja: '描画の外でロケールを決める',
  en: 'Set the locale outside a render',
});

export const runDescription = message({
  ja: 'バッチ処理やメールの本文のように、`[locale]`の描画の外で文言を呼ぶときは、`locales.run(locale, fn)`で囲みます。`fn`と、そこから始まる処理がそのロケールで動きます。',
  en: 'To call messages outside a `[locale]` render, such as in a batch job or an email body, wrap the call in `locales.run(locale, fn)`. `fn`, and everything it starts, runs in that locale.',
});

export const runReturns = message({
  ja: '`run`は、`fn`の戻り値をそのまま返します。`fn`がasyncでも、`await`をまたいでロケールが保たれます。',
  en: '`run` returns what `fn` returns, and when `fn` is async the locale holds across its awaits.',
});

export const runAction = message({
  ja: '`[locale]`のページから送ったServer Actionは、`@k8ordo/server`の下ではそのページのロケールで動きます。そのため、`run`で囲む必要はありません。',
  en: 'A Server Action posted from a `[locale]` page already runs in that page’s locale under `@k8ordo/server`, so it needs no `run`.',
});

export const runBrowser = message({
  ja: '`run`はブラウザで呼ぶとエラーを投げます。ブラウザではURLがロケールなので、変えたいときは、そのロケールのURLへ移動します。',
  en: '`run` throws in the browser. There the URL is the locale, so changing it means navigating to that locale’s URL.',
});

export const browserTitle = message({
  ja: 'ブラウザではURLを読む',
  en: 'The browser reads the URL',
});

export const browserDescription = message({
  ja: 'ブラウザでは、`location.pathname`の先頭の区間がロケールです。文言を呼ぶたびにURLを読むので、ロケールを持つ状態はどこにもありません。',
  en: 'In the browser, the first segment of `location.pathname` is the locale. Messages read the URL each time they are called, so no state anywhere holds the locale.',
});

export const browserDefault = message({
  ja: '先頭の区間が集合のロケールでないときは、既定のロケールを使います。',
  en: 'When the first segment is not a locale of the set, the default locale is used.',
});

export const browserSwitch = message({
  ja: 'ロケールを変えるには、同じpathnameのまま、別のロケールの区間の下へ移動します。移動すればページが描き直され、文言は新しいURLのロケールで読まれます。書き方は「言語を切り替える」で説明します。',
  en: 'Changing the locale is navigating to the same pathname under another locale’s segment. The page renders again, and its messages read the new URL’s locale. “Switch languages” shows how.',
});

export const getLocaleTitle = message({
  ja: '今のロケールのタグを読む',
  en: 'Read the current locale’s tag',
});

export const getLocaleDescription = message({
  ja: '文言ではなくタグそのものが要るときは、`locales.getLocale()`を呼びます。文言と同じところからロケールを読み、フックではないのでどこからでも呼べます。',
  en: 'When you need the tag itself rather than a message, call `locales.getLocale()`. It reads the locale from the same place messages do, and it is not a hook, so call it anywhere.',
});

export const getLocaleDestructure = message({
  ja: '`getLocale`は`this`を使わないので、`export const { getLocale } = locales`のように集合から取り出してexportできます。',
  en: '`getLocale` does not use `this`, so it can be taken out of the set and exported: `export const { getLocale } = locales`.',
});

export const getLocaleNoSubscribe = message({
  ja: '`getLocale()`は、URLの変化を購読しません。Client Componentで呼ぶと、その瞬間のURLを読むだけです。ロケールはページの移動で変わり、移動すればページが描き直されるので、ふつうはこれで足ります。URLの変化に合わせて自分から描き直したいコンポーネントは、`@k8ordo/router`の`usePathname()`を読みます。',
  en: '`getLocale()` does not subscribe to the URL; in a Client Component it reads the URL at that moment. The locale changes by navigating, which renders the page again, so that is usually enough. A component that has to render again on its own when the URL changes reads `usePathname()` from `@k8ordo/router`.',
});

export const htmlTitle = message({
  ja: '`<html lang>`と`dir`を書く',
  en: 'Write `<html lang>` and `dir`',
});

export const htmlDescription = message({
  ja: '`lang`と`dir`は、サーバーが書いたHTMLの時点で正しくなければなりません。クローラーやスクリーンリーダーは、ハイドレーションを待たずに読むからです。ルートレイアウトは`[locale]`より上にありますが、`pathname`を受け取れます。',
  en: '`lang` and `dir` have to be right in the HTML the server writes, because crawlers and screen readers read it without waiting for hydration. The root layout sits above `[locale]`, but it receives `pathname`.',
});

export const htmlNull = message({
  ja: '`delocalize`は、先頭の区間がロケールでないときに`null`を返します。既定のロケールを推測しないので、何に落とすかは呼ぶ側が書きます。',
  en: '`delocalize` returns `null` when the first segment is no locale. It does not guess the default, so the caller writes the fallback.',
});

export const htmlSame = message({
  ja: 'ページではスキーマが先に走っているので、`locales.getLocale()`も同じ値を返します。404でも、URLがロケールを名指せばそのロケール、そうでなければ既定のロケールになり、どちらの書き方でも一致します。',
  en: 'On a page the schema has already run, so `locales.getLocale()` returns the same value. On a 404 the two agree as well: the URL’s locale where it names one, the default where it does not.',
});

export const baseTitle = message({
  ja: 'Viteの`base`の下に置く',
  en: 'Serve under Vite’s `base`',
});

export const baseDescription = message({
  ja: 'アプリをオリジンの根ではなく`/docs/`のようなサブパスに置くときも、ロケールは`base`より下の最初の区間です。`/docs/en/ui`のロケールは`en`です。',
  en: 'When the app is served below the origin’s root, under a path such as `/docs/`, the locale is the first segment below the `base`: `/docs/en/ui` is in `en`.',
});

export const baseTerms = message({
  ja: '`localize`と`delocalize`が扱うのは、`base`を除いたpathnameです。`usePathname()`が返すのもこの形なので、そのまま渡せます。',
  en: '`localize` and `delocalize` deal in pathnames without the `base`, which is what `usePathname()` returns, so it goes in as it is.',
});

export const baseLinks = message({
  ja: '移動先のURLにするときは、`@k8ordo/router`の`withBase`で`base`を付け直します。`bindParams`で作った`href`には、最初から`base`が付いています。',
  en: 'To turn one into a URL to navigate to, put the `base` back with `withBase` from `@k8ordo/router`. An `href` made with `bindParams` already carries it.',
});
