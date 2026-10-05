import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Server Actionは、ブラウザから呼べてサーバーで動く関数です。フォームの送信先にすると、JavaScriptが届く前でも送れるフォームになります。このページでは、アクションの書き方と、`redirect()`での終え方、アクションが動く文脈を説明します。',
  en: 'A Server Action is a function the browser can call and the server runs. Make it a form’s target, and the form works even before JavaScript arrives. This page covers writing one, ending it with `redirect()`, and the context it runs in.',
});

export const declareTitle = message({
  ja: 'Server Actionを書く',
  en: 'Write a Server Action',
});

export const declareDescription = message({
  ja: "先頭に`'use server'`を書いたモジュールのexportは、すべてServer Actionになります。どれも`async`の関数にします。",
  en: "Every export of a module that starts with `'use server'` is a Server Action, and each must be an `async` function.",
});

export const declareState = message({
  ja: 'アクションは、前回の結果と`FormData`を受け取り、次の結果を返します。',
  en: 'The action receives the previous result and the `FormData`, and returns the next result.',
});

export const declareForm = message({
  ja: 'クライアントコンポーネントは、アクションを`useActionState`に渡します。返ってくる`formAction`をフォームの`action`に渡すと、送信でそのアクションが呼ばれます。`pending`は、送信の途中かどうかです。',
  en: 'A client component hands the action to `useActionState`. Pass the `formAction` it returns to the form’s `action`, and submitting calls the action; `pending` says whether a submission is under way.',
});

export const roundTripTitle = message({
  ja: '1往復で画面まで新しくなる',
  en: 'One round trip, screen included',
});

export const roundTripDescription = message({
  ja: 'アクションを呼ぶと、サーバーは今のページを描き直し、アクションの戻り値と一緒に返します。呼び出した側が戻り値を受け取った時点で、画面も新しくなっています。往復は2回ではなく1回です。',
  en: 'Calling an action has the server render the current page again and send it back with the action’s return value. By the time the caller has the value, the screen is up to date: one round trip, not two.',
});

export const noJsTitle = message({
  ja: 'JavaScriptが届く前でも送れる',
  en: 'It posts before JavaScript arrives',
});

export const noJsDescription = message({
  ja: 'Reactは、どのアクションを呼ぶかを示すフィールドをHTMLに描きます。JavaScriptが届く前に送信すると普通のフォームの送信になり、サーバーはアクションを動かして、同じページを描き直したHTMLで答えます。',
  en: 'React renders the fields that name the action into the HTML. Submitted before JavaScript arrives, the form posts as an ordinary form, and the server runs the action and answers with the same page, rendered again.',
});

export const noJsSame = message({
  ja: '`useActionState`の結果は、この往復の後にも残ります。そのため同じコンポーネントが、JavaScriptがあるかどうかを知らないまま、どちらでも動きます。',
  en: '`useActionState`’s result survives that trip, so the same component works either way without knowing which.',
});

export const directivesTitle = message({
  ja: "`'use server'`と`server-only`の違い",
  en: "`'use server'` is not `server-only`",
});

export const directivesDescription = message({
  ja: "`'use server'`は、ブラウザから呼んでよい関数に付ける印です。`server-only`は、ブラウザに届いてはいけないモジュールに付ける印です。アクションのモジュールに要るのは、前者だけです。",
  en: "`'use server'` marks a function the browser may call; `server-only` marks a module the browser must never reach. An actions module wants the first one only.",
});

export const directivesWhere = message({
  ja: '秘密の値やデータベースのクライアントは`*.server.ts`に置き、アクションからimportします。ブラウザが受け取るのはアクションの参照だけなので、2つの印がぶつかることはありません。',
  en: 'Keep secrets and database clients in a `*.server.ts`, and import that from the action. The browser only ever receives a reference to the action, so the two marks never collide.',
});

export const directivesName = message({
  ja: 'アクションのモジュール自体は、`*.server.ts`と名付けません。ブラウザからimportされることが、このモジュールの役目だからです。',
  en: 'An actions module itself is not named `*.server.ts`: being imported by the browser side is what it is for.',
});

export const redirectTitle = message({
  ja: '`redirect()`で別のページへ送る',
  en: 'Send the visitor on with `redirect()`',
});

export const redirectDescription = message({
  ja: '送信が済んだら別のページへ移したいときは、`@k8ordo/server/runtime`の`redirect()`でアクションを終えます。Server Componentが`<form action>`にアクションを直接渡せば、クライアントコンポーネントは要りません。',
  en: 'To move on to another page once the submission is done, end the action with `redirect()` from `@k8ordo/server/runtime`. A Server Component that hands the action straight to `<form action>` needs no client component.',
});

export const redirectThrow = message({
  ja: '`redirect()`は値を返さずに例外を投げるので、その後の行は走りません。`try`の中で呼ぶと`catch`が受け取ってしまうので、`try`の外で呼んでください。',
  en: '`redirect()` throws rather than returning, so the lines after it never run. Called inside a `try`, the `catch` receives it, so call it outside.',
});

export const redirectAnswer = message({
  ja: 'JavaScriptが届く前に送られたフォームには、`303`と`location`で答え、ブラウザが行き先をGETで読み込みます。クライアントのランタイムからの呼び出しには、行き先へ移るよう伝えるペイロードで答え、ルーターがそこへ遷移します。',
  en: 'A form posted before JavaScript arrived is answered with a `303` and `location`, and the browser loads the target with a GET. A call from the client runtime is answered with a payload telling the router where to go.',
});

export const redirectHref = message({
  ja: '`redirect()`に渡すのはURLで、書いたまま送られます。`href()`で作れば、Viteの`base`の下で配信するときも`base`が付きます。',
  en: 'What `redirect()` takes is a URL, sent as written. Build it with `href()`, and it carries Vite’s `base` when the application is served under one.',
});

export const redirectPages = message({
  ja: 'ページを描いている途中で訪問者を別の場所へ送るAPIはありません。移転したURLには`redirect.ts`を置き、リクエストの内容で送り先を変えたいときは`guard.ts`から`Response`を返します。',
  en: 'There is no API for sending the visitor elsewhere while a page renders. A URL that moved gets a `redirect.ts`; to decide by the request, return a `Response` from a `guard.ts`.',
});

export const contextTitle = message({
  ja: 'アクションが動く文脈',
  en: 'The context an action runs in',
});

export const contextDescription = message({
  ja: 'アクションの呼び出しは、画面に出ているページのURLへ送られます。そのリクエストでもページの`paramsSchema`が走るので、アクションはそのページと同じ文脈で動きます。',
  en: 'An action call is posted to the URL of the page on screen. The page’s `paramsSchema` runs for that request too, so the action runs in the same context as the page.',
});

export const contextLocale = message({
  ja: 'たとえば`/ja/talks/new`から送られたアクションは、`@k8ordo/i18n`のロケールが`ja`の中で動きます。`@k8ordo/form`の`parseForm`が作るzodのエラーも、そのページの言語になります。',
  en: 'An action posted from `/ja/talks/new` runs with `@k8ordo/i18n`’s locale set to `ja`, so the zod errors `@k8ordo/form`’s `parseForm` produces are in the page’s language.',
});

export const contextApi = message({
  ja: 'アクションは`guard.ts`と同じく、リクエストに答える側にいます。そのため`cookies()`と`responseHeaders()`、`requestHeaders()`が使えます。使い方は次のページで説明しています。',
  en: 'An action answers the request as much as a `guard.ts` does, so `cookies()`, `responseHeaders()` and `requestHeaders()` work inside it. They are covered here:',
});

export const originTitle = message({
  ja: '別のサイトからの送信は拒まれる',
  en: 'A post from another site is refused',
});

export const originDescription = message({
  ja: 'Server Actionは、POSTを送れる場所ならどこからでも呼べる関数です。別のサイトのフォームが、訪問者のCookieを付けたまま送ってくることもあります。',
  en: 'A Server Action can be called from anywhere that can send a POST, including another site’s form, which the browser sends with your visitor’s cookies.',
});

export const originCheck = message({
  ja: 'そこでハンドラは、`POST`の`Origin`ヘッダーのホストが、答えているURLのホストと一致するときだけ受け付けます。一致しない`POST`と`Origin`の無い`POST`には、アクションを動かす前に`403`で答えます。',
  en: 'So the handler accepts a `POST` only when its `Origin` header names the host of the URL it is answering. Any other `POST`, or one with no `Origin`, gets a `403` before any action runs.',
});

export const originProxy = message({
  ja: 'プロキシの後ろで動かすときに気をつけることは、次のページで説明しています。',
  en: 'What that means behind a proxy is covered here:',
});

export const formTitle = message({
  ja: '`@k8ordo/form`と組み合わせる',
  en: 'Use it with `@k8ordo/form`',
});

export const formDescription = message({
  ja: '`@k8ordo/form`を使うと、入力欄の制約とエラーの文言、サーバーでの検証を、1つのzodのスキーマから作れます。アクションでは`parseForm`で検証し、通らなかったときはその`state`を返します。',
  en: 'With `@k8ordo/form`, the fields’ constraints, the error messages and the server-side validation all come from one zod schema. The action validates with `parseForm`, and returns its `state` when that fails.',
});

export const formMore = message({
  ja: 'フォームの側の書き方は、`@k8ordo/form`のガイドで説明しています。',
  en: 'The form side is covered in `@k8ordo/form`’s guide:',
});
