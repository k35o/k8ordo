import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n`がexportする関数と型の一覧です。入口は`@k8ordo/i18n`の1つだけで、Server Componentのモジュールからも、Client Componentのモジュールからもimportできます。',
  en: 'The functions and types `@k8ordo/i18n` exports. There is one entry point, `@k8ordo/i18n`, and both Server Component and Client Component modules import from it.',
});

export const defineLocalesSummary = message({
  ja: 'ロケールの集合を定義します。ロケールの一覧に依存するものは、どれもこの戻り値から読みます。',
  en: 'Defines the locale set. Everything that depends on the list of locales reads it from what this returns.',
});

export const defineLocalesDefinitions = message({
  ja: 'ロケールのタグをキーに、そのロケールの`timeZone`と`dir`を値にしたオブジェクト。タグはBCP 47で書き、書いた順が`all`の順になります。',
  en: 'An object keyed by locale tag, each value that locale’s `timeZone` and `dir`. Tags are BCP 47, and the order written is the order of `all`.',
});

export const defineLocalesOptions = message({
  ja: '`default`で既定のロケールを選びます。省くと、先頭に書いたロケールが既定です。',
  en: '`default` picks the default locale; without it, the locale written first is the default.',
});

export const defineLocalesReturns = message({
  ja: 'ロケールの一覧と、一覧から作った道具をまとめた集合。',
  en: 'The set: the list, and everything made from it.',
});

export const defineLocalesCaveats = [
  message({
    ja: 'ロケールが1つも無い定義と、一覧に無い`default`は、呼んだ時点で`TypeError`を投げます。BCP 47ではないタグと、実行環境が知らないタイムゾーンも同じです。欠けた`timeZone`と、`ltr`か`rtl`ではない`dir`もエラーになります。',
    en: 'An empty set and a `default` outside the list throw a `TypeError` where `defineLocales` is called. So do a tag that is not BCP 47, a time zone the runtime does not know, a missing `timeZone`, and a `dir` other than `ltr` or `rtl`.',
  }),
  message({
    ja: '定義した集合は`globalThis`に登録され、`message`はそこから既定のロケールを読みます。後から定義した集合が勝つので、アプリで1回だけ呼びます。',
    en: 'The set is registered on `globalThis`, where `message` reads the default from. The last set defined wins, so call it once per app.',
  }),
  message({
    ja: 'キーはリテラル型のまま推論されるので、`as const`は要りません。',
    en: 'The keys are inferred as literal types, so no `as const` is needed.',
  }),
] as const;

export const localesSummary = message({
  ja: '`defineLocales`が返す集合の型です。`L`はタグの和集合、`D`は既定のロケールのタグです。',
  en: 'The set `defineLocales` returns. `L` is the union of its tags, and `D` the default among them.',
});

export const localesAll = message({
  ja: '書いた順に並んだタグ。',
  en: 'The tags, in the order written.',
});

export const localesDefinitions = message({
  ja: 'ロケールごとの`{ timeZone, dir }`。`defineLocales`に渡したオブジェクトそのものです。',
  en: 'Each locale’s `{ timeZone, dir }`: the object given to `defineLocales`, as it is.',
});

export const localesDefault = message({
  ja: '既定のロケール。何もロケールを指名していないときと、交渉でどのロケールも一致しなかったときに使います。',
  en: 'The default locale, used when nothing names a locale and when negotiation matches none.',
});

export const localesIs = message({
  ja: "一覧に含まれるかを確かめる型ガード。大文字と小文字を区別するので、`is('EN')`は`false`です。",
  en: "Membership, as a type guard. It is case-sensitive: `is('EN')` is `false`.",
});

export const localesNegotiate = message({
  ja: '希望の並びから、集合のロケールを1つ選びます。タグごとに同じタグ、同じ言語の順に探し、最後まで無ければ既定のロケールを返します。',
  en: 'Picks one locale of the set from a list of preferences. Each tag is tried exactly, then by language; nothing matching by the end is the default.',
});

export const localesNegotiateRequest = message({
  ja: '`Request`からロケールを選びます。`options.cookie`で名前を渡したCookieを先に読み、次に`Accept-Language`を読みます。',
  en: 'Picks a locale for a `Request`: the cookie named by `options.cookie` first, then `Accept-Language`.',
});

export const localesLocalize = message({
  ja: "pathnameの前にロケールの区間を付けます。`'/ui'`は`'/en/ui'`に、`'/'`は`'/en'`になります。",
  en: "Puts a locale segment in front of a pathname: `'/ui'` becomes `'/en/ui'`, and `'/'` becomes `'/en'`.",
});

export const localesDelocalize = message({
  ja: '先頭のロケールの区間を外します。先頭の区間がロケールでなければ、`locale`は`null`です。',
  en: 'Takes the leading locale segment off. When the first segment is no locale, `locale` is `null`.',
});

export const localesPaths = message({
  ja: '`@k8ordo/framework`のstaticモードで使う`paths`オプション。`/:locale`の区間を持つパターンを、ロケールの数だけ展開します。',
  en: 'The `paths` option of `@k8ordo/framework`’s static mode: every pattern with a `/:locale` segment, once per locale.',
});

export const localesParamsSchema = message({
  ja: '`[locale]`の区間のスキーマ。サーバーでは、受け付けたロケールがそのページの描画のロケールになります。',
  en: 'The `[locale]` segment’s schema. On the server, the locale it accepts becomes the locale of that page’s render.',
});

export const localesGetLocale = message({
  ja: '描画中のロケール。サーバーでは受け付けたロケール、ブラウザではURLの先頭の区間で、どちらも無ければ既定のロケールです。',
  en: 'The locale of the render in progress: on the server the one accepted, in the browser the first segment of the URL, and the default when neither names one.',
});

export const localesRun = message({
  ja: '`fn`と、そこから始まる処理を`locale`で動かし、`fn`の戻り値を返します。サーバーでだけ使えます。',
  en: 'Runs `fn`, and everything it starts, under `locale`, and returns what `fn` returns. Server only.',
});

export const localesFormats = message({
  ja: '今のロケールの`Intl`のオブジェクトを返すメンバー。下の`IntlFormats`を見てください。',
  en: 'The members that return `Intl` objects for the current locale; see `IntlFormats` below.',
});

export const localesCaveats = [
  message({
    ja: 'どのメンバーも`this`を使わないので、`export const { getLocale } = locales`のように取り出して使えます。',
    en: 'No member uses `this`, so any can be taken out of the set, as in `export const { getLocale } = locales`.',
  }),
  message({
    ja: '`run`をブラウザで呼ぶと、`locales.run: in the browser the URL is the locale — navigate instead`を投げます。',
    en: 'Called in a browser, `run` throws `locales.run: in the browser the URL is the locale — navigate instead`.',
  }),
  message({
    ja: '`AsyncLocalStorage`を取り出せないサーバーのランタイムでは、`run`と、ロケールを受け付けるときの`paramsSchema`がエラーを投げます。',
    en: 'On a server runtime with no `AsyncLocalStorage` to offer, `run` throws, and so does `paramsSchema` when it accepts a locale.',
  }),
] as const;

export const intlFormatsSummary = message({
  ja: '集合のうち、今のロケールの`Intl`のオブジェクトを返すメンバーです。返すのは`Intl`のオブジェクトそのものです。',
  en: 'The members of the set that return `Intl` objects for the current locale — the `Intl` objects themselves.',
});

export const intlFormatsDateTime = message({
  ja: '今のロケールと、そのロケールの`timeZone`で書く`Intl.DateTimeFormat`。',
  en: '`Intl.DateTimeFormat` in the current locale and that locale’s `timeZone`.',
});

export const intlFormatsNumber = message({
  ja: '今のロケールの`Intl.NumberFormat`。',
  en: '`Intl.NumberFormat` in the current locale.',
});

export const intlFormatsRelativeTime = message({
  ja: '今のロケールの`Intl.RelativeTimeFormat`。',
  en: '`Intl.RelativeTimeFormat` in the current locale.',
});

export const intlFormatsPlural = message({
  ja: '今のロケールの`Intl.PluralRules`。',
  en: '`Intl.PluralRules` in the current locale.',
});

export const intlFormatsList = message({
  ja: '今のロケールの`Intl.ListFormat`。',
  en: '`Intl.ListFormat` in the current locale.',
});

export const intlFormatsCaveats = [
  message({
    ja: 'ロケールとオプションの組ごとに1つだけ作り、次からは同じものを返します。オプションはJSONにして見分けます。',
    en: 'One is made per locale and options and returned again after that. Options are told apart by their JSON.',
  }),
  message({
    ja: 'どれもフックではないので、Server ComponentでもClient Componentでも、文言の関数の中でも呼べます。',
    en: 'None is a hook, so each can be called in a Server Component, a Client Component, or inside a message’s function.',
  }),
] as const;

export const messageSummary = message({
  ja: '1つの文言を、すべてのロケールの文とともに宣言します。返す関数は、呼ばれた場所のロケールの文を返します。',
  en: 'Declares one message with its text in every locale. The function it returns gives the text in the locale where it is called.',
});

export const messageVariants = message({
  ja: 'ロケールごとの文。すべてのロケールを文で書くか、すべてを同じ引数の関数で書きます。',
  en: 'The text per locale: text in every locale, or a function of the same arguments in every locale.',
});

export const messageReturns = message({
  ja: '引数を受け取り、今のロケールの文を返す関数。',
  en: 'A function that takes the arguments and returns the text in the current locale.',
});

export const messageCaveats = [
  message({
    ja: '`Register`を登録すると、ロケールが欠けた宣言は型エラーになります。型をすり抜けた欠けは、読んだ時点で`message: no text for "en" in ["ja"]`のような`TypeError`を投げます。',
    en: 'With `Register` merged, a declaration missing a locale does not compile. A gap that gets past the types throws a `TypeError` such as `message: no text for "en" in ["ja"]` where the message is read.',
  }),
  message({
    ja: '何もロケールを指名していないときは、既定のロケールの文を返します。この環境で集合がまだ定義されていなければ、既定のロケールの代わりに最初に書いた文を返します。',
    en: 'When nothing names a locale, it returns the default locale’s text — or, where no set has been defined in this environment yet, the first text written.',
  }),
  message({
    ja: '引数の型は、注釈を書いたロケールから決まります。どこにも書かないと`unknown`になるので、少なくとも1つに書くか、`message<[name: string]>({ … })`のように型引数で渡します。',
    en: 'The argument types come from the locale you annotate. With no annotation anywhere they are `unknown`, so annotate one, or pass them as a type argument: `message<[name: string]>({ … })`.',
  }),
  message({
    ja: '宣言には副作用が無いので、どこからも呼ばれない文言はバンドラが取り除きます。',
    en: 'The declaration has no side effect, so a bundler drops a message nothing calls.',
  }),
] as const;

export const messageTypeSummary = message({
  ja: '`message`が返す関数の型です。文言をpropsで受け取るコンポーネントは、この型で受け取ります。',
  en: 'The type of what `message` returns. A component that takes a message as a prop takes this type.',
});

export const messageTypeCaveats = [
  message({
    ja: '関数なので、Server ComponentからClient Componentへpropsで渡せません。そこでは、呼んだ結果の文字列を渡します。',
    en: 'Being a function, it cannot be a prop from a Server Component to a Client Component; pass the string you get by calling it there.',
  }),
] as const;

export const parseSummary = message({
  ja: '`Accept-Language`ヘッダーを、`negotiate`に渡せる希望の並びにします。',
  en: 'Turns an `Accept-Language` header into a list of preferences for `negotiate`.',
});

export const parseHeader = message({
  ja: "ヘッダーの値。`request.headers.get('accept-language')`をそのまま渡せます。",
  en: "The header’s value; `request.headers.get('accept-language')` goes in as it is.",
});

export const parseReturns = message({
  ja: '重みの大きい順に並べたタグ。ヘッダーが無いか空白だけなら、空の配列。',
  en: 'The tags, highest weight first; an empty array for a missing or blank header.',
});

export const parseCaveats = [
  message({
    ja: '重みが同じタグは、ヘッダーの順を保ちます。重みが0以下のタグと`*`は落とします。',
    en: 'Tags of equal weight keep the header’s order. Tags weighted 0 or less, and `*`, are dropped.',
  }),
  message({
    ja: 'タグそのものは確かめません。BCP 47ではないタグは、`negotiate`が飛ばします。',
    en: 'The tags themselves are not checked; `negotiate` skips the ones that are not BCP 47.',
  }),
] as const;

export const currentSummary = message({
  ja: 'アプリの集合が決める、今のロケールを返します。アプリのことを知らないライブラリが、アプリのロケールに合わせるために使います。',
  en: 'The current locale, as the app’s set resolves it — for a library that renders inside an app it knows nothing about.',
});

export const currentReturns = message({
  ja: '指名されたロケール。無ければ集合の既定のロケールで、この環境で集合が定義されていなければ`null`。',
  en: 'The locale named, else the set’s default; `null` where no set has been defined in this environment.',
});

export const currentCaveats = [
  message({
    ja: '`@k8ordo/ui`のコンポーネントは、自分で描く文言のロケールをこれで決めています。',
    en: '`@k8ordo/ui` picks the locale of its built-in text with this.',
  }),
  message({
    ja: 'アプリのコードでは、集合の型が付く`locales.getLocale()`を使います。',
    en: 'App code uses `locales.getLocale()`, which is typed by the set.',
  }),
] as const;

export const registerSummary = message({
  ja: 'アプリのロケールの型を、パッケージに伝えるための宣言です。アプリで1回だけマージします。',
  en: 'How the app tells the package its locales’ type. Merge it once per app.',
});

export const registerCaveats = [
  message({
    ja: 'マージされるための型なので、`type`ではなく`interface`で書きます。',
    en: 'It exists to be merged, so it is an `interface`, not a `type`.',
  }),
  message({
    ja: '登録する前は`RegisteredLocale`が`string`なので、ロケールの欠けは型エラーになりません。',
    en: 'Until it is merged, `RegisteredLocale` is `string`, and a missing locale is no type error.',
  }),
] as const;

export const registeredLocaleSummary = message({
  ja: '`Register`に登録したロケールの和集合です。登録する前は`string`です。',
  en: 'The union of the locales in `Register`; `string` until it is merged.',
});

export const variantsSummary = message({
  ja: '`Register`に登録したロケールごとに、1つずつ値を持つオブジェクトの型です。`message`が受け取るのもこの型です。',
  en: 'An object with one value per locale in `Register`. It is also what `message` takes.',
});

export const variantsCaveats = [
  message({
    ja: '言語の切り替えに並べる言語名のように、文言以外でもロケールごとに漏れなくそろえたい値に使えます。',
    en: 'It also fits values other than messages that every locale must have, such as the names a language switcher lists.',
  }),
] as const;

export const localeOfSummary = message({
  ja: '集合のタグの和集合を取り出します。`Register`の`locale`にも、この型を書きます。',
  en: 'The union of a set’s tags. It is also what `Register`’s `locale` is set to.',
});

export const localeDefinitionSummary = message({
  ja: '1つのロケールに添える情報です。どちらも実行環境から導かずに書きます。',
  en: 'What each locale states besides its tag. Neither is derived from the runtime.',
});

export const localeDefinitionTimeZone = message({
  ja: 'そのロケールで日付を表示するIANAのタイムゾーン。サーバーでもブラウザでも同じタイムゾーンで書くので、日付がずれません。',
  en: 'The IANA time zone the locale’s dates are shown in — the same on the server and in every browser, so a date reads the same on both.',
});

export const localeDefinitionDir = message({
  ja: 'そのロケールの文字の向き。`<html dir>`に使います。',
  en: 'The direction the locale’s text runs in, for `<html dir>`.',
});

export const localesOptionsSummary = message({
  ja: '`defineLocales`の第2引数の型です。',
  en: 'The type of `defineLocales`’ second argument.',
});

export const localesOptionsDefault = message({
  ja: '既定のロケール。一覧のタグでなければならず、省くと先頭に書いたロケールです。',
  en: 'The default locale. It has to be one of the list; without it, the first one written.',
});

export const negotiateOptionsSummary = message({
  ja: '`negotiateRequest`の第2引数の型です。',
  en: 'The type of `negotiateRequest`’s second argument.',
});

export const negotiateOptionsCookie = message({
  ja: '訪問者が選んだ言語を持つCookieの名前。省くと`Accept-Language`だけを読みます。',
  en: 'The name of the cookie holding the visitor’s choice. Without it, only `Accept-Language` is read.',
});

export const delocalizedSummary = message({
  ja: '`delocalize`が返す値の型です。',
  en: 'What `delocalize` returns.',
});

export const delocalizedLocale = message({
  ja: '先頭の区間が示すロケール。先頭の区間がロケールでなければ`null`。',
  en: 'The locale the first segment names, or `null` when it names none.',
});

export const delocalizedPathname = message({
  ja: '区間を外した残りのpathname。ロケールの区間しか無いときは`/`です。',
  en: 'The pathname with the segment taken off; `/` when there was nothing else.',
});

export const paramsSchemaSummary = message({
  ja: '`paramsSchema`の型です。スキーマのライブラリに頼らないよう、Standard Schemaの形をこのパッケージ自身が宣言しています。',
  en: 'The type of `paramsSchema`: the Standard Schema shape, declared by this package itself so it depends on no schema library.',
});

export const paramsSchemaCaveats = [
  message({
    ja: "検証は同期的です。一覧に無いロケールには、`path: ['locale']`のissueを返します。",
    en: "Validation is synchronous. A locale outside the list gets an issue at `path: ['locale']`.",
  }),
  message({
    ja: '受け付けた値は`{ locale }`だけです。ほかのパラメータは、後に続くスキーマのために文字列のまま残ります。',
    en: 'The accepted value is `{ locale }` alone; other params keep their strings for the schemas that follow.',
  }),
] as const;

export const dateTimeOptionsSummary = message({
  ja: '`dateTimeFormat`のオプションの型です。`Intl.DateTimeFormatOptions`のうち、`timeZone`だけを受け付けません。',
  en: 'The options of `dateTimeFormat`: `Intl.DateTimeFormatOptions` without `timeZone`.',
});

export const dateTimeOptionsCaveats = [
  message({
    ja: '`as`で`timeZone`を通しても、ロケールの`timeZone`で上書きします。',
    en: 'A `timeZone` forced through with `as` is overridden by the locale’s.',
  }),
] as const;
