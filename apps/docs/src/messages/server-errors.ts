import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '何かが throw したときの `error.tsx`、何も一致しなかったときの `not-found.tsx`、移転した URL の `redirect.ts`。このモードでは、知らない URL は本物の 404 になり、リダイレクトは `307` か `308` で答え、サーバーで throw したページも枠を持ったまま届いて、`error.tsx` をブラウザに任せます。',
  en: '`error.tsx` for when something throws, `not-found.tsx` for when nothing matched, and `redirect.ts` for a URL that moved. In this mode an unknown URL is a real 404, a redirect is answered with a `307` or `308`, and a page that throws on the server still arrives with its frame, leaving `error.tsx` to the browser.',
});

export const serverRenderTitle = message({
  ja: 'サーバーでの描画中に throw したとき',
  en: 'When it throws during the server render',
});

export const serverRenderDescription = message({
  ja: 'サーバーでの描画にはエラー境界がありません。あるのは「Suspense の境界の中で throw した部分木はブラウザに描かせる」という規則で、`error.tsx` の境界はその Suspense の境界を兼ねています。そのため HTML は枠を持ち、ページのあった位置を空けたまま届きます。ブラウザが同じ位置で throw し、hydration の後に `error.tsx` が出ます。応答のステータスは 200 のままです。',
  en: 'A server render has no error boundaries. What it has is the rule that a subtree which throws inside a Suspense boundary is left for the browser to render, and the boundary of an `error.tsx` is one. So the HTML arrives with the frame in place and a hole where the page was; the browser throws at the same spot, and `error.tsx` shows after hydration. The response status stays 200.',
});

export const serverRenderClient = message({
  ja: '本番では、ブラウザが受け取るエラーのメッセージは React の汎用の文言に置き換わり、throw されたメッセージはサーバーのログ（`k8ordo: rendering /broken failed`）にだけ出ます。フレームワークは digest を設定しないので、`error.digest` は空文字列です。訪問者が読む文言は `error.tsx` 自身が持ちます。',
  en: "In production the error the browser receives carries React's generic message instead of the thrown one, which appears only in the server's log, as `k8ordo: rendering /broken failed`. The framework sets no digest, so `error.digest` is an empty string. What the visitor reads is whatever `error.tsx` says.",
});

export const serverRenderBrowser = message({
  ja: '上に Suspense の境界（`error.tsx` もその 1 つ）が無い場所で throw すると、その部分を空けておく場所が無いので HTML を作れず、`serve()` はそのリクエストに `500` で答えます。',
  en: 'A throw with no Suspense boundary above it — an `error.tsx` is one — has nowhere to leave a hole, so the HTML cannot be produced, and `serve()` answers that request with a `500`.',
});

export const withoutNote = message({
  ja: 'このモードでは、読み込み直した文書は `serve()` 自身の答えで、描けないページなら `500` です。アプリが持たない URL は文書の読み込みになりません。ハンドラが not-found のペイロードを 404 で返し、その場で描かれます。',
  en: "In this mode the document load is `serve()`'s own answer — a `500` when the page cannot be rendered. A URL the application does not have is not a document load: the handler answers it with the not-found payload under a 404, and it renders in place.",
});

export const notFoundNote = message({
  ja: 'このモードでは、`not-found.tsx` の答えは本物の 404 ステータスを持ちます。ディレクトリごとに置けるので、`docs/not-found.tsx` は `/docs` の下の知らない URL を `docs/layout.tsx` の内側で描けます。1 つも宣言しなければ、表にない pathname には `404` という見出しと 1 行だけの最小のページが 404 で返ります。',
  en: 'In this mode `not-found.tsx` is answered under a genuine 404 status. Each directory may declare its own, so `docs/not-found.tsx` can render an unknown URL under `/docs` inside `docs/layout.tsx`. With none declared, an unknown pathname gets a minimal page — a `404` heading and one line — under a 404.',
});

export const redirectNote = message({
  ja: 'このモードでは、答えは `307`、`permanent` なら `308` で、`location` ヘッダーが行き先です。クライアント遷移がリダイレクトに当たると、ペイロードではなく HTML の答えが返るので URL をブラウザに渡し、ブラウザが文書の読み込みとしてリダイレクトに従います。アドレスバーは正しい URL になります。default export の形は `RedirectTarget` として export されています。',
  en: 'In this mode the answer is a `307`, or a `308` when `permanent`, with the target in `location`. A client navigation that meets a redirect gets HTML back instead of a payload, hands the URL to the browser, and the browser follows the redirect as a document load, so the address bar ends up right. The shape of the default export is exported as `RedirectTarget`.',
});

export const redirectAction = message({
  ja: 'Server Action から訪問者を送るのは `redirect()` で、リンク先で説明します。',
  en: 'A Server Action sends the visitor elsewhere with `redirect()`, covered here.',
});

export const statusesTitle = message({
  ja: 'アプリが答えるステータス',
  en: 'The statuses the application answers with',
});

export const statusesDescription = message({
  ja: 'ページはステータスを決めません。ステータスは、どのルートがどう答えたかで決まります。',
  en: 'A page never decides its status; which route answered, and how, does.',
});

export const statusesTable = {
  when: message({ ja: 'いつ', en: 'When' }),
  status: message({ ja: 'ステータス', en: 'Status' }),
  page: message({ ja: 'ページが描かれた', en: 'A page rendered' }),
  thrown: message({
    ja: 'Server Component が `error.tsx` の下で throw した（その部分はブラウザに任される）',
    en: 'A Server Component threw under an `error.tsx` (that part is left to the browser)',
  }),
  missing: message({
    ja: '表にない pathname、またはスキーマが拒んだ値',
    en: 'A pathname the table does not have, or a value a schema refused',
  }),
  redirect: message({
    ja: '`redirect.ts`（`permanent` なら `308`）',
    en: '`redirect.ts` (`308` when `permanent`)',
  }),
  action: message({
    ja: 'JavaScript なしで送られたフォームのアクションが `redirect()` した',
    en: 'An action posted by a form without JavaScript called `redirect()`',
  }),
  crossOrigin: message({
    ja: '`Origin` ヘッダーが無いか、そのホストが一致しない POST',
    en: 'A POST with no `Origin` header, or one whose host does not match',
  }),
  failed: message({
    ja: 'ハンドラが答えを作れなかった（`serve()` の場合）',
    en: 'The handler could not produce an answer (under `serve()`)',
  }),
};
