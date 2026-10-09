import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/framework`で最初のページを作り、サーバーなしで動くアプリとして`vite build`でビルドするまでを進めます。',
  en: 'Build a first page with `@k8ordo/framework` and build it with `vite build` as an app that runs with no server.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const configTitle = message({
  ja: 'Viteの設定',
  en: 'Vite config',
});

export const configModeCallout = message({
  ja: "'static'：サーバーなしで動かす",
  en: "'static': runs with no server",
});

export const configPlugins = message({
  ja: '`framework()`が返すプラグインには、ReactのプラグインとRSCのパイプラインが入っています。`@vitejs/plugin-react`を自分で足す必要はありません。',
  en: 'The plugins `framework()` returns include React’s plugin and the RSC pipeline. You don’t need to add `@vitejs/plugin-react` yourself.',
});

export const configMode = message({
  ja: "`mode`は省略できません。ここでは`'static'`モードから始めます。サーバーありで動かす`'server'`モードとの違いと選び方は",
  en: "`mode` is required. This guide starts with `'static'`. How it differs from `'server'`, which runs with a server, and how to choose is covered in ",
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const tsconfigTitle = message({
  ja: '生成される型',
  en: 'Generated types',
});

export const tsconfigTypes = message({
  ja: 'フレームワークは、`src/routes/`から作ったルート表と型を`.k8ordo/`に書き出します。`include`に足すと、`href()`に渡すパスとページの`params`に型が付きます。',
  en: 'The framework writes a route table and its types, derived from `src/routes/`, into `.k8ordo/`. Add it to `include`, and the paths `href()` takes and a page’s `params` become typed.',
});

export const layoutTitle = message({
  ja: 'ルートレイアウト',
  en: 'Root layout',
});

export const layoutDocument = message({
  ja: '`src/routes/layout.tsx`は、すべてのページを包むレイアウトです。フレームワークはHTMLのテンプレートを持たないので、`<html>`と`<body>`、`<html>`の`lang`属性もこのファイルで書きます。',
  en: '`src/routes/layout.tsx` is the layout around every page. The framework has no HTML template, so this file renders `<html>` and `<body>` too, and sets the `lang` of `<html>`.',
});

export const layoutHydration = message({
  ja: 'ルートレイアウトが描画した文書は、まるごとハイドレーションの対象です。HTMLを書き換えるCDNの機能を有効にしていると、ハイドレーションに失敗することがあります。原因と直し方は',
  en: 'The whole document the root layout renders is hydrated. A CDN feature that rewrites HTML can make hydration fail. The cause and the fix are in ',
});

export const pageTitle = message({
  ja: '最初のページ',
  en: 'First page',
});

export const pageUrl = message({
  ja: "`page.tsx`を置いたディレクトリが、ページのURLになります。`src/routes/page.tsx`は`/`のページです。ディレクティブを書いていないファイルはServer Componentです。`'static'`モードではビルドのときに描画されます。",
  en: "A directory that holds a `page.tsx` is a URL, so `src/routes/page.tsx` is the page at `/`. A file with no directive is a Server Component; under `'static'` it renders at build time.",
});

export const pageTitleTag = message({
  ja: 'タイトルは、ページの中で`<title>`を描画して付けます。',
  en: 'A page sets its title by rendering a `<title>`.',
});

export const pageMore = message({
  ja: 'ページ間のリンクには専用のコンポーネントが無く、素の`<a>`に`href()`の値を渡します。ページの足し方とファイル名の決まりは',
  en: 'There is no link component: a link between pages is a plain `<a>` whose `href` comes from `href()`. Adding pages and the file naming rules are covered in ',
});

export const runTitle = message({
  ja: '開発サーバーとビルド',
  en: 'Dev server and build',
});

export const runDev = message({
  ja: '`vite dev`は、リクエストのたびにページを描画する開発サーバーです。Fast Refreshが効き、ファイルを保存すると表示がすぐに変わります。',
  en: '`vite dev` is a development server that renders a page per request, with Fast Refresh: save a file, and the change shows right away.',
});

export const runBuild = message({
  ja: '`vite build`はすべてのページを描画して`dist/client/`に書き出し、最後に書き出したルートの数を表示します。`dist/client/`はどの静的ホスティングにも置けます。',
  en: '`vite build` renders every page into `dist/client/`, and ends by printing how many routes it wrote. `dist/client/` can go on any static host.',
});

export const runMore = message({
  ja: "ホスティングへの置き方と、`'server'`モードでの動かし方は",
  en: "Putting it on a host, and running it under `'server'`, are covered in ",
});
