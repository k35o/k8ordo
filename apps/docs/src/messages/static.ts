import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリをファイルに書き出します。すべてのルートをビルドの時点で描画するので、出力は静的ホスティングにそのまま置けるディレクトリだけです。実行時のサーバーはいりません。',
  en: 'Builds an application into files. Every route is rendered ahead of time, and what ships is a directory a static host can serve — no server at run time.',
});

export const tagline = message({
  ja: 'React Server Componentsのアプリを、ビルドの時点ですべてのページを描いてファイルにする。',
  en: 'Build a React Server Components app into files, every page rendered ahead of time.',
});

export const claimRoutesTitle = message({
  ja: 'ディレクトリの形が、そのままURLになる',
  en: 'The directory tree is the URL space',
});

export const claimRoutesBody = [
  message({
    ja: '`src/routes/`の下では、ディレクトリがURLの区間に、`[id]`がパラメータに、`page.tsx`がページになります。ルート表と`href`の型は、この構成から`.k8ordo/`に生成されます。',
    en: 'Under `src/routes/`, a directory is a URL segment, `[id]` is a parameter, and `page.tsx` is a page. The route table and the types `href` checks against are generated from it into `.k8ordo/`.',
  }),
  message({
    ja: '決まったファイル名以外のファイルは、`_`で始まるディレクトリに置きます。どこからも届かないページや、同じURLを取り合うファイルがあれば、ビルドがファイル名を挙げて止まります。',
    en: 'Anything that is not one of the route file names lives under a `_` directory. A page nothing can reach, or two files claiming one URL, stops the build with the files named.',
  }),
] as const;

export const claimPathsTitle = message({
  ja: 'パラメータのあるページは、値を並べるまでビルドが通らない',
  en: 'A page with parameters ships only once its values are listed',
});

export const claimPathsBody = [
  message({
    ja: 'ビルドはパラメータの値を自分では決められないので、`paths`オプションにURLを並べて伝えます。データから組み立てる関数を渡すこともできます。',
    en: 'A build cannot invent parameter values, so `paths` lists the URLs. It can be a function that builds them from your data.',
  }),
  message({
    ja: '値の無いページがあると、ビルドは失敗します。半分のページが抜けたサイトを黙って公開してしまうより、止まるほうが安全だからです。',
    en: 'A page left without values fails the build: stopping beats quietly shipping a site missing half its pages.',
  }),
] as const;

export const claimRefuseTitle = message({
  ja: 'サーバーが必要なものは、ビルドが名指しで断る',
  en: 'What needs a server, the build refuses by name',
});

export const claimRefuseBody = [
  message({
    ja: "ファイルはフォームの送信を受け取れません。そのため`'use server'`のモジュールや`guard.ts`があると、ビルドも`vite dev`も、そのファイルを挙げて止まります。",
    en: "A file cannot receive a form submission. A `'use server'` module or a `guard.ts` stops both the build and `vite dev`, naming the file.",
  }),
  message({
    ja: 'こうした機能が必要なら、`@k8ordo/server`に入れ替えます。ルートの書き方も実行の境界も同じなので、変わるのはimportの1行だけです。',
    en: 'If the app needs them, install `@k8ordo/server` instead. The route grammar and the boundaries are the same, so the change is one import.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'プラグインを足し、レイアウトとページを置いて、ビルドするところまで作ります。',
  en: 'Add the plugin, place a layout and a page, and build.',
});

export const nextRouting = message({
  ja: 'ファイル名とディレクトリ名の文法と、ビルドが受け付けない形です。',
  en: 'The file and directory grammar, and what the build refuses.',
});

export const nextParams = message({
  ja: '`paramsSchema`での型付けと、`paths`での値の並べ方です。',
  en: 'Typing parameters with `paramsSchema`, and listing values with `paths`.',
});

export const nextErrors = message({
  ja: '`error.tsx`と`not-found.tsx`、`redirect.ts`、ビルドを止める失敗です。',
  en: '`error.tsx`, `not-found.tsx`, `redirect.ts`, and what stops the build.',
});

export const nextBoundaries = message({
  ja: "`'use client'`と`server-only`で、コードが動く場所を分けます。",
  en: "Where code runs, with `'use client'` and `server-only`.",
});

export const nextDeploy = message({
  ja: 'ビルドが書き出すファイルと、静的ホスティングへの置き方です。',
  en: 'What the build writes, and putting it on a static host.',
});

export const navRouting = message({
  ja: 'ルートを書く',
  en: 'Write routes',
});

export const navParams = message({
  ja: 'パラメータを受け取る',
  en: 'Receive parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクトを扱う',
  en: 'Handle errors and redirects',
});

export const navBoundaries = message({
  ja: 'サーバーとブラウザの境界を書く',
  en: 'Server and browser boundaries',
});

export const navDeploy = message({
  ja: 'デプロイする',
  en: 'Deploy',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navTroubleshooting = message({
  ja: 'うまく動かないとき',
  en: 'Troubleshooting',
});

export const navReference = message({
  ja: '設定とファイル',
  en: 'Options and files',
});

export const navCsp = message({
  ja: 'CSPを設定する',
  en: 'Set a CSP',
});
