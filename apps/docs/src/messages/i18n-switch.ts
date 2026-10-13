import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '今のページを別の言語で開き直すリンクを作ります。選んだ言語をCookieに書いて、次に`/`を開いたときに使えるようにします。',
  en: 'Build the links that reopen the current page in another language, and write the choice to a cookie so the next visit to `/` can use it.',
});

export const urlTitle = message({
  ja: '切り替え先のURL',
  en: 'Destination URL',
});

export const urlSegments = message({
  ja: '`delocalize`は、pathnameの先頭にあるロケールの区間を外します。`localize`は、pathnameの先頭にロケールの区間を付けます。',
  en: '`delocalize` takes the locale segment off the front of a pathname. `localize` puts one on.',
});

export const urlNull = message({
  ja: '先頭の区間がロケールでないとき、`delocalize`は`locale: null`を返します。`/english`の`english`もロケールとはみなしません。既定のロケールには置き換えません。どのロケールにするかは呼ぶ側で決めます。',
  en: 'When the first segment is not a locale, `delocalize` returns `locale: null`; `english` in `/english` is not one either. It never falls back to the default locale. The caller decides which locale to use.',
});

export const urlRoot = message({
  ja: "`/en`と`/en/`から区間を外した残りは`/`です。反対に、`localize('/', 'en')`は`/en`を返します。",
  en: "What is left of `/en` and of `/en/` is `/`. The other way round, `localize('/', 'en')` returns `/en`.",
});

export const urlPitfall = message({
  ja: '`localize`は、区間がすでに付いているかを確かめません。`localize(\'/en/ui\', \'ja\')`は`/ja/en/ui`になるので、`delocalize`したpathnameを渡します。`/`で始まらない値は`TypeError`になります（`localize: "products" is not a pathname — it does not start with "/"`）。',
  en: '`localize` does not check for a segment that is already there: `localize(\'/en/ui\', \'ja\')` is `/ja/en/ui`, so pass it a pathname that went through `delocalize`. A value that does not start with `/` is a `TypeError` (`localize: "products" is not a pathname — it does not start with "/"`).',
});

export const demoTitle = message({
  ja: '切り替え先のURLのデモ',
  en: 'Destination demo',
});

export const demoDescription = message({
  ja: 'pathnameを入れると、`delocalize`の結果と、各ロケールへ`localize`した結果を表示します。',
  en: 'Type a pathname to see what `delocalize` returns and what `localize` makes of it for each locale.',
});

export const demoSteps = [
  message({
    ja: '最初に入っている`/ja/products/42`では、`locale`が`ja`、`pathname`が`/products/42`になります。`en`への切り替え先は`/en/products/42`です。',
    en: 'For the `/ja/products/42` already there, `locale` is `ja` and `pathname` is `/products/42`. The destination for `en` is `/en/products/42`.',
  }),
  message({
    ja: '`/english`に書き換えると、先頭の区間がロケールではないので、`locale`が`null`になります。',
    en: 'Change it to `/english`. The first segment is not a locale, so `locale` becomes `null`.',
  }),
  message({
    ja: '`/en/`に書き換えると、`pathname`は`/`になります。',
    en: 'Change it to `/en/`. The `pathname` becomes `/`.',
  }),
  message({
    ja: '`products`のように`/`で始まらない値に書き換えると、`localize`が出す`TypeError`のエラー文を表示します。',
    en: 'Change it to `products`, which does not start with `/`. The demo shows the `TypeError` message from `localize`.',
  }),
] as const;

export const switcherTitle = message({
  ja: '切り替えのリンク',
  en: 'Switcher links',
});

export const switcherDelocalizeCallout = message({
  ja: '今のpathnameからロケールの区間を外す',
  en: 'Takes the locale segment off the current pathname',
});

export const switcherLocalizeCallout = message({
  ja: '各ロケールの区間を付けた切り替え先',
  en: 'The destination with each locale’s segment put on',
});

export const switcherPathname = message({
  ja: '切り替え先は、今のページのpathnameから作ります。pathnameは`base`を除いた形で、アプリのルーターから受け取ります。`@k8ordo/router`の`usePathname()`が返す値は、そのまま渡せます。詳しくは`@k8ordo/router`の',
  en: 'The destinations are built from the current page’s pathname, taken from the app’s router without the `base`. What `usePathname()` from `@k8ordo/router` returns can be passed as it is. See `@k8ordo/router`’s ',
});

export const switcherAnchor = message({
  ja: '素の`<a>`で書けます。移動後の描画では、文言は新しいURLのロケールで読まれます。',
  en: 'A plain `<a>` is enough. In the render after the move, messages read the new URL’s locale.',
});

export const switcherVariants = message({
  ja: '`Variants<string>`は、`Register`に登録されたロケールごとに1つずつ値を持つ型です。ロケールを足して言語名を書き忘れると、型エラーになります。',
  en: '`Variants<string>` holds one value per locale registered in `Register`. Add a locale and forget its name here, and the type check fails.',
});

export const switcherQuery = message({
  ja: '`localize`と`delocalize`はpathnameだけを扱うので、クエリ（`?`より後ろ）は切り替え先に付きません。残したいときは自分で付け足します。',
  en: '`localize` and `delocalize` deal in pathnames only, so the query (everything after `?`) is not carried over. Append it yourself to keep it.',
});

export const switcherBase = message({
  ja: 'Viteの`base`の下に置くアプリでは、`localize`の結果に`base`を付けます。詳しくは',
  en: 'In an app served under Vite’s `base`, put the `base` on the result of `localize`. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const rememberTitle = message({
  ja: '選んだ言語のCookie',
  en: 'Locale cookie',
});

export const rememberWhy = message({
  ja: 'サーバーの`negotiateRequest`は、このCookieを`Accept-Language`より先に読みます。',
  en: 'On the server, `negotiateRequest` reads this cookie before `Accept-Language`.',
});

export const rememberCallCallout = message({
  ja: 'クリックで書くので、切り替えはClient Componentにする',
  en: 'Written on click, so the switcher becomes a Client Component',
});

export const rememberDefaults = message({
  ja: "Cookie Store APIの既定のままだと、Cookieはブラウザを閉じると消え、`SameSite=Strict`で書かれます。`Strict`のCookieは、ほかのサイトのリンクから来た最初のリクエストには付きません。そのため`sameSite: 'lax'`と、400日後の`expires`を付けます。ブラウザがCookieを保つのは、長くても400日です。",
  en: "With the Cookie Store API’s defaults, the cookie is gone when the browser closes, and it is written `SameSite=Strict`, which keeps it off the first request from a link on another site. So the call sets `sameSite: 'lax'` and an `expires` 400 days ahead, the longest a browser keeps a cookie.",
});

export const rememberName = message({
  ja: "Cookieの名前はアプリが決めます。読む側の`negotiateRequest`にも、同じ名前を`{ cookie: 'locale' }`のように渡します。読む側の書き方は",
  en: "The app chooses the cookie’s name. Pass the same name to the `negotiateRequest` that reads it, as `{ cookie: 'locale' }`. The reading side is covered in ",
});

export const rememberStatic = message({
  ja: 'サーバーの無いサイトでは、`/`のページがブラウザでCookieを読みます。その書き方も、',
  en: 'A site without a server reads the cookie in the browser, on the `/` page. That is also shown in ',
});
