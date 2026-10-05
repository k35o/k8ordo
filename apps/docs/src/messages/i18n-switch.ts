import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '言語を切り替えるのは、今のページと同じpathnameを、別のロケールの区間の下で開き直すことです。このページでは、`localize`と`delocalize`で切り替え先のURLを作り、言語の切り替えを組み立てて、選んだ言語をCookieに覚えておくまでを説明します。',
  en: 'Switching language means opening the same pathname again under another locale’s segment. This page builds the destination with `localize` and `delocalize`, puts a language switcher together, and remembers the choice in a cookie.',
});

export const urlTitle = message({
  ja: '切り替え先のURLを作る',
  en: 'Build the destination',
});

export const urlDescription = message({
  ja: '今のpathnameから`delocalize`でロケールの区間を外し、`localize`で別のロケールの区間を付けます。',
  en: 'Take the locale segment off the current pathname with `delocalize`, and put another locale’s on with `localize`.',
});

export const urlBySegment = message({
  ja: '`delocalize`は、区間を単位に見ます。`/english`の先頭の区間は`english`なので、ロケールとはみなさずに`locale: null`を返します。',
  en: '`delocalize` works by segment. The first segment of `/english` is `english`, which is no locale, so it returns `locale: null`.',
});

export const urlNull = message({
  ja: '先頭の区間がロケールでないとき、`delocalize`は既定のロケールを推測しません。`null`を返すので、何に落とすかは呼ぶ側が決めます。',
  en: 'When the first segment is not a locale, `delocalize` does not guess the default. It returns `null`, and the caller decides what to fall back to.',
});

export const urlRoot = message({
  ja: "`/en`と`/en/`から区間を外した残りは`/`です。反対に、`localize('/', 'en')`は`/en`を返します。",
  en: "What is left of `/en` and of `/en/` is `/`. The other way round, `localize('/', 'en')` returns `/en`.",
});

export const urlPitfall = message({
  ja: "`localize`は、区間がすでに付いているかを確かめません。`localize('/en/ui', 'ja')`は`/ja/en/ui`になるので、必ず`delocalize`したpathnameを渡します。また、`/`で始まらない値には`TypeError`を投げます。",
  en: "`localize` does not check for a segment that is already there: `localize('/en/ui', 'ja')` is `/ja/en/ui`. Always hand it a pathname that went through `delocalize`. A value that does not start with `/` throws a `TypeError`.",
});

export const demoTitle = message({
  ja: '切り替え先のURLを試す',
  en: 'Try building destinations',
});

export const demoDescription = message({
  ja: 'pathnameを入れると、`delocalize`の結果と、そこから各ロケールへ`localize`した結果を表示します。集合はこのサイトの`locales`（`ja`と`en`）です。',
  en: 'Type a pathname to see what `delocalize` returns, and what `localize` makes of it for each locale. The set is this site’s own `locales` (`ja` and `en`).',
});

export const demoSteps = [
  message({
    ja: '最初に入っている`/ja/products/42`では、`locale`が`ja`、`pathname`が`/products/42`になり、`en`への切り替え先は`/en/products/42`です。',
    en: 'For the `/ja/products/42` already there, `locale` is `ja`, `pathname` is `/products/42`, and the destination for `en` is `/en/products/42`.',
  }),
  message({
    ja: '`/english`に書き換えると、先頭の区間はロケールではないので、`locale`が`null`になります。',
    en: 'Change it to `/english`. The first segment is no locale, so `locale` becomes `null`.',
  }),
  message({
    ja: '`/en/`に書き換えると、区間を外した残りの`pathname`は`/`になります。',
    en: 'Change it to `/en/`. The `pathname` left once the segment is off is `/`.',
  }),
  message({
    ja: '`products`のように`/`で始まらない値に書き換えると、`localize`が投げた`TypeError`の文面を表示します。',
    en: 'Change it to `products`, which does not start with `/`. The rows show the `TypeError` that `localize` throws.',
  }),
] as const;

export const switcherTitle = message({
  ja: '言語の切り替えを作る',
  en: 'Build a language switcher',
});

export const switcherDescription = message({
  ja: '切り替えのリンクは、今いるページのpathnameから作ります。pathnameは`@k8ordo/router`の`usePathname()`で読むので、切り替えはClient Componentにします。',
  en: 'The switcher’s links are built from the pathname of the page it is on. That pathname comes from `@k8ordo/router`’s `usePathname()`, so the switcher is a Client Component.',
});

export const switcherPathname = message({
  ja: '`location`を読まずに`usePathname()`を使うのは、サーバーでの描画には`location`が無いからです。`usePathname()`はサーバーでもそのページのpathnameを返し、ページを移動するたびに新しいpathnameで描き直します。',
  en: '`usePathname()` rather than `location`, because the server render has no `location`. `usePathname()` returns the page’s pathname on the server too, and renders again with the new one after every navigation.',
});

export const switcherAnchor = message({
  ja: '素の`<a>`で書いても、`@k8ordo/router`がNavigation APIで移動を受け止めるので、ページ全体を読み込み直すことはありません。移動すればページが描き直され、文言は新しいURLのロケールで読まれます。',
  en: 'A plain `<a>` is enough: `@k8ordo/router` takes the navigation over through the Navigation API, so the whole page is not reloaded. The page renders again, and its messages read the new URL’s locale.',
});

export const switcherHref = message({
  ja: '型の付いた`href`（`bindParams`）を使わないのは、手元にあるのがパターンではなく、今いるページの具体的なpathnameだからです。',
  en: 'The typed `href` from `bindParams` is not used here, because what the switcher holds is the concrete pathname of the page it is on, not a pattern.',
});

export const switcherVariants = message({
  ja: '`Variants<string>`は、`Register`に登録したロケールごとに1つずつ値を持つ型です。ロケールを足したのに言語名を書き忘れると、型エラーになります。',
  en: '`Variants<string>` holds one value for each locale in `Register`. Add a locale and forget its name here, and it fails to compile.',
});

export const switcherQuery = message({
  ja: '`localize`と`delocalize`はpathnameだけを扱うので、クエリ（`?`より後ろ）は切り替え先に付きません。切り替えたあとも残したいときは、自分で付け足します。',
  en: '`localize` and `delocalize` deal in pathnames only, so the query (everything after `?`) is not carried over. Append it yourself if it should survive the switch.',
});

export const switcherBase = message({
  ja: 'Viteの`base`の下に置くアプリでは、`withBase(locales.localize(pathname, locale))`のように`base`を付けます。`usePathname()`が返すpathnameにも、`localize`が返す値にも、`base`は付いていないためです。',
  en: 'In an app served under Vite’s `base`, add it with `withBase(locales.localize(pathname, locale))`: neither the pathname `usePathname()` returns nor what `localize` returns carries the base.',
});

export const rememberTitle = message({
  ja: '選んだ言語を覚える',
  en: 'Remember the choice',
});

export const rememberDescription = message({
  ja: '選んだ言語をCookieに書いておくと、次に`/`を開いたときに使えます。`@k8ordo/server`で`/`に答えるguardが呼ぶ`negotiateRequest`は、このCookieを`Accept-Language`より先に読むからです。',
  en: 'Write the chosen language to a cookie, and the next visit to `/` can use it: under `@k8ordo/server`, the `negotiateRequest` that the guard answering `/` calls reads that cookie before `Accept-Language`.',
});

export const rememberCall = message({
  ja: '切り替えのリンクを押したときに、このCookieを書きます。',
  en: 'Write it when a switcher link is pressed.',
});

export const rememberDefaults = message({
  ja: "Cookie Store APIの既定のままだと、Cookieはブラウザを閉じると消え、`SameSite=Strict`で書かれます。`Strict`のCookieは、ほかのサイトのリンクから来た最初のリクエストには付きません。そのため`sameSite: 'lax'`と遠い`expires`を付けて書きます。ブラウザがCookieを保つのは、長くても400日です。",
  en: "Left to the Cookie Store API’s defaults, the cookie is gone once the browser closes, and it is written `SameSite=Strict`, which keeps it off the first request arriving from a link on another site. Write it with `sameSite: 'lax'` and a far `expires` instead; 400 days is the longest a browser keeps a cookie.",
});

export const rememberName = message({
  ja: "Cookieの名前はアプリが決めます。読む側の`negotiateRequest`にも、同じ名前を`{ cookie: 'locale' }`のように渡します。読む側の書き方は「最初の言語を選ぶ」で説明します。",
  en: "The cookie’s name is the app’s to choose. Hand the same name to the `negotiateRequest` that reads it, as `{ cookie: 'locale' }`. “Choose the first language” covers that side.",
});

export const rememberStatic = message({
  ja: '`@k8ordo/static`のサイトには、`/`を開いたときにCookieを読むサーバーがありません。`/`のページがブラウザでCookieを読む書き方も、「最初の言語を選ぶ」で説明します。',
  en: 'An `@k8ordo/static` site has no server to read the cookie when `/` is opened. “Choose the first language” also shows the `/` page reading it in the browser.',
});
