import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/server` を入れて `vite.config.ts` にプラグインを 1 つ足し、`routes/` にレイアウトとページを置けば、`vite build` の出力を `serve()` が動かします。このページはそこまでの最短の道筋と、このモードを選ぶことが何を意味するかを説明します。',
  en: 'Install `@k8ordo/server`, add one plugin to `vite.config.ts`, put a layout and a page under `routes/`, and `serve()` runs what `vite build` produced. This page walks the shortest path there, and what choosing this mode means.',
});

export const modeTitle = message({
  ja: 'モードは依存で決まる',
  en: 'The mode is the dependency',
});

export const modeDescription = message({
  ja: 'このパッケージを入れることが、アプリを「動くもの」にすることです。リクエストのたびに描画して答えるので、パラメータの値を列挙する必要がなく、知らない URL は本物の 404 になり、フォームは Server Action に届きます。',
  en: 'Installing this package is what makes an application one that runs. Every request is answered by rendering, which is what makes route parameters need no list of values, an unknown URL a real 404, and a Server Action something a form can post to.',
});

export const modeSame = message({
  ja: 'もう一方の `@k8ordo/static` は、全ルートをビルド時に描いてファイルを出荷します。両者のあいだでアプリのほかの部分は何も変わりません。ルートの文法も、境界も、リクエストハンドラも同じで、ハンドラがリクエストごとに呼ばれるか、ビルド時にルートごとに呼ばれるかだけが違います。プラグインが両方のパッケージで `framework()` という名前なのはそのためで、モードを決めるのは import だけです。',
  en: 'The alternative, `@k8ordo/static`, renders every route at build time and ships files. Nothing else about the application changes between them — the same route grammar, the same boundaries, the same request handler, called per request instead of for each route at build time. That is why the plugin is called `framework()` in both packages: the mode is the import, and `vite.config.ts` reads the same either way.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/server` は実行時の依存です。デプロイしたアプリが動かすのは `serve()` とビルドされたハンドラだからです。`@k8ordo/server` はプラグインで Vite を読みますが、アプリのコードが import する `serve()`・`redirect()`・型は Vite を読まない `@k8ordo/server/runtime` から来るので、`vite` は開発時の依存で足ります。`server-only` は、サーバー専用のモジュールに付ける import を TypeScript が解決できるようにするためのものです。',
  en: '`@k8ordo/server` is a runtime dependency: `serve()` and the built handler are what the deployed application runs. `@k8ordo/server` itself is the plugin and loads Vite, but what the application’s own code imports — `serve()`, `redirect()` and the types — comes from `@k8ordo/server/runtime`, which does not, so `vite` is a dev dependency. `server-only` is there so TypeScript can resolve the import that marks a server-only module.',
});

export const requirementsDescription = message({
  ja: 'ピア依存と、ビルドとサーバーを動かす Node.js の要件です。',
  en: 'The peer dependencies, and the Node.js the build and the server run on.',
});

export const configDescription = message({
  ja: 'プラグインは `framework()` 1 つです。オプションは `routesDir`（ルートのディレクトリ、既定は `src/routes`）だけです。',
  en: 'The plugin is `framework()`. Its one option is `routesDir`, the route directory (default `src/routes`).',
});

export const runTitle = message({
  ja: '動かす',
  en: 'Run it',
});

export const runDescription = message({
  ja: '`vite dev` は本番と同じパイプラインで、Fast Refresh も効きます。`vite build` が `dist/` を書き、`serve()` を呼ぶ小さなスクリプトがそれを動かします。',
  en: '`vite dev` runs the same pipeline as production, with Fast Refresh. `vite build` writes `dist/`, and a small script that calls `serve()` runs it.',
});

export const chooseTitle = message({
  ja: '`@k8ordo/static` を選ぶとき',
  en: 'When to choose `@k8ordo/static`',
});

export const chooseDescription = message({
  ja: 'リクエストを必要とするものが 1 つも無いなら、`@k8ordo/static` が同じアプリをファイルに書き出し、サーバーを動かし続ける必要はなくなります。次のどれも要らないアプリがそれに当たります。',
  en: 'If nothing needs the request, `@k8ordo/static` writes the same application out as files, and there is no server to keep running. That is an application that needs none of the following.',
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
  ja: 'アプリ自身が返す本物の 404',
  en: 'A real 404 answered by the application itself',
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
  ja: 'パラメータのスキーマと、本物の 404',
  en: 'Parameter schemas, and the real 404',
});

export const nextErrors = message({
  ja: '`error.tsx`・`not-found.tsx`・`redirect.ts` と、返るステータス',
  en: '`error.tsx`, `not-found.tsx`, `redirect.ts`, and the statuses they answer with',
});

export const nextBoundaries = message({
  ja: 'Server Component とクライアントコンポーネントの境界',
  en: 'The boundary between Server and client components',
});

export const nextActions = message({
  ja: 'Server Action と、リクエストの読み方',
  en: 'Server Actions, and reading the request',
});

export const nextDeploy = message({
  ja: '`serve()` と、ほかのホストでハンドラを動かす方法',
  en: '`serve()`, and running the handler on another host',
});
