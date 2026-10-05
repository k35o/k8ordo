import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリをサーバーで動かします。リクエストのたびに描画するので、パラメータの値を前もって並べる必要がありません。知らないURLには本物の404を返し、フォームはServer Actionに届きます。',
  en: 'Runs an application. Every request is answered by rendering, so route parameters need no list of values, an unknown URL is a real 404, and a form can post to a Server Action.',
});

export const tagline = message({
  ja: 'React Server Componentsのアプリを、リクエストのたびに描いて動かす。',
  en: 'Run a React Server Components app, rendering on every request.',
});

export const claimActionsTitle = message({
  ja: 'フォームはServer Actionに送る',
  en: 'Forms post to Server Actions',
});

export const claimActionsBody = [
  message({
    ja: "`'use server'`を付けた関数が、フォームの送信先になります。JavaScriptが届く前でも、ふつうのフォームの送信として動きます。",
    en: "A `'use server'` function is where a form posts. It works as an ordinary form submission before JavaScript arrives.",
  }),
  message({
    ja: '送信のあとは、描き直したページとアクションの戻り値が1往復で返ってきます。アクションを`redirect()`で終えれば、そのまま別のページへ移ります。',
    en: 'The re-rendered page and the return value come back in one round trip. End with `redirect()`, and the visitor moves on to another page.',
  }),
] as const;

export const claimGuardsTitle = message({
  ja: 'ページを描く前に、guard.tsでリクエストを止める',
  en: 'Stop a request in guard.ts, before the page renders',
});

export const claimGuardsBody = [
  message({
    ja: '`guard.ts`は、そのディレクトリより下のURLに応答する前に実行されます。`Response`を返せばそれがそのまま応答になり、何も返さなければリクエストを先へ通します。',
    en: 'A `guard.ts` runs before any URL below its directory is answered. Return a `Response` and that is the answer; return nothing and the request goes on.',
  }),
  message({
    ja: 'ページを開くときも、クライアント側の遷移でデータを取りに来るときも、Server Actionが呼ばれるときも、同じguardが効きます。そのため、ログインの確認を書き忘れる入口ができません。',
    en: 'The same guard covers the page, its payload for a client navigation, and any Server Action posted to it, so no entrance skips the sign-in check.',
  }),
] as const;

export const claimModeTitle = message({
  ja: '静的なサイトから、importの1行で移れる',
  en: 'From a static site, it is one import away',
});

export const claimModeBody = [
  message({
    ja: '`@k8ordo/static`と`@k8ordo/server`は、ルートの書き方も実行の境界も、リクエストを処理するハンドラも共通です。違うのは、そのハンドラをビルドのときに呼ぶか、リクエストのたびに呼ぶかだけです。',
    en: '`@k8ordo/static` and `@k8ordo/server` share the route grammar, the boundaries and the request handler. The only difference is whether the handler is called at build time or on every request.',
  }),
  message({
    ja: 'ビルドしたハンドラは`Request`を受けて`Response`を返す関数なので、Node.jsの`serve`だけでなく、DenoやBunでも動きます。Vercel向けには、出力をVercelの形式で書き出す`vercel()`を用意しています。',
    en: 'The built handler takes a `Request` and returns a `Response`, so it runs under Node.js with `serve`, and under Deno or Bun too. For Vercel, `vercel()` writes the output in its format.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'プラグインを足し、ページを置いて、`serve`で動かすところまで作ります。',
  en: 'Add the plugin, place a page, and run it with `serve`.',
});

export const nextRouting = message({
  ja: 'ファイル名とディレクトリ名の文法と、ページが応答をストリーミングする仕組みです。',
  en: 'The file and directory grammar, and how a page answers and streams.',
});

export const nextActions = message({
  ja: 'Server Actionの書き方と、JavaScriptが届く前から動くフォームです。',
  en: 'Writing Server Actions, and forms that work before JavaScript.',
});

export const nextGuards = message({
  ja: '`guard.ts`でリクエストを止めたり通したりし、応答にヘッダーを足します。',
  en: 'Stop a request or let it through in `guard.ts`, and add headers to the answer.',
});

export const nextRequest = message({
  ja: 'ページからリクエストを読み、`cookies()`でCookieを読み書きします。',
  en: 'Read the request from a page, and read and write cookies with `cookies()`.',
});

export const nextDeploy = message({
  ja: '`serve`での起動と、ほかのランタイムやVercelへのデプロイです。',
  en: 'Running with `serve`, and deploying to other runtimes or Vercel.',
});

export const navRouting = message({
  ja: 'ルートを書く',
  en: 'Write routes',
});

export const navParams = message({
  ja: 'パラメータを受け取る',
  en: 'Receive parameters',
});

export const navErrors = message({
  ja: 'エラーとリダイレクトを扱う',
  en: 'Handle errors and redirects',
});

export const navBoundaries = message({
  ja: 'サーバーとブラウザの境界を書く',
  en: 'Server and browser boundaries',
});

export const navActions = message({
  ja: 'Server Actionでフォームを受け取る',
  en: 'Receive forms with Server Actions',
});

export const navGuards = message({
  ja: 'リクエストをguard.tsで止める',
  en: 'Stop requests in guard.ts',
});

export const navDeploy = message({
  ja: 'デプロイする',
  en: 'Deploy',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navTroubleshooting = message({
  ja: 'うまく動かないとき',
  en: 'Troubleshooting',
});

export const navReference = message({
  ja: '設定とファイル',
  en: 'Options and files',
});

export const navCsp = message({
  ja: 'CSPを設定する',
  en: 'Set a CSP',
});

export const navRequest = message({
  ja: 'リクエストとCookieを読む',
  en: 'Read the request and cookies',
});
