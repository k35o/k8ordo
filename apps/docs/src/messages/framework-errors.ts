import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-errors.ts / server-errors.ts が持つ。

export const errorTitle = message({
  ja: '例外を`error.tsx`で受け止める',
  en: 'Catch what throws with `error.tsx`',
});

export const errorDescription = message({
  ja: 'レイアウトやページの横に`error.tsx`を置くと、その下で例外が投げられたときに代わりに描かれます。描かれる場所はレイアウトの内側なので、ヘッダーのような枠は失敗しても残ります。',
  en: 'An `error.tsx` beside a layout or a page is rendered in place of what is below it when that throws. It renders inside the layout, so the frame around it, a header say, survives the failure.',
});

export const errorClient = message({
  ja: '描画中の例外を受け止められるのはブラウザだけなので、`error.tsx`はクライアントコンポーネントにします。受け取るのは、投げられた値の`error`と、その部分をその場で描き直す`reset`です。`params`は受け取りません。',
  en: 'Only the browser can catch an error thrown while rendering, so `error.tsx` is a client component. It receives `error`, whatever was thrown, and `reset`, which renders that part again in place — and no `params`.',
});

export const errorAway = message({
  ja: '別のページへ移れば、失敗した表示は何もしなくても消えます。',
  en: 'Navigating to another page clears the failure on its own.',
});

export const scopeTitle = message({
  ja: 'どこまでを受け持つか',
  en: 'What it covers',
});

export const scopeDescription = message({
  ja: '例外を受け止めるのは、投げられた場所より上でいちばん近い`error.tsx`です。`error.tsx`は同じディレクトリの`layout.tsx`の内側に置かれるので、そのレイアウト自身の例外は1つ上の`error.tsx`が受け止めます。',
  en: 'The nearest `error.tsx` above the throw catches it. An `error.tsx` sits inside the `layout.tsx` of its own directory, so that layout’s own failure is caught one level up.',
});

export const scopeExample = message({
  ja: 'この木では、`shop/page.tsx`と`shop/[id]/page.tsx`の例外を、`shop/error.tsx`が`shop/layout.tsx`の内側で受け止めます。`shop/layout.tsx`自身の例外は、ルートの`error.tsx`が受け止めます。',
  en: 'In this tree `shop/error.tsx` catches a failure in `shop/page.tsx` or `shop/[id]/page.tsx`, inside `shop/layout.tsx`. A failure in `shop/layout.tsx` itself is caught by the root `error.tsx`.',
});

export const scopeNone = message({
  ja: '受け止める`error.tsx`が無いときは、クライアント側の遷移で届いたページが描けなかった場合に、フレームワークが同じURLを文書として読み込み直します。',
  en: 'With no `error.tsx` to catch it, a page that failed after a client navigation becomes a document load of the same URL.',
});

export const demoTitle = message({
  ja: '例外を投げてみる',
  en: 'Throw an error',
});

export const demoDescription = message({
  ja: 'このサイトにも`src/routes/[locale]/error.tsx`があります。下のボタンを押すと、描画中に例外を投げるクライアントコンポーネントが現れます。',
  en: 'This site has its own `src/routes/[locale]/error.tsx`. The button below mounts a client component that throws while rendering.',
});

export const demoButton = message({
  ja: '描画中に例外を投げる',
  en: 'Throw while rendering',
});

export const demoSteps = [
  message({
    ja: '「描画中に例外を投げる」を押すと、このページの本文が「問題が発生しました」という表示に置き換わります。ヘッダーやサイドバーは、そのまま残ります。',
    en: 'Press “Throw while rendering”. This page’s content is replaced by “Something went wrong”, while the header and the sidebar stay.',
  }),
  message({
    ja: '「再読み込み」を押すと`reset`が呼ばれ、このページがその場で描き直されます。',
    en: 'Press “Retry”. `reset` is called, and this page renders again in place.',
  }),
] as const;

export const notFoundTitle = message({
  ja: 'どこにも当たらないURLに`not-found.tsx`で答える',
  en: 'Answer a URL nothing matched with `not-found.tsx`',
});

export const notFoundDescription = message({
  ja: '`not-found.tsx`は、そのディレクトリより下でどのルートにも当たらなかったURLに答えます。ルート表ではその枝の最後に置かれるので、宣言したルートがかならず先に試されます。',
  en: 'A `not-found.tsx` answers any URL below its directory that no route matched. It comes last in its branch of the route table, so every declared route is tried first.',
});

export const notFoundProps = message({
  ja: 'ページと同じく`params`と`pathname`を受け取り、自分の`<title>`を描きます。',
  en: 'Like a page, it receives `params` and `pathname`, and renders its own `<title>`.',
});

export const pageNotFoundTitle = message({
  ja: 'データが無いページから`notFound()`を投げる',
  en: 'Throw `notFound()` from a page whose data is missing',
});

export const pageNotFoundDescription = message({
  ja: 'スキーマが決めるのはパラメータの形までで、そのデータがあるかどうかはページにしか分かりません。無いときは、`@k8ordo/router`の`notFound()`を投げます。',
  en: 'A schema decides what a parameter looks like; whether its data exists, only the page knows. When it does not, throw `notFound()` from `@k8ordo/router`.',
});

export const pageNotFoundAnswer = message({
  ja: '`notFound()`は例外を投げるので、その後の行は走りません。ページの代わりに、いちばん近い上の`not-found.tsx`が、その上のレイアウトの内側に404として描かれます。',
  en: '`notFound()` throws, so the lines after it never run. In place of the page, the nearest `not-found.tsx` above renders inside the layouts above it, under a 404.',
});

export const pageNotFoundRouter = message({
  ja: '`notFound()`はモードのパッケージではなくルーターのAPIなので、ページはどちらのモードでも同じに書けます。',
  en: '`notFound()` comes from the router, not from the mode package, so the page reads the same under either mode.',
});

export const redirectTitle = message({
  ja: '移転したURLを`redirect.ts`で転送する',
  en: 'Send a moved URL on with `redirect.ts`',
});

export const redirectDescription = message({
  ja: 'URLを移したときは、古いディレクトリに`page.tsx`の代わりに`redirect.ts`を置きます。default exportするのは、行き先の文字列か`{ to, permanent }`です。',
  en: 'When a URL moves, its old directory keeps a `redirect.ts` instead of a `page.tsx`. It default-exports the target: a string, or `{ to, permanent }`.',
});

export const redirectPattern = message({
  ja: '行き先はルート表のパターンで書き、当たったパラメータで埋められます。そのため`/:locale/legacy`から`/:locale/new`へ、ロケールを保ったまま送れます。',
  en: 'The target is a pattern of the route table, filled with the matched parameters, so `/:locale/legacy` can send to `/:locale/new` keeping the locale.',
});

export const redirectAlone = message({
  ja: 'リダイレクトするディレクトリには描くページが無いので、同じディレクトリに`page.tsx`と`redirect.ts`を両方置くと、ビルドが止まります。',
  en: 'A directory that redirects has no page to render, so holding both `page.tsx` and `redirect.ts` stops the build.',
});
