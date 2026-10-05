import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Content-Security-Policyを設定すると、コンテンツに紛れ込んだスクリプトを動かさずに済みます。このモードでは、`framework()`の`csp`にポリシーを渡すと、ビルドが各ページの`<meta>`に書き込みます。',
  en: 'A Content-Security-Policy keeps a script that slipped into the content from running. In this mode you give the policy to the `csp` option of `framework()`, and the build writes it into each page’s `<meta>`.',
});

export const optionTitle = message({
  ja: '`csp`オプションにポリシーを渡す',
  en: 'Give the policy to the `csp` option',
});

export const optionDescription = message({
  ja: '静的なファイルは誰が読んでも同じ中身なので、リクエストごとに変えるnonceは使えません。そこでビルドは、フレームワークのインラインスクリプトをハッシュで名指しします。',
  en: 'A static file reads the same to everyone, so it cannot carry a nonce that changes per request. The build names the framework’s inline scripts by hash instead.',
});

export const optionShape = message({
  ja: '`csp`には、ディレクティブごとにソースの配列を渡します。各ページの`<head>`の先頭に`<meta http-equiv="Content-Security-Policy">`が書かれ、そのページのスクリプトのハッシュが足されます。',
  en: 'Give `csp` an array of sources per directive. Each page gets a `<meta http-equiv="Content-Security-Policy">` first in its `<head>`, with the hashes of that page’s scripts added.',
});

export const optionWhere = message({
  ja: 'ハッシュを足す先は`script-src`です。`default-src`だけを書いたときは、そこから`script-src`を作って足します。`script-src-elem`を書いたときは、そちらにも足します。どれも書いていなければスクリプトは制限されないので、ハッシュも足しません。',
  en: 'The hashes go into `script-src`. When only `default-src` was given, `script-src` is made from it first. When `script-src-elem` was given, they go there too. With none of them, scripts are not restricted, and nothing is added.',
});

export const optionNone = message({
  ja: '`csp`を渡さなければ、ポリシーは書かれません。',
  en: 'Without `csp`, no policy is written.',
});

export const ownTitle = message({
  ja: 'アプリのインラインスクリプトを許す',
  en: 'Allow the application’s own inline scripts',
});

export const ownDescription = message({
  ja: 'アプリ自身のインラインスクリプトは、そのハッシュをポリシーに書いて許します。`@k8ordo/color-scheme`なら、`colorSchemeScriptHash()`がハッシュを返します。',
  en: 'An inline script of the application’s own is allowed by writing its hash into the policy. For `@k8ordo/color-scheme`, `colorSchemeScriptHash()` returns it.',
});

export const ownPreference = message({
  ja: '`ColorSchemeProvider`に`defaultPreference`を渡しているときは、`colorSchemeScriptHash()`にも同じ値を渡します。スクリプトの中身が変わり、ハッシュも変わるからです。',
  en: 'If `ColorSchemeProvider` is given a `defaultPreference`, pass the same value to `colorSchemeScriptHash()`: the script changes with it, and so does the hash.',
});

export const ownRefused = message({
  ja: 'ハッシュを書いていないインラインスクリプトは、すべて拒まれます。コンテンツから紛れ込んだスクリプトが動かないのは、このためです。',
  en: 'Every inline script whose hash is not in the policy is refused, which is what keeps one that slipped in from the content from running.',
});

export const refusedTitle = message({
  ja: '`csp`に書けないもの',
  en: 'What `csp` cannot hold',
});

export const refusedDescription = message({
  ja: "フレームワークのモジュールのスクリプトは、ファイルでは署名できないので、出どころの`'self'`で許されます。`'strict-dynamic'`があると`'self'`が無視されるので、それを含むポリシーは拒みます。",
  en: "The framework’s module script cannot be signed in a file, so it is allowed by where it comes from, `'self'`. `'strict-dynamic'` makes `'self'` ignored, so a policy that holds it is refused.",
});

export const refusedMeta = message({
  ja: '`frame-ancestors`と`report-uri`、`sandbox`も拒みます。`<meta>`に書いても効かないディレクティブなので、ホスティングのヘッダーで設定してください。',
  en: '`frame-ancestors`, `report-uri` and `sandbox` are refused too: a `<meta>` ignores them, so set them as headers at the host.',
});

export const refusedWhen = message({
  ja: '拒むのは`framework()`を呼んだ時点です。`the "csp" option cannot go into a page\'s <meta> as it is:`に続けて、問題を1行ずつ挙げた例外を投げます。',
  en: 'The refusal comes as `framework()` is called: it throws `the "csp" option cannot go into a page\'s <meta> as it is:`, followed by one line per problem.',
});
