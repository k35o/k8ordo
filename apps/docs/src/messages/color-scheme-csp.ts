import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'プロバイダが最初の描画の前に走らせるのは、インラインスクリプトです。スクリプトを制限するContent-Security-Policy（CSP）の下では、ポリシーでnonceかハッシュを使って許可しないと、このスクリプトは実行されません。このページでは、`@k8ordo/framework`のserverモードでnonceを使う方法と、staticモードやほかのヘッダーでハッシュを使う方法を説明します。',
  en: 'What the provider runs before the first paint is an inline script. Under a Content-Security-Policy (CSP) that restricts scripts, it does not run unless the policy allows it by nonce or by hash. This page covers a nonce in `@k8ordo/framework`’s server mode, and a hash in its static mode or under any other header.',
});

export const blockedTitle = message({
  ja: '許可しないとどうなるか',
  en: 'What happens when it is not allowed',
});

export const blockedDescription = message({
  ja: 'ブラウザはスクリプトを実行せず、ポリシーの違反をコンソールに出します。ページが壊れるわけではなく、ハイドレーションのあとでプロバイダのeffectがクラスを付けるので、最後には正しい配色になります。',
  en: 'The browser refuses to run the script and reports the violation in the console. The page does not break: after hydration the provider’s effect puts the class on, so it ends up in the right scheme.',
});

export const blockedFlash = message({
  ja: 'ただし、それまでは既定値の配色で描かれるので、ダークを選んだ訪問者にはライトの画面が一瞬見えます。インラインスクリプトは、まさにこれを防ぐためのものです。',
  en: 'Until then, though, it paints in the default scheme, and a visitor who chose dark sees a flash of light: exactly what the inline script is there to prevent.',
});

export const blockedUnsafe = message({
  ja: "`'unsafe-inline'`を足しても動きますが、ページに紛れ込んだほかのインラインスクリプトもすべて動くようになり、ポリシーを書いた意味がなくなります。このスクリプトだけを、nonceかハッシュで名指しして許可します。",
  en: "Adding `'unsafe-inline'` makes it run, along with every other inline script that reaches the page, which defeats the policy. Name this one script, by nonce or by hash.",
});

export const nonceTitle = message({
  ja: 'serverモードではnonceで許可する',
  en: 'By nonce, in server mode',
});

export const nonceDescription = message({
  ja: 'serverモードは応答ごとに新しいnonceを作り、フレームワーク自身のインラインスクリプトに付けます。その値は`@k8ordo/framework/server`の`nonce()`で読めるので、ルートの`guard.ts`でポリシーに書き、ルートレイアウトでプロバイダの`nonce`に渡します。',
  en: 'Server mode makes a new nonce for every response and puts it on the framework’s own inline scripts. `nonce()` from `@k8ordo/framework/server` reads it, so the root `guard.ts` writes it into the policy, and the root layout hands it to the provider’s `nonce`.',
});

export const nonceRender = message({
  ja: "`nonce()`は、レイアウトの描画の中でも読めます。スクリプトにnonceを付けることは、応答を書き換えることではないからです。フレームワークの起動用のモジュールにも同じnonceが付くので、`'strict-dynamic'`の下でも残りのクライアントのコードが読み込まれます。",
  en: "`nonce()` can be read during the layout’s render too, since putting a nonce on a script is not writing the response. The framework’s module script carries the same nonce, so under `'strict-dynamic'` it loads the rest of the client code.",
});

export const nonceCache = message({
  ja: 'nonceは新しいうちしか意味が無いので、nonceを含む応答は共有キャッシュに置かないでください。',
  en: 'A nonce is worth something only while it is new, so do not keep a response that carries one in a shared cache.',
});

export const nonceLink = message({
  ja: '@k8ordo/frameworkでCSPを設定する',
  en: 'Setting a CSP with @k8ordo/framework',
});

export const hashTitle = message({
  ja: 'staticモードではハッシュで許可する',
  en: 'By hash, in static mode',
});

export const hashDescription = message({
  ja: "ファイルとして配るページは誰が読んでも同じなので、応答ごとのnonceを持てません。そこでハッシュを使います。`colorSchemeScriptHash()`は、スクリプトのSHA-256をCSPのソースの形（`'sha256-…'`）で返すPromiseです。",
  en: "A page delivered as a file is the same for everyone, so it cannot carry a per-response nonce; use the hash instead. `colorSchemeScriptHash()` resolves to the script’s SHA-256 as a CSP source, `'sha256-…'`.",
});

export const hashMeta = message({
  ja: '`framework()`の`csp`に渡したポリシーは、各ページの`<head>`の先頭に`<meta http-equiv="Content-Security-Policy">`として書かれます。フレームワークは、そのページで使う自分のスクリプトのハッシュをそこへ足します。',
  en: 'The policy given to `framework()`’s `csp` is written first in each page’s `<head>`, as a `<meta http-equiv="Content-Security-Policy">`, and the framework adds the hashes of its own scripts on that page.',
});

export const hashStrictDynamic = message({
  ja: "staticモードのビルドは、`'strict-dynamic'`を含むポリシーを受け付けません。フレームワークの起動用のモジュールにはファイルの中でnonceを付けられないので、`'self'`で許可しているからです。",
  en: "A static-mode build refuses a policy with `'strict-dynamic'`: nothing in a file can sign the framework’s module script, so it is allowed by `'self'`.",
});

export const hashComputed = message({
  ja: 'ハッシュの値はポリシーに書き写さず、設定の中で毎回計算します。スクリプトの文字列はインストールした版のもので、更新で変わることがあるからです。計算していれば、ポリシーとスクリプトがずれることはありません。',
  en: 'Compute the hash in the config every time rather than copying its value. The script’s text is the installed version’s and may change with an update, and a computed hash cannot fall out of step with it.',
});

export const hashHeader = message({
  ja: 'nonceを使わずにヘッダーでポリシーを書くときも同じです。ポリシーを組み立てるコードの中で`colorSchemeScriptHash()`を呼び、返った値を`script-src`に入れます。',
  en: 'The same goes for a policy sent as a header without a nonce: call `colorSchemeScriptHash()` in the code that builds the policy, and put what it returns in `script-src`.',
});

export const hashLink = message({
  ja: '@k8ordo/frameworkでCSPを書く',
  en: 'Writing a CSP with @k8ordo/framework',
});

export const defaultTitle = message({
  ja: '既定値を変えたら同じ値を渡す',
  en: 'Pass the same default to both',
});

export const defaultDescription = message({
  ja: 'スクリプトの文字列にはプロバイダの既定値が入るので、ハッシュは既定値ごとに違います。プロバイダに`defaultPreference`を渡しているなら、`colorSchemeScriptHash()`にも同じ値を渡します。',
  en: 'The provider’s default is written into the script, so the hash differs by default. When the provider is given a `defaultPreference`, give `colorSchemeScriptHash()` the same one.',
});

export const defaultNonce = message({
  ja: 'nonceで許可しているときは、既定値を変えてもポリシーを書き換える必要はありません。',
  en: 'Allowed by nonce, the policy does not change with the default.',
});
