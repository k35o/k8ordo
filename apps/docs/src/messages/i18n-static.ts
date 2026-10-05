import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/static`は、パラメータを持つページのpathnameを、ビルドの時点で知る必要があります。ロケールの区間はどのページでも同じ値を取るので、その一覧はロケールの集合が作ります。このページでは、`locales.paths`の渡し方と、ほかのパラメータがあるときの書き方、404ページの言語を説明します。',
  en: '`@k8ordo/static` has to know, at build time, the pathnames of every page with a parameter. The locale segment takes the same values on every page, so the locale set makes that list itself. This page covers passing `locales.paths`, pages with another parameter, and the language of the 404 page.',
});

export const pathsTitle = message({
  ja: 'ロケールの数だけページを書き出す',
  en: 'Write a page per locale',
});

export const pathsDescription = message({
  ja: '`framework`の`paths`オプションに`locales.paths`を渡します。`/:locale`の区間を持つパターンが、ロケールの数だけのpathnameになります。',
  en: 'Pass `locales.paths` as `framework`’s `paths` option. Every pattern with a `/:locale` segment becomes one pathname per locale.',
});

export const pathsSegment = message({
  ja: '置き換えは区間ごとに行います。そのため、`/:localeCode`のように名前が`locale`で始まるだけのパラメータには触れません。',
  en: 'The replacement works by segment, so a parameter whose name merely starts with `locale`, such as `/:localeCode`, is left alone.',
});

export const pathsRequest = message({
  ja: '書き出すpathnameは、1つずつ別のリクエストとして描かれます。ページごとにスキーマがロケールを受け付けるので、文言はそのページのロケールで書かれます。ビルドは複数のページを同時に描きますが、あるページのロケールがほかのページに漏れることはありません。',
  en: 'Each pathname is rendered as a request of its own, so the schema accepts the locale page by page and the messages come out in it. The build renders several pages at once, and none lends its locale to another.',
});

export const otherTitle = message({
  ja: 'ほかのパラメータもあるとき',
  en: 'When there is another parameter',
});

export const otherDescription = message({
  ja: '`/:locale/blog/:slug`のように、ほかのパラメータも持つパターンは、`locales.paths`を通しても`/ja/blog/:slug`のように`:slug`が残ります。',
  en: 'A pattern with another parameter, such as `/:locale/blog/:slug`, still holds `:slug` after `locales.paths`: `/ja/blog/:slug`.',
});

export const otherError = message({
  ja: 'ビルドはパラメータの残ったpathnameを書き出せないので、`static build needs pathnames for /:locale/blog/:slug — supply them with the "paths" option`というエラーで止まります。',
  en: 'The build cannot write a pathname that still holds a parameter, so it stops with `static build needs pathnames for /:locale/blog/:slug — supply them with the "paths" option`.',
});

export const otherExpand = message({
  ja: '先に`locales.paths`でロケールを展開し、残ったパラメータを同じ関数の中で展開します。`paths`には`Promise`を返す関数も渡せるので、記事の一覧を読み込んでから答えられます。',
  en: 'Expand the locale with `locales.paths` first, then the remaining parameter in the same function. `paths` may return a `Promise`, so it can read the list of posts before it answers.',
});

export const notFoundTitle = message({
  ja: '404ページの言語',
  en: 'The language of the 404 page',
});

export const notFoundDescription = message({
  ja: '静的なホストは、知らないURLすべてに1つの`404.html`を返します。このファイルはビルドの番兵の区間で1回だけ描かれるので、文言は既定のロケールで書かれます。',
  en: 'A static host answers every URL it does not know with one `404.html`. That file is rendered once, under the build’s sentinel segment, so its text is in the default locale.',
});

export const notFoundSentinel = message({
  ja: '番兵の区間はスキーマが受け付けないため、ビルドがそれまでにどのロケールのページを描いていても、`404.html`は既定のロケールになります。1つのファイルを、訪問者ごとの言語に合わせることはできません。',
  en: 'The schema refuses the sentinel segment, so `404.html` is in the default locale whichever pages the build rendered before it. One file cannot follow each visitor’s language.',
});

export const notFoundAfresh = message({
  ja: 'ブラウザは、このファイルをハイドレーションしません。別のURLのために描かれたものなので、ハイドレーション中に読んだ文言と食い違うからです。代わりに訪問者のURLで描き直すので、Client Componentはそこで訪問者のロケールになります。',
  en: 'The browser does not hydrate the file: it was rendered for another URL, and a message read while hydrating would disagree with it. It renders the page afresh at the visitor’s URL instead, where Client Components come out in the visitor’s locale.',
});

export const notFoundClient = message({
  ja: 'そのため、`not-found.tsx`はClient Componentにして文言を描きます。JavaScriptが動かない訪問者には、既定のロケールのまま届きます。',
  en: 'So make `not-found.tsx` a Client Component that renders the text. A visitor without JavaScript gets the default locale.',
});

export const notFoundLang = message({
  ja: '`<html lang>`は、ルートレイアウトがサーバーで書いた既定のロケールのまま残ります。このサイトでは、`[locale]`のレイアウトが描くClient Componentが、effectの中で`document.documentElement.lang`を訪問者のロケールに直しています。',
  en: '`<html lang>` keeps the default locale the root layout wrote on the server. On this site, the Client Component the `[locale]` layout renders sets `document.documentElement.lang` to the visitor’s locale from an effect.',
});

export const notFoundServer = message({
  ja: '開発サーバーと`@k8ordo/server`では、404は訪問者のURLで描かれます。URLの区間が集合のロケールなら、サーバーが書いたHTMLの時点でそのロケールです。',
  en: 'Under the dev server and `@k8ordo/server`, a 404 is rendered at the visitor’s URL. When its segment is a locale of the set, the page is in that locale from the server’s HTML on.',
});
