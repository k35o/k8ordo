import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`defineLocales` がアプリケーションのロケール集合を宣言します。一覧に依存するもの、つまり所属判定・交渉・URL の区間・`[locale]` のスキーマ・静的化のパス・描画中のロケールは、どれもこの戻り値のメンバーです。',
  en: "`defineLocales` declares the application's locale set. Everything that depends on the list — membership, negotiation, the URL segment, the `[locale]` schema, the static paths and the locale of the render in progress — is a member of what it returns.",
});

export const define = {
  title: message({
    ja: '`defineLocales(all, options?)`',
    en: '`defineLocales(all, options?)`',
  }),
  description: message({
    ja: 'ロケールのタグを並べた配列と、省略できる `default` を受け取ります。タグはリテラル型のまま推論されるので、`as const` は要りません。',
    en: 'It takes an array of locale tags and an optional `default`. The tags are inferred as literal types, so no `as const` is needed.',
  }),
  default: message({
    ja: '`default` を省くと先頭のタグが既定値です。`default` の型は一覧の和集合なので、一覧に無いタグはコンパイルで落ちます。',
    en: 'Without `default`, the first tag is the default. The type of `default` is the union of the list, so a tag outside it fails to compile.',
  }),
  throws: message({
    ja: '誤った一覧は、使われた時点ではなく定義した時点で `TypeError` を投げます。重複したタグと BCP 47 ではないタグは型では検出されないので、検出するのはこの検査だけです。一覧に無い `default` はコンパイルでも落ちますが、JavaScript からの呼び出しや `as` で通した値のために実行時にも確かめます。',
    en: 'A wrong list throws a `TypeError` where it is defined, not later where it is used. A repeated tag and a tag that is not BCP 47 pass the type checker, so this check is the only thing that catches them. A `default` outside the list already fails to compile, and is checked again at run time for callers in JavaScript and values forced through `as`.',
  }),
  callColumn: message({
    ja: '呼び出し',
    en: 'Call',
  }),
  errorColumn: message({
    ja: '投げるエラーの文面',
    en: 'Error message',
  }),
};

export const oneSet = {
  title: message({
    ja: 'アプリケーションに集合は 1 つ',
    en: 'One set per application',
  }),
  description: message({
    ja: '`defineLocales` は値を返すだけでなく、`message()` が読む既定値と所属判定を登録します。`message()` が集合を引数に取らないのは、取ると宣言がバンドラに副作用と見なされ、使われない文言を落とせなくなるからです。',
    en: '`defineLocales` does more than return a value: it registers the default and the membership check that `message()` reads. `message()` does not take the set as an argument because that would make each declaration look like a side effect to the bundler, which could then no longer drop unused messages.',
  }),
  last: message({
    ja: '登録は後勝ちです。開発サーバーがロケールを足したモジュールを評価し直したとき、次に呼ばれた文言が新しい集合を読むためです。その反面、テストやデモや補助関数の中で別の集合を `defineLocales` すると、その時点からすべての文言がその集合を読みます。集合は 1 つのモジュールで定義して export し、ほかの場所では import してください。',
    en: 'The last set defined wins, so that when a dev server re-evaluates the module after a locale is added, the next message called reads the new set. The flip side: defining another set with `defineLocales` inside a test, a demo or a helper makes every message read that set from then on. Define the set in one module, export it, and import it everywhere else.',
  }),
};

export const members = {
  title: message({
    ja: '集合のメンバー',
    en: 'What the set returns',
  }),
  description: message({
    ja: '戻り値は `Locales<L, D>` 型です。`L` はタグの和集合、`D` は既定値のタグです。',
    en: 'The value is a `Locales<L, D>`, where `L` is the union of the tags and `D` is the default tag.',
  }),
  memberColumn: message({
    ja: 'メンバー',
    en: 'Member',
  }),
  descriptionColumn: message({
    ja: '内容',
    en: 'What it is',
  }),
  all: message({
    ja: '一覧のタグ。書いた順のままです。',
    en: 'The tags, in the order written.',
  }),
  default: message({
    ja: '既定のロケール。交渉で何も一致しなかったときと、何もロケールを指名していないときに使われます。',
    en: 'The default locale, used when negotiation finds nothing and when nothing names a locale.',
  }),
  is: message({
    ja: "所属判定の型ガード。完全一致で、大文字小文字を区別します（`is('EN')` は `false`）。",
    en: "Membership as a type guard. The comparison is exact and case-sensitive (`is('EN')` is `false`).",
  }),
  negotiate: message({
    ja: '希望の並びに対して、対応する最良のロケールを返します（下の「交渉」）。',
    en: 'The best supported locale for a preference list (see Negotiation below).',
  }),
  localize: message({
    ja: "pathname の前にロケールの区間を付けます。`'/ui'` は `'/en/ui'`、`'/'` は `'/en'` になります。",
    en: "Puts a locale segment in front of a pathname: `'/ui'` becomes `'/en/ui'`, and `'/'` becomes `'/en'`.",
  }),
  delocalize: message({
    ja: "逆向きです。`'/en/ui'` は `{ locale: 'en', pathname: '/ui' }`、ロケールで始まらない pathname は `locale: null` です。",
    en: "The inverse: `'/en/ui'` gives `{ locale: 'en', pathname: '/ui' }`, and a pathname that starts with no locale gives `locale: null`.",
  }),
  paths: message({
    ja: '`@k8ordo/static` の `paths` オプション。`/:locale` 区間を持つパターンをロケールの数だけ展開します。',
    en: "`@k8ordo/static`'s `paths` option: every pattern with a `/:locale` segment, once per locale.",
  }),
  paramsSchema: message({
    ja: '`[locale]` 区間のスキーマ（Standard Schema）。受理したロケールが、受理したページの描画のロケールになります。',
    en: "The `[locale]` segment's schema (Standard Schema). The locale it accepts becomes the locale of the render of the page that accepted it.",
  }),
  getLocale: message({
    ja: '描画中のロケール。hook ではないので、どこからでも呼べます。',
    en: 'The locale of the render in progress. Not a hook: call it anywhere.',
  }),
  run: message({
    ja: 'サーバー専用。`fn` と、そこから始まる処理を `locale` のもとで実行します。',
    en: 'Server only: runs `fn`, and everything it starts, under `locale`.',
  }),
  more: message({
    ja: 'URL に関わるメンバー（`localize`・`delocalize`・`paths`・`paramsSchema`・`getLocale`・`run`）の使い方は、別のページにまとめています。',
    en: 'How the members that deal with the URL — `localize`, `delocalize`, `paths`, `paramsSchema`, `getLocale` and `run` — are used is covered on a page of its own.',
  }),
  moreLink: message({
    ja: 'URL とロケールを読む',
    en: 'Read URLs & locale',
  }),
  typesTitle: message({
    ja: '型',
    en: 'Types',
  }),
  typeColumn: message({
    ja: '型',
    en: 'Type',
  }),
  locales: message({
    ja: '`defineLocales` の戻り値の型。',
    en: 'The type `defineLocales` returns.',
  }),
  localeOf: message({
    ja: '集合のタグの和集合。`Register` の `locale` にもこれを書きます。',
    en: "The union of a set's tags. It is also what `Register`'s `locale` is set to.",
  }),
  localesOptions: message({
    ja: '第 2 引数の型（`{ default?: D }`）。',
    en: 'The type of the second argument (`{ default?: D }`).',
  }),
  delocalized: message({
    ja: '`delocalize` の戻り値（`{ locale: L | null; pathname: string }`）。`pathname` は空にならず、少なくとも `/` です。',
    en: 'What `delocalize` returns (`{ locale: L | null; pathname: string }`). `pathname` is never empty; it is `/` at least.',
  }),
  localeParamsSchema: message({
    ja: '`paramsSchema` の型。スキーマライブラリに依存しないよう、Standard Schema の形をこのパッケージ自身が宣言しています。',
    en: 'The type of `paramsSchema`: the Standard Schema shape, declared by this package itself so that it depends on no schema library.',
  }),
};

export const bcp47 = {
  title: message({
    ja: 'BCP 47 のタグ',
    en: 'BCP 47 tags',
  }),
  description: message({
    ja: 'タグは `Intl.Locale` が受け付けるかどうかで検査します。`en_US` のような区切りの誤りや `***` は BCP 47 ではありません。',
    en: 'A tag is checked by whether `Intl.Locale` accepts it. A wrong separator such as `en_US`, or `***`, is not BCP 47.',
  }),
  spelling: message({
    ja: '集合に書いた綴りがそのまま URL の区間になります。`en-US` と書けば `/en-US/…` です。URL に出したい綴りで書いてください。',
    en: 'The tag as you spell it in the set is the URL segment: `en-US` gives `/en-US/…`. Spell tags the way you want them in URLs.',
  }),
};

export const negotiation = {
  title: message({
    ja: '交渉',
    en: 'Negotiation',
  }),
  description: message({
    ja: '`negotiate(requested)` は、希望の並び（`navigator.languages` や、`Accept-Language` を解析した結果）から、対応する最良のロケールを 1 つ返します。',
    en: '`negotiate(requested)` returns the one supported locale that best fits a preference list — `navigator.languages`, or a parsed `Accept-Language` header.',
  }),
  stepOrder: message({
    ja: '希望のタグを先頭から 1 つずつ見ます。',
    en: 'Take the requested tags one at a time, in order.',
  }),
  stepExact: message({
    ja: 'そのタグと完全に一致するロケールがあれば、それを返します（大文字小文字は区別しません）。',
    en: 'If a supported locale matches the tag exactly (ignoring case), return it.',
  }),
  stepLanguage: message({
    ja: '無ければ、同じ言語を話す最初の対応ロケールを返します。',
    en: 'Otherwise, return the first supported locale that speaks the same language.',
  }),
  stepInvalid: message({
    ja: 'BCP 47 ではないタグは、throw せずに飛ばします。希望の並びは利用者の入力だからです。',
    en: 'Skip a tag that is not BCP 47 instead of throwing on it: the list is user input.',
  }),
  stepDefault: message({
    ja: '最後まで一致が無ければ、既定値を返します。',
    en: 'If nothing matched by the end of the list, return the default.',
  }),
  caseRule: message({
    ja: '交渉の完全一致は大文字小文字を区別しません（`en-gb` は `en-GB` に一致し、集合側の綴りで返ります）。`is` と `delocalize` は区別します。',
    en: "Negotiation's exact match ignores case (`en-gb` matches `en-GB` and comes back spelled as the set spells it). `is` and `delocalize` do not ignore case.",
  }),
  languageRule: message({
    ja: "言語での一致は、言語サブタグ（`Intl.Locale` の `language`）だけを比べます。用字や地域は比べないので、`['zh-Hans', 'zh-Hant']` に `zh-Hant-TW` を求めると、先に書いた `zh-Hans` が選ばれます。同じ言語のロケールが複数あるときは、書いた順が言語一致で選ばれる順です。",
    en: "Matching by language compares only the language subtag (`language` of `Intl.Locale`). Script and region are not weighed, so with `['zh-Hans', 'zh-Hant']` a request for `zh-Hant-TW` gets `zh-Hans`, the one written first. When several locales share a language, the order you write them in is the order a language match picks them in.",
  }),
  why: message({
    ja: "全タグの完全一致を先に探さず、タグごとに言語まで見てから次へ進むのは、利用者の 1 番目の希望を優先するためです。`['en-US', 'ja']` を送る人は英語を最も望んでいるので、集合に `en` があれば、2 番目の `ja` が完全一致でも `en` を返します。",
    en: "Each tag is tried down to its language before the next one is looked at, rather than searching the whole list for exact matches first, so that the visitor's first choice wins. Someone who sends `['en-US', 'ja']` wants English most; if the set has `en`, they get `en`, even though `ja` further down is an exact match.",
  }),
  iterable: message({
    ja: '引数は `Iterable<string>` なので、`navigator.languages` も配列も `Set` もそのまま渡せます。',
    en: 'The argument is an `Iterable<string>`, so `navigator.languages`, an array and a `Set` all pass as they are.',
  }),
  examplesTitle: message({
    ja: '例',
    en: 'Worked examples',
  }),
  examplesDescription: message({
    ja: "集合 `defineLocales(['ja', 'en', 'en-GB'])` に対する結果です。",
    en: "Results against `defineLocales(['ja', 'en', 'en-GB'])`.",
  }),
  requestedColumn: message({
    ja: '希望',
    en: 'Requested',
  }),
  resultColumn: message({
    ja: '結果',
    en: 'Result',
  }),
  reasonColumn: message({
    ja: '理由',
    en: 'Why',
  }),
  reasonExact: message({
    ja: '完全一致',
    en: 'Exact match',
  }),
  reasonCase: message({
    ja: '完全一致（大文字小文字は区別しない）',
    en: 'Exact match, ignoring case',
  }),
  reasonFirstLanguage: message({
    ja: '`en-US` の言語で、先に `en` が見つかる',
    en: 'The language of `en-US` already finds `en`',
  }),
  reasonFirstChoice: message({
    ja: '1 番目の希望の言語が、2 番目の完全一致より先',
    en: "The first choice's language comes before the second choice's exact match",
  }),
  reasonLanguage: message({
    ja: '`ja-JP` の言語で一致',
    en: 'The language of `ja-JP` matches',
  }),
  reasonInvalid: message({
    ja: '`***` は BCP 47 ではないので飛ばす',
    en: '`***` is not BCP 47 and is skipped',
  }),
  reasonNone: message({
    ja: '一致なし。既定値',
    en: 'Nothing matches; the default',
  }),
  reasonEmpty: message({
    ja: '空の並び。既定値',
    en: 'An empty list; the default',
  }),
};

export const acceptLanguage = {
  title: message({
    ja: '`parseAcceptLanguage(header)`',
    en: '`parseAcceptLanguage(header)`',
  }),
  description: message({
    ja: '`Accept-Language` ヘッダーを、`negotiate` に渡せる希望の並びにします。サーバーでヘッダーから交渉するときに使います。',
    en: 'Turns an `Accept-Language` header into a preference list `negotiate` accepts. It is how a server negotiates from a request header.',
  }),
  weight: message({
    ja: '`q` の重みの大きい順に並べます。`q` の無いタグの重みは 1 です。',
    en: 'Tags are ordered by their `q` weight, highest first; a tag without one weighs 1.',
  }),
  ties: message({
    ja: '重みが同じタグは、ヘッダーに書かれた順を保ちます。',
    en: 'Tags of equal weight keep the order the header gives them.',
  }),
  dropped: message({
    ja: '重みが 0 以下のタグ（空の `q=` は `0` と読みます）と `*` は落とします。`*` は「何でもよい」という意味で、それは既定値がすでに表しています。',
    en: 'Tags weighted 0 or less (an empty `q=` reads as `0`), and the `*` wildcard, are dropped. The wildcard means "anything", which is what the default already means.',
  }),
  missing: message({
    ja: 'ヘッダーが無い（`null`）か空白だけなら、空の並びを返します。',
    en: 'A missing header (`null`) or a blank one is an empty list.',
  }),
  tolerant: message({
    ja: '空白、`Q=` のような大文字の引数名、知らない引数は許容します。`q=abc` のように数値にならない `q` は無視され、重みは 1 のままです。',
    en: 'Spacing, an upper-case parameter name such as `Q=`, and unknown parameters are tolerated. A `q` that is not a number, such as `q=abc`, is ignored, and the tag keeps a weight of 1.',
  }),
  noValidation: message({
    ja: 'タグ自体は検査しません。BCP 47 ではないタグは `negotiate` が飛ばします。',
    en: 'Tags themselves are not validated; `negotiate` skips the ones that are not BCP 47.',
  }),
  headerColumn: message({
    ja: 'ヘッダー',
    en: 'Header',
  }),
  resultColumn: message({
    ja: '結果',
    en: 'Result',
  }),
};

export const demo = {
  title: message({
    ja: '交渉を試す',
    en: 'Try negotiation',
  }),
  description: message({
    ja: 'ヘッダーを書き換えると、`parseAcceptLanguage` が作る並び、各タグが集合のどのロケールに一致したか、`negotiate` の答えがその場で変わります。集合はこのサイト自身の `locales`（`ja` と `en`、既定は `ja`）です。説明用に別の集合を定義しないのは、上で書いたとおり、2 つ目の `defineLocales` がこのページの文言が読む集合を置き換えてしまうからです。',
    en: "Edit the header and watch the list `parseAcceptLanguage` makes, which locale of the set each tag matched, and the answer `negotiate` gives. The set is this site's own `locales` (`ja` and `en`, default `ja`). There is no separate sample set because, as described above, a second `defineLocales` would replace the set every message on this page reads.",
  }),
  presets: message({
    ja: '例',
    en: 'Examples',
  }),
  useBrowser: message({
    ja: 'このブラウザの navigator.languages',
    en: "This browser's navigator.languages",
  }),
  parsed: message({
    ja: '`parseAcceptLanguage` が返す並び',
    en: 'The list `parseAcceptLanguage` returns',
  }),
  empty: message({
    ja: '空の並びです。',
    en: 'An empty list.',
  }),
  exact: message({
    ja: (locale: string) => `完全一致 → ${locale}`,
    en: (locale) => `exact match → ${locale}`,
  }),
  language: message({
    ja: (locale: string) => `言語が一致 → ${locale}`,
    en: (locale) => `same language → ${locale}`,
  }),
  invalid: message({
    ja: 'BCP 47 ではないので飛ばす',
    en: 'not BCP 47, skipped',
  }),
  none: message({
    ja: '一致なし',
    en: 'no match',
  }),
  notConsulted: message({
    ja: '見ない（すでに決まった）',
    en: 'not consulted (already decided)',
  }),
  answer: message({
    ja: '`negotiate` の答え',
    en: 'What `negotiate` returns',
  }),
  fellBack: message({
    ja: '一致が無かったので、既定値です。',
    en: 'Nothing matched, so this is the default.',
  }),
};
