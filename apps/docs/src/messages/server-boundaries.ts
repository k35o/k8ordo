import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: "何も書かなければサーバー、ブラウザ側は `'use client'` で入る。境界は React 自身の語で宣言し、ビルドが検査します。このページは、このモードで Server Component がいつ動くか、境界を越えられるもの、ブラウザにしか無いものの読み方、クライアントに届いてはいけないモジュールを説明します。",
  en: "Server by default, the browser opted into with `'use client'`: boundaries are declared in React's own words, and the build checks them. This page covers when a Server Component runs in this mode, what crosses the boundary, reading what only a browser has, and modules that must never reach the client.",
});

export const serverWhen = message({
  ja: 'このモードでは、Server Component はリクエストのたびに動き、その時点のデータを読みます。',
  en: 'In this mode a Server Component runs per request, reading the data as it is at that moment.',
});

export const propsFunction = message({
  ja: "関数を渡すと、そのページの描画が React のエラー（`Functions cannot be passed directly to Client Components`）で失敗します。例外は Server Action で、`'use server'` の関数は参照として境界を越えます。",
  en: "Passing a function fails that page's render with React's error (`Functions cannot be passed directly to Client Components`). The exception is a Server Action: a `'use server'` function crosses as a reference.",
});

export const directiveNote = message({
  ja: "`'use server'` はクライアントが呼べるサーバーの関数を宣言するもので、`server-only` とは別のことを言っています。",
  en: "`'use server'` declares a server function the client may call — a different thing from `server-only`.",
});

export const searchNote = message({
  ja: 'このモードでページが受け取る `request` にも、search は含まれません。',
  en: 'The `request` a page receives in this mode carries no search either.',
});
