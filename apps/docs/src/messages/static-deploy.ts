import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build` は全ページを描いて `dist/client/` に書きます。そのディレクトリがサイトで、どんな静的ホスティングにも置けます。このページは、出力の形、ページの届き方と遷移の仕方、ホスティングに求めること、`404.html` と `sitemap.xml` を説明します。',
  en: '`vite build` renders every page into `dist/client/`. That directory is the site, and any static host can serve it. This page covers the shape of the output, how a page arrives and navigates, what the host has to do, and `404.html` and `sitemap.xml`.',
});

export const outputTitle = message({
  ja: '出力',
  en: 'The output',
});

export const outputDescription = message({
  ja: '`dist/client/` がサイトです。ページごとに、HTML と、同じページを RSC のペイロードにした `index.rsc` が並びます。`dist/rsc/` と `dist/ssr/` はそれを作った仕組みで、配信するものではありません。',
  en: '`dist/client/` is the site: for every page, its HTML and the same page as an RSC payload, `index.rsc`. `dist/rsc/` and `dist/ssr/` are the machinery that produced it, not something to serve.',
});

export const outputLog = message({
  ja: 'ビルドは最後に、書いたルートの数と、`404.html` と `sitemap.xml` を書いたかを 1 行で報告します。数にはリダイレクトのページも含まれます。',
  en: 'The build ends by reporting in one line how many routes it wrote, and whether it wrote `404.html` and `sitemap.xml`; the count includes redirect pages.',
});

export const arriveTitle = message({
  ja: 'ページの届き方と遷移',
  en: 'How a page arrives and navigates',
});

export const arriveDescription = message({
  ja: 'ページは、描画の元になったペイロードを埋め込んだ HTML として届きます。hydration はそのペイロードを読むので、ページをもう一度求めることはありません。そこから先、別のページへのリンクは文書を読み込み直さず、そのページの `index.rsc` を取りに行きます。サイトがファイルの山でも、遷移はクライアント側に留まります。',
  en: "A page arrives as HTML with the payload it was rendered from written into it, so hydration reads what the build rendered instead of asking for the page again. From there, a link to another page fetches that page's `index.rsc` rather than reloading the document: navigation stays client-side even though the site is a pile of files.",
});

export const arrivePath = message({
  ja: 'ペイロードがヘッダーやクエリではなくパスにあるのは、静的ホスティングがそのどちらによっても答えを変えないからです。',
  en: 'The payload lives at a path rather than behind a header or a query because static hosting varies on neither.',
});

export const hostTitle = message({
  ja: 'ホスティングに求めること',
  en: 'What the host has to do',
});

export const hostDescription = message({
  ja: '`dist/client/` をそのまま配信できれば、どのホスティングでも構いません。求めるのは次の 3 つです。',
  en: 'Any host that serves `dist/client/` as it is will do. It has to do three things:',
});

export const hostIndex = message({
  ja: '`/products/1` のような URL に `products/1/index.html` で答える',
  en: 'Answer a URL like `/products/1` with `products/1/index.html`',
});

export const hostRsc = message({
  ja: '`index.rsc` をそのまま返す。content type は HTML 以外なら何でも受け付けます',
  en: 'Serve the `index.rsc` files as they are; any content type other than HTML is accepted',
});

export const host404 = message({
  ja: '持っていない URL に `404.html` で答える。その答えに 404 のステータスを付けるかどうかは、ホスティングの設定です',
  en: "Answer a URL it does not have with `404.html`; whether that answer carries a 404 status is the host's setting",
});

export const hostUnknown = message({
  ja: 'サイトが持たない URL は、ブラウザ側では描かれません。答えがペイロードではないので、遷移は普通の文書の読み込みになり、ホスティングが `404.html` で答えます。サイトの横に置いたファイルも同じで、`/robots.txt` へのリンクはルーターに飲み込まれず、ファイルそのものを取りに行きます。',
  en: "A URL the site does not have is nobody's to render in the browser: the answer is not a payload, so the navigation becomes an ordinary document load and the host answers it with `404.html`. The same goes for files sitting beside the site, so a link to `/robots.txt` fetches the file instead of disappearing into the router.",
});

export const hostDownload = message({
  ja: 'ホスティングがダウンロードとして返すファイルへのリンクには、`download` を付けます（`<a href="/report.csv" download>`）。そうすれば navigate イベントの時点でダウンロードだと分かるので、ルーターはそれをブラウザに任せます。`Content-Disposition` は答えと一緒にしか届かず、そのときには URL がもう確定しています。',
  en: 'Mark a link the host answers with a download as `<a href="/report.csv" download>`: the navigate event then already marks it as a download, so the router leaves it to the browser, whereas `Content-Disposition` only arrives with the answer, after the URL has been committed.',
});

export const notFoundTitle = message({
  ja: '`404.html`',
  en: '`404.html`',
});

export const notFoundDescription = message({
  ja: '`not-found.tsx` は `404.html` になります。多くの静的ホスティングが、知らない URL に返すファイルです。何も動いていないこのモードでも not-found のページを宣言する意味があるのは、そのためです。',
  en: '`not-found.tsx` becomes `404.html`, the file most static hosts serve for an unknown URL — which is why declaring a not-found page means something in this mode, even though nothing is running to route the request.',
});

export const notFoundOne = message({
  ja: 'ホスティングの 404 は 1 つしか無いので、表せる `not-found.tsx` は 1 つだけです。どこに置いても構いません（ロケールの区間の下でも）。2 つ宣言した表は、黙ってどちらかを選ばず、ビルドを止めます。',
  en: 'A host has one blanket 404, so only one `not-found.tsx` can be represented, wherever it sits — under a locale segment is fine. A table declaring two stops the build rather than silently picking one.',
});

export const notFoundParams = message({
  ja: 'この 1 枚は、サイトが持たない pathname に対して描かれます。404 とはもともとそういうものです。`pathname` はそうした URL で、`not-found.tsx` の上にパラメータがあれば、そこにはどのルートも宣言していない区間が入ります。つまりそこでの `params.<name>` は、アプリが名付けた値ではありません。`@k8ordo/server` で `/:locale/*` が `/fr/anything` にも一致するときと同じように扱い、値を確かめます。訪問者が実際に開いた URL は、hydration の後にクライアントコンポーネントで `usePathname()` から読みます。JavaScript の無い訪問者には、ビルド時の描画がそのまま残ります。',
  en: 'That one file is rendered for a pathname the site does not have, which is what any 404 is. Its `pathname` is such a URL, and where a parameter sits above `not-found.tsx`, that parameter is filled with a segment no route declared — so `params.<name>` there is not a value the application named. Treat it as you would under `@k8ordo/server`, where `/:locale/*` matches `/fr/anything` too: validate it, and read what the visitor actually opened from `usePathname()` in a client component after hydration. A visitor without JavaScript keeps whatever the build rendered.',
});

export const notFoundSite = message({
  ja: 'このサイトの `LocaleShell` がその形です（下はその部分の抜粋です）。受け取った値を `locales.is()` で確かめ、ロケールでなければ URL から読み直します。そのため `404.html` は日本語で配信され、`/en/…` の URL で hydrate した瞬間に英語になります。',
  en: "This site's `LocaleShell` does exactly that (excerpted below): it checks the value with `locales.is()`, and otherwise reads the locale from the URL — which is why `404.html` is served in Japanese and turns English the moment it hydrates on an `/en/…` URL.",
});

export const notFoundNone = message({
  ja: '`not-found.tsx` が 1 つも無ければ、`404.html` は書かれず、知らない URL への答えはホスティング次第です。',
  en: 'With no `not-found.tsx`, no `404.html` is written, and the host decides what an unknown URL gets.',
});

export const sitemapTitle = message({
  ja: '`site` と `sitemap.xml`',
  en: '`site` and `sitemap.xml`',
});

export const sitemapDescription = message({
  ja: '`site` にサイトの配信元（`https://example.com`）を渡すと、ビルドは書いたページをすべて並べた `sitemap.xml` も書きます。リダイレクトと `404.html` はページではないので載りません。配信元が無ければサイトマップも書きません。相対 URL のサイトマップは、サイトマップではないからです。',
  en: 'Pass the origin the site is served from — `https://example.com` — as `site`, and the build also writes `sitemap.xml`, listing every page it wrote. Redirects and `404.html` are not pages and are left out. Without the origin there is no sitemap, because a sitemap of relative URLs is not one.',
});

export const sitemapDetails = message({
  ja: 'URL は並べ替えられ、`site` の末尾のスラッシュは無視されます。',
  en: 'URLs are sorted, and a trailing slash on `site` is ignored.',
});

export const optionsTitle = message({
  ja: '`framework()` のオプション',
  en: 'The options of `framework()`',
});

export const optionsDescription = message({
  ja: 'オプションの型は `StaticOptions` です。',
  en: 'The options are typed `StaticOptions`.',
});

export const optionsTable = {
  option: message({ ja: 'オプション', en: 'Option' }),
  defaultValue: message({ ja: '既定値', en: 'Default' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  none: message({ ja: 'なし', en: 'None' }),
  routesDir: message({
    ja: 'ルートのディレクトリ。プロジェクトのルートからの相対パスです。変えても生成されるファイルは `.k8ordo/` に書かれ、問題の行は `routes/` から始まります。',
    en: 'The route directory, relative to the project root. The generated files still go to `.k8ordo/`, and problem lines still begin with `routes/`.',
  }),
  paths: message({
    ja: 'パラメータ付きのパターンを受け取り、具体的な pathname（またはその Promise）を返す関数。',
    en: 'A function that receives the parameterised patterns and returns concrete pathnames, or a promise of them.',
  }),
  site: message({
    ja: 'サイトの配信元。渡すと `sitemap.xml` を書きます。',
    en: 'The origin the site is served from; with it the build writes `sitemap.xml`.',
  }),
};

export const stopsTitle = message({
  ja: 'ビルドが止まるとき',
  en: 'When the build stops',
});

export const stopsDescription = message({
  ja: 'ページが欠けた、あるいは本番で壊れるサイトを書き出すくらいなら、ビルドは止まります。主な理由は次のとおりです。',
  en: 'Rather than write a site that is missing pages or broken in production, the build stops. These are the main reasons:',
});

export const stopsGrammar = message({
  ja: '`routes/` の文法の問題と、隠されたルート',
  en: 'A problem in the `routes/` grammar, or a shadowed route',
});

export const stopsPaths = message({
  ja: 'パラメータ付きルートの pathname の不足と、どのルートも使わない pathname、スキーマが拒む pathname、復号できないか出力の外を指す pathname',
  en: 'A parameterised route with no pathnames, or a supplied pathname that no route wants, that a schema refuses, or that cannot be decoded or leaves the output',
});

export const stopsNotFound = message({
  ja: '2 つ以上の `not-found.tsx`',
  en: 'More than one `not-found.tsx`',
});

export const stopsActions = message({
  ja: "`'use server'` を宣言したモジュール",
  en: "A module that declares `'use server'`",
});

export const stopsThrow = message({
  ja: 'ビルド中に throw したコンポーネント（Server Component はいつでも、クライアントコンポーネントは上に Suspense の境界が無いとき）',
  en: 'A component that throws while the build renders it — a Server Component always, a client component when no Suspense boundary sits above it',
});

export const stopsAsyncSchema = message({
  ja: '非同期に検証する `paramsSchema`',
  en: 'A `paramsSchema` that validates asynchronously',
});

export const stopsRedirectTarget = message({
  ja: '自分のパターンに無いパラメータを行き先で名指す `redirect.ts`',
  en: 'A `redirect.ts` whose target names a param its own pattern lacks',
});

export const stopsServerOnly = message({
  ja: 'クライアントに届いた `server-only` のモジュール',
  en: 'A `server-only` module that reaches the client',
});

export const cannotTitle = message({
  ja: 'static にできないこと',
  en: 'What static cannot do',
});

export const cannotDescription = message({
  ja: 'リクエストを必要とするものすべてです。Server Action とそこからの `redirect()`、`@k8ordo/server` の下でページが読む `request`、そしてアプリが決めるステータスコード。ファイルはフォームの送信を受け取れず、`404.html` を 200 ではなく 404 で返すかどうかはホスティングの設定です。ビルドはページを書けても、応答は書けません。',
  en: "Anything that needs the request: Server Actions and `redirect()` from them, the `request` a page reads under `@k8ordo/server`, and status codes the application decides. A file cannot receive a form submission, and whether `404.html` is served with a 404 rather than a 200 is the host's setting — the build can write the page, but not the response.",
});

export const cannotServer = message({
  ja: 'どれかが要るなら、アプリが求めているのは `@k8ordo/server` で、ほかの部分はそのまま使えます。',
  en: 'If the application needs any of that, it wants `@k8ordo/server`, and everything else stays exactly as it is.',
});
