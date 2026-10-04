import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '何かがthrowしたときの`error.tsx`、何も一致しなかったときの`not-found.tsx`、移転したURLの`redirect.ts`。このモードでは、ビルド中にthrowしたServer Componentはビルドを止め、not-foundは`404.html`になり、リダイレクトは訪問者を送り出すページとして書かれます。',
  en: '`error.tsx` for when something throws, `not-found.tsx` for when nothing matched, and `redirect.ts` for a URL that moved. In this mode a Server Component that throws during the build stops it, the not-found page becomes `404.html`, and a redirect is written as a page that sends the visitor on.',
});

export const serverRenderTitle = message({
  ja: 'ビルド中にthrowしたとき',
  en: 'When it throws during the build',
});

export const serverRenderDescription = message({
  ja: 'ビルド中にServer Componentがthrowしたページは、ページとして書かれません。訪問者のブラウザで描かれて初めてエラーが見えるHTMLを書く代わりに、ビルドが止まります。throwされたメッセージはページのURLと一緒にログに出て、ビルドは失敗したページをすべて挙げた次の行で終わります。上にSuspenseの境界（`error.tsx`もその1つ）があってもなくても同じです。throwしたのが`not-found.tsx`なら、`404.html`として挙がります。',
  en: "A page whose Server Component throws while the build renders it is not written as a page: the build stops rather than writing an HTML whose error would only show once a visitor's browser rendered it. The thrown message is logged beside the page's URL, and the build ends with the line below, naming every page that failed — whether or not a Suspense boundary sits above the throw (an `error.tsx` is one). A `not-found.tsx` that throws is named as `404.html`.",
});

export const serverRenderClient = message({
  ja: 'クライアントコンポーネントは事情が違います。ビルドがHTMLを作る途中でクライアントコンポーネントがthrowしても、上にSuspenseの境界（`error.tsx`もその1つ）があれば、その部分はブラウザに任されてファイルは書かれ、ブラウザが描き直します。そこでもthrowすれば、hydrationの後にいちばん近い`error.tsx`が出ます。上にSuspenseの境界が無ければ、Server Componentと同じようにビルドが止まります。',
  en: 'A client component is different. When one throws while the build renders the HTML inside a Suspense boundary — an `error.tsx` is one — that part is left to the browser: the file is written, and the browser renders it again, showing the nearest `error.tsx` after hydration if it throws there too. With no Suspense boundary above it, it stops the build the same way a Server Component does.',
});

export const serverRenderBrowser = message({
  ja: 'つまりこのモードの`error.tsx`は、主にブラウザで起きる失敗のためにあります。hydrationの後やクライアント遷移の後に、クライアントコンポーネントがthrowした場合です。',
  en: 'So under this mode `error.tsx` is mostly for what fails in the browser: a client component that throws after hydration or after a client navigation.',
});

export const withoutNote = message({
  ja: 'このモードでは、読み込み直した文書はホストが配るそのページのファイルで、500やエラーページで答えるサーバーはありません。サイトが持たないURLへの答えもHTMLの`404.html`なので、同じく文書の読み込みになります。',
  en: "In this mode the document load gets the page's prerendered file from the host — there is no server to answer with a 500 or an error page of its own — and a URL the site does not have comes back as `404.html`, which is HTML and so a document load too.",
});

export const notFoundNote = message({
  ja: 'このモードでは、`not-found.tsx`は`404.html`という1枚のファイルに描かれます。静的ホスティングは知らないURLすべてに1つのファイルで答えるので、表せる`not-found.tsx`は1つだけです。置く場所はロケールの区間の下でも構いません。2つ以上宣言するとビルドが止まり、1つも無ければ`404.html`は書かれず、知らないURLへの答えはホスティング次第になります。',
  en: 'In this mode `not-found.tsx` is rendered into one file, `404.html`. A static host answers every unknown URL from one file, so only one `not-found.tsx` can be represented — under a locale segment is fine. Declaring two stops the build; declaring none writes no `404.html`, and the host decides what an unknown URL gets.',
});

export const notFoundMore = message({
  ja: '`404.html`がどう描かれ、そこでのパラメータをどう扱うかは、リンク先にあります。',
  en: 'How `404.html` is rendered, and what its parameters hold, is covered here.',
});

export const redirectNote = message({
  ja: 'このモードでは、ステータスを送るサーバーはいないので、リダイレクトは訪問者を送り出すページとして書かれます（`<meta http-equiv="refresh">`とリンク）。横に`index.rsc`は無いので、クライアント遷移はそこでURLをブラウザに渡し、ブラウザがそのページを読み込んで従います。`permanent`は書かれるファイルを変えません。リダイレクトは`sitemap.xml`に載らず、パラメータの下の`redirect.ts`には`paths`で値を渡します。',
  en: 'In this mode no server will ever send the status, so a redirect is written as a page that sends the visitor on — `<meta http-equiv="refresh">` and a link. There is no `index.rsc` beside it, so a client navigation hands the URL to the browser, which loads that page and follows it. `permanent` changes nothing about the file written. Redirects are left out of `sitemap.xml`, and a `redirect.ts` under a parameter takes its values from `paths`.',
});

export const pageNotFoundBuild = message({
  ja: 'ビルドはページ全体を待つので、`notFound()`はページのどこから投げても効きます。`paths`が渡したpathnameのページがそう言うと、そのpathnameを挙げてビルドが止まります。そのまま書けば、サイトが持っていると言うURLに404のページを置くことになるからです。',
  en: 'A build waits for the whole page, so `notFound()` counts from anywhere in it. A pathname the `paths` option supplied whose page says it stops the build, naming the pathname — it would otherwise be written as a 404 page under a URL the site claims to have.',
});
