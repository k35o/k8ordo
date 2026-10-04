import { message } from '@k8ordo/i18n';

// @k8ordo/static と @k8ordo/server で同じ内容の文言。モードごとに違う部分は
// static-boundaries.ts / server-boundaries.ts が持つ。

export const serverTitle = message({
  ja: '既定はServer Component',
  en: 'Server Components by default',
});

export const serverDescription = message({
  ja: 'ディレクティブの無いファイルはServer Componentです。サーバー側でだけ動き、`async`にでき、データを直接読めます。コードはブラウザに送られず、送られるのは描いた結果だけです。',
  en: 'A file with no directive is a Server Component. It runs on the server side only, may be `async`, and reads its data directly; its code never reaches the browser, only what it rendered.',
});

export const clientTitle = message({
  ja: "`'use client'`でブラウザ側に入る",
  en: "`'use client'` opts into the browser",
});

export const clientDescription = message({
  ja: "ブラウザ側はReact自身の語`'use client'`で宣言します。Server Componentはそれを普通にimportでき、境界を越えるのはそのコンポーネントだけで、ページはサーバーに残ります。`'use client'`のファイルがimportするものは、すべてクライアントのバンドルに一緒に入ります。",
  en: "The browser side is opted into with React's own word, `'use client'`. A Server Component imports such a component like anything else, and only that component crosses; the page stays on the server. Whatever a `'use client'` file imports goes into the client bundle with it.",
});

export const clientSsr = message({
  ja: 'クライアントコンポーネントも、サーバーで一度HTMLに描かれてから、ブラウザでhydrateされます。サーバーでの描画では読めないもの（`localStorage`など）を読むときは、下の「ブラウザが必要なコンポーネント」の形にします。',
  en: 'A client component is also rendered to HTML once on the server, then hydrated in the browser. One that reads something the server render cannot have — `localStorage`, say — takes the form in "Components that need a browser" below.',
});

export const propsTitle = message({
  ja: '境界を越えるprops',
  en: 'What crosses the boundary',
});

export const propsDescription = message({
  ja: 'Server Componentからクライアントコンポーネントへ渡すpropsは、シリアライズされて運ばれます。渡せるのは文字列、数値、真偽値、`null`、プレーンなオブジェクトと配列、`Date`、`Map`、`Set`、`Promise`、JSX（Server Componentが描いた`children`を含む）です。関数とクラスのインスタンスは渡せません。',
  en: 'Props from a Server Component to a client component are serialized on the way. Strings, numbers, booleans, `null`, plain objects and arrays, `Date`, `Map`, `Set`, `Promise` and JSX — including `children` a Server Component rendered — cross; functions and class instances do not.',
});

export const propsSite = message({
  ja: 'このサイトの文言は`message()`で、呼ぶと文字列を返す関数です。Server Componentからクライアントコンポーネントへ文言を渡すときは、関数ではなく、呼んだ結果の文字列を渡しています（`label={m.x.y()}`）。',
  en: 'Every piece of text on this site is a `message()` — a function that returns the string when called. Where a Server Component hands text to a client component, it passes the string it called for (`label={m.x.y()}`), never the function.',
});

export const shellTitle = message({
  ja: 'レイアウトを2つのファイルに割る',
  en: 'Splitting a layout across two files',
});

export const shellDescription = message({
  ja: '`paramsSchema`はServer Componentのファイルからしかexportできません。一方で、フックやプロバイダを使うレイアウトはクライアントコンポーネントです。このサイトの`[locale]`レイアウトは、これを2つのファイルに割っています。`layout.tsx`はスキーマを持つServer Componentで、`_parts/locale-shell.tsx`がプロバイダ、ヘッダー、フックを持つクライアント側の殻です。',
  en: "A `paramsSchema` can only be exported from a Server Component file, while a layout that uses hooks or providers is a client component. This site's `[locale]` layout splits the two across files: `layout.tsx` is the Server Component that holds the schema, and `_parts/locale-shell.tsx` is the client shell with the providers, the header and the hooks.",
});

export const shellWhy = message({
  ja: 'レイアウトの`params.locale`は文字列として型が付きます。ページのまわりではスキーマがすでに受け付けた値ですが、`not-found.tsx`のまわりではスキーマが受け付けたかどうかに関わらず描かれ、どんな値でもありうるからです。そこで殻は`locales.is()`で確かめ、ロケールでなければURLから読み直します。サーバーが描いた`children`は、JSXとして境界を越えます。',
  en: "The layout's `params.locale` is typed as a string: around a page its schema has already accepted it, but around `not-found.tsx` it renders whether or not the schema accepted, and can be anything — so the shell checks it with `locales.is()` and otherwise reads the locale from the URL. The `children` the server rendered cross the boundary as JSX.",
});

export const shellExcerpt = message({
  ja: 'どちらのファイルも、この節に関わる部分だけを抜き出しています。実際の殻は、ヘッダー、サイドバー、フッターも描きます。',
  en: 'Both files are cut down to the part this section is about; the real shell also renders the header, the sidebar and the footer.',
});

export const browserTitle = message({
  ja: 'ブラウザが必要なコンポーネント',
  en: 'Components that need a browser',
});

export const browserDescription = message({
  ja: 'ブラウザにしか無いもの（`localStorage`、訪問者のタイムゾーン、`navigator`）を読むクライアントコンポーネントは、`react-dom`の`browser`を使って`use(browser())`でそう言い、`<Suspense>`の中に置きます。`browser`はReact 19.3で入ったAPIです。',
  en: "A client component that reads something only a browser has — `localStorage`, the visitor's time zone, `navigator` — says so with React's `use(browser())` (`browser` from `react-dom`, added in React 19.3), under a `<Suspense>`.",
});

export const browserHow = message({
  ja: 'サーバーでの描画は、ファイルへのビルドでもリクエストへの応答でも、fallbackをHTMLに残し、ブラウザがhydrationの後にコンポーネントを描きます。これは失敗ではありません。ビルドは止まらず、ハンドラも何もログに出しません。`typeof window`の検査や「マウント済み」のフラグが担っていた役目で、どちらも要りません。',
  en: 'The server render — a build into files as much as a request — leaves the fallback in the HTML, and the browser renders the component after hydration. That is not a failure: the build does not stop for it and the handler logs nothing. This is what a `typeof window` check or a "mounted" flag used to do; neither is needed.',
});

export const browserSuspense = message({
  ja: '`<Suspense>`はfallbackを置く場所を決めるもので、省けません。上にSuspenseの境界が1つも無ければ、サーバーでの描画はfallbackを残す場所が無く、失敗します。',
  en: 'The `<Suspense>` is what says where the fallback goes, and it is not optional: with no Suspense boundary above the component, the server render has nowhere to leave one, and fails.',
});

export const serverOnlyTitle = message({
  ja: 'サーバー専用のモジュール',
  en: 'Server-only modules',
});

export const serverOnlyDescription = message({
  ja: '`server-only`をimportしたモジュールは、クライアントに届いてはいけません。',
  en: 'A module that imports `server-only` may never reach the client.',
});

export const serverOnlyFails = message({
  ja: '届いてしまうとビルドが失敗し、そこへ至ったimportの連鎖を名指します。クライアントコンポーネントのグラフは入口からたどるのではなく描画中に組み立てられますが、その経路も含みます。',
  en: "The build fails when one does, and names the chain of imports that got it there — including through a client component's graph, which is assembled while rendering rather than crawled from an entry.",
});

export const serverOnlyWhy = message({
  ja: '秘密やデータベースのクライアントをこのimportの後ろに置けば、間に何段のモジュールを挟んでも渡りません。`server-only`はReactのエコシステムがこのために使うパッケージで、指定子はビルドが自分で解決します。インストールするのは、TypeScriptに解決させるためです。',
  en: "Secrets and database clients behind that import cannot cross, however many modules sit in between. `server-only` is the package React's ecosystem uses for this; the build resolves the specifier itself, and installing it is what lets TypeScript resolve it.",
});

export const serverOnlyName = message({
  ja: 'そうしたファイルは`*.server.ts`と名付けます。保証はimportから来るもので、名前はファイルを開かなくても、ディレクトリ木とimport文の上で読み手に見えるようにするためのものです。自分では印を付けないサードパーティのモジュールも、こうしたファイルで包めば同じ検査の下に入ります。',
  en: 'Name such a file `*.server.ts`. The guarantee comes from the import; the name is so a reader sees it in the directory tree and at every import site without opening the file. A third-party module that does not mark itself comes under the same check once wrapped in one.',
});

export const whereTitle = message({
  ja: 'ブラウザで「今どこか」を知る',
  en: 'Where the browser is',
});

export const whereDescription = message({
  ja: 'フレームワークの下では、ブラウザはルート表を持ちません。ツリーはサーバーから届き、ブラウザにあるのはナビゲーションだけです。そのため`useRoute()`と`useParams()`は読むべき一致が無く、throwします。ページは`params`をpropとして受け取り、クライアントコンポーネントには要るものをpropsで渡します。現在地は`usePathname()`で、ある区画が開いているかは`useMatch()`で尋ねます。',
  en: 'Under the framework the browser holds no route table: the tree comes from the server, and the browser has only navigation. `useRoute()` and `useParams()` therefore have no match to read, and throw. A page receives `params` as a prop and passes what a client component needs down as props; the current location is `usePathname()`, and whether a section is showing is `useMatch()`.',
});

export const whereMore = message({
  ja: 'フレームワークの下でのルーターの振る舞いは、リンク先にあります。',
  en: 'How the router behaves under the framework is covered here.',
});

export const searchTitle = message({
  ja: 'searchは@k8ordo/stateのもの',
  en: "The search is @k8ordo/state's",
});

export const searchDescription = message({
  ja: 'ページはsearchを見ません（`@k8ordo/server`で読むものを宣言したページは例外です）。フレームワークが持つのはpathnameで、`?`から後ろは`@k8ordo/state`のものです。`useAppState`はブラウザでsearchを読むので、サーバーでの描画はurlスロットの既定値を描き、hydrationで実際のURLに切り替わります。searchだけが変わってもページは変わらず、何も再マウントされず、スクロール位置もそのままです。',
  en: "A page never sees the search (under `@k8ordo/server`, one that declares what it reads is the exception). The pathname is the framework's, and everything after the `?` is `@k8ordo/state`'s: `useAppState` reads the search in the browser, so a server render shows the url slot's defaults and the live URL takes over on hydration. Changing only the search does not change the page — nothing remounts, and the scroll position stays where it was.",
});

export const searchRegister = message({
  ja: 'アプリが`@k8ordo/state`に依存していれば、生成される`register.gen.ts`がその`Register`も書くので、状態の定義も同じルート表に対して型が付きます。',
  en: 'When the application depends on `@k8ordo/state`, the generated `register.gen.ts` writes its `Register` too, so state definitions are typed against the same route table.',
});
