import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリを動かします。リクエストのたびに描画するので、パラメータの値を事前に列挙する必要がなく、知らない URL には本物の 404 を返し、フォームは Server Action に届きます。',
  en: 'Runs an application. Every request is answered by rendering, so route parameters need no list of values, an unknown URL is a real 404, and a form can post to a Server Action.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureRequest = message({
  ja: '値はリクエストと来る',
  en: 'Values arrive with the request',
});

export const featureRequestDescription = message({
  ja: 'パラメータの値はリクエストと一緒に来るので、事前に列挙する必要がありません。知らない URL には、ホスティングのエラーページではなく自分の not-found を本物の 404 で返します。ページと layout は `request` からヘッダーと cookie を読み取り専用で読めます。',
  en: "Parameter values arrive with the request, so nothing has to be enumerated ahead of time. An unknown URL gets your not-found page under a genuine 404 rather than the host's error page. A page or layout reads the request's headers and cookies from `request`, read-only.",
});

export const featureRoutes = message({
  ja: 'routes/ が URL 空間',
  en: 'routes/ is the URL space',
});

export const featureRoutesDescription = message({
  ja: 'ディレクトリ木がそのまま pathname 空間です。page/layout/not-found/error/redirect/guard・`[param]`・`(group)`・`_` の私物だけを認め、規約から外れたものはビルドを落とします。',
  en: 'The directory tree is the pathname space: page/layout/not-found/error/redirect/guard, `[param]`, `(group)`, and `_`-prefixed privates. Anything outside the grammar fails the build.',
});

export const featureActions = message({
  ja: 'フォームが届く',
  en: 'Forms have somewhere to arrive',
});

export const featureActionsDescription = message({
  ja: 'Server Actions の宛先があります。@k8ordo/form と組み合わせれば、検証もメッセージも同じ 1 つのスキーマから出ます。',
  en: 'Server Actions have a destination. Paired with @k8ordo/form, the validation and the messages come from the same single schema.',
});

export const featureSameHandler = message({
  ja: 'static と同じハンドラ',
  en: 'The same handler as static',
});

export const featureSameHandlerDescription = message({
  ja: 'リクエストをページに変える関数は static と同じもので、モードごとにコンパイルされ、違いは主に呼ぶ時期です。両モードで描画が食い違うなら、それは何かが漏れています。',
  en: 'The function that turns a request into a page is the same one, compiled for each mode; what differs is chiefly when it is called. If a page renders differently under the two modes, something has leaked.',
});

export const featureRouteFiles = message({
  ja: 'error.tsx と redirect.ts',
  en: 'error.tsx and redirect.ts',
});

export const featureRouteFilesDescription = message({
  ja: 'ページが throw したら `error.tsx` が layout の内側に描かれ、枠は残ります。移転したディレクトリには `redirect.ts` を 1 行置き、Server Action は `redirect()` で送り先を告げます。',
  en: 'When a page throws, `error.tsx` renders inside the layout and the frame survives. A directory that moved keeps a one-line `redirect.ts`, and a Server Action ends with `redirect()` to say where next.',
});

export const featureGuards = message({
  ja: 'guard.ts が先に決める',
  en: 'guard.ts decides first',
});

export const featureGuardsDescription = message({
  ja: 'どの階層にも置ける `guard.ts` が、その下で答えるものより前に外から順に走ります。`Response` を返せばそこで打ち切り、通すときは最終的な応答に付けるヘッダーを添えられます。ページは描画のままです。',
  en: 'A `guard.ts` at any level runs, outer first, before whatever answers below it. Returning a `Response` ends the request there; letting it through can still add headers to the final answer. A page stays a render.',
});

export const featureParams = message({
  ja: 'パラメータにスキーマ',
  en: 'Parameters take a schema',
});

export const featureParamsDescription = message({
  ja: '`page.tsx` や `layout.tsx` が `paramsSchema` を export すると、合わない値はそのパターンが答えず、本物の 404 になります。リンクはスキーマの出力型で書けます。',
  en: 'A `page.tsx` or `layout.tsx` that exports `paramsSchema` makes a refused value a pathname the pattern does not answer — a genuine 404. Links take what the page receives, typed by the schema.',
});

export const exampleTitle = message({
  ja: 'Server Action',
  en: 'A Server Action',
});

export const exampleDescription = message({
  ja: '`use server` を付けた関数はクライアントから呼べて、実行はサーバーで起きます。JavaScript が無くても、同じフォームがそのまま動きます。',
  en: 'A function marked `use server` is callable from the client, and runs on the server. The same form still works with no JavaScript at all.',
});

export const docsTitle = message({
  ja: 'ドキュメント',
  en: 'Documentation',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/server/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/server/docs/`.',
});

export const navRouting = message({
  ja: 'routes/',
  en: 'routes/',
});

export const navParams = message({
  ja: 'パラメータ',
  en: 'Parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクト',
  en: 'Errors & redirects',
});

export const navBoundaries = message({
  ja: '実行境界',
  en: 'Boundaries',
});

export const navActions = message({
  ja: 'アクションとリクエスト',
  en: 'Actions & requests',
});

export const navGuards = message({
  ja: 'ガードと応答',
  en: 'Guards & responses',
});

export const navDeploy = message({
  ja: '実行と配信',
  en: 'Run & deploy',
});
