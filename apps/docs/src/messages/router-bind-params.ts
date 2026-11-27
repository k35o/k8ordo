import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ロケールやテナントのように、ほとんどのパスの先頭に付くparamを`bindParams`で1か所にまとめます。リンクのたびに同じ値を渡さずに済みます。',
  en: 'A param that sits at the front of nearly every path, such as a locale or a tenant, is bound once with `bindParams`. No link has to pass the same value again.',
});

export const bindTitle = message({
  ja: '束ねる関数',
  en: 'The binding function',
});

export const bindTakes = message({
  ja: '`bindParams`には、束ねるparamを返す関数を渡します。返ってくるのは`href`そのもので、渡されなかったparamをこの関数の値で埋めます。',
  en: '`bindParams` takes a function that returns the params to bind, and returns an `href` that fills any param the call leaves out with that function’s value.',
});

export const bindImport = message({
  ja: 'アプリのコードでは、`href`をいつもこのモジュールからimportします。`@k8ordo/router`の`href`も同じ名前で型も通るので、取り違えないようにします。コードからページを移るときも、このモジュールの`href`で作ったURLを`navigation.navigate()`に渡します。',
  en: 'The app always imports `href` from this module. `@k8ordo/router`’s own `href` has the same name and type-checks too, so do not reach for it by mistake. A page change from code hands a URL from this module’s `href` to `navigation.navigate()`.',
});

export const usageTitle = message({
  ja: '束ねたリンク',
  en: 'Bound links',
});

export const usageOverrideCallout = message({
  ja: '束ねた`locale`を渡して上書きする',
  en: 'Pass the bound `locale` to override it',
});

export const usagePattern = message({
  ja: 'パターンは`/:locale/…`と書いたままにします。束ねた`locale`は省けるので、渡すのはそれ以外のparamだけです。コメントの結果は、今のロケールを`ja`として書いています。',
  en: 'Patterns keep their full `/:locale/…` spelling. The bound `locale` can be left out, so only the other params are passed. The results in the comments are for a current locale of `ja`.',
});

export const usageOverride = message({
  ja: '言語の切り替えのように別のロケールのページを指すリンクでは、束ねたparamを渡して上書きします。',
  en: 'A link to a page in another locale, such as a language switcher, passes the bound param to override it.',
});

export const usageTypes = message({
  ja: 'パターンを書き換えないので、`Register`による型の検査はそのまま効きます。表に無いパターンや、束ねていないparamの渡し忘れは型エラーになります。',
  en: 'Since the patterns are spelled as before, the `Register` check still applies. A pattern the table lacks, or a missing param that is not bound, is a type error.',
});

export const localeTitle = message({
  ja: 'ロケールのparam',
  en: 'The locale param',
});

export const localeSource = message({
  ja: '`locales.getLocale()`は`@k8ordo/i18n`の関数です。返すロケールについては',
  en: '`locales.getLocale()` comes from `@k8ordo/i18n`. The locale it returns is described on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const localeMatch = message({
  ja: '`useMatch`も、`/:locale/docs/*`のようにロケールを含むパターンのまま呼べます。ロケールは`:locale`のparamとして一致するので、どの言語のページでも同じように一致します。',
  en: '`useMatch` also takes a pattern with the locale still in it, such as `/:locale/docs/*`. The locale matches as the `:locale` param, so it matches on every language’s page alike.',
});

export const sourceTitle = message({
  ja: '関数を呼ぶ時点',
  en: 'When the function runs',
});

export const sourceEachCall = message({
  ja: '束ねる関数は、`href`を呼ぶたびに呼ばれます。リクエストやURLで変わる値でも、リンクを作る時点の値が入ります。',
  en: 'The binding function runs every time `href` is called. A value that differs per request or per URL is taken at the moment the link is built.',
});

export const sourceOnce = message({
  ja: '`bindParams`は、モジュールのトップレベルで1度呼べば十分です。',
  en: 'Calling `bindParams` once at the top level of a module is enough.',
});

export const sourceAgnostic = message({
  ja: 'どのパッケージが値を返すかはアプリが決めます。ルーターが知っているのはparamの名前だけです。',
  en: 'Which package supplies the value is up to the app. The router knows only the param’s name.',
});
