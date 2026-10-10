import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'リンクのパターンやparamの書き間違いを、型エラーにできるようになります。ルート表から作った型は、自分のコードでも使えます。',
  en: 'Turn a misspelled pattern or param in a link into a type error. You can also use the types derived from the route table in your own code.',
});

export const paramsTitle = message({
  ja: 'paramの検査',
  en: 'Param checks',
});

export const paramsMissing = message({
  ja: 'idが無いので型エラーになる',
  en: 'No id: a type error',
});

export const paramsMisspelled = message({
  ja: 'productIdはパターンに無いので型エラーになる',
  en: 'productId is not in the pattern: a type error',
});

export const paramsInferred = message({
  ja: '`href`と`navigateTo`、`useParams`は、渡したパターンの文字列からparamの型を作ります。何も設定しなくても、paramの渡し忘れや名前の書き間違いは型エラーになります。',
  en: '`href`, `navigateTo` and `useParams` derive the type of the params from the pattern string they are given. With no setup at all, a missing or misspelled param is a type error.',
});

export const registerTitle = message({
  ja: 'ルート表の登録',
  en: 'Registering the route table',
});

export const registerTypo = message({
  ja: '表に無いパターンなので型エラーになる',
  en: 'Not a pattern in the table: a type error',
});

export const registerWhy = message({
  ja: '何も設定しないと、`/`で始まる文字列ならどのパターンも通ります。ルート表を`Register`に登録すると、表に無いパターンも型エラーになります。',
  en: 'With no setup, any pattern starting with `/` passes, typos included. Add the route table to the `Register` interface, and a pattern missing from the table becomes a type error too.',
});

export const registerEffect = message({
  ja: '登録したあとに受け付けるパターンは、次のとおりです。',
  en: 'After registering, each API accepts these patterns:',
});

export const registerEffectLink = message({
  ja: '`href`、`navigateTo`：リンク先にできるパターン',
  en: '`href`, `navigateTo`: the patterns a link can point at',
});

export const registerEffectParams = message({
  ja: '`useParams`：表のパターン',
  en: '`useParams`: the patterns of the table',
});

export const registerEffectMatch = message({
  ja: '`useMatch`、`matchPath`：表のパターンと、その後ろに`/*`を付けたもの',
  en: '`useMatch`, `matchPath`: the patterns of the table, and those followed by `/*`',
});

export const registerOnce = message({
  ja: '登録はアプリの中で1度だけ行います。ライブラリで登録すると、そのライブラリを使うすべてのアプリがその表で検査されてしまいます。',
  en: 'Register once, in the application. A library that registered would have every application that uses it checked against its table.',
});

export const registerFrameworkBefore = message({
  ja: '`@k8ordo/framework`では、この登録が`.k8ordo/register.gen.ts`に生成されます。自分では書きません。生成されるファイルは',
  en: 'Under `@k8ordo/framework`, this registration is generated into `.k8ordo/register.gen.ts`. Do not write it yourself. See ',
});

export const registerFrameworkAfter = message({
  ja: 'を見てください。',
  en: ' for the generated files.',
});

export const typesTitle = message({
  ja: 'ルート表から作る型',
  en: 'Types derived from the table',
});

export const typesSite = message({
  ja: '上の`SitePath`は、このサイトで使っている型です。リンク先にできるパターンのうち、`/:locale`で始まり、ロケールのほかにparamを持たないものに絞っています。ナビゲーションのデータに書いたページが表に無ければ、型エラーになります。',
  en: 'The `SitePath` above is the one this site uses: the patterns a link can point at that start with `/:locale` and have no param besides the locale. If the navigation data names a page missing from the table, it is a type error.',
});

export const typesList = message({
  ja: '登録した表から作られる型は、次の4つです。',
  en: 'Four types are derived from the registered table.',
});

export const typesPattern = message({
  ja: '`RegisteredPattern`：表のすべてのページのパターン（`/*`のパターンも含む）',
  en: '`RegisteredPattern`: the pattern of every page in the table, `/*` patterns included',
});

export const typesNavigable = message({
  ja: '`RegisteredNavigablePattern`：リンク先にできるパターン（`/*`を含むものを除く）',
  en: '`RegisteredNavigablePattern`: the patterns a link can point at, without those containing `/*`',
});

export const typesParams = message({
  ja: '`RegisteredParams<P>`：パターン`P`へのリンクが受け取るparamの型',
  en: '`RegisteredParams<P>`: the type of the params a link to pattern `P` takes',
});

export const typesPageParams = message({
  ja: '`RegisteredPageParams<P>`：パターン`P`のページが受け取るparamの型',
  en: '`RegisteredPageParams<P>`: the type of the params the page at pattern `P` receives',
});

export const typesBefore = message({
  ja: '登録の前は、はじめの2つは`/`で始まる任意の文字列になります。',
  en: 'Before registering, the first two are any string starting with `/`.',
});

export const typesSchemaBefore = message({
  ja: '`@k8ordo/framework`では、`paramsSchema`を書いたページへのリンクとそのページは、paramをスキーマが作った型で扱います。詳しくは',
  en: 'Under `@k8ordo/framework`, links to a page with a `paramsSchema`, and the page itself, take its params as the type the schema produces. See ',
});

export const typesSchemaAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const stateRegisterBefore = message({
  ja: '`@k8ordo/state`の`Register`にも同じ`routes: typeof routes`を書くと、その`href`に渡すパスがこのルート表で検査されます。書き方は`@k8ordo/state`の',
  en: 'Write the same `routes: typeof routes` on `Register` of `@k8ordo/state`, and the paths handed to its `href` are checked against this route table. See ',
});

export const stateRegisterAfter = message({
  ja: 'を見てください。',
  en: ' of `@k8ordo/state`.',
});

export const navigablePathTitle = message({
  ja: '`NavigablePath`',
  en: '`NavigablePath`',
});

export const navigablePathRule = message({
  ja: '`NavigablePath<typeof routes, Path>`は、パスがリンク先にできるパターンのどれかに合えばそのパスを返し、どれにも合わなければ`never`を返します。`:id`のようなparamの位置には、空でない1区間ならどれでも入ります。',
  en: '`NavigablePath<typeof routes, Path>` gives back the path when one of the patterns a link can point at matches it, and `never` when none does. Where a pattern has a param such as `:id`, any one non-empty segment fits.',
});

export const navigablePathSlash = message({
  ja: '末尾にスラッシュのあるパスは受け付けません。照合では`/products/`も`/products`と同じページになりますが、リンクに書くパスは1通りの書き方にそろえます。',
  en: 'A path with a trailing slash is refused. Matching treats `/products/` as `/products`, but a link spells each path one way only.',
});
