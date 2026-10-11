import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'アプリが扱うロケールを、`defineLocales`で1か所に定義できるようになります。ロケールごとに`timeZone`と`dir`を書き、既定のロケールを1つ選びます。',
  en: 'You will be able to define the locales an app supports in one place, with `defineLocales`. Each locale states a `timeZone` and a `dir`, and one of them is the default.',
});

export const defineTitle = message({
  ja: 'ロケールの一覧',
  en: 'Locale list',
});

export const defineDefaultCallout = message({
  ja: '既定のロケール',
  en: 'The default locale',
});

export const defineRegisterCallout = message({
  ja: 'タグの和集合を`Register`に登録する',
  en: 'Registers the tag union',
});

export const defineObject = message({
  ja: '`defineLocales`には、ロケールのタグをキーにしたオブジェクトを渡します。タグはBCP 47で書きます。書いた綴りがそのままURLの区間になり、`en-US`なら`/en-US/…`です。',
  en: 'Pass `defineLocales` an object keyed by locale tag. Tags are BCP 47, and the spelling you write is the URL segment: `en-US` gives `/en-US/…`.',
});

export const defineType = message({
  ja: 'キーはリテラル型のまま推論されるので、`as const`は要りません。`LocaleOf<typeof locales>`はタグの和集合の型です。',
  en: 'Keys are inferred as literal types, so no `as const` is needed. `LocaleOf<typeof locales>` is the union of the tags.',
});

export const defineRegister = message({
  ja: '`@k8ordo/framework`のアプリでは、この`locales`のexportからフレームワークが`Register`を生成するので、宣言は書きません。詳しくは`@k8ordo/framework`の',
  en: 'An `@k8ordo/framework` app leaves the declaration out: the framework generates `Register` from this `locales` export. See `@k8ordo/framework`’s ',
});

export const definePitfall = message({
  ja: '`defineLocales`はアプリで1回だけ呼びます。2回呼ぶと、後から定義した一覧で前の一覧が置き換わります。1つのモジュールで定義してexportし、ほかの場所ではimportしてください。',
  en: 'Call `defineLocales` once per app. A second call replaces the list defined before it. Define it in one module, export it, and import it everywhere else.',
});

export const defaultTitle = message({
  ja: '既定のロケール',
  en: 'Default locale',
});

export const defaultChoose = message({
  ja: '既定のロケールは、第2引数の`default`で選びます。省くと先頭に書いたロケールになり、`locales.default`の型はタグの和集合になります。',
  en: 'The default locale is chosen with `default` in the second argument. Without it, the locale written first is the default, and `locales.default` is typed as the whole union.',
});

export const defaultUsedLead = message({
  ja: '既定のロケールは、次のときに使われます。',
  en: 'The default is used when:',
});

export const defaultUsedList = [
  message({
    ja: 'ブラウザで、URLの先頭の区間がロケールでないとき',
    en: 'in the browser, the first segment of the URL is not a locale',
  }),
  message({
    ja: '言語の選択でどのロケールも一致しなかったとき',
    en: 'negotiation matches no locale',
  }),
  message({
    ja: 'サーバーで、`run`も`paramsSchema`もロケールを設定していないとき',
    en: 'on the server, neither `run` nor `paramsSchema` has set a locale',
  }),
] as const;

export const timeZoneTitle = message({
  ja: 'タイムゾーン',
  en: 'Time zone',
});

export const timeZoneWhat = message({
  ja: '`timeZone`は、そのロケールの日付を表示するIANAのタイムゾーンです。日付の書き方は',
  en: '`timeZone` is the IANA time zone the locale’s dates are shown in. How dates are written is covered in ',
});

export const timeZoneWhy = message({
  ja: '実行環境のタイムゾーンは、サーバーではサーバーの設定、ブラウザでは訪問者の設定に従います。これに任せると、サーバーが書いたHTMLとハイドレーション時の描画とで時刻が食い違います。ロケールごとに書いておけば、サーバーとブラウザが同じタイムゾーンで日付を書きます。',
  en: 'The runtime’s zone is the server’s on the server and the visitor’s in the browser. Using it, the server’s HTML and the hydrating render can show different times. With a zone per locale, the server and the browser write dates in the same zone.',
});

export const timeZoneChoose = message({
  ja: 'タイムゾーンは、サイトの内容に合わせて選びます。東京のイベントのサイトなら、英語のページでも`Asia/Tokyo`でかまいません。',
  en: 'Pick the zone that fits what the site is about. A site about events in Tokyo may show its English pages in `Asia/Tokyo` too.',
});

export const dirTitle = message({
  ja: '文字の向き',
  en: 'Text direction',
});

export const dirWhat = message({
  ja: '`dir`は、そのロケールの文字の向きで、`ltr`か`rtl`を書きます。`Intl.Locale`の`getTextInfo()`はまだすべてのブラウザでは使えないので、タグから自動では求めません。',
  en: '`dir` is the direction the locale’s text runs in: `ltr` or `rtl`. `Intl.Locale`’s `getTextInfo()` has not reached every browser, so the direction is not derived from the tag.',
});

export const dirHtml = message({
  ja: '`<html>`には、今のロケールの`dir`を書きます。書き方は',
  en: 'Write the current locale’s `dir` onto `<html>`. See ',
});

export const errorsTitle = message({
  ja: '拒まれる定義',
  en: 'Rejected definitions',
});

export const errorsWhen = message({
  ja: '定義に誤りがあると、`defineLocales`を呼んだ時点で`TypeError`になります。エラー文はどれも`defineLocales:`で始まります。',
  en: 'A wrong definition throws a `TypeError` as soon as `defineLocales` is called. Every message starts with `defineLocales:`.',
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
  ja: '一覧に無い`default`、欠けた`timeZone`、`ltr`と`rtl`以外の`dir`は型エラーにもなります。BCP 47ではないタグと実行環境が知らないタイムゾーンは型では見つからず、この検査だけが見つけます。',
  en: 'A `default` outside the list, a missing `timeZone` and a `dir` other than `ltr` and `rtl` are type errors as well. A tag that is not BCP 47 and a time zone the runtime does not know pass the types; only this check catches them.',
});

export const membersTitle = message({
  ja: '定義が返すもの',
  en: 'What the definition returns',
});

export const membersLead = message({
  ja: '`defineLocales`が返す値には、一覧と、一覧から作った関数がまとまっています。使う場所では、この`locales`をimportします。',
  en: 'The value `defineLocales` returns holds the list and the functions made from it. Wherever one is needed, import `locales`.',
});

export const membersAll = message({
  ja: '`all`：書いた順に並んだタグの配列',
  en: '`all`: the tags, in the order written',
});

export const membersDefinitions = message({
  ja: '`definitions`：ロケールごとの`{ timeZone, dir }`を持つ、渡したオブジェクトそのもの',
  en: '`definitions`: each locale’s `{ timeZone, dir }`, the object as given',
});

export const membersDefault = message({
  ja: '`default`：既定のロケール',
  en: '`default`: the default locale',
});

export const membersIs = message({
  ja: '`is(value)`：一覧に含まれるかを確かめる型ガード（大文字と小文字を区別）',
  en: '`is(value)`: membership as a type guard; case-sensitive',
});

export const membersNegotiate = message({
  ja: '`negotiate`と`negotiateRequest`：訪問者の希望からロケールを選ぶ関数。詳しくは',
  en: '`negotiate` and `negotiateRequest`: functions that pick a locale from the visitor’s preferences. See ',
});

export const membersLocalize = message({
  ja: '`localize`と`delocalize`：pathnameにロケールの区間を付け外しする関数。詳しくは',
  en: '`localize` and `delocalize`: functions that put the locale segment on a pathname and take it off. See ',
});

export const membersParams = message({
  ja: '`paramsSchema`と`run`、`getLocale`：今のロケールを設定して読むためのもの。詳しくは',
  en: '`paramsSchema`, `run` and `getLocale`: set the current locale and read it. See ',
});

export const membersPaths = message({
  ja: '`paths`：`/:locale`を含むパターンを、ロケールごとのpathnameに展開する関数。`@k8ordo/framework`での使い方は',
  en: '`paths`: expands each pattern with `/:locale` into one pathname per locale. For its use in `@k8ordo/framework`, see ',
});

export const membersFormat = message({
  ja: '`dateTimeFormat`など5つ：今のロケールで作った`Intl`のフォーマッタ。詳しくは',
  en: '`dateTimeFormat` and four more: `Intl` formatters for the current locale. See ',
});

export const membersMore = message({
  ja: '引数と戻り値の型は',
  en: 'The argument and return types are listed under ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});
