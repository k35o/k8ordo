import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Content-Security-Policyで、ページが実行するスクリプトを制限できるようになります。',
  en: 'Restrict the scripts a page runs with a Content-Security-Policy.',
});

export const signedTitle = message({
  ja: 'フレームワークのスクリプト',
  en: 'The framework’s scripts',
});

export const signedScripts = message({
  ja: 'フレームワークはポリシーを決めません。フレームワークがHTMLに書くインラインスクリプトを、ハッシュかnonceで許可できるようにするだけです。対象は、ハイドレーションのためにHTMLへ埋め込むペイロードと、Reactのスクリプトです。',
  en: 'The framework sets no policy; the application writes it. The framework only makes the inline scripts it writes into the HTML allowable by hash or nonce: the payload embedded for hydration, and React’s own script.',
});

export const staticTitle = message({
  ja: 'staticモード',
  en: 'Static mode',
});

export const staticLead = message({
  ja: 'staticモードでは、ポリシーを`framework()`の`csp`オプションに渡し、各ページの`<meta>`に書きます。静的なファイルはリクエストごとに変わらないので、nonceは使えません。`nonce()`はserverモードでだけ使えます。',
  en: 'In static mode, the policy goes to the `csp` option of `framework()` and into each page’s `<meta>`. A static file is the same for every request, so a nonce cannot be used. `nonce()` exists in server mode only.',
});

export const optionTitle = message({
  ja: '`csp`オプション',
  en: 'The `csp` option',
});

export const optionShape = message({
  ja: '`csp`には、ディレクティブごとにソースの配列を渡します。各ページの`<head>`の先頭に`<meta http-equiv="Content-Security-Policy">`が書かれます。`csp`を渡さなければ`<meta>`は書かれません。',
  en: 'Give `csp` an array of sources per directive. Each page gets a `<meta http-equiv="Content-Security-Policy">` first in its `<head>`. Without `csp`, no `<meta>` is written.',
});

export const optionHash = message({
  ja: 'ビルドは、フレームワークのインラインスクリプトのハッシュをページごとに`script-src`へ足します。',
  en: 'The build adds the hashes of the framework’s inline scripts to `script-src`, page by page.',
});

export const optionNone = message({
  ja: '`default-src`だけを書いたときは、そこから`script-src`を作って足します。`script-src-elem`を書いたときは、そちらにも足します。どれも書いていなければスクリプトは制限されないので、ハッシュは足しません。',
  en: 'When only `default-src` is given, `script-src` is made from it first. When `script-src-elem` is given, the hashes go there too. With none of them, scripts are not restricted, and no hash is added.',
});

export const ownTitle = message({
  ja: 'アプリのスクリプト',
  en: 'Your own scripts',
});

export const ownHash = message({
  ja: 'アプリ自身のインラインスクリプトは、ハッシュをポリシーに書いて許可します。10行目の`colorSchemeScriptHash()`が、`@k8ordo/color-scheme`のスクリプトのハッシュを返します。',
  en: 'The application’s own inline scripts are allowed by writing their hashes into the policy. On line 10, `colorSchemeScriptHash()` returns the hash of the `@k8ordo/color-scheme` script.',
});

export const ownPreference = message({
  ja: '`ColorSchemeProvider`に`defaultPreference`を渡しているときは、`colorSchemeScriptHash()`にも同じ値を渡します。`defaultPreference`の値でスクリプトの中身とハッシュが変わります。',
  en: 'If `ColorSchemeProvider` is given a `defaultPreference`, pass the same value to `colorSchemeScriptHash()`. The value changes the script and its hash.',
});

export const ownRefused = message({
  ja: 'ハッシュを書いていないインラインスクリプトは、すべてブロックされます。コンテンツに注入されたスクリプトも実行されません。',
  en: 'Every inline script whose hash is not in the policy is blocked. A script injected through the content does not run either.',
});

export const refusedTitle = message({
  ja: 'エラーになるポリシー',
  en: 'Policy errors',
});

export const refusedDynamic = message({
  ja: "フレームワークのモジュールのスクリプトは`'self'`で許可します。`'strict-dynamic'`があるとブラウザは`'self'`を無視します。そのため`script-src`（無ければ`default-src`）か`script-src-elem`に`'strict-dynamic'`があるとエラーになります。",
  en: "The framework’s module script is allowed by `'self'`. `'strict-dynamic'` makes browsers ignore `'self'`, so `'strict-dynamic'` in `script-src` (`default-src` without it) or `script-src-elem` is an error.",
});

export const refusedMeta = message({
  ja: '`frame-ancestors`と`report-uri`、`sandbox`もエラーになります。`<meta>`に書いても効かないディレクティブなので、ホスティングのヘッダーで設定してください。',
  en: '`frame-ancestors`, `report-uri` and `sandbox` are errors too. A `<meta>` ignores them, so set them as headers at the host.',
});

export const refusedWhen = message({
  ja: 'エラーになるのは`framework()`を呼んだ時点です。エラー文は`the "csp" option cannot go into a page\'s <meta> as it is:`で始まり、問題を1行ずつ挙げます。',
  en: '`framework()` throws as soon as it is called, with an error that starts `the "csp" option cannot go into a page\'s <meta> as it is:` and lists one problem per line.',
});

export const serverTitle = message({
  ja: 'serverモード',
  en: 'Server mode',
});

export const serverLead = message({
  ja: 'serverモードでは、応答ごとに新しいnonceを作り、ルートの`guard.ts`でポリシーをヘッダーに書きます。',
  en: 'In server mode, every response gets a new nonce, and the root `guard.ts` writes the policy as a header.',
});

export const guardTitle = message({
  ja: '`guard.ts`のポリシー',
  en: 'The policy in `guard.ts`',
});

export const guardNonce = message({
  ja: '`@k8ordo/framework/server`の`nonce()`が、その応答のnonceを返します。4行目でポリシーに書き、11行目でヘッダーに設定します。',
  en: '`nonce()` from `@k8ordo/framework/server` returns the nonce of the response. Line 4 writes it into the policy, and line 11 sets the header.',
});

export const guardDev = message({
  ja: "5行目は、`vite dev`のときだけ`'unsafe-eval'`を足します。Reactの開発ビルドは`eval()`を使います。無いと、ページを開くたびにコンソールにエラーが出ます。本番のビルドは`eval()`を使わず、この行もビルドで消えます。",
  en: "Line 5 adds `'unsafe-eval'` under `vite dev` only. React’s development build calls `eval()`, and without it every page load logs an error to the console. A production build never calls it, and the line is dropped from it.",
});

export const guardRoot = message({
  ja: 'ルートの`guard.ts`は、ページとペイロード、Server Actionと`route.ts`の応答の前に実行されます。どのルートにも一致しないURLの404にも、同じポリシーが付きます。',
  en: 'The root `guard.ts` runs before the response of a page, its payload, a Server Action and a `route.ts`. The 404 for a URL no route matched carries the same policy.',
});

export const guardDynamic = message({
  ja: "nonceはモジュールのスクリプトにも付きます。`'strict-dynamic'`を書くと、そのスクリプトが残りのクライアントのコードを読み込めます。",
  en: "The nonce is on the module script too. With `'strict-dynamic'`, that script can load the rest of the client code.",
});

export const signTitle = message({
  ja: 'nonceを付けるスクリプト',
  en: 'Scripts that carry the nonce',
});

export const signProvider = message({
  ja: 'アプリ自身のインラインスクリプトには、同じnonceを付けます。`@k8ordo/color-scheme`なら、ルートレイアウトで`ColorSchemeProvider`に`nonce={nonce()}`を渡します。',
  en: 'The application’s own inline scripts carry the same nonce. For `@k8ordo/color-scheme`, pass `nonce={nonce()}` to `ColorSchemeProvider` in the root layout.',
});

export const signRender = message({
  ja: '`nonce()`は、リクエストに応答している間ならどこで呼んでも同じ値を返します。描画の中でも呼べます。',
  en: '`nonce()` returns the same value anywhere while the request is being answered. It can be called during the render too.',
});

export const signOutside = message({
  ja: 'リクエストの外、たとえばモジュールのトップレベルで呼ぶと、`nonce() needs a request`で始まるエラーになります。',
  en: 'Called outside a request, at a module’s top level for example, it errors with a message that starts with `nonce() needs a request`.',
});

export const cacheTitle = message({
  ja: 'nonceとキャッシュ',
  en: 'Nonces and caches',
});

export const cacheShared = message({
  ja: 'nonceを含む応答は、CDNなどの共有キャッシュに置かないでください。同じnonceを何度も配信すると、それを知った攻撃者がnonce付きのスクリプトを差し込めます。',
  en: 'Keep a response that carries a nonce out of shared caches such as a CDN. If the same nonce is served again and again, an attacker who learned it can inject a script that carries it.',
});
