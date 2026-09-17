import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'パラメータは文字列で届き、スキーマを宣言すれば型の付いた値になります。このモードでは値がリクエストと一緒に届くので、一覧は要らず、知らない値は本物の 404 になります。',
  en: 'A parameter arrives as a string, and becomes a typed value once a schema says what it expects. In this mode the value arrives with the request: no list is needed, and an unknown value is a real 404.',
});

export const refusedNote = message({
  ja: 'このモードでは、拒まれた値への応答は本物の 404 ステータスで、本文は `not-found.tsx` です。文書の読み込みでも、クライアント遷移が取りに行くペイロードでも同じです。',
  en: "In this mode a refused value is answered with a genuine 404 status and `not-found.tsx` as the body — for a document load and for a client navigation's payload alike.",
});

export const noListTitle = message({
  ja: '値の一覧は要らない',
  en: 'No list of values',
});

export const noListDescription = message({
  ja: 'パラメータの値はリクエストと一緒に届くので、前もって列挙するものはありません。カタログが変わっても再ビルドは要りません。ページは Server Component なので、値を受け取ったらそのままデータを読みます。',
  en: "A parameter's value arrives with the request, so there is nothing to enumerate ahead of time, and a catalogue that changes needs no rebuild. The page is a Server Component: it takes the value and reads its data.",
});

export const existTitle = message({
  ja: 'スキーマは形を、ページは存在を確かめる',
  en: 'The schema checks the shape; the page, existence',
});

export const existDescription = message({
  ja: 'スキーマが受け付けた値が、データにあるとは限りません。`/products/999` はスキーマを通るのでページが描かれ、ステータスは 200 です。ページにはステータスを決める API が無いので、無い商品は、ページが「見つからない」ことを描いて伝えます。スキーマは同期的なので、待つ必要のある問い合わせには使えません。',
  en: 'A value the schema accepts need not exist in your data. `/products/999` passes the schema, so the page renders under a 200. A page has no API that sets the status, so a missing product is something the page renders. The schema is synchronous, so it cannot make a query that has to wait.',
});
