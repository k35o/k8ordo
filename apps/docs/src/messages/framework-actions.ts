import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'serverモードだけで使えます。フォームの送信をServer Actionでサーバーに渡して処理し、必要なら`redirect()`で別のページへ移します。',
  en: 'Server mode only. Hand a form submission to a Server Action to handle it on the server and, if needed, move to another page with `redirect()`.',
});

export const declareTitle = message({
  ja: 'アクションの定義',
  en: 'Defining an action',
});

export const declareModule = message({
  ja: "先頭に`'use server'`を書いたモジュールのexportは、すべてServer Actionになります。どれも`async`関数にします。",
  en: "Every export of a module that starts with `'use server'` is a Server Action. Each one is an `async` function.",
});

export const declareState = message({
  ja: '`useActionState`に渡すアクションは、前回の結果と`FormData`を受け取り、次の結果を返します。',
  en: 'An action passed to `useActionState` receives the previous result and the `FormData`, and returns the next result.',
});

export const declareForm = message({
  ja: 'Client Componentでは、アクションを`useActionState`に渡します。返ってくる`formAction`をフォームの`action`に渡すと、送信でアクションが呼ばれます。`pending`は送信の途中だけ`true`になります。',
  en: 'A Client Component hands the action to `useActionState`. Pass the `formAction` it returns to the form’s `action`, and submitting calls the action. `pending` is `true` only while a submission is under way.',
});

export const roundTripTitle = message({
  ja: '呼び出しの往復',
  en: 'Round trip',
});

export const roundTripRender = message({
  ja: 'アクションを呼ぶと、サーバーは今のページを描き直し、アクションの戻り値と一緒に返します。呼び出した側が戻り値を受け取った時点で、画面も新しくなっています。往復は1回です。',
  en: 'Calling an action has the server render the current page again and send it back with the return value. By the time the caller has the value, the screen is up to date. That is a single round trip.',
});

export const noJsTitle = message({
  ja: '読み込み前の送信',
  en: 'Before JavaScript loads',
});

export const noJsPost = message({
  ja: 'Reactは、どのアクションを呼ぶかを示す隠し入力欄をHTMLに描きます。JavaScriptの読み込み前に送信すると、普通のフォームの送信になります。サーバーはアクションを実行し、同じページを描き直したHTMLを返します。',
  en: 'React renders hidden fields that identify the action into the HTML. A form submitted before JavaScript loads posts as an ordinary form. The server runs the action and returns the same page, rendered again.',
});

export const noJsSame = message({
  ja: '`useActionState`は、この送信のあとの描画でもアクションの結果を返します。同じコンポーネントが、JavaScriptの読み込み前と後のどちらでも動きます。',
  en: '`useActionState` returns the action’s result in the render after that submission too. The same component works before and after JavaScript loads.',
});

export const directivesTitle = message({
  ja: "`'use server'`と`server-only`",
  en: "`'use server'` and `server-only`",
});

export const directivesRoles = message({
  ja: "`'use server'`は、ブラウザから呼んでよい関数に付けます。`server-only`は、ブラウザに渡してはいけないモジュールに付けます。アクションのモジュールに要るのは`'use server'`だけです。",
  en: "`'use server'` goes on a function the browser may call. `server-only` goes on a module the browser must never receive. An actions module needs only `'use server'`.",
});

export const directivesWhere = message({
  ja: '秘密の値やデータベースのクライアントは`*.server.ts`に置き、アクションからimportします。ブラウザが受け取るのはアクションの参照だけなので、アクションから`*.server.ts`をimportしても`server-only`のエラーになりません。',
  en: 'Keep secrets and database clients in a `*.server.ts` and import it from the action. The browser receives only a reference to the action, so importing a `*.server.ts` from it does not trip `server-only`.',
});

export const directivesName = message({
  ja: 'アクションのモジュールはブラウザからimportされるので、`*.server.ts`とは名付けません。`server-only`の詳しい使い方は',
  en: 'An actions module is imported from the browser, so it is not named `*.server.ts`. For more on `server-only`, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const redirectTitle = message({
  ja: '`redirect()`による遷移',
  en: 'Redirecting with `redirect()`',
});

export const redirectHrefCallout = message({
  ja: '`href()`で作ると、Viteの`base`の下で配信するときも`base`が付く',
  en: 'Built with `href()`, so it carries Vite’s `base` when the app is served under one',
});

export const redirectEnd = message({
  ja: '送信のあとに別のページへ移すときは、`@k8ordo/framework/server`の`redirect()`でアクションを終えます。Server Componentが`<form action>`にアクションを直接渡せば、Client Componentは要りません。',
  en: 'To move to another page once the submission is done, end the action with `redirect()` from `@k8ordo/framework/server`. A Server Component can hand the action straight to `<form action>`, with no Client Component.',
});

export const redirectThrow = message({
  ja: '`redirect()`は値を返さず、例外でアクションを終えます。その後の行は実行されません。`try`の中で呼ぶと`catch`が受け取ってしまうので、`try`の外で呼んでください。',
  en: '`redirect()` does not return; it leaves the action as an exception, and the lines after it never run. Inside a `try`, the `catch` would receive it, so call it outside.',
});

export const redirectAnswer = message({
  ja: 'JavaScriptの読み込み前に送られたフォームには、サーバーが`303`と`Location`ヘッダーを返します。ブラウザは行き先をGETで読み込みます。クライアントのランタイムからの呼び出しには行き先を含むペイロードを返し、ルーターがそこへ遷移します。',
  en: 'A form submitted before JavaScript loaded is answered with a `303` and a `Location` header, and the browser loads the target with a GET. A call from the client runtime gets a payload that carries the target, and the router navigates there.',
});

export const redirectPages = message({
  ja: '`redirect()`は渡したURLに`base`を付けません。ページの描画中にリダイレクトするAPIはなく、ページのURLを変えたときは`redirect.ts`を置きます。書き方は',
  en: '`redirect()` does not add `base` to the URL it is given. There is no API for redirecting while a page renders; when a page’s URL changes, add a `redirect.ts`; see ',
});

export const contextTitle = message({
  ja: 'アクションのリクエスト',
  en: 'Action requests',
});

export const contextPage = message({
  ja: 'アクションの呼び出しは、画面に出ているページのURLへ送られます。そのリクエストでも、ページとその上のレイアウトの`paramsSchema`が実行されます。',
  en: 'An action call is posted to the URL of the page on screen. The `paramsSchema`s along the page’s stack (its layouts’ and its own) run for that request too.',
});

export const contextLocale = message({
  ja: 'たとえば`/ja/talks/new`から送られたアクションでは、`@k8ordo/i18n`のロケールが`ja`になります。`@k8ordo/form`の`parseForm`が作るzodのエラーも、ページと同じ言語になります。',
  en: 'An action posted from `/ja/talks/new` runs with `@k8ordo/i18n`’s locale set to `ja`. The zod errors that `parseForm` from `@k8ordo/form` produces are in the page’s language too.',
});

export const contextApi = message({
  ja: 'アクションの中では、`guard.ts`と同じく`cookies()`、`responseHeaders()`と`requestHeaders()`が使えます。使い方は',
  en: 'As in a `guard.ts`, `cookies()`, `responseHeaders()` and `requestHeaders()` work inside an action. See ',
});

export const originTitle = message({
  ja: '別のサイトからの送信',
  en: 'Posts from another site',
});

export const originCheck = message({
  ja: 'Server Actionは、`POST`を送れる場所ならどこからでも呼べます。そのためサーバーは、ページのURLへ送られた`POST`の`Origin`ヘッダーを確かめます。`route.ts`への`POST`は確かめません。`Origin`のホストがリクエスト先のホストと一致しない`POST`と、`Origin`の無い`POST`は、アクションを実行する前に`403`を返します。',
  en: 'A Server Action can be called from anywhere that can send a `POST`. So a `POST` to a page’s URL is accepted only when the host in its `Origin` header matches the host it was sent to (a `route.ts` is not checked). A `POST` with another host, or with no `Origin`, gets a `403` before any action runs.',
});

export const originProxy = message({
  ja: 'プロキシの後ろで動かすときの注意は',
  en: 'For running behind a proxy, see ',
});

export const formTitle = message({
  ja: '`@k8ordo/form`との組み合わせ',
  en: 'With `@k8ordo/form`',
});

export const formParse = message({
  ja: '`@k8ordo/form`を使うと、入力欄の制約とエラーの文言、サーバーでの検証を1つのzodのスキーマから作れます。アクションでは`parseForm`で検証し、通らなかったときは`parsed.state`を返します。',
  en: 'With `@k8ordo/form`, the fields’ constraints, the error messages and the server-side validation all come from one zod schema. The action validates with `parseForm` and returns `parsed.state` when validation fails.',
});

export const formMore = message({
  ja: 'フォームの側の書き方は',
  en: 'The form side is covered in ',
});
