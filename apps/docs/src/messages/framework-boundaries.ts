import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-boundaries.ts / server-boundaries.ts が持つ。

export const serverTitle = message({
  ja: '何も書かなければServer Component',
  en: 'No directive means a Server Component',
});

export const serverDescription = message({
  ja: 'ディレクティブを書いていないファイルは、Server Componentとして描かれます。`async`にでき、データを直接読めます。コードはブラウザに送られず、送られるのは描いた結果だけです。',
  en: 'A file with no directive renders as a Server Component. It may be `async` and read its data directly. Its code never reaches the browser; only what it rendered does.',
});

export const clientTitle = message({
  ja: "`'use client'`でブラウザ側に入る",
  en: "Move into the browser with `'use client'`",
});

export const clientDescription = message({
  ja: "ブラウザで動かしたいコンポーネントは、ファイルの先頭に`'use client'`を書きます。Server Componentはそれを普通にimportでき、ブラウザへ送られるのはそのコンポーネントと、それがimportするものだけです。",
  en: "A component that has to run in the browser starts its file with `'use client'`. A Server Component imports it like anything else, and only that component, with what it imports, is sent to the browser.",
});

export const clientSsr = message({
  ja: 'クライアントコンポーネントも、一度サーバー側でHTMLに描かれてから、ブラウザでhydrateされます。そのため`localStorage`のように、サーバー側の描画では読めないものは、描画の中でそのまま読めません。読み方は下の「ブラウザでしか読めない値を使う」で説明します。',
  en: 'A client component is also rendered to HTML on the server side first, then hydrated in the browser. Something the server render cannot read, such as `localStorage`, cannot be read straight in its render: “Use what only the browser has” below shows how.',
});

export const propsTitle = message({
  ja: '境界を越えるprops',
  en: 'What props can cross',
});

export const propsDescription = message({
  ja: 'Server Componentからクライアントコンポーネントへ渡すpropsは、シリアライズして運ばれます。そのため、渡せる値には決まりがあります。',
  en: 'Props from a Server Component to a client component are serialized on the way, so what can be passed is limited.',
});

export const propsList = [
  message({
    ja: '値：文字列と数値、真偽値、`null`、`Date`',
    en: 'Values: strings, numbers, booleans, `null` and `Date`',
  }),
  message({
    ja: 'まとまり：プレーンなオブジェクトと配列、`Map`、`Set`',
    en: 'Collections: plain objects and arrays, `Map` and `Set`',
  }),
  message({
    ja: '`Promise`：クライアントコンポーネントが`use()`で待てます',
    en: '`Promise`: the client component can wait on it with `use()`',
  }),
  message({
    ja: 'JSX：Server Componentが描いた`children`も、JSXとして渡せます',
    en: 'JSX: including `children` a Server Component rendered',
  }),
] as const;

export const propsNo = message({
  ja: '関数とクラスのインスタンスは渡せません。',
  en: 'Functions and class instances cannot cross.',
});

export const propsSite = message({
  ja: 'このサイトの文言は、呼ぶと文字列を返す`message()`の関数です。Server Componentからクライアントコンポーネントへ文言を渡すときは、関数ではなく、呼んだ結果の文字列を渡しています。',
  en: 'Every piece of text on this site is a `message()`, a function that returns the string when called. Where a Server Component hands text to a client component, it passes the string, not the function.',
});

export const shellTitle = message({
  ja: 'レイアウトを2つのファイルに分ける',
  en: 'Split a layout across two files',
});

export const shellDescription = message({
  ja: "`paramsSchema`は、`'use client'`の無いファイルからしかexportできません。一方で、フックやプロバイダを使うレイアウトはクライアントコンポーネントです。両方が要るときは、スキーマを持つ`layout.tsx`と、そこから描くクライアント側の殻に分けます。",
  en: "`paramsSchema` can only be exported from a file without `'use client'`, while a layout that uses hooks or providers is a client component. When you need both, split the layout into a `layout.tsx` holding the schema and a client shell it renders.",
});

export const shellChildren = message({
  ja: 'サーバーで描いた`children`は、JSXとして境界を越えます。このサイトの`[locale]`のレイアウトも、この形で書いています。',
  en: 'The `children` the server rendered cross the boundary as JSX. This site’s `[locale]` layout is built this way.',
});

export const browserTitle = message({
  ja: 'ブラウザでしか読めない値を使う',
  en: 'Use what only the browser has',
});

export const browserDescription = message({
  ja: '`localStorage`や訪問者のタイムゾーンのように、ブラウザにしか無いものを読むクライアントコンポーネントは、`react-dom`の`browser()`を`use()`に渡します。そのうえで、`<Suspense>`の中に置きます。',
  en: 'A client component that reads something only a browser has — `localStorage`, the visitor’s time zone — passes `browser()` from `react-dom` to `use()`, and sits inside a `<Suspense>`.',
});

export const browserHow = message({
  ja: 'サーバー側の描画は、ビルドでもリクエストへの応答でも、fallbackをHTMLに残します。ブラウザはhydrationの後に、そのコンポーネントを描きます。これは失敗ではないので、ビルドは止まらず、ログにも何も出ません。',
  en: 'The server render, a build as much as a request, leaves the fallback in the HTML, and the browser renders the component after hydration. That is not a failure: the build does not stop, and nothing is logged.',
});

export const browserSuspense = message({
  ja: '`<Suspense>`は省けません。上にSuspenseの境界が無いと、サーバー側の描画はfallbackを残す場所が無く、失敗します。',
  en: 'The `<Suspense>` is not optional: without one above it, the server render has nowhere to leave the fallback, and fails.',
});

export const browserNoFlag = message({
  ja: '`typeof window`で分岐したり、マウントしたかどうかのフラグを持ったりする必要はありません。',
  en: 'There is no need for a `typeof window` check, or a flag saying whether it has mounted.',
});

export const serverOnlyTitle = message({
  ja: 'サーバー専用のモジュールを守る',
  en: 'Keep server-only modules on the server',
});

export const serverOnlyDescription = message({
  ja: '秘密の値やデータベースのクライアントを持つモジュールは、先頭で`server-only`をimportします。このモジュールがクライアントのバンドルに入りそうになると、ビルドが止まります。',
  en: 'A module holding secrets or a database client imports `server-only` at the top. If it is ever on its way into the client bundle, the build stops.',
});

export const serverOnlyChain = message({
  ja: 'エラーは、そのモジュールに至ったimportの連鎖をすべて挙げます。間に何段のモジュールを挟んでも、`server-only`の後ろに置いたものはクライアントに渡りません。',
  en: 'The error names the whole chain of imports that got there. However many modules sit in between, what is behind `server-only` never reaches the client.',
});

export const serverOnlyName = message({
  ja: 'こうしたファイルは`*.server.ts`と名付けます。守っているのはimportのほうで、名前は、ファイルを開かなくてもサーバー専用だと分かるようにするためのものです。',
  en: 'Name such a file `*.server.ts`. The import is what protects it; the name is there so a reader knows it is server-only without opening it.',
});

export const whereTitle = message({
  ja: 'ブラウザで現在地を知る',
  en: 'Know where the browser is',
});

export const whereDescription = message({
  ja: 'フレームワークの下では、ブラウザはルート表を持ちません。ページの木はサーバーから届くからです。そのため`useRoute()`と`useParams()`は、読むルートが無く例外を投げます。',
  en: 'Under the framework the browser holds no route table, since the tree comes from the server. `useRoute()` and `useParams()` have no route to read, and throw.',
});

export const whereUse = message({
  ja: 'ページは`params`をpropsで受け取り、クライアントコンポーネントには必要な値をpropsで渡します。今のURLは`usePathname()`で、ある範囲のページが開いているかどうかは`useMatch()`で調べます。',
  en: 'A page receives `params` as props and passes what a client component needs down as props. The current URL is `usePathname()`, and whether a part of the site is showing is `useMatch()`.',
});

export const searchTitle = message({
  ja: '`?`から後ろは`@k8ordo/state`が持つ',
  en: 'Everything after the `?` belongs to `@k8ordo/state`',
});

export const searchDescription = message({
  ja: 'フレームワークが扱うのはURLのpathnameまでで、`?`から後ろのsearchは`@k8ordo/state`のものです。ページはsearchを受け取らず、`useAppState`がブラウザでsearchを読みます。',
  en: 'The framework handles the URL up to its pathname; the search after the `?` is `@k8ordo/state`’s. A page does not receive it, and `useAppState` reads it in the browser.',
});

export const searchRender = message({
  ja: 'そのため、サーバー側の描画ではurlスロットの既定値が描かれ、hydrationのときに実際のURLの値へ切り替わります。searchだけが変わってもページは変わらないので、何も再マウントされず、スクロール位置もそのままです。',
  en: 'So the server render shows the url slot’s defaults, and the real URL takes over on hydration. Changing only the search does not change the page: nothing remounts, and the scroll position stays.',
});

export const searchRegister = message({
  ja: 'アプリが`@k8ordo/state`に依存していれば、生成される`register.gen.ts`がstateの`Register`も書きます。状態の定義も、同じルート表に対して型が付きます。',
  en: 'When the application depends on `@k8ordo/state`, the generated `register.gen.ts` writes its `Register` too, so state definitions are typed against the same route table.',
});
