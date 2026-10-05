import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'コードがサーバーで動くか、ブラウザで動くかは、Reactのディレクティブで書き分けます。このページでは、その境界の書き方と、境界を越えられるもの、クライアントに届いてはいけないモジュールの守り方を説明します。',
  en: 'Whether code runs on the server or in the browser is written with React’s directives. This page covers drawing that boundary, what can cross it, and keeping modules that must never reach the client away from it.',
});

export const serverWhen = message({
  ja: 'このモードでは、Server Componentはリクエストのたびに動き、その時点のデータを読みます。',
  en: 'In this mode a Server Component runs for every request, reading the data as it is at that moment.',
});

export const directiveNote = message({
  ja: "`'use server'`は、ブラウザから呼べるサーバーの関数を宣言するものです。ブラウザに届いてはいけないモジュールに付ける`server-only`とは、言っていることが違います。",
  en: "`'use server'` declares a server function the browser may call. That is a different statement from `server-only`, the mark of a module that must never reach the browser.",
});

export const propsFunction = message({
  ja: "関数を渡すと、そのページの描画がReactのエラー（`Functions cannot be passed directly to Client Components`）で失敗します。例外はServer Actionで、`'use server'`の関数は参照として境界を越えます。",
  en: "Passing a function fails the page’s render with React’s error, `Functions cannot be passed directly to Client Components`. A Server Action is the exception: a `'use server'` function crosses as a reference.",
});

export const searchMode = message({
  ja: 'このモードには、例外が1つあります。`export const search = listState.url`のように、読むurlスキーマを宣言したページは、そのスロットを`search`として受け取ります。searchが変わると、ルーターがそのページをその場で取り直します。',
  en: 'This mode has one exception: a page that declares the url schema it reads, as `export const search = listState.url`, receives that slot as `search`, and the router loads the page again in place when the search moves.',
});
