import { message } from '@k8ordo/i18n';

export const description = message({
  ja: "React Server ComponentsのアプリをViteでビルドするフレームワークです。`mode: 'static'`ならすべてのページを静的なファイルに書き出し、`mode: 'server'`ならリクエストごとにサーバーで描画します。`src/routes/`のディレクトリが、そのままURLになります。",
  en: "A framework that builds a React Server Components app with Vite. With `mode: 'static'` it writes every page into static files, and with `mode: 'server'` it renders per request on a server. The directories under `src/routes/` are the URLs.",
});

export const tagline = message({
  ja: '静的サイトもサーバーも作れるReact Server Componentsのフレームワーク',
  en: 'A React Server Components framework on Vite that ships as static files or a server',
});

export const claimRoutesTitle = message({
  ja: 'ディレクトリ構成で決まるURL',
  en: 'URLs from the directory tree',
});

export const claimRoutesBody = [
  message({
    ja: '`src/routes/`の下のディレクトリがURLの階層になり、`page.tsx`がそのURLのページになります。`[id]`はパラメータです。',
    en: 'Under `src/routes/`, a directory is a URL segment and `page.tsx` is the page at that URL. `[id]` is a parameter.',
  }),
  message({
    ja: 'ほかのルートが先に一致して表示されないページや、同じURLになるファイルが2つあると、ビルドがファイル名を挙げて止まります。',
    en: 'A page another route always answers first, or two files for the same URL, stops the build with the file names.',
  }),
] as const;

export const claimModeTitle = message({
  ja: '1行で切り替えるモード',
  en: 'One line to switch modes',
});

export const claimModeBody = [
  message({
    ja: "`mode: 'static'`はビルドの時点で全ページを描画し、どの静的ホスティングにも置けるファイルにします。`mode: 'server'`はリクエストのたびに描画します。",
    en: "`mode: 'static'` renders every page at build time into files any static host can serve. `mode: 'server'` renders on every request.",
  }),
  message({
    ja: '切り替えるのは`vite.config.ts`の`mode`だけです。ルートのファイルの書き方は変わりません。',
    en: 'Switching is the `mode` in `vite.config.ts` and nothing else. Route files are written the same way in both modes.',
  }),
] as const;

export const claimRefuseTitle = message({
  ja: 'サーバー用コードを拒むstaticビルド',
  en: 'A static build that refuses server code',
});

export const claimRefuseBody = [
  message({
    ja: "静的なファイルは、リクエストごとに処理を動かせません。`mode: 'static'`では、`'use server'`のモジュールや`guard.ts`をビルドがファイル名を挙げて拒みます。",
    en: "Static files cannot run code per request. Under `mode: 'static'`, the build refuses a `'use server'` module or a `guard.ts`, naming the file.",
  }),
  message({
    ja: "`vite dev`もファイルを読み込んだ時点で同じエラーを出します。エラーはどれも`this application wants mode: 'server'`の行で終わります。",
    en: "`vite dev` reports the same error as soon as it loads the file. Every such error ends with the line `this application wants mode: 'server'`.",
  }),
] as const;

export const navModes = message({
  ja: 'モードの選び方',
  en: 'Choosing a mode',
});

export const navRouting = message({
  ja: 'ルーティング',
  en: 'Routing',
});

export const navParams = message({
  ja: 'パラメータ',
  en: 'Parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクト',
  en: 'Errors and redirects',
});

export const navBoundaries = message({
  ja: 'サーバーとブラウザの境界',
  en: 'Server and browser',
});

export const navActions = message({
  ja: 'Server Action',
  en: 'Server Actions',
});

export const navGuards = message({
  ja: 'guard.ts',
  en: 'Guards',
});

export const navRequest = message({
  ja: 'リクエストとCookie',
  en: 'Request and cookies',
});

export const navCsp = message({
  ja: 'CSP',
  en: 'CSP',
});

export const navDeploy = message({
  ja: 'デプロイ',
  en: 'Deployment',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navReference = message({
  ja: '設定とファイル',
  en: 'Options and files',
});

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});
