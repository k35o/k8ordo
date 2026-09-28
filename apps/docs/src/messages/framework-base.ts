import { message } from '@k8ordo/i18n';

export const title = message({
  ja: 'サブパスに置く（Vite の base）',
  en: 'Served under a base',
});

export const description = message({
  ja: 'オリジンの根ではなく、その下（`https://example.com/docs/`）に置くアプリは、Vite の `base` でそう伝えます。アプリの中で変わるものはありません。',
  en: 'An application served below the root of its origin — `https://example.com/docs/` — says so with Vite’s `base`, and nothing else in it changes.',
});

export const table = message({
  ja: '`routes/` はアプリの根から書いたままです。`routes/products/page.tsx` は、表の中では `/products`、アドレスバーでは `/docs/products` です。両者のあいだを渡るものは、渡るときに base を付け外しします。',
  en: '`routes/` is still written from the application’s root: `routes/products/page.tsx` is `/products` in the table and `/docs/products` in the address bar. What crosses between the two gains or loses the base on the way:',
});

export const links = message({
  ja: '`href()` と `navigateTo()` で作ったリンクには base が付きます。ページが受け取る `pathname` と `usePathname()` の値には付きません',
  en: 'A link built with `href()` or `navigateTo()` carries it. A page receives `pathname` without it, and `usePathname()` returns it without it',
});

export const files = message({
  ja: 'ページのペイロードはその横（`/docs/products/index.rsc`）に、クライアントのビルドのファイルは `/docs/assets/` の下に置かれます',
  en: 'A page’s payload sits beside it — `/docs/products/index.rsc` — and the client build’s files are under `/docs/assets/`',
});

export const redirects = message({
  ja: '`redirect.ts` の行き先は表と同じく根から書き、base を前に付けて送られます。別のオリジンを指す行き先は書いたまま送られます',
  en: 'A `redirect.ts` target is written from the root, like the table, and is sent with the base in front; one that names another origin is sent as written',
});

export const builtRedirects = message({
  ja: "アプリが自分で作るリダイレクトは書いたまま送られます。Server Action の `redirect()` と、`guard.ts` が返す `Response` の `location` です。どちらも URL なので、`href()` で作ります（`redirect(href('/talks'))`、`location: href('/login')`）。ほかの方法で作った pathname には、`@k8ordo/router` の `withBase()` で base を付けます",
  en: "A redirect the application builds itself is sent as written: `redirect()` from a Server Action, and the `location` of a `Response` a `guard.ts` returns. Both are URLs, so build them with `href()` — `redirect(href('/talks'))`, `location: href('/login')` — or give a pathname built some other way its base with `withBase()` from `@k8ordo/router`",
});

export const outside = message({
  ja: 'base の外の URL はアプリのものではありません。ハンドラは `404` で答え、クライアントのランタイムはブラウザに任せます',
  en: 'A URL outside the base is none of the application’s: the handler answers it with a `404`, and the client runtime leaves it to the browser',
});

export const staticMode = message({
  ja: 'ページは `dist/client/` の中の、表の pathname の位置に書かれます。ホスティングはそのディレクトリを `/docs/` で配信します。`paths` オプションには base を付けない pathname を渡し、`sitemap.xml` には base を含めた URL が並びます。',
  en: 'The pages are written into `dist/client/` at their pathnames in the table, so the host serves that directory at `/docs/`. The `paths` option takes pathnames without the base, and `sitemap.xml` lists each page at its URL, base included.',
});

export const serverMode = message({
  ja: '`serve` は、ビルドがどの base 向けに作られたかを `dist/rsc/index.js` から読み、クライアントのビルドのファイルをその下で配ります。ハンドラを自分で呼ぶホストは、訪問者が求めた URL を base ごと渡します。',
  en: '`serve` reads the base the build was made for from `dist/rsc/index.js` and hands out the client build’s files below it; a host calling the handler itself passes the URL as the visitor asked for it, base included.',
});

export const pathOnly = message({
  ja: 'base は根からのパスでなければなりません。相対（`./`）や別のオリジンの base では、どの URL がどのページかが決まらないので、ビルドが止まります。',
  en: 'The base has to be a path from the root. A relative base (`./`) or another origin says nothing about which URL is which page, and the build refuses it:',
});
