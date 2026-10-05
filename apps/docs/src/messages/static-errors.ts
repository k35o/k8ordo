import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ページが例外を投げたとき、URLがどこにも当たらなかったとき、URLを移したときの扱い方を説明します。このモードでは、ビルド中に起きた失敗はビルドを止めるので、ブラウザで起きる失敗と分けて考えます。',
  en: 'What to do when a page throws, when a URL matches nothing, and when a URL has moved. In this mode a failure during the build stops the build, so it is handled apart from what fails in the browser.',
});

export const scopeMode = message({
  ja: 'このモードで読み込まれるのは、ホストが配るそのページのファイルです。',
  en: 'In this mode, that load gets the page’s file from the host.',
});

export const buildTitle = message({
  ja: 'ビルド中に例外が起きたとき',
  en: 'When something throws during the build',
});

export const buildDescription = message({
  ja: 'ビルド中にServer Componentが例外を投げたページは、ファイルに書かれません。訪問者のブラウザで初めてエラーが見えるHTMLを書く代わりに、ビルドが止まります。',
  en: 'A page whose Server Component throws during the build is not written. Rather than writing HTML whose error would only show in a visitor’s browser, the build stops.',
});

export const buildLog = message({
  ja: '投げられたメッセージはページのURLと一緒にログに出て、ビルドは失敗したページをすべて挙げた`static build could not render /broken — see the error above`で終わります。上に`error.tsx`があっても同じです。',
  en: 'The thrown message is logged beside the page’s URL, and the build ends with `static build could not render /broken — see the error above`, naming every page that failed. An `error.tsx` above it changes nothing.',
});

export const buildClient = message({
  ja: 'クライアントコンポーネントは扱いが違います。上にSuspenseの境界（`error.tsx`もその1つ）があれば、その部分はブラウザに任されてファイルは書かれ、ブラウザで描き直したときに`error.tsx`が出ます。上にSuspenseの境界が無ければ、Server Componentと同じくビルドが止まります。',
  en: 'A client component is different. With a Suspense boundary above it — an `error.tsx` is one — that part is left to the browser and the file is written; the browser renders it again and shows `error.tsx`. With none above it, it stops the build as a Server Component does.',
});

export const buildBrowser = message({
  ja: 'そのため、このモードの`error.tsx`が受け止めるのは、主にブラウザで起きる失敗です。',
  en: 'So in this mode `error.tsx` is mostly for what fails in the browser.',
});

export const notFoundMode = message({
  ja: 'このモードでは、`not-found.tsx`は`404.html`という1つのファイルに書き出されます。静的ホスティングは知らないURLすべてに1つのファイルで答えるので、置ける`not-found.tsx`は1つだけです。ロケールの区間の下に置いても構いません。',
  en: 'In this mode `not-found.tsx` is written as one file, `404.html`. A static host answers every unknown URL from one file, so there can be only one `not-found.tsx` — under a locale segment is fine.',
});

export const notFoundCount = message({
  ja: '2つ以上置くと、ビルドは`a static host answers every unknown URL from one file`で始まるエラーで止まります。1つも置かなければ`404.html`は書かれず、知らないURLへの答えはホスティング次第になります。',
  en: 'Two or more stop the build with an error that begins `a static host answers every unknown URL from one file`. With none, no `404.html` is written, and the host decides what an unknown URL gets.',
});

export const notFoundMore = message({
  ja: '`404.html`がブラウザでどう描かれるかは、次のページで説明しています。',
  en: 'How `404.html` renders in the browser is covered here:',
});

export const pageNotFoundMode = message({
  ja: 'ビルドはページ全体が描き終わるのを待つので、ページのどこで投げても効きます。ただし、`paths`で渡したURLのページが`notFound()`を投げると、そのURLを挙げてビルドが止まります。サイトにあるはずのURLに、404のページを書くことになるからです。',
  en: 'A build waits for the whole page, so `notFound()` counts from anywhere in it. A URL handed over through `paths` whose page throws it stops the build, naming the URL: it would put a 404 page at a URL the site claims to have.',
});

export const redirectMode = message({
  ja: 'このモードでは、ステータスを返すサーバーがいないので、リダイレクトは訪問者を行き先へ送るページとして書かれます。`<meta http-equiv="refresh">`とリンクを持つHTMLで、`permanent`を付けても書かれるファイルは変わりません。',
  en: 'In this mode there is no server to send a status, so a redirect is written as a page that sends the visitor on: HTML with a `<meta http-equiv="refresh">` and a link. `permanent` changes nothing about the file.',
});

export const redirectNavigation = message({
  ja: '横に`index.rsc`は書かれないので、クライアント側の遷移はそのURLをブラウザに渡し、ブラウザがページを読み込んで行き先へ移ります。リダイレクトは`sitemap.xml`にも載りません。',
  en: 'No `index.rsc` is written beside it, so a client navigation hands the URL to the browser, which loads the page and moves on. Redirects are left out of `sitemap.xml`.',
});
