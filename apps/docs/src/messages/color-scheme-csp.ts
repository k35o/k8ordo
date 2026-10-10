import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'プロバイダは最初の描画の前にインラインスクリプトを実行します。Content-Security-Policy（CSP）の下では、nonceかハッシュをポリシーに書いて許可します。',
  en: 'The provider runs an inline script before the first paint. Allow it under a Content-Security-Policy (CSP) with a nonce or a hash.',
});

export const blockedTitle = message({
  ja: '許可しないときの動作',
  en: 'Behavior when blocked',
});

export const blockedEffect = message({
  ja: 'ポリシーが許可していないスクリプトは実行されず、ブラウザは違反をコンソールに出します。ハイドレーションのあとでプロバイダのeffectがクラスを付けるので、最終的な配色は正しくなります。',
  en: 'The browser does not run a script the policy has not allowed, and reports the violation in the console. After hydration the provider’s effect puts the class on, so the page ends up in the right scheme.',
});

export const blockedFlash = message({
  ja: 'それまでは`<html>`に`dark`クラスが付かないので、ライトの配色で描かれます。ダークになる訪問者には、ライトの画面が一瞬見えます。',
  en: 'Until then `<html>` has no `dark` class, so the page is painted light. A visitor who gets dark briefly sees the light scheme.',
});

export const blockedUnsafe = message({
  ja: "`'unsafe-inline'`を足せば動きますが、ページにあるほかのインラインスクリプトもすべて動きます。このスクリプトだけを、nonceかハッシュで許可してください。",
  en: "`'unsafe-inline'` makes it run, along with every other inline script that reaches the page. Allow only this script, by nonce or hash.",
});

export const nonceTitle = message({
  ja: 'nonceでの許可',
  en: 'Allowing by nonce',
});

export const nonceCallout = message({
  ja: '応答ごとのnonce。ポリシーに書いた値と同じもの',
  en: 'The per-response nonce, the same value the policy names',
});

export const nonceProp = message({
  ja: "ポリシーに書いたnonceを、プロバイダの`nonce` propに渡します。スクリプトの`nonce`属性にその値が付き、`script-src 'nonce-…'`の下で実行されます。",
  en: "Pass the nonce the policy names to the provider’s `nonce` prop. The script gets it as its `nonce` attribute and runs under `script-src 'nonce-…'`.",
});

export const nonceServerBefore = message({
  ja: '`@k8ordo/framework`のserverモードでのポリシーの書き方は',
  en: 'For the policy in `@k8ordo/framework`’s server mode, see ',
});

export const frameworkLink = message({
  ja: '@k8ordo/frameworkのCSP',
  en: 'CSP in @k8ordo/framework',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const hashTitle = message({
  ja: 'ハッシュでの許可',
  en: 'Allowing by hash',
});

export const hashFunction = message({
  ja: "`colorSchemeScriptHash()`は、スクリプトのSHA-256をCSPのソースの形（`'sha256-…'`）で返します。戻り値はPromiseなので`await`します。静的なファイルとして配信するページのように応答ごとのnonceが無いときは、この値を`script-src`に書きます。",
  en: "`colorSchemeScriptHash()` returns the script’s SHA-256 as a CSP source, `'sha256-…'`. The return value is a Promise, so `await` it. When a page has no per-response nonce, such as a page served as a static file, put this value in `script-src`.",
});

export const hashComputed = message({
  ja: 'ハッシュの値は書き写さず、ポリシーを組み立てるコードの中で毎回計算します。スクリプトの文字列はインストールしたバージョンのもので、更新で変わることがあります。',
  en: 'Compute the hash in the code that builds the policy, every time, rather than copying its value. The script’s text is the installed version’s, and an update may change it.',
});

export const hashStaticBefore = message({
  ja: 'staticモードで`framework()`の`csp`オプションに書く方法は',
  en: 'For the `csp` option of `framework()` in static mode, see ',
});

export const defaultTitle = message({
  ja: '既定値とハッシュ',
  en: 'The default and the hash',
});

export const defaultSame = message({
  ja: 'スクリプトの文字列にはプロバイダの既定値が入るので、ハッシュは既定値ごとに違います。プロバイダに`defaultPreference`を渡しているなら、`colorSchemeScriptHash()`にも同じ値を渡します。',
  en: 'The provider’s default is written into the script, so each default gives a different hash. When the provider is given a `defaultPreference`, give `colorSchemeScriptHash()` the same value.',
});

export const defaultNonce = message({
  ja: 'nonceで許可しているときは、既定値を変えてもポリシーはそのままです。',
  en: 'A policy that allows the script by nonce does not change with the default.',
});
