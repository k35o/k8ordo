import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'localStorageに置いた好みはサーバーに届かないので、サーバーは既定値で描き、ハイドレーションのあとで本当の値に切り替わります。表示密度のように、その切り替わりが目に見える好みはCookieに置きます。Cookieはリクエストのたびに届くので、サーバーが最初から本当の値で描けます。',
  en: 'A preference in localStorage never reaches the server, so the server renders the default and the real value takes over after hydration. When that switch shows, as with display density, keep the preference in a cookie instead: it goes with every request, so the server renders the real value from the start.',
});

export const defineTitle = message({
  ja: 'Cookieの状態を定義する',
  en: 'Define a cookie state',
});

export const defineDescription = message({
  ja: '`defineCookieState`に、キーとスキーマを渡します。書き方は`defineLocalState`と同じで、スキーマは自分が出した値を受け付けなければなりません。',
  en: 'Hand `defineCookieState` a key and a schema. It is written like `defineLocalState`, and the schema likewise has to accept its own output.',
});

export const defineName = message({
  ja: '値は`k8ordo-state.density`という1つのCookieに、スキーマに書いたフィールドのJSONとして保存されます。この名前は、定義の`cookieName`で読めます。区切りが`:`ではなく`.`なのは、Cookieの名前に`:`を使えないからです。',
  en: 'The values are kept in one cookie named `k8ordo-state.density`, as the JSON of the declared fields. The definition exposes the name as `cookieName`. It is joined with `.` rather than `:`, because a cookie name cannot hold a `:`.',
});

export const defineToken = message({
  ja: '同じ理由で、キーに使えるのは英数字と、HTTPのtokenに入る一部の記号だけです。空白や`:`、`;`を含むキーは、モジュールの読み込みで拒まれます。',
  en: 'For the same reason, a key may hold only letters, digits and the few symbols an HTTP token allows. A key with a space, a `:` or a `;` is refused as the module loads.',
});

export const readTitle = message({
  ja: 'サーバーで読む',
  en: 'Read it on the server',
});

export const readDescription = message({
  ja: '`@k8ordo/framework`のserverモードでは、ページとレイアウトがリクエストを`request`として受け取ります。その`request.cookies`を`parseCookies`に渡すと、スキーマを通した値が返ります。',
  en: 'In `@k8ordo/framework`’s server mode, pages and layouts receive the request as `request`. Hand its `request.cookies` to `parseCookies`, and the values come back through the schema.',
});

export const readMap = message({
  ja: '`parseCookies`が受け取るのは、値をパーセントデコードした`ReadonlyMap<string, string>`です。`request.cookies`はこの形なので、そのまま渡せます。Cookieが無いときやJSONが壊れているとき、スキーマに合わないときは、フィールドごとに既定値に戻ります。',
  en: '`parseCookies` takes a `ReadonlyMap<string, string>` of percent-decoded values, which is what `request.cookies` is, so it goes in as it is. A missing cookie, broken JSON or a value the schema rejects falls back to the defaults, field by field.',
});

export const readSeed = message({
  ja: '読んだ値は、`initialCookie`として`useAppState`に渡します。サーバーの描画とハイドレーションの描画がその値で行われるので、既定値がちらつきません。',
  en: 'Pass what you read to `useAppState` as `initialCookie`. The server render and the hydration render both use it, so the default never flashes.',
});

export const seedTitle = message({
  ja: '読んだ値を渡す範囲',
  en: 'Where the values have to reach',
});

export const seedDescription = message({
  ja: '`initialCookie`が効くのは、それを渡した`useAppState`だけです。',
  en: '`initialCookie` seeds only the `useAppState` call it is passed to.',
});

export const seedHigh = message({
  ja: 'サーバーで描かれるのに`initialCookie`を受け取っていないコンポーネントは、サーバーでは既定値を描きます。そのため、レイアウトのような上の方で一度だけ読み、下へ渡してください。',
  en: 'A component rendered on the server without `initialCookie` shows the defaults there. So read the cookie once, high up in a layout, and pass the result down.',
});

export const seedStatic = message({
  ja: 'staticモードにはリクエストがありません。サーバーの描画は既定値で行われ、ハイドレーションのあとでCookieの値に切り替わります。localStorageと同じ振る舞いです。',
  en: 'Static mode has no request. The server render shows the defaults, and the cookie takes over after hydration, just as localStorage does.',
});

export const attributesTitle = message({
  ja: 'ブラウザが書くCookie',
  en: 'The cookie the browser writes',
});

export const attributesDescription = message({
  ja: '`update()`は、Cookie Store APIでCookieを書きます。付ける属性は次のとおりで、書き込むたびに付け直します。',
  en: '`update()` writes the cookie with the Cookie Store API, with these attributes, set again on every write.',
});

export const attributesPath = message({
  ja: '`Path=/`：サイトのどのパスへのリクエストにも付きます。',
  en: '`Path=/`: it goes with a request to any path on the site.',
});

export const attributesSameSite = message({
  ja: '`SameSite=Lax`：ほかのサイトのリンクから来た最初のリクエストにも付きます。APIの既定の`Strict`では、まさにそのリクエストでサーバーが既定値を描いてしまいます。',
  en: '`SameSite=Lax`: it goes with the first request arriving from a link on another site. Under the API’s default `Strict`, the server would render the defaults on exactly that request.',
});

export const attributesMaxAge = message({
  ja: '`Max-Age`：400日です。ブラウザがCookieを保つ上限で、書くたびに延びます。',
  en: '`Max-Age`: 400 days, the longest a browser keeps a cookie, renewed by every write.',
});

export const attributesSecure = message({
  ja: '`Secure`：APIが必ず付けるので、ページはHTTPSで配信します。ChromiumとFirefoxは`http://localhost`でも保ちますが、Safariはそこでも捨てます。Safariで確かめるなら、開発中もHTTPSで配信してください。',
  en: '`Secure`: the API always sets it, so serve the page over HTTPS. Chromium and Firefox keep it on `http://localhost` as well, but Safari drops it there, so develop over HTTPS to see it persist in Safari.',
});

export const attributesRead = message({
  ja: '読むときは、`document.cookie`から同期的に読みます。描画の途中ではAPIのPromiseを待てないからです。ほかのタブの書き込みや、サーバーの応答が設定したCookieは、APIの`change`イベントで届きます。',
  en: 'Reads go through `document.cookie`, synchronously, because a render cannot wait for the API’s promise. Writes from other tabs, and cookies a server response set, arrive through the API’s `change` event.',
});

export const attributesSize = message({
  ja: 'Cookieはリクエストのたびに送られるので、小さく保ってください。名前と値を合わせて4KBを超えるCookieは拒まれます。そのときは`update()`のハンドルがAPIの`TypeError`でrejectし、描画された値はそのまま残ります。',
  en: 'Every byte rides every request, so keep it small. A cookie over 4 KB, name and value together, is refused: the `update()` handle rejects with the API’s `TypeError`, while the rendered value stays.',
});

export const serverWriteTitle = message({
  ja: 'サーバーから同じCookieを書く',
  en: 'Write the same cookie from the server',
});

export const serverWriteDescription = message({
  ja: 'ページは描画するだけで、応答にCookieを書きません。Cookieを書くのは、リクエストに答える場所です。serverモードでは、`guard.ts`と`route.ts`、Server Actionがフレームワークの`cookies()`で書きます。',
  en: 'A page only renders; it never writes the response. Cookies are written where a request is answered: in server mode, that is `guard.ts`, `route.ts` and Server Actions, through the framework’s `cookies()`.',
});

export const serverWriteForm = message({
  ja: 'JavaScriptが無くても好みを変えられるフォームのように、Cookieの状態をサーバーから書きたいこともあります。そのときは、名前に`cookieName`を、値に`cookieValue()`の結果を渡します。`cookieValue()`は値をスキーマに通し、指定しなかったフィールドを既定値で埋めます。',
  en: 'Sometimes the server should write a cookie state, say for a form that changes a preference without JavaScript. Hand `cookies().set` the `cookieName`, and what `cookieValue()` returns as the value. `cookieValue()` runs the values through the schema, and fills the fields you leave out with their defaults.',
});

export const serverWriteHttpOnly = message({
  ja: '`httpOnly: false`は外さないでください。`HttpOnly`のCookieはスクリプトから見えないので、ブラウザのストアが読めなくなります。`cookies()`の既定は`Path=/`と`SameSite=Lax`なので、そのほかの属性はブラウザが書くものとそろいます。開いているほかのタブには、`change`イベントで新しい値が届きます。',
  en: 'Keep `httpOnly: false`: script cannot see an `HttpOnly` cookie, and the browser store would lose it. `cookies()` defaults to `Path=/` and `SameSite=Lax`, so the other attributes match what the browser writes. Open tabs take the new values in through the `change` event.',
});

export const serverWriteEncode = message({
  ja: '`cookieValue()`は、エンコードしていないJSONを返します。`cookies().set`が書き出すときにパーセントエンコードし、`parseCookies`はそれを戻した値を受け取るからです。`Set-Cookie`ヘッダーを自分で書くときは、`encodeURIComponent`を1回だけ通してください。',
  en: '`cookieValue()` returns the JSON unencoded: `cookies().set` percent-encodes it on the way out, and `parseCookies` receives it decoded again. Writing a `Set-Cookie` header by hand, pass the value through `encodeURIComponent` yourself, once.',
});

export const secretTitle = message({
  ja: '秘密は置かない',
  en: 'Never a secret',
});

export const secretDescription = message({
  ja: 'ブラウザが書くCookieは、`HttpOnly`にできません。',
  en: 'A cookie the browser writes can never be `HttpOnly`.',
});

export const secretPitfall = message({
  ja: 'ページ上のどのスクリプトもこのCookieを読み書きでき、訪問者もURLと同じように書き換えられます。セッションやトークンのように、漏れたり偽造されたりすると困るものは置かないでください。そうしたCookieは`cookies()`で`HttpOnly`として書き、このパッケージには触らせません。',
  en: 'Any script on the page can read and rewrite it, and a visitor can edit it as freely as a URL. Keep sessions, tokens and anything else that must not leak or be forged out of it. Write those with `cookies()` as `HttpOnly`, where this package never sees them.',
});

export const secretInput = message({
  ja: 'サーバーで読んだ値も、信頼できる状態ではなく入力として扱ってください。`parseCookies`がスキーマを通してから値を返すのは、そのためです。',
  en: 'On the server, treat what you read as input, not trusted state. That is why `parseCookies` passes it through the schema before you see it.',
});
