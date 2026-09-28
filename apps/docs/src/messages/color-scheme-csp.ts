import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Provider が最初の描画の前に走らせるのは、インラインスクリプトです。スクリプトを制限する Content-Security-Policy の下では、nonce かハッシュで許さなければ実行されません。@k8ordo/server では応答ごとの nonce で、@k8ordo/static ではハッシュで許します。',
  en: 'What the provider runs before the first paint is an inline script. Under a Content-Security-Policy that restricts scripts it does not run unless the policy allows it, by nonce or by hash: under @k8ordo/server with the answer’s nonce, under @k8ordo/static with its hash.',
});

export const blocked = {
  title: message({
    ja: '許さないとどうなるか',
    en: 'What happens when it is not allowed',
  }),
  description: message({
    ja: 'ブラウザはスクリプトを実行せず、ポリシー違反をコンソールに出します。ページが壊れるわけではなく、hydrate のあとで Provider の effect がクラスを書くので、最後には正しい表示になります。ただ、それまでは既定値で描かれるので、ダークを選んだ訪問者にはライトの画面が一瞬光ります。スクリプトが防ぐはずのものです。',
    en: 'The browser does not run the script and reports the violation in the console. The page does not break — after hydration the provider’s effect writes the class, so it ends up right — but until then it paints with the default, and a visitor who chose dark sees a flash of light: exactly what the script is there to prevent.',
  }),
  unsafeInline: message({
    ja: "`'unsafe-inline'` を足しても動きますが、ページに紛れ込んだほかのインラインスクリプトもすべて動くようになり、ポリシーを書いた意味がなくなります。このスクリプトだけを、nonce かハッシュで名指して許します。",
    en: "Adding `'unsafe-inline'` makes it run, and every other inline script that reaches the page with it, which is what the policy was for. Name this script alone, by nonce or by hash.",
  }),
};

export const nonce = {
  title: message({
    ja: '@k8ordo/server では nonce で許す',
    en: 'By nonce, under @k8ordo/server',
  }),
  description: message({
    ja: '@k8ordo/server は応答ごとに新しい nonce を作り、フレームワーク自身のインラインスクリプトに付けます。`@k8ordo/server/runtime` の `nonce()` がその値を返すので、ルートの `guard.ts` でそれを名指すポリシーをヘッダーに書き、ルートレイアウトで同じ値を Provider の `nonce` に渡します。',
    en: '@k8ordo/server makes a new nonce for every answer and signs its own inline scripts with it. `nonce()` from `@k8ordo/server/runtime` returns that value, so the root `guard.ts` writes a policy naming it into the header, and the root layout hands the same value to the provider’s `nonce`.',
  }),
  render: message({
    ja: "`nonce()` はレイアウトの描画の中でも読めます。スクリプトに署名することは応答を書くことではないからです。フレームワークの起動のモジュールにも同じ nonce が付くので、`'strict-dynamic'` の下でも残りのクライアントが読み込まれます。nonce は新しいうちしか意味が無いので、nonce を持つ応答は共有キャッシュに置きません。",
    en: "`nonce()` can be read in the layout’s render too: signing a script is not writing the response. The framework’s module script carries the same nonce, so under `'strict-dynamic'` it loads the rest of the client. A nonce is worth something only while it is new, so an answer that carries one does not belong in a shared cache.",
  }),
  link: message({
    ja: '@k8ordo/server: ガードで Content-Security-Policy を書く',
    en: '@k8ordo/server: writing a Content-Security-Policy from a guard',
  }),
};

export const hash = {
  title: message({
    ja: '@k8ordo/static ではハッシュで許す',
    en: 'By hash, under @k8ordo/static',
  }),
  description: message({
    ja: "ファイルは誰が読んでも同じなので、nonce を持てません。`colorSchemeScriptHash()` はスクリプトの SHA-256 を CSP のソース（`'sha256-…'`）として返す Promise です。`vite.config.ts` で待ち、`framework()` の `csp` オプションの `script-src` に入れます。フレームワークは自分のインラインスクリプトのハッシュを、ページごとにそこへ足します。",
    en: "A file is the same for everyone who reads it, so it cannot carry a nonce. `colorSchemeScriptHash()` resolves to the script’s SHA-256 as a CSP source, `'sha256-…'`. Await it in `vite.config.ts` and put it in `script-src` of `framework()`’s `csp` option; the framework adds the hashes of its own inline scripts there, page by page.",
  }),
  computed: message({
    ja: 'ハッシュは値を書き写さず、設定の中で毎回計算します。スクリプトの文字列はインストールしたバージョンのもので、更新で変わることがあり、計算していればポリシーとスクリプトがずれません。',
    en: 'Compute the hash in the config every time rather than copying its value: the script’s text is the installed version’s and may change with an update, and a computed hash cannot fall out of step with it.',
  }),
  link: message({
    ja: '@k8ordo/static: ハッシュで書く Content-Security-Policy',
    en: '@k8ordo/static: a Content-Security-Policy by hash',
  }),
};

export const defaults = {
  title: message({
    ja: '同じ `defaultPreference` を渡す',
    en: 'Pass the same `defaultPreference`',
  }),
  description: message({
    ja: 'スクリプトは Provider の既定値を文字列に埋め込むので、ハッシュは既定値ごとに違います。Provider に `defaultPreference` を渡しているなら、`colorSchemeScriptHash()` にも同じ値を渡します。nonce で許すときは、既定値に関係なく同じ書き方で済みます。',
    en: 'The script carries the provider’s default in its text, so the hash differs by default. When the provider is given a `defaultPreference`, give `colorSchemeScriptHash()` the same one. By nonce, the default makes no difference.',
  }),
};
