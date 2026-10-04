import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリを動かします。リクエストのたびに描画するので、パラメータの値を事前に列挙する必要がなく、知らない URL には本物の 404 を返し、フォームは Server Action に届きます。',
  en: 'Runs an application. Every request is answered by rendering, so route parameters need no list of values, an unknown URL is a real 404, and a form can post to a Server Action.',
});

export const tagline = message({
  ja: 'React Server Components のアプリを、リクエストごとに描いて動かす。',
  en: 'Run a React Server Components app, rendering on every request.',
});

export const claimActionsTitle = message({
  ja: 'フォームは Server Action に送る',
  en: 'Forms post to Server Actions',
});

export const claimActionsBody = [
  message({
    ja: "`'use server'` の関数が、フォームの送り先になります。JavaScript が届く前でも、ふつうのフォームの送信として動きます。",
    en: "A `'use server'` function is where a form posts. It works as an ordinary form submission before JavaScript arrives.",
  }),
  message({
    ja: '送信のあとは、ページを描き直した結果と戻り値が 1 往復で返ります。`redirect()` で終えれば、そのまま別のページへ移ります。',
    en: 'The re-rendered page and the return value come back in one round trip. End with `redirect()`, and the visitor moves on to another page.',
  }),
] as const;

export const claimGuardsTitle = message({
  ja: 'ページを描く前に、guard.ts で止める',
  en: 'Stop a request in guard.ts, before the page renders',
});

export const claimGuardsBody = [
  message({
    ja: '`guard.ts` は、そのディレクトリより下の URL を答える前に走ります。`Response` を返せばそれが応答になり、何も返さなければ先へ通します。',
    en: 'A `guard.ts` runs before any URL below its directory is answered. Return a `Response` and that is the answer; return nothing and the request goes on.',
  }),
  message({
    ja: 'ページ・クライアント遷移のペイロード・Server Action のどれにも同じ guard が効くので、ログインの確認を書き忘れる入口がありません。',
    en: 'The same guard covers the page, its payload for a client navigation, and any Server Action posted to it, so no entrance skips the sign-in check.',
  }),
] as const;

export const claimModeTitle = message({
  ja: '静的なサイトから、import 1 行で移れる',
  en: 'From a static site, it is one import away',
});

export const claimModeBody = [
  message({
    ja: '`@k8ordo/static` と `@k8ordo/server` は、同じルートの書き方・同じ境界・同じリクエストハンドラを使います。違うのは、ハンドラをビルドのときに呼ぶか、リクエストごとに呼ぶかだけです。',
    en: '`@k8ordo/static` and `@k8ordo/server` share the route grammar, the boundaries and the request handler. The only difference is whether the handler is called at build time or on every request.',
  }),
  message({
    ja: 'ビルドしたハンドラは `Request` を受けて `Response` を返す関数なので、Node.js の `serve` のほか、Deno や Bun でも動きます。Vercel には、出力をその形に書く `vercel()` があります。',
    en: 'The built handler takes a `Request` and returns a `Response`, so it runs under Node.js with `serve`, and under Deno or Bun too. For Vercel, `vercel()` writes the output in its format.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'プラグインを足し、ページを置いて、`serve` で動かすまでです。',
  en: 'Add the plugin, place a page, and run it with `serve`.',
});

export const nextRouting = message({
  ja: 'ファイル名とディレクトリ名の文法と、ページが答えて流れる仕組みです。',
  en: 'The file and directory grammar, and how a page answers and streams.',
});

export const nextActions = message({
  ja: 'Server Action の書き方と、JavaScript の前に動くフォームです。',
  en: 'Writing Server Actions, and forms that work before JavaScript.',
});

export const nextGuards = message({
  ja: '`guard.ts`・Cookie・応答ヘッダーと、ページが読めるリクエストです。',
  en: '`guard.ts`, cookies, response headers, and the request a page may read.',
});

export const nextDeploy = message({
  ja: '`serve` での起動と、ほかのランタイムや Vercel への載せ方です。',
  en: 'Running with `serve`, and deploying to other runtimes or Vercel.',
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
