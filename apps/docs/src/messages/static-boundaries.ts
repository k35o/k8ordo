import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'コードがサーバー側で動くか、ブラウザで動くかは、Reactのディレクティブで書き分けます。このページでは、その境界の書き方と、境界を越えられるもの、クライアントに届いてはいけないモジュールの守り方を説明します。',
  en: 'Whether code runs on the server side or in the browser is written with React’s directives. This page covers drawing that boundary, what can cross it, and keeping modules that must never reach the client away from it.',
});

export const serverWhen = message({
  ja: 'このモードでは、Server Componentはビルドのときに動きます。ページごとに、HTMLのためと`index.rsc`のための2回描かれ、その結果がファイルになります。訪問者が来るたびに動くことはありません。',
  en: 'In this mode a Server Component runs at build time: each page is rendered twice, once for its HTML and once for `index.rsc`, and the results become files. Nothing runs when a visitor arrives.',
});

export const directiveNote = message({
  ja: "`'use server'`はこのモードにはありません。宣言したモジュールは、ビルドも`vite dev`も名指しで拒みます。",
  en: "There is no `'use server'` in this mode: the build and `vite dev` both refuse a module that declares it, by name.",
});

export const propsFunction = message({
  ja: 'このモードで関数を渡すと、そのページの描画がReactのエラー（`Functions cannot be passed directly to Client Components`）で失敗し、ビルドが止まります。',
  en: 'Passing a function in this mode fails the page’s render with React’s error, `Functions cannot be passed directly to Client Components`, and the build stops.',
});

export const searchMode = message({
  ja: '`search`をexportしたページは、ビルドが名指しで拒みます。ファイルの中身は、searchが何であっても同じだからです。検索や絞り込みには、JavaScriptが届く前から動くGETのフォームが向いています。',
  en: 'A page that exports `search` is refused by name: a file reads the same whatever the search holds. For search and filtering, a GET form, which works before JavaScript arrives, is the right fit.',
});
