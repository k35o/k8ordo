import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: "何も書かなければサーバー、ブラウザ側は`'use client'`で入る。境界はReact自身の語で宣言し、ビルドが検査します。このページは、このモードでServer Componentがいつ動くか、境界を越えられるもの、ブラウザにしか無いものの読み方、クライアントに届いてはいけないモジュールを説明します。",
  en: "Server by default, the browser opted into with `'use client'`: boundaries are declared in React's own words, and the build checks them. This page covers when a Server Component runs in this mode, what crosses the boundary, reading what only a browser has, and modules that must never reach the client.",
});

export const serverWhen = message({
  ja: 'このモードでは、Server Componentが動くのはビルドのときです。ページごとに`index.html`のために1回、`index.rsc`のためにもう1回描かれ、その結果がファイルに書かれます。訪問者が来るたびに動くことはありません。',
  en: 'In this mode a Server Component runs at build time: each page is rendered once for `index.html` and once more for `index.rsc`, and the results are written to files. Nothing runs again when a visitor arrives.',
});

export const propsFunction = message({
  ja: '関数を渡すと、そのページの描画がReactのエラー（`Functions cannot be passed directly to Client Components`）で失敗し、ビルドが止まります。',
  en: "Passing a function fails that page's render with React's error (`Functions cannot be passed directly to Client Components`), and the build stops.",
});

export const directiveNote = message({
  ja: "`'use server'`はこのモードにはありません。宣言したモジュールは、ビルドも`vite dev`も拒みます。",
  en: "`'use server'` does not exist in this mode: the build and `vite dev` both refuse a module that declares it.",
});

export const searchNote = message({
  ja: '`search`をexportしたページ（`@k8ordo/server`がsearchを渡すページ）は、名指しで拒みます。ファイルはsearchがどうであれ同じだからです。GETのフォームはJavaScriptが読み込まれる前から動くので、`@k8ordo/form`で作る検索や絞り込みのフォームは静的なサイトに向いています。',
  en: 'A page that exports `search` — what `@k8ordo/server` hands the search — is refused by name: a file is the same whatever the search holds. A GET form works before JavaScript loads, so a search or filter form built with `@k8ordo/form` suits a static site.',
});
