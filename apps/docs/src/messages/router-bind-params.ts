import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ロケールやテナントのように、アプリのほとんどのパスの先頭に付く区間があります。すべてのリンクでその値を渡すのは手間なので、`bindParams`で1か所にまとめます。',
  en: 'Some segments sit at the front of nearly every path in an app, such as a locale or a tenant. Passing that value to every link is tedious, so gather it in one place with `bindParams`.',
});

export const bindTitle = message({
  ja: '値を返す関数を渡す',
  en: 'Hand over a function that returns the value',
});

export const bindDescription = message({
  ja: '`bindParams`には、束ねるparamを返す関数を渡します。返ってくる`href`と`navigateTo`は、呼ばれるたびにその関数を呼び、足りないparamを補います。',
  en: '`bindParams` takes a function that returns the params to bind. The `href` and `navigateTo` it gives back call that function every time they are called, and fill in the params it supplies.',
});

export const bindSite = message({
  ja: 'このサイトの`src/links.ts`も、この書き方です。`locales.getLocale()`は`@k8ordo/i18n`の関数で、いまのロケールを返します。',
  en: 'This site’s own `src/links.ts` is written exactly this way. `locales.getLocale()` comes from `@k8ordo/i18n` and returns the current locale.',
});

export const bindImport = message({
  ja: 'アプリのコードは、`@k8ordo/router`ではなくこのモジュールから`href`と`navigateTo`をimportします。',
  en: 'The app’s code then imports `href` and `navigateTo` from this module rather than from `@k8ordo/router`.',
});

export const usageTitle = message({
  ja: '束ねたリンクを使う',
  en: 'Use the bound links',
});

export const usageDescription = message({
  ja: 'パターンは`/:locale/…`と書いたままにします。束ねた`locale`は省けるので、渡すのはそれ以外のparamだけです。コメントの結果は、いまのロケールが`ja`のときのものです。',
  en: 'Patterns keep their full `/:locale/…` spelling. The bound `locale` may be left out, so only the other params are passed. The results in the comments are for a current locale of `ja`.',
});

export const usageOverride = message({
  ja: '束ねたparamも、渡せば上書きできます。言語の切り替えのように、別のロケールのページを指すリンクで使います。',
  en: 'A bound param can still be passed to override it, for a link to another locale’s page, as a language switcher needs.',
});

export const usageTypes = message({
  ja: 'パターンの綴りを変えないので、`Register`による検査もそのまま効きます。表に無いパターンや、束ねていないparamの渡し忘れは、これまでどおり型エラーになります。',
  en: 'Since the patterns are spelled as before, the `Register` check still applies: a pattern the table lacks, or a missing param that is not bound, is a type error as usual.',
});

export const sourceTitle = message({
  ja: '関数は呼ぶたびに読まれる',
  en: 'The function is read on every call',
});

export const sourceDescription = message({
  ja: '束ねる関数が呼ばれるのは、`bindParams`を呼んだときの1度だけではありません。`href`や`navigateTo`が呼ばれるたびに呼ばれます。',
  en: 'The binding function does not run once, when `bindParams` is called. It runs every time `href` or `navigateTo` does.',
});

export const sourceCurrent = message({
  ja: 'そのため、リクエストやURLによって変わる値でも、リンクを作るその時点の値が入ります。モジュールのトップレベルで1度だけ`bindParams`を呼んでおけば十分です。',
  en: 'A value that differs per request or per URL is therefore read where the link is built, and calling `bindParams` once at the top level of a module is enough.',
});

export const sourceAgnostic = message({
  ja: 'どのパッケージが値を返すかは、アプリが決めることです。ルーターが知っているのはparamの名前だけで、ロケールが何かは知りません。',
  en: 'Which package supplies the value is the app’s business. The router knows a param’s name and nothing more; it has no idea what a locale is.',
});

export const optionsTitle = message({
  ja: 'オプションは3つ目の引数に渡す',
  en: 'Options go third',
});

export const optionsDescription = message({
  ja: 'すべてのparamを束ねたパターンでも、`navigateTo`のオプションは3つ目の引数です。2つ目には、paramsの代わりに`undefined`を渡します。',
  en: 'Even for a pattern whose params are all bound, `navigateTo`’s options are the third argument. Pass `undefined` second, in place of the params.',
});

export const optionsWhy = message({
  ja: 'paramsもオプションもただのオブジェクトなので、2つ目の引数がどちらなのかは、パターンにparamがあるかどうかで決めています。パターンにparamがあれば、2つ目はいつもparamsです。',
  en: 'Params and options are both plain objects, so whether the pattern names a param is what decides which the second argument is. When it does, the second argument is always the params.',
});

export const optionsSecond = message({
  ja: 'オプションを2つ目に書くと型エラーになる',
  en: 'Options in second place: a type error',
});

export const optionsPitfall = message({
  ja: '型の検査をすり抜けてオプションを2つ目に渡すと、paramsとして読まれます。`history`は無視され、履歴には新しいエントリが積まれます。',
  en: 'Passed second around the type check, the options are read as params: `history` is ignored, and a new history entry is pushed.',
});
