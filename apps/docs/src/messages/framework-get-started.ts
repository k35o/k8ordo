import { message } from '@k8ordo/i18n';

// 両モードの「はじめる」に共通する文言。モードごとに違う部分は
// static-get-started.ts / server-get-started.ts が持つ。

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const serverOnly = message({
  ja: '`server-only`は、サーバー専用のモジュールに付ける印です。指定子はビルドが自分で解決するので、インストールしておくのはTypeScriptに解決させるためです。',
  en: '`server-only` is the mark a server-only module carries. The build resolves the specifier itself; installing it is what lets TypeScript resolve it too.',
});

export const configTitle = message({
  ja: 'プラグインを足す',
  en: 'Add the plugin',
});

export const configDescription = message({
  ja: '`vite.config.ts`の`plugins`に、`framework()`を足します。',
  en: 'Add `framework()` to the `plugins` of `vite.config.ts`.',
});

export const configReact = message({
  ja: '`framework()`はViteのプラグインを配列で返し、ReactのプラグインとRSCのパイプラインもその中に入っています。そのため、`@vitejs/plugin-react`を自分で足す必要はありません。',
  en: '`framework()` returns an array of Vite plugins that already holds React’s plugin and the RSC pipeline, so there is no `@vitejs/plugin-react` to add yourself.',
});

export const configMode = message({
  ja: '`@k8ordo/static`も`@k8ordo/server`も、プラグインの名前は同じ`framework()`です。どちらのモードになるかはimport元で決まり、`vite.config.ts`はどちらでも同じ形になります。',
  en: '`@k8ordo/static` and `@k8ordo/server` both name their plugin `framework()`. Where it is imported from decides the mode, and `vite.config.ts` looks the same under either.',
});

export const tsconfigTitle = message({
  ja: '生成される型を読み込む',
  en: 'Include the generated types',
});

export const tsconfigDescription = message({
  ja: 'フレームワークは、`src/routes/`から作ったルート表と型を`.k8ordo/`に書き出します。`tsconfig.json`の`include`にこのディレクトリを足すと、`href()`に渡すパスやページの`params`に型が付きます。',
  en: 'The framework writes a route table and its types, derived from `src/routes/`, into `.k8ordo/`. Add that directory to `include` in `tsconfig.json`, and the paths `href()` takes and the `params` a page receives become typed.',
});

export const tsconfigPitfall = message({
  ja: '`.k8ordo`はドットで始まるので、`".k8ordo"`のようにディレクトリ名だけを書くと読み飛ばされます。それでもビルドは通るので、型の検査だけが黙って効かなくなります。`.k8ordo/**/*.ts`のように、グロブで書いてください。',
  en: '`.k8ordo` starts with a dot, so an entry naming only the directory, `".k8ordo"`, skips it. The build still passes, and the type checks quietly stop applying. Write it as a glob: `.k8ordo/**/*.ts`.',
});

export const tsconfigGit = message({
  ja: '`.k8ordo/`は自分で`.gitignore`を持っているので、gitには入りません。アプリの`.gitignore`に足すものはありません。',
  en: '`.k8ordo/` carries its own `.gitignore`, so it stays out of git with nothing added to the application’s.',
});

export const layoutTitle = message({
  ja: 'ルートレイアウトを書く',
  en: 'Write the root layout',
});

export const layoutDescription = message({
  ja: '`src/routes/layout.tsx`は、すべてのページを包むレイアウトです。フレームワークはHTMLのテンプレートを持たないので、`<html>`と`<body>`もこのファイルで描きます。',
  en: '`src/routes/layout.tsx` is the layout around every page. The framework has no HTML template of its own, so this file renders `<html>` and `<body>` too.',
});

export const layoutWhy = message({
  ja: 'テンプレートを持たないのは、見えないテンプレートは書き換えられないからです。`<html>`の`lang`属性も、アプリのコードとして目の前にあります。',
  en: 'There is no template because a template you cannot see is one you cannot change. Even the `lang` of `<html>` is application code, in front of you.',
});

export const layoutHydration = message({
  ja: 'ルートレイアウトが描いた文書は、まるごとhydrationの対象になります。HTMLを書き換えるCDNの機能を有効にしていると、hydrationに失敗することがあります。原因と直し方は、次のページで説明しています。',
  en: 'The whole document the root layout renders is hydrated, and a CDN feature that rewrites HTML on the way can make hydration fail. The cause and the fix are covered here:',
});

export const pageTitle = message({
  ja: '最初のページを書く',
  en: 'Write the first page',
});

export const pageDescription = message({
  ja: '`page.tsx`を置いたディレクトリが、そのままURLになります。`src/routes/page.tsx`は`/`のページです。',
  en: 'A directory that holds a `page.tsx` is a URL. `src/routes/page.tsx` is the page at `/`.',
});

export const pageServer = message({
  ja: 'ディレクティブを書いていないファイルは、Server Componentです。このページもレイアウトも、ブラウザではなくサーバー側で描かれます。',
  en: 'A file with no directive is a Server Component, so this page and the layout render on the server side, not in the browser.',
});

export const pageTitleTag = message({
  ja: 'タイトルは、ページの中で`<title>`を描いて付けます。React 19は木のどこで描かれた`<title>`も`<head>`へ移すので、メタデータのためのAPIはありません。',
  en: 'A page sets its title by rendering a `<title>`. React 19 moves a `<title>` rendered anywhere in the tree into `<head>`, so there is no metadata API.',
});

export const linkTitle = message({
  ja: 'ページを足してリンクする',
  en: 'Add a page and link to it',
});

export const linkDescription = message({
  ja: '`vite dev`を動かしたまま`src/routes/about/page.tsx`を足すと、`/about`のページができます。`.k8ordo/`も、その場で書き直されます。',
  en: 'With `vite dev` running, add `src/routes/about/page.tsx`, and `/about` exists. `.k8ordo/` is rewritten on the spot.',
});

export const linkHref = message({
  ja: "リンクの`href`は、`@k8ordo/router`の`href()`で作ります。渡したパスは生成されたルート表に対して検査されるので、`href('/abuot')`のように書き間違えると、`tsc`が型エラーにします。",
  en: "Build a link’s `href` with `href()` from `@k8ordo/router`. The path is checked against the generated route table, so a typo such as `href('/abuot')` is a type error under `tsc`.",
});

export const linkPlain = message({
  ja: '描くのは素の`<a>`です。クリックすると、ルーターが文書を読み込み直さずにページを切り替えます。そのため、専用のリンクのコンポーネントはありません。',
  en: 'What you render is a plain `<a>`. Click it, and the router swaps the page without reloading the document, which is why there is no link component.',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});
