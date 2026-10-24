import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build`の出力を公開できるようにします。staticモードでは`dist/client/`を静的ホスティングに置き、serverモードでは`dist/`を置いて`node dist/server.js`で起動します。',
  en: 'Publish what `vite build` writes. In static mode, `dist/client/` goes on a static host, and in server mode `dist/` goes on the server and starts with `node dist/server.js`.',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const staticTitle = message({
  ja: 'staticモード',
  en: 'Static mode',
});

export const staticLead = message({
  ja: 'staticモードでは、`dist/client/`だけを静的ホスティングで配信します。',
  en: 'In static mode, a static host serves `dist/client/` and nothing else.',
});

export const outputTitle = message({
  ja: 'ビルドの出力',
  en: 'Build output',
});

export const outputList = [
  message({
    ja: '`index.html`：そのURLのページです。描画に使ったペイロードが埋め込まれています。',
    en: '`index.html`: the page at that URL, with the payload it was rendered from embedded.',
  }),
  message({
    ja: '`index.rsc`：同じページのペイロードです。クライアント側の遷移で読み込みます。',
    en: '`index.rsc`: the same page as a payload, fetched on a client navigation.',
  }),
  message({
    ja: '`old/index.html`：`redirect.ts`から書いたページで、行き先へリダイレクトします。隣に`index.rsc`はありません。',
    en: '`old/index.html`: the page written from a `redirect.ts`, which redirects to the target. No `index.rsc` sits beside it.',
  }),
  message({
    ja: '`404.html`：`not-found.tsx`を描画したファイルです。',
    en: '`404.html`: `not-found.tsx`, rendered.',
  }),
  message({
    ja: '`sitemap.xml`：`site`を渡したときだけ書かれます。',
    en: '`sitemap.xml`: written only when `site` is given.',
  }),
  message({
    ja: '`assets/`：クライアントのスクリプトとスタイルです。',
    en: '`assets/`: the client’s scripts and styles.',
  }),
] as const;

export const outputServe = message({
  ja: '`dist/client/`のほかはページの描画に使ったもので、配信しません。',
  en: 'The rest of `dist/` rendered the pages, and is not served.',
});

export const outputLog = message({
  ja: 'ビルドは最後に、書いたルートの数と、`404.html`と`sitemap.xml`を書いたかどうかを1行で出します。数にはリダイレクトのページも含まれます。シェルを書いたときは、その数と場所、`_redirects`も並びます。',
  en: 'The build ends with one line: how many routes it wrote, and whether it wrote `404.html` and `sitemap.xml`. Redirect pages count among the routes. When it wrote shells, the line also gives how many and where, and `_redirects`.',
});

export const outputPayload = message({
  ja: 'ハイドレーションと遷移でのペイロードの使われ方は、',
  en: 'How hydration and navigation use the payloads is covered in ',
});

export const hostTitle = message({
  ja: '静的ホスティング',
  en: 'Static hosts',
});

export const hostRequire = message({
  ja: 'ホスティングには次の3つが必要です。',
  en: 'The host has to do three things.',
});

export const hostList = [
  message({
    ja: '`/products/1`のようなURLに、`products/1/index.html`を返す',
    en: 'Return `products/1/index.html` for a URL like `/products/1`',
  }),
  message({
    ja: '`index.rsc`をそのまま返す（`Content-Type`はHTML以外なら何でもよい）',
    en: 'Serve `index.rsc` as it is, with any `Content-Type` but HTML',
  }),
  message({
    ja: '持っていないURLに`404.html`を返す',
    en: 'Return `404.html` for a URL it does not have',
  }),
] as const;

export const hostUnknown = message({
  ja: 'サイトに無いURLへの遷移では、応答がペイロードでないので、普通の文書の読み込みに切り替わります。ホスティングはその読み込みに`404.html`を返します。`/robots.txt`のように同じoriginに置いた別のファイルへのリンクも、同じ仕組みでファイルそのものが開きます。',
  en: 'A navigation to a URL the site does not have gets a response that is not a payload. It turns into an ordinary document load, and the host returns `404.html` for it. A link to another file on the same origin, such as `/robots.txt`, works the same way: the file itself opens.',
});

export const downloadTitle = message({
  ja: 'ダウンロードのリンク',
  en: 'Download links',
});

export const hostDownload = message({
  ja: 'ホスティングがダウンロードとして返すファイルへのリンクには、`download`属性を付けます。そのリンクはルーターが扱わず、ブラウザがそのままダウンロードします。',
  en: 'Add the `download` attribute to a link to a file the host serves as a download. The router then leaves the link alone, and the browser downloads the file.',
});

export const hostStatus = message({
  ja: '`404.html`に404のステータスを付けるかどうかは、ホスティングの設定です。ビルドが書けるのはページまでで、応答のステータスは書けません。',
  en: 'Whether `404.html` goes out with a 404 status is the host’s setting. The build can write the page, but not the response.',
});

export const notFoundTitle = message({
  ja: '`404.html`の中身',
  en: 'What `404.html` holds',
});

export const notFoundOnce = message({
  ja: '`404.html`は、サイトに無いURLのために1度だけ描画されます。そのURLは、どのルートも宣言しない`__k8ordo-not-found__`という区間でビルドが作ります。`not-found.tsx`より上にパラメータを受け取る区間があれば、その値もこの区間になります。',
  en: '`404.html` is rendered once, for a URL the site does not have. The build makes that URL from `__k8ordo-not-found__`, a segment no route declares. A parameter above `not-found.tsx` receives that segment as its value too.',
});

export const notFoundLocale = message({
  ja: '`[locale]`の下の`not-found.tsx`では、ロケールの`paramsSchema`がこの区間を拒むので、ロケールは設定されません。`404.html`の文言は、既定のロケールで書かれます。JavaScriptが動かない訪問者には、どのURLでもこの文言が出ます。',
  en: 'For a `not-found.tsx` under `[locale]`, the locale’s `paramsSchema` refuses that segment, so no locale is set. The messages in `404.html` are written in the default locale, and that is what a visitor without JavaScript sees at any URL.',
});

export const notFoundHydrate = message({
  ja: 'ブラウザはこのファイルをハイドレーションせず、訪問者が開いたURLで描画し直します。Client Componentは、`usePathname()`で最初の描画から訪問者のURLを読めます。このサイトの`404.html`は日本語で書かれていて、`/en/…`で開くと描画し直した時点で英語になります。',
  en: 'The browser does not hydrate this file. It renders the page again at the URL the visitor opened, and a Client Component reads that URL with `usePathname()` from its first render. This site’s `404.html` is written in Japanese, and opened at an `/en/…` URL it turns English once the browser renders it again.',
});

export const sitemapTitle = message({
  ja: '`sitemap.xml`',
  en: '`sitemap.xml`',
});

export const sitemapWrite = message({
  ja: '`framework()`の`site`にサイトの配信元を渡すと、ビルドは書いたページをすべて並べた`sitemap.xml`も書きます。リダイレクトと`route.ts`の応答、`404.html`はページではないので載りません。',
  en: 'Give `site` the origin the site is served from, and the build also writes `sitemap.xml`, listing every page it wrote. Redirects, `route.ts` responses and `404.html` are not pages, and are left out.',
});

export const sitemapNone = message({
  ja: '`site`を渡さなければ、`sitemap.xml`は書かれません。',
  en: 'Without `site`, no `sitemap.xml` is written.',
});

export const redirectsTitle = message({
  ja: '`_redirects`',
  en: '`_redirects`',
});

export const redirectsWrite = message({
  ja: '`fallback.tsx`のあるページがあると、ビルドはシェルと一緒に`dist/client/_redirects`も書きます。NetlifyとCloudflareが読む書き換えのルールです。ファイルの無い`/posts/3`にはシェルを、そのペイロードにはシェルのペイロードを、URLを変えずに返します。シェルについては、',
  en: 'When a page has a `fallback.tsx`, the build writes `dist/client/_redirects` along with the shell: rewrite rules that Netlify and Cloudflare read. `/posts/3`, which has no file, gets the shell, and its payload URL the shell’s payload, with the URL left as it is. Shells are covered in ',
});

export const redirectsBuilt = message({
  ja: '前半のルールは、書き出したURLにそのURLのファイルを返します。Cloudflareはファイルより先にルールを当てるので、これが無いと書き出したページにもシェルが返ります。ファイルを先に返すNetlifyでは使われません。',
  en: 'The first block answers each URL the build wrote with its own file. Cloudflare applies rules before files, and without these it would answer written pages with the shell too. Netlify serves files first and never reaches them.',
});

export const redirectsOwn = message({
  ja: '`public/_redirects`があれば、その中身を2つのブロックの間に入れます。そこに`/* /index.html 200`のようなルールがあると、シェルより先に当たるので、ビルドが警告します。',
  en: 'A `public/_redirects` of your own goes between the two blocks. A rule there such as `/* /index.html 200` matches before the shells’ rules, and the build warns about it.',
});

export const redirectsBase = message({
  ja: 'Viteの`base`を設定していても、`_redirects`は`dist/client/`の直下に書かれ、どのルールにも`base`が付きます。ホスティングは公開するディレクトリの直下の`_redirects`しか読まないので、そこへ移します。',
  en: 'Under a Vite `base`, `_redirects` is still written at the top of `dist/client/`, with the base on every rule. A host reads `_redirects` only at the top of what it publishes, so move it there.',
});

export const redirectsAssets = message({
  ja: '`/:lang/:id`のように区間がパラメータ2つだけのパターンでは、シェルのルールが無くなった`/assets/x.js`にも当たり、HTMLを返します。',
  en: 'For a pattern of two parameters and nothing else, such as `/:lang/:id`, the shell’s rule also matches a missing `/assets/x.js`, and answers it with HTML.',
});

export const cloudflareTitle = message({
  ja: 'Cloudflare',
  en: 'Cloudflare',
});

export const cloudflareWorkers = message({
  ja: 'Workersの静的アセットで配信するときは、`html_handling`を既定の`auto-trailing-slash`か`force-trailing-slash`にします。シェルのルールは、スラッシュで終わるディレクトリのURLへ書き換えるためです。`drop-trailing-slash`ではリダイレクトがループし、`none`では404になります。またCloudflareでは、ビルドしていない値の`/posts/3/`のように末尾にスラッシュがあるとシェルのルールが当たらず、404になります。',
  en: 'On Workers static assets, keep `html_handling` at the default `auto-trailing-slash`, or set `force-trailing-slash`: the shell rules rewrite to a directory URL that ends in a slash. Under `drop-trailing-slash` the redirects loop, and under `none` the shell is a 404. Cloudflare also tells a trailing slash apart: a value the build did not write, asked for as `/posts/3/`, matches no shell rule and gets a 404, where other hosts answer it with the shell.',
});

export const cloudflareNotFound = message({
  ja: '`404.html`を返すには、`not_found_handling`を`"404-page"`にします。ファイルより先に動くWorkerのスクリプトがあると、`_redirects`は読まれません。Pagesのスラッシュの扱いは`auto-trailing-slash`と同じで、変える設定はありません。',
  en: 'To serve `404.html`, set `not_found_handling` to `"404-page"`. A Worker script that runs before the files bypasses `_redirects`. Pages handles slashes as `auto-trailing-slash` does, with no setting to change it.',
});

export const cloudflareLimits = message({
  ja: 'Cloudflareが読むルールは、固定のURLが2,000個、パラメータを含むものが100個までです。書き出した値1つに固定のルールが2つ要るので、シェルのあるパターンの下に書き出せるページはおよそ1,000です。超えるとビルドが警告します。',
  en: 'Cloudflare reads at most 2,000 rules for fixed URLs and 100 with parameters. Each value written under a pattern with a shell takes two fixed rules, so about 1,000 such pages fit. The build warns when a limit is passed.',
});

export const staticVercelTitle = message({
  ja: 'Vercel',
  en: 'Vercel',
});

export const staticVercelOutput = message({
  ja: 'Vercelは`_redirects`を読みません。`vercel()`を`framework()`の隣に置くと、ビルドは`.vercel/output/`も書きます。書き出したファイルを静的ファイルとして置き、`_redirects`と同じ書き換えをルートとして書きます。関数は作りません。',
  en: 'Vercel does not read `_redirects`. Put `vercel()` beside `framework()`, and the build also writes `.vercel/output/`: the written files as static files, and the same rewrites as routes, with no function.',
});

export const staticVercelWarn = message({
  ja: 'Vercelの上で`vercel()`の無いビルドがシェルを書くと、ビルドが警告します。そのままでは、シェルを返すものが無いためです。',
  en: 'A build on Vercel that writes shells without `vercel()` warns: nothing would serve them.',
});

export const vercelRoutesTitle = message({
  ja: 'Vercelでのアプリのルート',
  en: 'Routes of your own on Vercel',
});

export const vercelRoutesLead = message({
  ja: 'staticモードの`vercel()`は、アプリのルートも受け取ります。VercelのBuild Output APIのルートを、`.vercel/output/config.json`の2か所に渡したまま書きます。使えるのは`src`と`dest`、`status`、`headers`、`continue`、`check`、`caseSensitive`、`has`です。`src`はパス名の正規表現です。',
  en: 'Under static mode, `vercel()` also takes routes of the application’s own: routes of Vercel’s Build Output API (`src`, `dest`, `status`, `headers`, `continue`, `check`, `caseSensitive`, `has`), written as given in two places of `.vercel/output/config.json`. `src` is a regular expression for the pathname.',
});

export const vercelRoutesFilesCallout = message({
  ja: '書き出したファイル',
  en: 'The files the build wrote',
});

export const vercelRoutesRewritesCallout = message({
  ja: 'シェルへの書き換え（`_redirects`と同じもの）',
  en: 'The rewrites to the shells, the same as `_redirects`',
});

export const vercelRoutesNotFoundCallout = message({
  ja: 'ビルドが`404.html`を書いたときだけ',
  en: 'Only when the build wrote `404.html`',
});

export const vercelRoutesAssetsCallout = message({
  ja: '`assets/`に`immutable`を付ける',
  en: 'Adds `immutable` to `assets/`',
});

export const vercelRoutesPlaces = [
  message({
    ja: '`beforeFiles`：どのファイルよりも先に当てます。全ページのヘッダーや、あるファイルより先に当てたいリダイレクトと書き換えを置きます。',
    en: '`beforeFiles`: tried before any file. For headers on every answer, and a redirect or a rewrite that has to win over a file that is there.',
  }),
  message({
    ja: '`beforeNotFound`：ファイルにもシェルにも当たらなかったときに、`404.html`より先に当てます。ここに置いた全パスのルートがシェルを隠すことはありません。外のオリジンへの中継や、本文の違う404を置きます。',
    en: '`beforeNotFound`: tried once neither a file nor a shell answered, before `404.html`, so a catch-all there never hides a shell. For a proxy to another origin, or a 404 of another body.',
  }),
] as const;

export const vercelRoutesExample = [
  message({
    ja: 'ヘッダーを足すだけのルートは`continue: true`にし、答えるルートより前に置きます。答えるルートで照合が終わるためです。`beforeFiles`で足したヘッダーは、ルートを通ったどの応答にも付きます。ファイルとリダイレクト、`404.html`、`dest`と`status`の応答、外のオリジンから中継した応答です。',
    en: 'A route that only adds headers says `continue: true`, and comes before the route that answers: an answering route ends the matching. What `beforeFiles` adds this way is on every answer the routes lead to: a file, a redirect, `404.html`, a `dest` with a `status`, an answer proxied from another origin.',
  }),
  message({
    ja: 'リダイレクトは末尾のスラッシュを外し、クエリを引き継ぎます。`/about/?x=1`は`/about?x=1`へ送られ、Vercelは`/about`に`about/index.html`をそのまま返します。パターンは空の区間を許さないので、`Location: //evil.test`（ブラウザは別のオリジンと読みます）を返すことはありません。`//evil.test/`には、どのルートより先にVercel自身が`/evil.test/`への308を返します。この308にはアプリのヘッダーが付きません。',
    en: 'The redirect takes the trailing slash off and keeps the query: `/about/?x=1` goes to `/about?x=1`, which Vercel answers from `about/index.html` as it is. Its pattern takes no empty segment, so it never answers with `Location: //evil.test`, which a browser reads as another origin. Vercel itself answers `//evil.test/` before any route, with a 308 to `/evil.test/` that carries none of your headers.',
  }),
  message({
    ja: '`check: true`は`dest`をファイルの中から探します。無ければ、書き換えた後のパスで先へ進みます。`beforeNotFound`のルートが見るのは、`/posts/nope`でなく`/posts/nope/article.md`です。この例では`routes/posts/[slug]/article.md/`の`route.ts`が記事ごとのmarkdownを書き、markdownを求めるクライアントにはそれを返します。`paths`は、ページとmarkdownを記事の同じ一覧から返し、片方だけの記事を作らないようにします。',
    en: '`check: true` looks for `dest` among the files. When none is there, the matching goes on with `dest` as the pathname: `beforeNotFound` sees `/posts/nope/article.md`, not `/posts/nope`. Here a `route.ts` at `routes/posts/[slug]/article.md/` wrote each post’s markdown, and a client asking for markdown is answered with it. Have `paths` give the pages and their markdown from one list of posts, so no post is written without the other.',
  }),
  message({
    ja: '`has`は、ヘッダーの値を`value`の正規表現で照合するだけです。`.*text/markdown.*`は`Accept: text/markdown, text/html;q=0.9`に当たります。ブラウザの`text/html,application/xhtml+xml,*/*;q=0.8`は、`*/*`を含みますが当たりません。',
    en: '`has` matches the header’s text against `value`, a regular expression, and negotiates nothing: `.*text/markdown.*` takes `Accept: text/markdown, text/html;q=0.9`, and not a browser’s `text/html,application/xhtml+xml,*/*;q=0.8`, though `*/*` would take markdown.',
  }),
  message({
    ja: '中継は2つのルートに分けます。ヘッダーはファイルの前に、答える`dest`はファイルの後に置きます。`dest`にはリクエストのクエリが付くので、`/feed?page=2`は`https://api.example.com/feed?page=2`を取りに行きます。',
    en: 'A proxy is two routes: its headers ahead of the files, and the `dest` that answers after them. The `dest` is asked with the request’s query: `/feed?page=2` fetches `https://api.example.com/feed?page=2`.',
  }),
  message({
    ja: '`dest`と`status`を組むと、そのファイルをその状態で返します。ビルド自身の`404.html`と同じ形です。',
    en: '`dest` with `status` answers with that file under that status, as the build’s own `404.html` route does.',
  }),
] as const;

export const vercelRoutesLocal = message({
  ja: 'これらのルートを当てるのはVercelだけです。`vite dev`と`vite preview`、`serve()`は、ヘッダーもリダイレクトも`Accept`での出し分けも無いものとして答えます。Vercelと違う真似は、手元で通って本番で違うので、真似をしません。',
  en: 'Only Vercel applies these routes. `vite dev`, `vite preview` and `serve()` answer as if they were not there: no header, no redirect, nothing decided by `Accept`. An imitation of Vercel’s routing that differed from it would pass locally and fail once deployed, so there is none.',
});

export const vercelRoutesMind = [
  message({
    ja: 'Vercelは`src`をパス名の全体に当て、クエリは含めません。頭だけを書いた`^/posts/`は`/posts/first`に当たらないので、`^/posts/.+$`と書きます。',
    en: 'Vercel matches `src` against the whole pathname, never just its start, and never the query: `^/posts/` does not match `/posts/first`, and `^/posts/.+$` does.',
  }),
  message({
    ja: '全パスに当たるルートに`Cache-Control`を置きません。そのルートは、`vercel()`が後ろの`hit`のルートで`immutable`を付ける`assets/`の下も含め、すべてのファイルに当たります。`Cache-Control`は、向けたいパスを`src`に書いたルートに置きます。',
    en: 'Put no `Cache-Control` in a route every path takes. It reaches every file too, those under `assets/` among them, which `vercel()` marks `immutable` in the `hit` phase, after yours. Give a `Cache-Control` a `src` that names the paths it is for.',
  }),
  message({
    ja: 'Vercelは、`caseSensitive: true`の無いルートの`src`を大文字小文字を区別せずに照合します。`vercel()`自身が書くルートは、ルートの表と同じく区別します。',
    en: 'Vercel matches `src` regardless of case unless the route says `caseSensitive: true`, while the routes `vercel()` writes itself are case-sensitive, as the route table is.',
  }),
  message({
    ja: '`has`のヘッダーの`key`は小文字で書きます。ほかの書き方は`vercel()`を呼んだ時点でエラーになります。',
    en: 'Write a `has` header’s `key` in lowercase. Another spelling is refused when `vercel()` is called.',
  }),
  message({
    ja: 'ほかは検査しません。`base`の下でも渡したまま書くので、`src`と`dest`に`base`を含めます。パターンはVercelのもの（PCRE）で、間違いはデプロイして初めて分かるので、変更はプレビューのデプロイで先に確かめます。',
    en: 'Nothing else is checked. The routes are written as given, so under a `base` their `src` and `dest` carry it, and their patterns are Vercel’s (PCRE): a mistake shows once deployed, so try a change on a preview deployment first.',
  }),
  message({
    ja: 'serverモードでは受け取りません。ファイルの無いURLにはハンドラが答えるので、`guard.ts`や`route.ts`で返すものを決めます。渡すとビルドがエラーになります。',
    en: 'Server mode takes none: the handler answers every URL no file names, and a `guard.ts` or a `route.ts` decides what it sends. The build refuses them there.',
  }),
] as const;

export const otherHostsTitle = message({
  ja: 'ほかのホスティング',
  en: 'Other hosts',
});

export const otherHostsRules = message({
  ja: '`_redirects`を読まないホスティングでは、シェルの場所ごとに次の2つを設定します。どちらもURLを変えずにファイルを返す書き換えで、ファイルが無いときにだけ当てます。',
  en: 'On a host that does not read `_redirects`, set up these two rewrites for each shell location. Both answer with a file and leave the URL as it is, and apply only when no file answers.',
});

export const otherHostsList = [
  message({
    ja: '`/posts/:id`を`/posts/!fallback/index.html`へ',
    en: '`/posts/:id` to `/posts/!fallback/index.html`',
  }),
  message({
    ja: '`/posts/:id/index.rsc`を`/posts/!fallback/index.rsc`へ（無いと、遷移が文書の読み込みに変わります）',
    en: '`/posts/:id/index.rsc` to `/posts/!fallback/index.rsc` (without it, a navigation turns into a document load)',
  }),
] as const;

export const otherHostsMore = message({
  ja: '`:id`は区間1つに当たります。シェルの場所の下に`redirect.ts`か`route.ts`を書き出したときは、そのペイロードのURLにシェルのHTMLを返すルールを、2つ目より先に置きます。ルールをファイルより先に当てるホスティングでは、書き出したファイルにそのファイルを返すルールを先頭に並べます。',
  en: '`:id` matches one segment. When a `redirect.ts` or `route.ts` was written under a shell location, answer its payload URL with the shell’s HTML, in a rule placed before the second one. A host that applies rules before files needs, first of all, a rule answering each written file with itself.',
});

export const otherHostsPages = message({
  ja: 'GitHub Pagesのように書き換えの無いホスティングでは、シェルは使えません。ビルドしていない値には`404.html`が返ります。',
  en: 'A host without rewrites, such as GitHub Pages, cannot use shells: a value the build did not write gets `404.html`.',
});

export const localTitle = message({
  ja: '手元での確認',
  en: 'Checking locally',
});

export const localPreview = message({
  ja: '`vite preview`は、staticモードのビルドをホスティングと同じように配信します。`dist/client/`のファイルを返し、無ければ`_redirects`の書き換えをNetlifyと同じ順で当てます。どれにも当たらなければ`404.html`を404で返し、`GET`と`HEAD`のほかには`405`を返します。',
  en: '`vite preview` serves a static build the way a host does: the files in `dist/client/`, then the rewrites in `_redirects`, applied as Netlify applies them. When nothing matches it answers `404.html` with a 404, and any method but `GET` and `HEAD` with a `405`.',
});

export const localFiles = message({
  ja: 'ページを描き直すことはないので、書き出したファイルとCSPの`<meta>`をそのまま確かめられます。`@k8ordo/framework/serve`の`serve()`も、staticモードのビルドを同じように配信します。',
  en: 'Nothing is rendered again, so what you check is the files as written, CSP `<meta>` included. `serve()` from `@k8ordo/framework/serve` serves a static build the same way.',
});

export const serverTitle = message({
  ja: 'serverモード',
  en: 'Server mode',
});

export const serverLead = message({
  ja: 'serverモードでは、ビルドがリクエストごとにページを描画するハンドラと、それを動かすサーバーを書き出します。',
  en: 'In server mode, the build writes a handler that renders a page per request, and a server that runs it.',
});

export const serverOutputTitle = message({
  ja: 'ビルドの出力',
  en: 'Build output',
});

export const outputHandler = message({
  ja: '`dist/client/`にページのHTMLはありません。',
  en: '`dist/client/` holds no page HTML.',
});

export const serverOutputList = [
  message({
    ja: '`dist/server.js`：Node.jsで起動するサーバーです。',
    en: '`dist/server.js`: the server, started with Node.js.',
  }),
  message({
    ja: '`dist/package.json`：`dist/`の中の`.js`をES Moduleとして読ませます。',
    en: '`dist/package.json`: makes the `.js` files in `dist/` load as ES modules.',
  }),
  message({
    ja: '`dist/rsc/index.js`：リクエストハンドラです。',
    en: '`dist/rsc/index.js`: the request handler.',
  }),
  message({
    ja: '`dist/ssr/`：ハンドラがペイロードをHTMLにするときに使います。',
    en: '`dist/ssr/`: what the handler uses to turn a payload into HTML.',
  }),
  message({
    ja: '`dist/client/`：ブラウザに配信するファイルです。圧縮の効く種類のファイルには、Brotliとgzipで圧縮したコピー（`.br`と`.gz`）が隣に置かれます。',
    en: '`dist/client/`: the files served to the browser. A file whose type compresses gets a Brotli and a gzip copy beside it (`.br` and `.gz`).',
  }),
] as const;

export const outputDeps = message({
  ja: 'ビルドは、サーバーとハンドラが使う依存をすべて`dist/`にバンドルします。外に残るのはNode.jsの組み込みモジュールだけです。実行時に`node_modules`を読まないので、`@k8ordo/framework`と`@k8ordo/router`は`devDependencies`に入れます。',
  en: 'The build bundles every dependency the server and the handler use into `dist/`. Only Node.js’s built-in modules stay outside. Nothing reads `node_modules` at run time, so `@k8ordo/framework` and `@k8ordo/router` go in `devDependencies`.',
});

export const startTitle = message({
  ja: '起動',
  en: 'Starting',
});

export const startRun = message({
  ja: '`dist/`をサーバーに置き、`node dist/server.js`で起動します。インストールは要りません。アプリの`package.json`も`node_modules`も無い場所で動きます。',
  en: 'Put `dist/` on the server and start it with `node dist/server.js`. Nothing needs installing: it runs where neither the application’s `package.json` nor `node_modules` exists.',
});

export const startEnv = [
  message({
    ja: '`PORT`：待ち受けるポートです。既定は`3000`です。',
    en: '`PORT`: the port to listen on. `3000` by default.',
  }),
  message({
    ja: '`HOST`：待ち受けるホストです。既定の`localhost`には同じマシンからしか接続できないので、コンテナの中などでは`0.0.0.0`にします。Nodeは`localhost`のアドレスのうち1つ、多くは`::1`だけで待ち受けます。同じマシンのプロキシからは`127.0.0.1`でなく`localhost`を指すか、`HOST=127.0.0.1`にします。',
    en: '`HOST`: the host to listen on. The default `localhost` accepts connections from the same machine only, so inside a container set it to `0.0.0.0`. Node listens on one of the addresses `localhost` names, often only `::1`, so point a proxy on the same machine at `localhost` rather than `127.0.0.1`, or set `HOST=127.0.0.1`.',
  }),
] as const;

export const startStop = message({
  ja: '`SIGTERM`か`SIGINT`を受けると、新しい接続を断り、処理中の応答を返し終えてから終了コード`0`で終わります。コンテナの最初のプロセスとして起動しても、止める指示ですぐに止まります。',
  en: 'On `SIGTERM` or `SIGINT` it stops taking connections, finishes the answers already under way, and exits with `0`. Started as a container’s first process, it still stops as soon as it is told to.',
});

export const externalTitle = message({
  ja: 'バンドルできない依存',
  en: 'Dependencies that cannot be bundled',
});

export const externalWhy = message({
  ja: 'ネイティブのバイナリを持つ依存や、自分のファイルをパスで読む依存は、バンドルすると動きません。`rsc`環境の`resolve.external`に名前を書くと、その依存だけがバンドルから外れます。',
  en: 'A dependency that ships a native binary, or reads its own files by path, stops working once bundled. Name it in the `rsc` environment’s `resolve.external`, and that dependency alone is left out of the bundle.',
});

export const externalInstall = message({
  ja: '外した依存は`dependencies`に入れ、実行時にインストールします。`npm install --omit=dev`のように開発時の依存を省いてインストールし、アプリのディレクトリの中で`dist/server.js`を起動します。',
  en: 'Keep a dependency left out this way in `dependencies` and install it for run time. Install without development dependencies, as `npm install --omit=dev` does, and start `dist/server.js` inside the application’s directory.',
});

export const serveTitle = message({
  ja: '`serve()`',
  en: '`serve()`',
});

export const serveRun = message({
  ja: '`dist/server.js`が動かすのは、`@k8ordo/framework/serve`の`serve()`です。自前のサーバーから呼ぶときは、`@k8ordo/framework`を`dependencies`に入れ、実行時にもインストールします。オプションは3つです。',
  en: '`dist/server.js` runs `serve()` from `@k8ordo/framework/serve`. To call it from a server of your own, put `@k8ordo/framework` in `dependencies` and install it for run time as well. It takes three options.',
});

export const serveOptions = [
  message({
    ja: '`dist`：ビルドの出力ディレクトリです。既定は`dist`で、今の作業ディレクトリから解決します。',
    en: '`dist`: the build output directory. `dist` by default, resolved from the working directory.',
  }),
  message({
    ja: '`port`：待ち受けるポートです。既定は`3000`で、`0`を渡すと空いているポートをシステムが選びます。',
    en: '`port`: the port to listen on. `3000` by default; `0` lets the system pick a free one.',
  }),
  message({
    ja: '`host`：待ち受けるホストです。既定の`localhost`には同じマシンからしか接続できないので、コンテナの中などでは`0.0.0.0`を渡します。',
    en: '`host`: the host to listen on. The default `localhost` accepts connections from the same machine only, so inside a container pass `0.0.0.0`.',
  }),
] as const;

export const serveReturn = message({
  ja: '返り値には`url`と`port`、`close()`があります。テストからビルドに対してサーバーを立て、終わったら止められます。',
  en: 'The return value has `url`, `port` and `close()`, so a test can start a server against the build and stop it when done.',
});

export const answersTitle = message({
  ja: '`serve()`の応答',
  en: 'How `serve()` responds',
});

export const answersFiles = message({
  ja: '`GET`と`HEAD`のうち、`dist/client/`の中のファイルを指すリクエストには、そのファイルを返します。それ以外のリクエストは、すべてハンドラに渡します。',
  en: 'A `GET` or `HEAD` that names a file in `dist/client/` is answered with that file. Every other request goes to the handler.',
});

export const answersList = [
  message({
    ja: 'キャッシュ：`/assets/`の下はファイル名に中身のハッシュが入っています。`immutable`を付けて1年キャッシュさせます。それ以外のファイルは`no-cache`です。',
    en: 'Caching: files under `/assets/` carry a hash of their contents in their names. They are sent `immutable` and cached for a year. Any other file is `no-cache`.',
  }),
  message({
    ja: '圧縮：圧縮したコピーがあるファイルは、`Accept-Encoding`が選ぶほうを返します。ページとペイロードは、圧縮しながらストリーミングします。',
    en: 'Compression: a file with compressed copies is sent in the one `Accept-Encoding` prefers. Pages and payloads are compressed as they stream.',
  }),
  message({
    ja: '再検証：ファイルには中身から作った`ETag`が付きます。同じソースから別々にビルドしたサーバーでも、再検証は`304`で終わります。',
    en: 'Revalidation: a file’s `ETag` is derived from its contents, so a revalidation ends in a `304` even against another server built from the same source.',
  }),
  message({
    ja: '範囲：1つの範囲を求める`Range`には`206`で答えます。Safariが`<video>`を再生するのに必要です。',
    en: 'Ranges: a `Range` asking for one span gets a `206`, which Safari needs before it plays a `<video>`.',
  }),
  message({
    ja: '失敗：ハンドラがエラーになったときは、`500`と本文`internal error`だけを返します。エラーの内容は、訪問者でなくサーバーのログに出ます。',
    en: 'Failure: when the handler throws, the response is a `500` with the body `internal error`. The error itself goes to the server’s log, not to the visitor.',
  }),
] as const;

export const answersSafe = message({
  ja: 'パスに`..`や`%2e%2e`が含まれていても、`dist/client/`の外のファイルは返しません。',
  en: 'Even with `..` or `%2e%2e` in the path, no file outside `dist/client/` is served.',
});

export const handlerTitle = message({
  ja: 'ほかのランタイム',
  en: 'Other runtimes',
});

export const handlerExport = message({
  ja: '`dist/rsc/index.js`は、`(request: Request) => Promise<Response>`の関数をdefault exportしています。ハンドラは隣の`dist/ssr/`を読み込むので、2つは同じ場所に置きます。依存はバンドル済みなので、インストールは要りません。',
  en: '`dist/rsc/index.js` default-exports a function of type `(request: Request) => Promise<Response>`. The handler loads `dist/ssr/` from beside itself, so keep the two in the same place. Its dependencies are bundled in, so nothing needs installing.',
});

export const handlerRuntime = message({
  ja: 'Webの`Request`と`Response`、ストリームのほかに、ハンドラが実行環境に求めるのは`node:async_hooks`の`AsyncLocalStorage`だけです。Node.jsとBunとDeno、`nodejs_compat`を付けたCloudflare Workersで、importしたハンドラをそのまま渡せます。',
  en: 'Beyond the web’s `Request`, `Response` and streams, the only thing the handler needs from its runtime is `AsyncLocalStorage` from `node:async_hooks`. Node.js, Bun, Deno, and Cloudflare Workers with `nodejs_compat` all take the imported handler as it is.',
});

export const handlerFiles = message({
  ja: 'ハンドラはファイルを配信しません。ハンドラの前で`dist/client/`を配信し、どのファイルにも一致しないリクエストだけをハンドラに渡します。Workersでは、`wrangler.jsonc`の`assets.directory`に`dist/client`を指定します。',
  en: 'The handler serves no files. Serve `dist/client/` in front of it, and pass it only the requests that match no file. On Workers, set `assets.directory` in `wrangler.jsonc` to `dist/client`.',
});

export const handlerNode = message({
  ja: '`route.ts`やServer Actionで`node:fs`のようなNode.js専用のモジュールをimportできます。ただし、アプリはそのモジュールを持つランタイムでしか動かなくなります。',
  en: 'A `route.ts` or Server Action can import a Node.js-only module such as `node:fs`. The application then runs only on a runtime that has it.',
});

export const proxyTitle = message({
  ja: 'プロキシの後ろ',
  en: 'Behind a proxy',
});

export const proxyOrigin = message({
  ja: 'ハンドラは`Origin`ヘッダーのホストとURLのホストを比べて`POST`を受け付けるので、`Request`は訪問者が求めたURLで作ります。この検査については、',
  en: 'The handler accepts a `POST` by comparing the host in its `Origin` header with the host of the URL, so the `Request` has to carry the URL the visitor asked for. The check is covered in ',
});

export const proxyServe = message({
  ja: '`serve()`はリクエストの`Host`ヘッダーからURLを作り、転送用のヘッダーは読みません。前に置くプロキシは、元の`Host`を書き換えずに渡してください。ホストを含むリクエスト行（`GET http://…`）や、ホストとして読めない`Host`には`400`を返します。',
  en: '`serve()` builds the URL from the request’s `Host` header and reads no forwarding header. A proxy in front of it has to pass the original `Host` on unchanged. A request line that names a host of its own (`GET http://…`), or a `Host` that is not a host, gets a `400`.',
});

export const proxyBuild = message({
  ja: 'パスからURLを自分で作るホストは、`new URL(path, origin)`で解決せず、originの後ろに文字列としてつなぎます。解決すると、`//evil.test/`で始まるパスが`evil.test`のURLになり、別のサイトのフォームがこの検査を通ってしまいます。',
  en: 'A host that builds the URL from a path itself appends the path to the origin as text rather than resolving it with `new URL(path, origin)`. Resolved, a path starting with `//evil.test/` becomes a URL on `evil.test`, and a form on another site would pass the check.',
});

export const vercelTitle = message({
  ja: 'Vercel',
  en: 'Vercel',
});

export const vercelOutput = message({
  ja: '`@k8ordo/framework/vercel`の`vercel()`を`framework()`の隣に足すと、`vite build`はVercelのBuild Output API（v3）の形で`.vercel/output/`も書きます。`vercel deploy --prebuilt`で、それをそのままデプロイできます。',
  en: 'Add `vercel()` from `@k8ordo/framework/vercel` beside `framework()`, and `vite build` also writes `.vercel/output/` in the shape of Vercel’s Build Output API (v3). `vercel deploy --prebuilt` deploys it as it is.',
});

export const vercelFunction = message({
  ja: 'クライアントのビルドは、VercelのCDNに置く静的ファイルになります。どのファイルにも一致しないリクエストは、Node.jsの関数1つが処理します。その関数の中身がリクエストハンドラです。`serve()`のために圧縮したコピーは入れません。',
  en: 'The client build becomes static files on Vercel’s CDN, and every request that matches no file goes to one Node.js function, which is the request handler. The copies compressed for `serve()` are left out.',
});

export const vercelBundle = message({
  ja: 'Vercelの関数は自分のディレクトリの中身しか持てません。ハンドラは依存をすべてバンドルしているので、そのまま関数になります。`resolve.external`で外した依存は関数に入らないので、Vercelでは動きません。',
  en: 'A Vercel function holds nothing but its own directory. The handler has every dependency bundled in, so it becomes the function as it is. A dependency left out with `resolve.external` is not in the function, and does not work on Vercel.',
});

export const tabsTitle = message({
  ja: 'デプロイ前に開いたタブ',
  en: 'Tabs opened before a deploy',
});

export const tabsScript = message({
  ja: '開いたままのタブは、読み込んだときのスクリプトを動かし続けます。遷移で読み込むペイロードは今のデプロイから送られ、タブのスクリプトに無いClient Componentを含むことがあります。ペイロードには、対応するクライアントスクリプトのURLが入っています。',
  en: 'A tab that stays open keeps running the script it loaded. The payloads it fetches on navigation come from the current deploy, and may include a Client Component that script does not have. Every payload records the URL of the client script it was rendered for.',
});

export const tabsReload = message({
  ja: 'タブのスクリプトと合わないペイロードは描画せず、同じURLを文書として読み込み直します。訪問者は`error.tsx`でなく、新しいスクリプトで描画したページを見ます。スクリプトのURLには、読み込むものすべてのハッシュが入っています。ブラウザで動くものを変えなかったデプロイなら、タブはそのまま遷移を続けます。',
  en: 'A payload that does not match the tab’s script is not rendered. The same URL is loaded as a document instead, and the visitor sees the page rendered by the new script rather than `error.tsx`. The script’s URL includes a hash of everything it loads. After a deploy that changed nothing the browser runs, open tabs keep navigating as before.',
});

export const tabsMode = message({
  ja: 'serverモードでは、Server Actionの応答も同じです。スクリプトと合わない応答は反映せず、ページを読み込み直します。',
  en: 'In server mode, the same goes for a Server Action’s response: one that does not match the script is not applied, and the page is loaded again.',
});

export const baseTitle = message({
  ja: 'サブパスでの配信',
  en: 'Serving under a subpath',
});

export const baseConfig = message({
  ja: '`https://example.com/docs/`のように、originの直下以外で配信するときは、そのパスをViteの`base`に書きます。アプリのほかの部分は変わりません。`routes/products/page.tsx`は、ルート表では`/products`で、アドレスバーでは`/docs/products`です。この2つのあいだでは、次のものに`base`が付いたり外れたりします。',
  en: 'To serve below the root of the origin, such as `https://example.com/docs/`, set that path as Vite’s `base`; nothing else in the application changes. `routes/products/page.tsx` is `/products` in the route table and `/docs/products` in the address bar. Between the two, the base is added or removed as follows.',
});

export const baseList = [
  message({
    ja: '`href()`と`navigateTo()`：`href()`が返すURLと、`navigateTo()`の遷移先には`base`が付きます。',
    en: '`href()` and `navigateTo()`: `href()` returns the URL with the base, and `navigateTo()` navigates to it with the base.',
  }),
  message({
    ja: '`pathname`と`usePathname()`：`base`を外した値です。',
    en: '`pathname` and `usePathname()`: the value without the base.',
  }),
  message({
    ja: 'ペイロードとクライアントのファイル：`/docs/products/index.rsc`や`/docs/assets/`のように、`base`の下に置かれます。',
    en: 'Payloads and client files: below the base, as `/docs/products/index.rsc` and `/docs/assets/`.',
  }),
  message({
    ja: '`redirect.ts`の行き先：ルート表と同じくアプリのルートから書き、送るときに`base`が付きます。別のoriginの行き先はそのまま送ります。',
    en: 'A `redirect.ts` target: written from the root like the route table, and sent with the base in front. A target on another origin is sent as written.',
  }),
  message({
    ja: '`base`の外のURL：serverモードではハンドラが`404`を返します。どちらのモードでも、クライアントのランタイムはその遷移を扱わず、ブラウザが通常どおり読み込みます。',
    en: 'A URL outside the base: in server mode the handler returns `404`. In either mode the client runtime does not handle the navigation, and the browser loads it as usual.',
  }),
] as const;

export const baseRedirect = message({
  ja: 'serverモードでServer Actionから呼ぶ`redirect()`と、`guard.ts`が返す`Response`の`location`：`base`を付けずにそのまま送ります。どちらもURLなので`href()`で作ります。ほかの方法で作ったパスには、`@k8ordo/framework`の`withBase()`で`base`を付けます。',
  en: 'In server mode, `redirect()` from a Server Action and the `location` of a `Response` a `guard.ts` returns: sent as written, without the base. Both are URLs, so build them with `href()`. Give a path built some other way its base with `withBase()` from `@k8ordo/framework`.',
});

export const baseStatic = message({
  ja: 'staticモードでは、ページはルート表のパスのまま`dist/client/`に書かれます。ホスティングはこのディレクトリを`/docs/`で配信します。`paths`には`base`を除いたパスを渡します。`sitemap.xml`には`base`を含めたURLが載ります。',
  en: 'In static mode, pages are written into `dist/client/` at their paths in the route table, and the host serves that directory at `/docs/`. `paths` takes paths without the base. `sitemap.xml` lists URLs with it.',
});

export const baseServer = message({
  ja: 'serverモードでは、`serve()`がビルドの使った`base`を`dist/rsc/index.js`から読み、クライアントのファイルをその下で配信します。ハンドラを自分で呼ぶホストは、訪問者が求めたとおり`base`を含めたURLを渡します。',
  en: 'In server mode, `serve()` reads the base the build was made for from `dist/rsc/index.js`, and serves the client files below it. A host that calls the handler itself passes the URL as the visitor asked for it, base included.',
});

export const baseRefused = message({
  ja: "`base`はルートから始まるパスにします。`./`のような相対パスや別のoriginでは、`k8ordo serves its pages under Vite's base, so base has to be a path from the root`で始まるエラーになり、ビルドできません。",
  en: "`base` has to be a path from the root. With a relative path like `./`, or another origin, the build stops with an error that begins `k8ordo serves its pages under Vite's base, so base has to be a path from the root`.",
});
