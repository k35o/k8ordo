import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/static`でサイトを1つ作りながら、インストールからビルドまでをたどります。ページは`src/routes/`の下にファイルとして置き、`vite build`がすべてのページをHTMLに書き出します。',
  en: 'Build a site with `@k8ordo/static`, from installing it to building it. Pages are files under `src/routes/`, and `vite build` writes every one of them out as HTML.',
});

export const installDescription = message({
  ja: 'ルーターとReactは、ページを描くのに使う実行時の依存です。`@k8ordo/static`とViteはビルドのときにしか使わないので、開発時の依存に入れます。',
  en: 'The router and React render the pages, so they are runtime dependencies. `@k8ordo/static` and Vite are only used to build, so they are development dependencies.',
});

export const runTitle = message({
  ja: '動かしてビルドする',
  en: 'Run it and build it',
});

export const runDescription = message({
  ja: '`vite dev`で開発サーバーを起動し、`vite build`でサイトをファイルに書き出します。',
  en: 'Start the dev server with `vite dev`, and write the site out as files with `vite build`.',
});

export const runDev = message({
  ja: '`vite dev`は、リクエストのたびにページを描くサーバーです。Fast Refreshも効くので、ファイルを保存すると表示がすぐに変わります。',
  en: '`vite dev` is a server that renders a page per request, with Fast Refresh: save a file, and the change shows right away.',
});

export const runBuild = message({
  ja: '`vite build`はすべてのページを描いて`dist/client/`に書き出し、最後に書いたルートの数を1行で知らせます。`dist/client/`がそのままサイトなので、どの静的ホスティングにも置けます。',
  en: '`vite build` renders every page into `dist/client/`, and ends by reporting how many routes it wrote. `dist/client/` is the site as it is, ready for any static host.',
});

export const runDiffers = message({
  ja: '`vite dev`はファイルを書かないので、本番とは動きが違うところがあります。たとえば、`paths`に並べていないパラメータの値でもページが描かれます。ビルドで初めて分かる失敗もあるので、公開する前に`vite build`を通してください。',
  en: '`vite dev` writes no files, so it differs from production in places: a parameter value `paths` does not list still renders, for one. Some failures only show in the build, so run `vite build` before you ship.',
});

export const nextRouting = message({
  ja: 'ファイルとディレクトリの名前の決まりと、ビルドが受け付けない形を知る。',
  en: 'Learn the naming rules for files and directories, and what the build refuses.',
});

export const nextParams = message({
  ja: 'パラメータに型を付けて、ビルドに値を渡す。',
  en: 'Type a route’s parameters, and hand their values to the build.',
});

export const nextDeploy = message({
  ja: '書き出したファイルを、静的ホスティングに置く。',
  en: 'Put the files the build wrote on a static host.',
});
