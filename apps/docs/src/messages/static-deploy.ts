import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`vite build`は、すべてのページを描いて`dist/client/`に書き出します。このディレクトリがサイトそのもので、どの静的ホスティングにも置けます。このページでは、書き出されるファイルとホスティングに求めること、`404.html`、サブパスでの配信を説明します。',
  en: '`vite build` renders every page into `dist/client/`. That directory is the site itself, ready for any static host. This page covers what is written, what the host has to do, `404.html`, and serving under a subpath.',
});

export const outputTitle = message({
  ja: 'ビルドが書き出すもの',
  en: 'What the build writes',
});

export const outputDescription = message({
  ja: '配信するのは`dist/client/`です。`dist/rsc/`と`dist/ssr/`はページを描くのに使ったもので、配信はしません。',
  en: 'What you serve is `dist/client/`. `dist/rsc/` and `dist/ssr/` are what rendered the pages, and are not served.',
});

export const outputList = [
  message({
    ja: '`index.html`：そのURLのページです。描画に使ったペイロードが埋め込まれています。',
    en: '`index.html`: the page at that URL, with the payload it was rendered from written in.',
  }),
  message({
    ja: '`index.rsc`：同じページのペイロードです。クライアント側の遷移で取りに行きます。',
    en: '`index.rsc`: the same page as a payload, fetched by a client navigation.',
  }),
  message({
    ja: '`old/index.html`：`redirect.ts`から書いた、訪問者を行き先へ送るページです。横に`index.rsc`はありません。',
    en: '`old/index.html`: the page a `redirect.ts` became, which sends the visitor on. No `index.rsc` sits beside it.',
  }),
  message({
    ja: '`404.html`：`not-found.tsx`を描いたものです。',
    en: '`404.html`: `not-found.tsx`, rendered.',
  }),
  message({
    ja: '`sitemap.xml`：`site`を渡したときに書かれます。',
    en: '`sitemap.xml`: written when `site` is given.',
  }),
  message({
    ja: '`assets/`：クライアントのスクリプトとスタイルです。',
    en: '`assets/`: the client’s scripts and styles.',
  }),
] as const;

export const outputLog = message({
  ja: 'ビルドは最後に、書いたルートの数と、`404.html`と`sitemap.xml`を書いたかどうかを1行で知らせます。数には、リダイレクトのページも含まれます。',
  en: 'The build ends by reporting in one line how many routes it wrote, and whether it wrote `404.html` and `sitemap.xml`. Redirect pages count among the routes.',
});

export const arriveTitle = message({
  ja: 'ページの届き方',
  en: 'How a page arrives',
});

export const arriveDescription = message({
  ja: 'ページは、描画に使ったペイロードを埋め込んだHTMLとして届きます。hydrationはそのペイロードを読むので、同じページをもう一度取りに行くことはありません。',
  en: 'A page arrives as HTML with the payload it was rendered from written in, so hydration reads that instead of asking for the page again.',
});

export const arriveNavigate = message({
  ja: 'その後で別のページへのリンクを押すと、文書を読み込み直さずに、そのページの`index.rsc`を取りに行きます。サイトはファイルの集まりですが、遷移はブラウザの中で済みます。',
  en: 'From there, a link to another page fetches that page’s `index.rsc` rather than reloading the document: the site is a pile of files, but navigation stays in the browser.',
});

export const hostTitle = message({
  ja: '静的ホスティングに置く',
  en: 'Put it on a static host',
});

export const hostDescription = message({
  ja: '`dist/client/`をそのまま配れるホスティングなら、どれでも使えます。求めるのは次の3つです。',
  en: 'Any host that serves `dist/client/` as it is will do. It has to do three things:',
});

export const hostList = [
  message({
    ja: '`/products/1`のようなURLに、`products/1/index.html`で答える',
    en: 'Answer a URL like `/products/1` with `products/1/index.html`',
  }),
  message({
    ja: '`index.rsc`をそのまま返す（content typeはHTML以外なら何でも構わない）',
    en: 'Serve `index.rsc` as it is; any content type but HTML will do',
  }),
  message({
    ja: '持っていないURLに、`404.html`で答える',
    en: 'Answer a URL it does not have with `404.html`',
  }),
] as const;

export const hostUnknown = message({
  ja: 'サイトに無いURLへの遷移は、答えがペイロードではないので、普通の文書の読み込みに切り替わります。そこにホスティングが`404.html`で答えます。サイトの横に置いた`/robots.txt`のようなファイルへのリンクも同じで、ルーターに飲み込まれずにファイルそのものを開きます。',
  en: 'A navigation to a URL the site does not have gets an answer that is not a payload, so it becomes an ordinary document load, which the host answers with `404.html`. A link to a file beside the site, `/robots.txt` say, works the same way: it opens the file rather than disappearing into the router.',
});

export const hostDownload = message({
  ja: 'ホスティングがダウンロードとして返すファイルへのリンクには、`download`属性を付けます。付けておけば遷移の時点でダウンロードだと分かるので、ルーターはそのリンクをブラウザに任せます。',
  en: 'Mark a link to a file the host answers as a download with `download`. The navigation then knows it is a download from the start, and the router leaves it to the browser.',
});

export const hostStatus = message({
  ja: '`404.html`を返すときに404のステータスを付けるかどうかは、ホスティングの設定です。ビルドが書けるのはページまでで、応答のステータスは書けません。',
  en: 'Whether `404.html` goes out with a 404 status is the host’s setting. A build can write the page, but not the response.',
});

export const notFoundTitle = message({
  ja: '`404.html`に描かれるもの',
  en: 'What `404.html` holds',
});

export const notFoundDescription = message({
  ja: '`404.html`は、サイトに無いURLのために1度だけ描かれます。そのため、`not-found.tsx`の上にパラメータがあると、そこにはどのルートも宣言していない値が入ります。',
  en: '`404.html` is rendered once, for a URL the site does not have. A parameter above `not-found.tsx` is therefore filled with a value no route declared.',
});

export const notFoundHydrate = message({
  ja: 'ブラウザはこのファイルをhydrateしません。別のURLのために描いたHTMLなので、訪問者が開いたURLで描き直します。そのためクライアントコンポーネントは、`usePathname()`で最初の描画から訪問者のURLを読めます。',
  en: 'The browser does not hydrate this file: it was rendered for another URL, so the browser renders it afresh at the visitor’s. A client component reads the visitor’s URL with `usePathname()` from its first render.',
});

export const notFoundSite = message({
  ja: 'このサイトの`404.html`もそうしています。ファイルは日本語で書かれていて、`/en/…`のURLで開くと、ブラウザが描き直した時点で英語になります。JavaScriptが動かない環境では、ビルドで描いた日本語のまま残ります。',
  en: 'This site’s `404.html` does just that: the file is written in Japanese, and opened at an `/en/…` URL it turns English the moment the browser renders it again. Without JavaScript, the Japanese the build wrote stays.',
});

export const sitemapTitle = message({
  ja: '`sitemap.xml`を書く',
  en: 'Write `sitemap.xml`',
});

export const sitemapDescription = message({
  ja: '`framework()`の`site`にサイトの配信元を渡すと、ビルドは書いたページをすべて並べた`sitemap.xml`も書きます。リダイレクトと`route.ts`の答え、`404.html`はページではないので載りません。',
  en: 'Give `site` the origin the site is served from, and the build also writes `sitemap.xml`, listing every page it wrote. Redirects, `route.ts` answers and `404.html` are not pages, and are left out.',
});

export const sitemapNone = message({
  ja: '`site`を渡さなければ、`sitemap.xml`は書かれません。相対URLを並べたものは、サイトマップとして使えないからです。',
  en: 'Without `site` there is no `sitemap.xml`: a list of relative URLs is not a sitemap.',
});

export const baseMode = message({
  ja: 'このモードでは、ページはルート表のパスのまま`dist/client/`に書かれるので、ホスティングはこのディレクトリを`/docs/`で配信します。`paths`には`base`を除いたパスを渡し、`sitemap.xml`には`base`を含めたURLが載ります。',
  en: 'In this mode pages are written into `dist/client/` at their paths in the route table, so the host serves that directory at `/docs/`. `paths` takes paths without the base, and `sitemap.xml` lists URLs with it.',
});
