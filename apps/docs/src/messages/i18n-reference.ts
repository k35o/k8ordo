import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n`がexportする関数と型の一覧です。入口は1つで、Server ComponentとClient Componentのどちらからもimportできます。',
  en: 'The functions and types `@k8ordo/i18n` exports, all from one entry point that Server Components and Client Components both import.',
});

export const defineLocalesSummary = message({
  ja: 'アプリのロケールの集合を定義します。ロケールの一覧を使うものは、すべてこの戻り値から読みます。',
  en: 'Defines the app’s locale set. Everything that needs the list of locales reads it from this value.',
});

export const defineLocalesDefinitions = message({
  ja: 'ロケールのタグをキーに、そのロケールの`timeZone`と`dir`を値にしたオブジェクト。タグはBCP 47で書きます。書いた順が`all`の順になります。',
  en: 'An object keyed by locale tag. Each value holds that locale’s `timeZone` and `dir`. Tags are BCP 47, and the order written is the order of `all`.',
});

export const defineLocalesOptions = message({
  ja: '既定のロケールを選ぶオプション。`LocalesOptions`を見てください。',
  en: 'The option that picks the default locale. See `LocalesOptions`.',
});

export const defineLocalesReturns = message({
  ja: 'ロケールの一覧と、一覧から作った関数やスキーマをまとめた集合。',
  en: 'The set: the list of locales and the functions and schema built from it.',
});

export const defineLocalesCaveats = [
  message({
    ja: 'ロケールが1つも無い定義は、呼んだ時点で`defineLocales: no locale is defined`の`TypeError`になります。一覧に無い`default`と、BCP 47ではないタグも`TypeError`になります。欠けた`timeZone`や実行環境が知らない`timeZone`、`ltr`でも`rtl`でもない`dir`も`TypeError`です。エラー文は種類ごとに違います。',
    en: 'A definition with no locale throws a `TypeError`, `defineLocales: no locale is defined`, where it is called. A `default` outside the list and a tag that is not BCP 47 also throw a `TypeError`. So do a missing `timeZone`, a `timeZone` the runtime does not know, and a `dir` other than `ltr` or `rtl`. Each has its own message.',
  }),
  message({
    ja: '定義した集合は`globalThis`に登録されます。`message`はそこから既定のロケールを読みます。後から定義した集合が優先されるので、アプリで1回だけ呼びます。',
    en: 'The set is registered on `globalThis`, and `message` reads the default locale from there. The set defined last wins, so call it once per app.',
  }),
  message({
    ja: 'キーはリテラル型のまま推論されます。`as const`は要りません。',
    en: 'The keys are inferred as literal types. No `as const` is needed.',
  }),
] as const;

export const localesSummary = message({
  ja: '`defineLocales`が返す集合の型です。`L`はタグの和集合、`D`は既定のロケールのタグです。',
  en: 'The type of the set `defineLocales` returns. `L` is the union of its tags, and `D` is the default locale’s tag.',
});

export const localesAll = message({
  ja: '書いた順に並んだタグ。',
  en: 'The tags, in the order written.',
});

export const localesDefinitions = message({
  ja: 'ロケールごとの`{ timeZone, dir }`。`defineLocales`に渡したオブジェクトです。',
  en: 'Each locale’s `{ timeZone, dir }`: the object passed to `defineLocales`.',
});

export const localesDefault = message({
  ja: '既定のロケール。どこにもロケールが指定されていないときと、言語の選択でどれも一致しなかったときに使います。',
  en: 'The default locale. It is used when nothing names a locale, and when negotiation matches none.',
});

export const localesIs = message({
  ja: "一覧に含まれるかを確かめる型ガード。大文字と小文字を区別するので、`is('EN')`は`false`です。",
  en: "A type guard for membership in the list. It is case-sensitive: `is('EN')` is `false`.",
});

export const localesNegotiate = message({
  ja: '希望のタグの並びから、集合のロケールを1つ選びます。タグごとに同じタグ、次に同じ言語のロケールを探します。最後まで無ければ既定のロケールを返します。',
  en: 'Picks one locale of the set from a list of preferred tags. Each tag is tried as an exact match, then by language. When nothing matches, the default is returned.',
});

export const localesNegotiateRequest = message({
  ja: '`Request`からロケールを選びます。`options.cookie`で名前を渡したCookieを先に読み、次に`Accept-Language`を読みます。',
  en: 'Picks a locale for a `Request`. The cookie named by `options.cookie` is read first, then `Accept-Language`.',
});

export const localesLocalize = message({
  ja: "pathnameの先頭にロケールの区間を付けます。`'/ui'`は`'/en/ui'`に、`'/'`は`'/en'`になります。",
  en: "Puts a locale segment in front of a pathname. `'/ui'` becomes `'/en/ui'`, and `'/'` becomes `'/en'`.",
});

export const localesDelocalize = message({
  ja: '先頭のロケールの区間を外し、`Delocalized`を返します。',
  en: 'Takes the leading locale segment off and returns a `Delocalized`.',
});

export const localesPaths = message({
  ja: '`/:locale`の区間を持つパターンを、ロケールの数だけ展開する関数。`@k8ordo/framework`では、staticモードの`paths`オプションに渡します。',
  en: 'Expands every pattern with a `/:locale` segment once per locale. In `@k8ordo/framework`, it is what static mode’s `paths` option takes.',
});

export const localesParamsSchema = message({
  ja: '`{ locale }`を検証するStandard Schema。サーバーでは、受け付けたロケールを、検証を呼んだ非同期コンテキストの残りに設定します。',
  en: 'A Standard Schema that validates `{ locale }`. On the server, an accepted locale is set for the rest of the async context that called it.',
});

export const localesGetLocale = message({
  ja: '今のロケール。ブラウザではURLの先頭の区間、サーバーでは`paramsSchema`が受け付けたか`run`に渡したロケールです。どちらも無ければ既定のロケールです。',
  en: 'The current locale: in the browser, the first segment of the URL; on the server, the locale `paramsSchema` accepted or `run` was given. When neither names one, the default.',
});

export const localesRun = message({
  ja: '`fn`をロケールが`locale`の状態で実行し、`fn`の戻り値を返します。`fn`から始まる非同期の処理にも及びます。サーバーでだけ使えます。',
  en: 'Runs `fn` with `locale` as the current locale and returns what `fn` returns. The async work `fn` starts is covered too. Server only.',
});

export const localesFormats = message({
  ja: '今のロケールの`Intl`のオブジェクトを返すメンバー。下の`IntlFormats`を見てください。',
  en: 'The members that return `Intl` objects for the current locale. See `IntlFormats` below.',
});

export const localesCaveats = [
  message({
    ja: 'どのメンバーも`this`を使いません。`export const { getLocale } = locales`のように取り出して使えます。',
    en: 'No member uses `this`, so any of them can be taken out of the set, as in `export const { getLocale } = locales`.',
  }),
  message({
    ja: '`run`をブラウザで呼ぶと、`locales.run: in the browser the URL is the locale — navigate instead`のエラーになります。',
    en: 'Called in a browser, `run` throws `locales.run: in the browser the URL is the locale — navigate instead`.',
  }),
  message({
    ja: '`AsyncLocalStorage`を取り出せない（`process.getBuiltinModule`が無い）サーバーのランタイムでは、`run`とロケールを受け付けるときの`paramsSchema`がエラーになります。エラー文は`this runtime has no AsyncLocalStorage to scope a locale to`を含みます。',
    en: 'On a server runtime that cannot reach `AsyncLocalStorage` (through `process.getBuiltinModule`), `run` throws, and so does `paramsSchema` when it accepts a locale. The message includes `this runtime has no AsyncLocalStorage to scope a locale to`.',
  }),
] as const;

export const intlFormatsSummary = message({
  ja: '集合のうち、今のロケールの`Intl`のオブジェクトを返すメンバーの型です。戻り値の`format`や`select`など、`Intl`のメソッドをそのまま呼べます。',
  en: 'The members of the set that return `Intl` objects for the current locale. What comes back is the `Intl` object itself, so `format`, `select` and the rest are called directly.',
});

export const intlFormatsDateTime = message({
  ja: '今のロケールと、そのロケールの`timeZone`で日時を表示する`Intl.DateTimeFormat`。',
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
    ja: 'ロケールとオプションの組ごとに1つだけ作り、2回目からは同じものを返します。オプションはJSONにして比べます。',
    en: 'One object is made per locale and options, and returned again after that. Options are compared by their JSON.',
  }),
  message({
    ja: 'どれもフックではありません。Server ComponentでもClient Componentでも、文言の関数の中でも呼べます。',
    en: 'None of them is a hook. Each can be called in a Server Component, in a Client Component, and inside a message’s function.',
  }),
] as const;

export const messageSummary = message({
  ja: '1つの文言を、すべてのロケールの文とともに宣言します。返す関数は、呼ばれた場所のロケールの文を返します。',
  en: 'Declares one message with its text in every locale. The function it returns gives the text in the locale where it is called.',
});

export const messageVariants = message({
  ja: 'ロケールごとの文。すべてのロケールを文字列で書くか、すべてを同じ引数の関数で書きます。',
  en: 'The text per locale: a string in every locale, or a function of the same arguments in every locale.',
});

export const messageReturns = message({
  ja: '引数を受け取り、今のロケールの文を返す関数。',
  en: 'A function that takes the arguments and returns the text in the current locale.',
});

export const messageCaveats = [
  message({
    ja: 'ロケールの型が`Register`に登録されていれば、ロケールが欠けた宣言は型エラーになります。型で検出できなかった欠けは、読んだ時点で`message: no text for "en" in ["ja"]`のような`TypeError`になります。',
    en: 'Once `Register` carries the locale type, a declaration missing a locale is a type error. A missing locale the types did not catch throws a `TypeError` such as `message: no text for "en" in ["ja"]` where the message is read.',
  }),
  message({
    ja: 'どこにもロケールが指定されていないときは、既定のロケールの文を返します。集合がまだ定義されていない環境では、既定のロケールの代わりに最初に書いた文を返します。',
    en: 'When nothing names a locale, it returns the default locale’s text. In an environment where no set has been defined yet, it returns the first text written instead.',
  }),
  message({
    ja: '引数の型は、型注釈を書いたロケールの関数から推論されます。どこにも書かないと`unknown`になります。少なくとも1つに書くか、`message<[name: string]>({ … })`のように型引数で渡します。',
    en: 'The argument types are inferred from the locale whose function you annotate. With no annotation anywhere they are `unknown`. Annotate at least one, or pass them as a type argument: `message<[name: string]>({ … })`.',
  }),
  message({
    ja: '宣言に副作用は無いので、どこからも呼ばれない文言はバンドラが取り除きます。',
    en: 'The declaration has no side effect, so a bundler drops a message nothing calls.',
  }),
] as const;

export const messageTypeSummary = message({
  ja: '`message`が返す関数の型です。文言をpropsで受け取るコンポーネントは、この型で受け取ります。',
  en: 'The type of the function `message` returns. A component that takes a message as a prop takes this type.',
});

export const messageTypeCaveats = [
  message({
    ja: '関数なので、Server ComponentからClient Componentへpropsで渡せません。Server Componentで呼び、結果の文字列を渡します。',
    en: 'It is a function, so it cannot be passed as a prop from a Server Component to a Client Component. Call it in the Server Component and pass the string.',
  }),
] as const;

export const parseSummary = message({
  ja: '`Accept-Language`ヘッダーを、`negotiate`に渡せるタグの並びにします。',
  en: 'Turns an `Accept-Language` header into a list of tags for `negotiate`.',
});

export const parseHeader = message({
  ja: "ヘッダーの値。`request.headers.get('accept-language')`をそのまま渡せます。",
  en: "The header’s value. `request.headers.get('accept-language')` can be passed as it is.",
});

export const parseReturns = message({
  ja: '重みの大きい順に並べたタグ。ヘッダーが無いか空白だけなら空の配列。',
  en: 'The tags, highest weight first. An empty array for a missing or blank header.',
});

export const parseCaveats = [
  message({
    ja: '重みが同じタグは、ヘッダーの順を保ちます。重みが0以下のタグと`*`は除きます。',
    en: 'Tags of equal weight keep the header’s order. Tags weighted 0 or less, and `*`, are dropped.',
  }),
  message({
    ja: 'タグそのものは確かめません。BCP 47ではないタグは`negotiate`が読み飛ばします。',
    en: 'The tags themselves are not checked. `negotiate` skips a tag that is not BCP 47.',
  }),
] as const;

export const currentSummary = message({
  ja: '`defineLocales`で定義した集合から、今のロケールを返します。アプリの集合をimportできないライブラリが使います。',
  en: 'Returns the current locale from the set `defineLocales` defined. It is for a library that cannot import the app’s set.',
});

export const currentReturns = message({
  ja: '指定されたロケール。無ければ集合の既定のロケール。集合が定義されていない環境では`null`。',
  en: 'The locale named, or else the set’s default. `null` in an environment where no set has been defined.',
});

export const currentCaveats = [
  message({
    ja: '`@k8ordo/ui`のコンポーネントは、自分が表示する文言のロケールをこれで決めます。',
    en: '`@k8ordo/ui` picks the locale of its built-in text with this.',
  }),
  message({
    ja: 'アプリのコードでは、集合の型が付く`locales.getLocale()`を使います。',
    en: 'App code uses `locales.getLocale()`, which is typed by the set.',
  }),
] as const;

export const registerSummary = message({
  ja: 'アプリのロケールの型をパッケージに伝える宣言です。アプリで1回だけ手で書きます。`@k8ordo/framework`のアプリでは、`src/i18n.ts`がexportする`locales`から生成されます。',
  en: 'The declaration that tells the package the app’s locale type. Write it once per app by hand; in an `@k8ordo/framework` app it is generated from the `locales` that `src/i18n.ts` exports.',
});

export const registerCaveats = [
  message({
    ja: 'マージするための型なので、`type`でなく`interface`で書きます。',
    en: 'It exists to be merged, so it is an `interface`, not a `type`.',
  }),
  message({
    ja: 'ロケールの型が`Register`に登録されるまでは、`RegisteredLocale`が`string`なので、ロケールの欠けは型エラーになりません。',
    en: 'Until `Register` carries the locale type, `RegisteredLocale` is `string`, and a missing locale is not a type error.',
  }),
] as const;

export const registeredLocaleSummary = message({
  ja: '`Register`に登録されたロケールの和集合です。',
  en: 'The union of the locales in `Register`.',
});

export const variantsSummary = message({
  ja: '`Register`に登録されたロケールごとに1つずつ値を持つオブジェクトの型です。`message`が受け取るのもこの型です。',
  en: 'An object with one value per locale in `Register`. It is also what `message` takes.',
});

export const variantsCaveats = [
  message({
    ja: '文言以外にも使えます。言語の切り替えに並べる言語名のように、ロケールごとに漏れなく持たせたい値に向きます。',
    en: 'It fits more than messages: any value every locale must have, such as the names a language switcher lists.',
  }),
] as const;

export const localeOfSummary = message({
  ja: '集合のタグの和集合を取り出します。`Register`の`locale`もこの型です。',
  en: 'The union of a set’s tags. It is also what `Register`’s `locale` is set to.',
});

export const localeDefinitionSummary = message({
  ja: 'ロケールごとに書く情報の型です。どちらも実行環境からは導かず、アプリが書きます。',
  en: 'What the app states for each locale. Neither value is derived from the runtime.',
});

export const localeDefinitionTimeZone = message({
  ja: 'そのロケールの日付を表示するIANAのタイムゾーン。サーバーでもブラウザでも同じタイムゾーンで表示するので、日付がずれません。',
  en: 'The IANA time zone the locale’s dates are shown in. The server and every browser use the same one, so a date reads the same on both.',
});

export const localeDefinitionDir = message({
  ja: 'そのロケールの文字の向き。`<html dir>`に使います。',
  en: 'The direction the locale’s text runs in, for `<html dir>`.',
});

export const localesOptionsSummary = message({
  ja: '`defineLocales`の2つ目の引数の型です。',
  en: 'The type of `defineLocales`’ second argument.',
});

export const localesOptionsDefault = message({
  ja: '既定のロケール。一覧のタグから選びます。省くと先頭に書いたロケールです。',
  en: 'The default locale. It must be one of the list. Without it, the first locale written.',
});

export const negotiateOptionsSummary = message({
  ja: '`negotiateRequest`の2つ目の引数の型です。',
  en: 'The type of `negotiateRequest`’s second argument.',
});

export const negotiateOptionsCookie = message({
  ja: '訪問者が選んだ言語を持つCookieの名前。省くと`Accept-Language`だけを読みます。',
  en: 'The name of the cookie holding the visitor’s choice. Without it, only `Accept-Language` is read.',
});

export const delocalizedSummary = message({
  ja: '`delocalize`が返す値の型です。',
  en: 'The type of what `delocalize` returns.',
});

export const delocalizedLocale = message({
  ja: '先頭の区間が示すロケール。先頭の区間がロケールでなければ`null`。',
  en: 'The locale the first segment names, or `null` when it names none.',
});

export const delocalizedPathname = message({
  ja: '区間を外した残りのpathname。ロケールの区間しか無いときは`/`です。',
  en: 'The pathname with the segment taken off. `/` when there was nothing else.',
});

export const paramsSchemaSummary = message({
  ja: '`paramsSchema`の型です。Standard Schemaの形をこのパッケージ自身が宣言しているので、スキーマのライブラリは要りません。',
  en: 'The type of `paramsSchema`. The package declares the Standard Schema shape itself, so no schema library is needed.',
});

export const paramsSchemaCaveats = [
  message({
    ja: "検証は同期的です。一覧に無いロケールには、`path: ['locale']`のissueを返します。",
    en: "Validation is synchronous. A locale outside the list gets an issue at `path: ['locale']`.",
  }),
  message({
    ja: '受け付けた値は`{ locale }`だけで、ほかのキーは含みません。',
    en: 'The accepted value is `{ locale }` alone; other keys are left out.',
  }),
] as const;

export const dateTimeOptionsSummary = message({
  ja: '`dateTimeFormat`のオプションの型です。`Intl.DateTimeFormatOptions`から`timeZone`だけを除いた型です。',
  en: 'The options of `dateTimeFormat`: `Intl.DateTimeFormatOptions` without `timeZone`.',
});

export const dateTimeOptionsCaveats = [
  message({
    ja: '`as`で`timeZone`を通しても、ロケールの`timeZone`で上書きします。',
    en: 'A `timeZone` forced through with `as` is overridden by the locale’s.',
  }),
] as const;
