import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリをファイルに焼きます。すべてのルートを事前に描画し、出力は静的ホスティングに置けるディレクトリだけ。実行時にサーバーはいりません。',
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
    ja: '`src/routes/`の下のディレクトリがURLの区間、`[id]`がパラメータ、`page.tsx`がページです。ルート表と`href`の型は、そこから`.k8ordo/`に生成されます。',
    en: 'Under `src/routes/`, a directory is a URL segment, `[id]` is a parameter, and `page.tsx` is a page. The route table and the types `href` checks against are generated from it into `.k8ordo/`.',
  }),
  message({
    ja: '決まったファイル名のほかは`_`で始まるディレクトリに置きます。届かないページや取り合いになるURLは、ビルドがファイル名を挙げて止めます。',
    en: 'Anything that is not one of the route file names lives under a `_` directory. A page nothing can reach, or two files claiming one URL, stops the build with the files named.',
  }),
] as const;

export const claimPathsTitle = message({
  ja: 'パラメータのあるページは、値を並べるまで出さない',
  en: 'A page with parameters ships only once its values are listed',
});

export const claimPathsBody = [
  message({
    ja: 'ビルドはパラメータの値を思いつけないので、`paths`にURLを並べます。データから組み立てる関数も渡せます。',
    en: 'A build cannot invent parameter values, so `paths` lists the URLs. It can be a function that builds them from your data.',
  }),
  message({
    ja: '値の無いページがあれば、ビルドは失敗します。半分のページが抜けたサイトを黙って出すより、止まるほうがましだからです。',
    en: 'A page left without values fails the build: stopping beats quietly shipping a site missing half its pages.',
  }),
] as const;

export const claimRefuseTitle = message({
  ja: 'サーバーが要るものは、ビルドが名指しで断る',
  en: 'What needs a server, the build refuses by name',
});

export const claimRefuseBody = [
  message({
    ja: "ファイルはフォームの送信を受け取れません。`'use server'`のモジュールや`guard.ts`があれば、ビルドも`vite dev`もそのファイルを挙げて止まります。",
    en: "A file cannot receive a form submission. A `'use server'` module or a `guard.ts` stops both the build and `vite dev`, naming the file.",
  }),
  message({
    ja: 'それが要るなら`@k8ordo/server`に入れ替えます。ルートの書き方も境界も同じなので、変わるのはimport 1行です。',
    en: 'If the app needs them, install `@k8ordo/server` instead. The route grammar and the boundaries are the same, so the change is one import.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'プラグインを足し、レイアウトとページを置いて、ビルドするまでです。',
  en: 'Add the plugin, place a layout and a page, and build.',
});

export const nextRouting = message({
  ja: 'ファイル名とディレクトリ名の文法と、ビルドが拒む形です。',
  en: 'The file and directory grammar, and what the build refuses.',
});

export const nextParams = message({
  ja: '`paramsSchema`での型付けと、`paths`での値の並べ方です。',
  en: 'Typing parameters with `paramsSchema`, and listing values with `paths`.',
});

export const nextErrors = message({
  ja: '`error.tsx`、`not-found.tsx`、`redirect.ts`と、ビルドを止める失敗です。',
  en: '`error.tsx`, `not-found.tsx`, `redirect.ts`, and what stops the build.',
});

export const nextBoundaries = message({
  ja: "`'use client'`と`server-only`で、実行する場所を分けます。",
  en: "Where code runs, with `'use client'` and `server-only`.",
});

export const nextDeploy = message({
  ja: '出力されるファイルと、静的ホスティングへの置き方です。',
  en: 'What the build writes, and putting it on a static host.',
});

export const navRouting = message({
  ja: 'routes/',
  en: 'routes/',
});

export const navParams = message({
  ja: 'パラメータ',
  en: 'Parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクト',
  en: 'Errors & redirects',
});

export const navBoundaries = message({
  ja: '実行境界',
  en: 'Boundaries',
});

export const navDeploy = message({
  ja: 'ビルドと配信',
  en: 'Build & deploy',
});
