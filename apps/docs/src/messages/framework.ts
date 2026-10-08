import { message } from '@k8ordo/i18n';

export const description = message({
  ja: "React Server ComponentsのアプリをViteでビルドするフレームワークです。同じ書き方のまま、`mode: 'static'`でサーバーなしのアプリに、`mode: 'server'`でサーバーありのアプリにできます。`src/routes/`のディレクトリが、そのままURLになります。",
  en: "A framework that builds a React Server Components app with Vite. The same code becomes an app with no server under `mode: 'static'`, or one with a server under `mode: 'server'`. The directories under `src/routes/` are the URLs.",
});

export const tagline = message({
  ja: '同じ書き方のまま、サーバーなしかサーバーありかを選べるReact Server Componentsのフレームワーク',
  en: 'A React Server Components framework that lets the same code run with or without a server',
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
    ja: 'ほかのルートが先に一致して表示されないページや、同じURLになるファイルが2つあると、ビルドできません。エラーにはファイル名が出ます。',
    en: 'A page another route always answers first, or two files for the same URL, fail the build, and the error names the files.',
  }),
] as const;

export const claimModeTitle = message({
  ja: 'アプリごとに選ぶ2つのモード',
  en: 'Two modes, chosen per app',
});

export const claimModeBody = [
  message({
    ja: "`mode: 'static'`はページをビルド時に描画し、サーバーなしで静的ホスティングに置けるアプリにします。`mode: 'server'`はリクエストごとにサーバーで描画し、Server ActionやCookieも使えるアプリにします。",
    en: "`mode: 'static'` renders the pages at build time, into an app that goes on a static host with no server. `mode: 'server'` renders on a server per request, into an app that can also use Server Actions and cookies.",
  }),
  message({
    ja: 'ページやレイアウトの書き方は、どちらのモードでも同じです。',
    en: 'Pages and layouts are written the same way in both modes.',
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
