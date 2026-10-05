import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/server`でアプリを1つ作りながら、インストールから`serve()`で動かすところまでをたどります。ページは`src/routes/`の下にファイルとして置き、リクエストのたびにサーバーで描きます。',
  en: 'Build an application with `@k8ordo/server`, from installing it to running it with `serve()`. Pages are files under `src/routes/`, rendered on the server for every request.',
});

export const installDescription = message({
  ja: '`@k8ordo/server`は、デプロイした後も`serve()`とリクエストハンドラとして動くので、実行時の依存に入れます。Viteはビルドにしか使わないので、開発時の依存に入れます。',
  en: '`@k8ordo/server` keeps running after the deploy, as `serve()` and the request handler, so it is a runtime dependency. Vite is only used to build, so it is a development dependency.',
});

export const runTitle = message({
  ja: '動かす',
  en: 'Run it',
});

export const runDescription = message({
  ja: '開発中は`vite dev`で動かします。本番では、`vite build`が書き出したリクエストハンドラを、`serve()`を呼ぶ小さなスクリプトで起動します。',
  en: 'During development, run `vite dev`. In production, a small script that calls `serve()` starts the request handler `vite build` wrote.',
});

export const runDev = message({
  ja: '`vite dev`は、本番と同じ仕組みでリクエストに答えます。Fast Refreshも効くので、ファイルを保存すると表示がすぐに変わります。',
  en: '`vite dev` answers requests through the same pipeline as production, with Fast Refresh: save a file, and the change shows right away.',
});

export const runServe = message({
  ja: '`serve()`は`@k8ordo/server/serve`からimportします。`dist/`のビルドを読み込み、既定では`http://localhost:3000`で待ち受けます。',
  en: '`serve()` comes from `@k8ordo/server/serve`. It loads the build in `dist/` and listens on `http://localhost:3000` by default.',
});

export const runProd = message({
  ja: '`serve()`も、ハンドラの中のコードが使う`@k8ordo/server/runtime`も、Viteを読み込みません。そのため本番の環境には、開発時の依存を入れなくても動きます。',
  en: 'Neither `serve()` nor `@k8ordo/server/runtime`, which code inside the handler uses, loads Vite, so production runs without the development dependencies installed.',
});

export const nextRouting = message({
  ja: 'ファイルとディレクトリの名前の決まりと、ビルドが受け付けない形を知る。',
  en: 'Learn the naming rules for files and directories, and what the build refuses.',
});

export const nextActions = message({
  ja: 'フォームの送信を、Server Actionで受け取る。',
  en: 'Receive a form’s submission in a Server Action.',
});

export const nextDeploy = message({
  ja: '`serve()`のほか、DenoやBun、Vercelでも動かす。',
  en: 'Run it with `serve()`, or on Deno, Bun or Vercel.',
});
