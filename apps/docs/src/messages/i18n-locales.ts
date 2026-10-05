import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'アプリが扱うロケールは、`defineLocales`で1か所に書きます。URLの区間や`[locale]`のスキーマ、静的に書き出すパス、文言の型は、どれもこの値から決まります。このページでは、ロケールごとに書く`timeZone`と`dir`、既定のロケールの選び方、定義が返すものを説明します。',
  en: 'The locales an app supports are written once, with `defineLocales`. The URL segment, the `[locale]` schema, the paths a static build writes and the type of every message all come from that value. This page covers the `timeZone` and `dir` each locale states, choosing the default, and what the definition returns.',
});

export const defineTitle = message({
  ja: 'ロケールの一覧を書く',
  en: 'List the locales',
});

export const defineDescription = message({
  ja: '`defineLocales`には、ロケールのタグをキーにしたオブジェクトを渡します。キーはリテラル型のまま推論されるので、`as const`は要りません。',
  en: 'Hand `defineLocales` an object keyed by locale tag. The keys are inferred as literal types, so no `as const` is needed.',
});

export const defineTag = message({
  ja: 'タグはBCP 47で書きます。書いた綴りがそのままURLの区間になるので、`en-US`と書けば`/en-US/…`です。URLに出したい綴りで書いてください。',
  en: 'Tags are BCP 47, and the spelling you write is the URL segment: `en-US` gives `/en-US/…`. Spell each tag the way it should appear in URLs.',
});

export const defineLocaleType = message({
  ja: '`LocaleOf<typeof locales>`で、タグの和集合を型として取り出せます。`Register`に登録するのも、この型です。',
  en: '`LocaleOf<typeof locales>` is the union of the tags as a type, and it is what goes into `Register`.',
});

export const definePitfall = message({
  ja: '`defineLocales`は、アプリで1回だけ呼びます。後から定義した集合が、それ以降のすべての文言が読む集合になるためです。集合は1つのモジュールで定義してexportし、ほかの場所ではimportしてください。',
  en: 'Call `defineLocales` once per app: the last set defined is the one every message reads from then on. Define the set in one module, export it, and import it everywhere else.',
});

export const defaultTitle = message({
  ja: '既定のロケールを決める',
  en: 'Choose the default',
});

export const defaultDescription = message({
  ja: '既定のロケールは、何もロケールを指名していないときに使うロケールです。第2引数の`default`で選び、省くと先頭に書いたロケールになります。',
  en: 'The default locale is the one used when nothing names a locale. Pick it with `default` in the second argument; without it, the locale written first is the default.',
});

export const defaultWhen = message({
  ja: '既定のロケールが使われるのは、URLにロケールの区間が無いときと、交渉でどのロケールも一致しなかったときです。サーバーで、`[locale]`の描画の外から文言を呼んだときも、既定のロケールになります。',
  en: 'The default is used when the URL has no locale segment and when negotiation matches no locale. A message called on the server outside a `[locale]` render is in the default too.',
});

export const defaultType = message({
  ja: '`default`の型は一覧のタグの和集合なので、一覧に無いタグを書くと型エラーになります。',
  en: '`default` is typed as the union of the listed tags, so a tag outside the list does not compile.',
});

export const timeZoneTitle = message({
  ja: '日付のタイムゾーンを決める',
  en: 'Choose the time zone for dates',
});

export const timeZoneDescription = message({
  ja: '`timeZone`は、そのロケールで日付を表示するIANAのタイムゾーンです。実行環境のタイムゾーンには任せず、ロケールごとに必ず書きます。',
  en: '`timeZone` is the IANA time zone the locale’s dates are shown in. It is never left to the runtime: every locale states one.',
});

export const timeZoneWhy = message({
  ja: '実行環境のタイムゾーンは、サーバーではサーバーのもの、ブラウザでは訪問者のものです。それに任せると、サーバーが書いたHTMLとブラウザでの描画で時刻がずれ、日付の変わり目では日付まで変わってしまいます。ロケールに1つ決めておけば、両側が同じタイムゾーンで書きます。',
  en: 'The runtime’s own time zone is the server’s on the server and the visitor’s in the browser. Left to it, a time reads differently in the server’s HTML and in the browser, and near midnight even the date changes. With one zone per locale, both sides write in the same one.',
});

export const timeZoneChoose = message({
  ja: 'どのタイムゾーンにするかは、プロダクトが決めることです。東京で開くイベントのサイトなら、英語のページでも`Asia/Tokyo`がふさわしいかもしれません。訪問者ごとのタイムゾーンで見せたいものは、ブラウザだけで描く部分に置きます。',
  en: 'Which zone is a product decision: a site about events in Tokyo may well want `Asia/Tokyo` on its English pages too. Anything that should follow each visitor’s own zone belongs in a part that renders in the browser only.',
});

export const timeZoneMore = message({
  ja: '日付の書き方は、「日付や数値を書式化する」で説明します。',
  en: '“Format dates and numbers” shows how dates are written.',
});

export const dirTitle = message({
  ja: '文字の向きを決める',
  en: 'Choose the text direction',
});

export const dirDescription = message({
  ja: '`dir`は、そのロケールの文字が流れる向きです。`ltr`か`rtl`のどちらかを書き、`<html dir>`に使います。',
  en: '`dir` is the direction the locale’s text runs in, `ltr` or `rtl`, for `<html dir>`.',
});

export const dirWhy = message({
  ja: '`Intl.Locale`の`getTextInfo()`を使えば導けそうですが、まだすべてのブラウザにはありません。そのため、導かずに書く形にしています。',
  en: '`Intl.Locale`’s `getTextInfo()` could derive it, but it has not reached every browser, so it is declared instead.',
});

export const dirHtml = message({
  ja: 'ルートレイアウトは、URLから読んだロケールの`dir`を`<html>`に書きます。書き方は「URLにロケールを置く」で説明します。',
  en: 'The root layout writes the `dir` of the URL’s locale onto `<html>`; “Put the locale in the URL” shows how.',
});

export const errorsTitle = message({
  ja: '定義の誤りを見つける',
  en: 'Catch a wrong definition',
});

export const errorsDescription = message({
  ja: '定義に誤りがあると、使われたときではなく、`defineLocales`を呼んだ時点で`TypeError`を投げます。文面は、どれも`defineLocales:`で始まります。',
  en: 'A wrong definition throws a `TypeError` where `defineLocales` is called, not later where the set is used. Every message starts with `defineLocales:`.',
});

export const errorsList = [
  message({
    ja: 'ロケールが1つも無い：`no locale is defined`',
    en: 'No locale at all: `no locale is defined`',
  }),
  message({
    ja: '一覧に無い`default`：`the default "fr" is not in ["ja","en"]`',
    en: 'A `default` outside the list: `the default "fr" is not in ["ja","en"]`',
  }),
  message({
    ja: 'BCP 47ではないタグ：`"en_US" is not a BCP 47 language tag`',
    en: 'A tag that is not BCP 47: `"en_US" is not a BCP 47 language tag`',
  }),
  message({
    ja: '実行環境が知らないタイムゾーン：`the timeZone of "ja", "Asia/Tokio", is not a time zone`',
    en: 'A time zone the runtime does not know: `the timeZone of "ja", "Asia/Tokio", is not a time zone`',
  }),
  message({
    ja: '`ltr`と`rtl`以外の`dir`：`the dir of "ja", "auto", is neither "ltr" nor "rtl"`',
    en: 'A `dir` other than `ltr` and `rtl`: `the dir of "ja", "auto", is neither "ltr" nor "rtl"`',
  }),
] as const;

export const errorsTypes = message({
  ja: '一覧に無い`default`と、欠けた`timeZone`、`ltr`と`rtl`以外の`dir`は、型エラーにもなります。BCP 47ではないタグと、実行環境が知らないタイムゾーンは型では見つからないので、この検査だけが見つけます。',
  en: 'A `default` outside the list, a missing `timeZone` and a `dir` other than `ltr` and `rtl` are type errors as well. A tag that is not BCP 47 and a time zone the runtime does not know pass the types, so this check is the only thing that catches them.',
});

export const membersTitle = message({
  ja: '定義が返すもの',
  en: 'What the definition returns',
});

export const membersDescription = message({
  ja: '`defineLocales`が返す値には、一覧そのものと、一覧から作った道具がまとまっています。使う場所では、この`locales`をimportするだけです。',
  en: 'What `defineLocales` returns holds the list itself and everything made from it. Wherever it is needed, import `locales`.',
});

export const membersList = [
  message({
    ja: '`all`：書いた順に並んだタグの配列',
    en: '`all`: the tags, in the order written',
  }),
  message({
    ja: '`definitions`：ロケールごとの`{ timeZone, dir }`。渡したオブジェクトそのもの',
    en: '`definitions`: each locale’s `{ timeZone, dir }`, the object as given',
  }),
  message({
    ja: '`default`：既定のロケール',
    en: '`default`: the default locale',
  }),
  message({
    ja: '`is(value)`：一覧に含まれるかを確かめる型ガード。大文字と小文字を区別する',
    en: '`is(value)`: membership, as a type guard; case-sensitive',
  }),
  message({
    ja: '`negotiate`と`negotiateRequest`：訪問者の希望からロケールを選ぶ（「最初の言語を選ぶ」）',
    en: '`negotiate` and `negotiateRequest`: pick a locale from what the visitor asks for (“Choose the first language”)',
  }),
  message({
    ja: '`localize`と`delocalize`：pathnameにロケールの区間を付け外しする（「言語を切り替える」）',
    en: '`localize` and `delocalize`: put the locale segment on a pathname and take it off (“Switch languages”)',
  }),
  message({
    ja: '`paramsSchema`と`getLocale`、`run`：描画中のロケールを決めて読む（「URLにロケールを置く」）',
    en: '`paramsSchema`, `getLocale` and `run`: set and read the locale of the render (“Put the locale in the URL”)',
  }),
  message({
    ja: '`paths`：静的に書き出すpathnameを作る（「静的に書き出す」）',
    en: '`paths`: the pathnames a static build writes (“Static builds”)',
  }),
  message({
    ja: '`dateTimeFormat`などの5つ：今のロケールの`Intl`を返す（「日付や数値を書式化する」）',
    en: '`dateTimeFormat` and four more: `Intl` for the current locale (“Format dates and numbers”)',
  }),
] as const;

export const membersMore = message({
  ja: '引数と戻り値の型は、「API」にまとめています。',
  en: 'The argument and return types are listed under “API”.',
});
