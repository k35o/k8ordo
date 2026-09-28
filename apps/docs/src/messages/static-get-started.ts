import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/static` を入れて `vite.config.ts` にプラグインを 1 つ足し、`routes/` にレイアウトとページを置けば、`vite build` がサイトをファイルに書き出します。このページはそこまでの最短の道筋と、このモードを選ぶことが何を意味するかを説明します。',
  en: 'Install `@k8ordo/static`, add one plugin to `vite.config.ts`, put a layout and a page under `routes/`, and `vite build` writes the site out as files. This page walks the shortest path there, and what choosing this mode means.',
});

export const modeTitle = message({
  ja: 'モードは依存で決まる',
  en: 'The mode is the dependency',
});

export const modeDescription = message({
  ja: 'このパッケージを入れることが、アプリを静的にすることです。ここでのリクエスト時のデータは、覚えておくべき規則ではありません。リクエストそのものが無いので、読む先がありません。',
  en: 'Installing this package is what makes an application static. Request-time data is not a rule to remember here: there is no request, so there is nothing to read it from.',
});

export const modeActions = message({
  ja: "RSC のパイプラインがそれでもコンパイルしてしまう唯一のものが Server Action です。どこにも届かない POST をするフォームを出荷しないよう、ビルドは `'use server'` を宣言したモジュールをすべて名指しで拒みます。",
  en: "A Server Action is the one thing the underlying RSC pipeline would still compile, so the build refuses every module that declares `'use server'` by name, rather than shipping a form that posts into nothing.",
});

export const modeDev = message({
  ja: '`vite dev` はその POST を受け取れてしまう実行中のサーバーなので、同じ拒否は、そのファイルがコンパイルされた時点で dev でも出ます。開発では動くのに本番ではどこにも届かないフォームは、最初から動かないフォームより悪いからです。',
  en: '`vite dev` is a running server that would happily accept that POST, so the same refusal is raised there too, the moment the file is compiled — a form that works in development and posts into nothing in production is worse than one that never worked.',
});

export const modeGuards = message({
  ja: '`@k8ordo/server` がリクエストに答える前に走らせる `guard.ts` も、同じように名指しで拒みます。ビルドでも `vite dev` でもです。ファイルは、guard を走らせられる何かに要求されることがありません。',
  en: 'A `guard.ts` — what `@k8ordo/server` runs before a request is answered — is refused the same way, by name, in the build and in `vite dev`: a file is never requested of anything that could run one.',
});

export const modeSame = message({
  ja: 'もう一方のモードを選ぶことは、代わりに `@k8ordo/server` を入れることで、アプリのほかの部分は何も変わりません。ルートの文法も、境界も、リクエストハンドラも同じで、ハンドラがビルド時にルートごとに呼ばれるか、リクエストごとに呼ばれるかだけが違います。プラグインが両方のパッケージで `framework()` という名前なのはそのためで、モードを決めるのは import だけです。`vite.config.ts` はどちらでも同じに読めます。',
  en: 'Choosing the other mode means installing `@k8ordo/server` instead, and nothing else about the application changes — the same route grammar, the same boundaries, the same request handler, called for each route at build time instead of per request. That is why the plugin is called `framework()` in both packages: the mode is the import, and `vite.config.ts` reads the same either way.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installDescription = message({
  ja: 'ルーターと React は実行時の依存です。`@k8ordo/static` と Vite はビルドのときにしか使わないので、開発時の依存に入れます。`server-only` は、サーバー専用のモジュールに付ける import を TypeScript が解決できるようにするためのものです。',
  en: 'The router and React are runtime dependencies. `@k8ordo/static` and Vite are only ever needed at build time, so they are development dependencies. `server-only` is there so TypeScript can resolve the import that marks a server-only module.',
});

export const requirementsDescription = message({
  ja: 'ピア依存と、ビルドを動かす Node.js の要件です。',
  en: 'The peer dependencies, and the Node.js the build runs on.',
});

export const configDescription = message({
  ja: 'プラグインは `framework()` 1 つです。オプションは 3 つあり、`routesDir` はルートのディレクトリ（既定は `src/routes`）、`paths` はパラメータ付きルートの pathname、`site` はサイトの配信元で、渡すとビルドが `sitemap.xml` も書きます。',
  en: 'The plugin is `framework()`. It takes three options: `routesDir`, the route directory (default `src/routes`); `paths`, the pathnames for routes with parameters; and `site`, the origin the site is served from, which makes the build write `sitemap.xml` too.',
});

export const runTitle = message({
  ja: '動かす',
  en: 'Run it',
});

export const runDescription = message({
  ja: '`vite dev` はリクエストごとに描画するサーバーで、Fast Refresh も効きます。`vite build` は全ルートを描いて `dist/client/` に書き、そのディレクトリがサイトです。',
  en: '`vite dev` is a server that renders per request, Fast Refresh included. `vite build` renders every route into `dist/client/`, and that directory is the site.',
});

export const runDev = message({
  ja: '`vite dev` はビルドと同じハンドラを動かしますが、ファイルは書かないので、次の点は本番と違います。`paths` に無いパラメータの値もそのまま描かれます。`redirect.ts` はリダイレクトのページではなく `307`（`permanent` なら `308`）で答えます。知らない URL には、ホスティングの `404.html` ではなく、ハンドラが 404 で答えます（`not-found.tsx` があればそれを描きます）。Server Component が throw したページは、`error.tsx` ではなく、throw されたメッセージを載せた `500` で答えます。ビルドならそこで止まるところです。',
  en: "`vite dev` runs the same handler as the build but writes no files, so a few things differ from production. A param value `paths` does not list still renders. `redirect.ts` answers with a `307` (a `308` when `permanent`) rather than a redirect page. An unknown URL is answered by the handler under a 404 — with `not-found.tsx`, when there is one — rather than by the host's `404.html`. A page whose Server Component throws answers a `500` carrying the thrown message rather than `error.tsx` — where the build would stop.",
});

export const runLog = message({
  ja: 'ビルドは最後に、書いたものを 1 行で報告します。',
  en: 'The build ends by reporting what it wrote, in one line.',
});

export const chooseTitle = message({
  ja: '`@k8ordo/server` を選ぶとき',
  en: 'When to choose `@k8ordo/server`',
});

export const chooseDescription = message({
  ja: 'リクエストを必要とするものは、このモードにはありません。次のどれかが要るなら、アプリが求めているのは `@k8ordo/server` です。このページの内容はそのまま使えます。',
  en: 'Anything that needs the request is not in this mode. If the application needs any of the following, it wants `@k8ordo/server` — and everything on this page stays exactly as it is.',
});

export const chooseActions = message({
  ja: 'フォームの送信先になる Server Action と、そこからの `redirect()`',
  en: 'Server Actions a form can post to, and `redirect()` from them',
});

export const chooseRequest = message({
  ja: 'ページがリクエストのヘッダーや cookie を読むこと',
  en: "A page reading the request's headers and cookies",
});

export const chooseStatus = message({
  ja: 'アプリが決めるステータスコード（知らない URL への本物の 404 を含む）',
  en: 'Status codes the application decides, a real 404 for an unknown URL included',
});

export const chooseValues = message({
  ja: '前もって列挙できないパラメータの値',
  en: 'Parameter values that cannot be listed ahead of time',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextRouting = message({
  ja: '`routes/` の文法と、ビルドが拒むもの',
  en: 'The `routes/` grammar, and what the build refuses',
});

export const nextParams = message({
  ja: 'パラメータのスキーマと `paths`',
  en: 'Parameter schemas and `paths`',
});

export const nextErrors = message({
  ja: '`error.tsx`・`not-found.tsx`・`redirect.ts`',
  en: '`error.tsx`, `not-found.tsx` and `redirect.ts`',
});

export const nextBoundaries = message({
  ja: 'Server Component とクライアントコンポーネントの境界',
  en: 'The boundary between Server and client components',
});

export const nextDeploy = message({
  ja: '出力されるファイルと、静的ホスティングへの置き方',
  en: 'The output, and putting it on a static host',
});
