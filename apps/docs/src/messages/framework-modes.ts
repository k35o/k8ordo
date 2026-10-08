import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`framework()`の`mode`で、アプリをサーバーなしで動かすか、サーバーありで動かすかを選びます。決め手は、アプリがリクエストを必要とするかどうかです。',
  en: 'The `mode` of `framework()` decides whether the application runs without a server or with one. The choice comes down to whether the application needs the request.',
});

export const chooseTitle = message({
  ja: '選び方',
  en: 'Choosing',
});

export const chooseServer = message({
  ja: "次のどれかに当てはまるなら、`mode: 'server'`を選びます。",
  en: "Pick `mode: 'server'` if any of these applies.",
});

export const chooseList = [
  message({
    ja: 'フォームの送信をServer Actionで受け取る',
    en: 'Receiving a form submission in a Server Action',
  }),
  message({
    ja: '`guard.ts`で、ページを描画する前にリクエストを止める',
    en: 'Stopping a request in a `guard.ts` before the page renders',
  }),
  message({
    ja: 'リクエストのヘッダーやCookieを読む、または`cookies()`で書く',
    en: 'Reading the request’s headers or cookies, or writing cookies with `cookies()`',
  }),
  message({
    ja: 'ページが`search`をexportして、クエリを受け取る',
    en: 'Exporting `search` from a page to receive the query',
  }),
  message({
    ja: '前もって並べられない値のページを、サーバーで描く（利用者が作る記事のIDなど）',
    en: 'Rendering pages on the server for values that cannot be listed ahead of time, such as the IDs of posts users create',
  }),
  message({
    ja: '`route.ts`で`GET`以外のメソッドに応答する',
    en: 'Responding to a method other than `GET` from a `route.ts`',
  }),
] as const;

export const chooseStatic = message({
  ja: "どれにも当てはまらないなら、`mode: 'static'`を選びます。ページをビルドの時点で描画しておくので、サーバーなしで静的ホスティングに置けます。記事が増えるなど中身が変わったときは、ビルドし直します。ドキュメントやブログのように、訪問者によって中身が変わらないサイトに向いています。",
  en: "If none of them applies, pick `mode: 'static'`. Pages are rendered at build time, so the site goes on a static host with no server. When the content changes, such as a new post, you build again. It suits a site whose content is the same for every visitor, such as documentation or a blog.",
});

export const chooseFallback = message({
  ja: 'staticモードでも、前もって並べられない値に答えることはできます。`page.tsx`の横に`fallback.tsx`を置くと、ビルドしていない値の本文をブラウザで描きます。最初のHTMLに本文が要らないページなら、staticモードのままで足ります。書き方は',
  en: 'Static mode can still answer values that cannot be listed ahead of time. With a `fallback.tsx` beside a `page.tsx`, a value the build did not write has its body rendered in the browser. A page that does not need its body in the first HTML can stay in static mode. How to write one is covered in ',
});

export const chooseStart = message({
  ja: "迷ったら`mode: 'static'`から始めます。あとでリクエストが要るものを書くと、ビルドか型チェックがエラーにします。",
  en: "When in doubt, start with `mode: 'static'`. Anything you write later that needs the request fails the build or the type check.",
});

export const differencesTitle = message({
  ja: 'モードの違い',
  en: 'Mode differences',
});

export const differencesList = [
  message({
    ja: 'ビルドの出力：staticモードでは`dist/client/`のファイルで、serverモードではリクエストハンドラです。',
    en: 'Build output: files in `dist/client/` in static mode, a request handler in server mode.',
  }),
  message({
    ja: 'パラメータのあるルート：staticモードでは値を`paths`で並べます。並べなかった値には、`fallback.tsx`を置けばブラウザで描くシェルが答えます。serverモードではリクエストと一緒に受け取るので、値が増えてもビルドし直しません。',
    en: 'A route with parameters: in static mode its values are listed in `paths`, and a `fallback.tsx` answers the rest with a shell rendered in the browser. In server mode they arrive with the request, so new values need no rebuild.',
  }),
  message({
    ja: 'どのルートにも当たらないURL：staticモードではホスティングが`404.html`を返し、serverモードではアプリが404のステータスで返します。',
    en: 'A URL no route matches: in static mode the host serves `404.html`, in server mode the application responds with a 404 status.',
  }),
  message({
    ja: '`redirect.ts`：staticモードでは行き先へ送るページとして書き出し、serverモードでは`307`か`308`を返します。',
    en: '`redirect.ts`: in static mode it is written as a page that sends the visitor on, in server mode it responds with `307` or `308`.',
  }),
  message({
    ja: '`route.ts`：staticモードでは`GET`の応答をファイルに書き、serverモードではexportしたメソッドすべてに応答します。',
    en: '`route.ts`: in static mode the response of its `GET` is written as a file, in server mode it responds to every method it exports.',
  }),
  message({
    ja: 'Content-Security-Policy：staticモードでは`csp`オプションで`<meta>`に書きます。serverモードでは`guard.ts`でヘッダーに書きます。',
    en: 'Content-Security-Policy: in static mode the `csp` option writes it into a `<meta>`, in server mode a `guard.ts` writes it as a header.',
  }),
  message({
    ja: 'ページの`request`：staticモードでは型に無く、読むと型エラーになります。型チェックを通さずに読んでも、ビルドがエラーになります。serverモードではヘッダーとCookieを読めます。',
    en: 'A page’s `request`: not in the types in static mode, and reading it is a type error. Read without a type check, it fails the build. In server mode it holds the headers and cookies.',
  }),
] as const;

export const switchTitle = message({
  ja: '切り替え方',
  en: 'Switching',
});

export const switchMode = message({
  ja: '`src/routes/`のファイルと`@k8ordo/framework`からのimportは、どちらのモードでもそのまま使えます。`fallback.tsx`もserverモードでは使われないだけなので、消す必要はありません。',
  en: 'The files under `src/routes/` and the imports from `@k8ordo/framework` work as they are in either mode. A `fallback.tsx` is simply unused under server mode, so there is no need to remove it.',
});

export const switchOptions = message({
  ja: "`paths`と`site`、`csp`は、staticモードだけのオプションです。`mode: 'server'`と一緒に書くと型エラーになり、設定を読み込んだ時点でもエラーになります。serverモードへ移るときは外します。",
  en: "`paths`, `site` and `csp` are options of static mode only. Written beside `mode: 'server'` they are a type error, and `framework()` fails when the config loads, so drop them when moving to server mode.",
});

export const switchToStatic = message({
  ja: 'staticモードへ移るときは、パラメータのあるルートの値を`paths`で並べるか、`fallback.tsx`を置きます。下の拒まれる書き方と、ページの`request`を読むコードも消します。',
  en: 'When moving to static mode, list the values of each route with parameters in `paths`, or give the page a `fallback.tsx`. Remove the refused code below too, and any read of a page’s `request`.',
});

export const switchDeploy = message({
  ja: 'serverモードのビルドの動かし方は',
  en: 'Running a server mode build is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const refusedTitle = message({
  ja: '拒まれる書き方',
  en: 'Refused code',
});

export const refusedLead = message({
  ja: "staticモードのビルドは、リクエストに応答する次のコードをエラーにします。見つけたファイルは、種類ごとにまとめて挙げます。`guard.ts`と`search`、`route.ts`のメソッドは、コンパイルの前に調べます。`@k8ordo/framework/server`のimportと`'use server'`は、コンパイルの後に調べます。前の段階のエラーを直すと、次のビルドで後の段階のエラーが出ることがあります。",
  en: "A static mode build fails on the following code, which responds to a request. It lists the files it finds, one list per kind. A `guard.ts`, `search` and a `route.ts`'s methods are checked before compiling; imports of `@k8ordo/framework/server` and `'use server'` after it. Fixing the first can reveal the second on the next build.",
});

export const refusedList = [
  message({
    ja: '`@k8ordo/framework/server`から値をimportするモジュール',
    en: 'A module importing a value from `@k8ordo/framework/server`',
  }),
  message({
    ja: "`'use server'`のモジュール",
    en: "A `'use server'` module",
  }),
  message({
    ja: '`guard.ts`',
    en: 'A `guard.ts`',
  }),
  message({
    ja: '`search`をexportするページ',
    en: 'A page exporting `search`',
  }),
  message({
    ja: '`GET`以外のメソッドをexportする`route.ts`',
    en: 'A `route.ts` exporting a method other than `GET`',
  }),
] as const;

export const refusedWants = message({
  ja: "どのエラーも`this application wants mode: 'server'`の行で終わります。`vite dev`も、そのモジュールをコンパイルした時点で同じエラーにします。",
  en: "Each error ends with the line `this application wants mode: 'server'`. `vite dev` reports the same error the moment it compiles the module.",
});

export const refusedTypes = message({
  ja: '`import type`はビルドの前に消えるので、エラーになりません。`RedirectTarget`のような型は、staticモードでも`@k8ordo/framework/server`から読めます。`import { type RedirectTarget }`と書くとエラーになります。`verbatimModuleSyntax`の設定では、モジュールを読み込むimportとして残るためです。',
  en: '`import type` is erased before the build sees it, so it passes. A type such as `RedirectTarget` can be imported from `@k8ordo/framework/server` in static mode too. `import { type RedirectTarget }` is refused, though: under `verbatimModuleSyntax` it stays behind as an import of the module.',
});

export const refusedBeyond = message({
  ja: 'ビルドが調べるのはアプリのモジュールだけです。`node_modules`の依存が`@k8ordo/framework/server`をimportしていても名前は挙がらず、`cookies()`などを呼んだ時点でエラーになります。`export *`で別のモジュールをexportする`route.ts`とページも、exportの名前を読めないのでエラーになります。',
  en: 'The build checks only the application’s own modules. A dependency in `node_modules` that imports `@k8ordo/framework/server` is not named; calling `cookies()` or the like from it fails instead. A `route.ts` or page that re-exports another module with `export *` fails too, since the build cannot read the names it exports.',
});

// 2つの文を1つの段落に並べるときの区切り。英語だけ空白が要る。
export const sentenceGap = message({
  ja: '',
  en: ' ',
});
