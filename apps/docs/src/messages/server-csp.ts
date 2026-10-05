import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Content-Security-Policyを設定すると、コンテンツに紛れ込んだスクリプトを動かさずに済みます。このモードでは、フレームワークが応答ごとに新しいnonceを作るので、それを名指すポリシーを`guard.ts`でヘッダーに書きます。',
  en: 'A Content-Security-Policy keeps a script that slipped into the content from running. In this mode the framework makes a new nonce for every answer, and a `guard.ts` writes the policy that names it as a header.',
});

export const guardTitle = message({
  ja: '`guard.ts`でポリシーを書く',
  en: 'Write the policy in `guard.ts`',
});

export const guardDescription = message({
  ja: 'フレームワークは応答ごとにnonceを作り、自分のインラインスクリプトとモジュールのスクリプトに付けます。`@k8ordo/server/runtime`の`nonce()`がその値を返すので、ルートの`guard.ts`でポリシーに書き込みます。',
  en: 'The framework makes a nonce for every answer and puts it on its inline scripts and its module script. `nonce()` from `@k8ordo/server/runtime` returns it, so the root `guard.ts` writes it into the policy.',
});

export const guardRoot = message({
  ja: 'ルートの`guard.ts`は、`redirect.ts`を除くすべての答えの前に走ります。そのため、ページにもペイロードにも、どこにも当たらなかったURLへの404にも、同じポリシーが付きます。',
  en: 'The root `guard.ts` runs before every answer but a `redirect.ts`, so the page, its payload and the 404 for a URL nothing matched all carry the same policy.',
});

export const guardDynamic = message({
  ja: "モジュールのスクリプトにもnonceが付くので、`'strict-dynamic'`の下では、そこから残りのクライアントのコードが読み込まれます。",
  en: "The module script carries the nonce too, so under `'strict-dynamic'` it loads the rest of the client.",
});

export const signTitle = message({
  ja: 'アプリのインラインスクリプトに署名する',
  en: 'Sign the application’s own inline scripts',
});

export const signDescription = message({
  ja: 'アプリ自身のインラインスクリプトには、同じnonceを付けます。`@k8ordo/color-scheme`なら、ルートレイアウトで`ColorSchemeProvider`に`nonce={nonce()}`を渡します。',
  en: 'An inline script of the application’s own carries the same nonce. For `@k8ordo/color-scheme`, pass `nonce={nonce()}` to `ColorSchemeProvider` in the root layout.',
});

export const signRender = message({
  ja: '`nonce()`は、リクエストに答えている間ならどこで呼んでも同じ値を返します。描画の中も同じです。スクリプトに署名することは、応答を書くことではないからです。',
  en: '`nonce()` returns the same value anywhere the request is being answered, the render included: signing a script is not writing the response.',
});

export const signOutside = message({
  ja: 'リクエストの外、たとえばモジュールのトップレベルで呼ぶと、例外を投げます。',
  en: 'Called outside a request — at a module’s top level, say — it throws.',
});

export const cacheTitle = message({
  ja: 'nonceの付いた答えをキャッシュしない',
  en: 'Do not cache an answer that carries a nonce',
});

export const cacheDescription = message({
  ja: 'nonceは、答えのたびに新しいことで意味を持ちます。CDNなどの共有キャッシュに置くと同じnonceが何度も配られ、攻撃者が前もって知ったnonceを付けて、スクリプトを差し込めてしまいます。nonceを含む答えは、共有キャッシュに置かないでください。',
  en: 'A nonce is worth something only while it is new to each answer. Kept in a shared cache such as a CDN, the same nonce goes out again and again, and an attacker who learned it can inject a script that carries it. Keep answers that carry one out of shared caches.',
});
