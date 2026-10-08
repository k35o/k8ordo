import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Reactのディレクティブで、サーバーで動くコードとブラウザで動くコードを書き分けます。Client Componentに渡せる値と、サーバー専用のモジュールをクライアントに含めない方法も分かります。',
  en: 'React’s directives say which code runs on the server and which in the browser. You will also see what a Client Component can receive, and how to keep a server-only module off the client.',
});

export const serverTitle = message({
  ja: 'Server Component',
  en: 'Server Components',
});

export const serverAsyncCallout = message({
  ja: 'Server Componentは`async`にできる',
  en: 'A Server Component can be `async`',
});

export const serverDefault = message({
  ja: 'ディレクティブの無いファイルは、Server Componentです。データを直接読めます。ブラウザに送られるのは描画した結果だけで、コードは送られません。',
  en: 'A file with no directive is a Server Component. It reads data directly. Only what it rendered is sent to the browser, never its code.',
});

export const serverWhen = message({
  ja: 'Server Componentが動く時点は、モードで違います。staticモードではビルドのときに動きます。ページごとにHTML用と`index.rsc`用の2回描画し、その結果がファイルになります。serverモードではリクエストのたびに動き、その時点のデータを読みます。`vite dev`では、どちらのモードもリクエストごとに動きます。',
  en: 'When a Server Component runs depends on the mode. In static mode it runs at build time. Each page is rendered twice, once for its HTML and once for `index.rsc`, and the results become files. In server mode it runs on every request and reads the data as it is at that moment. With `vite dev` it runs on every request in either mode.',
});

export const clientTitle = message({
  ja: "`'use client'`",
  en: "`'use client'`",
});

export const clientOptIn = message({
  ja: "ブラウザで動かすコンポーネントは、ファイルの先頭に`'use client'`を書きます。Server Componentからは、ほかのモジュールと同じようにimportします。ブラウザに送られるのは、そのコンポーネントとそれがimportするものだけです。",
  en: "A component that runs in the browser starts its file with `'use client'`. A Server Component imports it like any other module. Only that component, and what it imports, is sent to the browser.",
});

export const clientSsr = message({
  ja: 'Client Componentも、サーバー側で一度HTMLに描画されてから、ブラウザでハイドレーションされます。`localStorage`のようにサーバーで読めない値の読み方は、下の「ブラウザだけの値」を見てください。',
  en: 'A Client Component is also rendered to HTML on the server first, then hydrated in the browser. For a value the server cannot read, such as `localStorage`, see “Browser-only values” below.',
});

export const directiveNote = message({
  ja: "`'use server'`は、ブラウザから呼べるサーバーの関数を宣言します。ブラウザに送ってはいけないモジュールに付ける`server-only`とは役割が違います。serverモードだけで使え、staticモードではビルドと`vite dev`が拒みます。書き方は",
  en: "`'use server'` declares a server function the browser can call. It is different from `server-only`, which a module imports so it is never sent to the browser. It works in server mode only; in static mode the build and `vite dev` refuse it. See ",
});

export const propsTitle = message({
  ja: '渡せるprops',
  en: 'Props you can pass',
});

export const propsSerialized = message({
  ja: 'Server ComponentからClient Componentへ渡すpropsはシリアライズされるので、渡せる値は次のものに限られます。',
  en: 'Props from a Server Component to a Client Component are serialized, so only these values can be passed:',
});

export const propsList = [
  message({
    ja: 'プリミティブ：文字列と数値、真偽値。`null`と`Date`も渡せます',
    en: 'Primitives: strings, numbers and booleans, plus `null` and `Date`',
  }),
  message({
    ja: 'コレクション：プレーンなオブジェクトと配列、`Map`、`Set`',
    en: 'Collections: plain objects and arrays, `Map` and `Set`',
  }),
  message({
    ja: '`Promise`：Client Componentが`use()`で待てます',
    en: '`Promise`: the Client Component can wait on it with `use()`',
  }),
  message({
    ja: 'JSX：Server Componentが描画した`children`も渡せます',
    en: 'JSX: including `children` a Server Component rendered',
  }),
] as const;

export const propsFunction = message({
  ja: "関数とクラスのインスタンスは渡せません。関数を渡すと、そのページの描画がReactのエラー（`Functions cannot be passed directly to Client Components`）で失敗します。staticモードではビルドが止まります。例外はServer Actionで、serverモードでは`'use server'`の関数を参照として渡せます。",
  en: "Functions and class instances cannot be passed. Passing a function fails the page’s render with React’s error `Functions cannot be passed directly to Client Components`. In static mode the build stops. A Server Action is the exception: in server mode a `'use server'` function is passed as a reference.",
});

export const shellTitle = message({
  ja: 'レイアウトの分割',
  en: 'Splitting a layout',
});

export const shellSchemaCallout = message({
  ja: 'スキーマはここに置く',
  en: 'The schema lives here',
});

export const shellWhy = message({
  ja: "`paramsSchema`は、`'use client'`の無いファイルからしかexportできません。一方、フックやプロバイダを使うレイアウトはClient Componentです。両方が要るときは、スキーマを持つ`layout.tsx`と、それが描画するClient Componentに分けます。",
  en: "`paramsSchema` can only be exported from a file without `'use client'`, while a layout that uses hooks or providers is a Client Component. When you need both, split the layout into a `layout.tsx` that holds the schema and a Client Component it renders.",
});

export const shellChildren = message({
  ja: 'サーバーで描画した`children`は、JSXとしてClient Componentに渡せます。このサイトの`[locale]`のレイアウトも、この形です。',
  en: 'The `children` rendered on the server are passed to the Client Component as JSX. This site’s `[locale]` layout is written this way.',
});

export const browserTitle = message({
  ja: 'ブラウザだけの値',
  en: 'Browser-only values',
});

export const browserUseCallout = message({
  ja: '`SavedDraft`はブラウザでだけ描画される',
  en: '`SavedDraft` renders only in the browser',
});

export const browserSuspenseCallout = message({
  ja: 'サーバー側の描画ではここが表示される',
  en: 'What the server render shows',
});

export const browserHow = message({
  ja: '`localStorage`や訪問者のタイムゾーンのように、ブラウザにしか無い値を読むClient Componentは、`react-dom`の`browser()`を`use()`に渡します。`typeof window`の分岐や、マウント済みかどうかのフラグは要りません。',
  en: 'A Client Component that reads something only a browser has, such as `localStorage` or the visitor’s time zone, passes `browser()` from `react-dom` to `use()`. No `typeof window` check or “mounted” flag is needed.',
});

export const browserRender = message({
  ja: 'サーバー側の描画は、HTMLに`fallback`を残します。ブラウザはハイドレーションの後に、そのコンポーネントを描画します。これは失敗ではないので、ビルドは止まらず、ログにも何も出ません。',
  en: 'The server render leaves the `fallback` in the HTML, and the browser renders the component after hydration. That is not a failure: the build does not stop, and nothing is logged.',
});

export const browserSuspense = message({
  ja: '上に`<Suspense>`が無いと、サーバー側の描画が`The server render could not complete because client rendering was requested outside a Suspense boundary`で失敗します。',
  en: 'Without a `<Suspense>` above it, the server render fails with `The server render could not complete because client rendering was requested outside a Suspense boundary`.',
});

export const serverOnlyTitle = message({
  ja: '`server-only`',
  en: '`server-only`',
});

export const serverOnlyInstall = message({
  ja: '`server-only`はアプリの依存に入れます。ビルドはインストールしなくても通りますが、TypeScriptの型検査には必要です。',
  en: '`server-only` goes in the application’s dependencies. The build passes without installing it, but TypeScript’s type check needs it.',
});

export const serverOnlyImport = message({
  ja: '秘密の値やデータベースのクライアントを持つモジュールは、先頭で`server-only`をimportします。このモジュールがクライアントのバンドルに入ると、ビルドが上のエラーで止まります。エラーには、そのモジュールに至ったimportの連鎖がすべて並びます。',
  en: 'A module that holds secrets or a database client imports `server-only` at the top. If the module ends up in the client bundle, the build stops with the error above, which lists the whole chain of imports that led to it.',
});

export const serverOnlyName = message({
  ja: '間に何段のモジュールを挟んでも、ビルドは同じエラーで止まります。こうしたファイルは`*.server.ts`と名付けると、開かなくてもサーバー専用だと分かります。',
  en: 'However many modules sit in between, the build stops with the same error. Naming such a file `*.server.ts` tells a reader it is server-only without opening it.',
});

export const whereTitle = message({
  ja: 'ブラウザでのURL',
  en: 'The URL in the browser',
});

export const whereNoTable = message({
  ja: 'このフレームワークでは、ブラウザはルート表を持たず、ページのコンポーネントツリーをサーバーから受け取ります。そのため、`useRoute()`と`useParams()`は`@k8ordo/framework`からexportしていません。',
  en: 'In this framework the browser holds no route table and receives the page’s component tree from the server. So `@k8ordo/framework` does not export `useRoute()` or `useParams()`.',
});

export const whereUse = message({
  ja: 'ページは`params`をpropsで受け取り、Client Componentには必要な値をpropsで渡します。今のURLは`usePathname()`で読みます。今のURLが`/products/*`のようなパターンに合うかは、`useMatch()`で調べます。',
  en: 'A page receives `params` as props and passes what a Client Component needs down as props. `usePathname()` returns the current URL. `useMatch()` tells whether it matches a pattern such as `/products/*`.',
});

export const searchTitle = message({
  ja: 'クエリ',
  en: 'The query',
});

export const searchSplit = message({
  ja: 'フレームワークが扱うのは、URLのpathnameまでです。`?`から後ろのクエリは`@k8ordo/state`が読みます。ページはクエリを受け取らず、Client Componentの`useAppState`がブラウザで読みます。',
  en: 'The framework handles the URL up to its pathname. The query after the `?` is read by `@k8ordo/state`. A page does not receive the query; `useAppState` reads it in the browser, in a Client Component.',
});

export const searchRender = message({
  ja: 'サーバー側の描画には`url`の置き場所の既定値が使われ、ハイドレーションで実際のURLの値に変わります。クエリだけが変わってもページは変わらないので、再マウントもスクロールの移動も起きません。',
  en: 'The server render shows the defaults of the `url` slot, and the real URL takes over on hydration. Changing only the query does not change the page: nothing remounts, and the scroll position stays.',
});

export const searchMode = message({
  ja: 'serverモードには例外があり、`search`をexportしたページは検証済みのクエリを`search`として受け取ります。書き方は',
  en: 'In server mode there is one exception: a page that exports `search` receives the validated query as `search`. See ',
});

export const searchStatic = message({
  ja: 'staticモードで`search`をexportすると、ビルドが`static build cannot hand a page the search`で始まるエラーで止まります。`vite dev`も同じです。検索や絞り込みを作るなら、JavaScriptが読み込まれる前から動くGETのフォームが向いています。書き方は',
  en: 'In static mode, a page that exports `search` stops the build with an error starting `static build cannot hand a page the search`, and `vite dev` refuses it too. For search and filtering, a GET form, which works before JavaScript loads, is the right fit. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

// 文の後ろにリンクを挟んで次の文を続けるときの区切り。英語だけ空白が要る。
export const sentenceGap = message({
  ja: '',
  en: ' ',
});
