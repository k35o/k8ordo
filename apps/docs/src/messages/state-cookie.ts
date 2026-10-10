import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '表示密度のような好みをCookieに置く定義と、ブラウザが書くCookieの属性がわかります。Cookieはリクエストのたびにサーバーへ送られます。',
  en: 'How to define a preference such as display density as cookie state, and which attributes the browser writes. A cookie travels with every request to the server.',
});

export const defineTitle = message({
  ja: 'Cookieの状態の定義',
  en: 'Defining a cookie state',
});

export const defineSame = message({
  ja: '`defineCookieState`にキーとスキーマを渡します。書き方は`defineLocalState`と同じで、スキーマの決まりは',
  en: 'Hand `defineCookieState` a key and a schema. It is written like `defineLocalState`, and the schema follows the rules on ',
});

export const defineSameAfter = message({
  ja: 'のページにあります。',
  en: '.',
});

export const defineName = message({
  ja: '値は`k8ordo-state.density`という1つのCookieに、スキーマに書いたフィールドのJSONとして保存されます。この名前は、定義の`cookieName`で読めます。',
  en: 'The values are kept in one cookie named `k8ordo-state.density`, as the JSON of the declared fields. The definition exposes the name as `cookieName`.',
});

export const defineToken = message({
  ja: 'Cookieの名前はHTTPのtokenなので、キーに使えるのは英数字と一部の記号だけです。空白や`:`、`;`を含むキーは、モジュールの読み込み時に`cannot name a cookie`を含む`TypeError`になります。',
  en: 'A cookie name is an HTTP token, so a key may hold only letters, digits and a few symbols. A key with a space, a `:` or a `;` throws a `TypeError` saying `cannot name a cookie` as the module loads.',
});

export const attributesTitle = message({
  ja: 'ブラウザの書き込み',
  en: 'Writes from the browser',
});

export const attributesApi = message({
  ja: '`update()`は、Cookie Store APIでCookieを書きます。属性は次の4つで、書き込むたびに付け直します。',
  en: '`update()` writes the cookie with the Cookie Store API. It sets these four attributes, again on every write.',
});

export const attributesPath = message({
  ja: '`Path=/`：サイトのどのパスへのリクエストにも付きます。',
  en: '`Path=/`: it goes with a request to any path on the site.',
});

export const attributesSameSite = message({
  ja: '`SameSite=Lax`：ほかのサイトのリンクから来た最初のリクエストにも付きます。APIの既定の`Strict`では、そのリクエストでサーバーが既定値を描画します。',
  en: '`SameSite=Lax`: it goes with the first request arriving from a link on another site. Under the API’s default `Strict`, the server would render the defaults on that request.',
});

export const attributesMaxAge = message({
  ja: '`Max-Age`：400日です。ブラウザがCookieを保てる上限で、書くたびに延びます。',
  en: '`Max-Age`: 400 days, the longest a browser keeps a cookie, renewed by every write.',
});

export const attributesSecure = message({
  ja: '`Secure`：APIが必ず付けるので、ページはHTTPSで配信します。ChromiumとFirefoxは`http://localhost`でも保存しますが、Safariは保存しません。Safariで確かめるなら、開発中もHTTPSで配信してください。',
  en: '`Secure`: the API always sets it, so serve the page over HTTPS. Chromium and Firefox keep the cookie on `http://localhost`, but Safari does not store it, so develop over HTTPS to check in Safari.',
});

export const attributesRead = message({
  ja: '読み取りは、`document.cookie`から同期的に行います。描画の途中ではAPIのPromiseを待てないからです。ほかのタブの書き込みと、サーバーの応答が設定したCookieは、APIの`change`イベントで受け取ります。',
  en: 'Reads go through `document.cookie`, synchronously, because a render cannot wait for the API’s promise. Writes from other tabs, and cookies a server response set, come in through the API’s `change` event.',
});

export const attributesSize = message({
  ja: 'Cookieはリクエストのたびに送られるので、小さく保ってください。名前と値を合わせて4KBを超えると、ブラウザが書き込みを拒みます。`update()`のハンドルはAPIの`TypeError`でrejectされ、描画した値はそのまま残ります。',
  en: 'The cookie goes with every request, so keep it small. Over 4 KB, name and value together, the browser refuses the write: the `update()` handle rejects with the API’s `TypeError`, and the rendered value stays.',
});

export const secretTitle = message({
  ja: '秘密の扱い',
  en: 'Secrets',
});

export const secretScript = message({
  ja: 'ブラウザが書くCookieは、`HttpOnly`にできません。ページ上のどのスクリプトもこのCookieを読み書きでき、訪問者もURLと同じように書き換えられます。',
  en: 'A cookie the browser writes can never be `HttpOnly`. Any script on the page can read and rewrite it, and a visitor can edit it as freely as a URL.',
});

export const secretPitfall = message({
  ja: 'セッションやトークンのように、漏れたり偽造されたりすると困るものは置かないでください。そうしたCookieはサーバーが`HttpOnly`で書きます。このパッケージはそのCookieを読みません。',
  en: 'Keep out anything that must not leak or be forged, such as sessions and tokens. The server writes such cookies as `HttpOnly`, and this package never reads them.',
});
