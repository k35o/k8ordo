import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'URLに置いた状態は、ブラウザだけでなくサーバーも読めます。このページでは、フレームワークごとにサーバーで`url`を読む方法と、定義からリンクを作る方法を説明します。',
  en: 'State in the URL can be read by the server as well as the browser. This page covers reading `url` on the server under each framework, and building links from a definition.',
});

export const serverTitle = message({
  ja: '@k8ordo/serverのページで読む',
  en: 'Read it in a @k8ordo/server page',
});

export const serverDescription = message({
  ja: '`@k8ordo/server`のページは、クエリのうち何を読むかを`search`のexportで宣言します。宣言したページは、`url`のスキーマで読んだ値を`search`として受け取ります。',
  en: 'A page under `@k8ordo/server` declares what of the query it reads by exporting `search`. A page that does receives the values read with that url schema, as `search`.',
});

export const serverParse = message({
  ja: '読み方は`parseUrl`と同じです。欠けたパラメータには既定値が入り、スキーマに合わない値はそのフィールドだけが既定値に戻ります。',
  en: 'It is read the way `parseUrl` reads: missing parameters get their defaults, and a value the schema rejects falls back to that field’s default alone.',
});

export const serverReload = message({
  ja: 'ページは受け取ったクエリに合わせて描かれるので、クエリが変わる遷移ではページがもう一度読み込まれます。GETフォームの送信、リンク、`url`を変える`update()`のどれでも同じです。それ以外はふつうの状態の変更と変わらず、スクロールもフォーカスも動かず、何も再マウントされません。`update()`の`finished`は、新しいクエリのページが表示された時点で解決します。',
  en: 'The page is rendered for the query it was given, so a navigation that moves the query loads the page again, whether a GET form, a link or a url `update()` moved it. Otherwise it is a state change like any other: no scroll, no focus reset, nothing remounts. The `finished` of `update()` settles once the page for the new query is on screen.',
});

export const serverOthers = message({
  ja: '`search`を宣言していないページと、クエリが変わらない遷移では、ルーターはこれまでどおり何も読み込みません。レイアウトはクエリを受け取りません。違うクエリを読むページの下でも、同じレイアウトが描かれるからです。',
  en: 'For a page that does not declare `search`, and for a navigation that leaves the query alone, the router still loads nothing. Layouts never receive the query, because one layout renders under pages that read different queries.',
});

export const serverSeed = message({
  ja: '受け取った`search`は、`initialUrl`として`useAppState`に渡します。サーバーの描画とハイドレーションの描画が、既定値ではなくURLの値で行われます。',
  en: 'Pass the `search` you received to `useAppState` as `initialUrl`, and the server render and the hydration render show the URL’s values rather than the defaults.',
});

export const staticTitle = message({
  ja: '@k8ordo/staticでは読まない',
  en: 'Under @k8ordo/static, the server does not read it',
});

export const staticDescription = message({
  ja: '`@k8ordo/static`は、`search`をexportしたページがあると、`static build cannot hand a page the search`で始まるエラーでビルドを止めます。ファイルの中身は、クエリによって変えられないからです。',
  en: '`@k8ordo/static` stops the build when a page exports `search`, with an error beginning `static build cannot hand a page the search`, because a file cannot change with the query.',
});

export const staticDefaults = message({
  ja: 'そのため、サーバーの描画は`url`の既定値で行われ、ハイドレーションの次の描画から実際のURLの値に切り替わります。`@k8ordo/server`でも、`search`を宣言しないページは同じです。クエリで変わる部分は、クライアントコンポーネントの中で`useAppState`から読んで描きます。',
  en: 'There the server renders the url slot’s defaults, and the live URL takes over one render after hydration, as it does for any `@k8ordo/server` page that declares no `search`. Render what depends on the query in a client component, reading it with `useAppState`.',
});

export const staticLinks = message({
  ja: 'リンクを作る`href`と`search`は純粋な関数なので、この制約を受けません。Server Componentの中でも、そのまま使えます。',
  en: '`href` and `search`, which build links, are pure functions and are not affected; they work inside a Server Component as they are.',
});

export const parseUrlTitle = message({
  ja: 'ほかのフレームワークでparseUrlを使う',
  en: 'Use parseUrl under other frameworks',
});

export const parseUrlDescription = message({
  ja: 'Next.jsのApp Routerのように、ページにクエリを渡すルーターでは、`parseUrl`で`url`を読みます。',
  en: 'Under a router that hands the page its query, such as the Next.js App Router, read `url` with `parseUrl`.',
});

export const parseUrlInput = message({
  ja: '`parseUrl`が受け取るのは、`URLSearchParams`か、`Record<string, string | string[] | undefined>`の形のオブジェクトです。型は`UrlInput`です。読み方は`search`のexportと同じで、読むときに投げることはありません。',
  en: '`parseUrl` takes a `URLSearchParams`, or an object shaped like `Record<string, string | string[] | undefined>` (the type is `UrlInput`). It reads the same way the `search` export does, and never throws.',
});

export const parseUrlNavigation = message({
  ja: 'ただし、今のNext.jsはNavigation APIの遷移を受け止めません。そのため、URLを変える`update()`はドキュメント全体の読み込みになります。そこでは、URLの変更をリンクとGETフォームで行ってください。History APIで代わりに書く仕組みは、あえて持っていません。',
  en: 'Today’s Next.js does not intercept Navigation API navigations, though, so an `update()` that changes the URL becomes a full document load. Change the URL with links and GET forms there. There is deliberately no History API fallback.',
});

export const parseUrlReader = message({
  ja: '定義ではなくスキーマだけを渡されたコードには、`urlReader(schema)`があります。スキーマを受け取り、`parseUrl`と同じ読み方をする関数を返します。`@k8ordo/server`は、`search`をexportしたページのクエリをこれで読んでいます。',
  en: 'Code handed a schema without its definition has `urlReader(schema)`, which returns a function that reads the way `parseUrl` does. `@k8ordo/server` reads the query of a page that exports `search` through it.',
});

export const hrefTitle = message({
  ja: 'hrefでリンクを作る',
  en: 'Build links with href',
});

export const hrefDescription = message({
  ja: '`href(path, values?)`は、定義からリンクを作ります。指定しなかったフィールドは既定値として扱われ、既定値と同じフィールドはクエリから省かれます。そのため、同じ状態からはいつも同じURLができます。',
  en: '`href(path, values?)` builds a link from a definition. A field you leave out means its default, and a field at its default is left out of the query, so the same state always gives the same URL.',
});

export const hrefSearch = message({
  ja: '`search(values?)`は、`?`を付けずにクエリ文字列だけを返します。パスを自分で組み立てるときに使います。たとえば、ダウンロードのURLに一覧と同じ条件を付けるときです。',
  en: '`search(values?)` returns the query string alone, without the `?`, for when you put the path together yourself, such as giving a download URL the same filters as the list.',
});

export const hrefEdges = message({
  ja: '返り値の型には、渡したパスがそのまま残ります。型付きのルートの検査は、そこからクエリを取り除いてパスを確かめます。`entry`だけの定義では、`href`はクエリの無いリンクを返し、`search`は空の文字列を返します。URLで表せない値を渡すと、どちらも投げます。',
  en: 'The return type keeps the path you passed, which is what a typed-route check strips the query from and verifies. For an entry-only definition, `href` returns the link with no query and `search` an empty string. A value no URL can spell makes both throw.',
});

export const baseTitle = message({
  ja: 'Viteのbaseの下でリンクを作る',
  en: 'Links under Vite’s base',
});

export const baseDescription = message({
  ja: '`href`に渡すパスは、ルート表と同じく、アプリのルートから書きます。返るリンクには、Viteの`base`が前に付きます。',
  en: 'The path `href` takes is written from the application’s root, as the route table writes it, and the link it returns carries Vite’s `base` in front.',
});

export const baseExample = message({
  ja: 'たとえば、`base`が`\'/docs/\'`のときは次のようになります。',
  en: 'With `base` set to `\'/docs/\'`, for example:',
});

export const baseRouterHref = message({
  ja: 'そのため、`@k8ordo/router`の`href`が返したものは渡さないでください。そちらには、すでに`base`が付いています。',
  en: 'So never hand it what `@k8ordo/router`’s `href` returned: that already carries the base.',
});

export const baseOutside = message({
  ja: 'Viteの外、たとえばNext.jsでは`import.meta.env`が無いので、何も付けません。`basePath`は、そのフレームワークの`<Link>`が付けます。',
  en: 'Outside Vite, Next.js for one, there is no `import.meta.env` to read, so nothing is added; a `basePath` is the framework’s own `<Link>` to add.',
});

export const typedTitle = message({
  ja: 'リンクのパスを型で確かめる',
  en: 'Check link paths with types',
});

export const typedDescription = message({
  ja: '`Register`を一度だけ拡張すると、アプリの中のすべての`href`が、ルーターの知らないパスを型エラーにします。`@k8ordo/router`の拡張と同じ1行です。',
  en: 'Augment `Register` once, and every `href` in the app turns a path its router does not know into a type error. It is the same line as the `@k8ordo/router` augmentation.',
});

export const typedGenerated = message({
  ja: '`@k8ordo/static`と`@k8ordo/server`では、この拡張が`routes/`から`.k8ordo/register.gen.ts`に生成されます。生成されるのは、アプリ自身の`package.json`の`dependencies`か`devDependencies`に`@k8ordo/state`があるときです。ほかのパッケージを経由した依存は数えません。生成された宣言と重なるので、そうしたアプリでは自分で書かないでください。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server` it is generated from `routes/` into `.k8ordo/register.gen.ts`, when the application’s own `package.json` lists `@k8ordo/state` in `dependencies` or `devDependencies` (a transitive dependency does not count). Do not hand-write it in such an application; it would duplicate the generated declaration.',
});

export const typedMatch = message({
  ja: 'パスは、表のパターンと区切りごとに照らし合わせます。文字どおりの区切りはパターンと同じ綴りでなければならず、`:param`の区切りには、空でない1区切りなら何でも入ります。テンプレートリテラルで作った`${string}`も入ります。`*`のワイルドカードは照合には使いますが、リンク先にはなりません。どのパターンにも当たらないパスは型エラーで、`/:locale`で始まる表でも`\'/ja/nowhere\'`は拒まれます。',
  en: 'The path is matched against the table’s patterns segment by segment. A literal segment must be spelled as the pattern spells it, and a `:param` takes any one non-empty segment, a `${string}` from a template literal included. A `*` wildcard is matched but never linked. A path no pattern matches is a type error, so even a `/:locale` table refuses `\'/ja/nowhere\'`.',
});

export const typedRuntime = message({
  ja: '検査は、`@k8ordo/router`の`NavigablePath`を型として使うだけです。そのため、ルーターは任意のpeerのままで、実行時には読み込まれません。',
  en: 'The check only uses `@k8ordo/router`’s `NavigablePath` as a type, so the router stays an optional peer and never loads at runtime.',
});

export const typedOtherRouters = message({
  ja: '表を持たないルーターでは、そのルーターのパスのunionを`path`に登録します。Next.jsなら`next`の`Route`です。',
  en: 'A router with no table to hand over registers its path union under `path` instead, such as `Route` from `next`.',
});

export const typedPrecedence = message({
  ja: '両方があれば`routes`が優先され、どちらも無ければ`/`で始まる文字列が何でも通ります。拡張はアプリケーションの中でだけ行ってください。共有のライブラリで拡張すると、その制約が使う側のすべてに漏れます。',
  en: 'When both are present, `routes` wins; with neither, any `/`-prefixed string passes. Augment only in an application: a shared library augmenting `Register` leaks the constraint to every consumer.',
});
