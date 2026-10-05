import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`[id]`のようなディレクトリの下のページは、URLの一部をパラメータとして受け取ります。このモードでは値がリクエストと一緒に届くので、前もって並べる必要はありません。このページでは、値に型を付ける方法と、拒まれた値やデータに無い値の扱いを説明します。',
  en: 'A page under a directory like `[id]` receives part of its URL as a parameter. In this mode the value arrives with the request, so there is nothing to list ahead of time. This page covers typing the value, and what becomes of one that is refused or not in your data.',
});

export const refusedMode = message({
  ja: 'このモードでは、拒まれた値への答えは本物の404ステータスを持ち、本文は`not-found.tsx`です。文書を読み込んだときも、クライアント側の遷移でペイロードを取りに来たときも同じです。',
  en: 'In this mode the answer to a refused value carries a real 404 status, with `not-found.tsx` as its body — for a document load and for a client navigation’s payload alike.',
});

export const noListTitle = message({
  ja: '値を並べる必要はない',
  en: 'No list of values',
});

export const noListDescription = message({
  ja: 'このモードでは、パラメータの値はリクエストと一緒に届きます。前もって並べるものは無く、データが増えても再ビルドは要りません。ページはServer Componentなので、受け取った値でそのままデータを読みます。',
  en: 'In this mode a parameter’s value arrives with the request. There is nothing to list ahead of time, and growing data needs no rebuild. The page is a Server Component, so it reads its data with the value it received.',
});

export const existTitle = message({
  ja: 'データに無い値には`notFound()`を投げる',
  en: 'Throw `notFound()` for a value your data does not have',
});

export const existDescription = message({
  ja: 'スキーマが確かめるのは値の形までで、その値のデータがあるかどうかはページにしか分かりません。`/products/999`はスキーマを通るので、無い商品はページが`@k8ordo/router`の`notFound()`で伝えます。',
  en: 'A schema checks the value’s shape; whether data exists for it, only the page knows. `/products/999` passes the schema, so the page reports a missing product with `notFound()` from `@k8ordo/router`.',
});

export const existAnswer = message({
  ja: '`notFound()`を投げると、いちばん近い`not-found.tsx`が404として答えます。スキーマは同期的なので、データベースへの問い合わせのように待つ必要のある確認は、ページの中で行います。',
  en: 'Throw it, and the nearest `not-found.tsx` answers under a 404. The schema is synchronous, so a check that has to wait, such as a database query, belongs in the page.',
});

export const existMore = message({
  ja: '`not-found.tsx`の置き方と答え方は、次のページで説明しています。',
  en: 'Where `not-found.tsx` goes, and how it answers, is covered here:',
});
