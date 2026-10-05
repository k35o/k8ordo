import { message } from '@k8ordo/i18n';

export const pathsTitle = message({
  ja: '`static build needs pathnames for …`でビルドが止まる',
  en: 'The build stops with `static build needs pathnames for …`',
});

export const pathsCause = message({
  ja: 'パラメータを持つルートに当てはまるURLが、`paths`に1つもありません。ビルドはパラメータの値を自分では決められません。',
  en: 'No URL that `paths` returned fits a route with parameters, and a build cannot invent the values itself.',
});

export const pathsFix = message({
  ja: '`framework()`の`paths`で、そのルートのURLを並べます。',
  en: 'List that route’s URLs with the `paths` option of `framework()`.',
});

export const unusedTitle = message({
  ja: '`the "paths" option supplied pathnames no route wants`でビルドが止まる',
  en: 'The build stops with `the "paths" option supplied pathnames no route wants`',
});

export const unusedCause = message({
  ja: '`paths`が返したURLのうち、どのルートにも当たらないものがあります。多くはURLの打ち間違いです。',
  en: 'A URL that `paths` returned matches no route — most often a typo.',
});

export const unusedFix = message({
  ja: 'エラーの後ろに並んだURLを直すか、`paths`から外します。',
  en: 'Fix the URLs the error lists, or drop them from `paths`.',
});

export const actionsTitle = message({
  ja: '`static build cannot ship Server Actions`でビルドが止まる',
  en: 'The build stops with `static build cannot ship Server Actions`',
});

export const actionsCause = message({
  ja: "`'use server'`を書いたモジュールがあります。ファイルはフォームの送信を受け取れないので、このモードではServer Actionを使えません。",
  en: "A module declares `'use server'`. A file cannot receive a form submission, so this mode has no Server Actions.",
});

export const actionsFix = message({
  ja: 'フォームの送信をサーバーで受け取るなら、`@k8ordo/server`に移ります。検索や絞り込みのようなGETのフォームなら、Server Actionを使わずに書けます。',
  en: 'To receive the submission on a server, move to `@k8ordo/server`. A GET form, such as a search or a filter, needs no Server Action.',
});

export const guardTitle = message({
  ja: '`static build cannot run guard.ts`でビルドが止まる',
  en: 'The build stops with `static build cannot run guard.ts`',
});

export const guardCause = message({
  ja: '`routes/`の中に`guard.ts`があります。ファイルには、通すかどうかを決めるリクエストがありません。',
  en: 'There is a `guard.ts` under `routes/`, and a file has no request to let through or to stop.',
});

export const guardFix = message({
  ja: 'リクエストを止める必要があるなら`@k8ordo/server`に移り、そうでなければ`guard.ts`を消します。',
  en: 'If requests do need stopping, move to `@k8ordo/server`; otherwise delete the `guard.ts`.',
});

export const renderTitle = message({
  ja: '`static build could not render …`でビルドが止まる',
  en: 'The build stops with `static build could not render …`',
});

export const renderCause = message({
  ja: 'そのページを描いている途中で、Server Componentが例外を投げました。上にSuspenseの境界が無いクライアントコンポーネントが投げた場合も同じです。',
  en: 'A Server Component threw while the page was being rendered — or a client component did, with no Suspense boundary above it.',
});

export const renderFix = message({
  ja: '投げられたメッセージが、この行より上にページのURLと一緒に出ています。それを手がかりに直します。',
  en: 'The thrown message is logged above that line, beside the page’s URL. Start from there.',
});

export const devTitle = message({
  ja: '`vite dev`では表示されるページで、ビルドが止まる',
  en: 'A page that shows under `vite dev` stops the build',
});

export const devCause = message({
  ja: '`vite dev`はファイルを書かず、リクエストのたびにページを描きます。そのため`paths`に無い値のページも描き、Server Componentが投げた例外にも`500`で答えて動き続けます。',
  en: '`vite dev` writes no files and renders per request. It renders a value `paths` does not list, and answers a Server Component that threw with a `500` and keeps going.',
});

export const devFix = message({
  ja: '公開する前に`vite build`を通し、止まったときのメッセージに従って直します。',
  en: 'Run `vite build` before you ship, and follow the message it stops with.',
});

export const statusTitle = message({
  ja: '`404.html`が200のステータスで返る',
  en: '`404.html` is served with a 200',
});

export const statusCause = message({
  ja: '`404.html`の答えに付けるステータスは、ホスティングが決めます。ビルドが書けるのはページまでで、応答のステータスは書けません。',
  en: 'The status that goes with `404.html` is the host’s to decide. A build can write the page, but not the response.',
});

export const statusFix = message({
  ja: 'ホスティングの設定で、持っていないURLに`404.html`を404のステータスで返すようにします。',
  en: 'Configure the host to answer an unknown URL with `404.html` under a 404.',
});

export const cspTitle = message({
  ja: '`the "csp" option cannot go into a page\'s <meta> as it is`というエラーが出る',
  en: 'An error says `the "csp" option cannot go into a page\'s <meta> as it is`',
});

export const cspCause = message({
  ja: "`csp`に、`<meta>`では効かないディレクティブか、`'strict-dynamic'`が入っています。`<meta>`で効かないのは`frame-ancestors`と`report-uri`、`sandbox`です。",
  en: "The `csp` option holds a directive a `<meta>` ignores — `frame-ancestors`, `report-uri` or `sandbox` — or `'strict-dynamic'`.",
});

export const cspFix = message({
  ja: "`<meta>`で効かないディレクティブは、ホスティングのヘッダーで設定します。`'strict-dynamic'`は外してください。フレームワークのモジュールのスクリプトは、`'self'`で許されています。",
  en: "Set the directives a `<meta>` ignores as headers at the host, and drop `'strict-dynamic'`: the framework’s module script is allowed by `'self'`.",
});
