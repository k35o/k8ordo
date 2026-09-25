import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Server Action は、クライアントから呼べてサーバーで動く関数で、このモードにはその届き先があります。このページは、アクションの書き方、JavaScript が無くても動くフォーム、`redirect()` での終え方、アクションからの Cookie の読み書き、ページがリクエストを読む方法を説明します。',
  en: 'A Server Action is a function the client can call that runs on the server, and this mode has somewhere for it to arrive. This page covers writing one, forms that work without JavaScript, ending an action with `redirect()`, reading and writing cookies from an action, and how a page reads the request.',
});

export const declareTitle = message({
  ja: "`'use server'` で宣言する",
  en: "Declaring one with `'use server'`",
});

export const declareDescription = message({
  ja: "先頭に `'use server'` を書いたモジュールの export は、すべて Server Action になり、どれも `async` でなければなりません。クライアントコンポーネントはそれを import して呼べ、呼び出しはサーバーで動きます。",
  en: "Every export of a module that begins with `'use server'` is a Server Action, and each must be `async`. A client component imports it and calls it; the call runs on the server.",
});

export const declareForm = message({
  ja: '`useActionState` にアクションを渡すと、フォームの `action` と、前回の結果と、送信中かどうかが返ります。アクションは前回の状態と `FormData` を受け取り、次の状態を返します。',
  en: "`useActionState` takes the action and gives back the form's `action`, the previous result, and whether a submission is pending. The action receives the previous state and the `FormData`, and returns the next state.",
});

export const roundTripTitle = message({
  ja: '1 往復で画面まで新しくなる',
  en: 'One round trip, screen included',
});

export const roundTripDescription = message({
  ja: 'アクションを呼ぶと、サーバーは現在のページを描き直し、戻り値と一緒に返します。呼び出し側が値を受け取った時点で、画面もすでに新しくなっています。往復は 2 回ではなく 1 回です。',
  en: 'Calling an action re-renders the current page on the server and sends it back together with the return value, so the screen is up to date by the time the caller has its value — one round trip, not two.',
});

export const noJsTitle = message({
  ja: 'JavaScript が読み込まれる前から動くフォーム',
  en: 'Forms that work before JavaScript loads',
});

export const noJsDescription = message({
  ja: 'React はアクションを識別するフィールドを HTML に描きます。それを送るのは普通のフォーム送信で、サーバーはアクションを実行し、同じページを描き直した HTML で答えます。`useActionState` の結果はこの往復の後にも残るので、同じコンポーネントが JavaScript の有無を知らないまま、どちらでも動きます。',
  en: "React renders the fields that identify the action into the HTML. Posting them is an ordinary form submission: the server runs the action and answers with the same page's HTML, re-rendered. `useActionState`'s result survives that trip, so the same component works with JavaScript and without it, never knowing which.",
});

export const directivesTitle = message({
  ja: "`'use server'` と `server-only` は別のことを言う",
  en: "`'use server'` and `server-only` say different things",
});

export const directivesDescription = message({
  ja: "`'use server'` はクライアントが呼んでよい関数、つまりサーバーで動く関数を印付けます。`server-only` はクライアントが決して届いてはいけないモジュールを印付けます。アクションのモジュールに要るのは前者だけです。秘密やデータベースのクライアントは `*.server.ts` に置き、アクションからそれを import します。上の `createTalk` がその形です。",
  en: "`'use server'` marks a function the client may call, which runs on the server; `server-only` marks a module the client may never reach. An actions module wants the first only. Keep secrets and database clients in a `*.server.ts` and import that from the action, as `createTalk` above does.",
});

export const directivesName = message({
  ja: 'アクションのモジュールを `*.server.ts` と名付けないのも同じ理由です。クライアントから import されることが、このファイルの目的だからです。',
  en: 'For the same reason an actions module is not named `*.server.ts`: being imported by the client is its purpose.',
});

export const redirectTitle = message({
  ja: '`redirect()` で終える',
  en: 'Ending with `redirect()`',
});

export const redirectDescription = message({
  ja: '`@k8ordo/server/runtime` の `redirect(to)` は、訪問者を別の場所へ送ってアクションを終えます。値を返すのではなく throw するので、その後の行は走りません。`to` は URL で、渡したまま送られます。`href()` で作れば、アプリを Vite の `base` の下に置いたときも、それが付きます。Server Component が `<form action>` にアクションを直接渡す形なら、クライアントコンポーネントは 1 つも要りません。',
  en: '`redirect(to)` from `@k8ordo/server/runtime` ends an action by sending the visitor elsewhere. It throws rather than returning, so the lines after it never run. `to` is a URL, sent as given: build it with `href()`, which also carries Vite’s `base` when the application is served under one. A Server Component handing the action straight to `<form action>` needs no client component at all.',
});

export const redirectAnswers = message({
  ja: 'JavaScript なしで送られたフォームには `303` と `location` で答え、ブラウザは行き先を GET で読み込みます。クライアントのランタイムからの呼び出しには、行き先へ移動するよう伝えるペイロードで答え、ルーターがそこへ遷移します。リダイレクトしたアクションは、ページを描きません。',
  en: 'A form posted without JavaScript is answered with a `303` and `location`, and the browser loads the target with a GET. A call from the client runtime is answered with a payload telling the router to navigate there. An action that redirected renders no page.',
});

export const redirectCatch = message({
  ja: '`redirect()` は throw で終わるので、`try` の中で呼ぶと `catch` がそれを受け取ってしまいます。`try` の外で呼びます。',
  en: 'Because `redirect()` ends by throwing, calling it inside a `try` hands it to the `catch`. Call it outside the `try`.',
});

export const redirectPages = message({
  ja: 'ページの描画中に訪問者を別の場所へ送る API はありません。`redirect()` が効くのは Server Action の中だけで、描画中に呼ぶとただのエラーとして throw され、`error.tsx` か `500` になります。移転した URL には `redirect.ts` を置きます。',
  en: 'There is no API for sending the visitor elsewhere while a page renders: `redirect()` only works inside a Server Action, and called during a render it is thrown as an ordinary error — `error.tsx`, or a `500`. A URL that moved gets a `redirect.ts`.',
});

export const requestTitle = message({
  ja: 'リクエストを読む',
  en: 'Reading the request',
});

export const requestDescription = message({
  ja: 'ページとレイアウト（と `not-found.tsx`）は、`params` と `pathname` の横で `request` を受け取ります。中身はヘッダーと、名前ごとにパースされた cookie です。',
  en: 'A page and a layout — and a `not-found.tsx` — receive `request` beside `params` and `pathname`: the headers, and the cookies parsed by name.',
});

export const requestTable = {
  field: message({ ja: 'フィールド', en: 'Field' }),
  type: message({ ja: '型', en: 'Type' }),
  holds: message({ ja: '中身', en: 'What it holds' }),
  headers: message({
    ja: 'リクエストのヘッダー',
    en: "The request's headers",
  }),
  cookies: message({
    ja: '`Cookie` ヘッダーを名前ごとにパースしたもの。同じ名前が 2 度あれば最初のものを取り、値を囲む引用符を外して URL デコードします（デコードできなければ送られたまま）。',
    en: 'The `Cookie` header parsed by name. The first of a repeated name wins, surrounding quotes are removed, and the value is URL-decoded — or left as sent when it cannot be.',
  }),
};

export const requestType = message({
  ja: '`PageProps` と `LayoutProps` が `request` を持つのは、生成された `.k8ordo/register.gen.ts` が、このモードにはリクエストがあると言っているからです。`@k8ordo/server/runtime` の `RouteRequest` はその型で、下のコンポーネントに prop として渡すときに使います。クライアントコンポーネントには丸ごと渡さず、要る値だけを取り出して渡します。`Headers` は境界を越えられません。',
  en: '`PageProps` and `LayoutProps` carry `request` because the generated `.k8ordo/register.gen.ts` says this mode has one. `RouteRequest` from `@k8ordo/server/runtime` is its type, for a component further down that takes it as a prop. Do not hand it whole to a client component; pass the values it needs — `Headers` does not cross the boundary.',
});

export const requestReadOnly = message({
  ja: 'ページには応答を書く手段がありません。ステータスも `Set-Cookie` も書けません。ページは描画であり、リクエストに答える描画は 2 つ目のハンドラになってしまうからです。応答にページ以外の何を付けるかは、ページより前に `guard.ts` が決めます。',
  en: 'Nothing lets a page write to the response — no status, no `Set-Cookie` — because a page is a render, and a render that answered the request would be a second handler. What the answer carries beyond the page is decided before it, in a `guard.ts`.',
});

export const requestStatic = message({
  ja: 'このフィールドはこのモードにしかありません。`@k8ordo/static` の下では生成される `Page` と `Layout` の型に `request` が無いので、それを読むページは型チェックで落ちます。search も含まれません。search は `@k8ordo/state` のもので、ブラウザで読みます。',
  en: "The field exists only in this mode: under `@k8ordo/static` the generated `Page` and `Layout` types do not carry it, so a page that reads it fails to type-check. The search is not here either — it is `@k8ordo/state`'s, read in the browser.",
});

export const originTitle = message({
  ja: '別オリジンからの POST は拒まれる',
  en: 'A POST from another origin is refused',
});

export const originDescription = message({
  ja: 'Server Action は、POST できる場所ならどこからでも名前で呼べてしまう関数です。訪問者の cookie を付けたまま、別のサイトのフォームから送られることもあります。ハンドラは POST の `Origin` ヘッダーのホストが、答えている URL のホストと一致するときだけ受け付け、それ以外には `403` で答えます。この検査はアクションに限らずすべての POST に掛かるので、`Origin` を付けない `curl` や Webhook の POST も `403` になります。',
  en: "A Server Action is reachable by name from anywhere that can make a POST — including another site's form, which the browser sends with your visitor's cookies. The handler accepts a POST only when its `Origin` header's host matches the host of the URL it is answering, and answers anything else with a `403`. The check applies to every POST the handler receives, so a `curl` or webhook POST without an `Origin` header is refused as well.",
});

export const originProxy = message({
  ja: 'プロキシの後ろで動かすときの注意は、リンク先にあります。',
  en: 'Running behind a proxy is covered here.',
});

export const formTitle = message({
  ja: '`@k8ordo/form` と組む',
  en: 'With `@k8ordo/form`',
});

export const formDescription = message({
  ja: '`@k8ordo/form` は、フォームの制約属性・メッセージ・サーバー側の検証を 1 つの zod スキーマから導きます。次は `examples/server-basic` のゲストブックで、JavaScript なしで送っても、フィールドごとのエラーと入力した値を持って戻ってきます。',
  en: "`@k8ordo/form` derives a form's constraint attributes, its messages and its server-side validation from one zod schema. This is the guestbook from `examples/server-basic`: posted without JavaScript, it still comes back with per-field errors and the values entered.",
});

export const formFieldsNote = message({
  ja: 'スキーマから属性と文言を導くのは Server Component の側で、結果は素の JSON として props でクライアントに渡ります。zod はブラウザに届きません。',
  en: 'The Server Component derives the attributes and messages from the schema and hands the result to the client as plain JSON props, so zod never reaches the browser.',
});

export const buysTitle = message({
  ja: '動かすことで得られるもの',
  en: 'What running buys over static',
});

export const buysDescription = message({
  ja: 'このモードが `@k8ordo/static` に対して持つのは次のものです。どれも要らなければ、`@k8ordo/static` が同じアプリをファイルに書き出します。文法も境界もハンドラも同じで、ハンドラがビルド時にルートごとに呼ばれるだけです。',
  en: 'This is what the mode has over `@k8ordo/static`. If none of it is needed, `@k8ordo/static` renders the same application into files — the same grammar, the same boundaries, the same handler, called for each route at build time.',
});

export const buys404 = message({
  ja: '知らない URL への、ホスティングの答えではなくアプリ自身の本物の 404',
  en: 'A real 404 from the application for an unknown URL, rather than whatever the host says',
});

export const buysValues = message({
  ja: '値の一覧が要らないパラメータ付きルート。カタログが変わっても再ビルドは要りません',
  en: 'Parameterised routes with no list of values, so a changing catalogue needs no rebuild',
});

export const buysActions = message({
  ja: 'フォームが送れる Server Action と、そこからの `redirect()`',
  en: 'Server Actions a form can post to, and `redirect()` from them',
});

export const buysRequest = message({
  ja: 'ページから読めるリクエストのヘッダーと cookie、描く前にリクエストを通すかどうかを決める `guard.ts`',
  en: "The request's headers and cookies, readable from a page, and a `guard.ts` deciding whether a request gets through before anything renders",
});

export const contextTitle = message({
  ja: 'アクションはリクエストに答える',
  en: 'An action answers the request',
});

export const contextDescription = message({
  ja: 'アクションは guard と同じくリクエストに答える側にいるので、同じ API を持ちます。`cookies()` で Cookie を読み書きし、`responseHeaders()` で答えに添え、`requestHeaders()` でリクエストが運んできたヘッダーを読みます。アクションに渡るのは引数で、リクエストではないからです。',
  en: 'An action answers the request as much as a guard does, so it has the same API: `cookies()` to read and write the cookies, `responseHeaders()` to add to the answer, and `requestHeaders()` for the headers the request arrived with — an action is handed its arguments, not the request.',
});

export const contextAnswer = message({
  ja: 'アクションが書いたものは、その答えに載ります。描き直したページでも、`redirect()` の `303` でも、クライアントランタイムが適用するペイロードでも同じです。アクションのあとに描き直すページが `request` で見るのは、リクエストが運んできた Cookie で、アクションが書いた値ではありません。',
  en: 'What an action writes goes on its answer — the page it re-rendered, the `303` to where it redirected, or the payload the client runtime applies. The page re-rendered after it sees the cookies the request carried in `request`, not what the action wrote.',
});
