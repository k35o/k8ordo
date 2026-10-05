import { message } from '@k8ordo/i18n';

// 両モードに共通する症状。モードにしかない症状は static-troubleshooting.ts /
// server-troubleshooting.ts が持つ。

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。',
  en: 'Common symptoms, what causes them, and how to fix them.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});

export const hydrationTitle = message({
  ja: 'hydrationに失敗したというエラーが、本番でだけ出る',
  en: 'Hydration fails, but only in production',
});

export const hydrationCause = message({
  ja: 'ルートレイアウトが描いた文書は、まるごとhydrationの対象です。CDNの中には、HTMLを書き換える機能を持つものがあります。Webフォントの埋め込みやメールアドレスの難読化、スクリプトの遅延読み込みなどを有効にしていると、Reactが受け取る木とHTMLが食い違います。',
  en: 'The whole document the root layout renders is hydrated, and some CDNs rewrite HTML on the way. With web-font inlining, email obfuscation or script deferral turned on, the HTML no longer matches the tree React reconciles.',
});

export const hydrationFix = message({
  ja: 'CDNのその機能を切ります。フォントやスクリプトは別のoriginからリンクせず、同じoriginから配信すると、書き換えられるものが無くなります。',
  en: 'Turn that feature off. Serving fonts and scripts from your own origin, rather than linking them from another, leaves the CDN nothing to rewrite.',
});

export const typesTitle = message({
  ja: '`href()`のパスやページの`params`に型が付かない',
  en: 'The paths `href()` takes and a page’s `params` are not typed',
});

export const typesCause = message({
  ja: '`tsconfig.json`の`include`が`.k8ordo/`を読んでいません。`.k8ordo`はドットで始まるので、`".k8ordo"`のようにディレクトリ名だけを書いた`include`は、このディレクトリを読み飛ばします。',
  en: 'The `include` in `tsconfig.json` does not reach `.k8ordo/`. The name starts with a dot, so an entry naming only the directory, `".k8ordo"`, skips it.',
});

export const typesFix = message({
  ja: '`include`に`.k8ordo/**/*.ts`のようにグロブで書きます。',
  en: 'List it with a glob: `.k8ordo/**/*.ts`.',
});

export const freshTitle = message({
  ja: 'cloneした直後だけ、`params`が文字列の型になる',
  en: 'Right after a clone, `params` are typed as strings',
});

export const freshCause = message({
  ja: '`.k8ordo/`は生成物でgitに入らないので、cloneした直後にはまだありません。ルート表が無いと、`PageProps`の`params`はスキーマの出力ではなく、文字列として型が付きます。',
  en: '`.k8ordo/` is generated and not in git, so a fresh clone does not have it yet. Without the route table, `params` in `PageProps` is typed as strings rather than as the schemas’ output.',
});

export const freshFix = message({
  ja: '`tsc`の前に一度`vite dev`か`vite build`を動かして、`.k8ordo/`を書かせます。',
  en: 'Run `vite dev` or `vite build` once before `tsc`, so `.k8ordo/` gets written.',
});

export const grammarTitle = message({
  ja: '`routes/ holds only page.tsx, …`でビルドが止まる',
  en: 'The build stops with `routes/ holds only page.tsx, …`',
});

export const grammarCause = message({
  ja: '`routes/`の中に、ルートのファイル名ではないファイルがあります。拡張子だけが違う`page.ts`も同じです。',
  en: 'Something under `routes/` is not a route file name — `page.ts`, with the wrong extension, included.',
});

export const grammarFix = message({
  ja: '部品やデータは、`_parts/`のように`_`で始まるディレクトリへ移します。ページなら拡張子を`.tsx`にします。',
  en: 'Move components and data under a directory whose name starts with `_`, such as `_parts/`. For a page, use the `.tsx` extension.',
});

export const syncTitle = message({
  ja: '`a params schema must validate synchronously`というエラーが出る',
  en: 'An error says `a params schema must validate synchronously`',
});

export const syncCause = message({
  ja: '`paramsSchema`が非同期に検証しています。どのルートがURLに答えるかは描画の前に決めるので、スキーマの結果を待てません。',
  en: 'The `paramsSchema` validates asynchronously. Which route answers a URL is decided before anything renders, and that decision cannot wait.',
});

export const syncFix = message({
  ja: 'スキーマには値の形の検証だけを書きます。データがあるかどうかはページで確かめ、無ければ`notFound()`を投げます。',
  en: 'Keep the schema to the shape of the value. Check whether the data exists in the page, and throw `notFound()` when it does not.',
});

export const serverOnlyTitle = message({
  ja: "`'server-only' cannot be imported in client build`でビルドが止まる",
  en: "The build stops with `'server-only' cannot be imported in client build`",
});

export const serverOnlyCause = message({
  ja: '`server-only`をimportしたモジュールが、クライアントコンポーネントから読まれています。エラーの2行目から下が、そこに至ったimportの連鎖です。',
  en: 'A module that imports `server-only` is reached from a client component. The lines below the first are the chain of imports that got it there.',
});

export const serverOnlyFix = message({
  ja: 'クライアントコンポーネントからは直接読まず、Server Componentで読んだ値をpropsで渡します。',
  en: 'Do not import it from the client component. Read it in a Server Component and pass the values down as props.',
});

export const functionsTitle = message({
  ja: '`Functions cannot be passed directly to Client Components`というエラーが出る',
  en: 'An error says `Functions cannot be passed directly to Client Components`',
});

export const functionsCause = message({
  ja: 'Server Componentからクライアントコンポーネントへ、関数をpropsとして渡しています。propsはシリアライズして運ぶので、関数は渡せません。',
  en: 'A Server Component passes a function to a client component as a prop. Props are serialized on the way, and a function cannot be.',
});

export const functionsFix = message({
  ja: '関数を呼んだ結果の値を渡すか、関数をクライアントコンポーネントの側へ移します。',
  en: 'Pass the value the function returns, or move the function into the client component.',
});

export const routeHookTitle = message({
  ja: '`useRoute must render inside a matched <Router>`というエラーが出る',
  en: 'An error says `useRoute must render inside a matched <Router>`',
});

export const routeHookCause = message({
  ja: 'フレームワークの下では、ブラウザはルート表を持ちません。ページの木はサーバーから届くからです。そのため`useRoute()`と`useParams()`には、読むルートがありません。',
  en: 'Under the framework the browser holds no route table, since the tree comes from the server. `useRoute()` and `useParams()` have no route to read.',
});

export const routeHookFix = message({
  ja: 'ページが受け取った`params`を、propsでクライアントコンポーネントに渡します。今のURLは`usePathname()`で読みます。',
  en: 'Pass the `params` the page received down to the client component as props. Read the current URL with `usePathname()`.',
});
