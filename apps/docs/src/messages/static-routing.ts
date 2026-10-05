import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`src/routes/`の下のディレクトリが、そのままサイトのURLになります。このページでは、ルートを書くときの決まりと、ルートのファイルでできることを説明します。',
  en: 'The directories under `src/routes/` are the site’s URLs. This page covers the rules for writing routes, and what route files can do.',
});

export const guardFile = message({
  ja: '`guard.ts`：`@k8ordo/server`でリクエストを止めるためのファイルです。このモードでは、ビルドが名指しで拒みます。',
  en: '`guard.ts`: the file `@k8ordo/server` stops requests with. This mode’s build refuses it by name.',
});

export const propsRequest = message({
  ja: 'このモードでは、ページに`request`は渡りません。ファイルを書き出すビルドには、読むリクエストが無いからです。',
  en: 'In this mode a page receives no `request`: a build that writes files has no request to read.',
});

export const refusesMode = message({
  ja: "このモードのビルドは、`guard.ts`や`'use server'`のモジュールのように、サーバーが要るものも拒みます。どれを、なぜ拒むのかは、次のページで説明しています。",
  en: "A build in this mode also refuses what needs a server, such as a `guard.ts` or a `'use server'` module. Which ones, and why, is covered here:",
});

export const loadingMode = message({
  ja: 'このモードではページを丸ごとファイルに書くので、HTMLに`loading.tsx`が出ることはありません。出るのは、クライアント側の遷移で次のページのペイロードを待っている間だけです。',
  en: 'In this mode a page is written whole into a file, so the HTML never shows a `loading.tsx`. Only a client navigation does, while the next page’s payload arrives.',
});

export const routeMode = message({
  ja: 'このモードでは、ビルドがURLごとに`GET`を1回呼び、その答えをURLのファイルとして書き出します。`feed.xml/route.ts`なら`dist/client/feed.xml`です。パラメータを持つ`route.ts`には、ページと同じく`paths`で値を渡します。',
  en: 'In this mode the build calls `GET` once per URL and writes what it answered as the file at that URL: `feed.xml/route.ts` becomes `dist/client/feed.xml`. A `route.ts` with parameters takes its values from `paths`, as a page does.',
});

export const routeSite = message({
  ja: '`framework()`に`site`を渡していれば、`request.url`のoriginはサイトの配信元になります。フィードのリンクを絶対URLで書けるのは、このためです。',
  en: 'With `site` given to `framework()`, the origin of `request.url` is where the site is served, which is what lets a feed write absolute links.',
});

export const routeLimits = message({
  ja: 'ファイルは`GET`にしか答えられないので、ほかのメソッドをexportした`route.ts`は、ビルドも`vite dev`も拒みます。`GET`が`200`以外を返したときや、`/`に置いた`route.ts`、下にページがある`route.ts`も、ファイルにできないのでビルドが止まります。',
  en: 'A file answers nothing but `GET`, so a `route.ts` exporting another method is refused by the build and by `vite dev`. A `GET` that answers anything but `200`, a `route.ts` at `/`, and one with pages below it cannot be files either, and stop the build.',
});

export const routeSitemap = message({
  ja: '書き出したファイルはページではないので、`sitemap.xml`には載りません。',
  en: 'What it writes is not a page, so `sitemap.xml` leaves it out.',
});

export const prefetchMode = message({
  ja: 'このモードでの先読みは、`index.rsc`というファイルへのリクエストです。',
  en: 'In this mode a prefetch is a request for a file, `index.rsc`.',
});
