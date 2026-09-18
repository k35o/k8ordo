import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-errors.ts / server-errors.ts が持つ。

export const errorTitle = message({
  ja: '`error.tsx`',
  en: '`error.tsx`',
});

export const errorDescription = message({
  ja: 'レイアウト（またはページ）の横に置いた `error.tsx` は、その下が throw したときに代わりに表示されます。描かれるのはレイアウトの内側なので、失敗しても枠はそのまま残ります。描画中のエラーを捕まえられるのはブラウザだけなので、`error.tsx` はクライアントコンポーネントです。',
  en: 'An `error.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows in place of what is below it when that throws — inside the layout, so the frame survives the failure. Catching a render error is something only the browser can do, so `error.tsx` is a client component.',
});

export const errorProps = message({
  ja: '受け取るのは `error`（throw されたもの）と `reset`（その部分木をその場で描き直す関数）だけで、`params` は受け取りません。型は `@k8ordo/router` の `ErrorProps` で、生成された表は各 `error.tsx` を `satisfies ErrorComponent` で検査します。文言が URL に依存するなら、コンポーネント自身が URL から読みます。',
  en: 'It receives `error`, whatever was thrown, and `reset`, which renders the subtree again in place — and no `params`. The type is `ErrorProps` from `@k8ordo/router`, and the generated table checks each `error.tsx` with `satisfies ErrorComponent`. Wording that depends on the URL reads the URL itself.',
});

export const scopeTitle = message({
  ja: 'どこまでを受け持つか',
  en: 'What it covers',
});

export const scopeDescription = message({
  ja: '`error.tsx` の境界は、同じディレクトリのレイアウトの内側に置かれます。受け持つのは横の `page.tsx` と、下のディレクトリにあるものすべて（そのレイアウトを含む）です。横のレイアウト自身が throw したときは、1 つ上の `error.tsx` が受けます。throw した場所の上でいちばん近い `error.tsx` が答えます。',
  en: 'The boundary of an `error.tsx` sits inside the layout of its own directory. It covers the `page.tsx` beside it and everything in the directories below, their layouts included; when the layout beside it throws, the `error.tsx` one level up answers. The nearest one above the throw is the one that shows.',
});

export const scopeExample = message({
  ja: 'この木では、`shop/error.tsx` が `shop/page.tsx` と `shop/[id]/page.tsx` の失敗を `shop/layout.tsx` の内側で受け、`shop/layout.tsx` 自身の失敗はルートの `error.tsx` がルートレイアウトの内側で受けます。ルートの `page.tsx` の失敗も、ルートの `error.tsx` が受けます。',
  en: 'In this tree `shop/error.tsx` catches a failure in `shop/page.tsx` or `shop/[id]/page.tsx` inside `shop/layout.tsx`, while a failure in `shop/layout.tsx` itself is caught by the root `error.tsx`, inside the root layout — as is a failure in the root `page.tsx`.',
});

export const scopeSite = message({
  ja: 'このサイトには 2 つあります。`src/routes/[locale]/error.tsx` はページが throw したとき、ヘッダーとフッターを残したまま中身の位置に描かれます。`src/routes/error.tsx` は、`[locale]` のレイアウト自身が throw したときの、枠の無い全画面の受け皿です。',
  en: 'This site has two. `src/routes/[locale]/error.tsx` renders where the page was when a page throws, with the header and footer still around it; `src/routes/error.tsx` is the frameless full-screen last resort for when the `[locale]` layout itself throws.',
});

export const scopeReset = message({
  ja: '`reset` はその部分木をその場で描き直します。別のページへ移動すれば、失敗は何もしなくても消えます。境界は、ページを画面に出したナビゲーションごとに作り直されるからです。',
  en: '`reset` renders the subtree again where it is. Navigating to another page clears the failure on its own, because the boundary is recreated for each navigation that puts a page on screen.',
});

export const demoTitle = message({
  ja: '触って確かめる',
  en: 'Try it',
});

export const demoDescription = message<[retry: string]>({
  ja: (retry) =>
    `下のボタンは、描画中に throw するクライアントコンポーネントを出します。このページの中身は \`src/routes/[locale]/error.tsx\` に置き換わり、ヘッダーとフッターはそのまま残ります。「${retry}」を押すと \`reset\` が呼ばれ、このページがその場で描き直されます。`,
  en: (retry) =>
    `The button below mounts a client component that throws while rendering. This page's content is replaced by \`src/routes/[locale]/error.tsx\` while the header and footer stay; pressing "${retry}" calls \`reset\`, and the page renders again in place.`,
});

export const demoButton = message({
  ja: '描画中に throw する',
  en: 'Throw while rendering',
});

export const withoutTitle = message({
  ja: '`error.tsx` が受けないとき',
  en: 'When no `error.tsx` catches it',
});

export const withoutDescription = message({
  ja: 'クライアント遷移で届いたページが描画に失敗し、それを受ける `error.tsx` が無ければ、フレームワークは同じ URL を文書として読み込み直します。ネットワークの失敗や、ペイロードではない答え（ホストが配るファイルなど）も同じく文書の読み込みになります。hydration 中の失敗は読み込み直しません。すでに描かれた HTML を取り直しても良くはならず、繰り返すだけだからです。',
  en: 'When a page that arrived by client navigation fails to render and no `error.tsx` catches it, the framework loads the same URL as a document instead. A network failure, or an answer that is not a payload — a file the host serves — becomes a document load the same way. A failure during hydration is not reloaded: asking again for HTML that was already rendered cannot make it better, and would only loop.',
});

export const notFoundTitle = message({
  ja: '`not-found.tsx`',
  en: '`not-found.tsx`',
});

export const notFoundDescription = message({
  ja: '`not-found.tsx` は、そのディレクトリ以下でほかのどれも答えなかった pathname に答える catch-all（`/*`）です。表では枝の最後に置かれるので、宣言されたルートがかならず先に試されます。ページと同じく `params` と `pathname` を受け取り、自分の `<title>` を描きます。',
  en: 'A `not-found.tsx` is the catch-all (`/*`) for any pathname below its directory that nothing else answered. It comes last in its branch, so every declared route is tried first. Like a page it receives `params` and `pathname`, and renders its own `<title>`.',
});

export const notFoundParams = message({
  ja: 'catch-all の上にあるパラメータは検証されないので、`/:locale/*` の `not-found.tsx` が受け取る `params.locale` は、どんな文字列でもありえます。使う前に確かめます。',
  en: 'The parameters above a catch-all are not validated, so the `params.locale` a `not-found.tsx` at `/:locale/*` receives can be any string. Check it before using it.',
});

export const redirectTitle = message({
  ja: '`redirect.ts`',
  en: '`redirect.ts`',
});

export const redirectDescription = message({
  ja: '移転したディレクトリには、`page.tsx` の代わりに `redirect.ts` を置きます。default export は行き先の文字列か、`{ to, permanent }` です。',
  en: 'A directory that has moved keeps a `redirect.ts` instead of a `page.tsx`. It default-exports the target: a string, or `{ to, permanent }`.',
});

export const redirectPattern = message({
  ja: '行き先はパターンで、一致したパラメータで埋められます。`/:locale/legacy` は `/:locale/new` へ送れます。自分のパターンに無いパラメータを行き先で名指すと、そのリダイレクトに答える時点で失敗します。',
  en: 'The target is a pattern the matched params fill in, so `/:locale/legacy` can send to `/:locale/new`. A target naming a param its own pattern does not have fails when the redirect is answered.',
});

export const redirectOrder = message({
  ja: 'リダイレクトは表より先に調べられます。リダイレクトするディレクトリには描くページが無いので、同じディレクトリに `page.tsx` と `redirect.ts` を両方置くとビルドが拒みます。リダイレクトも宣言された URL として数えられるので、別のグループが同じ URL にページを置くことも拒まれます。',
  en: 'A redirect is consulted before the table. A directory that redirects has no page to render, so one holding both `page.tsx` and `redirect.ts` fails the build — and since a redirect counts as a declared URL, another group putting a page at the same URL is refused too.',
});
