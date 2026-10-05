import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`[id]`のようなディレクトリの下のページは、URLの一部をパラメータとして受け取ります。このモードでは、ビルドがパラメータの値をすべて前もって知る必要があります。このページでは、値に型を付ける方法と一緒に、ビルドへの値の渡し方を説明します。',
  en: 'A page under a directory like `[id]` receives part of its URL as a parameter. In this mode the build has to know every value ahead of time, so this page covers handing the values over as well as typing them.',
});

export const refusedMode = message({
  ja: 'このモードでは、その404は`404.html`という1つのファイルです。また、`paths`で渡したURLをスキーマが拒んだときは、サイトにあるはずのURLに404のページを書くことになるので、ビルドが止まります。',
  en: 'In this mode that 404 is one file, `404.html`. A URL handed over through `paths` that a schema refuses stops the build instead, since it would put a 404 page at a URL the site claims to have.',
});

export const pathsTitle = message({
  ja: '`paths`でURLを並べる',
  en: 'List the URLs with `paths`',
});

export const pathsDescription = message({
  ja: 'ビルドはパラメータの値を自分では決められません。そのため、パラメータを持つルートのURLは`framework()`の`paths`で渡します。`paths`は、値の要るパターンの一覧を受け取り、URLの配列かそのPromiseを返す関数です。',
  en: 'A build cannot invent parameter values, so the URLs of routes with parameters are handed over with the `paths` option of `framework()`: a function that receives the patterns needing values and returns an array of URLs, or a promise of one.',
});

export const pathsMissing = message({
  ja: '当てはまるURLが1つも無いルートがあると、ビルドは`static build needs pathnames for /products/:id`で始まるエラーで止まります。ページが半分欠けたサイトを黙って公開するより、止まるほうが安全だからです。',
  en: 'A route that no URL covers stops the build with an error that begins `static build needs pathnames for /products/:id`. Stopping is safer than quietly shipping a site missing half its pages.',
});

export const pathsForm = message({
  ja: 'パラメータの無いルートはルート表から分かるので、渡す必要はありません。URLは`href()`が返すエスケープ済みの形でも受け付けます。ただしViteの`base`を設定しているときは、`base`を除いた形で渡してください。',
  en: 'Routes without parameters come from the route table and need nothing. A URL may be escaped the way `href()` returns it; under a Vite `base`, though, hand it over without the base.',
});

export const pathsRedirect = message({
  ja: 'パラメータの下にある`redirect.ts`も、ページと同じく`paths`で値を渡します。リダイレクトもファイルとして書き出すからです。',
  en: 'A `redirect.ts` under a parameter takes its values from `paths` too, since a redirect is written as a file as well.',
});

export const expandTitle = message({
  ja: 'どのページでも同じ値を取るパラメータを展開する',
  en: 'Expand a parameter that takes the same values everywhere',
});

export const expandDescription = message({
  ja: '`paths`は値の要るパターンを受け取るので、ロケールのように全ページに掛かるパラメータは、ページごとに並べずに展開できます。`@k8ordo/i18n`の`locales.paths`は、`/:locale`を持つパターンをロケールの数だけ展開し、ほかのパラメータには手を付けない関数です。',
  en: 'Since `paths` receives the patterns that need values, a parameter that spans every page — a locale — is expanded rather than listed page by page. `locales.paths` from `@k8ordo/i18n` does exactly that: it expands every pattern with `/:locale` once per locale and leaves other parameters alone.',
});

export const expandSite = message({
  ja: 'このサイトの`vite.config.ts`も、`locales.paths`をそのまま渡しています。',
  en: 'This site’s `vite.config.ts` passes `locales.paths` as it is.',
});

export const expandPartial = message({
  ja: 'パラメータを2つ持つパターンで片方だけを展開すると、`/ja/blog/:slug`のような値が残ります。これはURLではないので使われず、`/:locale/blog/:slug`は値の無いルートとしてビルドが止まります。残ったパラメータも、返す前に展開します。',
  en: 'Expanding only one of two parameters leaves values like `/ja/blog/:slug`. That is not a URL, so it goes unused, and the build stops for `/:locale/blog/:slug` having no values. Expand the remaining parameter before returning.',
});

export const stopsTitle = message({
  ja: '`paths`が原因でビルドが止まるとき',
  en: 'When `paths` stops the build',
});

export const stopsDescription = message({
  ja: '`paths`まわりでは、次の場合にビルドが止まります。どのエラーも、原因のパターンかURLを名指しします。',
  en: 'Around `paths`, the build stops in these cases. Each error names the pattern or URL at fault.',
});

export const stopsList = [
  message({
    ja: '当てはまるURLが無いルートがある：`static build needs pathnames for /products/:id — supply them with the "paths" option`',
    en: 'A route no URL covers: `static build needs pathnames for /products/:id — supply them with the "paths" option`',
  }),
  message({
    ja: 'どのルートにも当たらないURLを渡した：`the "paths" option supplied pathnames no route wants: /produtcs/2`',
    en: 'A URL no route matches: `the "paths" option supplied pathnames no route wants: /produtcs/2`',
  }),
  message({
    ja: 'スキーマが拒むURLを渡した：`the "paths" option supplied pathnames a params schema refused: /products/shoes`',
    en: 'A URL a schema refuses: `the "paths" option supplied pathnames a params schema refused: /products/shoes`',
  }),
  message({
    ja: 'ページが`notFound()`を投げるURLを渡した：`the "paths" option supplied pathnames whose page called notFound(): /products/3`',
    en: 'A URL whose page throws `notFound()`: `the "paths" option supplied pathnames whose page called notFound(): /products/3`',
  }),
  message({
    ja: 'デコードできないエスケープを含むURLを渡した：`the "paths" option supplied a pathname with a malformed escape: /products/%zz`',
    en: 'A URL with an escape that does not decode: `the "paths" option supplied a pathname with a malformed escape: /products/%zz`',
  }),
  message({
    ja: 'デコードすると出力の外を指すURLを渡した：`the "paths" option supplied a pathname that leaves the output: /products/..%2F..`',
    en: 'A URL that, decoded, points outside the output: `the "paths" option supplied a pathname that leaves the output: /products/..%2F..`',
  }),
] as const;
