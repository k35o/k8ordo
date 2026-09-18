import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: "何も書かなければサーバー、ブラウザ側は `'use client'` で入る。境界は React 自身の語で宣言し、ビルドが検査します。このページは、このモードで Server Component がいつ動くか、境界を越えられるもの、ブラウザにしか無いものの読み方、クライアントに届いてはいけないモジュールを説明します。",
  en: "Server by default, the browser opted into with `'use client'`: boundaries are declared in React's own words, and the build checks them. This page covers when a Server Component runs in this mode, what crosses the boundary, reading what only a browser has, and modules that must never reach the client.",
});

export const serverWhen = message({
  ja: 'このモードでは、Server Component が動くのはビルドのときです。ページごとに `index.html` のために 1 回、`index.rsc` のためにもう 1 回描かれ、その結果がファイルに書かれます。訪問者が来るたびに動くことはありません。',
  en: 'In this mode a Server Component runs at build time: each page is rendered once for `index.html` and once more for `index.rsc`, and the results are written to files. Nothing runs again when a visitor arrives.',
});

export const propsFunction = message({
  ja: '関数を渡すと、そのページの描画が React のエラー（`Functions cannot be passed directly to Client Components`）で失敗し、ビルドが止まります。',
  en: "Passing a function fails that page's render with React's error (`Functions cannot be passed directly to Client Components`), and the build stops.",
});

export const directiveNote = message({
  ja: "`'use server'` はこのモードにはありません。宣言したモジュールは、ビルドも `vite dev` も拒みます。",
  en: "`'use server'` does not exist in this mode: the build and `vite dev` both refuse a module that declares it.",
});

export const searchNote = message({
  ja: 'GET のフォームは JavaScript が読み込まれる前から動くので、`@k8ordo/form` で作る検索や絞り込みのフォームは静的なサイトに向いています。',
  en: 'A GET form works before JavaScript loads, so a search or filter form built with `@k8ordo/form` suits a static site.',
});
