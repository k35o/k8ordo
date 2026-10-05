import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'リンクのパスは文字列なので、書き間違えてもそのままでは気づけません。このページでは、パターンやparamの誤りを型エラーにする方法と、その検査を自分のコードや`@k8ordo/state`で使う方法を説明します。',
  en: 'A link’s path is a string, so a typo goes unnoticed on its own. This page covers turning a wrong pattern or param into a type error, and using the same check in your own code and in `@k8ordo/state`.',
});

export const paramsTitle = message({
  ja: 'paramは設定なしで確かめられる',
  en: 'Params are checked with no setup',
});

export const paramsDescription = message({
  ja: '`href`や`navigateTo`、`useParams`は、渡したパターンの文字列からparamの型を作ります。そのため、何も設定しなくても、paramの渡し忘れや名前の書き間違いは型エラーになります。',
  en: '`href`, `navigateTo` and `useParams` derive the params’ type from the pattern string they are given. With no setup at all, a missing param or a misspelled one is a type error.',
});

export const paramsMissing = message({
  ja: 'idが無いので型エラーになる',
  en: 'No id: a type error',
});

export const paramsMisspelled = message({
  ja: 'productIdはパターンに無いので型エラーになる',
  en: 'productId is not in the pattern: a type error',
});

export const registerTitle = message({
  ja: 'パターンをルート表と照らし合わせる',
  en: 'Check patterns against the route table',
});

export const registerDescription = message({
  ja: 'paramとは違って、パターンそのものの書き間違いは、何も設定しないと通ってしまいます。ルート表を`Register`に登録すると、表に無いパターンも型エラーになります。',
  en: 'Unlike a param, a typo in the pattern itself passes with no setup. Register the route table on `Register`, and a pattern the table lacks is a type error too.',
});

export const registerTypo = message({
  ja: '表に無いパターンなので型エラーになる',
  en: 'Not a pattern in the table: a type error',
});

export const registerEffect = message({
  ja: '登録の前は、`/`で始まる文字列ならどれでも通ります。登録したあとは、`href`と`navigateTo`はリンク先にできるパターンだけを、`useParams`は表のパターンだけを受け付けます。`useMatch`と`matchPath`は、表のパターンと、その後ろに`/*`を付けたものを受け付けます。',
  en: 'Before registering, any string starting with `/` passes. After it, `href` and `navigateTo` accept only the patterns a link can point at, and `useParams` only the table’s patterns. `useMatch` and `matchPath` accept the table’s patterns, and those followed by `/*`.',
});

export const registerOnce = message({
  ja: '登録はアプリの中で1度だけ行います。ライブラリで登録すると、そのライブラリを使うすべてのアプリに、自分のルート表を押し付けることになるからです。',
  en: 'Register once, in the app. A library that registered would impose its route table on every app that uses it.',
});

export const registerFramework = message({
  ja: '`@k8ordo/static`と`@k8ordo/server`では、この登録が`.k8ordo/register.gen.ts`に生成されます。自分で書くと同じ登録が2つになるので、書かないでください。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server`, this registration is generated into `.k8ordo/register.gen.ts`. Writing it by hand makes two of the same, so leave it out.',
});

export const typesTitle = message({
  ja: '自分のコードでパターンの型を使う',
  en: 'Use the pattern types in your own code',
});

export const typesDescription = message({
  ja: 'ルート表から作った型は、自分のコードでも使えます。たとえば、ナビゲーションに並べる行き先を、表にあるページに限りたいときです。',
  en: 'The types derived from the route table are yours to use too, for example to limit the destinations a navigation lists to pages the table has.',
});

export const typesSite = message({
  ja: 'これはこのサイトの`SitePath`です。リンク先にできるパターンのうち、`/:locale`で始まり、ロケールのほかにparamを持たないものに絞っています。ナビゲーションのデータに表に無いページを書くと、型エラーになります。',
  en: 'This is this site’s `SitePath`: the linkable patterns that start with `/:locale` and have no param besides the locale. Naming a page the table lacks in the navigation data is a type error.',
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
  en: '`RegisteredNavigablePattern`: the patterns a link can point at, which leaves out those with `/*`',
});

export const typesParams = message({
  ja: '`RegisteredParams<P>`：パターン`P`へのリンクが受け取るparams',
  en: '`RegisteredParams<P>`: the params a link to pattern `P` takes',
});

export const typesPageParams = message({
  ja: '`RegisteredPageParams<P>`：パターン`P`のページが受け取るparams',
  en: '`RegisteredPageParams<P>`: the params the page at pattern `P` receives',
});

export const typesBefore = message({
  ja: '登録の前は、はじめの2つは`/`で始まる任意の文字列になります。',
  en: 'Before registering, the first two are any string starting with `/`.',
});

export const typesSchema = message({
  ja: 'フレームワークの下で`paramsSchema`を書いたページでは、リンクもページも、paramをスキーマが作った型で扱います。詳しくは「フレームワークの下で使う」で説明します。',
  en: 'Under the framework, a page with a `paramsSchema` has its params typed by the schema, for its links as much as for the page; see “Use it under the framework”.',
});

export const stateTitle = message({
  ja: '`@k8ordo/state`のリンクも同じ表で確かめる',
  en: 'Check `@k8ordo/state`’s links against the same table',
});

export const stateDescription = message({
  ja: '`@k8ordo/state`の`Register`にも、同じ1行を書けます。こうすると、`@k8ordo/state`の`href`に渡すパスも、このルーターと同じルート表で確かめられます。',
  en: '`@k8ordo/state`’s `Register` takes the same line. With it, the paths handed to `@k8ordo/state`’s `href` are checked against the same route table this router matches against.',
});

export const stateNoMatch = message({
  ja: '表のどのパターンにも合わないので型エラーになる',
  en: 'No pattern in the table matches: a type error',
});

export const statePath = message({
  ja: '`@k8ordo/state`の`href`が受け取るのは、パターンではなく実際のパスです。`/products/42`のように、paramの位置にも値を書きます。このパスがどれかのパターンに合うかを、区間ごとに確かめています。',
  en: '`@k8ordo/state`’s `href` takes an actual path rather than a pattern, with values where the params go, as in `/products/42`. Whether it fits any pattern is checked segment by segment.',
});

export const navigablePathTitle = message({
  ja: 'パスを受け取る型を自分で書く',
  en: 'Type your own path-taking API',
});

export const navigablePathDescription = message({
  ja: '`@k8ordo/state`が使っている検査は、`NavigablePath`という型です。ほかにパスを受け取るものがあれば、同じ型で確かめられます。',
  en: 'The check `@k8ordo/state` uses is a type called `NavigablePath`. Anything else that takes a path can use the same type.',
});

export const navigablePathRule = message({
  ja: '`NavigablePath`は、パスがリンク先にできるパターンのどれかに合えばそのパスを、どれにも合わなければ`never`を返します。`:id`のようなparamの位置には、空でない1区間ならどれでも入ります。',
  en: '`NavigablePath` gives back the path when it fits one of the linkable patterns, and `never` when none fits. Where a pattern has a param such as `:id`, any one non-empty segment fits.',
});

export const navigablePathSlash = message({
  ja: '末尾にスラッシュのあるパスは受け付けません。照合では`/products/`も`/products`と同じページになりますが、リンクに書くパスは1通りの書き方にそろえるためです。',
  en: 'A path with a trailing slash is refused. Matching treats `/products/` as `/products`, but a path written into a link is kept to one spelling.',
});

export const navigablePathWhy = message({
  ja: `表のすべてのパスを並べた型を作って比べないのは、\`/:locale\`のようなページがあると、その型が\`/\${string}\`になってしまうからです。\`/\${string}\`は、どんなパスでも受け付けてしまいます。`,
  en: `It does not build a type listing every path in the table to compare against, because a page such as \`/:locale\` would turn that type into \`/\${string}\`, which takes every path there is.`,
});
