import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'パラメータは文字列で届き、スキーマを宣言すれば型の付いた値になります。このモードではビルドがすべての値を前もって知る必要があり、それを渡すのが `paths` です。',
  en: 'A parameter arrives as a string, and becomes a typed value once a schema says what it expects. In this mode the build has to know every value ahead of time, which is what `paths` supplies.',
});

export const refusedNote = message({
  ja: 'このモードでは、その 404 は `404.html` という 1 枚のファイルです。一方、`paths` で渡した pathname をスキーマが拒んだ場合は、サイトにあると言っている URL に 404 のページを書くことになるので、ビルドが止まります（下の「ビルドが止まるとき」）。',
  en: 'In this mode that 404 is one file, `404.html`. A pathname supplied through `paths` that a schema refuses stops the build instead, since it would write a 404 page under a URL the site claims to have (see "When the build stops" below).',
});

export const pathsTitle = message({
  ja: '`paths`: パラメータの値をビルドに渡す',
  en: '`paths`: handing the build its parameter values',
});

export const pathsDescription = message({
  ja: '事前の描画はパラメータの値を発明できないので、ビルドが値を尋ねます。`framework()` の `paths` は、まだ値が要るパターンの一覧を受け取り、具体的な pathname の配列か、その Promise を返す関数です。',
  en: 'Rendering ahead of time cannot invent parameter values, so the build asks for them. The `paths` option of `framework()` is a function that receives the patterns still needing values and returns the concrete pathnames — an array, or a promise of one.',
});

export const pathsTaken = message({
  ja: 'パラメータの無いルートは表から取られるので、渡す必要はありません。渡しても冗長なだけで、誤りにはなりません。末尾のスラッシュはルーターと同じく無視され、`href()` が返すエスケープ済みの pathname はそのまま受け付けます。`/products/caf%C3%A9` は `products/café/index.html` に書かれます。',
  en: 'Routes without parameters are taken from the table and need no declaration; supplying one anyway is redundant, not wrong. A trailing slash is ignored, as the router ignores it, and the escaped pathname `href()` returns is accepted as is — `/products/caf%C3%A9` is written to `products/café/index.html`.',
});

export const pathsRedirects = message({
  ja: 'パラメータの下にある `redirect.ts`（`[locale]/legacy/redirect.ts` など）も、渡されるパターンに含まれます。リダイレクトもサイトが持つ URL で、ファイルとして書かれるからです。`not-found.tsx` のパターンは含まれません。',
  en: 'A `redirect.ts` under a parameter — `[locale]/legacy/redirect.ts`, say — is among the patterns handed in too: a redirect is a URL the site has, written as a file. The pattern of a `not-found.tsx` is not.',
});

export const expandTitle = message({
  ja: 'どこでも同じ値を取るパラメータ',
  en: 'A parameter that takes the same values everywhere',
});

export const expandDescription = message({
  ja: 'パターンが手渡されるので、ロケールの区間のように全ページに掛かるパラメータは、ページごとに列挙せず展開できます。次の例は区間ごとに見て `:locale` だけを置き換え、それを持たないパターンはそのまま返します。そのまま返したパターンにパラメータが残っていれば、ビルドがそれを名指して値を求めます。',
  en: 'Because the patterns are handed in, a parameter that takes the same values everywhere — a locale segment — is expanded rather than listed once per page. The example below looks segment by segment and replaces `:locale` alone; a pattern without one is handed back as it is, and if that pattern still has a parameter, the build names it and asks for values.',
});

export const expandSite = message({
  ja: 'このサイトの `vite.config.ts` は、`@k8ordo/i18n` の `locales.paths` をそのまま渡しています。`/:locale` の区間を持つパターンをロケールの数だけ展開し、ほかのパラメータには手を付けない関数です。',
  en: "This site's `vite.config.ts` passes `@k8ordo/i18n`'s `locales.paths` as is: a function that expands every pattern with a `/:locale` segment once per locale and leaves any other parameter in place.",
});

export const expandPartial = message({
  ja: '2 つのパラメータを持つパターンの片方だけを展開すると、`/ja/blog/:slug` のような値が残ります。これは pathname ではないので拒まれ、`/:locale/blog/:slug` は値が無いままになります。残ったパラメータは自分で展開してから返します。',
  en: 'Expanding only one of two parameters leaves values like `/ja/blog/:slug` behind. That is not a pathname, so it is refused, and `/:locale/blog/:slug` stays uncovered — expand the remaining parameter yourself before returning.',
});

export const stopsTitle = message({
  ja: 'ビルドが止まるとき',
  en: 'When the build stops',
});

export const stopsDescription = message({
  ja: 'ページの半分が黙って欠けたサイトを出荷するより、ビルドが止まる方がましです。`paths` まわりでは次の場合にビルドが止まります。最初の 3 つは該当するパターンか pathname をすべて名指し、エスケープにまつわる 2 つは最初に見つかった 1 つを名指します。',
  en: 'A site quietly missing half its pages is worse than a build that stopped. Around `paths`, the build stops in these cases. The first three name every pattern or pathname involved; the two about escapes name the first one found.',
});

export const stopsTable = {
  when: message({ ja: 'いつ', en: 'When' }),
  error: message({ ja: 'エラー', en: 'Error' }),
  unresolved: message({
    ja: 'パラメータ付きのパターンを、渡された pathname が 1 つも覆わない',
    en: 'No supplied pathname covers a parameterised pattern',
  }),
  unusable: message({
    ja: 'どのパターンにも一致しない pathname。打ち間違いか、パラメータが残った値',
    en: 'A supplied pathname no pattern matches — a typo, or a value still holding a parameter',
  }),
  refused: message({
    ja: 'ページのスキーマが拒む pathname',
    en: "A supplied pathname its page's schema refuses",
  }),
  malformed: message({
    ja: '復号できないエスケープを含む pathname',
    en: 'A pathname with an escape that cannot be decoded',
  }),
  leaves: message({
    ja: '復号すると出力ディレクトリの外を指す pathname',
    en: 'A pathname that, decoded, points outside the output directory',
  }),
};
